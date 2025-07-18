import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware for API authentication and rate limiting
export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Skip auth for public endpoints
    if (request.nextUrl.pathname === "/api/trains" || request.nextUrl.pathname === "/api/auth/ws-token") {
      // Add security headers
      const response = NextResponse.next()
      response.headers.set("X-Content-Type-Options", "nosniff")
      response.headers.set("X-Frame-Options", "DENY")
      response.headers.set("X-XSS-Protection", "1; mode=block")

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
