"use client"

import { useState, useEffect } from "react"
import type { PNRStatus } from "../types/railway"
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
  EyeOff,
  IndianRupee,
  Phone,
  Mail,
  FileText,
  History,
  Star,
  Zap
} from "lucide-react"

// --- MOCK DATA FOR DEMO ---
const mockPnrData: { [key: string]: any } = {
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
      { name: "John Doe", age: 35, gender: "Male", bookingStatus: "CNF / B1 / 23 / LB", currentStatus: "CNF", coach: "B1", berth: "23", seatType: "Lower Berth" },
      { name: "Jane Doe", age: 32, gender: "Female", bookingStatus: "CNF / B1 / 24 / UB", currentStatus: "CNF", coach: "B1", berth: "24", seatType: "Upper Berth" },
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
    ticketType: "E-TICKET",
    platform: "1",
    trainDelay: 0,
    coachPosition: "Front",
    foodAvailable: true,
    acAvailable: true
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
      { name: "Alice Smith", age: 28, gender: "Female", bookingStatus: "RAC / S5 / 45", currentStatus: "RAC", coach: "S5", berth: "45", seatType: "Side Lower", waitlistPosition: 1 },
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
    ticketType: "E-TICKET",
    platform: "3",
    trainDelay: 5,
    coachPosition: "Middle",
    foodAvailable: false,
    acAvailable: false
  }
}

// --- USE MOCK DATA IN DEV ---
async function fetchPNRStatus(pnr: string) {
  await new Promise(res => setTimeout(res, 500))
  return { data: mockPnrData[pnr] }
}

export function PNRStatusCard() {
  const [pnrInput, setPnrInput] = useState("")
  const [pnrStatus, setPnrStatus] = useState<PNRStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastChecked, setLastChecked] = useState<string[]>([])
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false)

  useEffect(() => {
    if (autoRefresh && pnrStatus && pnrStatus.status !== "CONFIRMED") {
      const interval = setInterval(() => {
        handlePnrCheck(pnrStatus.pnr, true)
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
    return undefined
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
      const data = await fetchPNRStatus(pnr)
      if (data && data.data) {
        setPnrStatus({
          ...data.data,
          pnr: pnr,
          lastUpdated: new Date().toISOString(),
          trainDelay: isAutoRefresh ? 
            Math.max(0, (data.data.trainDelay || 0) + Math.floor((Math.random() - 0.5) * 10)) : 
            data.data.trainDelay
        })
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

  const downloadTicket = () => {
    // Simulate ticket download
    const ticketData = `
PNR: ${pnrStatus?.pnr}
Train: ${pnrStatus?.trainName} (${pnrStatus?.trainNumber})
From: ${pnrStatus?.fromStationName}
To: ${pnrStatus?.toStationName}
Date: ${pnrStatus?.doj}
Status: ${pnrStatus?.status}
    `.trim()
    const blob = new Blob([ticketData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${pnrStatus?.pnr}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-6 w-6" />
          PNR Status Check
          <Badge variant="secondary" className="ml-auto bg-white text-blue-600">
            Live Status
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter 10-digit PNR number"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              inputMode="numeric"
              className="flex-1 font-mono text-center text-lg h-12"
            />
            <Button 
              onClick={() => handlePnrCheck(pnrInput)} 
              disabled={isLoading}
              size="lg"
              className="px-8"
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
          <div className="space-y-3">
            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 flex flex-wrap gap-3 items-center text-sm shadow-sm">
              <span className="font-semibold text-blue-800 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Sample PNRs:
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleSamplePnrClick("2345678901")}
                className="font-mono bg-white text-blue-700 border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400"
              >
                2345678901 <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">CNF</Badge>
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleSamplePnrClick("1234567890")}
                className="font-mono bg-white text-blue-700 border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400"
              >
                1234567890 <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-700">RAC</Badge>
              </Button>
            </div>
            {lastChecked.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <History className="h-4 w-4" />
                  Recently Checked:
                </span>
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-blue-900">
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
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{pnrStatus.ticketType}</Badge>
                  <Badge variant="outline" className="text-xs">Class: {pnrStatus.class}</Badge>
                  {pnrStatus.platform && (
                    <Badge variant="outline" className="text-xs">Platform: {pnrStatus.platform}</Badge>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
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
                {pnrStatus.trainDelay && pnrStatus.trainDelay > 0 && (
                  <Badge variant="destructive" className="text-xs">Delayed by {pnrStatus.trainDelay} min</Badge>
                )}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Train</p>
                    <p className="font-medium text-sm">{pnrStatus.trainNumber}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="font-medium text-sm">{new Date(pnrStatus.doj).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Fare</p>
                    <p className="font-medium text-sm">₹{pnrStatus.totalFare}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Passengers</p>
                    <p className="font-medium text-sm">{pnrStatus.passengers.length}</p>
                  </div>
                </div>
              </Card>
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
                  {pnrStatus.coachPosition && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coach Position:</span>
                      <span className="font-medium">{pnrStatus.coachPosition}</span>
                    </div>
                  )}
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
                {/* Passenger Details */}
                <div className="space-y-2 mt-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Passengers
                  </h4>
                  {pnrStatus.passengers.map((pax: any, index: number) => (
                    <div key={index} className="p-2 border rounded-lg bg-gray-50 mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{showSensitiveInfo ? pax.name : `Passenger ${index + 1}`}</span>
                        <Badge>{pax.currentStatus}</Badge>
                      </div>
                      {pax.coach && pax.berth && (
                        <p className="text-sm font-medium">{pax.coach} / {pax.berth}</p>
                      )}
                      {pax.waitlistPosition && (
                        <p className="text-xs text-gray-500">WL {pax.waitlistPosition}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirmation Probability */}
            {pnrStatus.status !== "CONFIRMED" && (
              <div className="space-y-3 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Confirmation Probability
                </h4>
                {pnrStatus.passengers.map((pax: any, index: number) => {
                  const probability = getConfirmationProbability(pax.currentStatus, pax.waitlistPosition)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{showSensitiveInfo ? pax.name : `Passenger ${index + 1}`}</span>
                        <span className="font-medium">{probability}%</span>
                      </div>
                      <Progress 
                        value={probability} 
                        className={`h-3 ${
                          probability >= 70 ? 'text-green-500' :
                          probability >= 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}
                      />
                      <p className="text-xs text-gray-600">
                        {probability >= 70 ? "High chances of confirmation" :
                         probability >= 40 ? "Moderate chances" : "Low chances of confirmation"}
                      </p>
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
                {pnrStatus.trainDelay && pnrStatus.trainDelay > 0 && (
                  <span className="block mt-1 text-red-700">
                    ⚠️ Train is currently delayed by {pnrStatus.trainDelay} minutes.
                  </span>
                )}
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

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
              >
                <Info className="h-4 w-4 mr-2" />
                {showAdvancedInfo ? "Hide" : "Show"} Details
              </Button>

              <Button variant="outline" size="sm" onClick={downloadTicket}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>


              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
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
              {autoRefresh && (
                <span className="text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Updates
                </span>
              )}
            </div>
          </div>
        )}

        {/* Help Section - Modernized with hover/focus reveal */}
        <div className="relative flex justify-end mt-8">
          <div className="group">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-blue-700 border-blue-300 bg-white shadow-sm hover:bg-blue-50 focus:bg-blue-100 transition"
              tabIndex={0}
            >
              <Info className="h-4 w-4 mr-2" /> Need Help?
            </Button>
            <div
              className="absolute right-0 z-10 mt-2 w-80 p-4 bg-white rounded-xl shadow-xl border border-blue-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-300"
              role="dialog"
              aria-label="Help Information"
            >
              <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" /> Railway Helpdesk
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Call: <span className="underline">139</span> <span className="text-xs text-gray-500">(Railway Enquiry)</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Email: <span className="underline">support@irctc.co.in</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Help: <span className="underline">Indian Railways FAQ</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
