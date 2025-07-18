"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Activity, Database, Wifi, Cpu } from "lucide-react"

interface SystemMetrics {
  status: "healthy" | "warning" | "critical"
  database: "connected" | "slow" | "disconnected"
  api: "operational" | "degraded" | "down"
  websocket: "connected" | "reconnecting" | "disconnected"
  aiModel: "active" | "loading" | "error"
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: string
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: "healthy",
    database: "connected",
    api: "operational",
    websocket: "connected",
    aiModel: "active",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    uptime: "2d 14h 32m",
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() * 6 - 3))),
        diskUsage: Math.max(50, Math.min(95, prev.diskUsage + (Math.random() * 2 - 1))),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
      case "operational":
      case "active":
        return "default"
      case "warning":
      case "slow":
      case "degraded":
      case "reconnecting":
      case "loading":
        return "secondary"
      case "critical":
      case "disconnected":
      case "down":
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getOverallStatus = () => {
    if (
      metrics.database === "disconnected" ||
      metrics.api === "down" ||
      metrics.aiModel === "error" ||
      metrics.cpuUsage > 85 ||
      metrics.memoryUsage > 90
    ) {
      return "critical"
    }
    if (
      metrics.database === "slow" ||
      metrics.api === "degraded" ||
      metrics.websocket === "reconnecting" ||
      metrics.cpuUsage > 70 ||
      metrics.memoryUsage > 80
    ) {
      return "warning"
    }
    return "healthy"
  }

  const overallStatus = getOverallStatus()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Activity className="h-4 w-4" />
          <Badge variant={getStatusColor(overallStatus)} className="capitalize">
            {overallStatus === "healthy" ? "All Systems Operational" : overallStatus}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0">
          <CardContent className="p-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-3">System Health</h4>

              {/* Service Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="text-sm">Database</span>
                  </div>
                  <Badge variant={getStatusColor(metrics.database)} className="text-xs">
                    {metrics.database}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">API Services</span>
                  </div>
                  <Badge variant={getStatusColor(metrics.api)} className="text-xs">
                    {metrics.api}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">WebSocket</span>
                  </div>
                  <Badge variant={getStatusColor(metrics.websocket)} className="text-xs">
                    {metrics.websocket}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm">AI Model</span>
                  </div>
                  <Badge variant={getStatusColor(metrics.aiModel)} className="text-xs">
                    {metrics.aiModel}
                  </Badge>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm">Resource Usage</h5>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className={metrics.cpuUsage > 80 ? "text-red-600" : ""}>{metrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metrics.cpuUsage > 80 ? "bg-red-500" : metrics.cpuUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${metrics.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className={metrics.memoryUsage > 85 ? "text-red-600" : ""}>{metrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metrics.memoryUsage > 85
                          ? "bg-red-500"
                          : metrics.memoryUsage > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${metrics.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Disk Usage</span>
                    <span className={metrics.diskUsage > 90 ? "text-red-600" : ""}>{metrics.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metrics.diskUsage > 90
                          ? "bg-red-500"
                          : metrics.diskUsage > 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${metrics.diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="pt-3 border-t text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>{metrics.uptime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
