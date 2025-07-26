"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  Phone, 
  MapPin, 
  Clock,
  Brain,
  Eye,
  Bell,
  CheckCircle2,
  Radio,
  CloudRain,
  Signal,
  Car,
  Users,
  Thermometer
} from "lucide-react"

interface SafetyAlert {
  id: string
  trainName: string
  trainId: string
  type: "collision_risk" | "panic_button" | "sensor_malfunction" | "weather_warning" | "signal_failure" | "speed_violation"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  location: string
  stationCode: string
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
  metadata?: {
    speed?: number
    temperature?: number
    passengerCount?: number
    visibility?: number
  }
}

interface CollisionPrediction {
  trainId: string
  trainName: string
  targetTrainId?: string
  targetTrainName?: string
  riskProbability: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  factors: string[]
  timestamp: string
  confidence: number
  estimatedTime?: string
}

const mockKarnatakaAlerts: SafetyAlert[] = [
  {
    id: "KA_001",
    trainName: "Karnataka Express",
    trainId: "KA_12628",
    type: "collision_risk",
    severity: "high",
    message: "High collision risk detected - Train approaching occupied block section at junction",
    location: "Bengaluru City Junction",
    stationCode: "SBC",
    timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
    status: "active",
    metadata: {
      speed: 68,
      passengerCount: 1247
    }
  },
  {
    id: "KA_002",
    trainName: "Mysuru Express",
    trainId: "KA_16022",
    type: "panic_button",
    severity: "critical",
    message: "Emergency panic button activated in coach S4 - Medical emergency reported",
    location: "Mysuru Junction",
    stationCode: "MYS",
    timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    status: "active",
    metadata: {
      passengerCount: 892
    }
  },
  {
    id: "KA_003",
    trainName: "Hampi Express",
    trainId: "KA_16591",
    type: "weather_warning",
    severity: "medium",
    message: "Heavy rainfall alert - Reduced visibility and track conditions affected",
    location: "Hospet Junction",
    stationCode: "HPT",
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    status: "acknowledged",
    metadata: {
      visibility: 30,
      temperature: 24
    }
  },
  {
    id: "KA_004",
    trainName: "Gol Gumbaz Express",
    trainId: "KA_17319",
    type: "signal_failure",
    severity: "high",
    message: "Signal system malfunction detected - Manual override in effect",
    location: "Vijayapura",
    stationCode: "BJP",
    timestamp: new Date(Date.now() - 450000).toISOString(), // 7.5 minutes ago
    status: "active"
  }
]

const mockKarnatakaPredictions: CollisionPrediction[] = [
  {
    trainId: "KA_12628",
    trainName: "Karnataka Express",
    targetTrainId: "KA_17326",
    targetTrainName: "Hubli Express",
    riskProbability: 0.72,
    riskLevel: "HIGH",
    factors: [
      "Both trains approaching Davangere junction simultaneously",
      "Signal delay causing schedule overlap",
      "Heavy passenger load affecting braking distance",
      "Monsoon conditions reducing track grip"
    ],
    timestamp: new Date(Date.now() - 60000).toISOString(),
    confidence: 0.89,
    estimatedTime: "6 minutes"
  },
  {
    trainId: "KA_16526",
    trainName: "Island Express",
    riskProbability: 0.34,
    riskLevel: "MEDIUM",
    factors: [
      "Track maintenance crew working ahead",
      "Speed restriction zone approaching",
      "Communication delay with control room"
    ],
    timestamp: new Date(Date.now() - 30000).toISOString(),
    confidence: 0.67
  },
  {
    trainId: "KA_16515",
    trainName: "Karwar Express",
    riskProbability: 0.18,
    riskLevel: "LOW",
    factors: [
      "Normal operating conditions",
      "Clear weather on coastal route",
      "On-time performance maintained"
    ],
    timestamp: new Date(Date.now() - 90000).toISOString(),
    confidence: 0.78
  }
]

export function SafetySection() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(mockKarnatakaAlerts)
  const [predictions, setPredictions] = useState<CollisionPrediction[]>(mockKarnatakaPredictions)
  const [systemStatus, setSystemStatus] = useState({
    aiModelOnline: true,
    sensorNetwork: 96,
    emergencyServices: "available" as "available" | "busy" | "offline"
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update predictions with slight variations
      setPredictions(prev => prev.map(p => ({
        ...p,
        riskProbability: Math.max(0.1, Math.min(0.9, p.riskProbability + (Math.random() - 0.5) * 0.1)),
        timestamp: new Date().toISOString()
      })))

      // Update system status
      setSystemStatus(prev => ({
        ...prev,
        sensorNetwork: Math.max(85, Math.min(100, prev.sensorNetwork + (Math.random() - 0.5) * 3))
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: "acknowledged" as const }
          : alert
      )
    )
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: "resolved" as const }
          : alert
      )
    )
  }

  const handleEmergencyCall = (alert: SafetyAlert) => {
    if (window.confirm(
      `🚨 INITIATE EMERGENCY RESPONSE 🚨\n\nTrain: ${alert.trainName}\nLocation: ${alert.location}\nIssue: ${alert.message}\n\nThis will contact emergency services immediately.\n\nConfirm emergency response?`
    )) {
      console.log(`🚨 Emergency response initiated for ${alert.trainName} at ${alert.location}`)
      setAlerts(prevAlerts =>
        prevAlerts.map(a => 
          a.id === alert.id 
            ? { ...a, status: "acknowledged" as const }
            : a
        )
      )
      
      // Simulate emergency response
      alert('Emergency services have been notified and are responding to the incident.')
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

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-50 border-green-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "high":
        return "bg-orange-50 border-orange-200"
      case "critical":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-700 bg-green-50 border-green-200"
      case "MEDIUM":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "HIGH":
        return "text-orange-700 bg-orange-50 border-orange-200"
      case "CRITICAL":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "collision_risk":
        return <Car className="h-4 w-4" />
      case "panic_button":
        return <Bell className="h-4 w-4" />
      case "sensor_malfunction":
        return <Radio className="h-4 w-4" />
      case "weather_warning":
        return <CloudRain className="h-4 w-4" />
      case "signal_failure":
        return <Signal className="h-4 w-4" />
      case "speed_violation":
        return <Zap className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  }

  const activeAlerts = alerts.filter(alert => alert.status === "active")
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === "critical")
  const acknowledgedAlerts = alerts.filter(alert => alert.status === "acknowledged")
  const resolvedAlerts = alerts.filter(alert => alert.status === "resolved")

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-semibold">
            🚨 CRITICAL SAFETY ALERT: {criticalAlerts.length} critical issue(s) require IMMEDIATE attention on Karnataka Railway network!
          </AlertDescription>
        </Alert>
      )}

      {/* System Status Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">AI Safety System</span>
                <div className={`w-2 h-2 rounded-full ${systemStatus.aiModelOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-sm">Sensors: {systemStatus.sensorNetwork}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-600" />
                <span className="text-sm capitalize">Emergency: {systemStatus.emergencyServices}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Karnataka Railway Network
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Safety Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-900">{resolvedAlerts.length}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </Card>
        <Card className="p-4 text-center">
          <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-900">{acknowledgedAlerts.length}</div>
          <div className="text-sm text-gray-600">Acknowledged</div>
        </Card>
        <Card className="p-4 text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-900">{activeAlerts.length}</div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </Card>
        <Card className="p-4 text-center">
          <Brain className="h-6 w-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-900">{predictions.length}</div>
          <div className="text-sm text-gray-600">AI Predictions</div>
        </Card>
        <Card className="p-4 text-center">
          <Zap className="h-6 w-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold text-red-900">{criticalAlerts.length}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Active Safety Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Active Safety Alerts
              <Badge variant="destructive" className="ml-auto">
                {activeAlerts.length} Active
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time safety alerts from Karnataka Railway network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <p className="font-medium text-green-800">All Systems Secure</p>
                <p className="text-sm">Karnataka Railway network operating normally</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 space-y-3 ${getSeverityBg(alert.severity)} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAlertIcon(alert.type)}
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-blue-700">{alert.trainName}</span>
                        <span className="text-xs text-gray-500">({alert.trainId})</span>
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location} ({alert.stationCode})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {alert.metadata?.speed && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Speed: {alert.metadata.speed} km/h
                          </span>
                        )}
                        {alert.metadata?.passengerCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.metadata.passengerCount} passengers
                          </span>
                        )}
                        {alert.metadata?.temperature && (
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {alert.metadata.temperature}°C
                          </span>
                        )}
                        {alert.metadata?.visibility && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Visibility: {alert.metadata.visibility}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        disabled={alert.status === "acknowledged"}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {alert.status === "acknowledged" ? "Acknowledged" : "Acknowledge"}
                      </Button>
                      {(alert.type === "panic_button" || alert.severity === "critical") && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleEmergencyCall(alert)}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Emergency
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
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
              <Brain className="h-5 w-5 text-blue-600" />
              AI Collision Risk Analysis
              <Badge variant="secondary" className="ml-auto">
                Live ML
              </Badge>
            </CardTitle>
            <CardDescription>
              Advanced AI collision prediction for Karnataka trains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <p className="font-medium">AI Monitoring Active</p>
                <p className="text-sm">No collision risks detected</p>
              </div>
            ) : (
              predictions.map((prediction) => (
                <div key={prediction.trainId} className={`border rounded-lg p-4 ${getRiskColor(prediction.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{prediction.trainName}</h4>
                      {prediction.targetTrainName && (
                        <p className="text-sm text-gray-600">
                          Potential conflict with <span className="font-medium">{prediction.targetTrainName}</span>
                        </p>
                      )}
                    </div>
                    <Badge className={`${getRiskColor(prediction.riskLevel)} font-semibold`}>
                      {prediction.riskLevel} RISK
                    </Badge>
                  </div>

                  {/* Risk Probability Meter */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Collision Probability</span>
                      <span className="font-bold">{(prediction.riskProbability * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={prediction.riskProbability * 100} 
                      className="h-3"
                    />
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span>AI Confidence: {(prediction.confidence * 100).toFixed(0)}%</span>
                      {prediction.estimatedTime && (
                        <span className="text-red-600 font-medium">
                          Critical in: {prediction.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <ul className="text-sm space-y-1">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t text-xs text-gray-600 flex items-center justify-between">
                    <span>Updated: {formatTimestamp(prediction.timestamp)}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                      {prediction.riskLevel === "HIGH" || prediction.riskLevel === "CRITICAL" ? (
                        <Button size="sm" variant="destructive">
                          <Bell className="h-3 w-3 mr-1" />
                          Alert Now
                        </Button>
                      ) : null}
                    </div>
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