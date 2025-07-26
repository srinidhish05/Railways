import { NextResponse } from 'next/server'
import { karnatakaTrains } from '@/data/karnataka-trains'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '12.9716')
    const lng = parseFloat(searchParams.get('lng') || '77.5946')

    // Get 5 random nearby trains
    const nearbyTrains = karnatakaTrains
      .slice(0, 5)
      .map(train => ({
        trainNumber: train.trainNumber,
        name: train.trainName,
        type: train.type,
        latitude: lat + (Math.random() - 0.5) * 0.1,
        longitude: lng + (Math.random() - 0.5) * 0.1,
        distance: Math.round(Math.random() * 10 * 100) / 100, // km with 2 decimals
        confidence: Math.floor(Math.random() * 30) + 70,
        direction: train.fromName + ' → ' + train.toName,
        speed: Math.floor(Math.random() * 80) + 20,
        lastUpdated: new Date().toISOString()
      }))
      .sort((a, b) => a.distance - b.distance) // Sort by distance

    return NextResponse.json({ 
      success: true,
      nearbyTrains,
      searchCenter: { lat, lng },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch nearby trains' 
    }, { status: 500 })
  }
}