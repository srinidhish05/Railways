import { NextResponse } from 'next/server'
import { karnatakaTrains } from '@/data/karnataka-trains'

export async function GET() {
  try {
    // Get 20 random trains and make them "live"
    const shuffled = karnatakaTrains.sort(() => 0.5 - Math.random())
    const selectedTrains = shuffled.slice(0, 20)
    
    const liveTrains = selectedTrains.map(train => {
      const speed = Math.floor(Math.random() * 100) + 20
      const delay = Math.floor(Math.random() * 45)
      const occupancy = Math.floor(Math.random() * 80) + 20
      let collisionRisk = 'Low'
      let safetyStatus = 'Safe'
      const safetyAlerts: string[] = []
      if (speed > 80) {
        collisionRisk = 'High'
        safetyStatus = 'Critical'
        safetyAlerts.push('High speed, monitor for collision risk')
      } else if (speed > 60) {
        collisionRisk = 'Medium'
        safetyStatus = 'Warning'
        safetyAlerts.push('Medium speed, monitor for safety')
      }
      if (delay > 20) {
        safetyStatus = 'Warning'
        safetyAlerts.push('Delayed, possible passenger distress')
      }
      if (occupancy > 80) {
        safetyAlerts.push('High occupancy, monitor for crowding and safety')
      }
      return {
        id: train.trainNumber,
        name: train.trainName,
        trainNumber: train.trainNumber,
        latitude: 12.9716 + (Math.random() - 0.5) * 4,
        longitude: 77.5946 + (Math.random() - 0.5) * 4,
        speed,
        heading: Math.floor(Math.random() * 360),
        status: train.status === "Active" ? "on-time" : "delayed",
        delay,
        occupancy,
        currentStation: train.fromName,
        nextStation: train.viaStations[0] || train.toName,
        destination: train.toName,
        lastUpdated: new Date().toISOString(),
        collisionRisk,
        safetyStatus,
        safetyAlerts
      }
    })

    return NextResponse.json({ trains: liveTrains })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch live trains' }, { status: 500 })
  }
}