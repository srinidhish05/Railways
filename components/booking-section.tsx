"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Users, CreditCard, CheckCircle } from "lucide-react"

const mockTrains = [
  {
    id: "1",
    name: "Express 2024",
    route: "Mumbai → Delhi",
    departure: "08:00 AM",
    arrival: "06:00 PM",
    availableSeats: 45,
    totalSeats: 200,
    price: 1200,
    status: "active",
  },
  {
    id: "2",
    name: "Rajdhani Express",
    route: "Delhi → Kolkata",
    departure: "10:30 AM",
    arrival: "08:45 PM",
    availableSeats: 12,
    totalSeats: 180,
    price: 1800,
    status: "active",
  },
  {
    id: "3",
    name: "Shatabdi Express",
    route: "Chennai → Bangalore",
    departure: "06:15 AM",
    arrival: "11:30 AM",
    availableSeats: 0,
    totalSeats: 150,
    price: 800,
    status: "delayed",
  },
]

export function BookingSection() {
  const [selectedTrain, setSelectedTrain] = useState<string>("")
  const [passengerName, setPassengerName] = useState("")
  const [passengerEmail, setPassengerEmail] = useState("")
  const [seatCount, setSeatCount] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTrain && passengerName && passengerEmail) {
      setBookingSuccess(true)
      // Reset form
      setSelectedTrain("")
      setPassengerName("")
      setPassengerEmail("")
      setSeatCount(1)
    }
  }

  const selectedTrainData = mockTrains.find((t) => t.id === selectedTrain)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Train Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Available Trains
          </CardTitle>
          <CardDescription>Select a train for your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTrains.map((train) => (
            <div
              key={train.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTrain === train.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedTrain(train.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{train.name}</h3>
                  <p className="text-gray-600">{train.route}</p>
                </div>
                <Badge variant={train.status === "active" ? "default" : "secondary"}>{train.status}</Badge>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Departure: {train.departure}</span>
                <span>Arrival: {train.arrival}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {train.availableSeats}/{train.totalSeats} seats available
                  </span>
                </div>
                <span className="font-semibold text-lg">₹{train.price}</span>
              </div>

              {train.availableSeats === 0 && (
                <Badge variant="destructive" className="mt-2">
                  Fully Booked
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Book Your Ticket
          </CardTitle>
          <CardDescription>Fill in your details to complete the booking</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Booking confirmed! Check your email for ticket details.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <Label htmlFor="name">Passenger Name</Label>
              <Input id="name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                max="6"
                value={seatCount}
                onChange={(e) => setSeatCount(Number(e.target.value))}
                required
              />
            </div>

            {selectedTrainData && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Train:</span>
                    <span>{selectedTrainData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{selectedTrainData.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{seatCount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{selectedTrainData.price * seatCount}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedTrain || !selectedTrainData || selectedTrainData.availableSeats < seatCount}
            >
              Book Ticket
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
