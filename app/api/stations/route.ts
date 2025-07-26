import { NextResponse } from "next/server"
import { karnatakaStations, searchStations } from "@/data/karnataka-stations"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const limit = searchParams.get("limit")
  
  try {
    let stations = karnatakaStations
    
    // Filter by search query if provided
    if (query && query.length >= 2) {
      stations = searchStations(query)
    }
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit)
      stations = stations.slice(0, limitNum)
    }
    
    return NextResponse.json({
      success: true,
      total: karnatakaStations.length,
      returned: stations.length,
      stations
    })
    
  } catch (error) {
    console.error("Error fetching stations:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch stations",
        stations: [] 
      },
      { status: 500 }
    )
  }
}
