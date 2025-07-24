"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  MapPin, 
  Clock,
  Phone,
  Eye,
  Brain,
  Waves,
  Radio,
  Car,
  CloudRain,
  Wind,
  Thermometer,
  Signal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Bell,
  Settings,
  Users,
  TrendingUp,
  Download,
  Share2
} from "lucide-react"

interface SafetyAlert {
  id: string
  trainId: string
  trainName: string
  type: "collision_risk" | "panic_button" | "sensor_malfunction" | "weather_warning" | "signal_failure" | "track_obstruction" | "speed_violation" | "unauthorized_access"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  location: {
    latitude: number
    longitude: number
    stationName: string
    trackSection: string
  }
  timestamp: string
  status: "active" | "acknowledged" | "resolved" | "escalated"
  assignedTo?: string
  responseTime?: number
  metadata?: {
    speed?: number
    temperature?: number
    visibility?: number
    passengerCount?: number
  }
}

interface CollisionPrediction {
  id: string
  trainId: string
  trainName: string
  targetTrainId?: string
  targetTrainName?: string
  riskProbability: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  factors: string[]
  timestamp: string
  estimatedCollisionTime?: string
  preventionActions: string[]
  confidence: number
}

interface SystemHealth {
  aiModelStatus: "online" | "offline" | "degraded"
  sensorNetwork: number // percentage
  communicationLinks: number // percentage
  emergencyServices: "available" | "busy" | "unavailable"
  lastHealthCheck: string
}

const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: "alert_001",
    trainId: "KA_12628",
    trainName: "Karnataka Express",
    type: "collision_risk",
    severity: "critical",
    message: "High collision risk detected - Train approaching occupied block section",
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      stationName: "Bengaluru City Junction",
      trackSection: "Block-A7"
    },
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: "active",
    metadata: {
      speed: 65,
      passengerCount: 847
    }
  },
  {
    id: "alert_002",
    trainId: "KA_16022",
    trainName: "Kaveri Express",
    type: "panic_button",
    severity: "high",
    message: "Emergency panic button activated in coach S3",
    location: {
      latitude: 12.3095,
      longitude: 76.6550,
      stationName: "Mysuru Junction",
      trackSection: "Platform-2"
    },
    timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    status: "acknowledged",
    assignedTo: "Control Room - Station Master",
    responseTime: 45
  },
  {
    id: "alert_003",
    trainId: "KA_16515",
    trainName: "Karwar Express",
    type: "weather_warning",
    severity: "medium",
    message: "Heavy rainfall detected - Reduced visibility conditions",
    location: {
      latitude: 14.8197,
      longitude: 74.1282,
      stationName: "Karwar",
      trackSection: "Coastal-Section-12"
    },
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    status: "active",
    metadata: {
      visibility: 25,
      temperature: 28
    }
  }
]

const mockCollisionPredictions: CollisionPrediction[] = [
  {
    id: "pred_001",
    trainId: "KA_12628",
    trainName: "Karnataka Express",
    targetTrainId: "KA_17326",
    targetTrainName: "Hubli Express",
    riskProbability: 0.78,
    riskLevel: "HIGH",
    factors: [
      "Signal delay at junction ahead",
      "Both trains approaching same track section",
      "Weather reducing braking efficiency",
      "High passenger load affecting braking distance"
    ],
    timestamp: new Date().toISOString(),
    estimatedCollisionTime: new Date(Date.now() + 420000).toISOString(), // 7 minutes from now
    preventionActions: [
      "Reduce speed to 40 km/h immediately",
      "Hold Karnataka Express at next signal",
      "Clear alternate route for Hubli Express",
      "Alert both train operators"
    ],
    confidence: 0.92
  },
  {
    id: "pred_002",
    trainId: "KA_16526",
    trainName: "Island Express",
    riskProbability: 0.35,
    riskLevel: "MEDIUM",
    factors: [
      "Track maintenance crew ahead",
      "Speed restriction in effect",
      "Communication delay with ground control"
    ],
    timestamp: new Date().toISOString(),
    preventionActions: [
      "Maintain current speed limits",
      "Establish direct communication with crew",
      "Monitor track clearance status"
    ],
    confidence: 0.67
  }
]

export function SafetyDashboard() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(mockSafetyAlerts)
  const [predictions, setPredictions] = useState<CollisionPrediction[]>(mockCollisionPredictions)
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    aiModelStatus: "online",
    sensorNetwork: 94,
    communicationLinks: 98,
    emergencyServices: "available",
    lastHealthCheck: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")

  // Simulate real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate system health updates
        setSystemHealth(prev => ({
          ...prev,
          sensorNetwork: Math.max(85, Math.min(100, prev.sensorNetwork + (Math.random() - 0.5) * 5)),
          communicationLinks: Math.max(90, Math.min(100, prev.communicationLinks + (Math.random() - 0.5) * 3)),
          lastHealthCheck: new Date().toISOString()
        }))

        // Simulate prediction updates
        setPredictions(prev => prev.map(p => ({
          ...p,
          riskProbability: Math.max(0.1, Math.min(0.9, p.riskProbability + (Math.random() - 0.5) * 0.1)),
          timestamp: new Date().toISOString()
        })))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const handleAcknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: "acknowledged" as const, responseTime: Math.floor(Math.random() * 120) + 30 }
        : alert
    ))
  }

  const handleResolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: "resolved" as const }
        : alert
    ))
  }

  const handleEmergencyCall = async (alert: SafetyAlert) => {
    if (window.confirm(
      `Initiate emergency response for ${alert.trainName}?\n\nLocation: ${alert.location.stationName}\nIssue: ${alert.message}`
    )) {
      setAlerts(prev => prev.map(a => 
        a.id === alert.id 
          ? { ...a, status: "escalated" as const, assignedTo: "Emergency Response Team" }
          : a
      ))
    }
  }

  const activeAlerts = alerts.filter(alert => alert.status === "active")
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === "critical")
  const acknowledgedAlerts = alerts.filter(alert => alert.status === "acknowledged")
  const resolvedAlerts = alerts.filter(alert => alert.status === "resolved")

  const averageResponseTime = acknowledgedAlerts.length > 0 
    ? acknowledgedAlerts.reduce((sum, alert) => sum + (alert.responseTime || 0), 0) / acknowledgedAlerts.length
    : 0

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-semibold">
            🚨 CRITICAL SAFETY ALERT: {criticalAlerts.length} critical issue(s) require IMMEDIATE attention!
          </AlertDescription>
        </Alert>
      )}

      {/* System Health Overview */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Railway Safety Command Center
            <Badge variant="secondary" className="ml-auto">
              Live Monitoring
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered safety monitoring with real-time threat detection and response coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">AI Model</span>
                  <div className={`w-2 h-2 rounded-full ${systemHealth.aiModelStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                </div>
                <div className="text-xs text-gray-600 capitalize">{systemHealth.aiModelStatus}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Waves className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-sm font-medium">Sensor Network</div>
                <div className="text-xs text-gray-600">{systemHealth.sensorNetwork}% Active</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Radio className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-sm font-medium">Communication</div>
                <div className="text-xs text-gray-600">{systemHealth.communicationLinks}% Online</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-sm font-medium">Emergency Services</div>
                <div className="text-xs text-gray-600 capitalize">{systemHealth.emergencyServices}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-900">{resolvedAlerts.length}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </Card>
        <Card className="p-4 text-center">
          <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-900">{activeAlerts.length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="p-4 text-center">
          <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold text-red-900">{criticalAlerts.length}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </Card>
        <Card className="p-4 text-center">
          <Brain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-900">{predictions.length}</div>
          <div className="text-sm text-gray-600">AI Predictions</div>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-900">{averageResponseTime.toFixed(0)}s</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
          <div className="text-2xl font-bold text-indigo-900">98.5%</div>
          <div className="text-sm text-gray-600">Safety Score</div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
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
              Real-time safety alerts requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <p className="font-medium">All Systems Secure</p>
                <p className="text-sm">No active safety alerts detected</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAlertIcon(alert.type)}
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-blue-700">{alert.trainName}</span>
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location.stationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {alert.metadata?.speed && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {alert.metadata.speed} km/h
                          </span>
                        )}
                        {alert.metadata?.passengerCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.metadata.passengerCount} passengers
                          </span>
                        )}
                      </div>
                      {alert.assignedTo && (
                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Assigned to: {alert.assignedTo}
                        </div>
                      )}
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
                      {alert.severity === "critical" && (
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
              AI Collision Predictions
              <Badge variant="secondary" className="ml-auto">
                ML Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Advanced AI system analyzing collision risks in real-time
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
                <div key={prediction.id} className={`border rounded-lg p-4 ${getRiskColor(prediction.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{prediction.trainName}</h4>
                      {prediction.targetTrainName && (
                        <p className="text-sm text-gray-600">vs {prediction.targetTrainName}</p>
                      )}
                    </div>
                    <Badge className={`${getRiskColor(prediction.riskLevel)} font-semibold`}>
                      {prediction.riskLevel} RISK
                    </Badge>
                  </div>

                  {/* Risk Probability */}
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
                      {prediction.estimatedCollisionTime && (
                        <span className="text-red-600 font-medium">
                          ETA: {new Date(prediction.estimatedCollisionTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <ul className="text-sm space-y-1">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-current flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention Actions */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                    <ul className="text-sm space-y-1">
                      {prediction.preventionActions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Updated: {new Date(prediction.timestamp).toLocaleTimeString()}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Bell className="h-3 w-3 mr-1" />
                        Alert Operators
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </Button>
            
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Dashboard
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Status
            </Button>

            <div className="ml-auto text-sm text-gray-600">
              Last updated: {new Date(systemHealth.lastHealthCheck).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}