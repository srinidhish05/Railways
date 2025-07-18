"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Activity, Zap, MapPin, Clock } from "lucide-react"
import { useFirebase } from "@/hooks/use-firebase"
import { EmergencyResponseModal } from "./emergency-response-modal"

interface SafetyAlert {
  id: string
  trainId: string
  trainName: string
  type: "collision_risk" | "panic_button" | "sensor_malfunction" | "weather_warning"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  location: {
    latitude: number
    longitude: number
    stationName: string
  }
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
}

interface CollisionPrediction {
  trainId: string
  trainName: string
  riskProbability: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  factors: string[]
  timestamp: string
}

export function SafetyDashboard() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([])
  const [predictions, setPredictions] = useState<CollisionPrediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { subscribeToSafetyAlerts, subscribeToCollisionPredictions, acknowledgeAlert } = useFirebase()

  useEffect(() => {
    const unsubscribeAlerts = subscribeToSafetyAlerts((alertsData) => {
      setAlerts(alertsData)
      setIsLoading(false)
    })

    const unsubscribePredictions = subscribeToCollisionPredictions((predictionsData) => {
      setPredictions(predictionsData)
    })

    return () => {
      unsubscribeAlerts()
      unsubscribePredictions()
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "default"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-600 bg-green-50 border-green-200"
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const result = await acknowledgeAlert(alertId)
      if (result.success) {
        // Update local state to reflect the acknowledgment
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)),
        )
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error)
      // You could add a toast notification here
    }
  }

  const handleEmergencyCall = async (alert: SafetyAlert) => {
    try {
      // In a real implementation, this would initiate an emergency call
      console.log(`Initiating emergency call for ${alert.trainName} - ${alert.message}`)

      // You could integrate with a calling service here
      // For demo purposes, we'll show an alert
      if (
        window.confirm(
          `Initiate emergency call for ${alert.trainName}?\n\nLocation: ${alert.location.stationName}\nIssue: ${alert.message}`,
        )
      ) {
        // Mark as acknowledged and add call timestamp
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) =>
            a.id === alert.id ? { ...a, status: "acknowledged" as const, callInitiated: new Date().toISOString() } : a,
          ),
        )
      }
    } catch (error) {
      console.error("Error initiating emergency call:", error)
    }
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "critical")

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL ALERT:</strong> {criticalAlerts.length} critical safety issue(s) require immediate
            attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Safety Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.filter((a) => a.status === "resolved").length}</p>
                <p className="text-sm text-gray-600">Resolved Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{predictions.length}</p>
                <p className="text-sm text-gray-600">AI Predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalAlerts.length}</p>
                <p className="text-sm text-gray-600">Critical Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Safety Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Safety Alerts
            </CardTitle>
            <CardDescription>Real-time safety alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>All systems operating normally</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                        <span className="text-sm text-gray-600">{alert.trainName}</span>
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location.stationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        disabled={alert.status === "acknowledged"}
                      >
                        {alert.status === "acknowledged" ? "Acknowledged" : "Acknowledge"}
                      </Button>
                      {alert.type === "panic_button" && (
                        <EmergencyResponseModal
                          alert={alert}
                          onEmergencyCall={handleEmergencyCall}
                          onAcknowledge={handleAcknowledgeAlert}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* AI Collision Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Collision Predictions
            </CardTitle>
            <CardDescription>Real-time collision risk analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <p>No active predictions</p>
              </div>
            ) : (
              predictions.map((prediction) => (
                <div key={prediction.trainId} className={`border rounded-lg p-4 ${getRiskColor(prediction.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{prediction.trainName}</h4>
                    <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel} RISK</Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Risk Probability</span>
                      <span className="font-semibold">{(prediction.riskProbability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          prediction.riskLevel === "HIGH"
                            ? "bg-red-500"
                            : prediction.riskLevel === "MEDIUM"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${prediction.riskProbability * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <ul className="text-sm space-y-1">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                    Last updated: {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
