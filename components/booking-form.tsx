"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Users, CreditCard, CheckCircle, AlertCircle, Search, Clock, Train as TrainIcon, Calendar, IndianRupee, ExternalLink, Star } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

// Real API functions
const RAPIDAPI_KEY = 'f65c271e00mshce64e8cb8563b11p128323jsn5857c27564f3'

const searchStations = async (query: string) => {
  try {
    const response = await fetch(`https://indianrailways.p.rapidapi.com/findstations.php?station=${query}`, {
      headers: {
        'x-rapidapi-host': 'indianrailways.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error searching stations:', error)
    return []
  }
}

const searchTrains = async (fromStation: string, toStation: string) => {
  try {
    const response = await fetch('https://trains.p.rapidapi.com/v1/railways/trains/india', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'trains.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      body: JSON.stringify({ search: `${fromStation} ${toStation}` })
    })
    return await response.json()
  } catch (error) {
    console.error('Error searching trains:', error)
    return []
  }
}

const getTrainSchedule = async (trainNumber: string) => {
  try {
    const response = await fetch(`https://irctc-api2.p.rapidapi.com/trainSchedule?trainNumber=${trainNumber}`, {
      headers: {
        'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error fetching train schedule:', error)
    return null
  }
}

// Karnataka Railway popular stations
const karnatakaStations = [
  { code: "SBC", name: "Bengaluru City Junction", city: "Bengaluru" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru" },
  { code: "KJM", name: "Krishnarajapuram", city: "Bengaluru" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi" },
  { code: "BGM", name: "Belagavi", city: "Belagavi" },
  { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru" },
  { code: "DWR", name: "Dharwad", city: "Dharwad" },
]

interface Station {
  station_name: string
  station_code: string
  city?: string
  state?: string
}

interface TrainData {
  train_number: string
  train_name: string
  from_station_name?: string
  to_station_name?: string
  departure_time?: string
  arrival_time?: string
  duration?: string
  distance?: string
  train_type?: string
}

interface BookingData {
  trainId: string
  passengerName: string
  passengerEmail: string
  seatCount: number
  travelDate: string
  fromStation: string
  toStation: string
  selectedClass: string
}

export function BookingForm() {
  // Station and train search states
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [fromStationQuery, setFromStationQuery] = useState("")
  const [toStationQuery, setToStationQuery] = useState("")
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>([])
  const [filteredToStations, setFilteredToStations] = useState<Station[]>([])
  const [availableTrains, setAvailableTrains] = useState<TrainData[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [bookingData, setBookingData] = useState<BookingData>({
    trainId: "",
    passengerName: "",
    passengerEmail: "",
    seatCount: 1,
    travelDate: "",
    fromStation: "",
    toStation: "",
    selectedClass: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "redirected" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Quick select Karnataka stations
  const handleQuickSelectFrom = (station: any) => {
    setFromStation(station.code)
    setFromStationQuery(`${station.name} (${station.code})`)
    setShowFromDropdown(false)
  }

  const handleQuickSelectTo = (station: any) => {
    setToStation(station.code)
    setToStationQuery(`${station.name} (${station.code})`)
    setShowToDropdown(false)
  }

  // Search functions with real APIs
  const handleFromStationSearch = async (query: string) => {
    setFromStationQuery(query)
    if (query.length >= 3) {
      const stations = await searchStations(query)
      if (stations && Array.isArray(stations)) {
        setFilteredFromStations(stations.slice(0, 8))
        setShowFromDropdown(true)
      }
    } else {
      setFilteredFromStations([])
      setShowFromDropdown(false)
    }
  }

  const handleToStationSearch = async (query: string) => {
    setToStationQuery(query)
    if (query.length >= 3) {
      const stations = await searchStations(query)
      if (stations && Array.isArray(stations)) {
        setFilteredToStations(stations.slice(0, 8))
        setShowToDropdown(true)
      }
    } else {
      setFilteredToStations([])
      setShowToDropdown(false)
    }
  }

  const selectFromStation = (station: Station) => {
    setFromStation(station.station_code)
    setFromStationQuery(`${station.station_name} (${station.station_code})`)
    setShowFromDropdown(false)
  }

  const selectToStation = (station: Station) => {
    setToStation(station.station_code)
    setToStationQuery(`${station.station_name} (${station.station_code})`)
    setShowToDropdown(false)
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
      // Search trains using real API
      const trains = await searchTrains(fromStation, toStation)
      
      if (trains && trains.length > 0) {
        // Get detailed info for each train
        const trainDetails = await Promise.allSettled(
          trains.slice(0, 10).map((train: any) => getTrainSchedule(train.train_number))
        )
        
        const validTrains = trainDetails
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => (result as PromiseFulfilledResult<any>).value)
        
        setAvailableTrains(validTrains)
        setShowTrainResults(true)
        
        if (validTrains.length === 0) {
          setErrorMessage("No trains found between selected stations")
        }
      } else {
        setAvailableTrains([])
        setShowTrainResults(true)
        setErrorMessage("No trains found between selected stations")
      }
    } catch (error) {
      console.error('Error searching trains:', error)
      setErrorMessage("Error searching trains. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrainSelect = (train: TrainData) => {
    setSelectedTrain(train)
    setBookingData(prev => ({ 
      ...prev, 
      trainId: train.train_number,
      fromStation,
      toStation 
    }))
  }

  const handleClassSelect = (classCode: string) => {
    setSelectedClass(classCode)
    setBookingData(prev => ({ ...prev, selectedClass: classCode }))
  }

  const isKarnatakaRoute = (trainName: string) => {
    const karnatakaKeywords = ['karnataka', 'bengaluru', 'mysuru', 'hubballi', 'mangaluru', 'chamundi', 'hampi']
    return karnatakaKeywords.some(keyword => trainName.toLowerCase().includes(keyword))
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTrain || !selectedClass || !bookingData.passengerName || !bookingData.passengerEmail) {
      setErrorMessage("Please fill all required fields")
      return
    }

    // Redirect to IRCTC for real booking
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}${month}${day}`
    }

    const irctcUrl = `https://www.irctc.co.in/nget/train-search?fromStation=${fromStation}&toStation=${toStation}&travelDate=${travelDate ? formatDate(travelDate) : ''}&trainNumber=${selectedTrain.train_number}`
    
    const confirmRedirect = window.confirm(
      `🚂 Karnataka Railway System - IRCTC Booking\n\n` +
      `Train: ${selectedTrain.train_name} (${selectedTrain.train_number})\n` +
      `Route: ${fromStationQuery} → ${toStationQuery}\n` +
      `Class: ${selectedClass}\n` +
      `Date: ${travelDate ? format(travelDate, "PPP") : "Not selected"}\n\n` +
      `✅ This will redirect you to IRCTC.co.in for secure ticket booking.\n` +
      `Click OK to proceed with real booking.`
    )
    
    if (confirmRedirect) {
      window.open(irctcUrl, '_blank', 'noopener,noreferrer')
      setBookingStatus("redirected")
    }
  }

  const handleNewSearch = () => {
    setBookingStatus("idle")
    setSelectedTrain(null)
    setSelectedClass("")
    setFromStation("")
    setToStation("")
    setFromStationQuery("")
    setToStationQuery("")
    setTravelDate(undefined)
    setShowTrainResults(false)
    setErrorMessage("")
    setBookingData({
      trainId: "",
      passengerName: "",
      passengerEmail: "",
      seatCount: 1,
      travelDate: "",
      fromStation: "",
      toStation: "",
      selectedClass: ""
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Karnataka Railway Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrainIcon className="h-6 w-6" />
            Karnataka Railway Booking System
          </CardTitle>
          <CardDescription className="text-blue-700">
            Search and book train tickets across India • Powered by Real IRCTC Data
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {bookingStatus === "redirected" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✅ Redirected to IRCTC!</strong> Complete your real ticket booking on the official website.
            <div className="mt-2">
              <Button onClick={handleNewSearch} size="sm" variant="outline" className="mr-2">
                Search More Trains
              </Button>
              <Button onClick={() => window.open('https://www.irctc.co.in/', '_blank')} size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open IRCTC
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Train Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Trains - All India Routes
          </CardTitle>
          <CardDescription>Search trains between any stations in India using real IRCTC data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Karnataka Quick Select */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">🌟 Popular Karnataka Stations</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {karnatakaStations.slice(0, 8).map((station) => (
                <Button
                  key={station.code}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 flex flex-col items-start"
                  onClick={() => !fromStation ? handleQuickSelectFrom(station) : handleQuickSelectTo(station)}
                >
                  <span className="font-medium">{station.code}</span>
                  <span className="text-gray-600 truncate w-full">{station.city}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Station */}
            <div className="relative">
              <Label htmlFor="from-station">From Station</Label>
              <div className="relative">
                <Input
                  id="from-station"
                  type="text"
                  placeholder="Type station name (min 3 characters)..."
                  value={fromStationQuery}
                  onChange={(e) => handleFromStationSearch(e.target.value)}
                  className={fromStation ? 'border-green-500 bg-green-50' : ''}
                />
                {fromStation ? (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
              </div>
              
              {showFromDropdown && filteredFromStations.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {filteredFromStations.map((station, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectFromStation(station)}
                    >
                      <div className="font-medium text-gray-900">
                        {station.station_name} <span className="text-blue-600">({station.station_code})</span>
                      </div>
                      {station.city && <div className="text-sm text-gray-500">{station.city}</div>}
                    </div>
                  ))}
                </div>
              )}
              
              {showFromDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowFromDropdown(false)} />
              )}
            </div>

            {/* To Station */}
            <div className="relative">
              <Label htmlFor="to-station">To Station</Label>
              <div className="relative">
                <Input
                  id="to-station"
                  type="text"
                  placeholder="Type station name (min 3 characters)..."
                  value={toStationQuery}
                  onChange={(e) => handleToStationSearch(e.target.value)}
                  className={toStation ? 'border-green-500 bg-green-50' : ''}
                />
                {toStation ? (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
              </div>
              
              {showToDropdown && filteredToStations.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {filteredToStations.map((station, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectToStation(station)}
                    >
                      <div className="font-medium text-gray-900">
                        {station.station_name} <span className="text-blue-600">({station.station_code})</span>
                      </div>
                      {station.city && <div className="text-sm text-gray-500">{station.city}</div>}
                    </div>
                  ))}
                </div>
              )}
              
              {showToDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowToDropdown(false)} />
              )}
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <Label>Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  {travelDate ? format(travelDate, "PPP") : "Select travel date"}
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

          <Button onClick={handleTrainSearch} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? "🔍 Searching Real Train Data..." : "🚂 Search Trains"}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Train Results */}
      {showTrainResults && availableTrains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrainIcon className="h-5 w-5 text-green-600" />
              Available Trains ({availableTrains.length} found)
            </CardTitle>
            <CardDescription>Real-time data from Indian Railways • Select train to proceed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTrains.map((train, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTrain?.train_number === train.train_number 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleTrainSelect(train)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-blue-900">
                        {train.train_name} ({train.train_number})
                      </h3>
                      {isKarnatakaRoute(train.train_name) && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                          <Star className="h-3 w-3 mr-1" />
                          Karnataka Route
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {train.from_station_name} → {train.to_station_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      {train.departure_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {train.departure_time}
                        </span>
                      )}
                      {train.duration && <span>⏱️ {train.duration}</span>}
                      {train.distance && <span>📏 {train.distance}</span>}
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">Available</Badge>
                </div>

                {selectedTrain?.train_number === train.train_number && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <Label className="text-sm font-semibold text-blue-900 mb-3 block">
                      🎫 Select Class for Booking
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {[
                        { code: '1A', name: 'First AC' },
                        { code: '2A', name: 'Second AC' },
                        { code: '3A', name: 'Third AC' },
                        { code: 'SL', name: 'Sleeper' },
                        { code: 'CC', name: 'Chair Car' },
                        { code: '2S', name: 'Second Sitting' }
                      ].map((classInfo) => (
                        <Button
                          key={classInfo.code}
                          variant={selectedClass === classInfo.code ? "default" : "outline"}
                          size="sm"
                          className="flex flex-col h-auto py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClassSelect(classInfo.code)
                          }}
                        >
                          <span className="font-bold">{classInfo.code}</span>
                          <span className="text-xs">{classInfo.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      {selectedTrain && selectedClass && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CreditCard className="h-5 w-5" />
              🎫 Complete Booking on IRCTC
            </CardTitle>
            <CardDescription className="text-green-700">
              {selectedTrain.train_name} ({selectedTrain.train_number}) | {selectedClass} Class
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <Label htmlFor="passengerName">Passenger Name</Label>
                <Input
                  id="passengerName"
                  placeholder="Enter full name as per ID proof"
                  value={bookingData.passengerName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passengerName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="passengerEmail">Email Address</Label>
                <Input
                  id="passengerEmail"
                  type="email"
                  placeholder="Enter email address for booking confirmation"
                  value={bookingData.passengerEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passengerEmail: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="seatCount">Number of Passengers</Label>
                <Select
                  value={bookingData.seatCount.toString()}
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, seatCount: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>🚂 Train:</span>
                    <span className="font-medium">{selectedTrain.train_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🛤️ Route:</span>
                    <span>{fromStationQuery} → {toStationQuery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🎫 Class:</span>
                    <span className="font-medium">{selectedClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>👥 Passengers:</span>
                    <span>{bookingData.seatCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📅 Date:</span>
                    <span>{travelDate ? format(travelDate, "PPP") : "Not selected"}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                🎫 Proceed to IRCTC for Real Booking
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-gray-600 text-center">
                ✅ Secure booking through official IRCTC website • Your data is protected
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showTrainResults && availableTrains.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <TrainIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Trains Found</h3>
            <p className="text-gray-500 mb-4">No trains found between the selected stations for your travel date.</p>
            <Button onClick={() => window.open('https://www.irctc.co.in/', '_blank')}>
              🔍 Check IRCTC Directly
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}