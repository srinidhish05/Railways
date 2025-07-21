"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Train, MapPin, Ticket, ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LiveTrainMap } from "@/components/live-train-map"
import { EnhancedTrainBooking } from "@/components/enhanced-train-booking"
import { PNRStatusCard } from "@/components/pnr-status-card"
import { SmartTicketCappingDemo } from "@/components/smart-ticket-capping-demo"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("booking")

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="flex items-center">
              <Train className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Railway Passenger Services</h1>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Railway Services</h2>
          <p className="text-gray-600">Book tickets, check PNR status, and track trains in real-time</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="booking" className="flex items-center">
              <Ticket className="h-4 w-4 mr-2" />
              Ticket Booking
            </TabsTrigger>
            <TabsTrigger value="live-status" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Live Train Status
            </TabsTrigger>
            <TabsTrigger value="pnr-status" className="flex items-center">
              <Train className="h-4 w-4 mr-2" />
              PNR Status
            </TabsTrigger>
            <TabsTrigger value="smart-capping" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Smart Capping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-blue-600" />
                  Karnataka Train Booking
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">Search trains, select seats, and complete booking on IRCTC</p>
              </CardHeader>
              <CardContent>
                <EnhancedTrainBooking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-status" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Live Train Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LiveTrainMap height="600px" showControls showStations />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pnr-status" className="mt-6">
            <PNRStatusCard />
          </TabsContent>

          <TabsContent value="smart-capping" className="mt-6">
            <SmartTicketCappingDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
