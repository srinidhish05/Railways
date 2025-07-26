"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Train, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Clock,
  Ticket
} from "lucide-react"

import { 
  SmartTicketCappingSystem, 
  TrainCapacityData, 
  CoachCapacity,
  getBookingStatus,
  processSmartBooking
} from "@/lib/smart-ticket-capping"

export function SmartTicketCappingDemo() {
  const [selectedTrain, setSelectedTrain] = useState<TrainCapacityData | null>(null)
  const [requestedTickets, setRequestedTickets] = useState(1)
  const [ticketType, setTicketType] = useState<'reserved' | 'general'>('reserved')
  const [bookingResult, setBookingResult] = useState<string>('')
  const [isBooking, setIsBooking] = useState(false)

  // Sample train data
  const sampleTrains: TrainCapacityData[] = [
    {
      trainNumber: '12628',
      trainName: 'Karnataka Express',
      reservedCoaches: [
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 65, maxCapacity: 72 },
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 72, maxCapacity: 72 }
      ],
      generalCoaches: [
        { coachType: 'general', totalSeats: 100, bookedSeats: 95, allowedOverbooking: 50, maxCapacity: 150 }
      ],
      totalCapacity: 244,
      currentOccupancy: 232,
      safetyStatus: 'NEARLY_FULL'
    },
    {
      trainNumber: '16209',
      trainName: 'Mysore Express',
      reservedCoaches: [
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 72, maxCapacity: 72 }
      ],
      generalCoaches: [
        { coachType: 'general', totalSeats: 100, bookedSeats: 140, allowedOverbooking: 50, maxCapacity: 150 }
      ],
      totalCapacity: 172,
      currentOccupancy: 212,
      safetyStatus: 'OVERCAPACITY'
    },
    {
      trainNumber: '12975',
      trainName: 'Jaipur Express',
      reservedCoaches: [
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 45, maxCapacity: 72 }
      ],
      generalCoaches: [
        { coachType: 'general', totalSeats: 100, bookedSeats: 60, allowedOverbooking: 50, maxCapacity: 150 }
      ],
      totalCapacity: 172,
      currentOccupancy: 105,
      safetyStatus: 'SAFE'
    }
  ]

  useEffect(() => {
    if (sampleTrains.length > 0) {
      setSelectedTrain(sampleTrains[0])
    }
  }, [])

  const getSafetyStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE': return 'text-green-600 bg-green-100'
      case 'NEARLY_FULL': return 'text-yellow-600 bg-yellow-100'
      case 'FULL': return 'text-orange-600 bg-orange-100'
      case 'OVERCAPACITY': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSafetyIcon = (status: string) => {
    switch (status) {
      case 'SAFE': return <CheckCircle className="h-4 w-4" />
      case 'NEARLY_FULL': return <AlertTriangle className="h-4 w-4" />
      case 'FULL': return <XCircle className="h-4 w-4" />
      case 'OVERCAPACITY': return <Shield className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleBooking = async () => {
    if (!selectedTrain) return

    setIsBooking(true)
    
    // Simulate booking process
    setTimeout(() => {
      const result = processSmartBooking(selectedTrain, ticketType, requestedTickets)
      setBookingResult(result.message)
      
      if (result.success) {
        // Update train capacity (simulation)
        const updatedTrain = { ...selectedTrain }
        if (ticketType === 'reserved') {
          updatedTrain.reservedCoaches[0].bookedSeats += requestedTickets
        } else {
          updatedTrain.generalCoaches[0].bookedSeats += requestedTickets
        }
        updatedTrain.currentOccupancy += requestedTickets
        updatedTrain.safetyStatus = SmartTicketCappingSystem.calculateSafetyStatus(updatedTrain)
        setSelectedTrain(updatedTrain)
      }
      
      setIsBooking(false)
    }, 2000)
  }

  const getOccupancyPercentage = (train: TrainCapacityData) => {
    return Math.min(100, (train.currentOccupancy / train.totalCapacity) * 100)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-blue-800">
            <Shield className="h-8 w-8" />
            Smart Ticket Capping & Controlled Overbooking System
          </CardTitle>
          <CardDescription className="text-blue-700">
            Intelligent capacity management preventing overcrowding while ensuring safe travel
            <br />
            <strong>Team Feature by Srinidhi</strong> • 4-Member Railway Safety Project
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Train Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            Real-Time Train Capacity Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {sampleTrains.map((train) => (
              <Card 
                key={train.trainNumber} 
                className={`cursor-pointer transition-all ${
                  selectedTrain?.trainNumber === train.trainNumber 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTrain(train)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{train.trainName}</h3>
                      <p className="text-sm text-gray-600">{train.trainNumber}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Occupancy</span>
                        <span className="text-sm font-medium">
                          {train.currentOccupancy}/{train.totalCapacity}
                        </span>
                      </div>
                      <Progress value={getOccupancyPercentage(train)} className="h-2" />
                    </div>
                    
                    <Badge className={`w-full justify-center ${getSafetyStatusColor(train.safetyStatus)}`}>
                      {getSafetyIcon(train.safetyStatus)}
                      {train.safetyStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Train Details */}
      {selectedTrain && (
        <Tabs defaultValue="booking" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="booking">Smart Booking</TabsTrigger>
            <TabsTrigger value="capacity">Capacity Analysis</TabsTrigger>
            <TabsTrigger value="safety">Safety Report</TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Book Tickets - {selectedTrain.trainName}
                </CardTitle>
                <CardDescription>
                  {getBookingStatus(selectedTrain, requestedTickets)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ticket Type</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={ticketType === 'reserved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTicketType('reserved')}
                      >
                        Reserved
                      </Button>
                      <Button 
                        variant={ticketType === 'general' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTicketType('general')}
                      >
                        General
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Tickets</label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="6" 
                      value={requestedTickets}
                      onChange={(e) => setRequestedTickets(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleBooking} 
                      disabled={isBooking}
                      className="w-full"
                    >
                      {isBooking ? 'Processing...' : 'Book Tickets'}
                    </Button>
                  </div>
                </div>

                {bookingResult && (
                  <Alert className={bookingResult.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      {bookingResult}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capacity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Detailed Capacity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Reserved Coaches */}
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-600">Reserved Coaches</h3>
                    <div className="space-y-3">
                      {selectedTrain.reservedCoaches.map((coach, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Coach {index + 1}</span>
                            <Badge variant={coach.bookedSeats === coach.totalSeats ? 'destructive' : 'secondary'}>
                              {coach.bookedSeats}/{coach.totalSeats}
                            </Badge>
                          </div>
                          <Progress value={(coach.bookedSeats / coach.totalSeats) * 100} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">
                            {coach.totalSeats - coach.bookedSeats} seats available
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Coaches */}
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">General Coaches</h3>
                    <div className="space-y-3">
                      {selectedTrain.generalCoaches.map((coach, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">General Coach {index + 1}</span>
                            <Badge variant={coach.bookedSeats > coach.totalSeats ? 'destructive' : 'secondary'}>
                              {coach.bookedSeats}/{coach.maxCapacity}
                            </Badge>
                          </div>
                          <Progress 
                            value={(coach.bookedSeats / coach.maxCapacity) * 100} 
                            className="h-2" 
                          />
                          <div className="text-xs text-gray-600 mt-1 space-y-1">
                            <p>Base Capacity: {coach.totalSeats} seats</p>
                            <p>Overbooking Allowed: +{coach.allowedOverbooking || 50}</p>
                            <p className={coach.bookedSeats > coach.totalSeats ? 'text-orange-600 font-medium' : ''}>
                              {coach.bookedSeats > coach.totalSeats 
                                ? `${coach.bookedSeats - coach.totalSeats} passengers standing`
                                : `${coach.totalSeats - coach.bookedSeats} seats available`
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Railway Safety Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                  {SmartTicketCappingSystem.generateSafetyReport(selectedTrain)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* System Features */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">🚀 Project Implementation Features</CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Reserved Coach Management</h4>
              <ul className="text-sm space-y-1">
                <li>• Hard cap at 72 seats per coach</li>
                <li>• Prevents overbooking completely</li>
                <li>• Real-time availability tracking</li>
                <li>• Integration with IRCTC systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 General Coach Smart Capping</h4>
              <ul className="text-sm space-y-1">
                <li>• Base capacity: 100 passengers</li>
                <li>• Controlled overbooking: +50 max</li>
                <li>• Safety warnings at 95% capacity</li>
                <li>• UTS/Station counter integration</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border border-green-300">
            <h4 className="font-semibold text-green-800 mb-2">🔬 Technical Implementation</h4>
            <p className="text-sm">
              <strong>Future Integration:</strong> This system can be integrated with Indian Railways ticketing 
              infrastructure (UTS & IRCTC) to control both reserved and general seat availability dynamically, 
              ensuring safe and efficient travel during peak hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
