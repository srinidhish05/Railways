"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Play, Square, Wifi, WifiOff, Users, Clock } from "lucide-react"
import { OptimizedGPSTracker } from "@/lib/gps-tracker"
import type { GPSCoordinate, TrainPosition } from "@/lib/gps-tracker"

export function GPSTrackerDemo() {
  const [trainNumber, setTrainNumber] = useState("EXP2024")
  const [tracker, setTracker] = useState<OptimizedGPSTracker | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GPSCoordinate | null>(null)
  const [liveTrainPosition, setLiveTrainPosition] = useState<TrainPosition | null>(null)
  const [error, setError] = useState<string>("")
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (tracker && isTracking) {
      const interval = setInterval(() => {
        const position = tracker.getCurrentPosition()
        setCurrentPosition(position)

        // Fetch live train position
        if (trainNumber) {
          fetchLiveTrainPosition(trainNumber)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [tracker, isTracking, trainNumber])

  const startTracking = async () => {
    try {
      setError("")

      const newTracker = new OptimizedGPSTracker(trainNumber, {
        enableHighAccuracy: false, // Optimized for battery
        timeout: 15000,
        maximumAge: 30000,
        minAccuracy: 100,
        updateInterval: 30000,
        batchSize: 3, // Smaller batches for low bandwidth
      })

      await newTracker.startTracking()
      setTracker(newTracker)
      setIsTracking(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start tracking")
    }
  }

  const stopTracking = () => {
    if (tracker) {
      tracker.stopTracking()
      setTracker(null)
      setIsTracking(false)
      setCurrentPosition(null)
    }
  }

  const fetchLiveTrainPosition = async (trainNum: string) => {
    try {
      const response = await fetch(`/api/gps/position/${trainNum}`)
      if (response.ok) {
        const position = await response.json()
        setLiveTrainPosition(position)
      }
    } catch (error) {
      console.error("Failed to fetch live position:", error)
    }
  }

  const formatCoordinate = (coord: number) => coord.toFixed(5)
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GPS Tracker Demo
          </CardTitle>
          <CardDescription>
            Anonymous GPS tracking for train position calculation (optimized for low bandwidth)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="trainNumber">Train Number</Label>
              <Input
                id="trainNumber"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                disabled={isTracking}
                placeholder="Enter train number"
              />
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="default">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={startTracking} disabled={isTracking || !trainNumber} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Tracking
            </Button>
            <Button
              onClick={stopTracking}
              disabled={!isTracking}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Square className="h-4 w-4" />
              Stop Tracking
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Current Device Position */}
      {currentPosition && (
        <Card>
          <CardHeader>
            <CardTitle>Your Current Position</CardTitle>
            <CardDescription>GPS data being collected from your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Latitude</Label>
                <p className="font-mono">{formatCoordinate(currentPosition.latitude)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Longitude</Label>
                <p className="font-mono">{formatCoordinate(currentPosition.longitude)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Accuracy</Label>
                <p className="font-mono">{currentPosition.accuracy}m</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Last Update</Label>
                <p className="text-sm">{formatTime(currentPosition.timestamp)}</p>
              </div>
              {currentPosition.speed && (
                <div>
                  <Label className="text-sm text-gray-600">Speed</Label>
                  <p className="font-mono">{currentPosition.speed} km/h</p>
                </div>
              )}
              {currentPosition.heading && (
                <div>
                  <Label className="text-sm text-gray-600">Heading</Label>
                  <p className="font-mono">{currentPosition.heading}°</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Train Position */}
      {liveTrainPosition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Train Position - {liveTrainPosition.trainNumber}
            </CardTitle>
            <CardDescription>
              Calculated from {liveTrainPosition.contributorCount} anonymous contributors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="text-sm text-gray-600">Latitude</Label>
                <p className="font-mono">{formatCoordinate(liveTrainPosition.position.latitude)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Longitude</Label>
                <p className="font-mono">{formatCoordinate(liveTrainPosition.position.longitude)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Accuracy</Label>
                <p className="font-mono">{Math.round(liveTrainPosition.position.accuracy)}m</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Contributors</Label>
                <p className="font-mono">{liveTrainPosition.contributorCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={liveTrainPosition.confidence > 80 ? "default" : "secondary"}>
                {liveTrainPosition.confidence}% Confidence
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Updated {formatTime(liveTrainPosition.lastUpdated)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Info */}
      <Card>
        <CardHeader>
          <CardTitle>Low-Bandwidth Optimizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Data Compression</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Coordinate rounding to 5 decimal places (~11m precision)</li>
                <li>• Batch sending (3-5 positions per request)</li>
                <li>• JSON key compression (lat/lng vs latitude/longitude)</li>
                <li>• Duplicate position filtering</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Battery Optimization</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Low accuracy mode (100m threshold)</li>
                <li>• 30-second update intervals</li>
                <li>• Automatic retry with exponential backoff</li>
                <li>• Offline queue with localStorage backup</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
