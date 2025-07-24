"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Ticket, 
  MapPin, 
  Users, 
  CalendarDays, 
  Info, 
  Train, 
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
  Eye,
  EyeOff
} from "lucide-react"

interface PNRStatus {
  pnr: string
  trainNumber: string
  trainName: string
  fromStation: string
  toStation: string
  fromStationName: string
  toStationName: string
  doj: string
  class: string
  quota: string
  passengers: Array<{
    name: string
    age: number
    gender: string
    bookingStatus: string
    currentStatus: string
    coach?: string
    berth?: string
    seatType?: string
    waitlistPosition?: number
  }>
  chartPrepared: boolean
  status: "CONFIRMED" | "WAITLISTED" | "RAC" | "CANCELLED" | "PARTIALLY_CONFIRMED"
  currentStatusMessage: string
  departureTime: string
  arrivalTime: string
  distance: string
  duration: string
  boardingStation?: string
  reservationUpto?: string
  lastUpdated: string
  bookingDate: string
  totalFare: number
  ticketType: "E-TICKET" | "I-TICKET" | "COUNTER"
}

const mockPnrData: { [key: string]: PNRStatus } = {
  "2345678901": {
    pnr: "2345678901",
    trainNumber: "12628",
    trainName: "Karnataka Express",
    fromStation: "SBC",
    toStation: "NDLS",
    fromStationName: "KSR Bengaluru City Junction",
    toStationName: "New Delhi",
    doj: "2025-01-25",
    class: "3A",
    quota: "GN",
    passengers: [
      { 
        name: "John Doe", 
        age: 35, 
        gender: "Male",
        bookingStatus: "CNF / B1 / 23 / LB", 
        currentStatus: "CNF", 
        coach: "B1", 
        berth: "23",
        seatType: "Lower Berth"
      },
      { 
        name: "Jane Doe", 
        age: 32, 
        gender: "Female",
        bookingStatus: "CNF / B1 / 24 / UB", 
        currentStatus: "CNF", 
        coach: "B1", 
        berth: "24",
        seatType: "Upper Berth"
      },
    ],
    chartPrepared: true,
    status: "CONFIRMED",
    currentStatusMessage: "Chart Prepared. All passengers confirmed with berth allocation.",
    departureTime: "20:15",
    arrivalTime: "06:00+1",
    distance: "2077 km",
    duration: "33h 45m",
    boardingStation: "SBC",
    reservationUpto: "NDLS",
    lastUpdated: new Date().toISOString(),
    bookingDate: "2025-01-15T10:30:00.000Z",
    totalFare: 4250,
    ticketType: "E-TICKET"
  },
  "1234567890": {
    pnr: "1234567890",
    trainNumber: "16022",
    trainName: "Kaveri Express",
    fromStation: "MYS",
    toStation: "SBC",
    fromStationName: "Mysuru Junction",
    toStationName: "KSR Bengaluru City Junction",
    doj: "2025-01-26",
    class: "SL",
    quota: "GN",
    passengers: [
      { 
        name: "Alice Smith", 
        age: 28, 
        gender: "Female",
        bookingStatus: "RAC / S5 / 45", 
        currentStatus: "RAC", 
        coach: "S5", 
        berth: "45",
        seatType: "Side Lower",
        waitlistPosition: 1
      },
    ],
    chartPrepared: false,
    status: "RAC",
    currentStatusMessage: "RAC 1. Chart not prepared yet. High chances of confirmation.",
    departureTime: "06:30",
    arrivalTime: "09:45",
    distance: "139 km",
    duration: "3h 15m",
    boardingStation: "MYS",
    reservationUpto: "SBC",
    lastUpdated: new Date().toISOString(),
    bookingDate: "2025-01-20T14:20:00.000Z",
    totalFare: 185,
    ticketType: "E-TICKET"
  },
  "9876543210": {
    pnr: "9876543210",
    trainNumber: "16515",
    trainName: "Yesvantpur Karwar Express",
    fromStation: "YPR",
    toStation: "KAWR",
    fromStationName: "Yesvantpur Junction",
    toStationName: "Karwar",
    doj: "2025-01-27",
    class: "2S",
    quota: "GN",
    passengers: [
      { 
        name: "Bob Wilson", 
        age: 45, 
        gender: "Male",
        bookingStatus: "WL / 15", 
        currentStatus: "WL", 
        waitlistPosition: 8
      },
    ],
    chartPrepared: false,
    status: "WAITLISTED",
    currentStatusMessage: "Waitlist 8. Chart not prepared. Low chances of confirmation.",
    departureTime: "22:30",
    arrivalTime: "08:15+1",
    distance: "485 km",
    duration: "9h 45m",
    boardingStation: "YPR",
    reservationUpto: "KAWR",
    lastUpdated: new Date().toISOString(),
    bookingDate: "2025-01-18T16:45:00.000Z",
    totalFare: 125,
    ticketType: "E-TICKET"
  }
}

export function PNRStatusCard() {
  const [pnrInput, setPnrInput] = useState("")
  const [pnrStatus, setPnrStatus] = useState<PNRStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastChecked, setLastChecked] = useState<string[]>([])
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && pnrStatus && pnrStatus.status !== "CONFIRMED") {
      const interval = setInterval(() => {
        handlePnrCheck(pnrStatus.pnr, true)
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh, pnrStatus])

  const handlePnrCheck = async (pnr: string, isAutoRefresh = false) => {
    if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      setError("Please enter a valid 10-digit PNR number.")
      setPnrStatus(null)
      return
    }

    if (!isAutoRefresh) {
      setIsLoading(true)
      setError("")
      setPnrStatus(null)
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, isAutoRefresh ? 500 : 1500))

      const result = mockPnrData[pnr]

      if (result) {
        // Update last updated time for auto-refresh
        const updatedResult = {
          ...result,
          lastUpdated: new Date().toISOString()
        }
        setPnrStatus(updatedResult)
        
        // Add to recently checked list
        if (!isAutoRefresh) {
          setLastChecked(prev => {
            const updated = [pnr, ...prev.filter(p => p !== pnr)].slice(0, 5)
            return updated
          })
        }
      } else {
        setError("PNR not found or invalid. Please try again with a valid PNR.")
        setPnrStatus(null)
      }
    } catch (err) {
      console.error("Error fetching PNR status:", err)
      setError("Failed to fetch PNR status. Please try again later.")
    } finally {
      if (!isAutoRefresh) {
        setIsLoading(false)
      }
    }
  }

  const handleSamplePnrClick = (samplePnr: string) => {
    setPnrInput(samplePnr)
    handlePnrCheck(samplePnr)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "RAC":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "WAITLISTED":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getConfirmationProbability = (status: string, waitlistPosition?: number) => {
    if (status === "CONFIRMED") return 100
    if (status === "RAC") return 85
    if (status === "WAITLISTED" && waitlistPosition) {
      if (waitlistPosition <= 5) return 70
      if (waitlistPosition <= 15) return 40
      if (waitlistPosition <= 30) return 20
      return 5
    }
    return 0
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-blue-600" />
          PNR Status Check
          <Badge variant="outline" className="ml-auto">
            Live Status
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter 10-digit PNR number"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              inputMode="numeric"
              className="flex-1 font-mono text-center text-lg"
            />
            <Button 
              onClick={() => handlePnrCheck(pnrInput)} 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Status
                </>
              )}
            </Button>
          </div>

          {/* Sample PNRs */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="font-medium">Sample PNRs:</span>
              <Button variant="outline" size="sm" onClick={() => handleSamplePnrClick("2345678901")}>
                2345678901 (CNF)
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSamplePnrClick("1234567890")}>
                1234567890 (RAC)
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSamplePnrClick("9876543210")}>
                9876543210 (WL)
              </Button>
            </div>

            {/* Recently Checked */}
            {lastChecked.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="font-medium">Recently Checked:</span>
                {lastChecked.map((pnr) => (
                  <Button 
                    key={pnr} 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSamplePnrClick(pnr)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {pnr}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {pnrStatus && (
          <div className="space-y-6 p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    PNR: {showSensitiveInfo ? pnrStatus.pnr : `****${pnrStatus.pnr.slice(-4)}`}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  >
                    {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  {pnrStatus.ticketType}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(pnrStatus.status)}
                <Badge
                  className={`text-white text-lg px-4 py-2 ${
                    pnrStatus.status === "CONFIRMED"
                      ? "bg-green-500"
                      : pnrStatus.status === "RAC"
                        ? "bg-yellow-500"
                        : pnrStatus.status === "WAITLISTED"
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }`}
                >
                  {pnrStatus.status}
                </Badge>
              </div>
            </div>

            {/* Train Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Train Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Train:</span>
                    <span className="font-medium">{pnrStatus.trainName} ({pnrStatus.trainNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{pnrStatus.fromStationName} ({pnrStatus.fromStation})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{pnrStatus.toStationName} ({pnrStatus.toStation})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{pnrStatus.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{pnrStatus.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Journey Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Journey:</span>
                    <span className="font-medium">{new Date(pnrStatus.doj).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">{pnrStatus.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span className="font-medium">{pnrStatus.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">{pnrStatus.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fare:</span>
                    <span className="font-medium">₹{pnrStatus.totalFare}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Passenger Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passenger Details ({pnrStatus.passengers.length})
              </h4>
              <div className="space-y-3">
                {pnrStatus.passengers.map((pax, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {showSensitiveInfo ? pax.name : `${pax.name.split(' ')[0]} ****`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pax.age} years, {pax.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        Booking: {pax.bookingStatus}
                      </p>
                      {pax.seatType && (
                        <p className="text-xs text-blue-600">{pax.seatType}</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        className={`${
                          pax.currentStatus === "CNF"
                            ? "bg-green-500"
                            : pax.currentStatus === "RAC"
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                        } text-white`}
                      >
                        {pax.currentStatus}
                      </Badge>
                      {pax.coach && pax.berth && (
                        <p className="text-sm font-medium">{pax.coach} / {pax.berth}</p>
                      )}
                      {pax.waitlistPosition && (
                        <p className="text-xs text-gray-500">WL {pax.waitlistPosition}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Probability */}
            {pnrStatus.status !== "CONFIRMED" && (
              <div className="space-y-3 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800">Confirmation Probability</h4>
                {pnrStatus.passengers.map((pax, index) => {
                  const probability = getConfirmationProbability(pax.currentStatus, pax.waitlistPosition)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{pax.name}</span>
                        <span className="font-medium">{probability}%</span>
                      </div>
                      <Progress 
                        value={probability} 
                        className={`h-2 ${
                          probability >= 70 ? 'text-green-500' :
                          probability >= 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Status Message */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {pnrStatus.currentStatusMessage}
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePnrCheck(pnrStatus.pnr)}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-50 border-green-200" : ""}
              >
                <Clock className="h-4 w-4 mr-2" />
                {autoRefresh ? "Stop Auto-refresh" : "Auto-refresh"}
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t">
              <span>
                Booked on: {new Date(pnrStatus.bookingDate).toLocaleDateString()}
              </span>
              <span>
                Last Updated: {new Date(pnrStatus.lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}