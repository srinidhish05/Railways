import { type NextRequest, NextResponse } from "next/server"
import type { GPSCoordinate } from "@/lib/gps-tracker"

// Simulated Firebase/Firestore operations
interface GPSSubmission {
  trainNumber: string
  positions: GPSCoordinate[]
  timestamp: number
  deviceId: string
  compressed?: boolean
}

interface StoredTrainData {
  trainNumber: string
  coordinates: GPSCoordinate[]
  lastUpdated: number
}

// In-memory storage for demo (use Firebase/Firestore in production)
const trainDataStore = new Map<string, StoredTrainData>()

export async function POST(request: NextRequest) {
  try {
    const submission: GPSSubmission = await request.json()

    // Validate submission
    if (!submission.trainNumber || !submission.positions || !Array.isArray(submission.positions)) {
      return NextResponse.json({ error: "Invalid submission format" }, { status: 400 })
    }

    // Decompress data if needed
    const positions = submission.compressed ? decompressPositionData(submission.positions) : submission.positions

    // Validate coordinates
    const validPositions = positions.filter(isValidCoordinate)

    if (validPositions.length === 0) {
      return NextResponse.json({ error: "No valid coordinates provided" }, { status: 400 })
    }

    // Store in Firebase/Firestore (simulated)
    await storeTrainPositions(submission.trainNumber, validPositions, submission.deviceId)

    // Calculate and update live position
    const livePosition = await calculateLiveTrainPosition(submission.trainNumber)

    return NextResponse.json({
      success: true,
      stored: validPositions.length,
      livePosition,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("GPS submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function decompressPositionData(compressed: any[]): GPSCoordinate[] {
  return compressed.map((pos) => ({
    latitude: pos.lat,
    longitude: pos.lng,
    accuracy: pos.acc,
    timestamp: pos.ts,
    speed: pos.spd,
    heading: pos.hdg,
  }))
}

function isValidCoordinate(coord: any): coord is GPSCoordinate {
  return (
    typeof coord.latitude === "number" &&
    typeof coord.longitude === "number" &&
    typeof coord.accuracy === "number" &&
    typeof coord.timestamp === "number" &&
    coord.latitude >= -90 &&
    coord.latitude <= 90 &&
    coord.longitude >= -180 &&
    coord.longitude <= 180 &&
    coord.accuracy > 0 &&
    coord.accuracy <= 1000 &&
    coord.timestamp > 0
  )
}

async function storeTrainPositions(trainNumber: string, positions: GPSCoordinate[], deviceId: string): Promise<void> {
  // In production, this would be:
  // const db = getFirestore()
  // const trainRef = doc(db, 'trains', trainNumber)
  // await updateDoc(trainRef, {
  //   coordinates: arrayUnion(...positions),
  //   lastUpdated: serverTimestamp(),
  //   contributors: arrayUnion(deviceId)
  // })

  // Simulated storage
  const existing = trainDataStore.get(trainNumber) || {
    trainNumber,
    coordinates: [],
    lastUpdated: 0,
  }

  // Add new positions and keep only recent ones (last 1 hour)
  const oneHourAgo = Date.now() - 3600000
  const allCoordinates = [...existing.coordinates, ...positions]
  const recentCoordinates = allCoordinates.filter((coord) => coord.timestamp > oneHourAgo)

  trainDataStore.set(trainNumber, {
    trainNumber,
    coordinates: recentCoordinates,
    lastUpdated: Date.now(),
  })
}

async function calculateLiveTrainPosition(trainNumber: string) {
  // In production, this would query Firebase/Firestore:
  // const db = getFirestore()
  // const trainRef = doc(db, 'trains', trainNumber)
  // const trainDoc = await getDoc(trainRef)
  // const coordinates = trainDoc.data()?.coordinates || []

  const trainData = trainDataStore.get(trainNumber)
  if (!trainData) return null

  // Use the TrainPositionCalculator (would import in production)
  const recentPositions = trainData.coordinates.filter(
    (coord) => Date.now() - coord.timestamp < 300000, // Last 5 minutes
  )

  if (recentPositions.length === 0) return null

  // Simple averaging for demo (use TrainPositionCalculator.calculateTrainPosition in production)
  const avgLat = recentPositions.reduce((sum, pos) => sum + pos.latitude, 0) / recentPositions.length
  const avgLng = recentPositions.reduce((sum, pos) => sum + pos.longitude, 0) / recentPositions.length
  const avgAccuracy = recentPositions.reduce((sum, pos) => sum + pos.accuracy, 0) / recentPositions.length

  return {
    trainNumber,
    position: {
      latitude: avgLat,
      longitude: avgLng,
      accuracy: avgAccuracy,
      timestamp: Date.now(),
    },
    contributorCount: recentPositions.length,
    lastUpdated: Date.now(),
    confidence: Math.min(recentPositions.length * 10, 100),
  }
}
