"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, CalendarIcon, MapPin, Clock, IndianRupee, Train, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface Station {
  code: string
  name: string
  city: string
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
    status: "AVAILABLE" | "RAC" | "WL"
  }>
  runningDays: string[]
}

const karnatakaStations: Station[] = [
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi" },
  { code: "BGM", name: "Belagavi", city: "Belagavi" },
  { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru" },
  { code: "ASK", name: "Arsikere Junction", city: "Arsikere" },
  { code: "DVG", name: "Davangere", city: "Davangere" },
  { code: "TK", name: "Tumakuru", city: "Tumakuru" },
  { code: "KLBG", name: "Kalaburagi", city: "Kalaburagi" },
]

const mockTrains: TrainResult[] = [
  {
    trainNumber: "12628",
    trainName: "Karnataka Express",
    from: "SBC",
    to: "NDLS",
    departure: "20:15",
    arrival: "10:45+2",
    duration: "38h 30m",
    distance: 2444,
    availableClasses: [
      { class: "SL", available: 245, price: 1850, status: "AVAILABLE" },
      { class: "3A", available: 67, price: 2950, status: "AVAILABLE" },
      { class: "2A", available: 23, price: 4200, status: "RAC" },
    ],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    trainNumber: "16022",
    trainName: "Kaveri Express",
    from: "MYS",
    to: "SBC",
    departure: "13:30",
    arrival: "18:45",
    duration: "5h 15m",
    distance: 139,
    availableClasses: [
      { class: "SL", available: 234, price: 320, status: "AVAILABLE" },
      { class: "3A", available: 45, price: 890, status: "AVAILABLE" },
    ],
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
]

export function EnhancedBookingForm() {
  const [searchType, setSearchType] = useState<"route" | "train">("route")
  const [fromStation, setFromStation] = useState("SBC")
  const [toStation, setToStation] = useState("MYS")
  const [trainSearch, setTrainSearch] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [searchResults, setSearchResults] = useState<TrainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRouteSearch = async () => {
    if (!fromStation || !toStation || !travelDate) {
      setError("Please fill all required fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const filteredTrains = mockTrains.filter((train) => {
        return (
          (train.from === fromStation && train.to === toStation) ||
          (train.from === toStation && train.to === fromStation)
        )
      })

      setSearchResults(filteredTrains)
    } catch (err) {
      setError("Failed to search trains. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrainSearch = async () => {
    if (!trainSearch.trim()) {
      setError("Please enter train number or name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const filteredTrains = mockTrains.filter((train) => {
        const searchTerm = trainSearch.toLowerCase()
        return (
          train.trainNumber.toLowerCase().includes(searchTerm) || train.trainName.toLowerCase().includes(searchTerm)
        )
      })

      setSearchResults(filteredTrains)
    } catch (err) {
      setError("Failed to search trains. Please try again.")
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
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStationName = (code: string) => {
    const station = karnatakaStations.find((s) => s.code === code)
    return station ? station.name : code
  }

  return (
    <div className="space-y-6">
      {/* Search Type Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={searchType === "route" ? "default" : "ghost"}
          onClick={() => setSearchType("route")}
          className="flex-1"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Search by Route
        </Button>
        <Button
          variant={searchType === "train" ? "default" : "ghost"}
          onClick={() => setSearchType("train")}
          className="flex-1"
        >
          <Train className="h-4 w-4 mr-2" />
          Search by Train
        </Button>
      </div>

      {/* Route Search Form */}
      {searchType === "route" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Search Trains by Route
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
                  <SelectContent>
                    {karnatakaStations.map((station) => (
                      <SelectItem key={station.code} value={station.code}>
                        {station.name} ({station.code})
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
                  <SelectContent>
                    {karnatakaStations.map((station) => (
                      <SelectItem key={station.code} value={station.code}>
                        {station.name} ({station.code})
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

            <Button onClick={handleRouteSearch} disabled={isLoading} className="w-full">
              {isLoading ? "Searching..." : "Search Trains"}
              <Search className="ml-2 h-4 w-4" />
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
              Search by Train Number or Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Train Number or Name</label>
              <Input
                placeholder="Enter train number (e.g., 12628) or name (e.g., Karnataka Express)"
                value={trainSearch}
                onChange={(e) => setTrainSearch(e.target.value)}
              />
            </div>

            <Button onClick={handleTrainSearch} disabled={isLoading} className="w-full">
              {isLoading ? "Searching..." : "Search Train"}
              <Search className="ml-2 h-4 w-4" />
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
          <h3 className="text-lg font-semibold">Search Results ({searchResults.length} trains found)</h3>

          {searchResults.map((train) => (
            <Card key={train.trainNumber} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900">
                        {train.trainName} ({train.trainNumber})
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{getStationName(train.from)}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{getStationName(train.to)}</span>
                        <span>• {train.distance} km</span>
                      </div>
                    </div>
                    <Badge variant="outline">{train.duration}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>Departure: {train.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span>Arrival: {train.arrival}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Available Classes:</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {train.availableClasses.map((cls) => (
                        <div key={cls.class} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{cls.class}</p>
                            <p className="text-sm text-gray-600">
                              {cls.available > 0 ? `${cls.available} available` : "Not available"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <IndianRupee className="h-3 w-3" />
                              <span className="font-medium">{cls.price}</span>
                            </div>
                            <Badge className={`${getStatusColor(cls.status)} text-white text-xs`}>{cls.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Book Now - Redirect to IRCTC
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">
          <Train className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Search for trains to see available options</p>
        </div>
      )}
    </div>
  )
}
