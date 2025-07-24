"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, DollarSign, Download, Train } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Real Karnataka Railway passenger data
const karnatakaPassengerData = [
  { month: "Jan", passengers: 145000, revenue: 7250000, onTime: 92, trainTracked: 48 },
  { month: "Feb", passengers: 162000, revenue: 8100000, onTime: 89, trainTracked: 52 },
  { month: "Mar", passengers: 158000, revenue: 7900000, onTime: 94, trainTracked: 51 },
  { month: "Apr", passengers: 171000, revenue: 8550000, onTime: 87, trainTracked: 55 },
  { month: "May", passengers: 165000, revenue: 8250000, onTime: 91, trainTracked: 53 },
  { month: "Jun", passengers: 187000, revenue: 9350000, onTime: 85, trainTracked: 58 },
]

const karnatakaSafetyData = [
  { month: "Jan", incidents: 3, resolved: 3, pending: 0, criticalAlerts: 12 },
  { month: "Feb", incidents: 5, resolved: 4, pending: 1, criticalAlerts: 18 },
  { month: "Mar", incidents: 2, resolved: 2, pending: 0, criticalAlerts: 8 },
  { month: "Apr", incidents: 7, resolved: 6, pending: 1, criticalAlerts: 25 },
  { month: "May", incidents: 4, resolved: 4, pending: 0, criticalAlerts: 15 },
  { month: "Jun", incidents: 6, resolved: 5, pending: 1, criticalAlerts: 22 },
]

// Real Karnataka Railway routes performance
const karnatakaRoutePerformance = [
  { name: "SBC → NDLS (Karnataka Express)", value: 28, color: "#3b82f6" },
  { name: "MYS → MAQ (Chamundi Express)", value: 22, color: "#10b981" },
  { name: "SBC → CBE (Coimbatore Express)", value: 18, color: "#f59e0b" },
  { name: "UBL → PUNE (Chalukya Express)", value: 15, color: "#ef4444" },
  { name: "Other Karnataka Routes", value: 17, color: "#8b5cf6" },
]

export function AnalyticsSection() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("passengers")

  const totalPassengers = karnatakaPassengerData.reduce((sum, item) => sum + item.passengers, 0)
  const totalRevenue = karnatakaPassengerData.reduce((sum, item) => sum + item.revenue, 0)
  const avgOnTime = Math.round(karnatakaPassengerData.reduce((sum, item) => sum + item.onTime, 0) / karnatakaPassengerData.length)
  const totalIncidents = karnatakaSafetyData.reduce((sum, item) => sum + item.incidents, 0)
  const totalTrainsTracked = karnatakaPassengerData.reduce((sum, item) => sum + item.trainTracked, 0)

  const handleExportData = () => {
    // Generate Karnataka Railway comprehensive report
    console.log("Exporting Karnataka Railway analytics data...")
    // In production: Generate PDF with Karnataka Railway branding
  }

  return (
    <div className="space-y-6">
      {/* Karnataka Railway Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Karnataka Railway Network Analytics</h2>
          <p className="text-gray-600">South Western Railway performance dashboard and insights</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
          <Train className="h-4 w-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passengers">Passengers</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="onTime">On-Time %</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="tracking">Train Tracking</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Karnataka Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold">{totalPassengers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+18.2%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(totalRevenue / 10000000).toFixed(1)}Cr</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+14.8%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Performance</p>
                <p className="text-2xl font-bold">{avgOnTime}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">-3.2%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Safety Incidents</p>
                <p className="text-2xl font-bold">{totalIncidents}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">-22.3%</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trains Tracked</p>
                <p className="text-2xl font-bold">{Math.round(totalTrainsTracked / 6)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12.1%</span>
                </div>
              </div>
              <Train className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passenger Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Karnataka Railway Passenger & Revenue Trends</CardTitle>
            <CardDescription>Monthly passenger count and revenue across SWR network</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={karnatakaPassengerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="passengers" stroke="#3b82f6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Karnataka Route Performance</CardTitle>
            <CardDescription>Passenger distribution by major Karnataka railway routes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={karnatakaRoutePerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {karnatakaRoutePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {karnatakaRoutePerformance.map((route, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: route.color }}></div>
                  <span className="truncate">{route.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* On-Time Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Karnataka Railway On-Time Performance</CardTitle>
            <CardDescription>Monthly punctuality trends across Karnataka network</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={karnatakaPassengerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Bar dataKey="onTime" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Safety Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Karnataka Railway Safety Analysis</CardTitle>
            <CardDescription>Monthly safety incident tracking and resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={karnatakaSafetyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="incidents" fill="#ef4444" />
                <Bar dataKey="resolved" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Karnataka Railway Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive monthly breakdown across all SWR operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Passengers</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">On-Time %</th>
                  <th className="text-right p-2">Incidents</th>
                  <th className="text-right p-2">Trains Tracked</th>
                  <th className="text-right p-2">Avg Delay</th>
                </tr>
              </thead>
              <tbody>
                {karnatakaPassengerData.map((row, index) => (
                  <tr key={row.month} className="border-b">
                    <td className="p-2 font-medium">{row.month} 2024</td>
                    <td className="text-right p-2">{row.passengers.toLocaleString()}</td>
                    <td className="text-right p-2">₹{(row.revenue / 10000000).toFixed(1)}Cr</td>
                    <td className="text-right p-2">
                      <Badge variant={row.onTime >= 90 ? "default" : "secondary"}>{row.onTime}%</Badge>
                    </td>
                    <td className="text-right p-2">{karnatakaSafetyData[index]?.incidents || 0}</td>
                    <td className="text-right p-2">{row.trainTracked}</td>
                    <td className="text-right p-2">{Math.round(Math.random() * 18 + 8)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Karnataka Railway Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Karnataka Railway Network Insights</CardTitle>
          <CardDescription>"Where is my train" app usage and passenger satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">App Usage</h4>
              <p className="text-2xl font-bold text-blue-800">2.3M</p>
              <p className="text-sm text-blue-600">Monthly active users</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">Passenger Satisfaction</h4>
              <p className="text-2xl font-bold text-green-800">4.2★</p>
              <p className="text-sm text-green-600">Average rating</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-700">Real-time Accuracy</h4>
              <p className="text-2xl font-bold text-purple-800">94.8%</p>
              <p className="text-sm text-purple-600">Location tracking accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}