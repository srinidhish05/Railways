import { NextResponse } from 'next/server'
import { getTrainByNumber } from '@/data/karnataka-trains'

export async function GET(
  request: Request,
  { params }: { params: { trainNumber: string } }
) {
  try {
    const train = getTrainByNumber(params.trainNumber)
    
    if (!train) {
      return NextResponse.json({ error: 'Train not found' }, { status: 404 })
    }

    const speed = Math.floor(Math.random() * 100) + 20
    const currentDelay = Math.floor(Math.random() * 30)
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
    if (currentDelay > 20) {
      safetyStatus = 'Warning'
      safetyAlerts.push('Delayed, possible passenger distress')
    }
    const trainWithLiveData = {
      ...train,
      currentPosition: {
        latitude: 12.9716 + (Math.random() - 0.5) * 4,
        longitude: 77.5946 + (Math.random() - 0.5) * 4,
        speed,
        lastUpdated: new Date().toISOString()
      },
      liveStatus: {
        currentDelay,
        nextStation: train.viaStations[0] || train.toName,
        platformNumber: Math.floor(Math.random() * 8) + 1
      },
      collisionRisk,
      safetyStatus,
      safetyAlerts
    }

    return NextResponse.json(trainWithLiveData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch train details' }, { status: 500 })
  }
}