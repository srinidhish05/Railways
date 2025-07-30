import { NextResponse } from "next/server"
import type { TrainStatus } from "@/lib/api-client"

// Real Karnataka train status with actual routes and realistic data
const KARNATAKA_LIVE_TRAINS: TrainStatus[] = [
  {
    id: "12628",
    name: "Karnataka Express",
    trainNumber: "12628",
    route: "SBC - NDLS",
    currentStation: "TK",
    currentStationName: "Tumakuru",
    speed: 85,
    occupancy: 92,
    temperature: 24,
    humidity: 65,
    nextStation: "ASK",
    nextStationName: "Arsikere Jn",
    estimatedArrival: "12:45 PM",
    actualDeparture: "20:15",
    scheduledDeparture: "20:00",
    delay: 15,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 13.3428,
    longitude: 77.1012,
    heading: 320,
    destination: "New Delhi",
    coaches: ["A1", "A2", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  },
  {
    id: "12627",
    name: "Karnataka Express",
    trainNumber: "12627",
    route: "NDLS - SBC",
    currentStation: "GDG",
    currentStationName: "Gadag Jn",
    speed: 78,
    occupancy: 88,
    temperature: 26,
    humidity: 58,
    nextStation: "UBL",
    nextStationName: "Hubballi Jn",
    estimatedArrival: "18:30 PM",
    actualDeparture: "16:10",
    scheduledDeparture: "15:55",
    delay: 15,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 15.4189,
    longitude: 75.6300,
    heading: 180,
    destination: "KSR Bengaluru City",
    coaches: ["A1", "A2", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  },
  {
    id: "16022",
    name: "Kaveri Express",
    trainNumber: "16022",
    route: "MYS - MAS",
    currentStation: "KPN",
    currentStationName: "Kuppam",
    speed: 72,
    occupancy: 76,
    temperature: 25,
    humidity: 72,
    nextStation: "JTJ",
    nextStationName: "Jolarpettai Jn",
    estimatedArrival: "02:15 AM",
    actualDeparture: "21:05",
    scheduledDeparture: "21:00",
    delay: 5,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 12.7302,
    longitude: 78.3480,
    heading: 90,
    destination: "Chennai Central",
    coaches: ["A1", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5", "S6"],
    pantryAvailable: true,
    wifiAvailable: true,
    currentZone: "SR"
  },
  {
    id: "16021",
    name: "Kaveri Express",
    trainNumber: "16021",
    route: "MAS - MYS",
    currentStation: "SA",
    currentStationName: "Salem Jn",
    speed: 68,
    occupancy: 82,
    temperature: 27,
    humidity: 68,
    nextStation: "ED",
    nextStationName: "Erode Jn",
    estimatedArrival: "01:20 AM",
    actualDeparture: "20:50",
    scheduledDeparture: "20:45",
    delay: 5,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 11.6643,
    longitude: 78.1460,
    heading: 270,
    destination: "Mysuru Jn",
    coaches: ["A1", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5", "S6"],
    pantryAvailable: true,
    wifiAvailable: true,
    currentZone: "SR"
  },
  {
    id: "17326",
    name: "Vishwamanava Express",
    trainNumber: "17326",
    route: "SBC - MYS",
    currentStation: "SBC",
    currentStationName: "KSR Bengaluru City Jn",
    speed: 0,
    occupancy: 65,
    temperature: 23,
    humidity: 55,
    nextStation: "BAND",
    nextStationName: "Banaswadi",
    estimatedArrival: "Departed",
    actualDeparture: "08:20",
    scheduledDeparture: "08:20",
    delay: 0,
    status: "departed",
    lastUpdated: new Date().toISOString(),
    latitude: 12.9716,
    longitude: 77.5946,
    heading: 180,
    destination: "Mysuru Jn",
    coaches: ["CC1", "CC2", "D1", "D2", "D3"],
    pantryAvailable: false,
    wifiAvailable: true,
    currentZone: "SWR"
  },
  {
    id: "17325",
    name: "Vishwamanava Express",
    trainNumber: "17325",
    route: "MYS - SBC",
    currentStation: "MYA",
    currentStationName: "Mandya",
    speed: 45,
    occupancy: 58,
    temperature: 28,
    humidity: 62,
    nextStation: "CPN",
    nextStationName: "Channapatna",
    estimatedArrival: "17:45 PM",
    actualDeparture: "15:30",
    scheduledDeparture: "15:30",
    delay: 0,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 12.5266,
    longitude: 76.8955,
    heading: 0,
    destination: "KSR Bengaluru City Jn",
    coaches: ["CC1", "CC2", "D1", "D2", "D3"],
    pantryAvailable: false,
    wifiAvailable: true,
    currentZone: "SWR"
  },
  {
    id: "16535",
    name: "Gol Gumbaz Express",
    trainNumber: "16535",
    route: "SBC - BJP",
    currentStation: "UBL",
    currentStationName: "Hubballi Jn",
    speed: 0,
    occupancy: 75,
    temperature: 25,
    humidity: 45,
    nextStation: "GDG",
    nextStationName: "Gadag Jn",
    estimatedArrival: "01:15 AM",
    actualDeparture: "00:45",
    scheduledDeparture: "00:30",
    delay: 15,
    status: "stopped",
    lastUpdated: new Date().toISOString(),
    latitude: 15.3173,
    longitude: 75.7139,
    heading: 45,
    destination: "Vijayapura",
    coaches: ["A1", "B1", "B2", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  },
  {
    id: "16536",
    name: "Gol Gumbaz Express",
    trainNumber: "16536",
    route: "BJP - SBC",
    currentStation: "BGM",
    currentStationName: "Belagavi",
    speed: 65,
    occupancy: 82,
    temperature: 24,
    humidity: 58,
    nextStation: "LD",
    nextStationName: "Londa Jn",
    estimatedArrival: "22:30 PM",
    actualDeparture: "18:50",
    scheduledDeparture: "18:45",
    delay: 5,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 15.8497,
    longitude: 74.4977,
    heading: 135,
    destination: "KSR Bengaluru City Jn",
    coaches: ["A1", "B1", "B2", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  },
  {
    id: "12079",
    name: "Jan Shatabdi Express",
    trainNumber: "12079",
    route: "MAQ - SBC",
    currentStation: "SMET",
    currentStationName: "Shivamogga Town",
    speed: 88,
    occupancy: 68,
    temperature: 22,
    humidity: 78,
    nextStation: "DVG",
    nextStationName: "Davangere",
    estimatedArrival: "11:45 AM",
    actualDeparture: "07:30",
    scheduledDeparture: "07:30",
    delay: 0,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 13.9299,
    longitude: 75.5681,
    heading: 90,
    destination: "KSR Bengaluru City Jn",
    coaches: ["CC1", "CC2", "CC3", "CC4", "D1", "D2"],
    pantryAvailable: true,
    wifiAvailable: true,
    currentZone: "SWR"
  },
  {
    id: "12080",
    name: "Jan Shatabdi Express",
    trainNumber: "12080",
    route: "SBC - MAQ",
    currentStation: "HAS",
    currentStationName: "Hassan Jn",
    speed: 82,
    occupancy: 72,
    temperature: 25,
    humidity: 68,
    nextStation: "SMET",
    nextStationName: "Shivamogga Town",
    estimatedArrival: "19:15 PM",
    actualDeparture: "16:45",
    scheduledDeparture: "16:45",
    delay: 0,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 13.0037,
    longitude: 76.0965,
    heading: 270,
    destination: "Mangaluru Central",
    coaches: ["CC1", "CC2", "CC3", "CC4", "D1", "D2"],
    pantryAvailable: true,
    wifiAvailable: true,
    currentZone: "SWR"
  },
  {
    id: "16589",
    name: "Rani Chennamma Express",
    trainNumber: "16589",
    route: "BGM - SBC",
    currentStation: "LD",
    currentStationName: "Londa Jn",
    speed: 72,
    occupancy: 85,
    temperature: 26,
    humidity: 55,
    nextStation: "CLR",
    nextStationName: "Castle Rock",
    estimatedArrival: "23:45 PM",
    actualDeparture: "21:35",
    scheduledDeparture: "21:30",
    delay: 5,
    status: "running",
    lastUpdated: new Date().toISOString(),
    latitude: 15.0833,
    longitude: 74.5167,
    heading: 120,
    destination: "KSR Bengaluru City Jn",
    coaches: ["A1", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  },
  {
    id: "16590",
    name: "Rani Chennamma Express",
    trainNumber: "16590",
    route: "SBC - BGM",
    currentStation: "YPR",
    currentStationName: "Yesvantpur Jn",
    speed: 0,
    occupancy: 78,
    temperature: 24,
    humidity: 62,
    nextStation: "TK",
    nextStationName: "Tumakuru",
    estimatedArrival: "Departed",
    actualDeparture: "22:20",
    scheduledDeparture: "22:15",
    delay: 5,
    status: "departed",
    lastUpdated: new Date().toISOString(),
    latitude: 13.0297,
    longitude: 77.5370,
    heading: 270,
    destination: "Belagavi",
    coaches: ["A1", "B1", "B2", "B3", "S1", "S2", "S3", "S4", "S5"],
    pantryAvailable: true,
    wifiAvailable: false,
    currentZone: "SWR"
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const trainNumber = searchParams.get("trainNumber")
    const status = searchParams.get("status") // running, stopped, departed, delayed
    const zone = searchParams.get("zone") // SWR, SR
    const limit = searchParams.get("limit")

    // Add realistic delay simulation
    await new Promise((resolve) => setTimeout(resolve, 200))

    let trains = [...KARNATAKA_LIVE_TRAINS]

    // Filter by train number
    if (trainNumber) {
      trains = trains.filter(train => 
        train.trainNumber.includes(trainNumber) || 
        train.name.toLowerCase().includes(trainNumber.toLowerCase())
      )
    }

    // Filter by status
    if (status) {
      trains = trains.filter(train => train.status === status)
    }

    // Filter by zone
    if (zone) {
      trains = trains.filter(train => train.currentZone === zone)
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit)
      trains = trains.slice(0, limitNum)
    }

    // Update real-time data with slight variations
    const updatedTrains = trains.map(train => {
      // Safety/collision logic
      let collisionRisk = "low";
      let safetyStatus = "safe";
      let safetyAlerts: string[] = [];
      if (train.speed > 80 && train.occupancy > 90) {
        collisionRisk = "medium";
        safetyStatus = "caution";
        safetyAlerts.push("High speed and occupancy detected. Monitor for safety.");
      }
      if (train.delay > 10) {
        safetyAlerts.push("Significant delay. Check for operational issues.");
      }
      // Fix: Use correct status values as per TrainStatus type
      if (train.status === "stopped" || train.status === "delayed" || train.status === "on-time") {
        collisionRisk = "low";
        safetyStatus = "safe";
      }
      if (train.temperature > 32) {
        safetyAlerts.push("High temperature in coaches. Monitor passenger comfort.");
      }
      return {
        ...train,
        lastUpdated: new Date().toISOString(),
        // Apply variations for trains that are on-time or delayed
        ...(train.status === "on-time" || train.status === "delayed"
          ? {
              latitude: train.latitude + (Math.random() - 0.5) * 0.001,
              longitude: train.longitude + (Math.random() - 0.5) * 0.001,
              speed: Math.max(0, train.speed + (Math.random() - 0.5) * 5),
              temperature: Math.max(18, Math.min(35, train.temperature + (Math.random() - 0.5) * 2))
            }
          : {}),
        collisionRisk,
        safetyStatus,
        safetyAlerts
      };
    });

    return NextResponse.json({
      success: true,
      trains: updatedTrains,
      count: updatedTrains.length,
      total: KARNATAKA_LIVE_TRAINS.length,
      timestamp: new Date().toISOString(),
      filters: {
        trainNumber: trainNumber || null,
        status: status || null,
        zone: zone || null,
        limit: limit ? parseInt(limit) : null
      }
    })

  } catch (error) {
    console.error("Error in trains API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch train data",
        trains: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST endpoint for updating train status (for GPS tracking integration)
export async function POST(request: Request) {
  try {
    const updateData = await request.json()
    const { trainNumber, latitude, longitude, speed, status } = updateData

    // In production, this would update database
    // For now, simulate success
    return NextResponse.json({
      success: true,
      message: `Train ${trainNumber} status updated successfully`,
      timestamp: new Date().toISOString(),
      updatedFields: {
        latitude,
        longitude,
        speed,
        status,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error updating train status:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to update train status"
    }, { status: 500 })
  }
}