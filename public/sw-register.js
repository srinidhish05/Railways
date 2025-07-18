// Service Worker Registration and Communication
// This file should be included in your main HTML

class ServiceWorkerManager {
  constructor() {
    this.sw = null
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  async register() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        console.log("Service Worker registered:", registration.scope)

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.showUpdateAvailable()
            }
          })
        })

        // Get active service worker
        this.sw = registration.active || registration.waiting || registration.installing

        // Setup message channel
        if (navigator.serviceWorker.controller) {
          this.setupMessageChannel()
        }

        return registration
      } catch (error) {
        console.error("Service Worker registration failed:", error)
        throw error
      }
    } else {
      throw new Error("Service Workers not supported")
    }
  }

  setupEventListeners() {
    // Online/offline detection
    window.addEventListener("online", () => {
      this.isOnline = true
      this.handleOnlineStatusChange(true)
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
      this.handleOnlineStatusChange(false)
    })

    // Service Worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      this.handleServiceWorkerMessage(event.data)
    })

    // Page visibility for background sync
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isOnline) {
        this.requestBackgroundSync("schedule-update")
      }
    })
  }

  setupMessageChannel() {
    // Request offline status on load
    this.sendMessage("GET_OFFLINE_STATUS")
  }

  sendMessage(type, data = null) {
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel()

      messageChannel.port1.onmessage = (event) => {
        this.handleServiceWorkerResponse(event.data)
      }

      navigator.serviceWorker.controller.postMessage({ type, data }, [messageChannel.port2])
    }
  }

  handleServiceWorkerMessage(message) {
    const { type, data } = message

    switch (type) {
      case "GPS_SYNC_COMPLETE":
        this.showSyncNotification(`Synced ${data.synced} GPS reports`)
        break
      case "SCHEDULES_UPDATED":
        this.showUpdateNotification("Train schedules updated")
        break
      default:
        console.log("SW Message:", type, data)
    }
  }

  handleServiceWorkerResponse(response) {
    const { type, data } = response

    switch (type) {
      case "OFFLINE_STATUS":
        this.updateOfflineStatus(data)
        break
      case "SCHEDULE_UPDATED":
        this.showUpdateNotification("Schedules updated successfully")
        break
      default:
        console.log("SW Response:", type, data)
    }
  }

  handleOnlineStatusChange(isOnline) {
    console.log("Network status changed:", isOnline ? "online" : "offline")

    // Update UI
    this.updateNetworkStatus(isOnline)

    if (isOnline) {
      // Trigger background sync when coming online
      this.requestBackgroundSync("gps-reports")
    }
  }

  // Queue GPS report for background sync
  queueGPSReport(gpsData) {
    this.sendMessage("QUEUE_GPS_REPORT", gpsData)

    if (this.isOnline) {
      this.requestBackgroundSync("gps-reports")
    } else {
      this.showOfflineNotification("GPS report queued for when online")
    }
  }

  // Request background sync
  async requestBackgroundSync(tag) {
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register(tag)
        console.log("Background sync registered:", tag)
      } catch (error) {
        console.error("Background sync registration failed:", error)
      }
    }
  }

  // Force schedule update
  forceScheduleUpdate() {
    this.sendMessage("FORCE_SCHEDULE_UPDATE")
    this.showLoadingNotification("Updating train schedules...")
  }

  // UI update methods
  updateNetworkStatus(isOnline) {
    const statusElement = document.getElementById("network-status")
    if (statusElement) {
      statusElement.className = isOnline ? "online" : "offline"
      statusElement.textContent = isOnline ? "Online" : "Offline"
    }

    // Update offline indicator
    const offlineIndicator = document.getElementById("offline-indicator")
    if (offlineIndicator) {
      offlineIndicator.style.display = isOnline ? "none" : "block"
    }
  }

  updateOfflineStatus(status) {
    console.log("Offline status:", status)

    const offlineInfo = document.getElementById("offline-info")
    if (offlineInfo) {
      offlineInfo.innerHTML = `
        <div class="offline-status">
          <p>Cached schedules: ${status.hasSchedules ? "Available" : "None"}</p>
          <p>Queued GPS reports: ${status.queuedReports}</p>
          <p>Cache version: ${status.cacheVersion}</p>
        </div>
      `
    }
  }

  showUpdateAvailable() {
    const notification = this.createNotification(
      "App Update Available",
      "A new version is available. Refresh to update.",
      "info",
      () => window.location.reload(),
    )
    this.showNotification(notification)
  }

  showSyncNotification(message) {
    const notification = this.createNotification("Sync Complete", message, "success")
    this.showNotification(notification)
  }

  showUpdateNotification(message) {
    const notification = this.createNotification("Update Complete", message, "success")
    this.showNotification(notification)
  }

  showOfflineNotification(message) {
    const notification = this.createNotification("Offline Mode", message, "warning")
    this.showNotification(notification)
  }

  showLoadingNotification(message) {
    const notification = this.createNotification("Loading", message, "info")
    this.showNotification(notification)
  }

  createNotification(title, message, type, action = null) {
    return {
      id: Date.now(),
      title,
      message,
      type,
      action,
      timestamp: new Date(),
    }
  }

  showNotification(notification) {
    // Create notification element
    const notificationEl = document.createElement("div")
    notificationEl.className = `notification notification-${notification.type}`
    notificationEl.innerHTML = `
      <div class="notification-content">
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
        ${notification.action ? '<button class="notification-action">Action</button>' : ""}
        <button class="notification-close">&times;</button>
      </div>
    `

    // Add event listeners
    const closeBtn = notificationEl.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notificationEl.remove()
    })

    if (notification.action) {
      const actionBtn = notificationEl.querySelector(".notification-action")
      actionBtn.addEventListener("click", () => {
        notification.action()
        notificationEl.remove()
      })
    }

    // Add to page
    const container = document.getElementById("notifications") || document.body
    container.appendChild(notificationEl)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notificationEl.parentNode) {
        notificationEl.remove()
      }
    }, 5000)
  }

  // Check if app is running in standalone mode (PWA)
  isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://")
    )
  }

  // Get installation prompt
  async getInstallPrompt() {
    return new Promise((resolve) => {
      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault()
        resolve(event)
      })
    })
  }
}

// Initialize Service Worker Manager
const swManager = new ServiceWorkerManager()

// Register service worker when page loads
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await swManager.register()
    console.log("Service Worker Manager initialized")
  } catch (error) {
    console.error("Failed to initialize Service Worker:", error)
  }
})

// Export for use in other modules
window.swManager = swManager
