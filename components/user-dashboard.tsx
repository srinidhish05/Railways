"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  TrendingDown,
  Calendar,
  CreditCard,
  Star,
  Info,
  Zap
} from "lucide-react"

interface Journey {
  id: string
  from: string
  to: string
  date: string
  fare: number
  distance: number
}

export default function UserDashboard() {
  const [monthlySpent] = useState(1245)
  const [monthlyCap] = useState(2000)
  const [savings] = useState(755)
  const [journeys] = useState<Journey[]>([
    { id: "1", from: "Bangalore", to: "Mysore", date: "2025-01-20", fare: 185, distance: 139 },
    { id: "2", from: "Mysore", to: "Bangalore", date: "2025-01-21", fare: 185, distance: 139 },
    { id: "3", from: "Bangalore", to: "Hubli", date: "2025-01-22", fare: 350, distance: 425 },
    { id: "4", from: "Hubli", to: "Bangalore", date: "2025-01-23", fare: 350, distance: 425 },
    { id: "5", from: "Bangalore", to: "Mangalore", date: "2025-01-24", fare: 175, distance: 350 }
  ])

  const cappingProgress = (monthlySpent / monthlyCap) * 100

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Spent</p>
                <p className="text-3xl font-bold text-blue-600">₹{monthlySpent}</p>
                <p className="text-sm text-gray-500">of ₹{monthlyCap} cap</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={cappingProgress} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-3xl font-bold text-green-600">₹{savings}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Journeys</p>
                <p className="text-3xl font-bold text-purple-600">{journeys.length}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6" />
            Smart Ticket Capping System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Automatic Tracking</h3>
              <p className="text-sm text-gray-600">System automatically tracks your monthly travel expenses</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Capping</h3>
              <p className="text-sm text-gray-600">Once you reach ₹2000, additional journeys are free</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Maximum Savings</h3>
              <p className="text-sm text-gray-600">Save money on frequent travel with automatic optimization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey History */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            January 2025 Journey History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {journeys.map((journey) => (
              <div key={journey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{journey.from} → {journey.to}</p>
                    <Badge variant="outline" className="text-xs">{journey.distance} km</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{new Date(journey.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{journey.fare}</p>
                  <Badge className="bg-green-500 text-white">Counted</Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Alert className="mt-6 bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Good news!</strong> You've saved ₹{savings} this month with smart capping. 
              After ₹{monthlyCap - monthlySpent} more in spending, all additional journeys will be free!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Benefits & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Automatic fare capping</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <span className="font-medium">Maximum savings guarantee</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Monthly cycle reset</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Real-time tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <Star className="h-5 w-5 text-pink-600" />
                <span className="font-medium">No registration required</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <span className="font-medium">Works with all payment methods</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}