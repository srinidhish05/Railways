/**
 * K-Nearest Neighbors Algorithm for Train Collision Detection
 * Time Complexity: O(n² × m × k) where n = trains, m = training data, k = neighbors
 * Space Complexity: O(m × k) for training data storage
 */

export interface TrainData {
  id: string
  name: string
  latitude: number
  longitude: number
  speed: number // km/h
  heading: number // degrees (0-360)
  altitude: number // meters
  timestamp: number
  route: string
  nextStation: string
}

export interface CollisionPrediction {
  trainPair: [string, string]
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  probability: number
  timeToCollision: number // seconds
  distance: number // meters
  factors: string[]
  confidence: number
  timestamp: number
}

export interface TrainFeatures {
  distance: number
  relativeSpeed: number
  convergenceRate: number
  headingDifference: number
  altitudeDifference: number
  speedRatio: number
  proximityScore: number
  routeIntersection: number
}

export class KNNCollisionDetector {
  private k: number
  private trainingData: Array<{ features: TrainFeatures; risk: number }>
  private weights: number[]

  constructor(k = 5) {
    this.k = k
    this.trainingData = []
    this.weights = [0.25, 0.2, 0.15, 0.1, 0.1, 0.1, 0.05, 0.05] // Feature importance weights
    this.initializeTrainingData()
  }

  // Initialize with historical collision data
  private initializeTrainingData(): void {
    // Simulated historical data - in production, this would come from real incidents
    const historicalData = [
      // High risk scenarios
      {
        features: {
          distance: 500,
          relativeSpeed: 120,
          convergenceRate: 0.8,
          headingDifference: 10,
          altitudeDifference: 5,
          speedRatio: 1.2,
          proximityScore: 0.9,
          routeIntersection: 0.8,
        },
        risk: 0.9,
      },
      {
        features: {
          distance: 300,
          relativeSpeed: 100,
          convergenceRate: 0.9,
          headingDifference: 5,
          altitudeDifference: 2,
          speedRatio: 1.1,
          proximityScore: 0.95,
          routeIntersection: 0.9,
        },
        risk: 0.95,
      },
      {
        features: {
          distance: 200,
          relativeSpeed: 80,
          convergenceRate: 0.85,
          headingDifference: 15,
          altitudeDifference: 3,
          speedRatio: 1.3,
          proximityScore: 0.85,
          routeIntersection: 0.7,
        },
        risk: 0.85,
      },

      // Medium risk scenarios
      {
        features: {
          distance: 1000,
          relativeSpeed: 60,
          convergenceRate: 0.6,
          headingDifference: 30,
          altitudeDifference: 10,
          speedRatio: 1.5,
          proximityScore: 0.6,
          routeIntersection: 0.5,
        },
        risk: 0.6,
      },
      {
        features: {
          distance: 1500,
          relativeSpeed: 40,
          convergenceRate: 0.4,
          headingDifference: 45,
          altitudeDifference: 15,
          speedRatio: 1.8,
          proximityScore: 0.4,
          routeIntersection: 0.3,
        },
        risk: 0.4,
      },
      {
        features: {
          distance: 800,
          relativeSpeed: 70,
          convergenceRate: 0.5,
          headingDifference: 25,
          altitudeDifference: 8,
          speedRatio: 1.4,
          proximityScore: 0.5,
          routeIntersection: 0.4,
        },
        risk: 0.5,
      },

      // Low risk scenarios
      {
        features: {
          distance: 5000,
          relativeSpeed: 20,
          convergenceRate: 0.1,
          headingDifference: 90,
          altitudeDifference: 50,
          speedRatio: 2.0,
          proximityScore: 0.1,
          routeIntersection: 0.1,
        },
        risk: 0.1,
      },
      {
        features: {
          distance: 10000,
          relativeSpeed: 10,
          convergenceRate: 0.05,
          headingDifference: 120,
          altitudeDifference: 100,
          speedRatio: 3.0,
          proximityScore: 0.05,
          routeIntersection: 0.0,
        },
        risk: 0.05,
      },
      {
        features: {
          distance: 3000,
          relativeSpeed: 30,
          convergenceRate: 0.2,
          headingDifference: 60,
          altitudeDifference: 30,
          speedRatio: 2.5,
          proximityScore: 0.2,
          routeIntersection: 0.2,
        },
        risk: 0.2,
      },
    ]

    this.trainingData = historicalData
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Extract features from two trains
  private extractFeatures(train1: TrainData, train2: TrainData): TrainFeatures {
    const distance = this.calculateDistance(train1.latitude, train1.longitude, train2.latitude, train2.longitude)

    const speed1 = (train1.speed * 1000) / 3600 // Convert km/h to m/s
    const speed2 = (train2.speed * 1000) / 3600

    const relativeSpeed = Math.abs(speed1 - speed2)

    // Calculate convergence rate (how quickly trains are approaching each other)
    const headingDiff = Math.abs(train1.heading - train2.heading)
    const convergenceRate =
      headingDiff > 90 ? Math.cos((headingDiff * Math.PI) / 180) : Math.abs(Math.cos((headingDiff * Math.PI) / 180))

    const altitudeDifference = Math.abs(train1.altitude - train2.altitude)
    const speedRatio = Math.max(speed1, speed2) / Math.min(speed1, speed2)

    // Proximity score based on distance and speed
    const proximityScore = Math.max(0, 1 - distance / 10000) * Math.min(1, (speed1 + speed2) / 200)

    // Route intersection score (simplified - in reality would use route data)
    const routeIntersection =
      train1.route === train2.route ? 1.0 : this.calculateRouteIntersection(train1.route, train2.route)

    return {
      distance,
      relativeSpeed,
      convergenceRate,
      headingDifference: headingDiff,
      altitudeDifference,
      speedRatio,
      proximityScore,
      routeIntersection,
    }
  }

  // Calculate route intersection probability
  private calculateRouteIntersection(route1: string, route2: string): number {
    // Simplified route intersection calculation
    const stations1 = route1.split("→").map((s) => s.trim())
    const stations2 = route2.split("→").map((s) => s.trim())

    const commonStations = stations1.filter((station) => stations2.includes(station))
    const maxStations = Math.max(stations1.length, stations2.length)

    return commonStations.length / maxStations
  }

  // Calculate weighted Euclidean distance between feature vectors
  private calculateFeatureDistance(features1: TrainFeatures, features2: TrainFeatures): number {
    const f1 = Object.values(features1)
    const f2 = Object.values(features2)

    let distance = 0
    for (let i = 0; i < f1.length; i++) {
      const diff = f1[i] - f2[i]
      distance += this.weights[i] * diff * diff
    }

    return Math.sqrt(distance)
  }

  // Predict collision risk using KNN
  public predictCollisionRisk(train1: TrainData, train2: TrainData): CollisionPrediction {
    const features = this.extractFeatures(train1, train2)

    // Calculate distances to all training examples
    const distances = this.trainingData.map((example) => ({
      distance: this.calculateFeatureDistance(features, example.features),
      risk: example.risk,
    }))

    // Sort by distance and take k nearest neighbors
    distances.sort((a, b) => a.distance - b.distance)
    const kNearest = distances.slice(0, this.k)

    // Calculate weighted average risk (closer neighbors have more influence)
    let totalWeight = 0
    let weightedRisk = 0

    kNearest.forEach((neighbor) => {
      const weight = 1 / (neighbor.distance + 0.001) // Add small value to avoid division by zero
      totalWeight += weight
      weightedRisk += neighbor.risk * weight
    })

    const probability = weightedRisk / totalWeight

    // Determine risk level
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    if (probability >= 0.8) riskLevel = "CRITICAL"
    else if (probability >= 0.6) riskLevel = "HIGH"
    else if (probability >= 0.3) riskLevel = "MEDIUM"
    else riskLevel = "LOW"

    // Calculate time to collision (simplified)
    const timeToCollision = features.distance / (features.relativeSpeed + 0.1)

    // Generate risk factors
    const factors = this.generateRiskFactors(features, probability)

    // Calculate confidence based on consistency of k-nearest neighbors
    const riskVariance = kNearest.reduce((sum, neighbor) => sum + Math.pow(neighbor.risk - probability, 2), 0) / this.k
    const confidence = Math.max(0, 1 - riskVariance)

    return {
      trainPair: [train1.id, train2.id],
      riskLevel,
      probability,
      timeToCollision,
      distance: features.distance,
      factors,
      confidence,
      timestamp: Date.now(),
    }
  }

  // Generate human-readable risk factors
  private generateRiskFactors(features: TrainFeatures, probability: number): string[] {
    const factors: string[] = []

    if (features.distance < 1000) {
      factors.push(`Very close proximity: ${Math.round(features.distance)}m`)
    }

    if (features.relativeSpeed > 50) {
      factors.push(`High relative speed: ${Math.round(features.relativeSpeed * 3.6)} km/h`)
    }

    if (features.convergenceRate > 0.7) {
      factors.push("Trains converging rapidly")
    }

    if (features.headingDifference < 30) {
      factors.push("Similar heading directions")
    }

    if (features.routeIntersection > 0.5) {
      factors.push("Routes intersect")
    }

    if (features.proximityScore > 0.6) {
      factors.push("High proximity score")
    }

    if (probability > 0.8) {
      factors.push("CRITICAL: Immediate intervention required")
    }

    return factors
  }

  // Batch prediction for multiple train pairs
  public batchPredict(trains: TrainData[]): CollisionPrediction[] {
    const predictions: CollisionPrediction[] = []

    for (let i = 0; i < trains.length; i++) {
      for (let j = i + 1; j < trains.length; j++) {
        const prediction = this.predictCollisionRisk(trains[i], trains[j])
        predictions.push(prediction)
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability)
  }

  // Add new training data (for continuous learning)
  public addTrainingData(features: TrainFeatures, actualRisk: number): void {
    this.trainingData.push({ features, risk: actualRisk })

    // Keep only recent data (sliding window)
    if (this.trainingData.length > 1000) {
      this.trainingData = this.trainingData.slice(-1000)
    }
  }

  // Get model statistics
  public getModelStats(): {
    trainingDataSize: number
    k: number
    featureWeights: Record<string, number>
    averageRisk: number
  } {
    const averageRisk = this.trainingData.reduce((sum, data) => sum + data.risk, 0) / this.trainingData.length

    return {
      trainingDataSize: this.trainingData.length,
      k: this.k,
      featureWeights: {
        distance: this.weights[0],
        relativeSpeed: this.weights[1],
        convergenceRate: this.weights[2],
        headingDifference: this.weights[3],
        altitudeDifference: this.weights[4],
        speedRatio: this.weights[5],
        proximityScore: this.weights[6],
        routeIntersection: this.weights[7],
      },
      averageRisk,
    }
  }
}
