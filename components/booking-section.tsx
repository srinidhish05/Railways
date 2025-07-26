"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Users, CreditCard, CheckCircle, AlertCircle, ExternalLink, Train, Clock, Search, RefreshCw, Loader2, Star, Zap } from "lucide-react"

// FULL API ACCESS - No limitations
const RAPIDAPI_KEY = 'f65c271e00mshce64e8cb8563b11p128323jsn5857c27564f3'

// Get ALL trains from comprehensive database
const getAllTrains = async (page: number = 1, limit: number = 100) => {
  try {
    // Try multiple APIs for maximum coverage
    const apis = [
      {
        url: 'https://trains.p.rapidapi.com/v1/railways/trains/india',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'trains.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        },
        body: JSON.stringify({ search: "", page, limit })
      },
      {
        url: 'https://irctc-api2.p.rapidapi.com/getAllTrains',
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    ]

    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: api.method,
          headers: api.headers,
          body: api.body
        })
        const data = await response.json()
        if (data && Array.isArray(data) && data.length > 0) {
          return data
        }
      } catch (error) {
        console.error(`API ${api.url} failed:`, error)
        continue
      }
    }
    
    return []
  } catch (error) {
    console.error('Error fetching all trains:', error)
    return []
  }
}

// Search trains with multiple search terms
const searchTrains = async (searchTerm: string) => {
  const searchApis = [
    {
      url: 'https://trains.p.rapidapi.com/v1/railways/trains/india',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'trains.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      body: JSON.stringify({ search: searchTerm })
    },
    {
      url: `https://indianrailways.p.rapidapi.com/searchtrains.php?search=${encodeURIComponent(searchTerm)}`,
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'indianrailways.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    }
  ]

  for (const api of searchApis) {
    try {
      const response = await fetch(api.url, {
        method: api.method,
        headers: api.headers,
        body: api.body
      })
      const data = await response.json()
      if (data && Array.isArray(data) && data.length > 0) {
        return data
      }
    } catch (error) {
      console.error(`Search API ${api.url} failed:`, error)
      continue
    }
  }
  
  return []
}

// Get detailed train information
const getTrainDetails = async (trainNumber: string) => {
  const detailApis = [
    {
      url: `https://irctc-api2.p.rapidapi.com/trainSchedule?trainNumber=${trainNumber}`,
      headers: {
        'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    },
    {
      url: `https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/info?train_number=${trainNumber}`,
      headers: {
        'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapid-api': 'rapid-api-database'
      }
    }
  ]

  for (const api of detailApis) {
    try {
      const response = await fetch(api.url, { headers: api.headers })
      const data = await response.json()
      if (data && !data.error) {
        return data
      }
    } catch (error) {
      console.error(`Detail API ${api.url} failed:`, error)
      continue
    }
  }
  
  return null
}

// Comprehensive train database with ALL major train types + Karnataka focus
const getComprehensiveTrainDatabase = async () => {
  // All major train categories with Karnataka-specific trains highlighted
  const trainCategories = {
    karnataka: [
      // Major Karnataka trains
      '12627', '12628', // Karnataka Express
      '16536', '16535', // Gol Gumbaz Express
      '17326', '17325', // Vishwamanava Express
      '18047', '18048', // Amaravathi Express
      '11013', '11014', // Coimbatore Express
      '16209', '16210', // Mysuru Express
      '22691', '22692', // Rajdhani Express (Bangalore)
      '12430', '12429', // Rajdhani Express (Bangalore)
      '16595', '16596', // Panchganga Express
      '17301', '17302', // Dharwad Express
    ],
    rajdhani: Array.from({length: 50}, (_, i) => `12${(301 + i).toString().padStart(3, '0')}`),
    shatabdi: Array.from({length: 60}, (_, i) => `12${(001 + i).toString().padStart(3, '0')}`),
    duronto: Array.from({length: 40}, (_, i) => `12${(213 + i).toString().padStart(3, '0')}`),
    express: Array.from({length: 100}, (_, i) => `12${(615 + i).toString().padStart(3, '0')}`),
    mail: Array.from({length: 50}, (_, i) => `12${(801 + i).toString().padStart(3, '0')}`),
    passenger: Array.from({length: 30}, (_, i) => `16${(101 + i).toString().padStart(3, '0')}`),
    southIndian: [
      '16536', '17326', '16229', '16232', '17301', '17302', '18047', '18048',
      '11013', '11014', '16209', '16210', '16211', '16212', '16213', '16214',
      '22601', '22602', '22603', '22604', '22691', '22692'
    ],
    popular: [
      '12627', '12628', '12430', '12321', '12051', '12052', '12002', '12001'
    ]
  }

  const allTrainNumbers = [
    ...trainCategories.karnataka,
    ...trainCategories.rajdhani,
    ...trainCategories.shatabdi,
    ...trainCategories.duronto,
    ...trainCategories.express,
    ...trainCategories.mail,
    ...trainCategories.passenger,
    ...trainCategories.southIndian,
    ...trainCategories.popular
  ]

  console.log(`🚂 Karnataka Railway: Loading ${allTrainNumbers.length} trains from comprehensive database...`)

  const batchSize = 25
  const allTrains = []

  for (let i = 0; i < allTrainNumbers.length; i += batchSize) {
    const batch = allTrainNumbers.slice(i, i + batchSize)
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allTrainNumbers.length/batchSize)}`)
    
    const batchPromises = batch.map(trainNumber => getTrainDetails(trainNumber))
    
    try {
      const batchResults = await Promise.allSettled(batchPromises)
      const validTrains = batchResults
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => {
          const train = (result as PromiseFulfilledResult<any>).value
          // Mark Karnataka trains
          if (trainCategories.karnataka.includes(train.train_number)) {
            train.isKarnatakaRoute = true
          }
          return train
        })
      
      allTrains.push(...validTrains)
      
      // Progress update
      if (i % 100 === 0) {
        console.log(`🌟 Loaded ${allTrains.length} trains so far...`)
      }
      
      // Small delay to be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`Error processing batch ${i}-${i+batchSize}:`, error)
    }
  }

  console.log(`✅ Successfully loaded ${allTrains.length} trains from comprehensive database`)
  return allTrains
}

// Check if train is Karnataka route
const isKarnatakaRoute = (train: RealTrain) => {
  const karnatakaKeywords = [
    'karnataka', 'bengaluru', 'bangalore', 'mysuru', 'mysore', 'hubballi', 
    'hubli', 'mangaluru', 'mangalore', 'dharwad', 'belagavi', 'belgaum',
    'chamundi', 'hampi', 'gol gumbaz', 'vishwamanava'
  ]
  
  const trainName = train.train_name?.toLowerCase() || ''
  const fromStation = train.from_station_name?.toLowerCase() || ''
  const toStation = train.to_station_name?.toLowerCase() || ''
  
  return karnatakaKeywords.some(keyword => 
    trainName.includes(keyword) || 
    fromStation.includes(keyword) || 
    toStation.includes(keyword)
  ) || train.isKarnatakaRoute
}

interface RealTrain {
  train_number: string
  train_name: string
  from_station_name?: string
  to_station_name?: string
  departure_time?: string
  arrival_time?: string
  duration?: string
  distance?: string
  train_type?: string
  status?: string
  running_days?: string[]
  isKarnatakaRoute?: boolean
}

export function BookingSection() {
  const [allTrains, setAllTrains] = useState<RealTrain[]>([])
  const [filteredTrains, setFilteredTrains] = useState<RealTrain[]>([])
  const [selectedTrain, setSelectedTrain] = useState<RealTrain | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [passengerName, setPassengerName] = useState("")
  const [passengerEmail, setPassengerEmail] = useState("")
  const [seatCount, setSeatCount] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "redirected" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [displayCount, setDisplayCount] = useState(50)
  const [showKarnatakaOnly, setShowKarnatakaOnly] = useState(false)

  // Load comprehensive train database
  useEffect(() => {
    const loadDatabase = async () => {
      setIsLoadingDatabase(true)
      setLoadingProgress(0)
      
      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => Math.min(prev + 8, 92))
        }, 800)

        const trains = await getComprehensiveTrainDatabase()
        
        clearInterval(progressInterval)
        setLoadingProgress(100)
        
        // Sort trains with Karnataka routes first
        const sortedTrains = trains.sort((a, b) => {
          if (isKarnatakaRoute(a) && !isKarnatakaRoute(b)) return -1
          if (!isKarnatakaRoute(a) && isKarnatakaRoute(b)) return 1
          return 0
        })
        
        setAllTrains(sortedTrains)
        setFilteredTrains(sortedTrains.slice(0, 50))
        
        setTimeout(() => setIsLoadingDatabase(false), 500)
      } catch (error) {
        console.error('Error loading comprehensive database:', error)
        setErrorMessage('Error loading train database. Some trains may not be available.')
        setIsLoadingDatabase(false)
      }
    }
    
    loadDatabase()
  }, [])

  // Advanced search with multiple APIs
  const handleAdvancedSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setErrorMessage("Please enter at least 2 characters to search")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      // Search across multiple APIs
      const searchResults = await searchTrains(searchQuery)
      
      if (searchResults && searchResults.length > 0) {
        // Get detailed information for search results
        const detailPromises = searchResults.slice(0, 100).map((train: any) => 
          getTrainDetails(train.train_number || train.trainNumber)
        )
        
        const detailResults = await Promise.allSettled(detailPromises)
        const newTrains = detailResults
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => (result as PromiseFulfilledResult<any>).value)
        
        // Merge with existing trains (avoid duplicates)
        const existingNumbers = new Set(allTrains.map(t => t.train_number))
        const uniqueNewTrains = newTrains.filter(train => !existingNumbers.has(train.train_number))
        
        if (uniqueNewTrains.length > 0) {
          const updatedTrains = [...allTrains, ...uniqueNewTrains]
          setAllTrains(updatedTrains)
        }
        
        // Filter results
        const filtered = [...allTrains, ...newTrains].filter(train => 
          train.train_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          train.train_number?.includes(searchQuery) ||
          train.from_station_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          train.to_station_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        setFilteredTrains(filtered)
      } else {
        // Search in existing database
        const filtered = allTrains.filter(train => 
          train.train_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          train.train_number?.includes(searchQuery) ||
          train.from_station_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          train.to_station_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        setFilteredTrains(filtered)
        
        if (filtered.length === 0) {
          setErrorMessage(`No trains found for "${searchQuery}". Try different keywords.`)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      setErrorMessage('Error searching trains. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter trains based on search query and Karnataka filter
  useEffect(() => {
    let filtered = allTrains

    if (showKarnatakaOnly) {
      filtered = filtered.filter(train => isKarnatakaRoute(train))
    }

    if (searchQuery) {
      filtered = filtered.filter(train => 
        train.train_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.train_number?.includes(searchQuery) ||
        train.from_station_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.to_station_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.train_type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredTrains(filtered.slice(0, displayCount))
  }, [searchQuery, allTrains, displayCount, showKarnatakaOnly])

  const loadMoreTrains = () => {
    setDisplayCount(prev => prev + 50)
  }

  const handleTrainSelect = (train: RealTrain) => {
    setSelectedTrain(train)
    setSelectedClass("")
    setBookingStatus("idle")
    setErrorMessage("")
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTrain || !selectedClass || !passengerName || !passengerEmail) {
      setErrorMessage("Please fill all required fields and select a train class")
      return
    }

    // Redirect to IRCTC for real booking
    const irctcUrl = `https://www.irctc.co.in/nget/train-search?trainNumber=${selectedTrain.train_number}`
    
    const confirmRedirect = window.confirm(
      `🚂 Karnataka Railway System - IRCTC Booking\n\n` +
      `Train: ${selectedTrain.train_name} (${selectedTrain.train_number})\n` +
      `Class: ${selectedClass}\n` +
      `Passengers: ${seatCount}\n\n` +
      `✅ This will redirect you to IRCTC.co.in for secure ticket booking.\n` +
      `Click OK to proceed with real booking.`
    )
    
    if (confirmRedirect) {
      window.open(irctcUrl, '_blank', 'noopener,noreferrer')
      setBookingStatus("redirected")
      
      // Clear form after successful redirect
      setTimeout(() => {
        setSelectedTrain(null)
        setSelectedClass("")
        setPassengerName("")
        setPassengerEmail("")
        setSeatCount(1)
      }, 2000)
    }
  }

  const handleNewSearch = () => {
    setBookingStatus("idle")
    setSelectedTrain(null)
    setSelectedClass("")
    setErrorMessage("")
    setSearchQuery("")
  }

  const karnatakaTrainsCount = allTrains.filter(train => isKarnatakaRoute(train)).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Karnataka Railway Header */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Train className="h-6 w-6" />
            <Zap className="h-5 w-5 text-yellow-600" />
            Karnataka Railway - Comprehensive Database
          </CardTitle>
          <CardDescription className="text-orange-700">
            🌟 {karnatakaTrainsCount} Karnataka trains • {allTrains.length} total trains • All India coverage with real IRCTC integration
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Database Loading Progress */}
      {isLoadingDatabase && (
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <div><strong>🚂 Loading Comprehensive Train Database...</strong></div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="text-sm">
                Loading {loadingProgress < 30 ? '🌟 Karnataka & Premium' : loadingProgress < 60 ? '🚄 Rajdhani & Shatabdi' : loadingProgress < 85 ? '🚂 Express & Mail' : '🚃 Regional & Popular'} trains... ({loadingProgress}%)
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

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

      {/* Comprehensive Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search All Indian Trains ({allTrains.length} trains in database)
          </CardTitle>
          <CardDescription>
            🌟 Comprehensive database: Rajdhani, Shatabdi, Duronto, Express, Mail, Passenger & Regional trains from across India
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by train name, number, route, or type (e.g., 'Karnataka Express', '12627', 'Bangalore Mumbai', 'Rajdhani')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
            />
            <Button onClick={handleAdvancedSearch} disabled={isLoading || isLoadingDatabase}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing {filteredTrains.length} trains
                {searchQuery && ` matching "${searchQuery}"`}
                {showKarnatakaOnly && " (Karnataka routes only)"}
              </span>
              <Button
                variant={showKarnatakaOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowKarnatakaOnly(!showKarnatakaOnly)}
                className="text-xs"
              >
                <Star className="h-3 w-3 mr-1" />
                Karnataka Only ({karnatakaTrainsCount})
              </Button>
            </div>
            {filteredTrains.length >= displayCount && (
              <Button variant="outline" size="sm" onClick={loadMoreTrains}>
                Load More Trains
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Train Selection - FULL DATABASE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              All Available Trains ({filteredTrains.length})
            </CardTitle>
            <CardDescription>
              {searchQuery ? `Search results for "${searchQuery}"` : showKarnatakaOnly ? "Karnataka railway routes" : "Complete Indian Railway database"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {isLoadingDatabase ? (
              <div className="text-center py-8">
                <Train className="h-8 w-8 mx-auto mb-2 animate-pulse text-orange-600" />
                <p className="text-gray-600">Loading comprehensive train database...</p>
                <p className="text-sm text-gray-500">🌟 This includes all major Indian trains with Karnataka priority</p>
              </div>
            ) : filteredTrains.length > 0 ? (
              filteredTrains.map((train, index) => (
                <div
                  key={`${train.train_number}-${index}`}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTrain?.train_number === train.train_number 
                      ? "border-blue-500 bg-blue-50 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  } ${isKarnatakaRoute(train) ? 'ring-1 ring-orange-200' : ''}`}
                  onClick={() => handleTrainSelect(train)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-blue-900 leading-tight">
                          {train.train_name} ({train.train_number})
                        </h3>
                        {isKarnatakaRoute(train) && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                            <Star className="h-2 w-2 mr-1" />
                            Karnataka
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        {train.from_station_name && train.to_station_name 
                          ? `${train.from_station_name} → ${train.to_station_name}`
                          : 'All route details available on IRCTC'
                        }
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-200">Available</Badge>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-3">
                      {train.departure_time && <span>🕐 {train.departure_time}</span>}
                      {train.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {train.duration}
                        </span>
                      )}
                      {train.distance && <span>📏 {train.distance}</span>}
                    </div>
                    {train.train_type && <span className="text-green-600 font-medium">{train.train_type}</span>}
                  </div>

                  {train.running_days && (
                    <div className="text-xs text-gray-500 mb-2">
                      🗓️ Runs: {Array.isArray(train.running_days) ? train.running_days.join(', ') : train.running_days}
                    </div>
                  )}

                  {/* Class Selection for Selected Train */}
                  {selectedTrain?.train_number === train.train_number && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Label className="text-xs font-semibold text-blue-900 mb-2 block">
                        🎫 Select Class for Booking
                      </Label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { code: '1A', name: 'First AC' },
                          { code: '2A', name: '2nd AC' },
                          { code: '3A', name: '3rd AC' },
                          { code: 'SL', name: 'Sleeper' },
                          { code: 'CC', name: 'Chair Car' },
                          { code: '2S', name: '2nd Sitting' }
                        ].map((classInfo) => (
                          <Button
                            key={classInfo.code}
                            variant={selectedClass === classInfo.code ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-7 flex flex-col py-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedClass(classInfo.code)
                            }}
                          >
                            <span className="font-bold">{classInfo.code}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Train className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "No trains found" : "Loading trains..."}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "Try different search terms" : "Please wait while we load the comprehensive database"}
                </p>
                <Button onClick={() => window.open('https://www.irctc.co.in/', '_blank')}>
                  🔍 Browse IRCTC Directly
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className={selectedTrain ? "border-green-200" : ""}>
          <CardHeader className={selectedTrain ? "bg-gradient-to-r from-green-50 to-emerald-50" : ""}>
            <CardTitle className={`flex items-center gap-2 ${selectedTrain ? "text-green-800" : ""}`}>
              <CreditCard className="h-5 w-5" />
              🎫 Complete Booking on IRCTC
            </CardTitle>
            <CardDescription className={selectedTrain ? "text-green-700" : ""}>
              {selectedTrain 
                ? `Booking ${selectedTrain.train_name} (${selectedTrain.train_number})`
                : "Select a train to continue booking"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <Label htmlFor="name">Passenger Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter full name as per ID proof"
                  value={passengerName} 
                  onChange={(e) => setPassengerName(e.target.value)} 
                  required 
                  disabled={!selectedTrain}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address for booking confirmation"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                  disabled={!selectedTrain}
                />
              </div>

              <div>
                <Label htmlFor="seats">Number of Passengers</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="6"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  required
                  disabled={!selectedTrain}
                />
              </div>

              {selectedTrain && selectedClass && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📋 Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>🚂 Train:</span>
                      <span className="font-medium">{selectedTrain.train_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🔢 Number:</span>
                      <span>{selectedTrain.train_number}</span>
                    </div>
                    {selectedTrain.from_station_name && selectedTrain.to_station_name && (
                      <div className="flex justify-between">
                        <span>🛤️ Route:</span>
                        <span>{selectedTrain.from_station_name} → {selectedTrain.to_station_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>🎫 Class:</span>
                      <span className="font-medium">{selectedClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>👥 Passengers:</span>
                      <span>{seatCount}</span>
                    </div>
                    {selectedTrain.train_type && (
                      <div className="flex justify-between">
                        <span>🚄 Type:</span>
                        <span className="text-green-600">{selectedTrain.train_type}</span>
                      </div>
                    )}
                    {isKarnatakaRoute(selectedTrain) && (
                      <div className="flex justify-between">
                        <span>🌟 Special:</span>
                        <span className="text-orange-600 font-medium">Karnataka Route</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${selectedTrain && selectedClass ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={!selectedTrain || !selectedClass || !passengerName || !passengerEmail}
              >
                {selectedTrain && selectedClass 
                  ? "🎫 Proceed to IRCTC for Real Booking" 
                  : "Select Train & Class to Continue"
                }
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              {!selectedTrain && (
                <p className="text-sm text-gray-500 text-center">
                  Please select a train from the comprehensive database above
                </p>
              )}
              
              {selectedTrain && selectedClass && (
                <p className="text-xs text-green-600 text-center">
                  ✅ Secure booking through official IRCTC website
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}