// Railway Safety System - Service Worker
// Version 1.0.0

const CACHE_VERSION = "v1.2.0"
const STATIC_CACHE = `railway-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `railway-dynamic-${CACHE_VERSION}`
const SCHEDULE_CACHE = `railway-schedules-${CACHE_VERSION}`
const GPS_QUEUE_STORE = "gps-reports"

// Cache configuration
const CACHE_CONFIG = {
  maxAge: {
    schedules: 24 * 60 * 60 * 1000, // 24 hours
    dynamic: 60 * 60 * 1000, // 1 hour
    estimates: 30 * 60 * 1000, // 30 minutes
  },
  maxEntries: {
    dynamic: 50,
    schedules: 100,
  },
}

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/icons/icon-192x192.png",
  "/static/icons/icon-512x512.png",
]

// Train schedule endpoints to cache
const SCHEDULE_ENDPOINTS = [
  "/api/schedules/all",
  "/api/schedules/routes",
  "/api/schedules/stations",
  "/api/train-timings",
]

// GPS report queue for background sync
let gpsReportQueue = []

// Install event - cache static assets and schedules
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker v" + CACHE_VERSION)

  event.waitUntil(
    Promise.all([cacheStaticAssets(), cacheTrainSchedules(), initializeGPSQueue()]).then(() => {
      console.log("[SW] Installation complete")
      return self.skipWaiting()
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker v" + CACHE_VERSION)

  event.waitUntil(
    Promise.all([cleanupOldCaches(), self.clients.claim()]).then(() => {
      console.log("[SW] Activation complete")
    }),
  )
})

// Fetch event - handle network requests with caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return
  }

  // Route requests to appropriate handlers
  if (isScheduleRequest(url)) {
    event.respondWith(handleScheduleRequest(request))
  } else if (isGPSRequest(url)) {
    event.respondWith(handleGPSRequest(request))
  } else if (isTrainStatusRequest(url)) {
    event.respondWith(handleTrainStatusRequest(request))
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handleDynamicRequest(request))
  }
})

// Background sync event - handle queued GPS reports
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "gps-reports") {
    event.waitUntil(syncGPSReports())
  } else if (event.tag === "schedule-update") {
    event.waitUntil(updateTrainSchedules())
  }
})

// Message event - handle communication with main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data

  switch (type) {
    case "QUEUE_GPS_REPORT":
      queueGPSReport(data)
      break
    case "GET_OFFLINE_STATUS":
      event.ports[0].postMessage({
        type: "OFFLINE_STATUS",
        data: {
          hasSchedules: hasScheduleCache(),
          queuedReports: gpsReportQueue.length,
          cacheVersion: CACHE_VERSION,
        },
      })
      break
    case "FORCE_SCHEDULE_UPDATE":
      updateTrainSchedules().then(() => {
        event.ports[0].postMessage({ type: "SCHEDULE_UPDATED" })
      })
      break
    default:
      console.log("[SW] Unknown message type:", type)
  }
})

// Cache static assets on install
async function cacheStaticAssets() {
  try {
    const cache = await caches.open(STATIC_CACHE)
    await cache.addAll(STATIC_ASSETS)
    console.log("[SW] Static assets cached")
  } catch (error) {
    console.error("[SW] Failed to cache static assets:", error)
  }
}

// Cache train schedules on install
async function cacheTrainSchedules() {
  try {
    const cache = await caches.open(SCHEDULE_CACHE)

    for (const endpoint of SCHEDULE_ENDPOINTS) {
      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`[SW] Cached schedule: ${endpoint}`)
        }
      } catch (error) {
        console.warn(`[SW] Failed to cache schedule ${endpoint}:`, error)
      }
    }

    // Cache timestamp for schedule freshness
    await cache.put(
      "/cache-timestamp",
      new Response(
        JSON.stringify({
          timestamp: Date.now(),
          version: CACHE_VERSION,
        }),
      ),
    )
  } catch (error) {
    console.error("[SW] Failed to cache train schedules:", error)
  }
}

// Initialize GPS report queue from IndexedDB
async function initializeGPSQueue() {
  try {
    const db = await openGPSDatabase()
    const transaction = db.transaction([GPS_QUEUE_STORE], "readonly")
    const store = transaction.objectStore(GPS_QUEUE_STORE)
    const request = store.getAll()

    request.onsuccess = () => {
      gpsReportQueue = request.result || []
      console.log(`[SW] Loaded ${gpsReportQueue.length} queued GPS reports`)
    }
  } catch (error) {
    console.error("[SW] Failed to initialize GPS queue:", error)
    gpsReportQueue = []
  }
}

// Clean up old cache versions
async function cleanupOldCaches() {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter((name) => name.startsWith("railway-") && !name.includes(CACHE_VERSION))

  await Promise.all(
    oldCaches.map((cacheName) => {
      console.log("[SW] Deleting old cache:", cacheName)
      return caches.delete(cacheName)
    }),
  )
}

// Handle schedule requests with cache-first strategy
async function handleScheduleRequest(request) {
  try {
    const cache = await caches.open(SCHEDULE_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse && (await isCacheFresh(cachedResponse, CACHE_CONFIG.maxAge.schedules))) {
      console.log("[SW] Serving schedule from cache:", request.url)
      return cachedResponse
    }

    // Try to fetch fresh data
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone())
        console.log("[SW] Updated schedule cache:", request.url)
        return networkResponse
      }
    } catch (networkError) {
      console.log("[SW] Network failed, using cached schedule:", request.url)
    }

    // Return cached version even if stale
    if (cachedResponse) {
      return cachedResponse
    }

    // Generate offline schedule if no cache available
    return generateOfflineScheduleResponse(request)
  } catch (error) {
    console.error("[SW] Schedule request failed:", error)
    return new Response(JSON.stringify({ error: "Schedule unavailable offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Handle GPS requests with background sync
async function handleGPSRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      return networkResponse
    }
  } catch (error) {
    console.log("[SW] GPS request failed, queuing for background sync")
  }

  // Queue for background sync if network fails
  if (request.method === "POST") {
    const requestData = await request.clone().json()
    await queueGPSReport(requestData)

    // Register background sync
    try {
      await self.registration.sync.register("gps-reports")
    } catch (syncError) {
      console.error("[SW] Background sync registration failed:", syncError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        queued: true,
        message: "GPS report queued for background sync",
      }),
      {
        status: 202,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  return new Response(JSON.stringify({ error: "GPS service unavailable" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  })
}

// Handle train status requests with schedule-based estimation
async function handleTrainStatusRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log("[SW] Train status request failed, using offline estimation")
  }

  // Fall back to schedule-based estimation
  const url = new URL(request.url)
  const trainId = url.pathname.split("/").pop()

  const estimatedStatus = await generateScheduleBasedEstimation(trainId)

  return new Response(JSON.stringify(estimatedStatus), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Offline-Response": "true",
    },
  })
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return cache.match("/offline.html")
    }
    throw error
  }
}

// Handle dynamic requests with network-first strategy
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(request, networkResponse.clone())

      // Cleanup old entries
      await cleanupDynamicCache(cache)
    }

    return networkResponse
  } catch (error) {
    // Try cache as fallback
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Queue GPS report for background sync
async function queueGPSReport(reportData) {
  const report = {
    id: generateUUID(),
    data: reportData,
    timestamp: Date.now(),
    retryCount: 0,
  }

  gpsReportQueue.push(report)

  // Persist to IndexedDB
  try {
    const db = await openGPSDatabase()
    const transaction = db.transaction([GPS_QUEUE_STORE], "readwrite")
    const store = transaction.objectStore(GPS_QUEUE_STORE)
    await store.add(report)

    console.log("[SW] GPS report queued:", report.id)
  } catch (error) {
    console.error("[SW] Failed to persist GPS report:", error)
  }
}

// Sync queued GPS reports when online
async function syncGPSReports() {
  console.log(`[SW] Syncing ${gpsReportQueue.length} GPS reports`)

  const failedReports = []

  for (const report of gpsReportQueue) {
    try {
      const response = await fetch("/api/gps/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report.data),
      })

      if (response.ok) {
        console.log("[SW] GPS report synced:", report.id)
        await removeFromGPSDatabase(report.id)
      } else {
        report.retryCount++
        if (report.retryCount < 3) {
          failedReports.push(report)
        } else {
          console.log("[SW] GPS report failed after 3 retries:", report.id)
          await removeFromGPSDatabase(report.id)
        }
      }
    } catch (error) {
      console.error("[SW] GPS sync error:", error)
      report.retryCount++
      if (report.retryCount < 3) {
        failedReports.push(report)
      }
    }
  }

  gpsReportQueue = failedReports

  // Notify main thread of sync completion
  const clients = await self.clients.matchAll()
  clients.forEach((client) => {
    client.postMessage({
      type: "GPS_SYNC_COMPLETE",
      data: {
        synced: gpsReportQueue.length,
        failed: failedReports.length,
      },
    })
  })
}

// Generate schedule-based train status estimation
async function generateScheduleBasedEstimation(trainId) {
  try {
    const cache = await caches.open(SCHEDULE_CACHE)
    const schedulesResponse = await cache.match("/api/schedules/all")

    if (!schedulesResponse) {
      throw new Error("No cached schedules available")
    }

    const schedules = await schedulesResponse.json()
    const trainSchedule = schedules.find((s) => s.trainId === trainId)

    if (!trainSchedule) {
      throw new Error("Train schedule not found")
    }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    // Find current position based on schedule
    let currentStation = null
    let nextStation = null
    const estimatedDelay = Math.floor(Math.random() * 15) // Random delay 0-15 minutes

    for (let i = 0; i < trainSchedule.stations.length; i++) {
      const station = trainSchedule.stations[i]
      const stationTime = parseTime(station.arrivalTime)

      if (currentTime >= stationTime - 30 && currentTime <= stationTime + 30) {
        currentStation = station
        nextStation = trainSchedule.stations[i + 1]
        break
      }
    }

    // If no exact match, estimate between stations
    if (!currentStation) {
      for (let i = 0; i < trainSchedule.stations.length - 1; i++) {
        const station1 = trainSchedule.stations[i]
        const station2 = trainSchedule.stations[i + 1]
        const time1 = parseTime(station1.departureTime || station1.arrivalTime)
        const time2 = parseTime(station2.arrivalTime)

        if (currentTime > time1 && currentTime < time2) {
          currentStation = station1
          nextStation = station2
          break
        }
      }
    }

    return {
      trainId,
      trainName: trainSchedule.trainName,
      currentStation: currentStation?.stationName || "Unknown",
      nextStation: nextStation?.stationName || "Destination",
      estimatedArrival: nextStation?.arrivalTime || "N/A",
      delay: estimatedDelay,
      status: estimatedDelay > 10 ? "delayed" : "on-time",
      offline: true,
      lastUpdated: new Date().toISOString(),
      confidence: "low",
      source: "schedule-estimation",
    }
  } catch (error) {
    console.error("[SW] Schedule estimation failed:", error)

    return {
      trainId,
      trainName: `Train ${trainId}`,
      currentStation: "Unknown",
      nextStation: "Unknown",
      status: "unknown",
      offline: true,
      error: "Schedule data unavailable",
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Generate offline schedule response
async function generateOfflineScheduleResponse(request) {
  const url = new URL(request.url)

  // Basic schedule structure for offline use
  const offlineSchedule = {
    trains: [
      {
        trainId: "EXP2024",
        trainName: "Express 2024",
        route: "Mumbai → Delhi",
        stations: [
          { stationName: "Mumbai Central", arrivalTime: "08:00", departureTime: "08:00" },
          { stationName: "Surat", arrivalTime: "10:45", departureTime: "10:50" },
          { stationName: "Vadodara", arrivalTime: "12:30", departureTime: "12:35" },
          { stationName: "Ahmedabad", arrivalTime: "14:15", departureTime: "14:20" },
          { stationName: "Jaipur", arrivalTime: "20:30", departureTime: "20:35" },
          { stationName: "New Delhi", arrivalTime: "06:00", departureTime: "06:00" },
        ],
      },
    ],
    offline: true,
    lastUpdated: new Date().toISOString(),
    message: "Limited offline schedule data",
  }

  return new Response(JSON.stringify(offlineSchedule), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Offline-Response": "true",
    },
  })
}

// Utility functions
function isScheduleRequest(url) {
  return SCHEDULE_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))
}

function isGPSRequest(url) {
  return url.pathname.includes("/api/gps/")
}

function isTrainStatusRequest(url) {
  return url.pathname.includes("/api/trains/") && url.pathname.includes("/status")
}

function isStaticAsset(url) {
  return (
    STATIC_ASSETS.some((asset) => url.pathname === asset) ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".css") ||
    url.pathname.includes(".js") ||
    url.pathname.includes(".png") ||
    url.pathname.includes(".ico")
  )
}

async function isCacheFresh(response, maxAge) {
  const dateHeader = response.headers.get("date")
  if (!dateHeader) return false

  const responseDate = new Date(dateHeader)
  return Date.now() - responseDate.getTime() < maxAge
}

async function hasScheduleCache() {
  try {
    const cache = await caches.open(SCHEDULE_CACHE)
    const keys = await cache.keys()
    return keys.length > 0
  } catch (error) {
    return false
  }
}

async function cleanupDynamicCache(cache) {
  const keys = await cache.keys()
  if (keys.length > CACHE_CONFIG.maxEntries.dynamic) {
    const oldestKeys = keys.slice(0, keys.length - CACHE_CONFIG.maxEntries.dynamic)
    await Promise.all(oldestKeys.map((key) => cache.delete(key)))
  }
}

function parseTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// IndexedDB operations for GPS queue
function openGPSDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("RailwayGPSQueue", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(GPS_QUEUE_STORE)) {
        const store = db.createObjectStore(GPS_QUEUE_STORE, { keyPath: "id" })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }
    }
  })
}

async function removeFromGPSDatabase(reportId) {
  try {
    const db = await openGPSDatabase()
    const transaction = db.transaction([GPS_QUEUE_STORE], "readwrite")
    const store = transaction.objectStore(GPS_QUEUE_STORE)
    await store.delete(reportId)
  } catch (error) {
    console.error("[SW] Failed to remove GPS report from database:", error)
  }
}

async function updateTrainSchedules() {
  console.log("[SW] Updating train schedules in background")

  try {
    const cache = await caches.open(SCHEDULE_CACHE)

    for (const endpoint of SCHEDULE_ENDPOINTS) {
      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`[SW] Updated schedule: ${endpoint}`)
        }
      } catch (error) {
        console.warn(`[SW] Failed to update schedule ${endpoint}:`, error)
      }
    }

    // Update cache timestamp
    await cache.put(
      "/cache-timestamp",
      new Response(
        JSON.stringify({
          timestamp: Date.now(),
          version: CACHE_VERSION,
        }),
      ),
    )

    // Notify clients of update
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: "SCHEDULES_UPDATED",
        data: { timestamp: Date.now() },
      })
    })
  } catch (error) {
    console.error("[SW] Schedule update failed:", error)
  }
}

console.log("[SW] Service Worker script loaded v" + CACHE_VERSION)
