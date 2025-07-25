const request = require("supertest")
const app = require("../pnr-service")

describe("PNR Service API", () => {
  // Clean up before tests
  beforeEach(async () => {
    // Clear cache before each test to ensure isolation
    await request(app).delete("/api/cache")
  })

  describe("GET /api/pnr/:pnr", () => {
    test("should return PNR status for valid PNR", async () => {
      const response = await request(app).get("/api/pnr/1234567890").expect(200)

      expect(response.body).toHaveProperty("pnr", "1234567890")
      expect(response.body).toHaveProperty("trainNumber")
      expect(response.body).toHaveProperty("trainName")
      expect(response.body).toHaveProperty("requestId")
      expect(response.body).toHaveProperty("responseTime")
      expect(response.body).toHaveProperty("dateOfJourney")
      expect(response.body).toHaveProperty("from")
      expect(response.body).toHaveProperty("to")
      expect(response.body).toHaveProperty("passengers")
      expect(Array.isArray(response.body.passengers)).toBe(true)
    })

    test("should return 400 for invalid PNR format", async () => {
      const response = await request(app).get("/api/pnr/invalid").expect(400)

      expect(response.body).toHaveProperty("error")
      expect(response.body.error).toContain("10 digits")
      expect(response.body).toHaveProperty("requestId")
      expect(response.body).toHaveProperty("timestamp")
    })

    test("should return 400 for short PNR", async () => {
      const response = await request(app).get("/api/pnr/123").expect(400)

      expect(response.body).toHaveProperty("error")
      expect(response.body).toHaveProperty("requestId")
    })

    test("should return 400 for PNR with letters", async () => {
      const response = await request(app).get("/api/pnr/123456789a").expect(400)

      expect(response.body).toHaveProperty("error")
      expect(response.body.error).toContain("10 digits")
    })

    test("should return 400 for PNR with special characters", async () => {
      const response = await request(app).get("/api/pnr/1234-56789").expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should handle PNR with leading zeros", async () => {
      const response = await request(app).get("/api/pnr/0123456789").expect(200)

      expect(response.body.pnr).toBe("0123456789")
    })

    test("should return cached result on second request", async () => {
      const pnr = "9876543210"

      // First request
      const response1 = await request(app).get(`/api/pnr/${pnr}`).expect(200)
      expect(response1.body.cached).toBe(false)

      // Second request (should be cached)
      const response2 = await request(app).get(`/api/pnr/${pnr}`).expect(200)
      expect(response2.body.cached).toBe(true)
      expect(response2.body.pnr).toBe(pnr)
    })

    test("should include all required passenger information", async () => {
      const response = await request(app).get("/api/pnr/2468013579").expect(200)

      expect(response.body.passengers[0]).toHaveProperty("number")
      expect(response.body.passengers[0]).toHaveProperty("currentStatus")
      expect(response.body.passengers[0]).toHaveProperty("bookingStatus")
      expect(typeof response.body.chartPrepared).toBe("boolean")
    })

    test("should return valid train details", async () => {
      const response = await request(app).get("/api/pnr/3691470258").expect(200)

      expect(response.body.trainNumber).toMatch(/^\d+$/)
      expect(typeof response.body.trainName).toBe("string")
      expect(response.body.trainName.length).toBeGreaterThan(0)
      expect(typeof response.body.class).toBe("string")
    })

    test("should validate station codes format", async () => {
      const response = await request(app).get("/api/pnr/4567891230").expect(200)

      expect(response.body.from).toMatch(/^[A-Z]{2,5}$/)
      expect(response.body.to).toMatch(/^[A-Z]{2,5}$/)
      expect(response.body.reservationUpto).toMatch(/^[A-Z]{2,5}$/)
      expect(response.body.boardingPoint).toMatch(/^[A-Z]{2,5}$/)
    })

    test("should return valid date format for journey", async () => {
      const response = await request(app).get("/api/pnr/5678912340").expect(200)

      expect(response.body.dateOfJourney).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      const journeyDate = new Date(response.body.dateOfJourney)
      expect(journeyDate).toBeInstanceOf(Date)
      expect(journeyDate.getTime()).not.toBeNaN()
    })

    test("should handle different passenger statuses", async () => {
      const response = await request(app).get("/api/pnr/6789123450").expect(200)

      const validStatuses = ["CNF", "RAC", "WL", "RLWL", "PQWL"]
      expect(validStatuses).toContain(response.body.passengers[0].currentStatus)
    })

    test("should validate train class codes", async () => {
      const response = await request(app).get("/api/pnr/3579146820").expect(200)

      const validClasses = ["SL", "3A", "2A", "1A", "CC", "2S", "FC", "EC"]
      expect(validClasses).toContain(response.body.class)
    })

    test("should ensure from and to stations are different", async () => {
      const response = await request(app).get("/api/pnr/4681357920").expect(200)

      expect(response.body.from).not.toBe(response.body.to)
    })

    test("should validate train number format", async () => {
      const response = await request(app).get("/api/pnr/5792468130").expect(200)

      expect(response.body.trainNumber).toMatch(/^\d{4,5}$/)
      const trainNum = parseInt(response.body.trainNumber)
      expect(trainNum).toBeGreaterThan(10000)
      expect(trainNum).toBeLessThan(99999)
    })

    test("should return valid passenger coach format when confirmed", async () => {
      const response = await request(app).get("/api/pnr/1357924680").expect(200)

      const passenger = response.body.passengers[0]
      if (passenger.currentStatus === "CNF" && passenger.coach) {
        expect(passenger.coach).toMatch(/^[A-Z]\d+$/)
      }
    })

    test("should return valid berth numbers when confirmed", async () => {
      const response = await request(app).get("/api/pnr/2468135790").expect(200)

      const passenger = response.body.passengers[0]
      if (passenger.currentStatus === "CNF" && passenger.berth) {
        expect(typeof passenger.berth).toBe("number")
        expect(passenger.berth).toBeGreaterThan(0)
        expect(passenger.berth).toBeLessThanOrEqual(72)
      }
    })

    test("should validate booking status format", async () => {
      const response = await request(app).get("/api/pnr/6813579240").expect(200)

      const passenger = response.body.passengers[0]
      const validBookingStatuses = ["CNF", /^WL\/\d+$/, /^RAC\/\d+$/, /^RLWL\/\d+$/, /^PQWL\/\d+$/]

      const isValidStatus = validBookingStatuses.some(pattern => {
        if (typeof pattern === "string") {
          return passenger.bookingStatus === pattern
        }
        return pattern.test(passenger.bookingStatus)
      })

      expect(isValidStatus).toBe(true)
    })

    test("should include timestamp and response time", async () => {
      const startTime = Date.now()
      const response = await request(app).get("/api/pnr/7410258369").expect(200)
      const endTime = Date.now()

      expect(response.body).toHaveProperty("timestamp")
      expect(response.body).toHaveProperty("responseTime")
      expect(response.body.responseTime).toBeGreaterThan(0)
      expect(response.body.responseTime).toBeLessThan(endTime - startTime + 100)
    })
  })

  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body).toHaveProperty("status", "healthy")
      expect(response.body).toHaveProperty("cache")
      expect(response.body).toHaveProperty("rateLimiter")
      expect(response.body).toHaveProperty("timestamp")
    })

    test("should return valid cache statistics", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body.cache).toHaveProperty("keys")
      expect(response.body.cache).toHaveProperty("hits")
      expect(response.body.cache).toHaveProperty("misses")
      expect(response.body.cache).toHaveProperty("hitRate")
      expect(typeof response.body.cache.hitRate).toBe("number")
    })

    test("should return valid rate limiter information", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body.rateLimiter).toHaveProperty("currentRequests")
      expect(response.body.rateLimiter).toHaveProperty("maxRequests")
      expect(response.body.rateLimiter).toHaveProperty("backoffDelay")
      expect(typeof response.body.rateLimiter.maxRequests).toBe("number")
    })

    test("should calculate hit rate correctly", async () => {
      // Make first request (miss)
      await request(app).get("/api/pnr/1111111111")

      // Make second request (hit)
      await request(app).get("/api/pnr/1111111111")

      const healthResponse = await request(app).get("/api/health")
      expect(healthResponse.body.cache.hitRate).toBeGreaterThan(0)
    })
  })

  describe("Rate Limiting", () => {
    test("should enforce rate limits", async () => {
      const requests = []
      for (let i = 0; i < 5; i++) {
        requests.push(request(app).get("/api/pnr/1111111111"))
      }

      const responses = await Promise.all(requests)

      responses.forEach((response) => {
        expect([200, 429]).toContain(response.status)
      })
    }, 10000)

    test("should include rate limit headers", async () => {
      const response = await request(app).get("/api/pnr/8520741963")

      expect(response.headers).toHaveProperty("x-ratelimit-limit")
      expect(response.headers).toHaveProperty("x-ratelimit-remaining")
    })

    test("should return proper error message when rate limited", async () => {
      const requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(request(app).get(`/api/pnr/111111111${i}`))
      }

      const responses = await Promise.all(requests)
      const rateLimitedResponse = responses.find(r => r.status === 429)

      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body).toHaveProperty("error")
        expect(rateLimitedResponse.body).toHaveProperty("retryAfter")
        expect(rateLimitedResponse.body.error).toContain("Too many PNR requests")
      }
    }, 15000)
  })

  describe("Cache Management", () => {
    test("should delete specific cache entry", async () => {
      const pnr = "5555555555"

      // First, create a cache entry
      await request(app).get(`/api/pnr/${pnr}`).expect(200)

      // Delete the cache entry
      const deleteResponse = await request(app).delete(`/api/cache/${pnr}`).expect(200)

      expect(deleteResponse.body.success).toBe(true)
      expect(deleteResponse.body).toHaveProperty("message")
    })

    test("should return error for invalid PNR in cache deletion", async () => {
      const response = await request(app).delete("/api/cache/invalid").expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should handle deletion of non-existent cache entry", async () => {
      const response = await request(app).delete("/api/cache/9999999999").expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })

    test("should clear all cache", async () => {
      // Create some cache entries first
      await request(app).get("/api/pnr/1111111111")
      await request(app).get("/api/pnr/2222222222")

      const response = await request(app).delete("/api/cache").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("Cache cleared")
    })

    test("should verify cache is cleared after flush", async () => {
      const pnr = "3333333333"

      // Create cache entry
      await request(app).get(`/api/pnr/${pnr}`)

      // Clear cache
      await request(app).delete("/api/cache")

      // Next request should not be cached
      const response = await request(app).get(`/api/pnr/${pnr}`).expect(200)
      expect(response.body.cached).toBe(false)
    })

    test("should maintain cache isolation between different PNRs", async () => {
      const pnr1 = "4444444444"
      const pnr2 = "5555555555"

      // Create cache entries
      await request(app).get(`/api/pnr/${pnr1}`)
      await request(app).get(`/api/pnr/${pnr2}`)

      // Delete one entry
      await request(app).delete(`/api/cache/${pnr1}`)

      // First should not be cached, second should be
      const response1 = await request(app).get(`/api/pnr/${pnr1}`)
      const response2 = await request(app).get(`/api/pnr/${pnr2}`)

      expect(response1.body.cached).toBe(false)
      expect(response2.body.cached).toBe(true)
    })
  })

  describe("Error Handling", () => {
    test("should handle invalid routes", async () => {
      const response = await request(app).get("/api/invalid-route").expect(404)

      expect(response.body).toHaveProperty("error", "Endpoint not found")
      expect(response.body).toHaveProperty("timestamp")
    })

    test("should include request ID in all responses", async () => {
      const response = await request(app).get("/api/pnr/1234567890")

      expect(response.body).toHaveProperty("requestId")
      expect(typeof response.body.requestId).toBe("string")
      expect(response.body.requestId.length).toBeGreaterThan(0)
    })

    test("should handle very long PNR numbers", async () => {
      const longPNR = "12345678901234567890"
      const response = await request(app).get(`/api/pnr/${longPNR}`).expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should handle URL encoded special characters", async () => {
      const response = await request(app).get("/api/pnr/123%20456789").expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should return consistent error format", async () => {
      const responses = await Promise.all([
        request(app).get("/api/pnr/invalid"),
        request(app).get("/api/pnr/123"),
        request(app).get("/api/pnr/123456789a")
      ])

      responses.forEach(response => {
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
        expect(response.body).toHaveProperty("requestId")
        expect(response.body).toHaveProperty("timestamp")
      })
    })
  })

  describe("Security Tests", () => {
    test("should include security headers", async () => {
      const response = await request(app).get("/api/health")

      expect(response.headers).toHaveProperty("x-content-type-options")
      expect(response.headers).toHaveProperty("x-frame-options")
    })

    test("should handle CORS properly", async () => {
      const response = await request(app)
        .get("/api/health")
        .set("Origin", "http://localhost:3000")

      expect(response.headers).toHaveProperty("access-control-allow-origin")
    })

    test("should not expose sensitive information in errors", async () => {
      const response = await request(app).get("/api/pnr/invalid").expect(400)

      expect(response.body.error).not.toContain("stack")
      expect(response.body.error).not.toContain("internal")
    })

    test("should handle SQL injection attempts", async () => {
      const maliciousPNR = "1234567890'; DROP TABLE--"
      const response = await request(app).get(`/api/pnr/${encodeURIComponent(maliciousPNR)}`).expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should handle XSS attempts in PNR", async () => {
      const xssPNR = "1234567890<script>alert('xss')</script>"
      const response = await request(app).get(`/api/pnr/${encodeURIComponent(xssPNR)}`).expect(400)

      expect(response.body).toHaveProperty("error")
    })

    test("should validate content-type headers", async () => {
      const response = await request(app).get("/api/health")

      expect(response.headers["content-type"]).toContain("application/json")
    })
  })

  describe("Performance Tests", () => {
    test("should respond within reasonable time", async () => {
      const startTime = Date.now()
      await request(app).get("/api/pnr/1234567890").expect(200)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(5000) // 5 seconds max
    })

    test("should handle concurrent requests", async () => {
      const requests = []
      for (let i = 0; i < 5; i++) {
        requests.push(request(app).get(`/api/pnr/123456789${i}`))
      }

      const responses = await Promise.all(requests)

      responses.forEach(response => {
        expect([200, 400, 429]).toContain(response.status)
      })
    }, 10000)

    test("should cache responses efficiently", async () => {
      const pnr = "7777777777"

      // First request
      const response1 = await request(app).get(`/api/pnr/${pnr}`)
      const firstResponseTime = response1.body.responseTime

      // Second request (cached)
      const response2 = await request(app).get(`/api/pnr/${pnr}`)
      const secondResponseTime = response2.body.responseTime

      expect(response2.body.cached).toBe(true)
      expect(secondResponseTime).toBeLessThan(firstResponseTime)
    })

    test("should handle memory efficiency with large cache", async () => {
      // Create multiple cache entries
      const requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(request(app).get(`/api/pnr/888888888${i}`))
      }

      await Promise.all(requests)

      // Verify health endpoint still responds quickly
      const healthStart = Date.now()
      const healthResponse = await request(app).get("/api/health")
      const healthTime = Date.now() - healthStart

      expect(healthResponse.status).toBe(200)
      expect(healthTime).toBeLessThan(1000) // Should respond within 1 second
    })

    test("should maintain consistent response times under load", async () => {
      const responseTimes = []

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now()
        await request(app).get(`/api/pnr/999999999${i}`)
        responseTimes.push(Date.now() - startTime)
      }

      const avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length
      const maxResponseTime = Math.max(...responseTimes)

      expect(avgResponseTime).toBeLessThan(2000)
      expect(maxResponseTime).toBeLessThan(5000)
    })
  })

  describe("Integration Tests", () => {
    test("should maintain consistency between health and actual cache state", async () => {
      // Create a known cache entry
      await request(app).get("/api/pnr/1111111111")

      const healthResponse = await request(app).get("/api/health")
      expect(healthResponse.body.cache.keys).toBeGreaterThan(0)

      // Verify the cached entry works
      const cachedResponse = await request(app).get("/api/pnr/1111111111")
      expect(cachedResponse.body.cached).toBe(true)
    })

    test("should handle mixed cached and non-cached requests", async () => {
      const pnr1 = "1111111111"
      const pnr2 = "2222222222"

      // Create one cache entry
      await request(app).get(`/api/pnr/${pnr1}`)

      // Make requests to both
      const response1 = await request(app).get(`/api/pnr/${pnr1}`)
      const response2 = await request(app).get(`/api/pnr/${pnr2}`)

      expect(response1.body.cached).toBe(true)
      expect(response2.body.cached).toBe(false)
    })

    test("should maintain data consistency across cache operations", async () => {
      const pnr = "3333333333"

      // Get initial data
      const response1 = await request(app).get(`/api/pnr/${pnr}`)

      // Get cached data
      const response2 = await request(app).get(`/api/pnr/${pnr}`)

      // Compare essential fields (excluding timing fields)
      expect(response2.body.pnr).toBe(response1.body.pnr)
      expect(response2.body.trainNumber).toBe(response1.body.trainNumber)
      expect(response2.body.trainName).toBe(response1.body.trainName)
      expect(response2.body.passengers).toEqual(response1.body.passengers)
    })
  })

  describe("Edge Cases", () => {
    test("should handle maximum valid PNR number", async () => {
      const response = await request(app).get("/api/pnr/9999999999").expect(200)

      expect(response.body.pnr).toBe("9999999999")
    })

    test("should handle minimum valid PNR number", async () => {
      const response = await request(app).get("/api/pnr/0000000000").expect(200)

      expect(response.body.pnr).toBe("0000000000")
    })

    test("should handle future journey dates", async () => {
      const response = await request(app).get("/api/pnr/2222222222").expect(200)

      const journeyDate = new Date(response.body.dateOfJourney)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      expect(journeyDate.getTime()).toBeGreaterThanOrEqual(today.getTime())
    })

    test("should handle cache key collisions gracefully", async () => {
      // This tests the hashing function doesn't create collisions
      const pnrs = ["1234567890", "2345678901", "3456789012"]
      
      const responses = await Promise.all(
        pnrs.map(pnr => request(app).get(`/api/pnr/${pnr}`))
      )

      responses.forEach((response, index) => {
        expect(response.body.pnr).toBe(pnrs[index])
        expect(response.status).toBe(200)
      })
    })
  })

  describe("API Documentation Tests", () => {
    test("should return proper HTTP status codes", async () => {
      const testCases = [
        { pnr: "1234567890", expectedStatus: 200 },
        { pnr: "invalid", expectedStatus: 400 },
        { pnr: "123", expectedStatus: 400 },
        { pnr: "12345678901", expectedStatus: 400 }
      ]

      for (const testCase of testCases) {
        const response = await request(app).get(`/api/pnr/${testCase.pnr}`)
        expect(response.status).toBe(testCase.expectedStatus)
      }
    })

    test("should include all documented response fields", async () => {
      const response = await request(app).get("/api/pnr/1234567890").expect(200)

      const requiredFields = [
        "pnr", "trainNumber", "trainName", "dateOfJourney",
        "from", "to", "class", "passengers", "chartPrepared",
        "timestamp", "cached", "requestId", "responseTime"
      ]

      requiredFields.forEach(field => {
        expect(response.body).toHaveProperty(field)
      })
    })

    test("should validate passenger object structure", async () => {
      const response = await request(app).get("/api/pnr/1234567890").expect(200)

      const passenger = response.body.passengers[0]
      const requiredPassengerFields = [
        "number", "currentStatus", "bookingStatus"
      ]

      requiredPassengerFields.forEach(field => {
        expect(passenger).toHaveProperty(field)
      })
    })
  })
})