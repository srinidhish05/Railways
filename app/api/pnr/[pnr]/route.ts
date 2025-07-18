import { NextResponse } from "next/server"

// Mock PNR data
const mockPnrData: { [key: string]: any } = {
  "1234567890": {
    pnr: "1234567890",
    status: "CONFIRMED",
    trainNumber: "12628",
    trainName: "Karnataka Express",
    doj: "2025-07-20",
    fromStation: "SBC",
    toStation: "NDLS",
    boardingStation: "SBC",
    destinationStation: "NDLS",
    passengers: [
      { bookingStatus: "CNF/A1/12", currentStatus: "CNF/A1/12", coach: "A1", berth: "12" },
      { bookingStatus: "CNF/A1/13", currentStatus: "CNF/A1/13", coach: "A1", berth: "13" },
    ],
    chartPrepared: true,
    message: "Your ticket is confirmed. Have a pleasant journey!",
  },
  "9876543210": {
    pnr: "9876543210",
    status: "WAITLIST",
    trainNumber: "16022",
    trainName: "Kaveri Express",
    doj: "2025-07-22",
    fromStation: "MYS",
    toStation: "MAS",
    boardingStation: "MYS",
    destinationStation: "MAS",
    passengers: [{ bookingStatus: "WL/10", currentStatus: "WL/8", coach: "", berth: "" }],
    chartPrepared: false,
    message: "Your ticket is currently on the waitlist. Current status is WL/8.",
  },
  "1111111111": {
    pnr: "1111111111",
    status: "CANCELLED",
    trainNumber: "17326",
    trainName: "Vishwamanava Express",
    doj: "2025-07-18",
    fromStation: "SBC",
    toStation: "MYS",
    boardingStation: "SBC",
    destinationStation: "MYS",
    passengers: [{ bookingStatus: "CNF/B2/45", currentStatus: "CAN", coach: "B2", berth: "45" }],
    chartPrepared: true,
    message: "This ticket has been cancelled.",
  },
}

export async function GET(request: Request, { params }: { params: { pnr: string } }) {
  const pnr = params.pnr

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
    return NextResponse.json({ message: "Invalid PNR number. Please provide a 10-digit number." }, { status: 400 })
  }

  const status = mockPnrData[pnr]

  if (status) {
    return NextResponse.json(status)
  } else {
    return NextResponse.json(
      {
        pnr: pnr,
        status: "UNKNOWN",
        trainNumber: "N/A",
        trainName: "N/A",
        doj: "N/A",
        fromStation: "N/A",
        toStation: "N/A",
        boardingStation: "N/A",
        destinationStation: "N/A",
        passengers: [],
        chartPrepared: false,
        message: "PNR not found or invalid. Please check the number and try again.",
      },
      { status: 404 },
    )
  }
}
