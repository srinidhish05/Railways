import { NextResponse } from "next/server"

// Complete Karnataka Railway trains database
const KARNATAKA_TRAINS = [
  // SBC Routes
  {
    trainNumber: "12628",
    trainName: "Karnataka Express",
    from: "SBC",
    to: "NDLS",
    departureTime: "20:00",
    arrivalTime: "06:40",
    travelTime: "34h 40m",
    distance: 2477,
    classes: {
      "1A": { fare: 8500, available: "RAC 12", waitingList: 0 },
      "2A": { fare: 4800, available: "Available 15", waitingList: 0 },
      "3A": { fare: 3200, available: "RAC 25", waitingList: 8 },
      "SL": { fare: 1100, available: "WL 45", waitingList: 45 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Superfast"
  },
  {
    trainNumber: "12627",
    trainName: "Karnataka Express",
    from: "NDLS",
    to: "SBC",
    departureTime: "15:55",
    arrivalTime: "02:20",
    travelTime: "34h 25m",
    distance: 2477,
    classes: {
      "1A": { fare: 8500, available: "Available 8", waitingList: 0 },
      "2A": { fare: 4800, available: "RAC 18", waitingList: 5 },
      "3A": { fare: 3200, available: "WL 35", waitingList: 35 },
      "SL": { fare: 1100, available: "WL 82", waitingList: 82 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Superfast"
  },
  {
    trainNumber: "17326",
    trainName: "Vishwamanava Express",
    from: "SBC",
    to: "MYS",
    departureTime: "08:20",
    arrivalTime: "11:30",
    travelTime: "03h 10m",
    distance: 139,
    classes: {
      "CC": { fare: 385, available: "Available 45", waitingList: 0 },
      "2S": { fare: 95, available: "Available 78", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "17325",
    trainName: "Vishwamanava Express",
    from: "MYS",
    to: "SBC",
    departureTime: "15:30",
    arrivalTime: "18:40",
    travelTime: "03h 10m",
    distance: 139,
    classes: {
      "CC": { fare: 385, available: "Available 32", waitingList: 0 },
      "2S": { fare: 95, available: "Available 65", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16535",
    trainName: "Gol Gumbaz Express",
    from: "SBC",
    to: "BJP",
    departureTime: "19:00",
    arrivalTime: "07:00",
    travelTime: "12h 00m",
    distance: 555,
    classes: {
      "2A": { fare: 2350, available: "WL 15", waitingList: 15 },
      "3A": { fare: 1680, available: "Available 8", waitingList: 0 },
      "SL": { fare: 620, available: "Available 28", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16536",
    trainName: "Gol Gumbaz Express",
    from: "BJP",
    to: "SBC",
    departureTime: "18:45",
    arrivalTime: "06:45",
    travelTime: "12h 00m",
    distance: 555,
    classes: {
      "2A": { fare: 2350, available: "Available 12", waitingList: 0 },
      "3A": { fare: 1680, available: "RAC 15", waitingList: 8 },
      "SL": { fare: 620, available: "Available 35", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "11301",
    trainName: "Udyan Express",
    from: "SBC",
    to: "UBL",
    departureTime: "22:30",
    arrivalTime: "09:15",
    travelTime: "10h 45m",
    distance: 485,
    classes: {
      "2A": { fare: 2180, available: "Available 18", waitingList: 0 },
      "3A": { fare: 1550, available: "Available 25", waitingList: 0 },
      "SL": { fare: 540, available: "Available 42", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail"
  },
  {
    trainNumber: "11302",
    trainName: "Udyan Express",
    from: "UBL",
    to: "SBC",
    departureTime: "21:00",
    arrivalTime: "07:45",
    travelTime: "10h 45m",
    distance: 485,
    classes: {
      "2A": { fare: 2180, available: "RAC 8", waitingList: 2 },
      "3A": { fare: 1550, available: "Available 22", waitingList: 0 },
      "SL": { fare: 540, available: "Available 38", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail"
  },

  // YPR Routes
  {
    trainNumber: "16515",
    trainName: "Yesvantpur Karwar Express",
    from: "YPR",
    to: "KRW",
    departureTime: "18:30",
    arrivalTime: "08:30",
    travelTime: "14h 00m",
    distance: 642,
    classes: {
      "2A": { fare: 2720, available: "Available 15", waitingList: 0 },
      "3A": { fare: 1940, available: "RAC 12", waitingList: 5 },
      "SL": { fare: 710, available: "WL 25", waitingList: 25 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16516",
    trainName: "Karwar Yesvantpur Express",
    from: "KRW",
    to: "YPR",
    departureTime: "19:45",
    arrivalTime: "09:45",
    travelTime: "14h 00m",
    distance: 642,
    classes: {
      "2A": { fare: 2720, available: "RAC 8", waitingList: 3 },
      "3A": { fare: 1940, available: "Available 18", waitingList: 0 },
      "SL": { fare: 710, available: "Available 32", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },

  // MYS Routes
  {
    trainNumber: "16022",
    trainName: "Kaveri Express",
    from: "MYS",
    to: "MAS",
    departureTime: "21:00",
    arrivalTime: "06:00",
    travelTime: "09h 00m",
    distance: 497,
    classes: {
      "2A": { fare: 1850, available: "Available 8", waitingList: 0 },
      "3A": { fare: 1320, available: "Available 12", waitingList: 0 },
      "SL": { fare: 485, available: "Available 25", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16021",
    trainName: "Kaveri Express",
    from: "MAS",
    to: "MYS",
    departureTime: "20:45",
    arrivalTime: "05:45",
    travelTime: "09h 00m",
    distance: 497,
    classes: {
      "2A": { fare: 1850, available: "RAC 12", waitingList: 8 },
      "3A": { fare: 1320, available: "Available 15", waitingList: 0 },
      "SL": { fare: 485, available: "WL 18", waitingList: 18 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "56915",
    trainName: "Bengaluru Mysuru Passenger",
    from: "SBC",
    to: "MYS",
    departureTime: "06:30",
    arrivalTime: "10:15",
    travelTime: "03h 45m",
    distance: 139,
    classes: {
      "2S": { fare: 45, available: "Available 125", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Passenger"
  },
  {
    trainNumber: "56916",
    trainName: "Mysuru Bengaluru Passenger",
    from: "MYS",
    to: "SBC",
    departureTime: "18:45",
    arrivalTime: "22:30",
    travelTime: "03h 45m",
    distance: 139,
    classes: {
      "2S": { fare: 45, available: "Available 98", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Passenger"
  },

  // UBL Routes
  {
    trainNumber: "16591",
    trainName: "Hampi Express",
    from: "UBL",
    to: "MYS",
    departureTime: "18:30",
    arrivalTime: "06:00",
    travelTime: "11h 30m",
    distance: 385,
    classes: {
      "2A": { fare: 1650, available: "RAC 5", waitingList: 2 },
      "3A": { fare: 1180, available: "Available 18", waitingList: 0 },
      "SL": { fare: 425, available: "WL 12", waitingList: 12 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16592",
    trainName: "Hampi Express",
    from: "MYS",
    to: "UBL",
    departureTime: "18:30",
    arrivalTime: "06:00",
    travelTime: "11h 30m",
    distance: 385,
    classes: {
      "2A": { fare: 1650, available: "Available 12", waitingList: 0 },
      "3A": { fare: 1180, available: "RAC 8", waitingList: 3 },
      "SL": { fare: 425, available: "Available 28", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },

  // BGM Routes
  {
    trainNumber: "16589",
    trainName: "Rani Chennamma Express",
    from: "BGM",
    to: "SBC",
    departureTime: "21:30",
    arrivalTime: "07:00",
    travelTime: "09h 30m",
    distance: 502,
    classes: {
      "1A": { fare: 3850, available: "Available 2", waitingList: 0 },
      "2A": { fare: 2200, available: "RAC 8", waitingList: 3 },
      "3A": { fare: 1580, available: "Available 22", waitingList: 0 },
      "SL": { fare: 550, available: "Available 35", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16590",
    trainName: "Rani Chennamma Express",
    from: "SBC",
    to: "BGM",
    departureTime: "22:15",
    arrivalTime: "07:45",
    travelTime: "09h 30m",
    distance: 502,
    classes: {
      "1A": { fare: 3850, available: "RAC 3", waitingList: 1 },
      "2A": { fare: 2200, available: "Available 15", waitingList: 0 },
      "3A": { fare: 1580, available: "Available 28", waitingList: 0 },
      "SL": { fare: 550, available: "WL 8", waitingList: 8 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },

  // MAQ Routes
  {
    trainNumber: "12079",
    trainName: "Jan Shatabdi Express",
    from: "MAQ",
    to: "SBC",
    departureTime: "07:30",
    arrivalTime: "14:30",
    travelTime: "07h 00m",
    distance: 352,
    classes: {
      "CC": { fare: 920, available: "Available 25", waitingList: 0 },
      "2S": { fare: 285, available: "Available 42", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi"
  },
  {
    trainNumber: "12080",
    trainName: "Jan Shatabdi Express",
    from: "SBC",
    to: "MAQ",
    departureTime: "16:45",
    arrivalTime: "23:45",
    travelTime: "07h 00m",
    distance: 352,
    classes: {
      "CC": { fare: 920, available: "Available 18", waitingList: 0 },
      "2S": { fare: 285, available: "Available 35", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Shatabdi"
  },
  {
    trainNumber: "11035",
    trainName: "Sharavati Express",
    from: "SBC",
    to: "KRW",
    departureTime: "13:15",
    arrivalTime: "03:30",
    travelTime: "14h 15m",
    distance: 645,
    classes: {
      "2A": { fare: 2750, available: "Available 8", waitingList: 0 },
      "3A": { fare: 1960, available: "RAC 15", waitingList: 12 },
      "SL": { fare: 715, available: "WL 35", waitingList: 35 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail"
  },
  {
    trainNumber: "11036",
    trainName: "Sharavati Express",
    from: "KRW",
    to: "SBC",
    departureTime: "14:30",
    arrivalTime: "04:45",
    travelTime: "14h 15m",
    distance: 645,
    classes: {
      "2A": { fare: 2750, available: "RAC 12", waitingList: 5 },
      "3A": { fare: 1960, available: "Available 18", waitingList: 0 },
      "SL": { fare: 715, available: "Available 28", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Mail"
  },

  // Additional Karnataka Routes
  {
    trainNumber: "16339",
    trainName: "Nagarcoil Express",
    from: "SBC",
    to: "NCJ",
    departureTime: "11:30",
    arrivalTime: "13:45",
    travelTime: "26h 15m",
    distance: 1267,
    classes: {
      "2A": { fare: 4250, available: "Available 12", waitingList: 0 },
      "3A": { fare: 3020, available: "RAC 18", waitingList: 8 },
      "SL": { fare: 1050, available: "WL 25", waitingList: 25 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  },
  {
    trainNumber: "16340",
    trainName: "Nagarcoil Express",
    from: "NCJ",
    to: "SBC",
    departureTime: "16:20",
    arrivalTime: "18:35",
    travelTime: "26h 15m",
    distance: 1267,
    classes: {
      "2A": { fare: 4250, available: "RAC 8", waitingList: 2 },
      "3A": { fare: 3020, available: "Available 15", waitingList: 0 },
      "SL": { fare: 1050, available: "Available 32", waitingList: 0 }
    },
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "Express"
  }
]

// Karnataka stations database
const KARNATAKA_STATIONS = [
  { code: "SBC", name: "KSR Bengaluru City Jn", zone: "SWR", state: "Karnataka" },
  { code: "YPR", name: "Yesvantpur Jn", zone: "SWR", state: "Karnataka" },
  { code: "MYS", name: "Mysuru Jn", zone: "SWR", state: "Karnataka" },
  { code: "UBL", name: "Hubballi Jn", zone: "SWR", state: "Karnataka" },
  { code: "MAQ", name: "Mangaluru Central", zone: "SWR", state: "Karnataka" },
  { code: "BGM", name: "Belagavi", zone: "SWR", state: "Karnataka" },
  { code: "TK", name: "Tumakuru", zone: "SWR", state: "Karnataka" },
  { code: "MYA", name: "Mandya", zone: "SWR", state: "Karnataka" },
  { code: "GDG", name: "Gadag Jn", zone: "SWR", state: "Karnataka" },
  { code: "LD", name: "Londa Jn", zone: "SWR", state: "Karnataka" },
  { code: "UD", name: "Udupi", zone: "SWR", state: "Karnataka" },
  { code: "BJP", name: "Vijayapura", zone: "SWR", state: "Karnataka" },
  { code: "BAY", name: "Ballari Jn", zone: "SWR", state: "Karnataka" },
  { code: "ASK", name: "Arsikere Jn", zone: "SWR", state: "Karnataka" },
  { code: "DVG", name: "Davangere", zone: "SWR", state: "Karnataka" },
  { code: "SMET", name: "Shivamogga Town", zone: "SWR", state: "Karnataka" },
  { code: "HAS", name: "Hassan Jn", zone: "SWR", state: "Karnataka" },
  { code: "KRW", name: "Karwar", zone: "SWR", state: "Karnataka" },
  // Major connecting stations
  { code: "MAS", name: "MGR Chennai Central", zone: "SR", state: "Tamil Nadu" },
  { code: "NDLS", name: "New Delhi", zone: "NR", state: "Delhi" },
  { code: "MAO", name: "Madgaon Jn", zone: "KR", state: "Goa" },
  { code: "NCJ", name: "Nagarcoil Jn", zone: "SR", state: "Tamil Nadu" }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")?.toUpperCase()
    const to = searchParams.get("to")?.toUpperCase()
    const date = searchParams.get("date") // YYYY-MM-DD
    const type = searchParams.get("type") // 'trains' or 'stations'
    const query = searchParams.get("query")?.toLowerCase() // for station search
    const classType = searchParams.get("class") // specific class filter

    // Simulate realistic API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Station search functionality
    if (type === "stations" && query) {
      const filteredStations = KARNATAKA_STATIONS.filter(
        (station) => 
          station.name.toLowerCase().includes(query) || 
          station.code.toLowerCase().includes(query)
      ).slice(0, 10) // Limit to 10 results

      return NextResponse.json({
        success: true,
        stations: filteredStations,
        count: filteredStations.length,
        searchQuery: query
      })
    }

    // Validate required parameters for train search
    if (!from || !to) {
      return NextResponse.json({ 
        error: "Missing required parameters",
        required: ["from", "to"],
        optional: ["date", "class"],
        example: "/api/irctc/search?from=SBC&to=MYS&date=2024-07-25"
      }, { status: 400 })
    }

    // Validate station codes
    const fromStation = KARNATAKA_STATIONS.find(s => s.code === from)
    const toStation = KARNATAKA_STATIONS.find(s => s.code === to)

    if (!fromStation) {
      return NextResponse.json({ 
        error: `Invalid 'from' station code: ${from}`,
        availableStations: KARNATAKA_STATIONS.map(s => `${s.code} - ${s.name}`)
      }, { status: 400 })
    }

    if (!toStation) {
      return NextResponse.json({ 
        error: `Invalid 'to' station code: ${to}`,
        availableStations: KARNATAKA_STATIONS.map(s => `${s.code} - ${s.name}`)
      }, { status: 400 })
    }

    // Filter trains by route
    let availableTrains = KARNATAKA_TRAINS.filter(train => 
      train.from === from && train.to === to
    )

    // If no direct trains, check for connecting routes
    if (availableTrains.length === 0) {
      const connectingTrains = findConnectingTrains(from, to)
      if (connectingTrains.length > 0) {
        return NextResponse.json({
          success: true,
          directTrains: [],
          connectingRoutes: connectingTrains,
          searchDetails: {
            from: `${from} - ${fromStation.name}`,
            to: `${to} - ${toStation.name}`,
            date: date || "Not specified",
            message: "No direct trains found, showing connecting routes"
          }
        })
      }
    }

    // Apply class filter if specified
    if (classType) {
      availableTrains = availableTrains.filter(train => 
        Object.keys(train.classes).includes(classType.toUpperCase())
      )
    }

    // Simulate date-based availability changes
    if (date) {
      availableTrains = simulateDateBasedAvailability(availableTrains, date)
    }

    // Sort by departure time
    availableTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime))

    return NextResponse.json({
      success: true,
      trains: availableTrains,
      count: availableTrains.length,
      searchDetails: {
        from: `${from} - ${fromStation.name}`,
        to: `${to} - ${toStation.name}`,
        date: date || "Not specified",
        class: classType || "All classes"
      },
      metadata: {
        searchTime: new Date().toISOString(),
        zone: fromStation.zone,
        apiVersion: "1.0"
      }
    })

  } catch (error) {
    console.error("Train search error:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: "Failed to search trains"
    }, { status: 500 })
  }
}

// Find connecting trains between stations
function findConnectingTrains(from: string, to: string) {
  const connectingStations = ["SBC", "MYS", "UBL", "MAQ", "YPR"] // Major junctions
  const connections = []

  for (const hub of connectingStations) {
    if (hub === from || hub === to) continue

    const firstLeg = KARNATAKA_TRAINS.find(t => t.from === from && t.to === hub)
    const secondLeg = KARNATAKA_TRAINS.find(t => t.from === hub && t.to === to)

    if (firstLeg && secondLeg) {
      // Check if connection time is reasonable (at least 1 hour gap)
      const arrivalTime = timeToMinutes(firstLeg.arrivalTime)
      const departureTime = timeToMinutes(secondLeg.departureTime)
      const layoverTime = departureTime - arrivalTime

      if (layoverTime >= 60 && layoverTime <= 480) { // 1-8 hours layover
        connections.push({
          route: `${from} → ${hub} → ${to}`,
          trains: [firstLeg, secondLeg],
          totalTime: calculateTotalTravelTime(firstLeg.travelTime, secondLeg.travelTime, layoverTime),
          layover: `${Math.floor(layoverTime / 60)}h ${layoverTime % 60}m at ${hub}`
        })
      }
    }
  }

  return connections
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function calculateTotalTravelTime(time1: string, time2: string, layover: number): string {
  const parseTime = (time: string) => {
    const [hours, minutes] = time.match(/(\d+)h (\d+)m/)?.slice(1).map(Number) || [0, 0]
    return hours * 60 + minutes
  }

  const total = parseTime(time1) + parseTime(time2) + layover
  return `${Math.floor(total / 60)}h ${total % 60}m`
}

// Simulate availability changes based on date
function simulateDateBasedAvailability(trains: any[], date: string) {
  const targetDate = new Date(date)
  const today = new Date()
  const daysAhead = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return trains.map(train => {
    const updatedTrain = { ...train }
    
    // Simulate availability changes based on how far ahead the date is
    Object.keys(train.classes).forEach(classKey => {
      const classInfo = { ...train.classes[classKey] }
      
      if (daysAhead < 0) {
        // Past date
        classInfo.available = "Not Available"
        classInfo.waitingList = 0
      } else if (daysAhead === 0) {
        // Today - limited availability
        classInfo.available = classInfo.available.includes("Available") ? 
          `Available ${Math.floor(Math.random() * 5)}` : classInfo.available
      } else if (daysAhead > 120) {
        // More than 120 days - booking not open
        classInfo.available = "Booking Not Open"
        classInfo.waitingList = 0
      }
      
      updatedTrain.classes[classKey] = classInfo
    })

    return updatedTrain
  })
}