import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"
import { rateLimit } from "@/lib/rate-limit"

// Railway Safety System Middleware
// Comprehensive security, authentication, and monitoring for Railway APIs

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // ===========================================
  // SECURITY HEADERS (Applied to all routes)
  // ===========================================
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  
  // Government compliance headers
  response.headers.set("X-Railway-System", "Karnataka-Gov-Railway-Safety")
  response.headers.set("X-Powered-By", "Railway-Safety-System-v1.0")

  // ===========================================
  // API ROUTES HANDLING
  // ===========================================
  if (pathname.startsWith("/api/")) {
    // ===========================================
    // PUBLIC ENDPOINTS (No Auth Required)
    // ===========================================
    const publicEndpoints = [
      "/api/health",
      "/api/trains/public",
      "/api/stations/list",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/ws-token",
      "/api/emergency/contact",
      "/api/announcements/public"
    ]

    if (publicEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
      // Add CORS for public endpoints
      response.headers.set("Access-Control-Allow-Origin", "*")
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
      
      // Rate limiting for public endpoints
      const rateLimitResult = await rateLimit(request.ip || "anonymous")
      if (!rateLimitResult.success) {
        return new NextResponse("Rate limit exceeded", { status: 429 })
      }

      return response
    }

    // ===========================================
    // PNR STATUS ENDPOINTS (Special Rate Limiting)
    // ===========================================
    if (pathname.startsWith("/api/pnr/")) {
      // Strict rate limiting for PNR queries (prevent abuse)
      const pnrRateLimit = await rateLimit(
        request.ip || "anonymous", 
        5, // 5 requests
        60 * 1000 // per minute
      )
      
      if (!pnrRateLimit.success) {
        return new NextResponse(
          JSON.stringify({ 
            error: "PNR query rate limit exceeded. Please wait before trying again.",
            retryAfter: 60 
          }), 
          { 
            status: 429,
            headers: { "Content-Type": "application/json" }
          }
        )
      }

      // Log PNR queries for audit
      console.log(`PNR Query: ${pathname} from ${request.ip} at ${new Date().toISOString()}`)
    }

    // ===========================================
    // EMERGENCY ENDPOINTS (High Priority)
    // ===========================================
    if (pathname.startsWith("/api/emergency/")) {
      // Emergency endpoints get priority processing
      response.headers.set("X-Emergency-Priority", "HIGH")
      
      // Less strict rate limiting for emergencies
      const emergencyRateLimit = await rateLimit(
        request.ip || "anonymous",
        20, // 20 requests
        60 * 1000 // per minute
      )

      if (!emergencyRateLimit.success) {
        // Even in rate limit, allow critical emergency calls
        if (pathname.includes("/critical") || pathname.includes("/alert")) {
          console.warn(`Emergency rate limit bypassed for: ${pathname}`)
        } else {
          return new NextResponse("Emergency rate limit exceeded", { status: 429 })
        }
      }

      // Log all emergency calls
      console.log(`🚨 EMERGENCY: ${pathname} from ${request.ip} at ${new Date().toISOString()}`)
    }

    // ===========================================
    // AUTHENTICATED ENDPOINTS
    // ===========================================
    const protectedEndpoints = [
      "/api/admin/",
      "/api/user/",
      "/api/booking/",
      "/api/reports/",
      "/api/analytics/"
    ]

    if (protectedEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
      const token = request.headers.get("Authorization")?.replace("Bearer ", "")
      
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required" }), 
          { 
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        )
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET!) as any
        
        // Add user info to request headers for API routes
        response.headers.set("X-User-ID", decoded.userId)
        response.headers.set("X-User-Role", decoded.role)
        
        // Role-based access control
        if (pathname.startsWith("/api/admin/") && decoded.role !== "admin") {
          return new NextResponse(
            JSON.stringify({ error: "Admin access required" }), 
            { 
              status: 403,
              headers: { "Content-Type": "application/json" }
            }
          )
        }

        // Log authenticated API calls
        console.log(`Auth API: ${pathname} by user ${decoded.userId} (${decoded.role})`)

      } catch (error) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid authentication token" }), 
          { 
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        )
      }
    }

    // ===========================================
    // WEBSOCKET ENDPOINTS
    // ===========================================
    if (pathname.startsWith("/api/ws/")) {
      // Special handling for WebSocket upgrade requests
      if (request.headers.get("upgrade") === "websocket") {
        response.headers.set("X-WebSocket-Railway", "enabled")
      }
    }

    return response
  }

  // ===========================================
  // PAGE ROUTES HANDLING
  // ===========================================
  
  // Admin panel protection
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as any
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }
  }

  // User dashboard protection
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/dashboard", request.url))
    }
  }

  // ===========================================
  // GEOLOCATION & DEVICE DETECTION
  // ===========================================
  const userAgent = request.headers.get("user-agent") || ""
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  
  if (isMobile) {
    response.headers.set("X-Device-Type", "mobile")
  }

  // Add location headers if available (for emergency services)
  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    response.headers.set("X-Client-IP", xForwardedFor.split(",")[0])
  }

  // ===========================================
  // PERFORMANCE MONITORING
  // ===========================================
  const startTime = Date.now()
  response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`)
  response.headers.set("X-Timestamp", new Date().toISOString())

  return response
}

export const config = {
  matcher: [
    // API routes
    "/api/:path*",
    // Protected pages
    "/admin/:path*",
    "/dashboard/:path*",
    // Static files with security headers
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Rate limiting implementation
async function rateLimit(
  identifier: string, 
  limit: number = 100, 
  window: number = 60 * 1000
) {
  // This would typically use Redis or a database
  // For now, using in-memory storage (not suitable for production clusters)
  const now = Date.now()
  const key = `rate_limit_${identifier}`
  
  // In production, replace with Redis
  // const requests = await redis.get(key)
  
  return { success: true } // Simplified for example
}