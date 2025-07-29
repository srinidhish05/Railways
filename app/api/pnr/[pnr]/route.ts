import { NextResponse } from "next/server"

// Comprehensive Karnataka Railway PNR database
const KARNATAKA_PNR_DATABASE: { [key: string]: any } = {
  // Confirmed tickets
  "1234567890": {
    pnr: "1234567890",
    status: "CONFIRMED",
    trainNumber: "12628",
    trainName: "Karnataka Express",
    doj: "2025-07-25",
    bookingDate: "2025-06-15",
    fromStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    toStation: { code: "NDLS", name: "New Delhi" },
    boardingStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    destinationStation: { code: "NDLS", name: "New Delhi" },
    departureTime: "20:00",
    arrivalTime: "06:40",
    travelTime: "34h 40m",
    distance: 2477,
    class: "1A",
    fare: {
      baseFare: 7800,
      reservationCharges: 60,
      superFastCharges: 45,
      totalFare: 8500,
      gst: 640
    },
    passengers: [
      { 
        name: "RAJESH KUMAR", 
        age: 35, 
        gender: "M",
        bookingStatus: "CNF/A1/12", 
        currentStatus: "CNF/A1/12", 
        coach: "A1", 
        berth: "12",
        berthType: "Lower"
      },
      { 
        name: "PRIYA RAJESH", 
        age: 30, 
        gender: "F",
        bookingStatus: "CNF/A1/13", 
        currentStatus: "CNF/A1/13", 
        coach: "A1", 
        berth: "13",
        berthType: "Upper"
      }
    ],
    chartPrepared: true,
    chartTime: "2025-07-25T16:00:00Z",
    bookingSource: "IRCTC Website",
    paymentStatus: "SUCCESS",
    cancellationAllowed: true,
    message: "Your ticket is confirmed. Chart prepared. Have a pleasant journey!"
  },

  "9876543210": {
    pnr: "9876543210",
    status: "RAC",
    trainNumber: "16022",
    trainName: "Kaveri Express",
    doj: "2025-07-26",
    bookingDate: "2025-07-10",
    fromStation: { code: "MYS", name: "Mysuru Jn" },
    toStation: { code: "MAS", name: "MGR Chennai Central" },
    boardingStation: { code: "MYS", name: "Mysuru Jn" },
    destinationStation: { code: "MAS", name: "MGR Chennai Central" },
    departureTime: "21:00",
    arrivalTime: "06:00",
    travelTime: "09h 00m",
    distance: 497,
    class: "2A",
    fare: {
      baseFare: 1650,
      reservationCharges: 50,
      superFastCharges: 30,
      totalFare: 1850,
      gst: 120
    },
    passengers: [
      { 
        name: "SURESH BABU", 
        age: 45, 
        gender: "M",
        bookingStatus: "RAC/B1/15", 
        currentStatus: "RAC/B1/15", 
        coach: "B1", 
        berth: "15",
        berthType: "Side Lower"
      }
    ],
    chartPrepared: true,
    chartTime: "2025-07-26T17:00:00Z",
    bookingSource: "Railway Counter",
    paymentStatus: "SUCCESS",
    cancellationAllowed: true,
    racPosition: 15,
    confirmationChances: "High",
    message: "Your ticket is in RAC. You have a reserved seat. Berth confirmation chances are high."
  },

  "1111111111": {
    pnr: "1111111111",
    status: "WAITLIST",
    trainNumber: "17326",
    trainName: "Vishwamanava Express",
    doj: "2025-07-27",
    bookingDate: "2025-07-05",
    fromStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    toStation: { code: "MYS", name: "Mysuru Jn" },
    boardingStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    destinationStation: { code: "MYS", name: "Mysuru Jn" },
    departureTime: "08:20",
    arrivalTime: "11:30",
    travelTime: "03h 10m",
    distance: 139,
    class: "CC",
    fare: {
      baseFare: 350,
      reservationCharges: 25,
      superFastCharges: 10,
      totalFare: 385,
      gst: 25
    },
    passengers: [
      { 
        name: "MAHESH KUMAR", 
        age: 28, 
        gender: "M",
        bookingStatus: "WL/CC/8", 
        currentStatus: "WL/CC/5", 
        coach: "CC", 
        berth: "",
        berthType: ""
      }
    ],
    chartPrepared: false,
    bookingSource: "Mobile App",
    paymentStatus: "SUCCESS",
    cancellationAllowed: true,
    waitlistPosition: 5,
    confirmationChances: "Medium",
    message: "Your ticket is on waitlist. Current position: WL/5. Confirmation chances are medium."
  },

  "2222222222": {
    pnr: "2222222222",
    status: "CANCELLED",
    trainNumber: "16535",
    trainName: "Gol Gumbaz Express",
    doj: "2025-07-20",
    bookingDate: "2025-06-10",
    fromStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    toStation: { code: "BJP", name: "Vijayapura" },
    boardingStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    destinationStation: { code: "BJP", name: "Vijayapura" },
    departureTime: "19:00",
    arrivalTime: "07:00",
    travelTime: "12h 00m",
    distance: 555,
    class: "SL",
    fare: {
      baseFare: 580,
      reservationCharges: 30,
      superFastCharges: 10,
      totalFare: 620,
      gst: 35
    },
    passengers: [
      { 
        name: "ANITA SHARMA", 
        age: 35, 
        gender: "F",
        bookingStatus: "CNF/S5/22", 
        currentStatus: "CAN", 
        coach: "S5", 
        berth: "22",
        berthType: "Lower"
      }
    ],
    chartPrepared: true,
    bookingSource: "IRCTC Website",
    paymentStatus: "REFUNDED",
    cancellationAllowed: false,
    cancellationDate: "2025-07-18",
    refundAmount: 585,
    message: "This ticket has been cancelled. Refund of ₹585 has been processed."
  },

  "3333333333": {
    pnr: "3333333333",
    status: "CONFIRMED",
    trainNumber: "12079",
    trainName: "Jan Shatabdi Express",
    doj: "2025-07-28",
    bookingDate: "2025-07-15",
    fromStation: { code: "MAQ", name: "Mangaluru Central" },
    toStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    boardingStation: { code: "MAQ", name: "Mangaluru Central" },
    destinationStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    departureTime: "07:30",
    arrivalTime: "14:30",
    travelTime: "07h 00m",
    distance: 352,
    class: "CC",
    fare: {
      baseFare: 850,
      reservationCharges: 40,
      cateringCharges: 30,
      totalFare: 920,
      gst: 55
    },
    passengers: [
      { 
        name: "RAVI SHETTY", 
        age: 42, 
        gender: "M",
        bookingStatus: "CNF/C1/25", 
        currentStatus: "CNF/C1/25", 
        coach: "C1", 
        berth: "25",
        berthType: "Window"
      },
      { 
        name: "KAVYA SHETTY", 
        age: 16, 
        gender: "F",
        bookingStatus: "CNF/C1/26", 
        currentStatus: "CNF/C1/26", 
        coach: "C1", 
        berth: "26",
        berthType: "Aisle"
      }
    ],
    chartPrepared: true,
    chartTime: "2025-07-28T03:30:00Z",
    bookingSource: "Railway Counter",
    paymentStatus: "SUCCESS",
    cancellationAllowed: true,
    mealIncluded: true,
    message: "Your ticket is confirmed. Meal included. Chart prepared."
  },

  "4444444444": {
    pnr: "4444444444",
    status: "PARTIALLY_CONFIRMED",
    trainNumber: "16589",
    trainName: "Rani Chennamma Express",
    doj: "2025-07-29",
    bookingDate: "2025-07-12",
    fromStation: { code: "BGM", name: "Belagavi" },
    toStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    boardingStation: { code: "BGM", name: "Belagavi" },
    destinationStation: { code: "SBC", name: "KSR Bengaluru City Jn" },
    departureTime: "21:30",
    arrivalTime: "07:00",
    travelTime: "09h 30m",
    distance: 502,
    class: "3A",
    fare: {
      baseFare: 1480,
      reservationCharges: 50,
      superFastCharges: 25,
      totalFare: 1580,
      gst: 95
    },
    passengers: [
      { 
        name: "DEEPAK PATIL", 
        age: 38, 
        gender: "M",
        bookingStatus: "CNF/B2/18", 
        currentStatus: "CNF/B2/18", 
        coach: "B2", 
        berth: "18",
        berthType: "Side Upper"
      },
      { 
        name: "SUNITA PATIL", 
        age: 35, 
        gender: "F",
        bookingStatus: "WL/3A/12", 
        currentStatus: "RAC/B3/5", 
        coach: "B3", 
        berth: "5",
        berthType: "Side Lower"
      }
    ],
    chartPrepared: true,
    chartTime: "2025-07-29T17:30:00Z",
    bookingSource: "Mobile App",
    paymentStatus: "SUCCESS",
    cancellationAllowed: true,
    message: "Partial confirmation. Passenger 1: Confirmed, Passenger 2: RAC."
  }
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function GET(request: Request, { params }: { params: { pnr: string } }) {
  try {
    const pnr = params.pnr
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'

    // Rate limiting: 5 PNR checks per minute per IP
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({
        error: "Rate limit exceeded",
        message: "Too many PNR status checks. Please wait before trying again.",
        retryAfter: 60
      }, { status: 429 })
    }

    // Validate PNR format
    if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      return NextResponse.json({ 
        error: "Invalid PNR format",
        message: "PNR number must be exactly 10 digits.",
        example: "1234567890"
      }, { status: 400 })
    }

    // Simulate realistic API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Look up PNR in database
    const pnrData = KARNATAKA_PNR_DATABASE[pnr]

    if (pnrData) {
      // Add real-time status updates for dynamic PNRs
      const updatedData = updateRealTimeStatus(pnrData)

      // Safety monitoring logic
      let safetyStatus = 'Safe'
      const safetyAlerts: string[] = []
      if (updatedData.status === 'WAITLIST') {
        safetyStatus = 'Warning'
        safetyAlerts.push('High waitlist, confirmation not guaranteed')
      }
      if (updatedData.status === 'RAC') {
        safetyStatus = 'Warning'
        safetyAlerts.push('RAC, partial confirmation, check berth assignment')
      }
      if (updatedData.status === 'CANCELLED') {
        safetyStatus = 'Critical'
        safetyAlerts.push('Ticket cancelled, journey not permitted')
      }
      if (updatedData.status === 'PARTIALLY_CONFIRMED') {
        safetyStatus = 'Warning'
        safetyAlerts.push('Partial confirmation, some passengers not fully confirmed')
      }
      if (updatedData.class === 'SL' && updatedData.status === 'CONFIRMED') {
        safetyAlerts.push('Sleeper class, monitor for overcrowding and safety')
      }

      // Attach safety fields
      updatedData.safetyStatus = safetyStatus
      updatedData.safetyAlerts = safetyAlerts

      return NextResponse.json({
        success: true,
        data: updatedData,
        timestamp: new Date().toISOString(),
        source: "Karnataka Railway Network"
      })
    } else {
      // Generate realistic error for unknown PNR
      return NextResponse.json({
        success: false,
        error: "PNR not found",
        pnr: pnr,
        status: "NOT_FOUND",
        message: "PNR not found in our database. Please verify the number or try again later.",
        possibleReasons: [
          "PNR number entered incorrectly",
          "Ticket not booked through Karnataka Railway network",
          "Very old PNR (data archived)",
          "Ticket cancelled and removed from active database"
        ],
        helpline: "139 (Railway Enquiry)"
      }, { status: 404 })
    }

  } catch (error) {
    console.error("PNR lookup error:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: "Unable to fetch PNR status. Please try again later."
    }, { status: 500 })
  }
}

// Rate limiting function
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(clientIP)

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + 60000 }) // 1 minute
    return true
  }

  if (limit.count >= 5) return false
  
  limit.count++
  return true
}

// Update real-time status for certain PNRs
function updateRealTimeStatus(pnrData: any) {
  const updatedData = { ...pnrData }
  const now = new Date()
  const journeyDate = new Date(pnrData.doj)

  // Simulate waitlist movement for active waitlist tickets
  if (pnrData.status === "WAITLIST" && journeyDate > now) {
    const originalPosition = pnrData.waitlistPosition || 8
    const daysUntilJourney = Math.ceil((journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    // Simulate gradual waitlist movement
    const newPosition = Math.max(1, originalPosition - Math.floor((7 - daysUntilJourney) / 2))
    
    if (newPosition !== originalPosition) {
      updatedData.waitlistPosition = newPosition
      updatedData.passengers[0].currentStatus = `WL/${pnrData.class}/${newPosition}`
      updatedData.message = `Your ticket is on waitlist. Current position: WL/${newPosition}. ${getConfirmationMessage(newPosition)}`
    }
  }

  return updatedData
}

// Get confirmation message based on waitlist position
function getConfirmationMessage(position: number): string {
  if (position <= 3) return "High chances of confirmation."
  if (position <= 8) return "Medium chances of confirmation."
  if (position <= 15) return "Fair chances of confirmation."
  return "Low chances of confirmation."
}