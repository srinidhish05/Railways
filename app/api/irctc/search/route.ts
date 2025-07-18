import { NextResponse } from "next/server"

// Mock data for train search results
const mockTrainSearchResults = [
  {
    trainNumber: "12628",
    trainName: "Karnataka Express",
    from: "SBC",
    to: "NDLS",
    departureTime: "20:00",
    arrivalTime: "06:40",
    travelTime: "34h 40m",
    classes: ["1A", "2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16022",
    trainName: "Kaveri Express",
    from: "MYS",
    to: "MAS",
    departureTime: "21:00",
    arrivalTime: "06:00",
    travelTime: "09h 00m",
    classes: ["2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "17326",
    trainName: "Vishwamanava Express",
    from: "SBC",
    to: "MYS",
    departureTime: "08:20",
    arrivalTime: "11:30",
    travelTime: "03h 10m",
    classes: ["CC", "2S"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16591",
    trainName: "Hampi Express",
    from: "UBL",
    to: "MYS",
    departureTime: "18:30",
    arrivalTime: "06:00",
    travelTime: "11h 30m",
    classes: ["2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16589",
    trainName: "Rani Chennamma Express",
    from: "BGM",
    to: "SBC",
    departureTime: "21:30",
    arrivalTime: "07:00",
    travelTime: "09h 30m",
    classes: ["1A", "2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "12079",
    trainName: "Jan Shatabdi Express",
    from: "MAQ",
    to: "SBC",
    departureTime: "07:30",
    arrivalTime: "14:30",
    travelTime: "07h 00m",
    classes: ["CC", "2S"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16535",
    trainName: "Gol Gumbaz Express",
    from: "SBC",
    to: "BJP",
    departureTime: "19:00",
    arrivalTime: "07:00",
    travelTime: "12h 00m",
    classes: ["2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16592",
    trainName: "Hampi Express",
    from: "MYS",
    to: "UBL",
    departureTime: "18:30",
    arrivalTime: "06:00",
    travelTime: "11h 30m",
    classes: ["2A", "3A", "SL"],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
]

// Mock station data for search suggestions
const mockStations = [
  { code: "SBC", name: "KSR Bengaluru City Jn" },
  { code: "MYS", name: "Mysuru Jn" },
  { code: "UBL", name: "Hubballi Jn" },
  { code: "MAQ", name: "Mangaluru Central" },
  { code: "BGM", name: "Belagavi" },
  { code: "TK", name: "Tumakuru" },
  { code: "MYA", name: "Mandya" },
  { code: "GDG", name: "Gadag Jn" },
  { code: "LD", name: "Londa Jn" },
  { code: "UD", name: "Udupi" },
  { code: "MAS", name: "MGR Chennai Central" },
  { code: "NDLS", name: "New Delhi" },
  { code: "BJP", name: "Vijayapura" },
  { code: "GTL", name: "Guntakal Jn" },
  { code: "BAY", name: "Ballari Jn" },
  { code: "ASK", name: "Arsikere Jn" },
  { code: "DVG", name: "Davangere" },
  { code: "SMET", name: "Shivamogga Town" },
  { code: "HAS", name: "Hassan Jn" },
  { code: "MAO", name: "Madgaon Jn" },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")?.toUpperCase()
  const to = searchParams.get("to")?.toUpperCase()
  const date = searchParams.get("date") // YYYY-MM-DD
  const type = searchParams.get("type") // 'trains' or 'stations'
  const query = searchParams.get("query")?.toLowerCase() // for station search

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (type === "stations" && query) {
    const filteredStations = mockStations.filter(
      (station) => station.name.toLowerCase().includes(query) || station.code.toLowerCase().includes(query),
    )
    return NextResponse.json(filteredStations)
  }

  if (!from || !to || !date) {
    return NextResponse.json({ message: "Missing 'from', 'to', or 'date' parameters." }, { status: 400 })
  }

  const filteredTrains = mockTrainSearchResults.filter((train) => train.from === from && train.to === to)

  // In a real application, you'd also filter by date and check availability
  // For this mock, we just return matching routes.

  return NextResponse.json(filteredTrains)
}
