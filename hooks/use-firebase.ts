"use client"

import { useState, useEffect } from "react"

// Mock Firebase implementation for demonstration
// Replace with actual Firebase SDK implementation

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

interface Train {
  id: string
  name: string
  route: string
  departure: string
  arrival: string
  totalSeats: number
  availableSeats: number
  price: number
  status: "active" | "delayed" | "cancelled"
  stations: string[]
  distance: number
  duration: string
  trainType: "Express" | "Passenger" | "Superfast" | "Mail"
}

interface BookingData {
  trainId: string
  passengerName: string
  passengerEmail: string
  seatCount: number
  travelDate: string
  trainName: string
  route: string
  price: number
  bookingDate: string
}

// Real Karnataka train data
const karnatakaTrains: Train[] = [
  // Bangalore routes
  {
    id: "12628",
    name: "Karnataka Express",
    route: "Bangalore → New Delhi",
    departure: "20:15",
    arrival: "10:45+2",
    totalSeats: 1200,
    availableSeats: 245,
    price: 1850,
    status: "active",
    stations: [
      "Bangalore",
      "Tumkur",
      "Arsikere",
      "Davangere",
      "Hubli",
      "Dharwad",
      "Belgaum",
      "Miraj",
      "Pune",
      "Mumbai",
      "Surat",
      "Vadodara",
      "Kota",
      "Jaipur",
      "New Delhi",
    ],
    distance: 2444,
    duration: "38h 30m",
    trainType: "Express",
  },
  {
    id: "12649",
    name: "Sampark Kranti Express",
    route: "Bangalore → Hazrat Nizamuddin",
    departure: "11:30",
    arrival: "18:55+1",
    totalSeats: 1100,
    availableSeats: 189,
    price: 1750,
    status: "active",
    stations: [
      "Bangalore",
      "Dharmavaram",
      "Anantapur",
      "Guntakal",
      "Kurnool",
      "Nandyal",
      "Secunderabad",
      "Nagpur",
      "Bhopal",
      "Jhansi",
      "Agra",
      "Hazrat Nizamuddin",
    ],
    distance: 2146,
    duration: "31h 25m",
    trainType: "Express",
  },
  {
    id: "16536",
    name: "Gol Gumbaz Express",
    route: "Bangalore → Solapur",
    departure: "22:30",
    arrival: "12:45+1",
    totalSeats: 800,
    availableSeats: 156,
    price: 650,
    status: "active",
    stations: ["Bangalore", "Yelahanka", "Chikkaballapur", "Guntakal", "Raichur", "Bijapur", "Solapur"],
    distance: 598,
    duration: "14h 15m",
    trainType: "Express",
  },
  {
    id: "17326",
    name: "Vishwamanava Express",
    route: "Bangalore → Mysore",
    departure: "14:00",
    arrival: "17:15",
    totalSeats: 600,
    availableSeats: 89,
    price: 180,
    status: "active",
    stations: ["Bangalore", "Ramanagara", "Channapatna", "Maddur", "Mandya", "Srirangapatna", "Mysore"],
    distance: 139,
    duration: "3h 15m",
    trainType: "Express",
  },
  {
    id: "16022",
    name: "Kaveri Express",
    route: "Bangalore → Chennai",
    departure: "13:30",
    arrival: "18:45",
    totalSeats: 900,
    availableSeats: 234,
    price: 320,
    status: "active",
    stations: [
      "Bangalore",
      "Hosur",
      "Dharmapuri",
      "Salem",
      "Erode",
      "Tirupur",
      "Coimbatore",
      "Tiruchirapalli",
      "Thanjavur",
      "Chennai",
    ],
    distance: 362,
    duration: "5h 15m",
    trainType: "Express",
  },

  // Mysore routes
  {
    id: "12614",
    name: "Tippu Express",
    route: "Mysore → Chennai",
    departure: "21:40",
    arrival: "06:30+1",
    totalSeats: 750,
    availableSeats: 167,
    price: 450,
    status: "active",
    stations: [
      "Mysore",
      "Mandya",
      "Maddur",
      "Ramanagara",
      "Bangalore",
      "Hosur",
      "Dharmapuri",
      "Salem",
      "Erode",
      "Chennai",
    ],
    distance: 497,
    duration: "8h 50m",
    trainType: "Express",
  },
  {
    id: "16230",
    name: "Mysore Express",
    route: "Mysore → Mumbai CST",
    departure: "11:10",
    arrival: "14:25+1",
    totalSeats: 1000,
    availableSeats: 298,
    price: 1200,
    status: "active",
    stations: [
      "Mysore",
      "Hassan",
      "Arsikere",
      "Tumkur",
      "Bangalore",
      "Guntakal",
      "Hubli",
      "Belgaum",
      "Miraj",
      "Pune",
      "Mumbai CST",
    ],
    distance: 1279,
    duration: "27h 15m",
    trainType: "Express",
  },

  // Hubli routes
  {
    id: "11140",
    name: "Hubli Express",
    route: "Hubli → Mumbai CST",
    departure: "20:45",
    arrival: "12:30+1",
    totalSeats: 950,
    availableSeats: 178,
    price: 850,
    status: "active",
    stations: ["Hubli", "Dharwad", "Belgaum", "Miraj", "Sangli", "Satara", "Pune", "Lonavala", "Mumbai CST"],
    distance: 571,
    duration: "15h 45m",
    trainType: "Express",
  },
  {
    id: "17312",
    name: "Vasco Express",
    route: "Hubli → Vasco da Gama",
    departure: "06:15",
    arrival: "14:30",
    totalSeats: 600,
    availableSeats: 134,
    price: 380,
    status: "active",
    stations: ["Hubli", "Dharwad", "Londa", "Dudhsagar", "Kulem", "Margao", "Vasco da Gama"],
    distance: 228,
    duration: "8h 15m",
    trainType: "Express",
  },

  // Mangalore routes
  {
    id: "12618",
    name: "Mangala Lakshadweep Express",
    route: "Mangalore → Hazrat Nizamuddin",
    departure: "21:40",
    arrival: "04:50+2",
    totalSeats: 1150,
    availableSeats: 267,
    price: 1950,
    status: "active",
    stations: [
      "Mangalore",
      "Udupi",
      "Kundapura",
      "Bhatkal",
      "Karwar",
      "Madgaon",
      "Ratnagiri",
      "Mumbai",
      "Surat",
      "Vadodara",
      "Kota",
      "Sawai Madhopur",
      "Bharatpur",
      "Hazrat Nizamuddin",
    ],
    distance: 2140,
    duration: "31h 10m",
    trainType: "Superfast",
  },
  {
    id: "16345",
    name: "Netravati Express",
    route: "Mangalore → Lokmanya Tilak",
    departure: "11:40",
    arrival: "06:25+1",
    totalSeats: 1000,
    availableSeats: 189,
    price: 1100,
    status: "active",
    stations: [
      "Mangalore",
      "Udupi",
      "Kundapura",
      "Bhatkal",
      "Gokarna",
      "Karwar",
      "Madgaon",
      "Ratnagiri",
      "Panvel",
      "Lokmanya Tilak",
    ],
    distance: 1024,
    duration: "18h 45m",
    trainType: "Express",
  },

  // Gulbarga routes
  {
    id: "17064",
    name: "Ajanta Express",
    route: "Gulbarga → Secunderabad",
    departure: "05:30",
    arrival: "12:15",
    totalSeats: 700,
    availableSeats: 145,
    price: 280,
    status: "active",
    stations: ["Gulbarga", "Shahabad", "Bidar", "Zaheerabad", "Secunderabad"],
    distance: 214,
    duration: "6h 45m",
    trainType: "Express",
  },

  // Belgaum routes
  {
    id: "11024",
    name: "Sahyadri Express",
    route: "Belgaum → Mumbai CST",
    departure: "19:20",
    arrival: "08:45+1",
    totalSeats: 850,
    availableSeats: 198,
    price: 750,
    status: "active",
    stations: ["Belgaum", "Miraj", "Sangli", "Satara", "Pune", "Lonavala", "Kalyan", "Mumbai CST"],
    distance: 519,
    duration: "13h 25m",
    trainType: "Express",
  },

  // Bijapur routes
  {
    id: "16590",
    name: "Rani Chennamma Express",
    route: "Bijapur → Bangalore",
    departure: "06:00",
    arrival: "17:30",
    totalSeats: 600,
    availableSeats: 112,
    price: 420,
    status: "active",
    stations: [
      "Bijapur",
      "Bagalkot",
      "Gadag",
      "Ranibennur",
      "Haveri",
      "Ranebennur",
      "Davangere",
      "Chitradurga",
      "Tumkur",
      "Bangalore",
    ],
    distance: 518,
    duration: "11h 30m",
    trainType: "Express",
  },

  // Hassan routes
  {
    id: "16515",
    name: "Kanniyakumari Express",
    route: "Hassan → Kanniyakumari",
    departure: "14:45",
    arrival: "14:30+1",
    totalSeats: 900,
    availableSeats: 223,
    price: 890,
    status: "active",
    stations: [
      "Hassan",
      "Sakleshpur",
      "Subramanya",
      "Mangalore",
      "Udupi",
      "Kundapura",
      "Karwar",
      "Madgaon",
      "Margao",
      "Vasco",
      "Kanniyakumari",
    ],
    distance: 1247,
    duration: "23h 45m",
    trainType: "Express",
  },

  // Daily passenger trains
  {
    id: "56906",
    name: "Bangalore Passenger",
    route: "Bangalore → Tumkur",
    departure: "06:30",
    arrival: "08:45",
    totalSeats: 400,
    availableSeats: 89,
    price: 45,
    status: "active",
    stations: ["Bangalore", "Yeshwantpur", "Nelamangala", "Dobaspet", "Tumkur"],
    distance: 70,
    duration: "2h 15m",
    trainType: "Passenger",
  },
  {
    id: "56908",
    name: "Mysore Passenger",
    route: "Mysore → Hassan",
    departure: "07:15",
    arrival: "10:30",
    totalSeats: 350,
    availableSeats: 67,
    price: 65,
    status: "active",
    stations: ["Mysore", "Krishnarajasagar", "Pandavapura", "Maddur", "Hassan"],
    distance: 118,
    duration: "3h 15m",
    trainType: "Passenger",
  },

  // Additional popular routes
  {
    id: "12785",
    name: "KSK Express",
    route: "Bangalore → Kochuveli",
    departure: "15:30",
    arrival: "12:45+1",
    totalSeats: 1000,
    availableSeats: 278,
    price: 1150,
    status: "active",
    stations: [
      "Bangalore",
      "Hosur",
      "Dharmapuri",
      "Salem",
      "Erode",
      "Coimbatore",
      "Palakkad",
      "Thrissur",
      "Ernakulam",
      "Kottayam",
      "Kollam",
      "Kochuveli",
    ],
    distance: 1024,
    duration: "21h 15m",
    trainType: "Superfast",
  },
  {
    id: "22692",
    name: "Rajdhani Express",
    route: "Bangalore → New Delhi",
    departure: "20:00",
    arrival: "05:55+2",
    totalSeats: 400,
    availableSeats: 45,
    price: 3200,
    status: "active",
    stations: ["Bangalore", "Tumkur", "Guntakal", "Secunderabad", "Nagpur", "Bhopal", "Jhansi", "New Delhi"],
    distance: 2444,
    duration: "33h 55m",
    trainType: "Superfast",
  },
]

export function useFirebase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [filteredTrains, setFilteredTrains] = useState<Train[]>(karnatakaTrains)

  useEffect(() => {
    // Initialize Firebase (mock)
    setTimeout(() => {
      setIsInitialized(true)
    }, 1000)
  }, [])

  const getTrains = async (filters?: {
    from?: string
    to?: string
    trainType?: string
    date?: string
  }): Promise<Train[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    let trains = [...karnatakaTrains]

    if (filters) {
      if (filters.from) {
        trains = trains.filter(
          (train) =>
            train.route.toLowerCase().includes(filters.from!.toLowerCase()) ||
            train.stations.some((station) => station.toLowerCase().includes(filters.from!.toLowerCase())),
        )
      }

      if (filters.to) {
        trains = trains.filter(
          (train) =>
            train.route.toLowerCase().includes(filters.to!.toLowerCase()) ||
            train.stations.some((station) => station.toLowerCase().includes(filters.to!.toLowerCase())),
        )
      }

      if (filters.trainType) {
        trains = trains.filter((train) => train.trainType === filters.trainType)
      }
    }

    // Simulate real-time seat availability changes
    trains = trains.map((train) => ({
      ...train,
      availableSeats: Math.max(0, train.availableSeats + Math.floor(Math.random() * 10) - 5),
    }))

    setFilteredTrains(trains)
    return trains
  }

  const getTrainsByRoute = async (from: string, to: string): Promise<Train[]> => {
    return getTrains({ from, to })
  }

  const getPopularRoutes = () => {
    return [
      { from: "Bangalore", to: "Chennai", count: 8 },
      { from: "Bangalore", to: "Mumbai", count: 6 },
      { from: "Bangalore", to: "Delhi", count: 4 },
      { from: "Mysore", to: "Bangalore", count: 5 },
      { from: "Hubli", to: "Mumbai", count: 3 },
      { from: "Mangalore", to: "Mumbai", count: 4 },
      { from: "Belgaum", to: "Pune", count: 2 },
    ]
  }

  const getAllStations = () => {
    const stations = new Set<string>()
    karnatakaTrains.forEach((train) => {
      train.stations.forEach((station) => stations.add(station))
    })
    return Array.from(stations).sort()
  }

  const bookTicket = async (
    bookingData: BookingData,
  ): Promise<{ success: boolean; error?: string; bookingId?: string }> => {
    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const train = karnatakaTrains.find((t) => t.id === bookingData.trainId)
    if (!train) {
      return { success: false, error: "Train not found" }
    }

    if (train.availableSeats < bookingData.seatCount) {
      return { success: false, error: "Not enough seats available" }
    }

    // Update available seats (mock)
    train.availableSeats -= bookingData.seatCount

    return {
      success: true,
      bookingId: `BK${Date.now()}`,
    }
  }

  const subscribeToTrainUpdates = (callback: (trains: Train[]) => void) => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update seat availability and status
      const updatedTrains = karnatakaTrains.map((train) => ({
        ...train,
        availableSeats: Math.max(0, train.availableSeats + Math.floor(Math.random() * 6) - 3),
        status: Math.random() > 0.95 ? "delayed" : train.status,
      }))
      callback(updatedTrains)
    }, 5000)

    return () => clearInterval(interval)
  }

  const subscribeToRealTimeData = (callback: (data: any[]) => void) => {
    // Mock real-time train data with Karnataka coordinates
    const mockRealTimeData = [
      {
        id: "12628",
        name: "Karnataka Express",
        currentLocation: {
          latitude: 12.9716,
          longitude: 77.5946,
          stationName: "Bangalore",
        },
        speed: 85,
        occupancy: 67,
        temperature: 24,
        humidity: 45,
        nextStation: "Tumkur",
        estimatedArrival: "21:30",
        delay: 0,
        status: "on-time",
      },
      {
        id: "16536",
        name: "Gol Gumbaz Express",
        currentLocation: {
          latitude: 15.8497,
          longitude: 74.4977,
          stationName: "Belgaum",
        },
        speed: 72,
        occupancy: 89,
        temperature: 26,
        humidity: 52,
        nextStation: "Miraj",
        estimatedArrival: "01:15",
        delay: 15,
        status: "delayed",
      },
      {
        id: "12649",
        name: "Sampark Kranti Express",
        currentLocation: {
          latitude: 13.0827,
          longitude: 80.2707,
          stationName: "Chennai",
        },
        speed: 95,
        occupancy: 78,
        temperature: 28,
        humidity: 65,
        nextStation: "Arakkonam",
        estimatedArrival: "19:45",
        delay: 5,
        status: "on-time",
      },
    ]

    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedData = mockRealTimeData.map((train) => ({
        ...train,
        speed: Math.max(0, train.speed + Math.floor(Math.random() * 10) - 5),
        occupancy: Math.min(100, Math.max(0, train.occupancy + Math.floor(Math.random() * 6) - 3)),
        temperature: train.temperature + (Math.random() * 2 - 1),
        humidity: Math.min(100, Math.max(0, train.humidity + Math.floor(Math.random() * 4) - 2)),
        delay: Math.max(0, train.delay + Math.floor(Math.random() * 3) - 1),
      }))
      callback(updatedData)
    }, 3000)

    return () => clearInterval(interval)
  }

  const subscribeToSafetyAlerts = (callback: (alerts: any[]) => void) => {
    // Mock safety alerts for Karnataka trains
    const mockAlerts = [
      {
        id: "alert_001",
        trainId: "12628",
        trainName: "Karnataka Express",
        type: "collision_risk",
        severity: "medium",
        message: "Obstacle detected 500m ahead - automatic braking initiated",
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          stationName: "Bangalore",
        },
        timestamp: new Date().toISOString(),
        status: "active",
      },
    ]

    setTimeout(() => callback(mockAlerts), 1000)
    return () => {}
  }

  const subscribeToCollisionPredictions = (callback: (predictions: any[]) => void) => {
    // Mock collision predictions
    const mockPredictions = [
      {
        trainId: "12628",
        trainName: "Karnataka Express",
        riskProbability: 0.25,
        riskLevel: "MEDIUM",
        factors: ["High speed in curve section", "Weather conditions: light rain"],
        timestamp: new Date().toISOString(),
      },
    ]

    setTimeout(() => callback(mockPredictions), 1000)
    return () => {}
  }

  const acknowledgeAlert = async (alertId: string) => {
    // Mock acknowledge with proper response
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`Alert ${alertId} acknowledged successfully`)
    return { success: true, message: "Alert acknowledged successfully" }
  }

  const initiateEmergencyCall = async (alertId: string, trainId: string) => {
    // Mock emergency call initiation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Emergency call initiated for train ${trainId}, alert ${alertId}`)
    return { success: true, callId: `CALL_${Date.now()}`, message: "Emergency call initiated" }
  }

  return {
    isInitialized,
    getTrains,
    getTrainsByRoute,
    getPopularRoutes,
    getAllStations,
    bookTicket,
    subscribeToTrainUpdates,
    subscribeToRealTimeData,
    subscribeToSafetyAlerts,
    subscribeToCollisionPredictions,
    acknowledgeAlert,
    initiateEmergencyCall,
  }
}
