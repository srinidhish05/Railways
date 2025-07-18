import { NextResponse } from "next/server"
import type { TrainStatus } from "@/lib/api-client"

const mockTrains: TrainStatus[] = [
  {
    id: "12628",
    name: "Karnataka Express",
    trainNumber: "12628",
    currentStation: "SBC",
    speed: Math.floor(Math.random() * 40) + 60,
    occupancy: Math.floor(Math.random() * 30) + 60,
    temperature: Math.floor(Math.random() * 5) + 23,
    humidity: Math.floor(Math.random() * 20) + 40,
    nextStation: "TK",
    estimatedArrival: "10:45 AM",
    delay: Math.floor(Math.random() * 15),
    status: Math.random() > 0.7 ? "delayed" : "on-time",
    lastUpdated: new Date().toISOString(),
    latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
    longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
    heading: Math.floor(Math.random() * 360),
    destination: "New Delhi",
  },
  {
    id: "16022",
    name: "Kaveri Express",
    trainNumber: "16022",
    currentStation: "MYS",
    speed: Math.floor(Math.random() * 30) + 50,
    occupancy: Math.floor(Math.random() * 40) + 50,
    temperature: Math.floor(Math.random() * 6) + 25,
    humidity: Math.floor(Math.random() * 25) + 50,
    nextStation: "MYA",
    estimatedArrival: "02:30 PM",
    delay: Math.floor(Math.random() * 20),
    status: Math.random() > 0.6 ? "delayed" : "on-time",
    lastUpdated: new Date().toISOString(),
    latitude: 12.2958 + (Math.random() - 0.5) * 0.1,
    longitude: 76.6394 + (Math.random() - 0.5) * 0.1,
    heading: Math.floor(Math.random() * 360),
    destination: "Chennai",
  },
  {
    id: "17326",
    name: "Vishwamanava Express",
    trainNumber: "17326",
    currentStation: "SBC",
    speed: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 20) + 30,
    occupancy: Math.floor(Math.random() * 50) + 30,
    temperature: Math.floor(Math.random() * 4) + 22,
    humidity: Math.floor(Math.random() * 15) + 35,
    nextStation: "Departing Soon",
    estimatedArrival: "11:30 AM",
    delay: Math.floor(Math.random() * 10),
    status: Math.random() > 0.8 ? "stopped" : "on-time",
    lastUpdated: new Date().toISOString(),
    latitude: 12.9716 + (Math.random() - 0.5) * 0.05,
    longitude: 77.5946 + (Math.random() - 0.5) * 0.05,
    heading: Math.floor(Math.random() * 360),
    destination: "Mysuru",
  },
  {
    id: "12785",
    name: "Kochuveli Express",
    trainNumber: "12785",
    currentStation: "UBL",
    speed: Math.floor(Math.random() * 35) + 55,
    occupancy: Math.floor(Math.random() * 35) + 55,
    temperature: Math.floor(Math.random() * 5) + 24,
    humidity: Math.floor(Math.random() * 20) + 45,
    nextStation: "BGM",
    estimatedArrival: "04:15 PM",
    delay: Math.floor(Math.random() * 25),
    status: Math.random() > 0.7 ? "delayed" : "on-time",
    lastUpdated: new Date().toISOString(),
    latitude: 15.3173 + (Math.random() - 0.5) * 0.1,
    longitude: 75.7139 + (Math.random() - 0.5) * 0.1,
    heading: Math.floor(Math.random() * 360),
    destination: "Kochuveli",
  },
  {
    id: "16595",
    name: "Panchaganga Express",
    trainNumber: "16595",
    currentStation: "MAJN",
    speed: Math.floor(Math.random() * 25) + 45,
    occupancy: Math.floor(Math.random() * 45) + 40,
    temperature: Math.floor(Math.random() * 6) + 26,
    humidity: Math.floor(Math.random() * 30) + 55,
    nextStation: "KUDA",
    estimatedArrival: "06:20 PM",
    delay: Math.floor(Math.random() * 15),
    status: Math.random() > 0.8 ? "delayed" : "on-time",
    lastUpdated: new Date().toISOString(),
    latitude: 12.8697 + (Math.random() - 0.5) * 0.1,
    longitude: 74.842 + (Math.random() - 0.5) * 0.1,
    heading: Math.floor(Math.random() * 360),
    destination: "Kolhapur",
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      trains: mockTrains,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in trains API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch train data",
        trains: [],
      },
      { status: 500 },
    )
  }
}
