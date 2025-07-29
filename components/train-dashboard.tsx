"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MapPin, 
  Train, 
  Clock, 
  Users, 
  Thermometer, 
  Gauge, 
  Navigation, 
  Activity, 
  Signal, 
  Battery, 
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
  Filter,
  Search,
  TrendingUp,
  Eye,
  Radio
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Enhanced train data interface
interface TrainData {
  id: string
  name: string
  trainNumber: string
  currentStation: string
  nextStation: string
  status: 'on-time' | 'delayed' | 'stopped' | 'boarding' | 'departed'
  speed: number
  delay: number
  occupancy: number
  temperature: number
  humidity: number
  signalStrength: number
  batteryLevel: number
  route: string
  estimatedArrival: string
  lastUpdated: string
  passengerCount: number
  coaches: number
  position: {
    latitude: number
    longitude: number
  }
}

// Mock live train data store simulation
const mockTrainData: TrainData[] = [
  {
    id: "KA_12628",
    name: "Karnataka Express",
    trainNumber: "12628",
    currentStation: "Bengaluru City Jn (SBC)",
    nextStation: "Tumkur (TK)",
    status: "on-time",
    speed: 87,
    delay: 0,
    occupancy: 82,
    temperature: 24.5,
    humidity: 65,
    signalStrength: 85,
    batteryLevel: 92,
    route: "Bengaluru → Delhi",
    estimatedArrival: "14:30",
    lastUpdated: new Date().toISOString(),
    passengerCount: 1247,
    coaches: 24,
    position: { latitude: 12.9716, longitude: 77.5946 }
  },
  {
    id: "KA_16022",
    name: "Kaveri Express",
    trainNumber: "16022",
    currentStation: "Mysuru Jn (MYS)",
    nextStation: "Mandya (MYA)",
    status: "delayed",
    speed: 45,
    delay: 15,
    occupancy: 94,
    temperature: 26.8,
    humidity: 72,
    signalStrength: 76,
    batteryLevel: 88,
    route: "Bengaluru → Mysuru",
    estimatedArrival: "15:45",
    lastUpdated: new Date().toISOString(),
    passengerCount: 892,
    coaches: 18,
    position: { latitude: 12.3051, longitude: 76.6553 }
  },
  {
    id: "KA_16515",
    name: "Karwar Express",
    trainNumber: "16515",
    currentStation: "Bengaluru Cant (BNC)",
    nextStation: "Yeshvantpur Jn (YPR)",
    status: "boarding",
    speed: 0,
    delay: 0,
    occupancy: 67,
    temperature: 25.2,
    humidity: 68,
    signalStrength: 92,
    batteryLevel: 95,
    route: "Bengaluru → Karwar",
    estimatedArrival: "16:15",
    lastUpdated: new Date().toISOString(),
    passengerCount: 1134,
    coaches: 20,
    position: { latitude: 12.9698, longitude: 77.5636 }
  },
  {
    id: "KA_16591",
    name: "Hampi Express",
    trainNumber: "16591",
    currentStation: "Hospet Jn (HPT)",
    nextStation: "Toranagallu (TNL)",
    status: "departed",
    speed: 72,
    delay: 8,
    occupancy: 88,
    temperature: 27.1,
    humidity: 58,
    signalStrength: 68,
    batteryLevel: 78,
    route: "Bengaluru → Hospet",
    estimatedArrival: "17:20",
    lastUpdated: new Date().toISOString(),
    passengerCount: 756,
    coaches: 16,
    position: { latitude: 15.2691, longitude: 76.3877 }
  }
]

export function TrainDashboard() {
  const [trains, setTrains] = useState<TrainData[]>(mockTrainData)
  const [isConnected, setIsConnected] = useState(true)
  const [connectionType, setConnectionType] = useState<"websocket" | "polling" | "offline">("websocket")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulate live data updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          speed: Math.max(0, Math.min(120, train.speed + (Math.random() - 0.5) * 20)),
          occupancy: Math.max(30, Math.min(100, train.occupancy + (Math.random() - 0.5) * 10)),
          temperature: Math.max(20, Math.min(35, train.temperature + (Math.random() - 0.5) * 2)),
          humidity: Math.max(40, Math.min(90, train.humidity + (Math.random() - 0.5) * 5)),
          delay: Math.max(0, train.delay + (Math.random() - 0.7) * 5),
          signalStrength: Math.max(20, Math.min(100, train.signalStrength + (Math.random() - 0.5) * 15)),
          batteryLevel: Math.max(60, Math.min(100, train.batteryLevel - Math.random() * 0.5)),
          lastUpdated: new Date().toISOString()
        }))
      )
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Simulate connection changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        const types: ("websocket" | "polling" | "offline")[] = ["websocket", "polling", "offline"]
        const randomType = types[Math.floor(Math.random() * types.length)] ?? "websocket"
        
        if (randomType === "offline") {
          setIsConnected(false)
          setConnectionType("offline")
        } else {
          setIsConnected(true)
          setConnectionType(randomType)
        }

        // Auto-recover after 10 seconds
        setTimeout(() => {
          setIsConnected(true)
          setConnectionType("websocket")
        }, 10000)
      }
    }, 30000)

    return () => clearInterval(connectionInterval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "default"
      case "delayed":
        return "secondary"
      case "stopped":
        return "destructive"
      case "boarding":
        return "outline"
      case "departed":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <Clock className="h-3 w-3" />
      case "delayed":
        return <AlertCircle className="h-3 w-3" />
      case "stopped":
        return <Users className="h-3 w-3" />
      case "boarding":
        return <Train className="h-3 w-3" />
      case "departed":
        return <Navigation className="h-3 w-3" />
      default:
        return <Train className="h-3 w-3" />
    }
  }

  const getConnectionIcon = () => {
    switch (connectionType) {
      case "websocket":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "polling":
        return <Radio className="h-4 w-4 text-blue-500" />
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />
    }
  }

  const formatLastUpdate = (timestamp: string) => {
    const now = new Date()
    const updated = new Date(timestamp)
    const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTrains(mockTrainData.map(train => ({
        ...train,
        lastUpdated: new Date().toISOString()
      })))
      setLastUpdate(new Date())
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTrains = trains.filter(train => {
    const matchesSearch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.trainNumber.includes(searchTerm) ||
                         train.currentStation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || train.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statsData = {
    total: trains.length,
    onTime: trains.filter(t => t.status === "on-time").length,
    delayed: trains.filter(t => t.status === "delayed").length,
    totalPassengers: trains.reduce((sum, train) => sum + train.passengerCount, 0),
    avgOccupancy: Math.round(trains.reduce((sum, train) => sum + train.occupancy, 0) / trains.length)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Train className="h-8 w-8 text-blue-600" />
            Karnataka Railway Live Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time train monitoring and status updates</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Live ON' : 'Live OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getConnectionIcon()}
              <div>
                <span className="font-medium">
                  {connectionType === "websocket" ? "Real-time WebSocket Connected" :
                   connectionType === "polling" ? "Polling Mode (5s intervals)" : "Connection Offline"}
                </span>
                {connectionType === "polling" && (
                  <p className="text-xs text-gray-500">WebSocket unavailable, using fallback</p>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center p-4">
          <Train className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-900">{statsData.total}</div>
          <div className="text-sm text-gray-600">Active Trains</div>
        </Card>
        <Card className="text-center p-4">
          <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-900">{statsData.onTime}</div>
          <div className="text-sm text-gray-600">On Time</div>
        </Card>
        <Card className="text-center p-4">
          <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-900">{statsData.delayed}</div>
          <div className="text-sm text-gray-600">Delayed</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-900">{statsData.totalPassengers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Passengers</div>
        </Card>
        <Card className="text-center p-4">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
          <div className="text-2xl font-bold text-indigo-900">{statsData.avgOccupancy}%</div>
          <div className="text-sm text-gray-600">Avg Occupancy</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trains, numbers, or stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-time">On Time</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="boarding">Boarding</SelectItem>
                  <SelectItem value="departed">Departed</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Train Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrains.map((train) => (
          <Card key={train.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-lg">{train.name}</div>
                    <div className="text-sm text-gray-500 font-normal">#{train.trainNumber}</div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(train.status)} className="flex items-center gap-1">
                    {getStatusIcon(train.status)}
                    {train.status}
                  </Badge>
                  {isConnected && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        connectionType === "websocket" ? "bg-green-500 animate-pulse" : "bg-blue-500"
                      }`}
                      title="Live data indicator"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {train.currentStation}
                </span>
                <span>{train.route}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Speed and Next Station */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Speed</p>
                    <p className="font-semibold">{Math.round(train.speed)} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Next Station</p>
                    <p className="font-semibold text-sm">{train.nextStation}</p>
                  </div>
                </div>
              </div>

              {/* Occupancy */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Occupancy ({train.passengerCount} passengers)
                  </span>
                  <span className="text-sm font-semibold">{Math.round(train.occupancy)}%</span>
                </div>
                <Progress value={train.occupancy} className="h-3" />
              </div>

              {/* Environmental Data */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-sm font-semibold">{train.temperature.toFixed(1)}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-600">Humidity</p>
                    <p className="text-sm font-semibold">{Math.round(train.humidity)}%</p>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Signal className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-600">Signal</p>
                    <p className="text-sm font-semibold">{Math.round(train.signalStrength)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-600">Battery</p>
                    <p className="text-sm font-semibold">{Math.round(train.batteryLevel)}%</p>
                  </div>
                </div>
              </div>

              {/* Delay Information */}
              {train.delay > 0 && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Delayed by {Math.round(train.delay)} minutes • ETA: {train.estimatedArrival}
                  </AlertDescription>
                </Alert>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>{train.coaches} coaches</span>
                <span>Updated: {formatLastUpdate(train.lastUpdated)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTrains.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Train className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No trains found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No active trains in the Karnataka Railway network"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}