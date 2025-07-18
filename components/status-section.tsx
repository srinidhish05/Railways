"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "lucide-react"
import { useTrainDataStore, fetchTrainData, startMockUpdates } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

export function StatusSection() {
  const { trains, isConnected, connectionType, lastUpdate, error, connect, disconnect } = useTrainDataStore()
  const [isLoading, setIsLoading] = useState(true)

  // Initialize connection on component mount
  useEffect(() => {
    connect()

    // Start mock updates for demo purposes
    startMockUpdates()

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [])

  // Set loading to false once we have data
  useEffect(() => {
    if (trains.length > 0) {
      setIsLoading(false)
    }
  }, [trains])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "default"
      case "delayed":
        return "secondary"
      case "stopped":
        return "destructive"
      default:
        return "default"
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
    try {
      setIsLoading(true)
      const data = await fetchTrainData()
      useTrainDataStore.getState().setTrains(data)
    } catch (error) {
      console.error("Failed to refresh train data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReconnect = () => {
    disconnect()
    connect()
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
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          {getConnectionIcon()}
          <div>
            <span className="font-medium">{getConnectionText()}</span>
            {connectionType === "polling" && (
              <p className="text-xs text-gray-500">WebSocket unavailable, using fallback method</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {lastUpdate ? `Last update: ${lastUpdate.toLocaleTimeString()}` : "No updates yet"}
          </div>
          <Button size="sm" variant="outline" onClick={isConnected ? handleManualRefresh : handleReconnect}>
            <RefreshCw className="h-4 w-4 mr-1" />
            {isConnected ? "Refresh" : "Reconnect"}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Train Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && !trains.length
          ? // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
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
                className={`relative overflow-hidden transition-all duration-300 ${!isConnected ? "opacity-75" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Train className="h-5 w-5" />
                      {train.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(train.status)}>{train.status}</Badge>
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
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {train.currentStation}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Speed and Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Speed</p>
                        <p className="font-semibold">{Math.round(train.speed)} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
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
                        Occupancy
                      </span>
                      <span className="text-sm font-semibold">{Math.round(train.occupancy)}%</span>
                    </div>
                    <Progress value={train.occupancy} className="h-2" />
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
                    <div>
                      <p className="text-xs text-gray-600">Humidity</p>
                      <p className="text-sm font-semibold">{Math.round(train.humidity)}%</p>
                    </div>
                  </div>

                  {/* Delay Information */}
                  {train.delay > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Delayed by {Math.round(train.delay)} minutes
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">ETA: {train.estimatedArrival}</p>
                    </div>
                  )}

                  {/* Last Update */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Updated: {formatLastUpdate(train.lastUpdated)}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* No Data Message */}
      {!isLoading && trains.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <Train className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No train data available</h3>
          <p className="text-gray-500 mt-2">There are currently no active trains in the system.</p>
          <Button className="mt-4" onClick={handleManualRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      )}
    </div>
  )
}
