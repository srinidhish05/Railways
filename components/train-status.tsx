"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Train, Clock, MapPin, Users, Thermometer, Gauge } from "lucide-react"
import { useFirebase } from "@/hooks/use-firebase"

interface TrainRealTimeData {
  id: string
  name: string
  currentLocation: {
    latitude: number
    longitude: number
    stationName: string
  }
  speed: number
  occupancy: number
  temperature: number
  humidity: number
  nextStation: string
  estimatedArrival: string
  delay: number
  status: "on-time" | "delayed" | "stopped"
}

export function TrainStatus() {
  const [trainData, setTrainData] = useState<TrainRealTimeData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { subscribeToRealTimeData } = useFirebase()

  useEffect(() => {
    const unsubscribe = subscribeToRealTimeData((data) => {
      setTrainData(data)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainData.map((train) => (
          <Card key={train.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5" />
                  {train.name}
                </CardTitle>
                <Badge variant={getStatusColor(train.status)}>{train.status}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {train.currentLocation.stationName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Speed and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Speed</p>
                    <p className="font-semibold">{train.speed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Next Station</p>
                    <p className="text-sm font-semibold text-sm">{train.nextStation}</p>
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
                  <span className="text-sm font-semibold">{train.occupancy}%</span>
                </div>
                <Progress
                  value={train.occupancy}
                  className="h-2"
                  // @ts-ignore
                  style={{ "--progress-background": getOccupancyColor(train.occupancy) }}
                />
              </div>

              {/* Environmental Data */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-sm font-semibold">{train.temperature}°C</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="text-sm font-semibold">{train.humidity}%</p>
                </div>
              </div>

              {/* Delay Information */}
              {train.delay > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Delayed by {train.delay} minutes
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">ETA: {train.estimatedArrival}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
