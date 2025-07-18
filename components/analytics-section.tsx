"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, DollarSign, Download } from "lucide-react"
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

const passengerData = [
  { month: "Jan", passengers: 45000, revenue: 2250000, onTime: 92 },
  { month: "Feb", passengers: 52000, revenue: 2600000, onTime: 89 },
  { month: "Mar", passengers: 48000, revenue: 2400000, onTime: 94 },
  { month: "Apr", passengers: 61000, revenue: 3050000, onTime: 87 },
  { month: "May", passengers: 55000, revenue: 2750000, onTime: 91 },
  { month: "Jun", passengers: 67000, revenue: 3350000, onTime: 85 },
]

const safetyData = [
  { month: "Jan", incidents: 2, resolved: 2, pending: 0 },
  { month: "Feb", incidents: 4, resolved: 3, pending: 1 },
  { month: "Mar", incidents: 1, resolved: 1, pending: 0 },
  { month: "Apr", incidents: 6, resolved: 5, pending: 1 },
  { month: "May", incidents: 3, resolved: 3, pending: 0 },
  { month: "Jun", incidents: 5, resolved: 4, pending: 1 },
]

const routePerformance = [
  { name: "Mumbai-Delhi", value: 35, color: "#3b82f6" },
  { name: "Delhi-Kolkata", value: 25, color: "#10b981" },
  { name: "Chennai-Bangalore", value: 20, color: "#f59e0b" },
  { name: "Pune-Mumbai", value: 12, color: "#ef4444" },
  { name: "Others", value: 8, color: "#8b5cf6" },
]

export function AnalyticsSection() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("passengers")

  const totalPassengers = passengerData.reduce((sum, item) => sum + item.passengers, 0)
  const totalRevenue = passengerData.reduce((sum, item) => sum + item.revenue, 0)
  const avgOnTime = Math.round(passengerData.reduce((sum, item) => sum + item.onTime, 0) / passengerData.length)
  const totalIncidents = safetyData.reduce((sum, item) => sum + item.incidents, 0)

  const handleExportData = () => {
    // In production, this would generate and download a comprehensive report
    console.log("Exporting analytics data...")
  }

  return (
    <div className="space-y-6">
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
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold">{totalPassengers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12.5%</span>
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
                <p className="text-2xl font-bold">₹{(totalRevenue / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+8.3%</span>
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
                  <span className="text-sm text-red-600">-2.1%</span>
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
                  <span className="text-sm text-green-600">-15.2%</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passenger Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Passenger & Revenue Trends</CardTitle>
            <CardDescription>Monthly passenger count and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={passengerData}>
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
            <CardTitle>Route Performance</CardTitle>
            <CardDescription>Passenger distribution by route</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routePerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {routePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* On-Time Performance */}
        <Card>
          <CardHeader>
            <CardTitle>On-Time Performance</CardTitle>
            <CardDescription>Monthly on-time percentage trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={passengerData}>
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
            <CardTitle>Safety Incidents</CardTitle>
            <CardDescription>Monthly safety incident tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safetyData}>
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
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive monthly breakdown</CardDescription>
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
                  <th className="text-right p-2">Avg Delay</th>
                </tr>
              </thead>
              <tbody>
                {passengerData.map((row, index) => (
                  <tr key={row.month} className="border-b">
                    <td className="p-2 font-medium">{row.month}</td>
                    <td className="text-right p-2">{row.passengers.toLocaleString()}</td>
                    <td className="text-right p-2">₹{(row.revenue / 1000000).toFixed(1)}M</td>
                    <td className="text-right p-2">
                      <Badge variant={row.onTime >= 90 ? "default" : "secondary"}>{row.onTime}%</Badge>
                    </td>
                    <td className="text-right p-2">{safetyData[index]?.incidents || 0}</td>
                    <td className="text-right p-2">{Math.round(Math.random() * 15 + 5)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
