"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Users,
  Train,
  Shield,
  Database,
  Activity,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const systemUsers = [
  { id: 1, name: "John Doe", email: "john@railway.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@railway.com", role: "Operator", status: "Active", lastLogin: "1 day ago" },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@railway.com",
    role: "Safety Officer",
    status: "Inactive",
    lastLogin: "1 week ago",
  },
]

const systemSettings = {
  autoEmergencyBraking: true,
  collisionPrediction: true,
  realTimeTracking: true,
  passengerNotifications: true,
  maintenanceAlerts: true,
  dataRetention: 90,
  maxBookingDays: 120,
  emergencyContactDelay: 30,
}

export function AdminSection() {
  const [activeAdminTab, setActiveAdminTab] = useState("users")
  const [settings, setSettings] = useState(systemSettings)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleSaveSettings = async () => {
    setSaveStatus("saving")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // In production, save to backend
      console.log("Saving settings:", settings)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Administration</h2>
          <p className="text-gray-600">Manage users, settings, and system configuration</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Shield className="h-4 w-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="trains">
            <Train className="h-4 w-4 mr-2" />
            Train Config
          </TabsTrigger>
          <TabsTrigger value="safety">
            <Shield className="h-4 w-4 mr-2" />
            Safety Settings
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System Config
          </TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                      <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                      <span className="text-sm text-gray-500">{user.lastLogin}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Train Configuration */}
        <TabsContent value="trains" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Train Fleet Management</CardTitle>
                <CardDescription>Configure train parameters and schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxSpeed">Max Speed (km/h)</Label>
                    <Input id="maxSpeed" type="number" defaultValue="160" />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Passenger Capacity</Label>
                    <Input id="capacity" type="number" defaultValue="200" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="route">Default Route</Label>
                  <Input id="route" defaultValue="Mumbai → Delhi" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoSchedule" />
                  <Label htmlFor="autoSchedule">Enable Auto-Scheduling</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>Configure maintenance intervals and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maintenanceInterval">Maintenance Interval (days)</Label>
                  <Input id="maintenanceInterval" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="inspectionInterval">Safety Inspection (days)</Label>
                  <Input id="inspectionInterval" type="number" defaultValue="7" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="predictiveMaintenance" defaultChecked />
                  <Label htmlFor="predictiveMaintenance">Predictive Maintenance</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Safety Settings */}
        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Configuration</CardTitle>
              <CardDescription>Configure AI safety systems and emergency protocols</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoEmergencyBraking">Auto Emergency Braking</Label>
                      <p className="text-sm text-gray-600">Automatically apply brakes when collision risk is high</p>
                    </div>
                    <Switch
                      id="autoEmergencyBraking"
                      checked={settings.autoEmergencyBraking}
                      onCheckedChange={(checked) => handleSettingChange("autoEmergencyBraking", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="collisionPrediction">AI Collision Prediction</Label>
                      <p className="text-sm text-gray-600">Use AI to predict and prevent collisions</p>
                    </div>
                    <Switch
                      id="collisionPrediction"
                      checked={settings.collisionPrediction}
                      onCheckedChange={(checked) => handleSettingChange("collisionPrediction", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="realTimeTracking">Real-time Tracking</Label>
                      <p className="text-sm text-gray-600">Enable continuous GPS and sensor monitoring</p>
                    </div>
                    <Switch
                      id="realTimeTracking"
                      checked={settings.realTimeTracking}
                      onCheckedChange={(checked) => handleSettingChange("realTimeTracking", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContactDelay">Emergency Contact Delay (seconds)</Label>
                    <Input
                      id="emergencyContactDelay"
                      type="number"
                      value={settings.emergencyContactDelay}
                      onChange={(e) => handleSettingChange("emergencyContactDelay", Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="passengerNotifications">Passenger Notifications</Label>
                      <p className="text-sm text-gray-600">Send alerts to passengers during emergencies</p>
                    </div>
                    <Switch
                      id="passengerNotifications"
                      checked={settings.passengerNotifications}
                      onCheckedChange={(checked) => handleSettingChange("passengerNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                      <p className="text-sm text-gray-600">Automatic maintenance scheduling and alerts</p>
                    </div>
                    <Switch
                      id="maintenanceAlerts"
                      checked={settings.maintenanceAlerts}
                      onCheckedChange={(checked) => handleSettingChange("maintenanceAlerts", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Configure data retention and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange("dataRetention", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxBookingDays">Max Booking Advance (days)</Label>
                  <Input
                    id="maxBookingDays"
                    type="number"
                    value={settings.maxBookingDays}
                    onChange={(e) => handleSettingChange("maxBookingDays", Number(e.target.value))}
                  />
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor system health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database Connection</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI Model Status</span>
                  <Badge variant="default">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>WebSocket Connection</span>
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Degraded
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Backup</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Settings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Configuration Changes</h4>
                  <p className="text-sm text-gray-600">Save your configuration changes to apply them system-wide</p>
                </div>
                <div className="flex items-center gap-4">
                  {saveStatus === "saved" && (
                    <Alert className="border-green-200 bg-green-50 w-auto">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">Settings saved successfully!</AlertDescription>
                    </Alert>
                  )}
                  {saveStatus === "error" && (
                    <Alert variant="destructive" className="w-auto">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Failed to save settings. Please try again.</AlertDescription>
                    </Alert>
                  )}
                  <Button onClick={handleSaveSettings} disabled={saveStatus === "saving"}>
                    <Save className="h-4 w-4 mr-2" />
                    {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
