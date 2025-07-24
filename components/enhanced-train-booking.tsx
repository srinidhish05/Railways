"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, CreditCard, CheckCircle, AlertCircle, Search, Clock, Train as TrainIcon, Calendar, IndianRupee, ExternalLink } from "lucide-react"
import { karnatakaStations, type Station } from "@/data/karnataka-stations"
import { karnatakaTrains, searchTrainsBetweenStations, type TrainSchedule } from "@/data/karnataka-trains"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

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

export function EnhancedTrainBooking() {
  // Station and train search states
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [availableTrains, setAvailableTrains] = useState<TrainSchedule[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  
  // Search functionality states
  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>([])
  const [filteredToStations, setFilteredToStations] = useState<Station[]>([])
  
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null)
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
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [bookedTicketDetails, setBookedTicketDetails] = useState<any>(null)

  const getRouteDisplay = (train: TrainSchedule) => {
    if ((train.from === fromStation && train.to === toStation) || 
        (train.from === toStation && train.to === fromStation)) {
      return `${train.fromName} → ${train.toName}`
    }
    
    const fromInVia = train.viaStations.includes(fromStation)
    const toInVia = train.viaStations.includes(toStation)
    const fromIsOrigin = train.from === fromStation
    const toIsDestination = train.to === toStation
    
    if ((fromIsOrigin || fromInVia) && (toIsDestination || toInVia)) {
      return `${getStationName(fromStation)} → ${getStationName(toStation)} (via ${train.trainName})`
    }
    
    return `${train.fromName} → ${train.toName}`
  }

  const handleTrainSearch = () => {
    if (!fromStation || !toStation || !travelDate) {
      setErrorMessage("Please select from station, to station, and travel date")
      return
    }

    if (fromStation === toStation) {
      setErrorMessage("From and To stations cannot be the same")
      return
    }

    setIsLoading(true)
    setShowTrainResults(false)
    setErrorMessage("")

    setTimeout(() => {
      let trains = searchTrainsBetweenStations(fromStation, toStation)
      
      setAvailableTrains(trains)
      setShowTrainResults(true)
      setIsLoading(false)
      
      if (trains.length === 0) {
        setErrorMessage(`No direct trains found between ${getStationName(fromStation)} and ${getStationName(toStation)}. Try different stations or check IRCTC for connecting routes.`)
      } else {
        setErrorMessage("")
      }
    }, 1000)
  }

  const handleTrainSelect = (train: TrainSchedule) => {
    setSelectedTrain(train)
    setSelectedClass("")
    setBookingData(prev => ({ 
      ...prev, 
      trainId: train.trainNumber,
      fromStation,
      toStation 
    }))
  }

  const handleClassSelect = (classCode: string) => {
    setSelectedClass(classCode)
    setBookingData(prev => ({ ...prev, selectedClass: classCode }))
  }

  const getSelectedClassInfo = () => {
    if (!selectedTrain || !selectedClass) return null
    return selectedTrain.classes.find(c => c.class === selectedClass)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTrain || !selectedClass) {
      setErrorMessage("Please select a train and class")
      return
    }

    const classInfo = getSelectedClassInfo()
    if (!classInfo || classInfo.availableSeats < bookingData.seatCount) {
      setErrorMessage("Not enough seats available in selected class")
      setBookingStatus("error")
      return
    }

    const irctcUrl = `https://www.irctc.co.in/nget/train-search?fromStation=${fromStation}&toStation=${toStation}&travelDate=${travelDate?.toISOString().split('T')[0]}&trainNumber=${selectedTrain.trainNumber}`
    
    const confirmRedirect = window.confirm(
      `This will redirect you to IRCTC (Official Indian Railways) for real ticket booking.\n\n` +
      `Train: ${selectedTrain.trainName} (${selectedTrain.trainNumber})\n` +
      `Route: ${getStationName(fromStation)} → ${getStationName(toStation)}\n` +
      `Class: ${classInfo.className}\n\n` +
      `Click OK to proceed to IRCTC.co.in for real booking, or Cancel to stay here.`
    )
    
    if (confirmRedirect) {
      window.open(irctcUrl, '_blank', 'noopener,noreferrer')
      
      setBookingStatus("success")
      const redirectDetails = {
        redirected: true,
        trainName: selectedTrain.trainName,
        trainNumber: selectedTrain.trainNumber,
        fromStation: getStationName(fromStation),
        toStation: getStationName(toStation),
        className: classInfo.className,
        classCode: selectedClass,
        travelDate: travelDate ? travelDate.toDateString() : '',
        departureTime: selectedTrain.departureTime,
        duration: selectedTrain.duration,
        redirectTime: new Date().toLocaleString(),
        irctcUrl
      }
      setBookedTicketDetails(redirectDetails)
    }
  }

  const handleNewBooking = () => {
    setBookingStatus("idle")
    setBookedTicketDetails(null)
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
    setSelectedTrain(null)
    setSelectedClass("")
    setFromStation("")
    setToStation("")
    setFromSearch("")
    setToSearch("")
    setTravelDate(undefined)
    setShowTrainResults(false)
    setErrorMessage("")
    setShowFromDropdown(false)
    setShowToDropdown(false)
  }

  const handleFromSearchChange = (value: string) => {
    setFromSearch(value)
    if (value.length > 0) {
      const filtered = karnatakaStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredFromStations(filtered.slice(0, 8))
      setShowFromDropdown(true)
    } else {
      setFilteredFromStations([])
      setShowFromDropdown(false)
      setFromStation("")
    }
  }

  const handleToSearchChange = (value: string) => {
    setToSearch(value)
    if (value.length > 0) {
      const filtered = karnatakaStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredToStations(filtered.slice(0, 8))
      setShowToDropdown(true)
    } else {
      setFilteredToStations([])
      setShowToDropdown(false)
      setToStation("")
    }
  }

  const selectFromStation = (station: Station) => {
    setFromStation(station.code)
    setFromSearch(`${station.name} (${station.code})`)
    setShowFromDropdown(false)
    setFilteredFromStations([])
  }

  const selectToStation = (station: Station) => {
    setToStation(station.code)
    setToSearch(`${station.name} (${station.code})`)
    setShowToDropdown(false)
    setFilteredToStations([])
  }

  const getStationName = (code: string) => {
    const station = karnatakaStations.find(s => s.code === code)
    return station ? `${station.name} (${station.code})` : code
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Booking Success Page */}
      {bookingStatus === "success" && bookedTicketDetails && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-6 w-6" />
              IRCTC Redirect Successful!
            </CardTitle>
            <CardDescription className="text-green-100">
              You have been redirected to IRCTC for real ticket booking
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Journey Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Train:</span>
                  <p className="text-gray-900">{bookedTicketDetails.trainName} ({bookedTicketDetails.trainNumber})</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Route:</span>
                  <p className="text-gray-900">{bookedTicketDetails.fromStation} → {bookedTicketDetails.toStation}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-900">{bookedTicketDetails.travelDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Class:</span>
                  <p className="text-gray-900">{bookedTicketDetails.className}</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <Button 
                  onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open IRCTC
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNewBooking}
                >
                  Search Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show booking form only if not successful */}
      {bookingStatus !== "success" && (
        <>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                (fromStation && toStation && travelDate) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Search Trains</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div className={`h-full bg-green-500 rounded transition-all duration-300 ${
                selectedTrain ? 'w-full' : 'w-0'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedTrain ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Select Train & Class</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div className={`h-full bg-green-500 rounded transition-all duration-300 ${
                selectedClass ? 'w-full' : 'w-0'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedClass ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Redirect to IRCTC</span>
            </div>
          </div>

          {/* Station Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Search Trains - All Karnataka Routes
              </CardTitle>
              <CardDescription>
                Choose from {karnatakaStations.length} railway stations across Karnataka
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Station */}
                <div className="relative">
                  <Label htmlFor="from-station">From Station</Label>
                  <div className="relative">
                    <Input
                      id="from-station"
                      type="text"
                      placeholder="Type to search departure station..."
                      value={fromSearch}
                      onChange={(e) => handleFromSearchChange(e.target.value)}
                      onFocus={() => {
                        if (filteredFromStations.length > 0) {
                          setShowFromDropdown(true)
                        }
                      }}
                      className={`pr-10 ${fromStation ? 'border-green-500 bg-green-50' : ''}`}
                    />
                    {fromStation ? (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    ) : (
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {showFromDropdown && filteredFromStations.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {filteredFromStations.map((station) => (
                        <div
                          key={station.code}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectFromStation(station)}
                        >
                          <div className="font-medium text-gray-900">
                            {station.name} <span className="text-blue-600">({station.code})</span>
                          </div>
                          <div className="text-sm text-gray-500">{station.city}, {station.district}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showFromDropdown && fromSearch.length > 0 && filteredFromStations.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No stations found matching "{fromSearch}"
                      </div>
                    </div>
                  )}
                  
                  {showFromDropdown && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowFromDropdown(false)}
                    />
                  )}
                </div>

                {/* To Station */}
                <div className="relative">
                  <Label htmlFor="to-station">To Station</Label>
                  <div className="relative">
                    <Input
                      id="to-station"
                      type="text"
                      placeholder="Type to search destination station..."
                      value={toSearch}
                      onChange={(e) => handleToSearchChange(e.target.value)}
                      onFocus={() => {
                        if (filteredToStations.length > 0) {
                          setShowToDropdown(true)
                        }
                      }}
                      className={`pr-10 ${toStation ? 'border-green-500 bg-green-50' : ''}`}
                    />
                    {toStation ? (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    ) : (
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {showToDropdown && filteredToStations.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {filteredToStations.map((station) => (
                        <div
                          key={station.code}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectToStation(station)}
                        >
                          <div className="font-medium text-gray-900">
                            {station.name} <span className="text-blue-600">({station.code})</span>
                          </div>
                          <div className="text-sm text-gray-500">{station.city}, {station.district}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showToDropdown && toSearch.length > 0 && filteredToStations.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No stations found matching "{toSearch}"
                      </div>
                    </div>
                  )}
                  
                  {showToDropdown && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowToDropdown(false)}
                    />
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

              <Button 
                onClick={handleTrainSearch} 
                disabled={isLoading || !fromStation || !toStation || !travelDate} 
                className="w-full" 
                size="lg"
              >
                {isLoading ? "Searching..." : `Search Trains (${karnatakaTrains.length} Available)`}
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
                <CardDescription>
                  Route: {getStationName(fromStation)} → {getStationName(toStation)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableTrains.map((train) => (
                  <div
                    key={train.trainNumber}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTrain?.trainNumber === train.trainNumber 
                        ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200" 
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleTrainSelect(train)}
                  >
                    {selectedTrain?.trainNumber === train.trainNumber && (
                      <div className="mb-3 p-2 bg-blue-100 rounded text-center">
                        <p className="text-sm text-blue-800 font-medium">
                          ✓ Train Selected - Choose class below to continue
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900">
                          {train.trainName} ({train.trainNumber})
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {getRouteDisplay(train)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {train.departureTime} - {train.arrivalTime}
                          </span>
                          <span>{train.duration}</span>
                          <span>{train.distance} km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={train.status === "Active" ? "default" : "secondary"}>
                          {train.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{train.type}</p>
                        <p className="text-xs text-gray-500">{train.frequency}</p>
                      </div>
                    </div>

                    {/* Available Classes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {train.classes.map((trainClass) => (
                        <div
                          key={trainClass.class}
                          className="p-2 bg-gray-50 rounded border text-xs"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{trainClass.class}</p>
                              <p className="text-gray-600">{trainClass.className}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {trainClass.currentPrice}
                              </p>
                              <Badge 
                                className={`text-xs ${
                                  trainClass.status === "AVAILABLE" ? "bg-green-100 text-green-800" :
                                  trainClass.status === "RAC" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}
                              >
                                {trainClass.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-500 mt-1">
                            {trainClass.availableSeats} / {trainClass.totalSeats} available
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedTrain?.trainNumber === train.trainNumber && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          <Label className="text-sm font-semibold text-blue-900">
                            Step 2: Select Class for Booking
                          </Label>
                        </div>
                        <p className="text-xs text-blue-700 mb-3">Choose your travel class to proceed with booking</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {train.classes.filter(c => c.status !== "NOT_AVAILABLE").map((trainClass) => (
                            <Button
                              key={trainClass.class}
                              variant={selectedClass === trainClass.class ? "default" : "outline"}
                              size="sm"
                              className={`h-auto p-3 text-left justify-start ${
                                selectedClass === trainClass.class ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClassSelect(trainClass.class)
                              }}
                              disabled={trainClass.availableSeats === 0}
                            >
                              <div className="w-full">
                                <div className="font-medium">{trainClass.class} - ₹{trainClass.currentPrice}</div>
                                <div className="text-xs opacity-80">{trainClass.className}</div>
                                <div className="text-xs opacity-80">{trainClass.availableSeats} seats available</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                        {selectedClass && (
                          <div className="mt-3 p-2 bg-green-100 rounded text-center">
                            <p className="text-sm text-green-800 font-medium">
                              ✓ {getSelectedClassInfo()?.className} selected - Proceed to booking form below
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          {selectedTrain && selectedClass && (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader className="bg-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <ExternalLink className="h-5 w-5" />
                  Step 3: Real IRCTC Booking
                </CardTitle>
                <CardDescription className="text-orange-700">
                  {selectedTrain.trainName} ({selectedTrain.trainNumber}) | {getSelectedClassInfo()?.className} | 
                  ₹{getSelectedClassInfo()?.currentPrice} per passenger
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleBooking} className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Real IRCTC Booking:</strong> This will redirect you to the official IRCTC website for actual ticket booking and payment.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="passenger-name">Passenger Name (as per ID proof)</Label>
                    <Input
                      id="passenger-name"
                      type="text"
                      placeholder="Enter full name as per government ID"
                      value={bookingData.passengerName}
                      onChange={(e) =>
                        setBookingData((prev) => ({ ...prev, passengerName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="passenger-email">Email Address</Label>
                    <Input
                      id="passenger-email"
                      type="email"
                      placeholder="Enter email for IRCTC confirmation"
                      value={bookingData.passengerEmail}
                      onChange={(e) =>
                        setBookingData((prev) => ({ ...prev, passengerEmail: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="seat-count">Number of Passengers</Label>
                    <Select
                      value={bookingData.seatCount.toString()}
                      onValueChange={(value) =>
                        setBookingData((prev) => ({ ...prev, seatCount: parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} {count === 1 ? "Passenger" : "Passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Booking Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      IRCTC Booking Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Train:</span>
                        <span className="font-medium">{selectedTrain.trainName} ({selectedTrain.trainNumber})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span>{getStationName(fromStation)} → {getStationName(toStation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span>{getSelectedClassInfo()?.className} ({selectedClass})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passengers:</span>
                        <span>{bookingData.seatCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travel Date:</span>
                        <span>{travelDate ? format(travelDate, "PPP") : "Not selected"}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                        <span>Total Amount:</span>
                        <span className="flex items-center text-orange-600">
                          <IndianRupee className="h-4 w-4" />
                          {getSelectedClassInfo() ? getSelectedClassInfo()!.currentPrice * bookingData.seatCount : 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                    disabled={!selectedTrain || isLoading || !getSelectedClassInfo() || !bookingData.passengerName || !bookingData.passengerEmail}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book Real Ticket on IRCTC
                  </Button>
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
                <p className="text-gray-500 mb-4">
                  No direct trains are available between the selected stations on the chosen date.
                </p>
                <div className="text-sm text-gray-600 max-w-md mx-auto">
                  <p className="mb-2"><strong>Suggestions:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Try different travel dates</li>
                    <li>Check connecting routes via major junctions</li>
                    <li>Consider nearby stations</li>
                    <li>Book tickets directly from IRCTC for more options</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Button 
                    onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open IRCTC Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Footer */}
          <div className="bg-blue-50 rounded-lg p-4 text-center text-sm text-blue-800">
            <p>
              <strong>{karnatakaStations.length} Stations</strong> | 
              <strong>{karnatakaTrains.length} Trains</strong> | 
              Real IRCTC Booking Available
            </p>
          </div>
        </>
      )}
    </div>
  )
}