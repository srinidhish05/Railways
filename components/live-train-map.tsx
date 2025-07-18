"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Zap, Clock, Users, AlertTriangle, Maximize2, Minimize2, RotateCcw, Train } from "lucide-react"
import { useTrainDataStore } from "@/lib/api-client"

interface TrainLocation {
  id: string
  name: string
  trainNumber: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  status: "on-time" | "delayed" | "stopped"
  delay: number
  occupancy: number
  currentStation: string
  nextStation: string
  destination: string
  lastUpdated: string
}

interface Station {
  id: string
  name: string
  code: string
  latitude: number
  longitude: number
  type: "major" | "junction" | "regular"
}

interface LiveTrainMapProps {
  trainId?: string
  initialCenter?: { lat: number; lng: number }
  zoom?: number
  height?: string
  showControls?: boolean
  showStations?: boolean
  onTrainSelect?: (train: TrainLocation) => void
  className?: string
}

const karnatakaStations: Station[] = [
  { id: "SBC", name: "KSR Bengaluru City Junction", code: "SBC", latitude: 12.9716, longitude: 77.5946, type: "major" },
  { id: "YPR", name: "Yesvantpur Junction", code: "YPR", latitude: 13.022, longitude: 77.5385, type: "major" },
  { id: "MYS", name: "Mysuru Junction", code: "MYS", latitude: 12.2958, longitude: 76.6394, type: "major" },
  { id: "UBL", name: "Hubballi Junction", code: "UBL", latitude: 15.3173, longitude: 75.7139, type: "major" },
  { id: "BGM", name: "Belagavi", code: "BGM", latitude: 15.8497, longitude: 74.4977, type: "junction" },
  { id: "MAJN", name: "Mangaluru Junction", code: "MAJN", latitude: 12.8697, longitude: 74.842, type: "major" },
  { id: "ASK", name: "Arsikere Junction", code: "ASK", latitude: 13.2167, longitude: 76.15, type: "junction" },
  { id: "DVG", name: "Davangere", code: "DVG", latitude: 14.4667, longitude: 75.9167, type: "regular" },
  { id: "TK", name: "Tumakuru", code: "TK", latitude: 13.3449, longitude: 77.7085, type: "regular" },
]

export function LiveTrainMap({
  trainId,
  initialCenter = { lat: 13.0827, lng: 77.5877 },
  zoom = 7,
  height = "400px",
  showControls = true,
  showStations = true,
  onTrainSelect,
  className = "",
}: LiveTrainMapProps) {
  const { trains: storeTrains, isConnected, connectionType, error: storeError, connect } = useTrainDataStore()
  const [selectedTrain, setSelectedTrain] = useState<TrainLocation | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapCenter, setMapCenter] = useState(initialCenter)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)

  const displayTrains = trainId ? storeTrains.filter((train) => train.trainNumber === trainId) : storeTrains

  useEffect(() => {
    connect()
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [connect])

  useEffect(() => {
    if (selectedTrain) {
      setMapCenter({ lat: selectedTrain.latitude, lng: selectedTrain.longitude })
      setMapZoom(10)
    } else {
      setMapCenter(initialCenter)
      setMapZoom(zoom)
    }
  }, [selectedTrain, initialCenter, zoom])

  const handleTrainClick = useCallback(
    (train: TrainLocation) => {
      setSelectedTrain(train)
      onTrainSelect?.(train)
    },
    [onTrainSelect],
  )

  const resetMapView = () => {
    setSelectedTrain(null)
    setMapCenter(initialCenter)
    setMapZoom(zoom)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-500"
      case "delayed":
        return "bg-red-500"
      case "stopped":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStationColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-blue-600"
      case "junction":
        return "bg-purple-500"
      default:
        return "bg-gray-400"
    }
  }

  if (storeError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{storeError}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={`${isFullscreen ? "fixed inset-0 z-50" : ""} ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Live Train Tracking - Karnataka
            {trainId && <Badge variant="outline">Train {trainId}</Badge>}
          </CardTitle>

          {showControls && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetMapView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden border-t"
          style={{ height: isFullscreen ? "calc(100vh - 120px)" : height }}
        >
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading live train positions...</p>
              </div>
            </div>
          )}

          {/* Stations */}
          {showStations &&
            !isLoading &&
            karnatakaStations.map((station) => (
              <div
                key={station.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${((station.longitude - 74) / 4) * 100}%`,
                  top: `${((16 - station.latitude) / 4) * 100}%`,
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full ${getStationColor(station.type)} border-2 border-white shadow-lg transition-transform group-hover:scale-125`}
                />
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {station.name} ({station.code})
                </div>
              </div>
            ))}

          {/* Trains */}
          {!isLoading &&
            displayTrains.map((train) => (
              <div
                key={train.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${((train.longitude - 74) / 4) * 100}%`,
                  top: `${((16 - train.latitude) / 4) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${train.heading}deg)`,
                }}
                onClick={() => handleTrainClick(train)}
              >
                <div
                  className={`relative w-6 h-6 rounded-full ${getStatusColor(train.status)} border-2 border-white shadow-lg transition-all group-hover:scale-125`}
                >
                  <Train className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

                  {train.speed > 0 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 py-0.5 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {Math.round(train.speed)} km/h
                    </div>
                  )}

                  {train.speed > 0 && (
                    <div
                      className="absolute w-8 h-1 bg-gradient-to-r from-transparent to-blue-400 opacity-60 -z-10"
                      style={{ left: "-32px", top: "50%", transform: "translateY(-50%)" }}
                    />
                  )}
                </div>

                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {train.name} ({train.trainNumber})
                </div>
              </div>
            ))}

          {/* Train Info Panel */}
          {selectedTrain && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900">{selectedTrain.name}</h3>
                <Badge className={`${getStatusColor(selectedTrain.status)} text-white`}>
                  {selectedTrain.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Train {selectedTrain.trainNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>
                    At: <strong>{selectedTrain.currentStation}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>
                    Next: <strong>{selectedTrain.nextStation}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>
                    Speed: <strong>{Math.round(selectedTrain.speed)} km/h</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span>
                    Delay: <strong>{selectedTrain.delay} minutes</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>
                    Occupancy: <strong>{Math.round(selectedTrain.occupancy)}%</strong>
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Destination: {selectedTrain.destination}</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(selectedTrain.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
            <h4 className="font-medium mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>On Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Delayed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Stopped</span>
              </div>
              {showStations && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div>
                    <span>Major Station</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div>
                    <span>Junction</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE ({isConnected ? connectionType.toUpperCase() : "OFFLINE"})
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
