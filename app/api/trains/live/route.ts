import { NextResponse } from 'next/server'
import { karnatakaTrains } from '@/data/karnataka-trains'

export async function GET() {
  try {
    // Get 20 random trains and make them "live"
    const shuffled = karnatakaTrains.sort(() => 0.5 - Math.random())
    const selectedTrains = shuffled.slice(0, 20)
    
    const liveTrains = selectedTrains.map(train => ({
      id: train.trainNumber,
      name: train.trainName,
      trainNumber: train.trainNumber,
      latitude: 12.9716 + (Math.random() - 0.5) * 4, // Karnataka coordinates
      longitude: 77.5946 + (Math.random() - 0.5) * 4,
      speed: Math.floor(Math.random() * 100) + 20,
      heading: Math.floor(Math.random() * 360),
      status: train.status === "Active" ? "on-time" : "delayed",
      delay: Math.floor(Math.random() * 45),
      occupancy: Math.floor(Math.random() * 80) + 20,
      currentStation: train.fromName,
      nextStation: train.viaStations[0] || train.toName,
      destination: train.toName,
      lastUpdated: new Date().toISOString()
    }))

    return NextResponse.json({ trains: liveTrains })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch live trains' }, { status: 500 })
  }
}