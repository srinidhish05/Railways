"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Users, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { useFirebase } from "@/hooks/use-firebase"

interface Train {
  id: string
  name: string
  route: string
  departure: string
  arrival: string
  totalSeats: number
  availableSeats: number
  price: number
  status: "active" | "delayed" | "cancelled"
}

interface BookingData {
  trainId: string
  passengerName: string
  passengerEmail: string
  seatCount: number
  travelDate: string
}

export function BookingForm() {
  const [trains, setTrains] = useState<Train[]>([])
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    trainId: "",
    passengerName: "",
    passengerEmail: "",
    seatCount: 1,
    travelDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const { bookTicket, getTrains, subscribeToTrainUpdates } = useFirebase()

  useEffect(() => {
    loadTrains()

    // Subscribe to real-time train updates
    const unsubscribe = subscribeToTrainUpdates((updatedTrains) => {
      setTrains(updatedTrains)

      // Update selected train if it's in the updated list
      if (selectedTrain) {
        const updatedSelectedTrain = updatedTrains.find((t) => t.id === selectedTrain.id)
        if (updatedSelectedTrain) {
          setSelectedTrain(updatedSelectedTrain)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const loadTrains = async () => {
    try {
      const trainsData = await getTrains()
      setTrains(trainsData)
    } catch (error) {
      console.error("Error loading trains:", error)
    }
  }

  const handleTrainSelect = (trainId: string) => {
    const train = trains.find((t) => t.id === trainId)
    setSelectedTrain(train || null)
    setBookingData((prev) => ({ ...prev, trainId }))
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTrain) {
      setErrorMessage("Please select a train")
      return
    }

    if (selectedTrain.availableSeats < bookingData.seatCount) {
      setErrorMessage("Not enough seats available")
      setBookingStatus("error")
      return
    }

    setIsLoading(true)
    setBookingStatus("idle")
    setErrorMessage("")

    try {
      const bookingResult = await bookTicket({
        ...bookingData,
        trainName: selectedTrain.name,
        route: selectedTrain.route,
        price: selectedTrain.price * bookingData.seatCount,
        bookingDate: new Date().toISOString(),
      })

      if (bookingResult.success) {
        setBookingStatus("success")
        // Reset form
        setBookingData({
          trainId: "",
          passengerName: "",
          passengerEmail: "",
          seatCount: 1,
          travelDate: "",
        })
        setSelectedTrain(null)
      } else {
        setBookingStatus("error")
        setErrorMessage(bookingResult.error || "Booking failed")
      }
    } catch (error) {
      setBookingStatus("error")
      setErrorMessage("An unexpected error occurred")
      console.error("Booking error:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
          {trains.map((train) => (
            <div
              key={train.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTrain?.id === train.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleTrainSelect(train.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{train.name}</h3>
                  <p className="text-gray-600">{train.route}</p>
                </div>
                <Badge
                  variant={
                    train.status === "active" ? "default" : train.status === "delayed" ? "secondary" : "destructive"
                  }
                >
                  {train.status}
                </Badge>
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
          {bookingStatus === "success" && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Booking confirmed! Check your email for ticket details.
              </AlertDescription>
            </Alert>
          )}

          {bookingStatus === "error" && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <Label htmlFor="passengerName">Passenger Name</Label>
              <Input
                id="passengerName"
                value={bookingData.passengerName}
                onChange={(e) => setBookingData((prev) => ({ ...prev, passengerName: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="passengerEmail">Email Address</Label>
              <Input
                id="passengerEmail"
                type="email"
                value={bookingData.passengerEmail}
                onChange={(e) => setBookingData((prev) => ({ ...prev, passengerEmail: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="travelDate">Travel Date</Label>
              <Input
                id="travelDate"
                type="date"
                value={bookingData.travelDate}
                onChange={(e) => setBookingData((prev) => ({ ...prev, travelDate: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="seatCount">Number of Seats</Label>
              <Select
                value={bookingData.seatCount.toString()}
                onValueChange={(value) => setBookingData((prev) => ({ ...prev, seatCount: Number.parseInt(value) }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Seat" : "Seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTrain && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Train:</span>
                    <span>{selectedTrain.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{selectedTrain.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{bookingData.seatCount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{selectedTrain.price * bookingData.seatCount}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedTrain || isLoading || selectedTrain.availableSeats < bookingData.seatCount}
            >
              {isLoading ? "Processing..." : "Book Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
