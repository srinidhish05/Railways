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
    <div className="max-w-2xl mx-auto p-4">
      <Card className="bg-white shadow-lg border border-blue-300">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-blue-800 text-center mb-2">Find Trains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="relative">
              <Label htmlFor="from-station" className="font-bold text-blue-700">From Station</Label>
              <Input
                id="from-station"
                type="text"
                placeholder="Type station name..."
                value={fromStationQuery}
                onChange={(e) => handleFromStationSearch(e.target.value)}
                autoComplete="off"
                className="mt-2 border-2 border-blue-300 focus:ring-2 focus:ring-blue-400 text-lg font-semibold text-blue-900 bg-blue-50"
              />
              {showFromDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-blue-300 rounded-lg shadow-lg max-h-64 overflow-y-auto animate-fade-in">
                  {filteredFromStations.length > 0 ? (
                    filteredFromStations.map((station, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all"
                        onClick={() => selectFromStation(station)}
                      >
                        <div className="font-bold text-blue-900">
                          {station.name} <span className="text-blue-600">({station.code})</span>
                        </div>
                        {station.city && <div className="text-sm text-gray-500">{station.city}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No stations found</div>
                  )}
                </div>
              )}
              {showFromDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowFromDropdown(false)} />
              )}
            </div>
            <div className="flex justify-center md:justify-center mb-4 md:mb-0">
              <Button
                variant="outline"
                className="rounded-full px-4 py-2 border-2 border-blue-400 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100"
                onClick={handleSwapStations}
                aria-label="Swap stations"
                type="button"
              >
                <ArrowLeftRight className="h-5 w-5 mr-2" /> Swap
              </Button>
            </div>
            <div className="relative">
              <Label htmlFor="to-station" className="font-bold text-blue-700">To Station</Label>
              <Input
                id="to-station"
                type="text"
                placeholder="Type station name..."
                value={toStationQuery}
                onChange={(e) => handleToStationSearch(e.target.value)}
                autoComplete="off"
                className="mt-2 border-2 border-blue-300 focus:ring-2 focus:ring-blue-400 text-lg font-semibold text-blue-900 bg-blue-50"
              />
              {showToDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-blue-300 rounded-lg shadow-lg max-h-64 overflow-y-auto animate-fade-in">
                  {filteredToStations.length > 0 ? (
                    filteredToStations.map((station, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all"
                        onClick={() => selectToStation(station)}
                      >
                        <div className="font-bold text-blue-900">
                          {station.name} <span className="text-blue-600">({station.code})</span>
                        </div>
                        {station.city && <div className="text-sm text-gray-500">{station.city}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No stations found</div>
                  )}
                </div>
              )}
              {showToDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowToDropdown(false)} />
              )}
            </div>
          </div>
          <div>
            <Label className="font-bold text-blue-700">Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-semibold bg-blue-50 border-2 border-blue-300 text-blue-900 mt-2">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  <span className={travelDate ? "text-blue-900 font-bold" : "text-gray-500"}>
                    {travelDate ? format(travelDate, "PPP") : "Select travel date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={travelDate}
                  onSelect={setTravelDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleTrainSearch}
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 text-lg transition-all shadow"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" /> Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Search className="h-5 w-5" /> Find Trains
              </span>
            )}
          </Button>
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

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-blue-100 { background-color: #dbeafe; }
        .bg-blue-700 { background-color: #1d4ed8; }
        .bg-blue-800 { background-color: #1e40af; }
        .bg-blue-900 { color: #1e3a8a; }
        .bg-red-50 { background-color: #fef2f2; }
        .bg-red-300 { background-color: #fca5a5; }
        .bg-red-400 { color: #f87171; }
        .bg-red-600 { background-color: #dc2626; }
        .bg-red-700 { background-color: #b91c1c; }
        .text-blue-700 { color: #1d4ed8; }
        .text-blue-800 { color: #1e40af; }
        .text-blue-900 { color: #1e3a8a; }
        .text-red-700 { color: #b91c1c; }
      `}</style>
    </div>
  )
}