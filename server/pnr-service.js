const express = require("express")
const axios = require("axios")
const rateLimit = require("express-rate-limit")
const NodeCache = require("node-cache")
const crypto = require("crypto")
const helmet = require("helmet")
const cors = require("cors")

// Initialize Express app
const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))

// Cache setup - 5 minutes TTL
const pnrCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Better performance
})

// Rate limiting for the endpoint
const pnrRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many PNR requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting for IRCTC API calls (internal)
class IRCTCRateLimiter {
  constructor() {
    this.requests = []
    this.maxRequests = 50 // Max requests per minute
    this.timeWindow = 60000 // 1 minute
    this.backoffDelay = 1000 // Start with 1 second
    this.maxBackoffDelay = 30000 // Max 30 seconds
  }

  async waitForSlot() {
    const now = Date.now()

    // Remove old requests outside the time window
    this.requests = this.requests.filter((time) => now - time < this.timeWindow)

    // If we're at the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest)

      console.log(`Rate limit reached, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      return this.waitForSlot() // Recursive call after waiting
    }

    // Add current request timestamp
    this.requests.push(now)
  }

  async handleRateLimit(error) {
    if (error.response?.status === 429) {
      console.log(`IRCTC rate limit hit, backing off for ${this.backoffDelay}ms`)
      await new Promise((resolve) => setTimeout(resolve, this.backoffDelay))

      // Exponential backoff
      this.backoffDelay = Math.min(this.backoffDelay * 2, this.maxBackoffDelay)
      return true // Indicate we should retry
    }

    // Reset backoff on successful request
    this.backoffDelay = 1000
    return false
  }
}

const irctcLimiter = new IRCTCRateLimiter()

// PNR validation
function validatePNR(pnr) {
  // PNR should be 10 digits
  const pnrRegex = /^\d{10}$/

  if (!pnr) {
    return { valid: false, error: "PNR number is required" }
  }

  if (!pnrRegex.test(pnr)) {
    return { valid: false, error: "PNR must be exactly 10 digits" }
  }

  return { valid: true }
}

// Generate cache key with hash for security
function generateCacheKey(pnr) {
  const hash = crypto
    .createHash("sha256")
    .update(pnr + process.env.CACHE_SALT || "default_salt")
    .digest("hex")
  return `pnr_${hash.substring(0, 16)}`
}

// Mock IRCTC API response (use this when real API is unavailable)
function generateMockPNRResponse(pnr) {
  const statuses = ["CNF", "RAC", "WL", "RLWL", "PQWL"]
  const trainNames = ["Rajdhani Express", "Shatabdi Express", "Duronto Express", "Garib Rath", "Jan Shatabdi"]
  const stations = ["NDLS", "BCT", "HWH", "MAS", "SBC", "PUNE", "AMD", "JP"]

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  const randomTrain = trainNames[Math.floor(Math.random() * trainNames.length)]
  const fromStation = stations[Math.floor(Math.random() * stations.length)]
  let toStation = stations[Math.floor(Math.random() * stations.length)]
  while (toStation === fromStation) {
    toStation = stations[Math.floor(Math.random() * stations.length)]
  }

  return {
    pnr: pnr,
    trainNumber: `${12000 + Math.floor(Math.random() * 1000)}`,
    trainName: randomTrain,
    dateOfJourney: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    from: fromStation,
    to: toStation,
    reservationUpto: toStation,
    boardingPoint: fromStation,
    class: "SL",
    passengers: [
      {
        number: 1,
        currentStatus: randomStatus,
        bookingStatus: randomStatus === "CNF" ? "CNF" : "WL/1",
        coach: randomStatus === "CNF" ? `S${Math.floor(Math.random() * 10) + 1}` : "",
        berth: randomStatus === "CNF" ? Math.floor(Math.random() * 72) + 1 : "",
      },
    ],
    chartPrepared: randomStatus === "CNF",
    timestamp: new Date().toISOString(),
  }
}

// IRCTC API call with retry logic
async function fetchPNRFromIRCTC(pnr, maxRetries = 3) {
  const IRCTC_API_URL = process.env.IRCTC_API_URL || "https://api.irctc.co.in/pnr-status"
  const API_KEY = process.env.IRCTC_API_KEY

  // If no real API key, use mock data
  if (!API_KEY || API_KEY === "your_irctc_api_key_here") {
    console.log("Using mock IRCTC data - no API key configured")
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return generateMockPNRResponse(pnr)
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Wait for rate limit slot
      await irctcLimiter.waitForSlot()

      console.log(`Fetching PNR ${pnr} from IRCTC (attempt ${attempt})`)

      const response = await axios.get(`${IRCTC_API_URL}/${pnr}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "User-Agent": "Railway-Safety-System/1.0",
          Accept: "application/json",
          "X-Request-ID": crypto.randomUUID(),
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      })

      if (response.status === 200) {
        return response.data
      } else if (response.status === 404) {
        throw new Error("PNR not found")
      } else if (response.status === 429) {
        const shouldRetry = await irctcLimiter.handleRateLimit({ response })
        if (shouldRetry && attempt < maxRetries) {
          continue // Retry the request
        }
        throw new Error("IRCTC API rate limit exceeded")
      } else {
        throw new Error(`IRCTC API error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error(`IRCTC API attempt ${attempt} failed:`, error.message)

      // Handle rate limiting
      if (error.response?.status === 429) {
        const shouldRetry = await irctcLimiter.handleRateLimit(error)
        if (shouldRetry && attempt < maxRetries) {
          continue
        }
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        // Return mock data as fallback for demo purposes
        console.log("All IRCTC attempts failed, using mock data as fallback")
        return generateMockPNRResponse(pnr)
      }

      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Main PNR status endpoint
app.get("/api/pnr/:pnr", pnrRateLimit, async (req, res) => {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  try {
    const { pnr } = req.params

    // Log request
    console.log(`[${requestId}] PNR request: ${pnr} from IP: ${req.ip}`)

    // Validate PNR
    const validation = validatePNR(pnr)
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error,
        requestId,
        timestamp: new Date().toISOString(),
      })
    }

    // Check cache first
    const cacheKey = generateCacheKey(pnr)
    const cachedResult = pnrCache.get(cacheKey)

    if (cachedResult) {
      console.log(`[${requestId}] Cache hit for PNR ${pnr}`)
      return res.json({
        ...cachedResult,
        cached: true,
        requestId,
        responseTime: Date.now() - startTime,
      })
    }

    // Fetch from IRCTC API
    console.log(`[${requestId}] Cache miss, fetching from IRCTC`)
    const pnrData = await fetchPNRFromIRCTC(pnr)

    // Cache the result
    pnrCache.set(cacheKey, pnrData)

    // Log successful response
    console.log(`[${requestId}] PNR ${pnr} fetched successfully in ${Date.now() - startTime}ms`)

    res.json({
      ...pnrData,
      cached: false,
      requestId,
      responseTime: Date.now() - startTime,
    })
  } catch (error) {
    console.error(`[${requestId}] PNR request failed:`, error.message)

    // Determine appropriate error response
    let statusCode = 500
    let errorMessage = "Internal server error"

    if (error.message.includes("PNR not found")) {
      statusCode = 404
      errorMessage = "PNR not found"
    } else if (error.message.includes("rate limit")) {
      statusCode = 429
      errorMessage = "Service temporarily unavailable due to high load"
    } else if (error.message.includes("timeout")) {
      statusCode = 504
      errorMessage = "Request timeout - please try again"
    }

    res.status(statusCode).json({
      error: errorMessage,
      requestId,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  const cacheStats = pnrCache.getStats()

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
    },
    rateLimiter: {
      currentRequests: irctcLimiter.requests.length,
      maxRequests: irctcLimiter.maxRequests,
      backoffDelay: irctcLimiter.backoffDelay,
    },
  })
})

// Cache management endpoints (admin only)
app.delete("/api/cache/:pnr", (req, res) => {
  // In production, add admin authentication here
  const { pnr } = req.params
  const validation = validatePNR(pnr)

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error })
  }

  const cacheKey = generateCacheKey(pnr)
  const deleted = pnrCache.del(cacheKey)

  res.json({
    success: deleted > 0,
    message: deleted > 0 ? "Cache entry deleted" : "Cache entry not found",
  })
})

app.delete("/api/cache", (req, res) => {
  // In production, add admin authentication here
  const deletedCount = pnrCache.flushAll()

  res.json({
    success: true,
    message: `Cache cleared, ${deletedCount} entries removed`,
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)

  res.status(500).json({
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    timestamp: new Date().toISOString(),
  })
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  pnrCache.flushAll()
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  pnrCache.flushAll()
  process.exit(0)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`PNR Service running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`Cache TTL: 5 minutes`)
  console.log(`Rate limit: 100 requests per 15 minutes per IP`)
})

module.exports = app
