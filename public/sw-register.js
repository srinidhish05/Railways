// Service Worker Registration and Communication
// Railway Management System Integration

class RailwayServiceWorkerManager {
  constructor() {
    this.sw = null
    this.isOnline = navigator.onLine
    this.railwayData = {
      trainLocation: null,
      lastGPSUpdate: null,
      collisionAlerts: [],
      bookingQueue: []
    }
    this.setupEventListeners()
  }

  async register() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        console.log("Railway Service Worker registered:", registration.scope)

        // Handle updates with railway-specific messaging
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.showRailwayUpdateAvailable()
            }
          })
        })

        // Get active service worker
        this.sw = registration.active || registration.waiting || registration.installing

        // Setup message channel for railway operations
        if (navigator.serviceWorker.controller) {
          this.setupRailwayMessageChannel()
        }

        // Initialize railway-specific features
        this.initializeRailwayFeatures()

        return registration
      } catch (error) {
        console.error("Railway Service Worker registration failed:", error)
        throw error
      }
    } else {
      throw new Error("Service Workers not supported - Railway features limited")
    }
  }

  setupEventListeners() {
    // Online/offline detection with railway context
    window.addEventListener("online", () => {
      this.isOnline = true
      this.handleRailwayOnlineStatusChange(true)
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
      this.handleRailwayOnlineStatusChange(false)
    })

    // Service Worker messages for railway operations
    navigator.serviceWorker.addEventListener("message", (event) => {
      this.handleRailwayServiceWorkerMessage(event.data)
    })

    // Page visibility for railway background sync
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isOnline) {
        this.requestRailwayBackgroundSync("train-position-update")
        this.requestRailwayBackgroundSync("collision-check")
      }
    })

    // Geolocation updates for train tracking
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => this.handleGPSUpdate(position),
        (error) => this.handleGPSError(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      )
    }
  }

  setupRailwayMessageChannel() {
    // Request railway-specific offline status
    this.sendMessage("GET_RAILWAY_OFFLINE_STATUS")
    this.sendMessage("GET_CACHED_TRAIN_DATA")
    this.sendMessage("GET_COLLISION_ALERTS")
  }

  initializeRailwayFeatures() {
    // Initialize emergency collision detection
    this.setupCollisionMonitoring()
    
    // Initialize booking queue management
    this.setupBookingQueueManagement()
    
    // Initialize train position tracking
    this.setupTrainPositionTracking()
  }

  sendMessage(type, data = null) {
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel()

      messageChannel.port1.onmessage = (event) => {
        this.handleRailwayServiceWorkerResponse(event.data)
      }

      navigator.serviceWorker.controller.postMessage({ type, data }, [messageChannel.port2])
    }
  }

  handleRailwayServiceWorkerMessage(message) {
    const { type, data } = message

    switch (type) {
      case "GPS_SYNC_COMPLETE":
        this.showRailwaySyncNotification(`Synced ${data.synced} train position reports`)
        this.updateTrainLocationDisplay(data.lastLocation)
        break
        
      case "TRAIN_SCHEDULES_UPDATED":
        this.showRailwayUpdateNotification("Train schedules updated - checking your routes")
        this.refreshTrainDisplays()
        break
        
      case "COLLISION_ALERT":
        this.handleCriticalCollisionAlert(data)
        break
        
      case "BOOKING_CONFIRMED":
        this.handleBookingConfirmation(data)
        break
        
      case "TRAIN_DELAY_NOTIFICATION":
        this.handleTrainDelayNotification(data)
        break
        
      case "EMERGENCY_BRAKE_SIGNAL":
        this.handleEmergencyBrakeSignal(data)
        break
        
      default:
        console.log("Railway SW Message:", type, data)
    }
  }

  handleRailwayServiceWorkerResponse(response) {
    const { type, data } = response

    switch (type) {
      case "RAILWAY_OFFLINE_STATUS":
        this.updateRailwayOfflineStatus(data)
        break
        
      case "CACHED_TRAIN_DATA":
        this.displayCachedTrainData(data)
        break
        
      case "COLLISION_ALERTS":
        this.displayCollisionAlerts(data)
        break
        
      case "BOOKING_QUEUE_STATUS":
        this.updateBookingQueueStatus(data)
        break
        
      default:
        console.log("Railway SW Response:", type, data)
    }
  }

  handleRailwayOnlineStatusChange(isOnline) {
    console.log("Railway network status changed:", isOnline ? "online" : "offline")

    // Update railway-specific UI
    this.updateRailwayNetworkStatus(isOnline)

    if (isOnline) {
      // Priority sync for safety-critical data
      this.requestRailwayBackgroundSync("collision-data")
      this.requestRailwayBackgroundSync("train-positions")
      this.requestRailwayBackgroundSync("emergency-signals")
      this.requestRailwayBackgroundSync("booking-confirmations")
    } else {
      this.showRailwayOfflineNotification("Using cached railway data - limited real-time updates")
    }
  }

  // Railway-specific GPS handling
  handleGPSUpdate(position) {
    const gpsData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: position.timestamp,
      trainId: this.getTrainId() // Get from session/context
    }

    this.railwayData.trainLocation = gpsData
    this.railwayData.lastGPSUpdate = Date.now()

    // Queue for background sync
    this.queueTrainGPSReport(gpsData)

    // Update collision detection
    this.checkCollisionRisk(gpsData)
  }

  handleGPSError(error) {
    console.error("GPS Error:", error)
    this.showRailwayErrorNotification(`GPS unavailable: ${error.message}`)
    
    // Fallback to schedule-based positioning
    this.fallbackToScheduleBasedPositioning()
  }

  // Queue train GPS report for background sync
  queueTrainGPSReport(gpsData) {
    this.sendMessage("QUEUE_TRAIN_GPS_REPORT", gpsData)

    if (this.isOnline) {
      this.requestRailwayBackgroundSync("train-gps-reports")
    } else {
      this.showRailwayOfflineNotification("Train position queued for sync")
    }
  }

  // Enhanced background sync for railway operations
  async requestRailwayBackgroundSync(tag) {
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register(tag)
        console.log("Railway background sync registered:", tag)
      } catch (error) {
        console.error("Railway background sync failed:", error)
      }
    }
  }

  // Railway-specific methods
  setupCollisionMonitoring() {
    setInterval(() => {
      if (this.railwayData.trainLocation) {
        this.sendMessage("CHECK_COLLISION_RISK", this.railwayData.trainLocation)
      }
    }, 5000) // Check every 5 seconds
  }

  setupBookingQueueManagement() {
    // Handle offline booking submissions
    window.addEventListener('railway-booking-submit', (event) => {
      this.queueBookingRequest(event.detail)
    })
  }

  setupTrainPositionTracking() {
    // Real-time train position updates
    setInterval(() => {
      this.sendMessage("REQUEST_NEARBY_TRAINS", this.railwayData.trainLocation)
    }, 30000) // Every 30 seconds
  }

  handleCriticalCollisionAlert(data) {
    // Emergency collision alert with highest priority
    const emergencyNotification = this.createRailwayNotification(
      "🚨 COLLISION RISK DETECTED",
      `Potential collision with Train ${data.trainNumber} in ${data.timeToCollision}s. Distance: ${data.distance}m`,
      "critical",
      () => this.triggerEmergencyBraking(data)
    )
    
    this.showEmergencyNotification(emergencyNotification)
    
    // Audio alert
    this.playEmergencyAlert()
    
    // Vibration alert (mobile)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200])
    }
  }

  handleBookingConfirmation(data) {
    const notification = this.createRailwayNotification(
      "🎫 Booking Confirmed",
      `Train ${data.trainNumber}: ${data.coachId}, Seat ${data.seatNumber}`,
      "booking",
      () => this.showBookingDetails(data)
    )
    this.showNotification(notification)
  }

  handleTrainDelayNotification(data) {
    const notification = this.createRailwayNotification(
      "⏰ Train Delay Update",
      `Train ${data.trainNumber} delayed by ${data.delayMinutes} minutes`,
      "delay"
    )
    this.showNotification(notification)
  }

  // UI update methods for railway context
  updateRailwayNetworkStatus(isOnline) {
    const statusElement = document.getElementById("railway-network-status")
    if (statusElement) {
      statusElement.className = `railway-status ${isOnline ? "online" : "offline"}`
      statusElement.textContent = isOnline ? "🌐 Railway Network Connected" : "📱 Offline Mode"
    }

    // Update train connectivity indicator
    const trainConnectivity = document.getElementById("train-connectivity")
    if (trainConnectivity) {
      trainConnectivity.className = `train-connectivity ${isOnline ? "gps-active" : "gps-inactive"}`
      trainConnectivity.textContent = isOnline ? "GPS Active" : "GPS Offline"
    }
  }

  updateRailwayOfflineStatus(status) {
    console.log("Railway offline status:", status)

    const railwayInfo = document.getElementById("railway-offline-info")
    if (railwayInfo) {
      railwayInfo.innerHTML = `
        <div class="railway-offline-status">
          <div class="cache-trains">
            <span>Cached Trains:</span> <span>${status.cachedTrains}</span>
          </div>
          <div class="cache-routes">
            <span>Cached Routes:</span> <span>${status.cachedRoutes}</span>
          </div>
          <div class="cache-bookings">
            <span>Queued Bookings:</span> <span>${status.queuedBookings}</span>
          </div>
          <div class="cache-gps">
            <span>Queued GPS Reports:</span> <span>${status.queuedGPSReports}</span>
          </div>
        </div>
      `
    }
  }

  updateTrainLocationDisplay(location) {
    const locationDisplay = document.getElementById("train-location-display")
    if (locationDisplay && location) {
      locationDisplay.innerHTML = `
        <div class="train-location">
          <span class="location-icon">📍</span>
          <span class="coordinates">${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</span>
          <span class="accuracy">±${location.accuracy}m</span>
          <span class="timestamp">${new Date(location.timestamp).toLocaleTimeString()}</span>
        </div>
      `
    }
  }

  // Railway-specific notification methods
  showRailwayUpdateAvailable() {
    const notification = this.createRailwayNotification(
      "🚂 Railway App Update",
      "New railway features available. Update now for enhanced safety.",
      "info",
      () => window.location.reload()
    )
    this.showNotification(notification)
  }

  showRailwaySyncNotification(message) {
    const notification = this.createRailwayNotification("📡 Railway Sync", message, "success")
    this.showNotification(notification)
  }

  showRailwayUpdateNotification(message) {
    const notification = this.createRailwayNotification("🔄 Railway Update", message, "success")
    this.showNotification(notification)
  }

  showRailwayOfflineNotification(message) {
    const notification = this.createRailwayNotification("🚂 Railway Offline", message, "warning")
    this.showNotification(notification)
  }

  showRailwayErrorNotification(message) {
    const notification = this.createRailwayNotification("⚠️ Railway Error", message, "error")
    this.showNotification(notification)
  }

  createRailwayNotification(title, message, type, action = null) {
    return {
      id: Date.now(),
      title,
      message,
      type,
      action,
      timestamp: new Date(),
      railway: true
    }
  }

  showEmergencyNotification(notification) {
    // Create emergency notification with highest priority
    const emergencyEl = document.createElement("div")
    emergencyEl.className = "notification notification-collision emergency-notification"
    emergencyEl.innerHTML = `
      <div class="notification-content">
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
        ${notification.action ? '<button class="notification-action emergency-action">EMERGENCY BRAKE</button>' : ""}
        <button class="notification-close">&times;</button>
      </div>
    `

    // Priority positioning and styling
    emergencyEl.style.zIndex = "9999"
    emergencyEl.style.position = "fixed"
    emergencyEl.style.top = "10px"
    emergencyEl.style.left = "50%"
    emergencyEl.style.transform = "translateX(-50%)"
    emergencyEl.style.animation = "pulse 0.5s infinite"

    // Event listeners
    const closeBtn = emergencyEl.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => emergencyEl.remove())

    if (notification.action) {
      const actionBtn = emergencyEl.querySelector(".notification-action")
      actionBtn.addEventListener("click", () => {
        notification.action()
        emergencyEl.remove()
      })
    }

    document.body.appendChild(emergencyEl)

    // Auto-remove after 10 seconds for emergency
    setTimeout(() => {
      if (emergencyEl.parentNode) {
        emergencyEl.remove()
      }
    }, 10000)
  }

  showNotification(notification) {
    // Enhanced notification system with railway context
    const notificationEl = document.createElement("div")
    const notificationClass = notification.railway ? 
      `notification notification-${notification.type} railway-notification` :
      `notification notification-${notification.type}`
      
    notificationEl.className = notificationClass
    notificationEl.innerHTML = `
      <div class="notification-content">
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
        ${notification.action ? '<button class="notification-action">Action</button>' : ""}
        <button class="notification-close">&times;</button>
      </div>
    `

    // Event listeners
    const closeBtn = notificationEl.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => notificationEl.remove())

    if (notification.action) {
      const actionBtn = notificationEl.querySelector(".notification-action")
      actionBtn.addEventListener("click", () => {
        notification.action()
        notificationEl.remove()
      })
    }

    // Add to notifications container
    const container = document.getElementById("notifications") || 
                     document.getElementById("railway-notifications") || 
                     document.body
    container.appendChild(notificationEl)

    // Auto-remove timing based on type
    const removeTimeout = notification.type === "critical" ? 15000 : 5000
    setTimeout(() => {
      if (notificationEl.parentNode) {
        notificationEl.remove()
      }
    }, removeTimeout)
  }

  // Railway utility methods
  getTrainId() {
    // Get train ID from session, localStorage, or context
    return localStorage.getItem("trainId") || sessionStorage.getItem("currentTrain") || "UNKNOWN"
  }

  playEmergencyAlert() {
    // Play emergency sound if available
    try {
      const audio = new Audio("/audio/emergency-alert.mp3")
      audio.play().catch(e => console.log("Audio play failed:", e))
    } catch (e) {
      console.log("Emergency audio not available")
    }
  }

  triggerEmergencyBraking(data) {
    // Send emergency brake signal
    this.sendMessage("TRIGGER_EMERGENCY_BRAKE", data)
    this.showRailwayErrorNotification("Emergency braking signal sent!")
  }

  // Check if app is running as railway PWA
  isRailwayPWA() {
    return (
      this.isStandalone() &&
      (window.location.hostname.includes("railway") || 
       document.title.includes("Railway"))
    )
  }

  isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://")
    )
  }

  // Get railway app installation prompt
  async getRailwayInstallPrompt() {
    return new Promise((resolve) => {
      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault()
        // Customize for railway context
        event.userChoice.then((result) => {
          console.log("Railway PWA install result:", result)
        })
        resolve(event)
      })
    })
  }
}

// Initialize Railway Service Worker Manager
const railwaySwManager = new RailwayServiceWorkerManager()

// Register service worker when page loads
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await railwaySwManager.register()
    console.log("Railway Service Worker Manager initialized")
    
    // Initialize railway-specific features
    if (railwaySwManager.isRailwayPWA()) {
      console.log("Running as Railway PWA")
    }
  } catch (error) {
    console.error("Failed to initialize Railway Service Worker:", error)
  }
})

// Export for use in railway modules
window.railwaySwManager = railwaySwManager
window.swManager = railwaySwManager // Backward compatibility