"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Activity, Zap, Phone, MapPin, Clock } from "lucide-react"
import { useState } from "react"

const mockAlerts = [
  {
    id: "1",
    trainName: "Express 2024",
    type: "collision_risk",
    severity: "medium",
    message: "Obstacle detected 500m ahead - automatic braking initiated",
    location: "Mumbai Central",
    timestamp: "2 minutes ago",
    status: "active",
  },
  {
    id: "2",
    trainName: "Rajdhani Express",
    type: "panic_button",
    severity: "high",
    message: "Emergency panic button activated in coach B2",
    location: "New Delhi",
    timestamp: "5 minutes ago",
    status: "active",
  },
]

const mockPredictions = [
  {
    trainId: "1",
    trainName: "Express 2024",
    riskProbability: 0.25,
    riskLevel: "MEDIUM",
    factors: ["High speed in curve section", "Weather conditions: light rain"],
    timestamp: "Just now",
  },
  {
    trainId: "2",
    trainName: "Rajdhani Express",
    riskProbability: 0.15,
    riskLevel: "LOW",
    factors: ["Normal operating conditions", "Clear weather"],
    timestamp: "1 minute ago",
  },
]

export function SafetySection() {
  const [alerts, setAlerts] = useState(mockAlerts)

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)),
    )
  }

  const handleEmergencyCall = (alert: any) => {
    if (
      window.confirm(
        `Initiate emergency call for ${alert.trainName}?\n\nLocation: ${alert.location}\nIssue: ${alert.message}`,
      )
    ) {
      console.log(`Emergency call initiated for ${alert.trainName}`)
      setAlerts((prevAlerts) =>
        prevAlerts.map((a) => (a.id === alert.id ? { ...a, status: "acknowledged" as const } : a)),
      )
    }
  }

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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">{mockPredictions.length}</p>
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
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
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
                        <Button size="sm" variant="destructive" onClick={() => handleEmergencyCall(alert)}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
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
            {mockPredictions.map((prediction) => (
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

                <div className="mt-3 pt-3 border-t text-xs text-gray-600">Last updated: {prediction.timestamp}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
