const express = require("express")
const axios = require("axios")
const rateLimit = require("express-rate-limit")
const NodeCache = require("node-cache")
const crypto = require("crypto")
const helmet = require("helmet")
const cors = require("cors")
const winston = require("winston")
const compression = require("compression")
const { body, validationResult } = require("express-validator")

// Load environment variables
require("dotenv").config()

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
})

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// Initialize Express app
const app = express()

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(compression())
app.use(express.json({ limit: "10mb" }))

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
    maxAge: 86400, // 24 hours
  }),
)

// Request logging middleware
app.use((req, res, next) => {
  const requestId = crypto.randomUUID()
  req.requestId = requestId
  res.setHeader("X-Request-ID", requestId)
  
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    requestId
  })
  
  next()
})

// Cache setup - 5 minutes TTL
const pnrCache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Better performance
  deleteOnExpire: true,
})

// Cache event listeners
pnrCache.on("set", (key, value) => {
  logger.debug(`Cache SET: ${key}`)
})

pnrCache.on("expired", (key, value) => {
  logger.debug(`Cache EXPIRED: ${key}`)
})

// Enhanced rate limiting
const pnrRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.MAX_REQUESTS_PER_WINDOW) || 100,
  message: {
    error: "Too many PNR requests from this IP, please try again later.",
    retryAfter: "15 minutes",
    requestId: (req) => req.requestId,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + User-Agent for better identification
    return `${req.ip}-${crypto.createHash('md5').update(req.get('User-Agent') || '').digest('hex').substring(0, 8)}`
  },
  onLimitReached: (req, res, options) => {
    logger.warn({
      message: "Rate limit exceeded",
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      requestId: req.requestId
    })
  }
})

// Rate limiting for IRCTC API calls (internal)
class IRCTCRateLimiter {
  constructor() {
    this.requests = []
    this.maxRequests = parseInt(process.env.IRCTC_MAX_REQUESTS) || 50
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

      logger.info(`IRCTC rate limit reached, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      return this.waitForSlot() // Recursive call after waiting
    }

    // Add current request timestamp
    this.requests.push(now)
  }

  async handleRateLimit(error) {
    if (error.response?.status === 429) {
      logger.warn(`IRCTC rate limit hit, backing off for ${this.backoffDelay}ms`)
      await new Promise((resolve) => setTimeout(resolve, this.backoffDelay))

      // Exponential backoff
      this.backoffDelay = Math.min(this.backoffDelay * 2, this.maxBackoffDelay)
      return true // Indicate we should retry
    }

    // Reset backoff on successful request
    this.backoffDelay = 1000
    return false
  }

  getStats() {
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      backoffDelay: this.backoffDelay,
    }
  }
}

const irctcLimiter = new IRCTCRateLimiter()

// Enhanced PNR validation
function validatePNR(pnr) {
  if (!pnr) {
    return { valid: false, error: "PNR number is required" }
  }

  // Remove any whitespace
  pnr = pnr.toString().trim()

  // PNR should be exactly 10 digits
  const pnrRegex = /^\d{10}$/

  if (!pnrRegex.test(pnr)) {
    return { 
      valid: false, 
      error: "PNR must be exactly 10 digits (numbers only)" 
    }
  }

  // Additional validation: PNR shouldn't be all same digits
  if (new Set(pnr).size === 1) {
    return { 
      valid: false, 
      error: "Invalid PNR format" 
    }
  }

  return { valid: true, pnr }
}

// Generate cache key with hash for security
function generateCacheKey(pnr) {
  const salt = process.env.CACHE_SALT || "default_salt_change_in_production"
  const hash = crypto
    .createHash("sha256")
    .update(pnr + salt)
    .digest("hex")
  return `pnr_${hash.substring(0, 16)}`
}

// Enhanced mock IRCTC API response
function generateMockPNRResponse(pnr) {
  const statuses = ["CNF", "RAC", "WL", "RLWL", "PQWL"]
  const classes = ["SL", "3A", "2A", "1A", "CC", "2S"]
  const trainNames = [
    "Rajdhani Express", "Shatabdi Express", "Duronto Express", 
    "Garib Rath", "Jan Shatabdi", "Superfast Express"
  ]
  const stations = ["NDLS", "BCT", "HWH", "MAS", "SBC", "PUNE", "AMD", "JP", "LKO", "ALLP"]

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  const randomClass = classes[Math.floor(Math.random() * classes.length)]
  const randomTrain = trainNames[Math.floor(Math.random() * trainNames.length)]
  const fromStation = stations[Math.floor(Math.random() * stations.length)]
  let toStation = stations[Math.floor(Math.random() * stations.length)]
  
  while (toStation === fromStation) {
    toStation = stations[Math.floor(Math.random() * stations.length)]
  }

  // Generate future date within next 60 days
  const futureDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000)
  
  return {
    pnr: pnr,
    trainNumber: `${12000 + Math.floor(Math.random() * 8000)}`,
    trainName: randomTrain,
    dateOfJourney: futureDate.toISOString().split("T")[0],
    from: fromStation,
    to: toStation,
    reservationUpto: toStation,
    boardingPoint: fromStation,
    class: randomClass,
    passengers: [
      {
        number: 1,
        currentStatus: randomStatus,
        bookingStatus: randomStatus === "CNF" ? "CNF" : `${randomStatus}/${Math.floor(Math.random() * 50) + 1}`,
        coach: randomStatus === "CNF" ? `${randomClass}${Math.floor(Math.random() * 10) + 1}` : "",
        berth: randomStatus === "CNF" ? Math.floor(Math.random() * 72) + 1 : "",
      },
    ],
    chartPrepared: randomStatus === "CNF",
    timestamp: new Date().toISOString(),
  }
}

// Enhanced IRCTC API call with retry logic
async function fetchPNRFromIRCTC(pnr, maxRetries = 3) {
  const IRCTC_API_URL = process.env.IRCTC_API_URL || "https://api.railwayapi.site/api/v2/pnr-status"
  const API_KEY = process.env.IRCTC_API_KEY

  // If no real API key, use mock data
  if (!API_KEY || API_KEY === "your_irctc_api_key_here") {
    logger.info("Using mock IRCTC data - no API key configured")
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 800)) // Simulate realistic API delay
    return generateMockPNRResponse(pnr)
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Wait for rate limit slot
      await irctcLimiter.waitForSlot()

      logger.info(`Fetching PNR ${pnr} from IRCTC (attempt ${attempt})`)

      const response = await axios.get(`${IRCTC_API_URL}`, {
        params: { pnr },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "User-Agent": "Railway-Safety-System/1.0",
          Accept: "application/json",
          "X-Request-ID": crypto.randomUUID(),
        },
        timeout: parseInt(process.env.API_TIMEOUT) || 10000,
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      })

      if (response.status === 200) {
        logger.info(`PNR ${pnr} fetched successfully from IRCTC`)
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
      logger.error(`IRCTC API attempt ${attempt} failed: ${error.message}`)

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
        logger.warn("All IRCTC attempts failed, using mock data as fallback")
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
  const requestId = req.requestId

  try {
    const { pnr } = req.params

    logger.info(`PNR request: ${pnr} from IP: ${req.ip}`, { requestId })

    // Validate PNR
    const validation = validatePNR(pnr)
    if (!validation.valid) {
      logger.warn(`Invalid PNR format: ${pnr}`, { requestId })
      return res.status(400).json({
        error: validation.error,
        requestId,
        timestamp: new Date().toISOString(),
      })
    }

    const validatedPNR = validation.pnr

    // Check cache first
    const cacheKey = generateCacheKey(validatedPNR)
    const cachedResult = pnrCache.get(cacheKey)

    if (cachedResult) {
      logger.info(`Cache hit for PNR ${validatedPNR}`, { requestId })
      return res.json({
        ...cachedResult,
        cached: true,
        requestId,
        responseTime: Date.now() - startTime,
      })
    }

    // Fetch from IRCTC API
    logger.info(`Cache miss, fetching from IRCTC for PNR ${validatedPNR}`, { requestId })
    const pnrData = await fetchPNRFromIRCTC(validatedPNR)

    // Cache the result
    pnrCache.set(cacheKey, pnrData)

    // Log successful response
    const responseTime = Date.now() - startTime
    logger.info(`PNR ${validatedPNR} fetched successfully in ${responseTime}ms`, { requestId })

    res.json({
      ...pnrData,
      cached: false,
      requestId,
      responseTime,
    })
  } catch (error) {
    logger.error(`PNR request failed: ${error.message}`, { 
      requestId, 
      error: error.stack 
    })

    // Determine appropriate error response
    let statusCode = 500
    let errorMessage = "Internal server error"

    if (error.message.includes("PNR not found")) {
      statusCode = 404
      errorMessage = "PNR not found in IRCTC database"
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

// Enhanced health check endpoint
app.get("/api/health", (req, res) => {
  const cacheStats = pnrCache.getStats()
  const memoryUsage = process.memoryUsage()

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
    },
    rateLimiter: irctcLimiter.getStats(),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
    },
  })
})

// Cache management endpoints (admin only - add authentication in production)
app.delete("/api/cache/:pnr", (req, res) => {
  const { pnr } = req.params
  const validation = validatePNR(pnr)

  if (!validation.valid) {
    return res.status(400).json({ 
      error: validation.error,
      requestId: req.requestId 
    })
  }

  const cacheKey = generateCacheKey(validation.pnr)
  const deleted = pnrCache.del(cacheKey)

  logger.info(`Cache entry ${deleted > 0 ? 'deleted' : 'not found'} for PNR ${validation.pnr}`, {
    requestId: req.requestId
  })

  res.json({
    success: deleted > 0,
    message: deleted > 0 ? "Cache entry deleted successfully" : "Cache entry not found",
    requestId: req.requestId,
  })
})

app.delete("/api/cache", (req, res) => {
  const beforeCount = pnrCache.getStats().keys
  pnrCache.flushAll()

  logger.info(`Cache cleared, ${beforeCount} entries removed`, {
    requestId: req.requestId
  })

  res.json({
    success: true,
    message: `Cache cleared successfully, ${beforeCount} entries removed`,
    requestId: req.requestId,
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error("Unhandled error:", { 
    error: error.stack,
    requestId: req.requestId,
    url: req.url,
    method: req.method
  })

  res.status(500).json({
    error: "Internal server error",
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Endpoint not found: ${req.method} ${req.url}`, {
    requestId: req.requestId
  })

  res.status(404).json({
    error: "Endpoint not found",
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  })
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`)
  
  // Close the server
  server.close(() => {
    logger.info("HTTP server closed")
    
    // Clear cache
    pnrCache.flushAll()
    logger.info("Cache cleared")
    
    // Close logger
    logger.end()
    
    process.exit(0)
  })
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Force closing server")
    process.exit(1)
  }, 10000)
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  logger.info("=".repeat(50))
  logger.info("🚂 PNR Service Started Successfully")
  logger.info(`📡 Server running on port ${PORT}`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  logger.info(`⏰ Cache TTL: ${process.env.CACHE_TTL || 300} seconds`)
  logger.info(`🚦 Rate limit: ${process.env.MAX_REQUESTS_PER_WINDOW || 100} requests per 15 minutes per IP`)
  logger.info(`🔑 API Key configured: ${process.env.IRCTC_API_KEY ? "Yes" : "No (using mock data)"}`)
  logger.info("=".repeat(50))
})

module.exports = app