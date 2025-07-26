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

    const trainWithLiveData = {
      ...train,
      currentPosition: {
        latitude: 12.9716 + (Math.random() - 0.5) * 4,
        longitude: 77.5946 + (Math.random() - 0.5) * 4,
        speed: Math.floor(Math.random() * 100) + 20,
        lastUpdated: new Date().toISOString()
      },
      liveStatus: {
        currentDelay: Math.floor(Math.random() * 30),
        nextStation: train.viaStations[0] || train.toName,
        platformNumber: Math.floor(Math.random() * 8) + 1
      }
    }

    return NextResponse.json(trainWithLiveData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch train details' }, { status: 500 })
  }
}