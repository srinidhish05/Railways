"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Train as TrainIcon, Calendar, ExternalLink, Loader2, ArrowLeftRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

import { karnatakaStations, searchStations } from "@/data/karnataka-stations"
import { searchTrainsBetweenStations } from "@/data/karnataka-trains"

export default function FindTrainsPage() {
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [fromStationQuery, setFromStationQuery] = useState("")
  const [toStationQuery, setToStationQuery] = useState("")
  const [filteredFromStations, setFilteredFromStations] = useState<any[]>([])
  const [filteredToStations, setFilteredToStations] = useState<any[]>([])
  const [availableTrains, setAvailableTrains] = useState<any[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleFromStationSearch = async (query: string) => {
    setFromStationQuery(query)
    if (query.length >= 1) {
      const stations = searchStations(query)
      setFilteredFromStations(stations)
      setShowFromDropdown(true)
    } else {
      setFilteredFromStations([])
      setShowFromDropdown(false)
    }
  }

  const handleToStationSearch = async (query: string) => {
    setToStationQuery(query)
    if (query.length >= 1) {
      const stations = searchStations(query)
      setFilteredToStations(stations)
      setShowToDropdown(true)
    } else {
      setFilteredToStations([])
      setShowToDropdown(false)
    }
  }

  const selectFromStation = (station: any) => {
    setFromStation(station.code)
    setFromStationQuery(`${station.name} (${station.code})`)
    setShowFromDropdown(false)
  }

  const selectToStation = (station: any) => {
    setToStation(station.code)
    setToStationQuery(`${station.name} (${station.code})`)
    setShowToDropdown(false)
  }

  const handleSwapStations = () => {
    const tempCode = fromStation
    const tempQuery = fromStationQuery
    setFromStation(toStation)
    setFromStationQuery(toStationQuery)
    setToStation(tempCode)
    setToStationQuery(tempQuery)
  }

  const handleTrainSearch = async () => {
    if (!fromStation || !toStation || !travelDate) {
      setErrorMessage("Please select from station, to station, and travel date")
      return
    }

    setIsLoading(true)
    setShowTrainResults(false)
    setErrorMessage("")

    try {
      const trains = searchTrainsBetweenStations(fromStation, toStation)
      setAvailableTrains(trains)
      setShowTrainResults(true)
      if (trains.length === 0) {
        setErrorMessage("No trains found between selected stations")
      }
    } catch (error) {
      setAvailableTrains([])
      setShowTrainResults(true)
      setErrorMessage("Error searching trains. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center w-full px-0 py-8">
      <div className="w-full">
        <div className="bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-[#334155] animate-fade-in">
          <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight drop-shadow-lg animate-pulse">
            <span className="text-[#38bdf8]">Find Karnataka Trains</span>
          </h1>
          <p className="text-center text-lg mb-8 text-[#cbd5e1]">
            Search for trains between stations, check real-time availability, and plan your journey with safety and comfort.
          </p>
          <Card className="bg-white shadow-lg border border-blue-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-800 text-center mb-2">Train Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* ...existing code for station inputs, swap, date picker, and search button... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* ...existing code for from station input... */}
                {/* ...existing code for swap button... */}
                {/* ...existing code for to station input... */}
              </div>
              {/* ...existing code for date picker... */}
              {/* ...existing code for search button... */}
            </CardContent>
          </Card>
          {errorMessage && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription className="text-lg font-semibold text-red-700">{errorMessage}</AlertDescription>
            </Alert>
          )}
          {showTrainResults && availableTrains.length > 0 && (
            <Card className="mt-6 border-2 border-blue-300 shadow-lg animate-fade-in bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800">Available Trains ({availableTrains.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableTrains.map((train, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-white hover:bg-blue-100 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrainIcon className="h-5 w-5 text-blue-700" />
                      <span className="font-bold text-blue-900">{train.trainName} ({train.trainNumber})</span>
                    </div>
                    <div className="text-md text-blue-700 mb-1 font-semibold">
                      {train.fromName} <span className="mx-1 text-blue-600">→</span> {train.toName}
                    </div>
                    <div className="text-sm text-gray-700">
                      {train.departureTime && <span className="mr-3">Departure: <span className="font-bold">{train.departureTime}</span></span>}
                      {train.arrivalTime && <span className="mr-3">Arrival: <span className="font-bold">{train.arrivalTime}</span></span>}
                      {train.duration && <span>Duration: <span className="font-bold">{train.duration}</span></span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {showTrainResults && availableTrains.length === 0 && !isLoading && (
            <Card className="mt-6 border-2 border-red-300 animate-fade-in bg-red-50">
              <CardContent className="text-center py-8">
                <TrainIcon className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-2xl font-bold text-red-700 mb-2">No Trains Found</h3>
                <p className="text-lg text-gray-700 mb-4">No trains found between the selected stations for your travel date.</p>
                <Button onClick={() => window.open('https://www.irctc.co.in/', '_blank')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 text-lg">
                  Check IRCTC Directly
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 10px #38bdf8, 0 0 20px #fbbf24; }
          50% { text-shadow: 0 0 20px #38bdf8, 0 0 40px #fbbf24; }
        }
      `}</style>
    </div>
  )
}