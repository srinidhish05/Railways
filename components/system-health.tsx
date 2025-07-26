"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, 
  Database, 
  Wifi, 
  Cpu, 
  HardDrive,
  Memory,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Globe,
  Radio,
  Brain
} from "lucide-react"

interface SystemMetrics {
  status: "healthy" | "warning" | "critical"
  database: "connected" | "slow" | "disconnected"
  api: "operational" | "degraded" | "down"
  websocket: "connected" | "reconnecting" | "disconnected"
  aiModel: "active" | "loading" | "error"
  railwayNetwork: "online" | "partial" | "offline"
  ticketingSystem: "operational" | "maintenance" | "down"
  signalSystem: "active" | "degraded" | "failure"
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  uptime: string
  lastHealthCheck: string
  activeConnections: number
  processedTickets: number
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: "healthy",
    database: "connected",
    api: "operational",
    websocket: "connected",
    aiModel: "active",
    railwayNetwork: "online",
    ticketingSystem: "operational",
    signalSystem: "active",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLatency: 23,
    uptime: "2d 14h 32m",
    lastHealthCheck: new Date().toISOString(),
    activeConnections: 1247,
    processedTickets: 15679
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() * 6 - 3))),
        diskUsage: Math.max(50, Math.min(95, prev.diskUsage + (Math.random() * 2 - 1))),
        networkLatency: Math.max(5, Math.min(200, prev.networkLatency + (Math.random() * 20 - 10))),
        lastHealthCheck: new Date().toISOString(),
        activeConnections: Math.max(800, Math.min(2000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100))),
        processedTickets: prev.processedTickets + Math.floor(Math.random() * 5)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simulate service status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const services = ['database', 'api', 'websocket', 'aiModel', 'railwayNetwork', 'ticketingSystem', 'signalSystem']
      const randomService = services[Math.floor(Math.random() * services.length)]
      
      // 95% chance to stay healthy, 5% chance for issues
      if (Math.random() > 0.95) {
        setMetrics(prev => {
          const newMetrics = { ...prev }
          switch (randomService) {
            case 'database':
              newMetrics.database = Math.random() > 0.5 ? 'slow' : 'connected'
              break
            case 'api':
              newMetrics.api = Math.random() > 0.7 ? 'degraded' : 'operational'
              break
            case 'websocket':
              newMetrics.websocket = Math.random() > 0.8 ? 'reconnecting' : 'connected'
              break
            case 'railwayNetwork':
              newMetrics.railwayNetwork = Math.random() > 0.9 ? 'partial' : 'online'
              break
          }
          return newMetrics
        })
        
        // Auto-recover after 10 seconds
        setTimeout(() => {
          setMetrics(prev => ({
            ...prev,
            database: 'connected',
            api: 'operational',
            websocket: 'connected',
            railwayNetwork: 'online',
            ticketingSystem: 'operational',
            signalSystem: 'active'
          }))
        }, 10000)
      }
    }, 30000)

    return () => clearInterval(statusInterval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
      case "operational":
      case "active":
      case "online":
        return "default"
      case "warning":
      case "slow":
      case "degraded":
      case "reconnecting":
      case "loading":
      case "partial":
      case "maintenance":
        return "secondary"
      case "critical":
      case "disconnected":
      case "down":
      case "error":
      case "offline":
      case "failure":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
      case "operational":
      case "active":
      case "online":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "warning":
      case "slow":
      case "degraded":
      case "reconnecting":
      case "loading":
      case "partial":
      case "maintenance":
        return <AlertTriangle className="h-3 w-3 text-yellow-600" />
      case "critical":
      case "disconnected":
      case "down":
      case "error":
      case "offline":
      case "failure":
        return <XCircle className="h-3 w-3 text-red-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const getOverallStatus = () => {
    if (
      metrics.database === "disconnected" ||
      metrics.api === "down" ||
      metrics.aiModel === "error" ||
      metrics.railwayNetwork === "offline" ||
      metrics.signalSystem === "failure" ||
      metrics.cpuUsage > 85 ||
      metrics.memoryUsage > 90
    ) {
      return "critical"
    }
    if (
      metrics.database === "slow" ||
      metrics.api === "degraded" ||
      metrics.websocket === "reconnecting" ||
      metrics.railwayNetwork === "partial" ||
      metrics.ticketingSystem === "maintenance" ||
      metrics.signalSystem === "degraded" ||
      metrics.cpuUsage > 70 ||
      metrics.memoryUsage > 80 ||
      metrics.networkLatency > 100
    ) {
      return "warning"
    }
    return "healthy"
  }

  const overallStatus = getOverallStatus()

  const getResourceColor = (usage: number, type: 'cpu' | 'memory' | 'disk' | 'network') => {
    const thresholds = {
      cpu: { warning: 60, critical: 80 },
      memory: { warning: 70, critical: 85 },
      disk: { warning: 75, critical: 90 },
      network: { warning: 50, critical: 100 }
    }
    
    const threshold = thresholds[type]
    if (usage > threshold.critical) return "bg-red-500"
    if (usage > threshold.warning) return "bg-yellow-500"
    return "bg-green-500"
  }

  const formatUptime = (uptime: string) => {
    return uptime
  }

  const formatLastCheck = (timestamp: string) => {
    const now = new Date()
    const checked = new Date(timestamp)
    const diffSeconds = Math.floor((now.getTime() - checked.getTime()) / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Activity className="h-4 w-4" />
          <Badge variant={getStatusColor(overallStatus)} className="capitalize">
            {overallStatus === "healthy" ? "All Systems Operational" : 
             overallStatus === "warning" ? "System Warning" : "Critical Alert"}
          </Badge>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            overallStatus === "healthy" ? "bg-green-500" : 
            overallStatus === "warning" ? "bg-yellow-500" : "bg-red-500"
          }`} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Karnataka Railway System Health
            </CardTitle>
            <div className="text-sm text-gray-600">
              Real-time monitoring & diagnostics
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(overallStatus)}
                <span className="font-medium">System Status</span>
              </div>
              <Badge variant={getStatusColor(overallStatus)} className="capitalize">
                {overallStatus === "healthy" ? "Operational" : overallStatus}
              </Badge>
            </div>

            {/* Core Services */}
            <div>
              <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Server className="h-4 w-4" />
                Core Services
              </h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="text-sm">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.database)}
                    <Badge variant={getStatusColor(metrics.database)} className="text-xs">
                      {metrics.database}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">API Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.api)}
                    <Badge variant={getStatusColor(metrics.api)} className="text-xs">
                      {metrics.api}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">WebSocket</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.websocket)}
                    <Badge variant={getStatusColor(metrics.websocket)} className="text-xs">
                      {metrics.websocket}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm">AI Model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.aiModel)}
                    <Badge variant={getStatusColor(metrics.aiModel)} className="text-xs">
                      {metrics.aiModel}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Railway-Specific Services */}
            <div>
              <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Railway Systems
              </h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4" />
                    <span className="text-sm">Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.railwayNetwork)}
                    <Badge variant={getStatusColor(metrics.railwayNetwork)} className="text-xs">
                      {metrics.railwayNetwork}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Ticketing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.ticketingSystem)}
                    <Badge variant={getStatusColor(metrics.ticketingSystem)} className="text-xs">
                      {metrics.ticketingSystem}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metrics.signalSystem)}
                    <Badge variant={getStatusColor(metrics.signalSystem)} className="text-xs">
                      {metrics.signalSystem}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div>
              <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Resource Usage
              </h5>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      CPU Usage
                    </span>
                    <span className={metrics.cpuUsage > 80 ? "text-red-600 font-medium" : ""}>
                      {Math.round(metrics.cpuUsage)}%
                    </span>
                  </div>
                  <Progress value={metrics.cpuUsage} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Memory className="h-3 w-3" />
                      Memory
                    </span>
                    <span className={metrics.memoryUsage > 85 ? "text-red-600 font-medium" : ""}>
                      {Math.round(metrics.memoryUsage)}%
                    </span>
                  </div>
                  <Progress value={metrics.memoryUsage} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      Disk Usage
                    </span>
                    <span className={metrics.diskUsage > 90 ? "text-red-600 font-medium" : ""}>
                      {Math.round(metrics.diskUsage)}%
                    </span>
                  </div>
                  <Progress value={metrics.diskUsage} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      Network Latency
                    </span>
                    <span className={metrics.networkLatency > 100 ? "text-red-600 font-medium" : ""}>
                      {Math.round(metrics.networkLatency)}ms
                    </span>
                  </div>
                  <Progress value={Math.min(100, (metrics.networkLatency / 200) * 100)} className="h-2" />
                </div>
              </div>
            </div>

            {/* System Statistics */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">
                  {metrics.activeConnections.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Active Connections</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-900">
                  {metrics.processedTickets.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Processed Tickets</div>
              </div>
            </div>

            {/* System Info */}
            <div className="pt-3 border-t text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>System Uptime:</span>
                <span className="font-medium">{formatUptime(metrics.uptime)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Health Check:</span>
                <span className="font-medium">{formatLastCheck(metrics.lastHealthCheck)}</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="font-medium">Karnataka Railway Production</span>
              </div>
            </div>

            {/* Critical Alert */}
            {overallStatus === "critical" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Critical System Alert
                </div>
                <p className="text-red-700 text-xs mt-1">
                  One or more critical services are experiencing issues. 
                  Immediate attention required.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}