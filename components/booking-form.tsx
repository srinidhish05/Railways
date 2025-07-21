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
import { MapPin, Users, CreditCard, CheckCircle, AlertCircle, Search, Clock, Train as TrainIcon, Calendar, IndianRupee } from "lucide-react"
import { useFirebase } from "@/hooks/use-firebase"
import { karnatakaStations, searchStations, type Station } from "@/data/karnataka-stations"
import { karnatakaTrains, searchTrains, searchTrainsBetweenStations, type TrainSchedule } from "@/data/karnataka-trains"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

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
  fromStation: string
  toStation: string
  selectedClass: string
}

export function BookingForm() {
  // Station and train search states
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [fromStationQuery, setFromStationQuery] = useState("")
  const [toStationQuery, setToStationQuery] = useState("")
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>(karnatakaStations)
  const [filteredToStations, setFilteredToStations] = useState<Station[]>(karnatakaStations)
  const [availableTrains, setAvailableTrains] = useState<TrainSchedule[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  
  const [trains, setTrains] = useState<Train[]>([])
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [bookingData, setBookingData] = useState<BookingData>({
    trainId: "",
    passengerName: "",
    passengerEmail: "",
    seatCount: 1,
    travelDate: "",
    fromStation: "",
    toStation: "",
    selectedClass: ""
  })
export function BookingForm() {
  // Station and train search states
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [fromStationQuery, setFromStationQuery] = useState("")
  const [toStationQuery, setToStationQuery] = useState("")
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>(karnatakaStations.slice(0, 20))
  const [filteredToStations, setFilteredToStations] = useState<Station[]>(karnatakaStations.slice(0, 20))
  const [availableTrains, setAvailableTrains] = useState<TrainSchedule[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [bookingData, setBookingData] = useState<BookingData>({
    trainId: "",
    passengerName: "",
    passengerEmail: "",
    seatCount: 1,
    travelDate: "",
    fromStation: "",
    toStation: "",
    selectedClass: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const { bookTicket } = useFirebase()

  // Search functions
  const handleFromStationSearch = (query: string) => {
    setFromStationQuery(query)
    if (query.length >= 2) {
      const filtered = searchStations(query).slice(0, 10)
      setFilteredFromStations(filtered)
    } else {
      setFilteredFromStations(karnatakaStations.slice(0, 20))
    }
  }

  const handleToStationSearch = (query: string) => {
    setToStationQuery(query)
    if (query.length >= 2) {
      const filtered = searchStations(query).slice(0, 10)
      setFilteredToStations(filtered)
    } else {
      setFilteredToStations(karnatakaStations.slice(0, 20))
    }
  }

  const handleTrainSearch = () => {
    if (!fromStation || !toStation || !travelDate) {
      setErrorMessage("Please select from station, to station, and travel date")
      return
    }

    setIsLoading(true)
    setShowTrainResults(false)

    // Search trains between selected stations
    setTimeout(() => {
      const trains = searchTrainsBetweenStations(fromStation, toStation)
      setAvailableTrains(trains)
      setShowTrainResults(true)
      setIsLoading(false)
      
      if (trains.length === 0) {
        setErrorMessage("No trains found between selected stations")
      } else {
        setErrorMessage("")
      }
    }, 1000)
  }

  const handleTrainSelect = (train: TrainSchedule) => {
    setSelectedTrain(train)
    setBookingData(prev => ({ 
      ...prev, 
      trainId: train.trainNumber,
      fromStation,
      toStation 
    }))
  }

  const handleClassSelect = (classCode: string) => {
    setSelectedClass(classCode)
    setBookingData(prev => ({ ...prev, selectedClass: classCode }))
  }

  const getSelectedClassInfo = () => {
    if (!selectedTrain || !selectedClass) return null
    return selectedTrain.classes.find(c => c.class === selectedClass)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTrain || !selectedClass) {
      setErrorMessage("Please select a train and class")
      return
    }

    const classInfo = getSelectedClassInfo()
    if (!classInfo || classInfo.availableSeats < bookingData.seatCount) {
      setErrorMessage("Not enough seats available in selected class")
      setBookingStatus("error")
      return
    }

    setIsLoading(true)
    setBookingStatus("idle")
    setErrorMessage("")

    try {
      const bookingResult = await bookTicket({
        ...bookingData,
        trainName: selectedTrain.trainName,
        route: `${selectedTrain.fromName} → ${selectedTrain.toName}`,
        price: classInfo.currentPrice * bookingData.seatCount,
        bookingDate: new Date().toISOString(),
        className: classInfo.className
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
          fromStation: "",
          toStation: "",
          selectedClass: ""
        })
        setSelectedTrain(null)
        setSelectedClass("")
        setFromStation("")
        setToStation("")
        setTravelDate(undefined)
        setShowTrainResults(false)
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
