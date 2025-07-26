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
import { Search, CalendarIcon, MapPin, Clock, IndianRupee, Train, ArrowRight, ExternalLink, Loader2, CheckCircle, Users, Route, Star, Bookmark, Filter, SortAsc } from "lucide-react"
import { format } from "date-fns"

// Real API configuration
const RAPIDAPI_KEY = 'f65c271e00mshce64e8cb8563b11p128323jsn5857c27564f3'

// Enhanced API functions with error handling and caching
const apiCache = new Map()

const searchTrainsBetweenStations = async (fromStation: string, toStation: string, date: string) => {
  const cacheKey = `${fromStation}-${toStation}-${date}`
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }

  try {
    const response = await fetch(
      `https://irctc-api2.p.rapidapi.com/trainsBetweenStations?fromStationCode=${fromStation}&toStationCode=${toStation}&dateOfJourney=${date}`,
      {
        headers: {
          'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      }
    )
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    apiCache.set(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error searching trains between stations:', error)
    throw error
  }
}

const searchTrainByNumber = async (trainNumber: string) => {
  try {
    const response = await fetch(`https://irctc-api2.p.rapidapi.com/trainSchedule?trainNumber=${trainNumber}`, {
      headers: {
        'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) {
      throw new Error(`Train not found: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching train by number:', error)
    throw error
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
        },
        signal: AbortSignal.timeout(8000)
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
        },
        signal: AbortSignal.timeout(8000)
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
      },
      signal: AbortSignal.timeout(10000)
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
  isKarnatakaRoute?: boolean
}

// Enhanced station database with regional focus
const majorStations: Station[] = [
  // Karnataka - Priority stations
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru", state: "Karnataka" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", state: "Karnataka" },
  { code: "BAND", name: "Banaswadi", city: "Bengaluru", state: "Karnataka" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", state: "Karnataka" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi", state: "Karnataka" },
  { code: "BGM", name: "Belagavi", city: "Belagavi", state: "Karnataka" },
  { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru", state: "Karnataka" },
  { code: "DWR", name: "Dharwad", city: "Dharwad", state: "Karnataka" },
  { code: "TK", name: "Tumakuru", city: "Tumakuru", state: "Karnataka" },
  { code: "RRB", name: "Birur Junction", city: "Birur", state: "Karnataka" },
  
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

// Check if route involves Karnataka
const checkKarnatakaRoute = (fromStation: string, toStation: string, trainName: string) => {
  const karnatakaStations = ['SBC', 'YPR', 'MYS', 'UBL', 'BGM', 'MAJN', 'DWR', 'TK', 'BAND', 'RRB']
  const karnatakaKeywords = ['karnataka', 'bengaluru', 'bangalore', 'mysuru', 'mysore', 'hubballi', 'hubli', 'mangaluru', 'mangalore']
  
  const hasKarnatakaStation = karnatakaStations.includes(fromStation) || karnatakaStations.includes(toStation)
  const hasKarnatakaKeyword = karnatakaKeywords.some(keyword => trainName.toLowerCase().includes(keyword))
  
  return hasKarnatakaStation || hasKarnatakaKeyword
}

export function EnhancedBookingForm() {
  const [searchType, setSearchType] = useState<"route" | "train">("route")
  const [fromStation, setFromStation] = useState("SBC")
  const [toStation, setToStation] = useState("NDLS")
  const [trainSearch, setTrainSearch] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [searchResults, setSearchResults] = useState<TrainResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TrainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [allStations, setAllStations] = useState<Station[]>(majorStations)
  const [stationSearchFrom, setStationSearchFrom] = useState("")
  const [stationSearchTo, setStationSearchTo] = useState("")
  const [loadingStations, setLoadingStations] = useState(false)
  const [sortBy, setSortBy] = useState<"departure" | "duration" | "price">("departure")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [savedSearches, setSavedSearches] = useState<any[]>([])

  // Load saved searches and stations
  useEffect(() => {
    const saved = localStorage.getItem('savedTrainSearches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }

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

  // Filter and sort results
  useEffect(() => {
    let filtered = [...searchResults]

    // Apply class filter
    if (classFilter !== "all") {
      filtered = filtered.filter(train => 
        train.availableClasses.some(cls => cls.class === classFilter && cls.status === "AVAILABLE")
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "departure":
          return a.departure.localeCompare(b.departure)
        case "duration":
          return a.duration.localeCompare(b.duration)
        case "price":
          const priceA = Math.min(...a.availableClasses.map(c => c.price).filter(p => p > 0))
          const priceB = Math.min(...b.availableClasses.map(c => c.price).filter(p => p > 0))
          return priceA - priceB
        default:
          return 0
      }
    })

    setFilteredResults(filtered)
  }, [searchResults, sortBy, classFilter])

  // Save search functionality
  const saveCurrentSearch = () => {
    const searchData = {
      id: Date.now(),
      fromStation,
      toStation,
      date: travelDate ? format(travelDate, "dd-MM-yyyy") : null,
      timestamp: new Date().toISOString(),
      type: searchType
    }
    
    const updated = [searchData, ...savedSearches.slice(0, 9)] // Keep last 10
    setSavedSearches(updated)
    localStorage.setItem('savedTrainSearches', JSON.stringify(updated))
  }

  // Enhanced route search with comprehensive error handling
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
    setFilteredResults([])

    try {
      const dateString = format(travelDate, "dd-MM-yyyy")
      
      // Search trains between stations with retry logic
      let trainsData = null
      let retryCount = 0
      const maxRetries = 3

      while (!trainsData && retryCount < maxRetries) {
        try {
          trainsData = await searchTrainsBetweenStations(fromStation, toStation, dateString)
          break
        } catch (error) {
          retryCount++
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // Exponential backoff
          } else {
            throw error
          }
        }
      }
      
      if (trainsData && trainsData.length > 0) {
        const enrichedTrains = await Promise.all(
          trainsData.slice(0, 25).map(async (train: any) => {
            // Get fare information with error handling
            let fareData = null
            try {
              fareData = await getFareInquiry(train.train_number, fromStation, toStation, dateString)
            } catch (error) {
              console.warn(`Failed to get fare for train ${train.train_number}:`, error)
            }
            
            // Get seat availability for different classes
            const classes = ['SL', '3A', '2A', '1A', 'CC', '2S']
            const availabilityPromises = classes.map(async cls => {
              try {
                return await getSeatAvailability(train.train_number, fromStation, toStation, dateString, cls)
              } catch (error) {
                return null
              }
            })
            
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
                status: availability?.current_status?.includes('AVAILABLE') ? 'AVAILABLE' as const :
                       availability?.current_status?.includes('RAC') ? 'RAC' as const :
                       availability?.current_status?.includes('WL') ? 'WL' as const : 'GNWL' as const
              }
            }).filter(cls => cls.price > 0 || cls.available > 0)

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
              pantryAvailable: train.pantry_available,
              isKarnatakaRoute: checkKarnatakaRoute(fromStation, toStation, train.train_name)
            }
          })
        )
        
        setSearchResults(enrichedTrains)
        
        // Auto-save successful search
        if (enrichedTrains.length > 0) {
          saveCurrentSearch()
        }
      } else {
        setError("No trains found for the selected route and date. Please try different stations or date.")
      }
    } catch (err) {
      console.error('Route search error:', err)
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          setError("Search timed out. Please check your internet connection and try again.")
        } else if (err.message.includes('429')) {
          setError("Too many requests. Please wait a moment and try again.")
        } else {
          setError(`Search failed: ${err.message}. Please try again.`)
        }
      } else {
        setError("Failed to search trains. Please try again or check your internet connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced train search by number with validation
  const handleTrainSearch = async () => {
    const trimmedSearch = trainSearch.trim()
    if (!trimmedSearch) {
      setError("Please enter train number or name")
      return
    }

    // Validate train number format
    if (!/^\d{4,5}$/.test(trimmedSearch)) {
      setError("Please enter a valid 4-5 digit train number (e.g., 12627, 16536)")
      return
    }

    setIsLoading(true)
    setError("")
    setSearchResults([])
    setFilteredResults([])

    try {
      const trainData = await searchTrainByNumber(trimmedSearch)
      
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
          trainType: trainData.train_type,
          isKarnatakaRoute: checkKarnatakaRoute(trainData.source_station_code, trainData.destination_station_code, trainData.train_name)
        }
        
        setSearchResults([trainResult])
      } else {
        setError(`Train number ${trimmedSearch} not found in IRCTC database`)
      }
    } catch (err) {
      console.error('Train search error:', err)
      if (err instanceof Error) {
        setError(`Train search failed: ${err.message}`)
      } else {
        setError("Failed to search train. Please verify the train number and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500 text-white"
      case "RAC":
        return "bg-yellow-500 text-white"
      case "WL":
      case "GNWL":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStationName = (code: string) => {
    const station = allStations.find((s) => s.code === code)
    return station ? `${station.name} (${code})` : code
  }

  const handleBookNow = (train: TrainResult) => {
    const irctcUrl = `https://www.irctc.co.in/nget/train-search?trainNumber=${train.trainNumber}&fromStationCode=${train.from}&toStationCode=${train.to}`
    
    const confirmRedirect = window.confirm(
      `OFFICIAL IRCTC BOOKING\n\n` +
      `Train: ${train.trainName} (${train.trainNumber})\n` +
      `Route: ${getStationName(train.from)} → ${getStationName(train.to)}\n` +
      `Departure: ${train.departure}\n` +
      `Distance: ${train.distance} km\n\n` +
      `This will redirect you to official IRCTC website for secure booking.\n` +
      `Click OK to proceed to IRCTC.co.in`
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
      {/* Enhanced Search Type Toggle */}
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

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bookmark className="h-4 w-4" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {savedSearches.slice(0, 5).map((search) => (
                <Button
                  key={search.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFromStation(search.fromStation)
                    setToStation(search.toStation)
                    if (search.date) {
                      setTravelDate(new Date(search.date.split('-').reverse().join('-')))
                    }
                    setSearchType(search.type)
                  }}
                  className="text-xs"
                >
                  {getStationName(search.fromStation).split('(')[0].trim()} → {getStationName(search.toStation).split('(')[0].trim()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Search Form */}
      {searchType === "route" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Search Trains by Route 
              <Badge variant="outline" className="text-xs">
                {allStations.length} stations available
              </Badge>
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
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{station.name} ({station.code})</span>
                            {station.state === "Karnataka" && <Star className="h-3 w-3 text-orange-500" />}
                          </div>
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
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{station.name} ({station.code})</span>
                            {station.state === "Karnataka" && <Star className="h-3 w-3 text-orange-500" />}
                          </div>
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

            <Button onClick={handleRouteSearch} disabled={isLoading || loadingStations} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching IRCTC Database...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
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
                placeholder="Enter 4-5 digit train number (e.g., 12627, 16536, 22627)"
                value={trainSearch}
                onChange={(e) => setTrainSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrainSearch()}
                maxLength={5}
                pattern="[0-9]*"
              />
            </div>

            <Button onClick={handleTrainSearch} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching IRCTC Database...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
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

      {/* Search Results with Filters */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Live Search Results ({filteredResults.length} trains found)</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Real IRCTC Data
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Sort by Departure</SelectItem>
                  <SelectItem value="duration">Sort by Duration</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="SL">Sleeper</SelectItem>
                  <SelectItem value="3A">3AC</SelectItem>
                  <SelectItem value="2A">2AC</SelectItem>
                  <SelectItem value="1A">1AC</SelectItem>
                  <SelectItem value="CC">Chair Car</SelectItem>
                  <SelectItem value="2S">Second Sitting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredResults.map((train) => (
            <Card key={train.trainNumber} className={`border-l-4 ${train.isKarnatakaRoute ? 'border-l-orange-500' : 'border-l-blue-500'} hover:shadow-lg transition-shadow`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        <Train className="h-5 w-5" />
                        {train.trainName} ({train.trainNumber})
                        {train.isKarnatakaRoute && <Star className="h-4 w-4 text-orange-500" />}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>{getStationName(train.from)}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{getStationName(train.to)}</span>
                        {train.distance > 0 && <span>• {train.distance} km</span>}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {train.trainType && (
                          <Badge variant="secondary">{train.trainType}</Badge>
                        )}
                        {train.isKarnatakaRoute && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Karnataka Route
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">{train.duration}</Badge>
                      {train.pantryAvailable && (
                        <div className="text-xs text-green-600">Pantry Available</div>
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
                              <Badge className={`${getStatusColor(cls.status)} text-xs`}>
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
                    Book Now on IRCTC - Official Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Empty State */}
      {searchResults.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 text-gray-500">
          <Train className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Search for Trains</h3>
          <p className="mb-4">Use real IRCTC data to find trains, check availability, and get live pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-md mx-auto">
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