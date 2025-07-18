"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Search, Ticket, MapPin, Users, CalendarDays, Info, Train } from "lucide-react"

interface PNRStatus {
  pnr: string
  trainNumber: string
  trainName: string
  fromStation: string
  toStation: string
  doj: string
  class: string
  passengers: Array<{
    name: string
    bookingStatus: string
    currentStatus: string
    coach?: string
    berth?: string
  }>
  chartPrepared: boolean
  status: "CONFIRMED" | "WAITLISTED" | "RAC" | "CANCELLED"
  currentStatusMessage: string
  lastUpdated: string
}

const mockPnrData: { [key: string]: PNRStatus } = {
  "2345678901": {
    pnr: "2345678901",
    trainNumber: "12628",
    trainName: "Karnataka Express",
    fromStation: "SBC",
    toStation: "NDLS",
    doj: "2025-01-20",
    class: "3A",
    passengers: [
      { name: "John Doe", bookingStatus: "CNF / B1 / 23", currentStatus: "CNF", coach: "B1", berth: "23" },
      { name: "Jane Doe", bookingStatus: "CNF / B1 / 24", currentStatus: "CNF", coach: "B1", berth: "24" },
    ],
    chartPrepared: true,
    status: "CONFIRMED",
    currentStatusMessage: "Chart Prepared. All passengers confirmed.",
    lastUpdated: new Date().toISOString(),
  },
  "1234567890": {
    pnr: "1234567890",
    trainNumber: "16022",
    trainName: "Kaveri Express",
    fromStation: "MYS",
    toStation: "SBC",
    doj: "2025-01-21",
    class: "SL",
    passengers: [
      { name: "Alice Smith", bookingStatus: "RAC / S5 / 45", currentStatus: "RAC", coach: "S5", berth: "45" },
    ],
    chartPrepared: false,
    status: "RAC",
    currentStatusMessage: "RAC 1. Chart not prepared yet.",
    lastUpdated: new Date().toISOString(),
  },
}

export function PNRStatusCard() {
  const [pnrInput, setPnrInput] = useState("")
  const [pnrStatus, setPnrStatus] = useState<PNRStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePnrCheck = async (pnr: string) => {
    if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      setError("Please enter a valid 10-digit PNR number.")
      setPnrStatus(null)
      return
    }

    setIsLoading(true)
    setError("")
    setPnrStatus(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = mockPnrData[pnr]

      if (result) {
        setPnrStatus(result)
      } else {
        setError("PNR not found or invalid. Please try again with a valid PNR.")
      }
    } catch (err) {
      console.error("Error fetching PNR status:", err)
      setError("Failed to fetch PNR status. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSamplePnrClick = (samplePnr: string) => {
    setPnrInput(samplePnr)
    handlePnrCheck(samplePnr)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-blue-600" />
          PNR Status Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter 10-digit PNR number"
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value)}
            maxLength={10}
            pattern="\d{10}"
            inputMode="numeric"
            className="flex-1"
          />
          <Button onClick={() => handlePnrCheck(pnrInput)} disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Status"}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="font-medium">Sample PNRs:</span>
          <Button variant="outline" size="sm" onClick={() => handleSamplePnrClick("2345678901")}>
            2345678901 (CNF)
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSamplePnrClick("1234567890")}>
            1234567890 (RAC)
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {pnrStatus && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">PNR: {pnrStatus.pnr}</h3>
              <Badge
                className={`${
                  pnrStatus.status === "CONFIRMED"
                    ? "bg-green-500"
                    : pnrStatus.status === "RAC"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                } text-white`}
              >
                {pnrStatus.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-gray-600" />
                <span>
                  Train: {pnrStatus.trainName} ({pnrStatus.trainNumber})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-600" />
                <span>DOJ: {pnrStatus.doj}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span>From: {pnrStatus.fromStation}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span>To: {pnrStatus.toStation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span>Class: {pnrStatus.class}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Passenger Details:</h4>
              {pnrStatus.passengers.map((pax, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm bg-white p-3 rounded-md shadow-sm"
                >
                  <div>
                    <p className="font-medium">{pax.name}</p>
                    <p className="text-gray-600">Booking Status: {pax.bookingStatus}</p>
                  </div>
                  <Badge
                    className={`${
                      pax.currentStatus === "CNF"
                        ? "bg-green-400"
                        : pax.currentStatus === "RAC"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    } text-white`}
                  >
                    {pax.currentStatus}
                  </Badge>
                </div>
              ))}
            </div>

            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <Info className="h-4 w-4" />
              <AlertDescription>{pnrStatus.currentStatusMessage}</AlertDescription>
            </Alert>

            <p className="text-xs text-gray-500 text-right">
              Last Updated: {new Date(pnrStatus.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
