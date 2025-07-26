"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Train,
  Clock,
  MapPin,
  Users,
  Thermometer,
  Gauge,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  Radio,
  Signal,
  Battery,
  Activity,
  TrendingUp,
  Navigation,
  Zap,
  Eye
} from "lucide-react"

interface TrainData {
  id: string
  name: string
  number: string
  status: "on-time" | "delayed" | "stopped" | "boarding" | "departed"
  currentStation: string
  nextStation: string
  speed: number
  occupancy: number
  temperature: number
  humidity: number
  delay: number
  estimatedArrival: string
  lastUpdated: string
  route: string
  position: {
    latitude: number
    longitude: number
  }
  coaches: number
  passengerCount: number
  signalStrength: number
  batteryLevel: number
}

// Mock Karnataka Railway train data
const mockKarnatakaTrains: TrainData[] = [
  {
    id: "KA_12628",
    name: "Karnataka Express",
    number: "12628",
    status: "on-time",
    currentStation: "Bengaluru City Jn (SBC)",
    nextStation: "Tumkur (TK)",
    speed: 87,
    occupancy: 82,
    temperature: 24.5,
    humidity: 65,
    delay: 0,
    estimatedArrival: "14:30",
    lastUpdated: new Date().toISOString(),
    route: "Bengaluru → Delhi",
    position: { latitude: 12.9716, longitude: 77.5946 },
    coaches: 24,
    passengerCount: 1247,
    signalStrength: 85,
    batteryLevel: 92
  },
  {
    id: "KA_16022",
    name: "Kaveri Express",
    number: "16022",
    status: "delayed",
    currentStation: "Mysuru Jn (MYS)",
    nextStation: "Mandya (MYA)",
    speed: 45,
    occupancy: 94,
    temperature: 26.8,
    humidity: 72,
    delay: 15,
    estimatedArrival: "15:45",
    lastUpdated: new Date().toISOString(),
    route: "Bengaluru → Mysuru",
    position: { latitude: 12.3051, longitude: 76.6553 },
    coaches: 18,
    passengerCount: 892,
    signalStrength: 76,
    batteryLevel: 88
  },
  {
    id: "KA_16515",
    name: "Karwar Express",
    number: "16515",
    status: "boarding",
    currentStation: "Bengaluru Cant (BNC)",
    nextStation: "Yeshvantpur Jn (YPR)",
    speed: 0,
    occupancy: 67,
    temperature: 25.2,
    humidity: 68,
    delay: 0,
    estimatedArrival: "16:15",
    lastUpdated: new Date().toISOString(),
    route: "Bengaluru → Karwar",
    position: { latitude: 12.9698, longitude: 77.5636 },
    coaches: 20,
    passengerCount: 1134,
    signalStrength: 92,
    batteryLevel: 95
  },
  {
    id: "KA_16591",
    name: "Hampi Express",
    number: "16591",
    status: "departed",
    currentStation: "Hospet Jn (HPT)",
    nextStation: "Toranagallu (TNL)",
    speed: 72,
    occupancy: 88,
    temperature: 27.1,
    humidity: 58,
    delay: 8,
    estimatedArrival: "17:20",
    lastUpdated: new Date().toISOString(),
    route: "Bengaluru → Hospet",
    position: { latitude: 15.2691, longitude: 76.3877 },
    coaches: 16,
    passengerCount: 756,
    signalStrength: 68,
    batteryLevel: 78
  }
]

export function StatusSection() {
  const [trains, setTrains] = useState<TrainData[]>(mockKarnatakaTrains)
  const [isConnected, setIsConnected] = useState(true)
  const [connectionType, setConnectionType] = useState<"websocket" | "polling" | "offline">("websocket")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulate real-time updates
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
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Simulate connection changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      const connectionTypes: ("websocket" | "polling" | "offline")[] = ["websocket", "polling", "offline"]
      const randomType = connectionTypes[Math.floor(Math.random() * 3)]
      
      // Bias towards websocket (70% chance)
      if (Math.random() > 0.3) {
        setConnectionType("websocket")
        setIsConnected(true)
        setError(null)
      } else if (Math.random() > 0.1) {
        setConnectionType("polling")
        setIsConnected(true)
        setError("WebSocket unavailable, using polling fallback")
      } else {
        setConnectionType("offline")
        setIsConnected(false)
        setError("Connection lost - attempting to reconnect...")
      }
    }, 30000) // Change connection every 30 seconds

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
        return "default"
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

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 50) return "bg-green-500"
    if (occupancy < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatLastUpdate = (timestamp: string) => {
    const now = new Date()
    const updated = new Date(timestamp)
    const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  const handleManualRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTrains(mockKarnatakaTrains.map(train => ({
        ...train,
        lastUpdated: new Date().toISOString()
      })))
      setLastUpdate(new Date())
      setError(null)
    } catch (error) {
      setError("Failed to refresh train data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReconnect = () => {
    setIsConnected(true)
    setConnectionType("websocket")
    setError(null)
    setLastUpdate(new Date())
  }

  const getConnectionIcon = () => {
    switch (connectionType) {
      case "websocket":
        return <Wifi className="h-5 w-5 text-green-500" />
      case "polling":
        return <Radio className="h-5 w-5 text-blue-500" />
      default:
        return <WifiOff className="h-5 w-5 text-red-500" />
    }
  }

  const getConnectionText = () => {
    switch (connectionType) {
      case "websocket":
        return "Real-time WebSocket connected"
      case "polling":
        return "Polling for updates (5s intervals)"
      default:
        return "Connection offline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getConnectionIcon()}
              <div>
                <span className="font-medium">{getConnectionText()}</span>
                {connectionType === "polling" && (
                  <p className="text-xs text-gray-500">WebSocket unavailable, using fallback method</p>
                )}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Karnataka Railway Network
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {lastUpdate ? `Last: ${lastUpdate.toLocaleTimeString()}` : "No updates"}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={isConnected ? handleManualRefresh : handleReconnect}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                {isConnected ? 'Refresh' : 'Reconnect'}
              </Button>
              <Button
                size="sm"
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {autoRefresh ? 'Live ON' : 'Live OFF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* System Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Train className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-900">{trains.length}</div>
          <div className="text-sm text-gray-600">Active Trains</div>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-900">
            {trains.filter(t => t.status === "on-time").length}
          </div>
          <div className="text-sm text-gray-600">On Time</div>
        </Card>
        <Card className="p-4 text-center">
          <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-900">
            {trains.filter(t => t.status === "delayed").length}
          </div>
          <div className="text-sm text-gray-600">Delayed</div>
        </Card>
        <Card className="p-4 text-center">
          <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-900">
            {trains.reduce((sum, train) => sum + train.passengerCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Passengers</div>
        </Card>
      </div>

      {/* Train Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {isLoading && !trains.length
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          : trains.map((train) => (
              <Card
                key={train.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  !isConnected ? "opacity-75" : ""
                } hover:shadow-lg`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Train className="h-5 w-5 text-blue-600" />
                      <div>
                        <div>{train.name}</div>
                        <div className="text-sm text-gray-500 font-normal">#{train.number}</div>
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
                          title={connectionType === "websocket" ? "Live WebSocket data" : "Polling data"}
                        />
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {train.currentStation}
                    </span>
                    <span className="text-xs text-gray-500">{train.route}</span>
                  </CardDescription>
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

                  {/* Environmental and System Data */}
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
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Delayed by {Math.round(train.delay)} minutes
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">ETA: {train.estimatedArrival}</p>
                    </div>
                  )}

                  {/* Train Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>{train.coaches} coaches</span>
                    <span>Updated: {formatLastUpdate(train.lastUpdated)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* No Data Message */}
      {!isLoading && trains.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <Train className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No train data available</h3>
          <p className="text-gray-500 mt-2">There are currently no active trains in the Karnataka Railway network.</p>
          <Button className="mt-4" onClick={handleManualRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      )}
    </div>
  )
}