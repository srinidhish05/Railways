import { NextResponse } from 'next/server'
import { karnatakaTrains } from '@/data/karnataka-trains'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '12.9716')
    const lng = parseFloat(searchParams.get('lng') || '77.5946')

    // Get 5 random nearby trains with safety monitoring
    const nearbyTrains = karnatakaTrains
      .slice(0, 5)
      .map(train => {
        const distance = Math.round(Math.random() * 10 * 100) / 100 // km
        const speed = Math.floor(Math.random() * 80) + 20 // km/h
        // Collision risk logic: high risk if distance < 1km and speed > 60
        let collisionRisk = 'Low'
        let safetyStatus = 'Safe'
        if (distance < 1 && speed > 60) {
          collisionRisk = 'High'
          safetyStatus = 'Critical'
        } else if (distance < 2 && speed > 40) {
          collisionRisk = 'Medium'
          safetyStatus = 'Warning'
        }
        return {
          trainNumber: train.trainNumber,
          name: train.trainName,
          type: train.type,
          latitude: lat + (Math.random() - 0.5) * 0.1,
          longitude: lng + (Math.random() - 0.5) * 0.1,
          distance,
          confidence: Math.floor(Math.random() * 30) + 70,
          direction: train.fromName + ' → ' + train.toName,
          speed,
          lastUpdated: new Date().toISOString(),
          collisionRisk,
          safetyStatus
        }
      })
      .sort((a, b) => a.distance - b.distance)

    // Summary of trains at risk
    const atRiskTrains = nearbyTrains.filter(t => t.collisionRisk !== 'Low')

    return NextResponse.json({ 
      success: true,
      nearbyTrains,
      atRiskTrains,
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