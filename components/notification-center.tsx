"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell, AlertTriangle, Info, CheckCircle, X, Train, Clock, 
  MapPin, Users, Zap, Shield, Settings, Volume2, VolumeX,
  Filter, Trash2, Archive
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success" | "critical"
  category: "safety" | "delay" | "booking" | "system" | "weather" | "maintenance"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high" | "critical"
  trainNumber?: string
  stationCode?: string
  pnr?: string
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "critical",
    category: "safety",
    title: "EMERGENCY: Signal Failure",
    message: "Red signal malfunction at KSR Bengaluru - all trains halted immediately",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    priority: "critical",
    stationCode: "SBC",
    actionRequired: true
  },
  {
    id: "2",
    type: "warning",
    category: "delay",
    title: "Train Delay Alert",
    message: "Karnataka Express is delayed by 25 minutes due to track maintenance",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    trainNumber: "12628",
    stationCode: "MYS"
  },
  {
    id: "3",
    type: "error",
    category: "safety",
    title: "Collision Avoidance Activated",
    message: "AI system prevented potential collision - Express 16535 emergency braked",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    read: false,
    priority: "critical",
    trainNumber: "16535",
    actionRequired: true
  },
  {
    id: "4",
    type: "success",
    category: "booking",
    title: "Ticket Confirmed",
    message: "Your booking for Mysuru Varanasi Express has been confirmed",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: true,
    priority: "medium",
    trainNumber: "17309",
    pnr: "PNR123456789"
  },
  {
    id: "5",
    type: "warning",
    category: "weather",
    title: "Weather Alert",
    message: "Heavy rainfall expected - potential delays on Konkan Railway routes",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    priority: "medium",
    stationCode: "MAO"
  },
  {
    id: "6",
    type: "info",
    category: "system",
    title: "System Maintenance",
    message: "AI collision prediction model updated to v3.2 - improved accuracy by 15%",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    priority: "low"
  },
  {
    id: "7",
    type: "warning",
    category: "maintenance",
    title: "Track Maintenance Scheduled",
    message: "Platform 3 at Hubballi Junction closed for maintenance (22:00-06:00)",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    stationCode: "UBL"
  }
]

interface NotificationSettings {
  soundEnabled: boolean
  showCritical: boolean
  showSafety: boolean
  showDelays: boolean
  showBookings: boolean
  showSystem: boolean
  showWeather: boolean
  showMaintenance: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [settings, setSettings] = useState<NotificationSettings>({
    soundEnabled: true,
    showCritical: true,
    showSafety: true,
    showDelays: true,
    showBookings: true,
    showSystem: false,
    showWeather: true,
    showMaintenance: true
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critical" && !n.read).length

  // Play notification sound for critical alerts
  useEffect(() => {
    if (settings.soundEnabled && criticalCount > 0) {
      // In a real app, you'd play an actual sound file
      console.log("🚨 Critical railway alert sound would play here")
    }
  }, [criticalCount, settings.soundEnabled])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getIcon = (notification: Notification) => {
    if (notification.category === "safety") {
      return <Shield className="h-4 w-4 text-red-500" />
    }
    if (notification.category === "delay") {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
    if (notification.category === "booking") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (notification.category === "maintenance") {
      return <Settings className="h-4 w-4 text-orange-500" />
    }
    if (notification.category === "weather") {
      return <Zap className="h-4 w-4 text-blue-500" />
    }

    switch (notification.type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 border-red-200"
      case "high": return "bg-orange-100 border-orange-200"
      case "medium": return "bg-yellow-100 border-yellow-200"
      default: return "bg-blue-50 border-blue-200"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filterCategory === "all") return true
    return notification.category === filterCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safety": return <Shield className="h-4 w-4" />
      case "delay": return <Clock className="h-4 w-4" />
      case "booking": return <Train className="h-4 w-4" />
      case "weather": return <Zap className="h-4 w-4" />
      case "maintenance": return <Settings className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant={criticalCount > 0 ? "destructive" : "default"} 
              className={`absolute -top-2 -right-2 h-5 w-5 p-0 text-xs ${
                criticalCount > 0 ? "animate-pulse" : ""
              }`}
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Train className="h-5 w-5 text-blue-600" />
                Railway Alerts
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Sound Alerts</Label>
                  <div className="flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, soundEnabled: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearAllNotifications}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex gap-1 mt-4 overflow-x-auto">
              <Button
                size="sm"
                variant={filterCategory === "all" ? "default" : "outline"}
                onClick={() => setFilterCategory("all")}
                className="whitespace-nowrap"
              >
                All ({notifications.length})
              </Button>
              {["safety", "delay", "booking", "weather", "maintenance"].map(category => {
                const count = notifications.filter(n => n.category === category).length
                return (
                  <Button
                    key={category}
                    size="sm"
                    variant={filterCategory === category ? "default" : "outline"}
                    onClick={() => setFilterCategory(category)}
                    className="whitespace-nowrap flex items-center gap-1"
                  >
                    {getCategoryIcon(category)}
                    {category} ({count})
                  </Button>
                )
              })}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                  {filterCategory !== "all" && (
                    <Button 
                      size="sm" 
                      variant="link" 
                      onClick={() => setFilterCategory("all")}
                      className="mt-2"
                    >
                      View all notifications
                    </Button>
                  )}
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? getPriorityColor(notification.priority) : ""
                    } ${notification.priority === "critical" ? "border-l-4 border-l-red-500" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? "text-blue-900" : ""
                            }`}>
                              {notification.title}
                            </h4>
                            {notification.priority === "critical" && (
                              <Badge variant="destructive" className="text-xs">
                                CRITICAL
                              </Badge>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="outline" className="text-xs">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        {/* Railway-specific details */}
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {notification.trainNumber && (
                            <div className="flex items-center gap-1">
                              <Train className="h-3 w-3" />
                              {notification.trainNumber}
                            </div>
                          )}
                          {notification.stationCode && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {notification.stationCode}
                            </div>
                          )}
                          {notification.pnr && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {notification.pnr}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2">{formatTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}