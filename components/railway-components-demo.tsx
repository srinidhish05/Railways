"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LiveTrainMap } from "./live-train-map"
import { DelayReportButton } from "./delay-report-button"
import { PNRStatusCard } from "./pnr-status-card"
import { Train, MapPin, AlertTriangle, Search } from "lucide-react"

export function RailwayComponentsDemo() {
  const [selectedTrain, setSelectedTrain] = useState<any>(null)
  const [delayReports, setDelayReports] = useState<any[]>([])
  const [pnrData, setPnrData] = useState<any>(null)

  const handleTrainSelect = (train: any) => {
    setSelectedTrain(train)
    console.log("Selected train:", train)
  }

  const handleDelayReport = (report: any) => {
    setDelayReports((prev) => [...prev, report])
    console.log("Delay report submitted:", report)
  }

  const handlePNRChange = (pnr: string, data: any) => {
    setPnrData(data)
    console.log("PNR data updated:", { pnr, data })
  }

  return (
    <div className="min-h-screen bg-railway-bg-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="railway-card">
          <CardHeader className="railway-card-header">
            <CardTitle className="railway-title flex items-center gap-2">
              <Train className="h-6 w-6 text-railway-primary" />
              Railway Safety System - Component Demo
            </CardTitle>
            <CardDescription className="railway-description">
              Interactive demonstration of reusable railway components with live data
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Component Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="delay" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Delay Report
            </TabsTrigger>
            <TabsTrigger value="pnr" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              PNR Status
            </TabsTrigger>
            <TabsTrigger value="combined" className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              Combined View
            </TabsTrigger>
          </TabsList>

          {/* Live Train Map Demo */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveTrainMap
                  height="500px"
                  showControls={true}
                  showStations={true}
                  onTrainSelect={handleTrainSelect}
                />
              </div>

              <div className="space-y-4">
                <Card className="railway-card">
                  <CardHeader className="railway-card-header">
                    <CardTitle className="railway-title">Map Features</CardTitle>
                  </CardHeader>
                  <CardContent className="railway-card-content">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-railway-success"></div>
                        <span className="text-sm">Real-time train positions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-railway-warning"></div>
                        <span className="text-sm">Delay indicators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-railway-primary border-2 border-white"></div>
                        <span className="text-sm">Station markers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-railway-neutral" />
                        <span className="text-sm">Interactive controls</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedTrain && (
                  <Card className="railway-card">
                    <CardHeader className="railway-card-header">
                      <CardTitle className="railway-title">Selected Train</CardTitle>
                    </CardHeader>
                    <CardContent className="railway-card-content">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-railway-text-secondary">Name:</span>
                          <span className="text-sm font-medium">{selectedTrain.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-railway-text-secondary">Speed:</span>
                          <span className="text-sm font-medium">{Math.round(selectedTrain.speed)} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-railway-text-secondary">Status:</span>
                          <Badge variant={selectedTrain.status === "on-time" ? "default" : "destructive"}>
                            {selectedTrain.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-railway-text-secondary">Occupancy:</span>
                          <span className="text-sm font-medium">{selectedTrain.occupancy}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Delay Report Demo */}
          <TabsContent value="delay" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DelayReportButton variant="card" trainNumber="EXP2024" onReportSubmitted={handleDelayReport} />

              <Card className="railway-card">
                <CardHeader className="railway-card-header">
                  <CardTitle className="railway-title">Recent Reports</CardTitle>
                  <CardDescription className="railway-description">
                    {delayReports.length} delay reports submitted
                  </CardDescription>
                </CardHeader>
                <CardContent className="railway-card-content">
                  {delayReports.length === 0 ? (
                    <p className="text-railway-text-secondary text-center py-8">
                      No delay reports yet. Submit one using the form on the left.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {delayReports.slice(-3).map((report, index) => (
                        <div key={index} className="railway-passenger-card">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{report.trainNumber}</div>
                              <div className="text-sm text-railway-text-secondary">
                                {report.delayMinutes} minutes delay
                              </div>
                            </div>
                            <Badge variant="outline">{report.reason}</Badge>
                          </div>
                          <div className="text-sm text-railway-text-secondary">
                            {report.description || "No additional details"}
                          </div>
                          <div className="railway-coordinates mt-2">
                            <span className="railway-coord-label">Location:</span>
                            <span className="railway-coord-value">
                              {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DelayReportButton size="sm" trainNumber="RAJ001" />
              <DelayReportButton size="md" trainNumber="SHT123" />
              <DelayReportButton size="lg" trainNumber="EXP2024" />
            </div>
          </TabsContent>

          {/* PNR Status Demo */}
          <TabsContent value="pnr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PNRStatusCard showSearch={true} autoRefresh={true} onPNRChange={handlePNRChange} />

              <Card className="railway-card">
                <CardHeader className="railway-card-header">
                  <CardTitle className="railway-title">PNR Features</CardTitle>
                </CardHeader>
                <CardContent className="railway-card-content">
                  <div className="space-y-4">
                    <div className="railway-info-item">
                      <span className="railway-info-label">Real-time Status</span>
                      <span className="railway-info-value">Live booking confirmation updates</span>
                    </div>
                    <div className="railway-info-item">
                      <span className="railway-info-label">Passenger Details</span>
                      <span className="railway-info-value">Complete journey information</span>
                    </div>
                    <div className="railway-info-item">
                      <span className="railway-info-label">Seat Assignment</span>
                      <span className="railway-info-value">Coach and berth details</span>
                    </div>
                    <div className="railway-info-item">
                      <span className="railway-info-label">Auto Refresh</span>
                      <span className="railway-info-value">Automatic status updates</span>
                    </div>
                    <div className="railway-info-item">
                      <span className="railway-info-label">Offline Support</span>
                      <span className="railway-info-value">Cached data when offline</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {pnrData && (
              <Card className="railway-card">
                <CardHeader className="railway-card-header">
                  <CardTitle className="railway-title">API Response Data</CardTitle>
                </CardHeader>
                <CardContent className="railway-card-content">
                  <pre className="railway-coordinates text-xs overflow-auto">{JSON.stringify(pnrData, null, 2)}</pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Combined View Demo */}
          <TabsContent value="combined" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <LiveTrainMap
                  height="400px"
                  trainId="EXP2024"
                  showControls={true}
                  showStations={false}
                  onTrainSelect={handleTrainSelect}
                />
              </div>

              <div className="space-y-4">
                <DelayReportButton variant="card" trainNumber="EXP2024" onReportSubmitted={handleDelayReport} />
              </div>
            </div>

            <PNRStatusCard initialPNR="1234567890" showSearch={true} onPNRChange={handlePNRChange} />
          </TabsContent>
        </Tabs>

        {/* Design System Info */}
        <Card className="railway-card">
          <CardHeader className="railway-card-header">
            <CardTitle className="railway-title">Design System</CardTitle>
            <CardDescription className="railway-description">
              Railway-themed color palette and typography system
            </CardDescription>
          </CardHeader>
          <CardContent className="railway-card-content">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-full h-12 bg-railway-primary rounded-md mb-2"></div>
                <div className="text-xs font-medium">Primary</div>
                <div className="text-xs text-railway-text-secondary">#1e40af</div>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-railway-secondary rounded-md mb-2"></div>
                <div className="text-xs font-medium">Secondary</div>
                <div className="text-xs text-railway-text-secondary">#059669</div>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-railway-success rounded-md mb-2"></div>
                <div className="text-xs font-medium">Success</div>
                <div className="text-xs text-railway-text-secondary">#10b981</div>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-railway-warning rounded-md mb-2"></div>
                <div className="text-xs font-medium">Warning</div>
                <div className="text-xs text-railway-text-secondary">#f59e0b</div>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-railway-danger rounded-md mb-2"></div>
                <div className="text-xs font-medium">Danger</div>
                <div className="text-xs text-railway-text-secondary">#ef4444</div>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-railway-neutral rounded-md mb-2"></div>
                <div className="text-xs font-medium">Neutral</div>
                <div className="text-xs text-railway-text-secondary">#6b7280</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
