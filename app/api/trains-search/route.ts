import { NextResponse } from "next/server"
import { karnatakaTrains, searchTrains, searchTrainsBetweenStations, getTrainByNumber } from "@/data/karnataka-trains"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const query = searchParams.get("query")
  const trainNumber = searchParams.get("trainNumber")
  const type = searchParams.get("type")
  const limit = searchParams.get("limit")
  
  try {
    let trains = karnatakaTrains
    
    // Search by train number
    if (trainNumber) {
      const train = getTrainByNumber(trainNumber)
      return NextResponse.json({
        success: true,
        total: train ? 1 : 0,
        trains: train ? [train] : []
      })
    }
    
    // Search between stations
    if (from && to) {
      trains = searchTrainsBetweenStations(from, to)
      return NextResponse.json({
        success: true,
        total: karnatakaTrains.length,
        returned: trains.length,
        route: `${from} → ${to}`,
        trains
      })
    }
    
    // Search by query (train name/number)
    if (query && query.length >= 2) {
      trains = searchTrains(query)
    }
    
    // Filter by train type
    if (type) {
      trains = trains.filter(train => train.type.toLowerCase() === type.toLowerCase())
    }
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit)
      trains = trains.slice(0, limitNum)
    }
    
    return NextResponse.json({
      success: true,
      total: karnatakaTrains.length,
      returned: trains.length,
      filters: { from, to, query, type },
      trains
    })
    
  } catch (error) {
    console.error("Error fetching trains:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch trains",
        trains: [] 
      },
      { status: 500 }
    )
  }
}
