// Optimized GPS tracking system for low-bandwidth areas

interface GPSCoordinate {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  speed?: number
  heading?: number
}

interface TrainPosition {
  trainNumber: string
  position: GPSCoordinate
  contributorCount: number
  lastUpdated: number
  confidence: number
}

interface GPSOptions {
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
  minAccuracy: number
  updateInterval: number
  batchSize: number
}

class OptimizedGPSTracker {
  private trainNumber: string
  private options: GPSOptions
  private watchId: number | null = null
  private lastPosition: GPSCoordinate | null = null
  private positionBuffer: GPSCoordinate[] = []
  private isOnline: boolean = navigator.onLine
  private offlineQueue: GPSCoordinate[] = []
  private compressionEnabled = true

  constructor(trainNumber: string, options: Partial<GPSOptions> = {}) {
    this.trainNumber = trainNumber
    this.options = {
      enableHighAccuracy: false, // Disabled for battery optimization
      timeout: 15000, // 15 seconds timeout
      maximumAge: 30000, // Accept 30-second old positions
      minAccuracy: 100, // Minimum 100m accuracy
      updateInterval: 30000, // Update every 30 seconds
      batchSize: 5, // Send 5 positions at once
      ...options,
    }

    this.setupNetworkListeners()
    this.loadFromLocalStorage()
  }

  private setupNetworkListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.processOfflineQueue()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  // Start GPS tracking with optimizations
  public startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      // Check permissions first
      if ("permissions" in navigator) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "denied") {
            reject(new Error("Geolocation permission denied"))
            return
          }
        })
      }

      const watchOptions: PositionOptions = {
        enableHighAccuracy: this.options.enableHighAccuracy,
        timeout: this.options.timeout,
        maximumAge: this.options.maximumAge,
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handlePositionUpdate(position),
        (error) => this.handlePositionError(error),
        watchOptions,
      )

      resolve()
    })
  }

  // Stop GPS tracking
  public stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }

    // Send any remaining buffered positions
    if (this.positionBuffer.length > 0) {
      this.sendPositionBatch([...this.positionBuffer])
      this.positionBuffer = []
    }
  }

  private handlePositionUpdate(position: GeolocationPosition): void {
    const coordinate: GPSCoordinate = {
      latitude: this.roundCoordinate(position.coords.latitude),
      longitude: this.roundCoordinate(position.coords.longitude),
      accuracy: Math.round(position.coords.accuracy),
      timestamp: Date.now(),
      speed: position.coords.speed ? Math.round(position.coords.speed * 3.6) : undefined, // Convert to km/h
      heading: position.coords.heading ? Math.round(position.coords.heading) : undefined,
    }

    // Filter out inaccurate positions
    if (coordinate.accuracy > this.options.minAccuracy) {
      console.log(`Position rejected: accuracy ${coordinate.accuracy}m > ${this.options.minAccuracy}m`)
      return
    }

    // Filter out duplicate/similar positions
    if (this.isDuplicatePosition(coordinate)) {
      return
    }

    this.lastPosition = coordinate
    this.positionBuffer.push(coordinate)

    // Send batch when buffer is full or after timeout
    if (this.positionBuffer.length >= this.options.batchSize) {
      this.sendPositionBatch([...this.positionBuffer])
      this.positionBuffer = []
    } else {
      // Set timeout to send remaining positions
      setTimeout(() => {
        if (this.positionBuffer.length > 0) {
          this.sendPositionBatch([...this.positionBuffer])
          this.positionBuffer = []
        }
      }, this.options.updateInterval)
    }
  }

  private handlePositionError(error: GeolocationPositionError): void {
    console.error("GPS Error:", error.message)

    // Implement exponential backoff for retries
    const retryDelay = Math.min(1000 * Math.pow(2, this.getRetryCount()), 30000)

    setTimeout(() => {
      if (this.watchId !== null) {
        // Restart tracking with reduced accuracy requirements
        this.options.enableHighAccuracy = false
        this.options.timeout = Math.min(this.options.timeout * 1.5, 30000)
      }
    }, retryDelay)
  }

  private isDuplicatePosition(newPos: GPSCoordinate): boolean {
    if (!this.lastPosition) return false

    const distance = this.calculateDistance(
      this.lastPosition.latitude,
      this.lastPosition.longitude,
      newPos.latitude,
      newPos.longitude,
    )

    const timeDiff = newPos.timestamp - this.lastPosition.timestamp

    // Skip if moved less than 10m in less than 10 seconds
    return distance < 0.01 && timeDiff < 10000
  }

  private async sendPositionBatch(positions: GPSCoordinate[]): Promise<void> {
    if (!this.isOnline) {
      this.offlineQueue.push(...positions)
      this.saveToLocalStorage()
      return
    }

    try {
      const compressedData = this.compressionEnabled ? this.compressPositionData(positions) : positions

      const payload = {
        trainNumber: this.trainNumber,
        positions: compressedData,
        timestamp: Date.now(),
        deviceId: this.getDeviceId(),
        compressed: this.compressionEnabled,
      }

      // Use fetch with timeout and retry logic
      await this.sendWithRetry("/api/gps/submit", payload)
    } catch (error) {
      console.error("Failed to send GPS data:", error)
      this.offlineQueue.push(...positions)
      this.saveToLocalStorage()
    }
  }

  private async sendWithRetry(url: string, data: any, maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Compression": this.compressionEnabled ? "gzip" : "none",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return // Success
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  private compressPositionData(positions: GPSCoordinate[]): any {
    // Simple compression: remove redundant data and round coordinates
    return positions.map((pos) => ({
      lat: pos.latitude,
      lng: pos.longitude,
      acc: pos.accuracy,
      ts: pos.timestamp,
      ...(pos.speed && { spd: pos.speed }),
      ...(pos.heading && { hdg: pos.heading }),
    }))
  }

  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return

    const queueCopy = [...this.offlineQueue]
    this.offlineQueue = []

    try {
      await this.sendPositionBatch(queueCopy)
      this.clearLocalStorage()
    } catch (error) {
      // Put back in queue if failed
      this.offlineQueue.unshift(...queueCopy)
    }
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        trainNumber: this.trainNumber,
        queue: this.offlineQueue.slice(-50), // Keep only last 50 positions
        timestamp: Date.now(),
      }
      localStorage.setItem("gps_offline_queue", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem("gps_offline_queue")
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem("gps_offline_queue")
      if (stored) {
        const data = JSON.parse(stored)
        if (data.trainNumber === this.trainNumber) {
          this.offlineQueue = data.queue || []
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  }

  private roundCoordinate(coord: number): number {
    // Round to ~11m precision (5 decimal places)
    return Math.round(coord * 100000) / 100000
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private getDeviceId(): string {
    // Generate anonymous device ID
    let deviceId = localStorage.getItem("device_id")
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
      localStorage.setItem("device_id", deviceId)
    }
    return deviceId
  }

  private getRetryCount(): number {
    const key = `retry_count_${this.trainNumber}`
    const count = Number.parseInt(localStorage.getItem(key) || "0")
    localStorage.setItem(key, (count + 1).toString())
    return count
  }

  // Public method to get current position
  public getCurrentPosition(): GPSCoordinate | null {
    return this.lastPosition
  }

  // Public method to check tracking status
  public isTracking(): boolean {
    return this.watchId !== null
  }
}

// Train position calculator
class TrainPositionCalculator {
  private static readonly POSITION_WEIGHT_THRESHOLD = 0.1 // 100m
  private static readonly MAX_AGE_MS = 300000 // 5 minutes
  private static readonly MIN_CONTRIBUTORS = 2

  public static calculateTrainPosition(coordinates: GPSCoordinate[]): TrainPosition | null {
    if (coordinates.length === 0) return null

    // Filter recent and accurate positions
    const now = Date.now()
    const validPositions = coordinates.filter(
      (coord) => now - coord.timestamp < this.MAX_AGE_MS && coord.accuracy <= 100,
    )

    if (validPositions.length < this.MIN_CONTRIBUTORS) {
      return null
    }

    // Remove outliers using statistical methods
    const filteredPositions = this.removeOutliers(validPositions)

    if (filteredPositions.length === 0) return null

    // Calculate weighted average
    const weightedPosition = this.calculateWeightedAverage(filteredPositions)

    // Calculate confidence based on contributor count and accuracy
    const confidence = this.calculateConfidence(filteredPositions)

    return {
      trainNumber: "", // Will be set by caller
      position: weightedPosition,
      contributorCount: filteredPositions.length,
      lastUpdated: now,
      confidence,
    }
  }

  private static removeOutliers(positions: GPSCoordinate[]): GPSCoordinate[] {
    if (positions.length <= 3) return positions

    // Calculate median position
    const latitudes = positions.map((p) => p.latitude).sort((a, b) => a - b)
    const longitudes = positions.map((p) => p.longitude).sort((a, b) => a - b)

    const medianLat = latitudes[Math.floor(latitudes.length / 2)]
    const medianLng = longitudes[Math.floor(longitudes.length / 2)]

    // Remove positions too far from median (> 500m)
    return positions.filter((pos) => {
      const distance = this.calculateDistance(medianLat, medianLng, pos.latitude, pos.longitude)
      return distance < 0.5 // 500m threshold
    })
  }

  private static calculateWeightedAverage(positions: GPSCoordinate[]): GPSCoordinate {
    let totalWeight = 0
    let weightedLat = 0
    let weightedLng = 0
    let totalSpeed = 0
    let totalHeading = 0
    let speedCount = 0
    let headingCount = 0

    positions.forEach((pos) => {
      // Weight based on accuracy (better accuracy = higher weight)
      const weight = 1 / (pos.accuracy || 100)
      totalWeight += weight

      weightedLat += pos.latitude * weight
      weightedLng += pos.longitude * weight

      if (pos.speed !== undefined) {
        totalSpeed += pos.speed
        speedCount++
      }

      if (pos.heading !== undefined) {
        totalHeading += pos.heading
        headingCount++
      }
    })

    return {
      latitude: weightedLat / totalWeight,
      longitude: weightedLng / totalWeight,
      accuracy: Math.min(...positions.map((p) => p.accuracy)),
      timestamp: Math.max(...positions.map((p) => p.timestamp)),
      speed: speedCount > 0 ? totalSpeed / speedCount : undefined,
      heading: headingCount > 0 ? totalHeading / headingCount : undefined,
    }
  }

  private static calculateConfidence(positions: GPSCoordinate[]): number {
    const contributorFactor = Math.min(positions.length / 10, 1) // Max at 10 contributors
    const accuracyFactor = 1 - Math.min(...positions.map((p) => p.accuracy)) / 100
    const ageFactor = 1 - (Date.now() - Math.max(...positions.map((p) => p.timestamp))) / this.MAX_AGE_MS

    return Math.round((contributorFactor * 0.4 + accuracyFactor * 0.4 + ageFactor * 0.2) * 100)
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}

// Export the main functions
export { OptimizedGPSTracker, TrainPositionCalculator }
export type { GPSCoordinate, TrainPosition, GPSOptions }
