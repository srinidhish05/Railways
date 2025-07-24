"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MapPin, Play, Square, Wifi, WifiOff, Users, Clock, Battery, 
  Smartphone, Signal, Shield, Eye, EyeOff, Settings, Info,
  Zap, Database, Upload, Download, Activity, Navigation
} from "lucide-react"
import { OptimizedGPSTracker } from "@/lib/gps-tracker"
import type { GPSCoordinate, TrainPosition } from "@/lib/gps-tracker"

interface TrackingStats {
  dataPoints: number
  batteryUsage: number
  dataSent: number
  accuracy: number
  uptime: number
}

export function GPSTrackerDemo() {
  const [trainNumber, setTrainNumber] = useState("EXP2024")
  const [tracker, setTracker] = useState<OptimizedGPSTracker | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GPSCoordinate | null>(null)
  const [liveTrainPosition, setLiveTrainPosition] = useState<TrainPosition | null>(null)
  const [error, setError] = useState<string>("")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [privacyMode, setPrivacyMode] = useState(true)
  const [highAccuracyMode, setHighAccuracyMode] = useState(false)
  const [stats, setStats] = useState<TrackingStats>({
    dataPoints: 0,
    batteryUsage: 5,
    dataSent: 0,
    accuracy: 95,
    uptime: 0
  })
  const [positionHistory, setPositionHistory] = useState<GPSCoordinate[]>([])
  const [nearbyTrains, setNearbyTrains] = useState<TrainPosition[]>([])

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

        // Update position history
        if (position) {
          setPositionHistory(prev => [...prev.slice(-20), position])
          setStats(prev => ({
            ...prev,
            dataPoints: prev.dataPoints + 1,
            dataSent: prev.dataSent + 0.1, // KB
            uptime: prev.uptime + 5
          }))
        }

        // Fetch live train position and nearby trains
        if (trainNumber) {
          fetchLiveTrainPosition(trainNumber)
          fetchNearbyTrains(position)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [tracker, isTracking, trainNumber])

  const startTracking = async () => {
    try {
      setError("")

      const newTracker = new OptimizedGPSTracker(trainNumber, {
        enableHighAccuracy: highAccuracyMode,
        timeout: 15000,
        maximumAge: 30000,
        minAccuracy: highAccuracyMode ? 50 : 100,
        updateInterval: highAccuracyMode ? 15000 : 30000,
        batchSize: 3,
      })

      await newTracker.startTracking()
      setTracker(newTracker)
      setIsTracking(true)
      setStats(prev => ({ ...prev, uptime: 0, dataPoints: 0 }))
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
      setPositionHistory([])
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

  const fetchNearbyTrains = async (position: GPSCoordinate | null) => {
    if (!position) return
    
    try {
      const response = await fetch(`/api/gps/nearby?lat=${position.latitude}&lng=${position.longitude}&radius=10`)
      if (response.ok) {
        const trains = await response.json()
        setNearbyTrains(trains)
      }
    } catch (error) {
      console.error("Failed to fetch nearby trains:", error)
    }
  }

  const formatCoordinate = (coord: number) => coord.toFixed(5)
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString()
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hrs}h ${mins}m`
  }

  const getSignalStrength = () => {
    if (!currentPosition) return 0
    return Math.min(100, Math.max(0, 100 - (currentPosition.accuracy - 10)))
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Navigation className="h-6 w-6 text-blue-600" />
                Live Train GPS Tracker
              </h1>
              <p className="text-gray-600">Anonymous crowdsourced train position tracking</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Battery className="h-4 w-4" />
                  <span>Battery Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tracker">GPS Tracker</TabsTrigger>
          <TabsTrigger value="position">Live Position</TabsTrigger>
          <TabsTrigger value="nearby">Nearby Trains</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          {/* Main Tracker Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                GPS Tracker Control
              </CardTitle>
              <CardDescription>
                Anonymous GPS tracking for train position calculation (optimized for low bandwidth)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trainNumber">Train Number</Label>
                  <Input
                    id="trainNumber"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    disabled={isTracking}
                    placeholder="Enter train number (e.g., 12345, EXP2024)"
                  />
                </div>
                <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2">
                    <Signal className="h-4 w-4" />
                    <Progress value={getSignalStrength()} className="w-16 h-2" />
                    <span className="text-xs">{Math.round(getSignalStrength())}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startTracking} 
                  disabled={isTracking || !trainNumber} 
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isTracking ? "Tracking Active" : "Start Tracking"}
                </Button>
                <Button
                  onClick={stopTracking}
                  disabled={!isTracking}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop Tracking
                </Button>
              </div>

              {/* Quick Stats */}
              {isTracking && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.dataPoints}</div>
                    <div className="text-xs text-gray-600">Data Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.dataSent.toFixed(1)}KB</div>
                    <div className="text-xs text-gray-600">Data Sent</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 text-center">
                    <div>{stats.accuracy}%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatDuration(stats.uptime)}</div>
                    <div className="text-xs text-gray-600">Uptime</div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position" className="space-y-6">
          {/* Current Device Position */}
          {currentPosition ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Your Current Position
                </CardTitle>
                <CardDescription>
                  GPS data being collected from your device
                  {privacyMode && " (anonymized before transmission)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-gray-600">Latitude</Label>
                    <p className="font-mono text-lg">{formatCoordinate(currentPosition.latitude)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Longitude</Label>
                    <p className="font-mono text-lg">{formatCoordinate(currentPosition.longitude)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Accuracy</Label>
                    <p className="font-mono text-lg">{Math.round(currentPosition.accuracy)}m</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Last Update</Label>
                    <p className="text-sm">{formatTime(currentPosition.timestamp)}</p>
                  </div>
                  {currentPosition.speed !== undefined && (
                    <div>
                      <Label className="text-sm text-gray-600">Speed</Label>
                      <p className="font-mono text-lg">{Math.round(currentPosition.speed * 3.6)} km/h</p>
                    </div>
                  )}
                  {currentPosition.heading !== undefined && (
                    <div>
                      <Label className="text-sm text-gray-600">Heading</Label>
                      <p className="font-mono text-lg">{Math.round(currentPosition.heading)}°</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm text-gray-600">Altitude</Label>
                    <p className="font-mono text-lg">
                      {currentPosition.altitude ? `${Math.round(currentPosition.altitude)}m` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Data Quality</Label>
                    <Badge variant={currentPosition.accuracy < 50 ? "default" : "secondary"}>
                      {currentPosition.accuracy < 50 ? "High" : currentPosition.accuracy < 100 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </div>

                {/* Position History Chart */}
                {positionHistory.length > 1 && (
                  <div className="mt-4">
                    <Label className="text-sm text-gray-600 mb-2 block">Position History (Last 20 points)</Label>
                    <div className="h-20 bg-gray-50 rounded flex items-end gap-1 p-2">
                      {positionHistory.slice(-20).map((pos, index) => (
                        <div
                          key={index}
                          className="bg-blue-500 rounded-t"
                          style={{
                            height: `${Math.max(10, Math.min(60, 100 - pos.accuracy))}%`,
                            width: `${100 / 20}%`
                          }}
                          title={`Accuracy: ${pos.accuracy}m`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : isTracking ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Acquiring GPS signal...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Start tracking to see your position</p>
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
                    <p className="font-mono text-lg">{formatCoordinate(liveTrainPosition.position.latitude)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Longitude</Label>
                    <p className="font-mono text-lg">{formatCoordinate(liveTrainPosition.position.longitude)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Accuracy</Label>
                    <p className="font-mono text-lg">{Math.round(liveTrainPosition.position.accuracy)}m</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Contributors</Label>
                    <p className="font-mono text-lg">{liveTrainPosition.contributorCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant={liveTrainPosition.confidence > 80 ? "default" : "secondary"}>
                    {liveTrainPosition.confidence}% Confidence
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Updated {formatTime(liveTrainPosition.lastUpdated)}
                  </div>
                  <Badge variant="outline">
                    <Activity className="h-3 w-3 mr-1" />
                    Live Tracking
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nearby" className="space-y-6">
          {/* Nearby Trains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Trains
              </CardTitle>
              <CardDescription>
                Other trains being tracked in your vicinity (within 10km radius)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyTrains.length > 0 ? (
                <div className="space-y-4">
                  {nearbyTrains.map((train, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">Train {train.trainNumber}</h4>
                        <Badge variant={train.confidence > 70 ? "default" : "secondary"}>
                          {train.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Distance</Label>
                          <p className="font-mono">~2.3 km</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Contributors</Label>
                          <p className="font-mono">{train.contributorCount}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Last Seen</Label>
                          <p className="text-xs">{formatTime(train.lastUpdated)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No nearby trains detected</p>
                  <p className="text-sm text-gray-500 mt-2">Start tracking to detect trains in your area</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tracking Settings
              </CardTitle>
              <CardDescription>
                Configure tracking preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Privacy Mode</Label>
                    <p className="text-sm text-gray-600">
                      Anonymize location data before transmission
                    </p>
                  </div>
                  <Switch
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">High Accuracy Mode</Label>
                    <p className="text-sm text-gray-600">
                      Uses more battery for better precision
                    </p>
                  </div>
                  <Switch
                    checked={highAccuracyMode}
                    onCheckedChange={setHighAccuracyMode}
                    disabled={isTracking}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Current Configuration</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Update Interval</Label>
                    <p>{highAccuracyMode ? '15' : '30'} seconds</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Accuracy Threshold</Label>
                    <p>{highAccuracyMode ? '50' : '100'} meters</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Batch Size</Label>
                    <p>3 positions</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Privacy Level</Label>
                    <p>{privacyMode ? 'High' : 'Standard'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Technical Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compression" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compression">Data Compression</TabsTrigger>
                  <TabsTrigger value="battery">Battery Saving</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy Features</TabsTrigger>
                </TabsList>

                <TabsContent value="compression" className="space-y-4">
                  <div className="text-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Coordinate Precision</p>
                        <p className="text-gray-600">Rounded to 5 decimal places (~11m precision)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Upload className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Batch Transmission</p>
                        <p className="text-gray-600">3-5 positions per request to reduce overhead</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="font-medium">Duplicate Filtering</p>
                        <p className="text-gray-600">Removes identical consecutive positions</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="battery" className="space-y-4">
                  <div className="text-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <Battery className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Adaptive Accuracy</p>
                        <p className="text-gray-600">Adjusts GPS precision based on movement</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Smart Intervals</p>
                        <p className="text-gray-600">30-second updates with exponential backoff</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <WifiOff className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="font-medium">Offline Queue</p>
                        <p className="text-gray-600">Local storage backup when offline</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4">
                  <div className="text-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Anonymous Tracking</p>
                        <p className="text-gray-600">No personal identifiers are collected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <EyeOff className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-medium">Data Anonymization</p>
                        <p className="text-gray-600">Location data is aggregated before storage</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Temporary Storage</p>
                        <p className="text-gray-600">Raw GPS data purged after aggregation</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}