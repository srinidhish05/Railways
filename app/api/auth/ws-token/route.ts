import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"

// Environment variables for JWT (add to .env.local)
const JWT_SECRET = process.env.JWT_SECRET || "railway_ws_secret_key_2024"
const WS_TOKEN_EXPIRY = 3600 // 1 hour

interface TokenPayload {
  userId: string
  role: 'admin' | 'user' | 'operator'
  permissions: string[]
  division: string
  timestamp: number
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown'

    // Rate limiting: max 10 tokens per hour per IP
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Too many token requests." }, 
        { status: 429 }
      )
    }

    // Extract authorization header
    const authHeader = headersList.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" }, 
        { status: 401 }
      )
    }

    // Verify the existing JWT token
    const token = authHeader.substring(7)
    let userPayload: any

    try {
      userPayload = jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" }, 
        { status: 401 }
      )
    }

    // Validate user permissions for WebSocket access
    if (!hasWebSocketPermission(userPayload.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions for WebSocket access" }, 
        { status: 403 }
      )
    }

    // Generate WebSocket-specific token
    const wsPermissions = getWebSocketPermissions(userPayload.role)
    const wsTokenPayload: TokenPayload = {
      userId: userPayload.userId || userPayload.id,
      role: userPayload.role,
      permissions: wsPermissions,
      division: userPayload.division || 'Karnataka',
      timestamp: Date.now()
    }

    const wsToken = jwt.sign(wsTokenPayload, JWT_SECRET, {
      expiresIn: WS_TOKEN_EXPIRY,
      issuer: 'railway-ws-system',
      audience: 'railway-clients'
    })

    // Log token generation for audit
    console.log(`WebSocket token generated for user: ${wsTokenPayload.userId}, role: ${wsTokenPayload.role}`)

    // Safety features for admin (expand as needed)
    const safetyFeatures = wsTokenPayload.role === 'admin'
      ? ['Collision Prevention', 'Safety Monitoring', 'Delay Management', 'Emergency Response']
      : []

    // TODO: Integrate real-time alert triggers here for collision/safety events

    return NextResponse.json({
      token: wsToken,
      expiresIn: WS_TOKEN_EXPIRY,
      permissions: wsTokenPayload.permissions,
      division: wsTokenPayload.division,
      connectionUrl: getWebSocketUrl(wsTokenPayload.role),
      safetyFeatures
    })

  } catch (error) {
    console.error("Error generating WebSocket token:", error)
    return NextResponse.json(
      { error: "Internal server error while generating WebSocket token" }, 
      { status: 500 }
    )
  }
}

// Check rate limiting
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(clientIP)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + (60 * 60 * 1000) // 1 hour
    })
    return true
  }

  if (limit.count >= 10) {
    return false
  }

  limit.count++
  return true
}

// Check if user role has WebSocket permission
function hasWebSocketPermission(role: string): boolean {
  const allowedRoles = ['admin', 'operator', 'user', 'controller']
  return allowedRoles.includes(role)
}

// Get WebSocket permissions based on role
function getWebSocketPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    admin: [
      'train-tracking',
      'safety-alerts',
      'system-status',
      'emergency-broadcast',
      'all-trains-data',
      'passenger-analytics',
      'collision-prevention',
      'safety-monitoring'
    ],
    operator: [
      'train-tracking',
      'safety-alerts',
      'system-status',
      'train-control',
      'delay-reports'
    ],
    controller: [
      'train-tracking',
      'safety-alerts',
      'system-status',
      'emergency-response'
    ],
    user: [
      'train-status',
      'delay-notifications',
      'pnr-updates'
    ]
  }

  return permissions[role] || permissions['user'] || ['train-status', 'delay-notifications', 'pnr-updates']
}

// Get appropriate WebSocket URL based on role
function getWebSocketUrl(role: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
  
  const urlMap: Record<string, string> = {
    admin: `${baseUrl}/admin-stream`,
    operator: `${baseUrl}/operator-stream`,
    controller: `${baseUrl}/control-stream`,
    user: `${baseUrl}/user-stream`
  }

  return urlMap[role] || urlMap['user'] || 'ws://localhost:3001/user-stream'
}

// Optional: GET endpoint to verify token validity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided" })
    }

    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    
    return NextResponse.json({
      valid: true,
      userId: payload.userId,
      role: payload.role,
      permissions: payload.permissions,
      division: payload.division,
      expiresIn: Math.floor((payload.timestamp + (WS_TOKEN_EXPIRY * 1000) - Date.now()) / 1000)
    })

  } catch (error) {
    return NextResponse.json({ valid: false, error: "Invalid token" })
  }
}