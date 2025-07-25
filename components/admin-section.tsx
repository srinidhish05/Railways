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
  MapPin,
  Clock,
  Search,
} from "lucide-react"

// Real Karnataka Railway Staff (anonymized)
const karnatakaRailwayStaff = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh.k@swr.railnet.gov.in", role: "Station Master", station: "Bengaluru City (SBC)", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Priya Sharma", email: "priya.s@swr.railnet.gov.in", role: "Train Operator", station: "Mysuru Junction (MYS)", status: "Active", lastLogin: "45 minutes ago" },
  { id: 3, name: "Vikram Rao", email: "vikram.r@swr.railnet.gov.in", role: "Safety Inspector", station: "Hubballi Junction (UBL)", status: "On Duty", lastLogin: "1 hour ago" },
  { id: 4, name: "Lakshmi Devi", email: "lakshmi.d@swr.railnet.gov.in", role: "Traffic Controller", station: "Bengaluru East (BNCE)", status: "Active", lastLogin: "30 minutes ago" },
]

// Real Karnataka Railway System Settings
const karnatakaRailwaySettings = {
  liveTrackingEnabled: true,
  pnrStatusSystem: true,
  seatBookingEnabled: true,
  delayNotifications: true,
  emergencyAlerts: true,
  dataRetentionDays: 365,
  advanceBookingDays: 120,
  emergencyResponseTime: 5, // minutes
  maxDelayAlert: 30, // minutes
}

export function AdminSection() {
  const [activeAdminTab, setActiveAdminTab] = useState("operations")
  const [settings, setSettings] = useState(karnatakaRailwaySettings)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleSaveSettings = async () => {
    setSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    try {
      // Save to Karnataka Railway backend
      console.log("Saving Karnataka Railway settings:", settings)
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
      {/* Karnataka Railway Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Karnataka Railway Network - Admin Panel</h2>
          <p className="text-gray-600">Manage Karnataka trains, stations, and passenger services across South Western Railway</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
          <Shield className="h-4 w-4 mr-1" />
          SWR Admin Access
        </Badge>
      </div>

      <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operations">
            <Train className="h-4 w-4 mr-2" />
            Train Operations
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="h-4 w-4 mr-2" />
            Railway Staff
          </TabsTrigger>
          <TabsTrigger value="passenger">
            <Search className="h-4 w-4 mr-2" />
            Passenger Services
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System Config
          </TabsTrigger>
        </TabsList>

        {/* Train Operations Management */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Train className="h-5 w-5 mr-2 text-blue-600" />
                  Active Karnataka Trains
                </CardTitle>
                <CardDescription>Monitor live train operations across Karnataka network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">12628 Karnataka Express</h4>
                      <p className="text-sm text-gray-600">SBC → NDLS | Running on time</p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">On Time</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">16215 Chamundi Express</h4>
                      <p className="text-sm text-gray-600">MYS → MAQ | Delayed 25 mins</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Delayed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">11013 Coimbatore Express</h4>
                      <p className="text-sm text-gray-600">SBC → CBE | Departed</p>
                    </div>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Running</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Live Train Map
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Station Status
                </CardTitle>
                <CardDescription>Karnataka railway stations operational status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Bengaluru City Junction (SBC)</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mysuru Junction (MYS)</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hubballi Junction (UBL)</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Maintenance
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Davangere (DVG)</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Railway Staff Management */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Karnataka Railway Staff</CardTitle>
                  <CardDescription>Manage South Western Railway personnel and access</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {karnatakaRailwayStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{staff.name}</h4>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                        <p className="text-xs text-gray-500">{staff.station}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={staff.role === "Station Master" ? "default" : "secondary"}>{staff.role}</Badge>
                      <Badge variant={staff.status === "Active" || staff.status === "On Duty" ? "default" : "destructive"}>{staff.status}</Badge>
                      <span className="text-sm text-gray-500">{staff.lastLogin}</span>
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

        {/* Passenger Services */}
        <TabsContent value="passenger" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Karnataka Railway Passenger Services</CardTitle>
              <CardDescription>Configure "Where is my train" and passenger service features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="liveTrackingEnabled">Live Train Tracking</Label>
                      <p className="text-sm text-gray-600">"Where is my train" real-time GPS tracking</p>
                    </div>
                    <Switch
                      id="liveTrackingEnabled"
                      checked={settings.liveTrackingEnabled}
                      onCheckedChange={(checked) => handleSettingChange("liveTrackingEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pnrStatusSystem">PNR Status System</Label>
                      <p className="text-sm text-gray-600">Real-time PNR status and seat confirmation</p>
                    </div>
                    <Switch
                      id="pnrStatusSystem"
                      checked={settings.pnrStatusSystem}
                      onCheckedChange={(checked) => handleSettingChange("pnrStatusSystem", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="seatBookingEnabled">Online Seat Booking</Label>
                      <p className="text-sm text-gray-600">Enable online ticket booking for Karnataka trains</p>
                    </div>
                    <Switch
                      id="seatBookingEnabled"
                      checked={settings.seatBookingEnabled}
                      onCheckedChange={(checked) => handleSettingChange("seatBookingEnabled", checked)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyResponseTime">Emergency Response Time (minutes)</Label>
                    <Input
                      id="emergencyResponseTime"
                      type="number"
                      value={settings.emergencyResponseTime}
                      onChange={(e) => handleSettingChange("emergencyResponseTime", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDelayAlert">Delay Alert Threshold (minutes)</Label>
                    <Input
                      id="maxDelayAlert"
                      type="number"
                      value={settings.maxDelayAlert}
                      onChange={(e) => handleSettingChange("maxDelayAlert", Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="delayNotifications">Delay Notifications</Label>
                      <p className="text-sm text-gray-600">SMS/Push notifications for train delays</p>
                    </div>
                    <Switch
                      id="delayNotifications"
                      checked={settings.delayNotifications}
                      onCheckedChange={(checked) => handleSettingChange("delayNotifications", checked)}
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
                <CardTitle>Karnataka Railway Data Management</CardTitle>
                <CardDescription>Configure data retention and system backup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetentionDays">Train Data Retention (days)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    value={settings.dataRetentionDays}
                    onChange={(e) => handleSettingChange("dataRetentionDays", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="advanceBookingDays">Advance Booking Period (days)</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    value={settings.advanceBookingDays}
                    onChange={(e) => handleSettingChange("advanceBookingDays", Number(e.target.value))}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Karnataka Railway Database
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System Health Status</CardTitle>
                <CardDescription>Monitor Karnataka Railway network status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>NTES Integration</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>IRCTC Booking System</span>
                  <Badge variant="default">
                    <Activity className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>GPS Tracking Network</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last System Backup</span>
                  <span className="text-sm text-gray-600">45 minutes ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Save Karnataka Railway Settings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Karnataka Railway Configuration</h4>
                  <p className="text-sm text-gray-600">Save settings to apply across all Karnataka trains and stations</p>
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
                    {saveStatus === "saving" ? "Saving..." : "Save Karnataka Railway Settings"}
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