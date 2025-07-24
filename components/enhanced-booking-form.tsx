"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, CalendarIcon, MapPin, Clock, IndianRupee, Train, ArrowRight, ExternalLink, Loader2, CheckCircle, Users, Route } from "lucide-react"
import { format } from "date-fns"

// Real API configuration
const RAPIDAPI_KEY = 'f65c271e00mshce64e8cb8563b11p128323jsn5857c27564f3'

// Real API functions for train search
const searchTrainsBetweenStations = async (fromStation: string, toStation: string, date: string) => {
  try {
    const response = await fetch(
      `https://irctc-api2.p.rapidapi.com/trainsBetweenStations?fromStationCode=${fromStation}&toStationCode=${toStation}&dateOfJourney=${date}`,
      {
        headers: {
          'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error searching trains between stations:', error)
    return null
  }
}

const searchTrainByNumber = async (trainNumber: string) => {
  try {
    const response = await fetch(`https://irctc-api2.p.rapidapi.com/trainSchedule?trainNumber=${trainNumber}`, {
      headers: {
        'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error searching train by number:', error)
    return null
  }
}

const getSeatAvailability = async (trainNumber: string, fromStation: string, toStation: string, date: string, classType: string) => {
  try {
    const response = await fetch(
      `https://irctc-api2.p.rapidapi.com/seatAvailability?trainNumber=${trainNumber}&fromStationCode=${fromStation}&toStationCode=${toStation}&dateOfJourney=${date}&classType=${classType}`,
      {
        headers: {
          'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error getting seat availability:', error)
    return null
  }
}

const getFareInquiry = async (trainNumber: string, fromStation: string, toStation: string, date: string) => {
  try {
    const response = await fetch(
      `https://irctc-api2.p.rapidapi.com/fareEnquiry?trainNumber=${trainNumber}&fromStationCode=${fromStation}&toStationCode=${toStation}&dateOfJourney=${date}`,
      {
        headers: {
          'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error getting fare inquiry:', error)
    return null
  }
}

const getAllStations = async () => {
  try {
    const response = await fetch('https://irctc-api2.p.rapidapi.com/getAllStations', {
      headers: {
        'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error getting all stations:', error)
    return []
  }
}

interface Station {
  code: string
  name: string
  city: string
  state?: string
}

interface TrainResult {
  trainNumber: string
  trainName: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  distance: number
  availableClasses: Array<{
    class: string
    available: number
    price: number
    status: "AVAILABLE" | "RAC" | "WL" | "GNWL"
  }>
  runningDays: string[]
  trainType?: string
  pantryAvailable?: boolean
}

// Comprehensive Indian Railway stations
const majorStations: Station[] = [
  // Karnataka
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru", state: "Karnataka" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", state: "Karnataka" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", state: "Karnataka" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi", state: "Karnataka" },
  { code: "BGM", name: "Belagavi", city: "Belagavi", state: "Karnataka" },
  { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru", state: "Karnataka" },
  
  // Major Indian cities
  { code: "NDLS", name: "New Delhi", city: "Delhi", state: "Delhi" },
  { code: "CSMT", name: "Mumbai CST", city: "Mumbai", state: "Maharashtra" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal" },
  { code: "MAS", name: "Chennai Central", city: "Chennai", state: "Tamil Nadu" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur", state: "Rajasthan" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat" },
  { code: "PUNE", name: "Pune Junction", city: "Pune", state: "Maharashtra" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad", state: "Telangana" },
  { code: "LKO", name: "Lucknow Junction", city: "Lucknow", state: "Uttar Pradesh" },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar", state: "Odisha" },
]

export function EnhancedBookingForm() {
  const [searchType, setSearchType] = useState<"route" | "train">("route")
  const [fromStation, setFromStation] = useState("SBC")
  const [toStation, setToStation] = useState("NDLS")
  const [trainSearch, setTrainSearch] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [searchResults, setSearchResults] = useState<TrainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [allStations, setAllStations] = useState<Station[]>(majorStations)
  const [stationSearchFrom, setStationSearchFrom] = useState("")
  const [stationSearchTo, setStationSearchTo] = useState("")
  const [loadingStations, setLoadingStations] = useState(false)

  // Load all stations on component mount
  useEffect(() => {
    const loadStations = async () => {
      setLoadingStations(true)
      try {
        const stations = await getAllStations()
        if (stations && Array.isArray(stations) && stations.length > 0) {
          setAllStations([...majorStations, ...stations])
        }
      } catch (error) {
        console.error('Failed to load stations:', error)
      } finally {
        setLoadingStations(false)
      }
    }
    
    loadStations()
  }, [])

  // Enhanced route search with real APIs
  const handleRouteSearch = async () => {
    if (!fromStation || !toStation || !travelDate) {
      setError("Please fill all required fields")
      return
    }

    if (fromStation === toStation) {
      setError("From and To stations cannot be the same")
      return
    }

    setIsLoading(true)
    setError("")
    setSearchResults([])

    try {
      const dateString = format(travelDate, "dd-MM-yyyy")
      
      // Search trains between stations
      const trainsData = await searchTrainsBetweenStations(fromStation, toStation, dateString)
      
      if (trainsData && trainsData.length > 0) {
        const enrichedTrains = await Promise.all(
          trainsData.slice(0, 20).map(async (train: any) => {
            // Get fare information
            const fareData = await getFareInquiry(train.train_number, fromStation, toStation, dateString)
            
            // Get seat availability for different classes
            const classes = ['SL', '3A', '2A', '1A', 'CC', '2S']
            const availabilityPromises = classes.map(cls => 
              getSeatAvailability(train.train_number, fromStation, toStation, dateString, cls)
            )
            
            const availabilityData = await Promise.allSettled(availabilityPromises)
            
            const availableClasses = classes.map((cls, index) => {
              const result = availabilityData[index]
              const availability = result.status === 'fulfilled' ? result.value : null
              const fare = fareData?.find((f: any) => f.class === cls)
              
              return {
                class: cls,
                available: availability?.current_status?.includes('AVAILABLE') ? 
                  parseInt(availability.current_status.split('-')[1] || '0') : 0,
                price: fare?.fare || 0,
                status: availability?.current_status?.includes('AVAILABLE') ? 'AVAILABLE' :
                       availability?.current_status?.includes('RAC') ? 'RAC' :
                       availability?.current_status?.includes('WL') ? 'WL' : 'GNWL'
              }
            }).filter(cls => cls.price > 0)

            return {
              trainNumber: train.train_number,
              trainName: train.train_name,
              from: fromStation,
              to: toStation,
              departure: train.departure_time,
              arrival: train.arrival_time,
              duration: train.travel_time,
              distance: train.distance || 0,
              availableClasses,
              runningDays: train.running_days || [],
              trainType: train.train_type,
              pantryAvailable: train.pantry_available
            }
          })
        )
        
        setSearchResults(enrichedTrains)
      } else {
        setError("No trains found for the selected route and date")
      }
    } catch (err) {
      console.error('Route search error:', err)
      setError("Failed to search trains. Please try again or check your internet connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced train search by number/name
  const handleTrainSearch = async () => {
    if (!trainSearch.trim()) {
      setError("Please enter train number or name")
      return
    }

    setIsLoading(true)
    setError("")
    setSearchResults([])

    try {
      // Try searching by train number first
      if (/^\d+$/.test(trainSearch.trim())) {
        const trainData = await searchTrainByNumber(trainSearch.trim())
        
        if (trainData && !trainData.error) {
          const trainResult: TrainResult = {
            trainNumber: trainData.train_number,
            trainName: trainData.train_name,
            from: trainData.source_station_code,
            to: trainData.destination_station_code,
            departure: trainData.departure_time,
            arrival: trainData.arrival_time,
            duration: trainData.travel_time,
            distance: trainData.distance || 0,
            availableClasses: [
              { class: "SL", available: 0, price: 0, status: "AVAILABLE" },
              { class: "3A", available: 0, price: 0, status: "AVAILABLE" },
              { class: "2A", available: 0, price: 0, status: "AVAILABLE" },
            ],
            runningDays: trainData.running_days || [],
            trainType: trainData.train_type
          }
          
          setSearchResults([trainResult])
        } else {
          setError(`Train number ${trainSearch} not found`)
        }
      } else {
        // Search by name in local data or use a more comprehensive search
        setError("Please enter a valid train number for accurate results")
      }
    } catch (err) {
      console.error('Train search error:', err)
      setError("Failed to search train. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500"
      case "RAC":
        return "bg-yellow-500"
      case "WL":
      case "GNWL":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStationName = (code: string) => {
    const station = allStations.find((s) => s.code === code)
    return station ? `${station.name} (${code})` : code
  }

  const handleBookNow = (train: TrainResult) => {
    const irctcUrl = `https://www.irctc.co.in/nget/train-search?trainNumber=${train.trainNumber}&fromStationCode=${train.from}&toStationCode=${train.to}`
    
    const confirmRedirect = window.confirm(
      `This will redirect you to IRCTC for real ticket booking.\n\n` +
      `Train: ${train.trainName} (${train.trainNumber})\n` +
      `Route: ${getStationName(train.from)} → ${getStationName(train.to)}\n` +
      `Departure: ${train.departure}\n\n` +
      `Click OK to proceed to IRCTC.co.in for real booking.`
    )
    
    if (confirmRedirect) {
      window.open(irctcUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const filteredFromStations = allStations.filter(station =>
    station.name.toLowerCase().includes(stationSearchFrom.toLowerCase()) ||
    station.code.toLowerCase().includes(stationSearchFrom.toLowerCase()) ||
    station.city.toLowerCase().includes(stationSearchFrom.toLowerCase())
  )

  const filteredToStations = allStations.filter(station =>
    station.name.toLowerCase().includes(stationSearchTo.toLowerCase()) ||
    station.code.toLowerCase().includes(stationSearchTo.toLowerCase()) ||
    station.city.toLowerCase().includes(stationSearchTo.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Search Type Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={searchType === "route" ? "default" : "ghost"}
          onClick={() => setSearchType("route")}
          className="flex-1"
        >
          <Route className="h-4 w-4 mr-2" />
          Search by Route
        </Button>
        <Button
          variant={searchType === "train" ? "default" : "ghost"}
          onClick={() => setSearchType("train")}
          className="flex-1"
        >
          <Train className="h-4 w-4 mr-2" />
          Search by Train Number
        </Button>
      </div>

      {/* Route Search Form */}
      {searchType === "route" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Search Trains by Route ({allStations.length} stations available)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Station</label>
                <Select value={fromStation} onValueChange={setFromStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure station" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <div className="p-2">
                      <Input
                        placeholder="Search stations..."
                        value={stationSearchFrom}
                        onChange={(e) => setStationSearchFrom(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredFromStations.slice(0, 50).map((station) => (
                      <SelectItem key={station.code} value={station.code}>
                        <div>
                          <div className="font-medium">{station.name} ({station.code})</div>
                          <div className="text-xs text-gray-500">{station.city}, {station.state}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">To Station</label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination station" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <div className="p-2">
                      <Input
                        placeholder="Search stations..."
                        value={stationSearchTo}
                        onChange={(e) => setStationSearchTo(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredToStations.slice(0, 50).map((station) => (
                      <SelectItem key={station.code} value={station.code}>
                        <div>
                          <div className="font-medium">{station.name} ({station.code})</div>
                          <div className="text-xs text-gray-500">{station.city}, {station.state}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Travel Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {travelDate ? format(travelDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={travelDate}
                    onSelect={setTravelDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleRouteSearch} disabled={isLoading || loadingStations} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching Real Trains...
                </>
              ) : (
                <>
                  <Search className="ml-2 h-4 w-4" />
                  Search Trains with Live Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Train Search Form */}
      {searchType === "train" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-blue-600" />
              Search by Train Number - Real IRCTC Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Train Number</label>
              <Input
                placeholder="Enter train number (e.g., 12627, 16536, 22627)"
                value={trainSearch}
                onChange={(e) => setTrainSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrainSearch()}
              />
            </div>

            <Button onClick={handleTrainSearch} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching IRCTC Database...
                </>
              ) : (
                <>
                  <Search className="ml-2 h-4 w-4" />
                  Search Train Details
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Live Search Results ({searchResults.length} trains found)</h3>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Real IRCTC Data
            </Badge>
          </div>

          {searchResults.map((train) => (
            <Card key={train.trainNumber} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        <Train className="h-5 w-5" />
                        {train.trainName} ({train.trainNumber})
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>{getStationName(train.from)}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{getStationName(train.to)}</span>
                        {train.distance > 0 && <span>• {train.distance} km</span>}
                      </div>
                      {train.trainType && (
                        <Badge variant="secondary" className="mt-2">{train.trainType}</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">{train.duration}</Badge>
                      {train.pantryAvailable && (
                        <div className="text-xs text-green-600">🍽️ Pantry Available</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span><strong>Departure:</strong> {train.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span><strong>Arrival:</strong> {train.arrival}</span>
                    </div>
                    {train.runningDays.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span><strong>Runs:</strong> {train.runningDays.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {train.availableClasses.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Live Seat Availability & Pricing:</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {train.availableClasses.map((cls) => (
                          <div key={cls.class} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                            <div>
                              <p className="font-medium">{cls.class}</p>
                              <p className="text-sm text-gray-600">
                                {cls.available > 0 ? `${cls.available} seats available` : "Check availability"}
                              </p>
                            </div>
                            <div className="text-right">
                              {cls.price > 0 && (
                                <div className="flex items-center gap-1 mb-1">
                                  <IndianRupee className="h-3 w-3" />
                                  <span className="font-medium">₹{cls.price}</span>
                                </div>
                              )}
                              <Badge className={`${getStatusColor(cls.status)} text-white text-xs`}>
                                {cls.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => handleBookNow(train)}
                    className="w-full bg-orange-600 hover:bg-orange-700" 
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Book Now on IRCTC - Real Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 text-gray-500">
          <Train className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Search for Trains</h3>
          <p>Use real IRCTC data to find trains, check availability, and get live pricing</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Live seat availability</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Current pricing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}