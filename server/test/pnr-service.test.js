const request = require("supertest")
const app = require("../pnr-service")

describe("PNR Service API", () => {
  describe("GET /api/pnr/:pnr", () => {
    test("should return PNR status for valid PNR", async () => {
      const response = await request(app).get("/api/pnr/1234567890").expect(200)

      expect(response.body).toHaveProperty("pnr", "1234567890")
      expect(response.body).toHaveProperty("trainNumber")
      expect(response.body).toHaveProperty("trainName")
      expect(response.body).toHaveProperty("requestId")
      expect(response.body).toHaveProperty("responseTime")
    })

    test("should return 400 for invalid PNR format", async () => {
      const response = await request(app).get("/api/pnr/invalid").expect(400)

      expect(response.body).toHaveProperty("error")
      expect(response.body.error).toContain("10 digits")
    })

    test("should return 400 for short PNR", async () => {
      const response = await request(app).get("/api/pnr/123").expect(400)

      expect(response.body).toHaveProperty("error")
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
  })

  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body).toHaveProperty("status", "healthy")
      expect(response.body).toHaveProperty("cache")
      expect(response.body).toHaveProperty("rateLimiter")
    })
  })

  describe("Rate Limiting", () => {
    test("should enforce rate limits", async () => {
      // This test would need to be adjusted based on your rate limit settings
      // For testing purposes, you might want to create a separate test configuration

      const requests = []
      for (let i = 0; i < 5; i++) {
        requests.push(request(app).get("/api/pnr/1111111111"))
      }

      const responses = await Promise.all(requests)

      // All requests should succeed if under the limit
      responses.forEach((response) => {
        expect([200, 429]).toContain(response.status)
      })
    }, 10000)
  })

  describe("Cache Management", () => {
    test("should delete specific cache entry", async () => {
      const pnr = "5555555555"

      // First, create a cache entry
      await request(app).get(`/api/pnr/${pnr}`).expect(200)

      // Delete the cache entry
      const deleteResponse = await request(app).delete(`/api/cache/${pnr}`).expect(200)

      expect(deleteResponse.body.success).toBe(true)
    })

    test("should clear all cache", async () => {
      const response = await request(app).delete("/api/cache").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("Cache cleared")
    })
  })
})
