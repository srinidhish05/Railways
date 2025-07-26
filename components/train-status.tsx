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
  Navigation,
  Activity,
  Signal,
  Battery,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  TrendingUp,
  Eye,
  Radio
} from "lucide-react"

interface TrainRealTimeData {
  id: string
  name: string
  trainNumber: string
  currentLocation: {
    latitude: number
    longitude: number
    stationName: string
    stationCode: string
  }
  speed: number
  occupancy: number
  temperature: number
  humidity: number
  nextStation: string
  estimatedArrival: string
  delay: number
  status: "on-time" | "delayed" | "stopped" | "boarding" | "departed"
  route: string
  passengerCount: number
  coaches: number
  signalStrength: number
  batteryLevel: number
  lastUpdated: string
}

// Mock Firebase data simulation for Karnataka Railway
const mockKarnatakaTrains: TrainRealTimeData[] = [
  {
    id: "KA_12628",
    name: "Karnataka Express",
    trainNumber: "12628",
    currentLocation: {
      latitude: 12.9716,
      longitude: 77.5946,
      stationName: "Bengaluru City Junction",
      stationCode: "SBC"
    },
    speed: 87,
    occupancy: 82,
    temperature: 24.5,
    humidity: 65,
    nextStation: "Tumkur (TK)",
    estimatedArrival: "14:30",
    delay: 0,
    status: "on-time",
    route: "Bengaluru → Delhi",
    passengerCount: 1247,
    coaches: 24,
    signalStrength: 85,
    batteryLevel: 92,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "KA_16022",
    name: "Kaveri Express",
    trainNumber: "16022",
    currentLocation: {
      latitude: 12.3051,
      longitude: 76.6553,
      stationName: "Mysuru Junction",
      stationCode: "MYS"
    },
    speed: 45,
    occupancy: 94,
    temperature: 26.8,
    humidity: 72,
    nextStation: "Mandya (MYA)",
    estimatedArrival: "15:45",
    delay: 15,
    status: "delayed",
    route: "Bengaluru → Mysuru",
    passengerCount: 892,
    coaches: 18,
    signalStrength: 76,
    batteryLevel: 88,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "KA_16515",
    name: "Karwar Express",
    trainNumber: "16515",
    currentLocation: {
      latitude: 12.9698,
      longitude: 77.5636,
      stationName: "Bengaluru Cantonment",
      stationCode: "BNC"
    },
    speed: 0,
    occupancy: 67,
    temperature: 25.2,
    humidity: 68,
    nextStation: "Yeshvantpur Jn (YPR)",
    estimatedArrival: "16:15",
    delay: 0,
    status: "boarding",
    route: "Bengaluru → Karwar",
    passengerCount: 1134,
    coaches: 20,
    signalStrength: 92,
    batteryLevel: 95,
    lastUpdated: new Date().toISOString()
  }
]

export function TrainStatus() {
  const [trainData, setTrainData] = useState<TrainRealTimeData[]>(mockKarnatakaTrains)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [connectionType, setConnectionType] = useState<"realtime" | "polling" | "offline">("realtime")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulate Firebase real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setTrainData(prevData => 
        prevData.map(train => ({
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
    }, 4000) // Update every 4 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Simulate connection status changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        const types: ("realtime" | "polling" | "offline")[] = ["realtime", "polling", "offline"]
        const randomType = types[Math.floor(Math.random() * types.length)]
        
        if (randomType === "offline") {
          setIsConnected(false)
          setConnectionType("offline")
          setError("Firebase connection lost - attempting to reconnect...")
        } else {
          setIsConnected(true)
          setConnectionType(randomType)
          setError(randomType === "polling" ? "Real-time sync unavailable, using polling" : null)
        }

        // Auto-recover after 8 seconds
        setTimeout(() => {
          setIsConnected(true)
          setConnectionType("realtime")
          setError(null)
        }, 8000)
      }
    }, 25000)

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
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "delayed":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />
      case "stopped":
        return <Users className="h-3 w-3 text-red-600" />
      case "boarding":
        return <Train className="h-3 w-3 text-blue-600" />
      case "departed":
        return <Navigation className="h-3 w-3 text-green-600" />
      default:
        return <Train className="h-3 w-3" />
    }
  }

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 50) return "bg-green-500"
    if (occupancy < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getConnectionIcon = () => {
    switch (connectionType) {
      case "realtime":
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTrainData(mockKarnatakaTrains.map(train => ({
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
    setConnectionType("realtime")
    setError(null)
    setLastUpdate(new Date())
  }

  const statsData = {
    total: trainData.length,
    onTime: trainData.filter(t => t.status === "on-time").length,
    delayed: trainData.filter(t => t.status === "delayed").length,
    totalPassengers: trainData.reduce((sum, train) => sum + train.passengerCount, 0)
  }

  if (isLoading && trainData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-8 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Train className="h-6 w-6 text-blue-600" />
            Live Train Status
          </h2>
          <p className="text-gray-600 text-sm">Real-time Karnataka Railway monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span className="text-sm font-medium">
              {connectionType === "realtime" ? "Firebase Live" :
               connectionType === "polling" ? "Polling Mode" : "Offline"}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
          </div>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {autoRefresh ? 'Live ON' : 'Live OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={isConnected ? handleRefresh : handleReconnect}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isConnected ? 'Refresh' : 'Reconnect'}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Train className="h-5 w-5 mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-blue-900">{statsData.total}</div>
          <div className="text-xs text-gray-600">Active Trains</div>
        </Card>
        <Card className="text-center p-4">
          <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-green-900">{statsData.onTime}</div>
          <div className="text-xs text-gray-600">On Time</div>
        </Card>
        <Card className="text-center p-4">
          <AlertCircle className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-yellow-900">{statsData.delayed}</div>
          <div className="text-xs text-gray-600">Delayed</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="h-5 w-5 mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-purple-900">{statsData.totalPassengers.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Passengers</div>
        </Card>
      </div>

      {/* Train Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainData.map((train) => (
          <Card key={train.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
            !isConnected ? 'opacity-75' : ''
          }`}>
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
                        connectionType === "realtime" ? "bg-green-500 animate-pulse" : "bg-blue-500"
                      }`}
                      title="Live Firebase data"
                    />
                  )}
                </div>
              </div>
              <CardDescription className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {train.currentLocation.stationName} ({train.currentLocation.stationCode})
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Delayed by {Math.round(train.delay)} minutes
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">ETA: {train.estimatedArrival}</p>
                </div>
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

      {/* Connection Status Footer */}
      <div className="text-center text-sm text-gray-500">
        Last update: {lastUpdate.toLocaleTimeString()} • 
        {connectionType === "realtime" ? " Firebase Real-time Database" :
         connectionType === "polling" ? " Polling every 4 seconds" : " Offline Mode"}
      </div>
    </div>
  )
}