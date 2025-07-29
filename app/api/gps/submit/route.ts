import { type NextRequest, NextResponse } from "next/server"
import type { GPSCoordinate } from "@/lib/gps-tracker"
import { karnatakaTrains } from "@/data/karnataka-trains"

// Generate Karnataka trains validation from your complete dataset
const KARNATAKA_TRAINS = karnatakaTrains.reduce((acc, train) => {
  acc[train.trainNumber] = train.trainName
  return acc
}, {} as Record<string, string>)

// Karnataka region bounds for validation
const KARNATAKA_BOUNDS = {
  north: 18.45,
  south: 11.31,
  east: 78.59,
  west: 74.05
}

interface GPSSubmission {
  trainNumber: string
  positions: GPSCoordinate[]
  timestamp: number
  deviceId: string
  compressed?: boolean
  userType?: 'passenger' | 'staff' | 'driver' | 'guard'
}

interface StoredTrainData {
  trainNumber: string
  coordinates: GPSCoordinate[]
  lastUpdated: number
  contributors: Set<string>
  qualityScore: number
}

interface PositionQuality {
  score: number
  factors: {
    accuracy: number
    consistency: number
    recency: number
    contributors: number
  }
}

// Enhanced in-memory storage
const trainDataStore = new Map<string, StoredTrainData>()
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const deviceContributions = new Map<string, { count: number; lastSubmission: number }>()

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting: 10 submissions per minute per IP
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ 
        error: "Rate limit exceeded",
        message: "Too many GPS submissions. Please wait before submitting again."
      }, { status: 429 })
    }

    const submission: GPSSubmission = await request.json()

    // Validate submission structure
    const validationError = validateSubmission(submission)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Validate Karnataka train number
    if (!KARNATAKA_TRAINS[submission.trainNumber]) {
      return NextResponse.json({ 
        error: "Invalid train number",
        message: "Train number not found in Karnataka railway network",
        availableTrains: Object.keys(KARNATAKA_TRAINS).slice(0, 10), // Show first 10 for brevity
        totalTrains: Object.keys(KARNATAKA_TRAINS).length
      }, { status: 400 })
    }

    // Decompress and validate positions
    const positions = submission.compressed ? 
      decompressPositionData(submission.positions) : 
      submission.positions

    const validPositions = positions.filter(pos => 
      isValidCoordinate(pos) && isWithinKarnataka(pos)
    )

    if (validPositions.length === 0) {
      return NextResponse.json({ 
        error: "No valid coordinates within Karnataka region" 
      }, { status: 400 })
    }

    // Filter out duplicate positions
    const uniquePositions = removeDuplicatePositions(validPositions)

    // Store positions with quality analysis
    const storedData = await storeTrainPositions(
      submission.trainNumber, 
      uniquePositions, 
      submission.deviceId,
      submission.userType || 'passenger'
    )

    // Calculate enhanced live position
    const livePosition = await calculateEnhancedTrainPosition(submission.trainNumber)

    // Update contributor statistics
    updateContributorStats(submission.deviceId)

    return NextResponse.json({
      success: true,
      trainNumber: submission.trainNumber,
      trainName: KARNATAKA_TRAINS[submission.trainNumber],
      stored: uniquePositions.length,
      filtered: positions.length - uniquePositions.length,
      livePosition,
      qualityScore: storedData.qualityScore,
      contributors: storedData.contributors.size,
      timestamp: Date.now(),
      message: "GPS data processed successfully"
    })

  } catch (error) {
    console.error("GPS submission error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: "Failed to process GPS submission"
    }, { status: 500 })
  }
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(clientIP)

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + 60000 }) // 1 minute
    return true
  }

  if (limit.count >= 10) return false
  
  limit.count++
  return true
}

function validateSubmission(submission: GPSSubmission): string | null {
  if (!submission.trainNumber) return "Train number is required"
  if (!submission.positions || !Array.isArray(submission.positions)) {
    return "Valid positions array is required"
  }
  if (!submission.deviceId) return "Device ID is required"
  if (submission.positions.length === 0) return "At least one position is required"
  if (submission.positions.length > 100) return "Too many positions (max 100 per submission)"
  
  return null
}

function decompressPositionData(compressed: any[]): GPSCoordinate[] {
  return compressed.map((pos) => ({
    latitude: pos.lat || pos.latitude,
    longitude: pos.lng || pos.longitude,
    accuracy: pos.acc || pos.accuracy,
    timestamp: pos.ts || pos.timestamp,
    speed: pos.spd || pos.speed || 0,
    heading: pos.hdg || pos.heading || 0,
  }))
}

function isValidCoordinate(coord: any): coord is GPSCoordinate {
  return (
    typeof coord.latitude === "number" &&
    typeof coord.longitude === "number" &&
    typeof coord.accuracy === "number" &&
    typeof coord.timestamp === "number" &&
    coord.latitude >= -90 && coord.latitude <= 90 &&
    coord.longitude >= -180 && coord.longitude <= 180 &&
    coord.accuracy > 0 && coord.accuracy <= 500 && // Stricter accuracy requirement
    coord.timestamp > Date.now() - 3600000 && // Within last hour
    coord.timestamp <= Date.now() + 60000 // Not more than 1 minute in future
  )
}

function isWithinKarnataka(coord: GPSCoordinate): boolean {
  return (
    coord.latitude >= KARNATAKA_BOUNDS.south &&
    coord.latitude <= KARNATAKA_BOUNDS.north &&
    coord.longitude >= KARNATAKA_BOUNDS.west &&
    coord.longitude <= KARNATAKA_BOUNDS.east
  )
}

function removeDuplicatePositions(positions: GPSCoordinate[]): GPSCoordinate[] {
  const unique = new Map<string, GPSCoordinate>()
  
  positions.forEach(pos => {
    // Create key based on rounded coordinates and timestamp
    const key = `${pos.latitude.toFixed(4)}_${pos.longitude.toFixed(4)}_${Math.floor(pos.timestamp / 30000)}`
    
    // Keep the most accurate position for each key
    const existing = unique.get(key)
    if (!existing || pos.accuracy < existing.accuracy) {
      unique.set(key, pos)
    }
  })
  
  return Array.from(unique.values())
}

async function storeTrainPositions(
  trainNumber: string, 
  positions: GPSCoordinate[], 
  deviceId: string,
  userType: string
): Promise<StoredTrainData> {
  const existing = trainDataStore.get(trainNumber) || {
    trainNumber,
    coordinates: [],
    lastUpdated: 0,
    contributors: new Set<string>(),
    qualityScore: 0
  }

  // Add contributor
  existing.contributors.add(deviceId)

  // Keep only recent positions (last 2 hours)
  const twoHoursAgo = Date.now() - 7200000
  const allCoordinates = [...existing.coordinates, ...positions]
  const recentCoordinates = allCoordinates
    .filter(coord => coord.timestamp > twoHoursAgo)
    .sort((a, b) => b.timestamp - a.timestamp) // Latest first
    .slice(0, 200) // Keep max 200 positions

  // Calculate quality score
  const qualityScore = calculateDataQuality(recentCoordinates, existing.contributors.size)

  const updatedData = {
    trainNumber,
    coordinates: recentCoordinates,
    lastUpdated: Date.now(),
    contributors: existing.contributors,
    qualityScore: qualityScore.score
  }

  trainDataStore.set(trainNumber, updatedData)
  return updatedData
}

function calculateDataQuality(positions: GPSCoordinate[], contributorCount: number): PositionQuality {
  if (positions.length === 0) {
    return { score: 0, factors: { accuracy: 0, consistency: 0, recency: 0, contributors: 0 } }
  }

  // Accuracy factor (better accuracy = higher score)
  const avgAccuracy = positions.reduce((sum, pos) => sum + pos.accuracy, 0) / positions.length
  const accuracyScore = Math.max(0, Math.min(100, (100 - avgAccuracy) * 2))

  // Consistency factor (less variance in positions = higher score)
  const consistencyScore = calculatePositionConsistency(positions)

  // Recency factor (more recent data = higher score)
  const latestTimestamp = Math.max(...positions.map(p => p.timestamp))
  const recencyMinutes = (Date.now() - latestTimestamp) / 60000
  const recencyScore = Math.max(0, Math.min(100, 100 - recencyMinutes * 2))

  // Contributors factor (more contributors = higher confidence)
  const contributorsScore = Math.min(100, contributorCount * 10)

  const overallScore = (accuracyScore * 0.3 + consistencyScore * 0.2 + recencyScore * 0.3 + contributorsScore * 0.2)

  return {
    score: Math.round(overallScore),
    factors: {
      accuracy: Math.round(accuracyScore),
      consistency: Math.round(consistencyScore),
      recency: Math.round(recencyScore),
      contributors: Math.round(contributorsScore)
    }
  }
}

function calculatePositionConsistency(positions: GPSCoordinate[]): number {
  if (positions.length < 2) return 100

  // Calculate variance in positions over time
  const distances = []
  for (let i = 1; i < positions.length; i++) {
    const distance = calculateDistance(positions[i-1], positions[i])
    const timeDiff = Math.abs(positions[i].timestamp - positions[i-1].timestamp) / 1000 // seconds
    const speed = distance / timeDiff * 3600 // km/h
    
    // Reasonable train speed is 0-120 km/h
    if (speed <= 120) distances.push(distance)
  }

  if (distances.length === 0) return 50

  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length
  
  // Lower variance = higher consistency
  return Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 10))
}

function calculateDistance(pos1: GPSCoordinate, pos2: GPSCoordinate): number {
  const R = 6371 // Earth's radius in km
  const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180
  const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

async function calculateEnhancedTrainPosition(trainNumber: string) {
  const trainData = trainDataStore.get(trainNumber)
  if (!trainData || trainData.coordinates.length === 0) return null

  // Use positions from last 10 minutes for live calculation
  const tenMinutesAgo = Date.now() - 600000
  const recentPositions = trainData.coordinates
    .filter(coord => coord.timestamp > tenMinutesAgo)
    .sort((a, b) => b.timestamp - a.timestamp)

  if (recentPositions.length === 0) return null

  // Weighted average based on accuracy and recency
  let totalWeight = 0
  let weightedLat = 0
  let weightedLng = 0
  let avgSpeed = 0

  recentPositions.forEach(pos => {
    const recencyWeight = 1 - ((Date.now() - pos.timestamp) / 600000) // 0-1 based on recency
    const accuracyWeight = 1 / pos.accuracy // Better accuracy = higher weight
    const weight = recencyWeight * accuracyWeight

    weightedLat += pos.latitude * weight
    weightedLng += pos.longitude * weight
    avgSpeed += (pos.speed || 0) * weight
    totalWeight += weight
  })

  const calculatedPosition = {
    latitude: weightedLat / totalWeight,
    longitude: weightedLng / totalWeight,
    accuracy: Math.min(...recentPositions.map(p => p.accuracy)),
    timestamp: Date.now(),
    speed: Math.round(avgSpeed / totalWeight),
    heading: recentPositions[0].heading || 0
  }

  // Safety monitoring logic
  let collisionRisk = 'Low'
  let safetyStatus = 'Safe'
  const safetyAlerts: string[] = []
  // If speed > 60 and more than 2 positions in last 10 min, high risk
  if (calculatedPosition.speed > 60 && recentPositions.length > 2) {
    collisionRisk = 'High'
    safetyStatus = 'Critical'
    safetyAlerts.push('High collision risk: train moving at high speed')
  } else if (calculatedPosition.speed > 40 && recentPositions.length > 2) {
    collisionRisk = 'Medium'
    safetyStatus = 'Warning'
    safetyAlerts.push('Medium collision risk: train moving quickly')
  }
  // If latest position is older than 5 min, add delay alert
  if (Date.now() - calculatedPosition.timestamp > 300000) {
    safetyStatus = 'Warning'
    safetyAlerts.push('Delay critical: train position not updated in last 5 minutes')
  }

  return {
    trainNumber,
    trainName: KARNATAKA_TRAINS[trainNumber],
    position: calculatedPosition,
    contributorCount: trainData.contributors.size,
    positionsUsed: recentPositions.length,
    qualityScore: trainData.qualityScore,
    lastUpdated: Date.now(),
    confidence: Math.min(recentPositions.length * 15, 100),
    dataAge: Date.now() - recentPositions[0].timestamp,
    source: 'Karnataka Railway GPS Network',
    collisionRisk,
    safetyStatus,
    safetyAlerts
  }
}

function updateContributorStats(deviceId: string) {
  const existing = deviceContributions.get(deviceId) || { count: 0, lastSubmission: 0 }
  deviceContributions.set(deviceId, {
    count: existing.count + 1,
    lastSubmission: Date.now()
  })
}

// GET endpoint to retrieve train data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const trainNumber = searchParams.get('train')

  if (!trainNumber) {
    // Return summary of all tracked trains
    const summary = Array.from(trainDataStore.entries()).map(([number, data]) => ({
      trainNumber: number,
      trainName: KARNATAKA_TRAINS[number],
      lastUpdated: data.lastUpdated,
      contributors: data.contributors.size,
      qualityScore: data.qualityScore,
      positionCount: data.coordinates.length
    }))

    return NextResponse.json({
      success: true,
      trackedTrains: summary.length,
      totalAvailableTrains: Object.keys(KARNATAKA_TRAINS).length,
      trains: summary,
      timestamp: Date.now()
    })
  }

  // Return specific train data
  const trainData = trainDataStore.get(trainNumber)
  if (!trainData) {
    return NextResponse.json({ 
      success: false,
      error: "No data available for this train",
      trainNumber,
      trainName: KARNATAKA_TRAINS[trainNumber] || "Unknown"
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    trainNumber,
    trainName: KARNATAKA_TRAINS[trainNumber],
    contributors: trainData.contributors.size,
    qualityScore: trainData.qualityScore,
    positionCount: trainData.coordinates.length,
    lastUpdated: trainData.lastUpdated,
    recentPositions: trainData.coordinates.slice(0, 10), // Last 10 positions
    timestamp: Date.now()
  })
}