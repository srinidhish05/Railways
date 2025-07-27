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
import { MapPin, CreditCard, CheckCircle, AlertCircle, Search, Clock, Train as TrainIcon, Calendar, IndianRupee, ExternalLink, Star, Bookmark, Filter, Users, Route, Phone } from "lucide-react"
import { karnatakaStations, type Station } from "@/data/karnataka-stations"
import { karnatakaTrains, searchTrainsBetweenStations, type TrainSchedule } from "@/data/karnataka-trains"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"

interface BookingData {
  trainId: string
  passengerName: string
  passengerEmail: string
  passengerPhone: string
  seatCount: number
  travelDate: string
  fromStation: string
  toStation: string
  selectedClass: string
  preferences: {
    mealPreference: string
    berthPreference: string
    coachPreference: string
  }
}

interface QuickRoute {
  from: string
  to: string
  label: string
  popular: boolean
}

const popularRoutes: QuickRoute[] = [
  { from: "SBC", to: "MYS", label: "Bengaluru → Mysuru", popular: true },
  { from: "SBC", to: "UBL", label: "Bengaluru → Hubballi", popular: true },
  { from: "SBC", to: "MAJN", label: "Bengaluru → Mangaluru", popular: true },
  { from: "MYS", to: "SBC", label: "Mysuru → Bengaluru", popular: true },
  { from: "UBL", to: "SBC", label: "Hubballi → Bengaluru", popular: false },
  { from: "MAJN", to: "SBC", label: "Mangaluru → Bengaluru", popular: false },
  { from: "YPR", to: "MYS", label: "Yesvantpur → Mysuru", popular: false },
  { from: "DWR", to: "UBL", label: "Dharwad → Hubballi", popular: false },
]

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
    passengerPhone: "",
    seatCount: 1,
    travelDate: "",
    fromStation: "",
    toStation: "",
    selectedClass: "",
    preferences: {
      mealPreference: "veg",
      berthPreference: "no-preference",
      coachPreference: "no-preference"
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [bookedTicketDetails, setBookedTicketDetails] = useState<any>(null)
  const [recentSearches, setRecentSearches] = useState<QuickRoute[]>([])
  const [showQuickDates, setShowQuickDates] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Load recent searches on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recentTrainSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const saveRecentSearch = (from: string, to: string) => {
    const newSearch: QuickRoute = {
      from,
      to,
      label: `${getStationName(from).split('(')[0].trim()} → ${getStationName(to).split('(')[0].trim()}`,
      popular: false
    }
    
    const updated = [newSearch, ...recentSearches.filter(s => !(s.from === from && s.to === to))].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentTrainSearches', JSON.stringify(updated))
  }

  const selectQuickRoute = (route: QuickRoute) => {
    setFromStation(route.from)
    setToStation(route.to)
    setFromSearch(getStationName(route.from))
    setToSearch(getStationName(route.to))
  }

  const getQuickDates = () => {
    const today = new Date()
    return [
      { date: today, label: "Today" },
      { date: addDays(today, 1), label: "Tomorrow" },
      { date: addDays(today, 2), label: format(addDays(today, 2), "EEE, MMM d") },
      { date: addDays(today, 3), label: format(addDays(today, 3), "EEE, MMM d") },
      { date: addDays(today, 7), label: "Next Week" },
    ]
  }

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

    // Save this search
    saveRecentSearch(fromStation, toStation)

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
      `🚂 OFFICIAL IRCTC BOOKING\n\n` +
      `Train: ${selectedTrain.trainName} (${selectedTrain.trainNumber})\n` +
      `Route: ${getStationName(fromStation)} → ${getStationName(toStation)}\n` +
      `Class: ${classInfo.className}\n` +
      `Passengers: ${bookingData.seatCount}\n` +
      `Total: ₹${classInfo.currentPrice * bookingData.seatCount}\n\n` +
      `This will redirect you to IRCTC (Official Indian Railways) for secure ticket booking and payment.\n\n` +
      `Click OK to proceed to IRCTC.co.in for real booking.`
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
        passengerCount: bookingData.seatCount,
        totalAmount: classInfo.currentPrice * bookingData.seatCount,
        redirectTime: new Date().toLocaleString(),
        irctcUrl,
        preferences: bookingData.preferences
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
      passengerPhone: "",
      seatCount: 1,
      travelDate: "",
      fromStation: "",
      toStation: "",
      selectedClass: "",
      preferences: {
        mealPreference: "veg",
        berthPreference: "no-preference",
        coachPreference: "no-preference"
      }
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

  const swapStations = () => {
    const tempStation = fromStation
    const tempSearch = fromSearch
    
    setFromStation(toStation)
    setFromSearch(toSearch)
    setToStation(tempStation)
    setToSearch(tempSearch)
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
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-gray-800 dark:border-green-600">
          <CardHeader className="bg-green-500 text-white dark:bg-green-700">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-6 w-6" />
              🎉 IRCTC Redirect Successful!
            </CardTitle>
            <CardDescription className="text-green-100">
              You have been redirected to IRCTC for secure ticket booking and payment
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <TrainIcon className="h-4 w-4" />
                Journey Details
              </h4>
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
                <div>
                  <span className="font-medium text-gray-700">Passengers:</span>
                  <p className="text-gray-900">{bookedTicketDetails.passengerCount}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Amount:</span>
                  <p className="text-orange-600 font-semibold flex items-center">
                    <IndianRupee className="h-3 w-3" />
                    {bookedTicketDetails.totalAmount}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3 flex-wrap">
                <Button 
                  onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                           <ExternalLink className="w-4 h-4 mr-2" />
                  Open IRCTC
                </Button>
                <Button 
                  onClick={() => window.open('https://www.irctc.co.in/nget/profile/user-registration', '_blank')}
                  variant="outline" 
                  size="sm"
                  // Adjusted for dark mode: text becomes light, border dark gray, hover background lighter dark gray
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-50 dark:hover:bg-gray-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Create IRCTC Account
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNewBooking}
                  // Adjusted for dark mode: text becomes light, border dark gray, hover background lighter dark gray
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-50 dark:hover:bg-gray-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Again
                </Button>
              </div>
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <Star className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Next Steps:</strong> Complete your booking on IRCTC with your login credentials. If you don't have an IRCTC account, create one first using the link above.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Show booking form only if not successful */}
      {bookingStatus !== "success" && (
        <>
         {/* Header with Karnataka Railway Info */}
<Card className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-blue-900 shadow-md backdrop-blur-sm rounded-xl">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 tracking-wide">
          🚂 NammaTrain <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-gray-300 text-sm">
          Book train tickets across Karnataka with real&nbsp;
          <span className="text-green-400 font-semibold">IRCTC</span> integration
        </p>
      </div>
      <div className="text-right text-sm text-gray-300 space-y-1">
        <div>
          <span className="text-blue-400 font-bold">{karnatakaStations.length}</span> Stations
        </div>
        <div>
          <span className="text-blue-400 font-bold">{karnatakaTrains.length}</span> Trains
        </div>
        <div className="text-green-400 font-semibold">✓ IRCTC Integration</div>
      </div>
    </div>
  </CardContent>
</Card>


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
              <span className="ml-2 text-sm font-medium">Book on IRCTC</span>
            </div>
          </div>

          {/* Quick Routes */}
          {(popularRoutes.length > 0 || recentSearches.length > 0) && (
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Bookmark className="h-4 w-4" />
                  Quick Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Recent Searches</p>
                      <div className="flex gap-2 flex-wrap">
                        {recentSearches.map((route, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => selectQuickRoute(route)}
                            className="text-xs"
                          >
                            {route.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Popular Routes</p>
                    <div className="flex gap-2 flex-wrap">
                      {popularRoutes.filter(r => r.popular).map((route, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => selectQuickRoute(route)}
                          className="text-xs"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {route.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Station Selection */}
          <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
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
<div className="space-y-1 relative">
  <Label htmlFor="from-station" className="text-sm text-gray-300">
    From Station
  </Label>
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
      className={`pr-10 bg-gray-900 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 ${
        fromStation ? 'border-green-500 bg-green-900 text-green-100' : ''
      }`}
    />
    {fromStation ? (
      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
    ) : (
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    )}
  </div>

  {showFromDropdown && filteredFromStations.length > 0 && (
    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
      {filteredFromStations.map((station) => (
        <div
          key={station.code}
          className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors text-white"
          onClick={() => selectFromStation(station)}
        >
          <div className="font-medium text-white">
            {station.name} <span className="text-blue-400">({station.code})</span>
          </div>
          <div className="text-sm text-gray-400">{station.city}, {station.district}</div>
        </div>
      ))}
    </div>
  )}

  {showFromDropdown && fromSearch.length > 0 && filteredFromStations.length === 0 && (
    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
      <div className="px-4 py-3 text-gray-400 text-center">
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


{/* Swap Button */}
<div className="flex items-end justify-center md:col-span-2 md:-my-2">
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={swapStations}
    disabled={!fromStation || !toStation}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
      ${
        fromStation && toStation
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
      }`}
  >
    <Route className="h-4 w-4" />
    Swap
  </Button>
</div>


               {/* To Station */}
<div className="space-y-1 relative md:-mt-8">
  <Label htmlFor="to-station" className="text-sm text-gray-300">
    To Station
  </Label>
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
      className={`pr-10 bg-gray-900 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 ${
        toStation ? 'border-green-500 bg-green-900 text-green-100' : ''
      }`}
    />
    {toStation ? (
      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
    ) : (
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    )}
  </div>

  {showToDropdown && filteredToStations.length > 0 && (
    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
      {filteredToStations.map((station) => (
        <div
          key={station.code}
          className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors text-white"
          onClick={() => selectToStation(station)}
        >
          <div className="font-medium text-white">
            {station.name} <span className="text-blue-400">({station.code})</span>
          </div>
          <div className="text-sm text-gray-400">{station.city}, {station.district}</div>
        </div>
      ))}
    </div>
  )}

  {showToDropdown && toSearch.length > 0 && filteredToStations.length === 0 && (
    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
      <div className="px-4 py-3 text-gray-400 text-center">
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
  <Label className="text-sm text-gray-300">Travel Date</Label>
  <div className="flex gap-2 mt-1">
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setCalendarOpen(true)}
          className="flex-1 justify-start text-left font-normal bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-600"
        >
          <Calendar className="mr-2 h-4 w-4 text-blue-500" />
          {travelDate ? format(travelDate, "PPP") : "Select travel date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-700 text-white rounded-lg shadow-lg">
        <CalendarComponent
          mode="single"
          selected={travelDate}
          onSelect={(date) => {
            setTravelDate(date);
            setCalendarOpen(false); // Auto-close on date select
          }}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>

    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowQuickDates(!showQuickDates)}
      className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-100"
    >
      Quick
    </Button>
  </div>

  {showQuickDates && (
    <div className="mt-3 flex gap-2 flex-wrap">
      {getQuickDates().map((quickDate, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => {
            setTravelDate(quickDate.date);
            setShowQuickDates(false); // Auto-close quick list
          }}
          className="text-xs bg-gray-700 hover:bg-blue-600 hover:text-white border border-gray-600 text-gray-200"
        >
          {quickDate.label}
        </Button>
      ))}
    </div>
  )}
</div>


              <Button 
                onClick={handleTrainSearch} 
                disabled={isLoading || !fromStation || !toStation || !travelDate} 
                className="w-full bg-blue-600 hover:bg-blue-700" 
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
  <div className="mt-6 bg-[#1e293b] rounded-xl shadow-lg border border-blue-700 p-6">
    {/* Header */}
    <div className="flex flex-col mb-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <TrainIcon className="h-6 w-6 text-blue-400" />
        Available Trains ({availableTrains.length} found)
      </h2>
      <p className="text-sm text-gray-300">
        Route: {getStationName(fromStation)} → {getStationName(toStation)} on{" "}
        {travelDate ? format(travelDate, "PPP") : ""}
      </p>
    </div>

    {/* Train List */}
    <div className="space-y-4">
      {availableTrains.map((train) => (
        <div
          key={train.trainNumber}
          className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
            selectedTrain?.trainNumber === train.trainNumber
              ? "bg-gradient-to-r from-blue-900 to-blue-800 border-2 border-blue-500 shadow-xl"
              : "bg-[#0f172a] border border-gray-700 hover:border-blue-600 hover:shadow-lg"
          }`}
          onClick={() => handleTrainSelect(train)}
        >
          {/* Selected Notice */}
          {selectedTrain?.trainNumber === train.trainNumber && (
            <div className="mb-3 p-2 bg-blue-100 rounded text-center">
              <p className="text-sm text-blue-800 font-medium">
                ✓ Train Selected - Choose class below to continue
              </p>
            </div>
          )}

          {/* Train Info */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-white">
                {train.trainName} ({train.trainNumber})
              </h3>
              <p className="text-gray-400 text-sm">{getRouteDisplay(train)}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {train.departureTime} - {train.arrivalTime}
                </span>
                <span>{train.duration}</span>
                <span>{train.distance} km</span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                className={`${
                  train.status === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {train.status}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">{train.type}</p>
              <p className="text-xs text-gray-400">{train.frequency}</p>
            </div>
          </div>

          {/* Available Classes */}
          {selectedTrain?.trainNumber === train.trainNumber && (
            <div className="mt-4">
              <h4 className="text-blue-300 mb-2 text-sm font-semibold">
                Step 2: Select Class for Booking
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {train.classes
                  .filter((c) => c.status !== "NOT_AVAILABLE")
                  .map((trainClass) => (
                    <Button
                      key={trainClass.class}
                      variant={
                        selectedClass === trainClass.class
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className={`h-auto p-3 text-left justify-start ${
                        selectedClass === trainClass.class
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassSelect(trainClass.class);

                        // Scroll to booking form after selection
                        setTimeout(() => {
                          document
                            .getElementById("bookingForm")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 200);
                      }}
                      disabled={trainClass.availableSeats === 0}
                    >
                      <div className="w-full">
                        <div className="font-medium">
                          {trainClass.class} - ₹{trainClass.currentPrice}
                        </div>
                        <div className="text-xs opacity-80">
                          {trainClass.className}
                        </div>
                        <div className="text-xs opacity-80">
                          {trainClass.availableSeats} seats available
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
              {selectedClass && (
                <div className="mt-3 p-2 bg-green-100 rounded text-center">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ {getSelectedClassInfo()?.className} selected - Proceed to
                    booking form below
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

          {/* Enhanced Booking Form */}
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
                      <strong>Official IRCTC Booking:</strong> This will redirect you to the official IRCTC website for secure ticket booking and payment processing.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="passenger-phone">Mobile Number</Label>
                      <Input
                        id="passenger-phone"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={bookingData.passengerPhone}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, passengerPhone: e.target.value }))
                        }
                        required
                      />
                    </div>
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

                  {/* Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Meal Preference</Label>
                      <Select
                        value={bookingData.preferences.mealPreference}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, mealPreference: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                          <SelectItem value="jain">Jain Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Berth Preference</Label>
                      <Select
                        value={bookingData.preferences.berthPreference}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, berthPreference: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                          <SelectItem value="lower">Lower Berth</SelectItem>
                          <SelectItem value="middle">Middle Berth</SelectItem>
                          <SelectItem value="upper">Upper Berth</SelectItem>
                          <SelectItem value="side-lower">Side Lower</SelectItem>
                          <SelectItem value="side-upper">Side Upper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Coach Preference</Label>
                      <Select
                        value={bookingData.preferences.coachPreference}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, coachPreference: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                          <SelectItem value="ladies-only">Ladies Only</SelectItem>
                          <SelectItem value="handicapped">Handicapped Friendly</SelectItem>
                          <SelectItem value="senior-citizen">Senior Citizen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Booking Summary */}
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
                        <span>Departure:</span>
                        <span>{selectedTrain.departureTime} | Duration: {selectedTrain.duration}</span>
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
                      <div className="flex justify-between">
                        <span>Meal Preference:</span>
                        <span className="capitalize">{bookingData.preferences.mealPreference}</span>
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
                    disabled={!selectedTrain || isLoading || !getSelectedClassInfo() || !bookingData.passengerName || !bookingData.passengerEmail || !bookingData.passengerPhone}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book Real Ticket on IRCTC - ₹{getSelectedClassInfo() ? getSelectedClassInfo()!.currentPrice * bookingData.seatCount : 0}
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
                  No direct trains are available between the selected stations.
                </p>
                <div className="text-sm text-gray-600 max-w-md mx-auto">
                  <p className="mb-2"><strong>Suggestions:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Try different travel dates</li>
                    <li>Check connecting routes via major junctions like Bengaluru</li>
                    <li>Consider nearby stations</li>
                    <li>Book tickets directly from IRCTC for more options</li>
                  </ul>
                </div>
                <div className="mt-6 flex gap-3 justify-center">
                  <Button 
                    onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open IRCTC Website
                  </Button>
                  <Button 
                    onClick={handleNewBooking}
                    variant="outline"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Try Different Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}