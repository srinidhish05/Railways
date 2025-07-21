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
import { MapPin, Users, CreditCard, CheckCircle, AlertCircle, Search, Clock, Train as TrainIcon, Calendar, IndianRupee, ExternalLink, Volume2, VolumeX, Mic, MicOff } from "lucide-react"
import { karnatakaStations, searchStations, type Station } from "@/data/karnataka-stations"
import { karnatakaTrains, searchTrains, searchTrainsBetweenStations, type TrainSchedule } from "@/data/karnataka-trains"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

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

export function EnhancedTrainBooking() {
  // Station and train search states
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [travelDate, setTravelDate] = useState<Date>()
  const [availableTrains, setAvailableTrains] = useState<TrainSchedule[]>([])
  const [showTrainResults, setShowTrainResults] = useState(false)
  
  // Search functionality states
  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>([])
  const [filteredToStations, setFilteredToStations] = useState<Station[]>([])
  
  // Voice accessibility states
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [speechRecognition, setSpeechRecognition] = useState<any>(null)
  const [voiceMode, setVoiceMode] = useState<'from' | 'to' | 'none'>('none')
  const [hasAnnouncedVoiceFeatures, setHasAnnouncedVoiceFeatures] = useState(false)
  
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
  const [bookingReference, setBookingReference] = useState("")
  const [bookedTicketDetails, setBookedTicketDetails] = useState<any>(null)

  const getRouteDisplay = (train: TrainSchedule) => {
    // Check if this train directly connects the selected stations
    if ((train.from === fromStation && train.to === toStation) || 
        (train.from === toStation && train.to === fromStation)) {
      return `${train.fromName} → ${train.toName}`
    }
    
    // Check if both stations are in the route
    const fromInVia = train.viaStations.includes(fromStation)
    const toInVia = train.viaStations.includes(toStation)
    const fromIsOrigin = train.from === fromStation
    const toIsDestination = train.to === toStation
    const fromIsDestination = train.to === fromStation
    const toIsOrigin = train.from === toStation
    
    if ((fromIsOrigin || fromInVia) && (toIsDestination || toInVia)) {
      return `${getStationName(fromStation)} → ${getStationName(toStation)} (via ${train.trainName})`
    }
    
    return `${train.fromName} → ${train.toName}`
  }

  const handleTrainSearch = () => {
    if (!fromStation || !toStation || !travelDate) {
      setErrorMessage("Please select from station, to station, and travel date")
      return
    }

    if (fromStation === toStation) {
      setErrorMessage("From and To stations cannot be the same")
      return
    }

    setIsLoading(true)
    setShowTrainResults(false)
    setErrorMessage("")

    // Search trains between selected stations - only exact matches
    setTimeout(() => {
      let trains = searchTrainsBetweenStations(fromStation, toStation)
      
      setAvailableTrains(trains)
      setShowTrainResults(true)
      setIsLoading(false)
      
      if (trains.length === 0) {
        setErrorMessage(`No direct trains found between ${getStationName(fromStation)} and ${getStationName(toStation)}. Try different stations or check IRCTC for connecting routes.`)
      } else {
        setErrorMessage("")
      }
      
      // Voice announcement for search results
      announceTrainResults(trains)
    }, 1000)
  }

  const handleTrainSelect = (train: TrainSchedule) => {
    setSelectedTrain(train)
    setSelectedClass("")
    setBookingData(prev => ({ 
      ...prev, 
      trainId: train.trainNumber,
      fromStation,
      toStation 
    }))
    
    // Voice announcement for train selection
    announceTrainSelection(train)
  }

  const handleClassSelect = (classCode: string) => {
    setSelectedClass(classCode)
    setBookingData(prev => ({ ...prev, selectedClass: classCode }))
    
    // Voice announcement for class selection
    const classInfo = selectedTrain?.classes.find(c => c.class === classCode)
    if (classInfo && voiceEnabled) {
      announceClassSelection(classInfo.className, classInfo.currentPrice)
    }
  }

  const getSelectedClassInfo = () => {
    if (!selectedTrain || !selectedClass) return null
    return selectedTrain.classes.find(c => c.class === selectedClass)
  }

  const generatePNR = () => {
    const chars = '0123456789'
    let pnr = ''
    for (let i = 0; i < 10; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pnr
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

    // Redirect to IRCTC for real booking
    const irctcUrl = `https://www.irctc.co.in/nget/train-search?fromStation=${fromStation}&toStation=${toStation}&travelDate=${travelDate?.toISOString().split('T')[0]}&trainNumber=${selectedTrain.trainNumber}`
    
    // Show confirmation dialog before redirect
    const confirmRedirect = window.confirm(
      `This will redirect you to IRCTC (Official Indian Railways) for real ticket booking.\n\n` +
      `Train: ${selectedTrain.trainName} (${selectedTrain.trainNumber})\n` +
      `Route: ${getStationName(fromStation)} → ${getStationName(toStation)}\n` +
      `Class: ${classInfo.className}\n\n` +
      `Click OK to proceed to IRCTC.co.in for real booking, or Cancel to stay here.`
    )
    
    if (confirmRedirect) {
      // Open IRCTC in new window/tab
      window.open(irctcUrl, '_blank', 'noopener,noreferrer')
      
      // Show success message that redirect happened
      setBookingStatus("success")
      const redirectDetails = {
        redirected: true,
        trainName: selectedTrain.trainName,
        trainNumber: selectedTrain.trainNumber,
        fromStation: getStationName(fromStation),
        toStation: getStationName(toStation),
        className: classInfo.className,
        classCode: selectedClass,
        travelDate: travelDate ? travelDate.toDateString() : '',
        departureTime: selectedTrain.departureTime,
        duration: selectedTrain.duration,
        redirectTime: new Date().toLocaleString(),
        irctcUrl
      }
      setBookedTicketDetails(redirectDetails)
    }
  }

  const handleNewBooking = () => {
    // Reset everything for new booking
    setBookingStatus("idle")
    setBookedTicketDetails(null)
    setBookingReference("")
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
    setFromSearch("")
    setToSearch("")
    setTravelDate(undefined)
    setShowTrainResults(false)
    setErrorMessage("")
    setShowFromDropdown(false)
    setShowToDropdown(false)
  }

  // Station search functionality
  const handleFromSearchChange = (value: string) => {
    setFromSearch(value)
    if (value.length > 0) {
      const filtered = karnatakaStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredFromStations(filtered.slice(0, 8)) // Show max 8 results
      setShowFromDropdown(true)
    } else {
      setFilteredFromStations([])
      setShowFromDropdown(false)
      setFromStation("") // Clear selection when search is cleared
    }
  }

  const handleToSearchChange = (value: string) => {
    setToSearch(value)
    if (value.length > 0) {
      const filtered = karnatakaStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredToStations(filtered.slice(0, 8)) // Show max 8 results
      setShowToDropdown(true)
    } else {
      setFilteredToStations([])
      setShowToDropdown(false)
      setToStation("") // Clear selection when search is cleared
    }
  }

  const selectFromStation = (station: Station) => {
    setFromStation(station.code)
    setFromSearch(`${station.name} (${station.code})`)
    setShowFromDropdown(false)
    setFilteredFromStations([])
    
    // Voice announcement for accessibility
    if (voiceEnabled) {
      speak(`Departure station selected: ${station.name}`)
    }
  }

  const selectToStation = (station: Station) => {
    setToStation(station.code)
    setToSearch(`${station.name} (${station.code})`)
    setShowToDropdown(false)
    setFilteredToStations([])
    
    // Voice announcement for accessibility
    if (voiceEnabled) {
      speak(`Destination station selected: ${station.name}`)
    }
  }

  // Voice Accessibility Functions
  const speak = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      
      // Set voice to English if available
      const voices = window.speechSynthesis.getVoices()
      const englishVoice = voices.find(voice => voice.lang.includes('en'))
      if (englishVoice) {
        utterance.voice = englishVoice
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleVoiceAssistant = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled) {
      speak("Voice assistant enabled. I will announce search results and selections to help you navigate.")
      // Announce voice features after a short delay
      setTimeout(() => {
        announceVoiceFeatures()
      }, 3000)
    } else {
      speak("Voice assistant disabled.")
      setTimeout(() => {
        window.speechSynthesis.cancel()
      }, 2000)
    }
  }

  const announceVoiceFeatures = () => {
    if (!voiceEnabled || hasAnnouncedVoiceFeatures) return
    
    const guidance = `
      Welcome to Railway Voice Assistant! Here's how to use voice features:
      
      To select departure station: Click the microphone button next to 'From Station' field, then speak your station name clearly.
      
      To select destination station: Click the microphone button next to 'To Station' field, then speak your destination clearly.
      
      For example, say 'Bangalore City Junction' or 'Mysore Junction'.
      
      If you want to hear station options, say 'list all stations' or 'show all stations'.
      
      The system will automatically search for trains and announce the results.
      
      Press F1 key anytime to repeat this guidance.
    `
    
    speak(guidance)
    setHasAnnouncedVoiceFeatures(true)
  }

  const announceTrainResults = (trains: TrainSchedule[]) => {
    if (!voiceEnabled) return
    
    if (trains.length === 0) {
      speak(`No trains found between ${getStationName(fromStation)} and ${getStationName(toStation)}`)
    } else if (trains.length === 1) {
      const train = trains[0]
      speak(`Found 1 train: ${train.trainName}, ${train.trainNumber}, departing at ${train.departureTime}, duration ${train.duration}`)
    } else {
      speak(`Found ${trains.length} trains. First option: ${trains[0].trainName}, ${trains[0].trainNumber}, departing at ${trains[0].departureTime}. Use arrow keys or tab to explore all options.`)
    }
  }

  const announceTrainSelection = (train: TrainSchedule) => {
    if (!voiceEnabled) return
    
    const availableClasses = train.classes.filter(c => c.status !== "NOT_AVAILABLE")
    const classNames = availableClasses.map(c => c.className).join(", ")
    
    speak(`Selected train: ${train.trainName}, ${train.trainNumber}. Available classes: ${classNames}. Please select your preferred class.`)
  }

  const announceClassSelection = (className: string, price: number) => {
    if (!voiceEnabled) return
    speak(`Selected class: ${className}, price ${price} rupees. Please proceed to booking form.`)
  }

  // Voice Input (Speech Recognition) Functions
  const startVoiceInput = (mode: 'from' | 'to') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      speak("Sorry, voice input is not supported in this browser. Please try Chrome or Edge.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-IN' // Indian English
    
    setIsListening(true)
    setVoiceMode(mode)
    
    const modeText = mode === 'from' ? 'departure' : 'destination'
    
    // Announce available station options
    const majorStations = [
      "Bangalore City Junction", "Mysore Junction", "Hubli Junction", "Mangalore Central",
      "Davangere", "Shimoga Town", "Hassan", "Tumkur", "Belgaum", "Gulbarga",
      "Raichur", "Bellary", "Hospet Junction", "Bhatkal", "Karwar"
    ]
    
    const stationsList = majorStations.join(", ")
    speak(`Voice input started for ${modeText} station. Available major stations include: ${stationsList}. You can also say any other Karnataka station name clearly. Please speak now.`)
    
    // Delay recognition start to allow announcement to complete
    setTimeout(() => {
      recognition.start()
    }, 12000)
    
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.toLowerCase()
      console.log('Voice input received:', spokenText)
      
      // Handle request for all stations
      if (spokenText.includes('list all') || spokenText.includes('show all') || spokenText.includes('all stations')) {
        const allStationNames = karnatakaStations.slice(0, 20).map(s => s.name).join(", ")
        speak(`Here are some Karnataka stations: ${allStationNames}. And many more. Please say a specific station name.`)
        
        // Restart recognition for station selection
        setTimeout(() => {
          recognition.start()
        }, 8000)
        return
      }
      
      // Search for matching stations
      const matchingStations = karnatakaStations.filter(station =>
        station.name.toLowerCase().includes(spokenText) ||
        station.city.toLowerCase().includes(spokenText) ||
        spokenText.includes(station.name.toLowerCase()) ||
        spokenText.includes(station.city.toLowerCase())
      )
      
      if (matchingStations.length > 0) {
        const bestMatch = matchingStations[0]
        
        if (mode === 'from') {
          selectFromStation(bestMatch)
        } else {
          selectToStation(bestMatch)
        }
        
        speak(`Great! I heard "${spokenText}" and selected ${bestMatch.name}. Is this correct?`)
      } else {
        speak(`I heard "${spokenText}" but couldn't find a matching station. Please try again with a clearer pronunciation or try typing instead.`)
      }
      
      setIsListening(false)
      setVoiceMode('none')
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setVoiceMode('none')
      
      if (event.error === 'no-speech') {
        speak("I didn't hear anything. Please try again.")
      } else if (event.error === 'audio-capture') {
        speak("Please check your microphone and try again.")
      } else {
        speak("Sorry, there was an error with voice recognition. Please try typing instead.")
      }
    }
    
    recognition.onend = () => {
      setIsListening(false)
      setVoiceMode('none')
    }
    
    // Remove immediate start - will be started after delay
  }

  const stopVoiceInput = () => {
    setIsListening(false)
    setVoiceMode('none')
    if (speechRecognition) {
      speechRecognition.stop()
    }
    speak("Voice input cancelled.")
  }

  const getStationName = (code: string) => {
    const station = karnatakaStations.find(s => s.code === code)
    return station ? `${station.name} (${station.code})` : code
  }

  // Voice Guidance and Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // F1 key for voice guidance
      if (event.key === 'F1') {
        event.preventDefault()
        if (voiceEnabled) {
          announceVoiceFeatures()
        } else {
          speak("Voice assistant is disabled. Click the speaker button to enable voice guidance.")
        }
      }
      
      // Alt+V to toggle voice assistant
      if (event.altKey && event.key === 'v') {
        event.preventDefault()
        toggleVoiceAssistant()
      }
      
      // Alt+F for from station voice input
      if (event.altKey && event.key === 'f' && voiceEnabled) {
        event.preventDefault()
        if (isListening && voiceMode === 'from') {
          stopVoiceInput()
        } else {
          startVoiceInput('from')
        }
      }
      
      // Alt+T for to station voice input
      if (event.altKey && event.key === 't' && voiceEnabled) {
        event.preventDefault()
        if (isListening && voiceMode === 'to') {
          stopVoiceInput()
        } else {
          startVoiceInput('to')
        }
      }
    }

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress)
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [voiceEnabled, isListening, voiceMode])

  // Announce page load and voice features
  useEffect(() => {
    const timer = setTimeout(() => {
      if (voiceEnabled && !hasAnnouncedVoiceFeatures) {
        speak("Railway booking system loaded. Press F1 for voice guidance or use Alt+V to toggle voice assistant.")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [voiceEnabled])

  // Focus announcements
  const announceFocus = (element: string) => {
    if (voiceEnabled) {
      speak(`Focused on ${element}`)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Booking Success Page */}
      {bookingStatus === "success" && bookedTicketDetails && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-6 w-6" />
              Booking Confirmed Successfully!
            </CardTitle>
            <CardDescription className="text-green-100">
              Your ticket has been booked. Save your PNR number for future reference.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-2">PNR Number</h3>
              <p className="text-3xl font-mono font-bold text-gray-800 bg-white p-3 rounded border-2 border-dashed border-green-400">
                {bookedTicketDetails.pnr}
              </p>
              <p className="text-sm text-gray-600 mt-2">Keep this number safe for tracking your journey</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Journey Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Train:</span>
                    <span className="font-medium">{bookedTicketDetails.trainName} ({bookedTicketDetails.trainNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{bookedTicketDetails.fromStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{bookedTicketDetails.toStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{bookedTicketDetails.travelDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">{bookedTicketDetails.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{bookedTicketDetails.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Passenger & Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passenger:</span>
                    <span className="font-medium">{bookedTicketDetails.passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{bookedTicketDetails.passengerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">{bookedTicketDetails.className} ({bookedTicketDetails.classCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{bookedTicketDetails.seatCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">{bookedTicketDetails.status}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-lg">₹{bookedTicketDetails.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Carry a valid photo ID proof during journey</li>
                <li>• Arrive at the station at least 30 minutes before departure</li>
                <li>• Keep your PNR number ready for seat confirmation</li>
                <li>• A confirmation email has been sent to {bookedTicketDetails.passengerEmail}</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleNewBooking} className="flex-1">
                Book Another Ticket
              </Button>
              <Button variant="outline" className="flex-1">
                Download Ticket
              </Button>
              <Button variant="outline" className="flex-1">
                Track PNR Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show booking form only if not successful */}
      {bookingStatus !== "success" && (
        <>
          {/* Voice Assistant Toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-3">
              {voiceEnabled && (
                <span className="text-sm text-blue-600 font-medium">🎤 Voice assistance active</span>
              )}
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceAssistant}
                className={`flex items-center gap-2 ${voiceEnabled ? 'bg-blue-600 text-white' : ''}`}
                aria-label={voiceEnabled ? "Disable voice assistant" : "Enable voice assistant for accessibility"}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {voiceEnabled ? "Voice ON" : "Voice Assistant"}
              </Button>
            </div>
          </div>

          {voiceEnabled && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Voice Assistant Enabled:</strong> I will announce search results, train selections, and guide you through the booking process.
                <div className="mt-2 text-sm">
                  <strong>Voice Commands:</strong>
                  <br />• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">F1</kbd> for voice guidance
                  <br />• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Alt+V</kbd> to toggle voice assistant
                  <br />• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Alt+F</kbd> to speak departure station
                  <br />• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Alt+T</kbd> to speak destination station
                  <br />• Click microphone buttons 🎤 next to station fields to use voice input
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            (fromStation && toStation && travelDate) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Search Trains</span>
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded">
          <div className={`h-full bg-green-500 rounded transition-all duration-300 ${
            selectedTrain ? 'w-full' : 'w-0'
          }`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            selectedTrain ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Select Train & Class</span>
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded">
          <div className={`h-full bg-green-500 rounded transition-all duration-300 ${
            selectedClass ? 'w-full' : 'w-0'
          }`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            selectedClass ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Redirect to IRCTC</span>
        </div>
      </div>

      {/* Station Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Search Trains - All Karnataka Routes
          </CardTitle>
          <CardDescription>
            Choose from {karnatakaStations.length} railway stations across Karnataka
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Station */}
            <div className="relative">
              <Label htmlFor="from-station">From Station</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="from-station"
                    type="text"
                    placeholder="Type to search departure station..."
                    value={fromSearch}
                    onChange={(e) => handleFromSearchChange(e.target.value)}
                    onFocus={() => {
                      announceFocus("From Station input field. Type to search or use voice input.")
                      if (filteredFromStations.length > 0) {
                        setShowFromDropdown(true)
                      }
                    }}
                    className={`pr-10 ${fromStation ? 'border-green-500 bg-green-50' : ''}`}
                    aria-label="Search and select departure station"
                    aria-describedby="from-station-help"
                    role="combobox"
                    aria-expanded={showFromDropdown}
                    aria-autocomplete="list"
                  />
                  {fromStation ? (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  ) : (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                {voiceEnabled && (
                  <Button
                    variant={isListening && voiceMode === 'from' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isListening && voiceMode === 'from') {
                        stopVoiceInput()
                      } else {
                        startVoiceInput('from')
                      }
                    }}
                    className={`px-3 ${isListening && voiceMode === 'from' ? 'bg-red-500 text-white animate-pulse' : ''}`}
                    aria-label="Use voice to select departure station"
                  >
                    {isListening && voiceMode === 'from' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              
              {showFromDropdown && filteredFromStations.length > 0 && (
                <div 
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  role="listbox"
                  aria-label="Departure station options"
                >
                  {filteredFromStations.map((station, index) => (
                    <div
                      key={station.code}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => selectFromStation(station)}
                      role="option"
                      aria-selected={fromStation === station.code}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          selectFromStation(station)
                        }
                      }}
                    >
                      <div className="font-medium text-gray-900">
                        {station.name} <span className="text-blue-600">({station.code})</span>
                      </div>
                      <div className="text-sm text-gray-500">{station.city}, {station.district}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No results found */}
              {showFromDropdown && fromSearch.length > 0 && filteredFromStations.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No stations found matching "{fromSearch}"
                  </div>
                </div>
              )}
              
              {/* Click outside to close dropdown */}
              {showFromDropdown && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowFromDropdown(false)}
                />
              )}
            </div>

            {/* To Station */}
            <div className="relative">
              <Label htmlFor="to-station">To Station</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="to-station"
                    type="text"
                    placeholder="Type to search destination station..."
                    value={toSearch}
                    onChange={(e) => handleToSearchChange(e.target.value)}
                    onFocus={() => {
                      announceFocus("To Station input field. Type to search or use voice input.")
                      if (filteredToStations.length > 0) {
                        setShowToDropdown(true)
                      }
                    }}
                    className={`pr-10 ${toStation ? 'border-green-500 bg-green-50' : ''}`}
                    aria-label="Search and select destination station"
                    aria-describedby="to-station-help"
                    role="combobox"
                    aria-expanded={showToDropdown}
                    aria-autocomplete="list"
                  />
                  {toStation ? (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  ) : (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                {voiceEnabled && (
                  <Button
                    variant={isListening && voiceMode === 'to' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isListening && voiceMode === 'to') {
                        stopVoiceInput()
                      } else {
                        startVoiceInput('to')
                      }
                    }}
                    className={`px-3 ${isListening && voiceMode === 'to' ? 'bg-red-500 text-white animate-pulse' : ''}`}
                    aria-label="Use voice to select destination station"
                  >
                    {isListening && voiceMode === 'to' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              
              {showToDropdown && filteredToStations.length > 0 && (
                <div 
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  role="listbox"
                  aria-label="Destination station options"
                >
                  {filteredToStations.map((station, index) => (
                    <div
                      key={station.code}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => selectToStation(station)}
                      role="option"
                      aria-selected={toStation === station.code}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          selectToStation(station)
                        }
                      }}
                    >
                      <div className="font-medium text-gray-900">
                        {station.name} <span className="text-blue-600">({station.code})</span>
                      </div>
                      <div className="text-sm text-gray-500">{station.city}, {station.district}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No results found */}
              {showToDropdown && toSearch.length > 0 && filteredToStations.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No stations found matching "{toSearch}"
                  </div>
                </div>
              )}
              
              {/* Click outside to close dropdown */}
              {showToDropdown && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowToDropdown(false)}
                />
              )}
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <Label>Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  {travelDate ? format(travelDate, "PPP") : "Select travel date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={travelDate}
                  onSelect={setTravelDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={handleTrainSearch} 
            disabled={isLoading} 
            className="w-full" 
            size="lg"
            aria-label="Search for trains between selected stations"
            aria-describedby={errorMessage ? "error-message" : undefined}
          >
            {isLoading ? "Searching..." : `Search Trains (${karnatakaTrains.length} Available)`}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Train Results */}
      {showTrainResults && availableTrains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrainIcon className="h-5 w-5 text-green-600" />
              Available Trains ({availableTrains.length} found)
            </CardTitle>
            <CardDescription>
              Route: {getStationName(fromStation)} → {getStationName(toStation)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTrains.map((train) => (
              <div
                key={train.trainNumber}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTrain?.trainNumber === train.trainNumber 
                    ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => handleTrainSelect(train)}
              >
                {selectedTrain?.trainNumber === train.trainNumber && (
                  <div className="mb-3 p-2 bg-blue-100 rounded text-center">
                    <p className="text-sm text-blue-800 font-medium">
                      ✓ Train Selected - Choose class below to continue
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-blue-900">
                      {train.trainName} ({train.trainNumber})
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {getRouteDisplay(train)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {train.departureTime} - {train.arrivalTime}
                      </span>
                      <span>{train.duration}</span>
                      <span>{train.distance} km</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={train.status === "Active" ? "default" : "secondary"}>
                      {train.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{train.type}</p>
                    <p className="text-xs text-gray-500">{train.frequency}</p>
                  </div>
                </div>

                {/* Available Classes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {train.classes.map((trainClass) => (
                    <div
                      key={trainClass.class}
                      className="p-2 bg-gray-50 rounded border text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{trainClass.class}</p>
                          <p className="text-gray-600">{trainClass.className}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {trainClass.currentPrice}
                          </p>
                          <Badge 
                            className={`text-xs ${
                              trainClass.status === "AVAILABLE" ? "bg-green-100 text-green-800" :
                              trainClass.status === "RAC" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}
                          >
                            {trainClass.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-500 mt-1">
                        {trainClass.availableSeats} / {trainClass.totalSeats} available
                      </p>
                    </div>
                  ))}
                </div>

                {selectedTrain?.trainNumber === train.trainNumber && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <Label className="text-sm font-semibold text-blue-900">
                        Step 2: Select Class for Booking
                      </Label>
                    </div>
                    <p className="text-xs text-blue-700 mb-3">Choose your travel class to proceed with booking</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {train.classes.filter(c => c.status !== "NOT_AVAILABLE").map((trainClass) => (
                        <Button
                          key={trainClass.class}
                          variant={selectedClass === trainClass.class ? "default" : "outline"}
                          size="sm"
                          className={`h-auto p-3 text-left justify-start ${
                            selectedClass === trainClass.class ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClassSelect(trainClass.class)
                          }}
                          disabled={trainClass.availableSeats === 0}
                        >
                          <div className="w-full">
                            <div className="font-medium">{trainClass.class} - ₹{trainClass.currentPrice}</div>
                            <div className="text-xs opacity-80">{trainClass.className}</div>
                            <div className="text-xs opacity-80">{trainClass.availableSeats} seats available</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    {selectedClass && (
                      <div className="mt-3 p-2 bg-green-100 rounded text-center">
                        <p className="text-sm text-green-800 font-medium">
                          ✓ {getSelectedClassInfo()?.className} selected - Proceed to booking form below
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      {selectedTrain && selectedClass && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="bg-green-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CreditCard className="h-5 w-5" />
              Step 3: Complete Your Booking
            </CardTitle>
            <CardDescription className="text-green-700">
              {selectedTrain.trainName} ({selectedTrain.trainNumber}) | {getSelectedClassInfo()?.className} | 
              ₹{getSelectedClassInfo()?.currentPrice} per passenger
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            {(bookingStatus as string) === "success" && (
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
                <Label htmlFor="passenger-name">Passenger Name</Label>
                <Input
                  id="passenger-name"
                  type="text"
                  placeholder="Enter full name as per ID proof"
                  value={bookingData.passengerName}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, passengerName: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="passenger-email">Email Address</Label>
                <Input
                  id="passenger-email"
                  type="email"
                  placeholder="Enter email address for ticket confirmation"
                  value={bookingData.passengerEmail}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, passengerEmail: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="seat-count">Number of Passengers</Label>
                <Select
                  value={bookingData.seatCount.toString()}
                  onValueChange={(value) =>
                    setBookingData((prev) => ({ ...prev, seatCount: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} {count === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Booking Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Train:</span>
                    <span className="font-medium">{selectedTrain.trainName} ({selectedTrain.trainNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{getStationName(fromStation)} → {getStationName(toStation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span>{getSelectedClassInfo()?.className} ({selectedClass})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingData.seatCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Date:</span>
                    <span>{travelDate ? format(travelDate, "PPP") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{selectedTrain.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedTrain.duration}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span className="flex items-center text-green-600">
                      <IndianRupee className="h-4 w-4" />
                      {getSelectedClassInfo() ? getSelectedClassInfo()!.currentPrice * bookingData.seatCount : 0}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!selectedTrain || isLoading || !getSelectedClassInfo() || getSelectedClassInfo()!.availableSeats < bookingData.seatCount}
              >
                {isLoading ? "Processing Booking..." : "Confirm Booking"}
              </Button>
            </form>

            {(bookingStatus as string) === "success" && bookedTicketDetails && (
              <div className="mt-4">
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {bookedTicketDetails.redirected ? (
                      <div>
                        <strong>Redirected to IRCTC!</strong> 
                        <p className="mt-2">You have been redirected to the official IRCTC website for real ticket booking.</p>
                        <p className="text-sm mt-1">Complete your payment on IRCTC to confirm your booking.</p>
                      </div>
                    ) : (
                      <strong>Booking Successful!</strong>
                    )}
                  </AlertDescription>
                </Alert>

                {bookedTicketDetails.redirected && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Journey Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Train:</span>
                        <p className="text-gray-900">{bookedTicketDetails.trainName} ({bookedTicketDetails.trainNumber})</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Route:</span>
                        <p className="text-gray-900">{bookedTicketDetails.fromStation} → {bookedTicketDetails.toStation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <p className="text-gray-900">{bookedTicketDetails.travelDate}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Class:</span>
                        <p className="text-gray-900">{bookedTicketDetails.className}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <Button 
                        onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open IRCTC
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setBookingStatus("idle")
                          setBookedTicketDetails(null)
                        }}
                      >
                        Search Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {bookingStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showTrainResults && availableTrains.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <TrainIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Trains Found</h3>
            <p className="text-gray-500 mb-4">
              No direct trains are available between the selected stations on the chosen date.
            </p>
            <div className="text-sm text-gray-600 max-w-md mx-auto">
              <p className="mb-2"><strong>Suggestions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try different travel dates</li>
                <li>Check connecting routes via major junctions</li>
                <li>Consider nearby stations</li>
                <li>Book tickets directly from IRCTC for more options</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Footer */}
      <div className="bg-blue-50 rounded-lg p-4 text-center text-sm text-blue-800">
        <p>
          <strong>{karnatakaStations.length} Stations</strong> | 
          <strong>{karnatakaTrains.length} Trains</strong> | 
          Real-time Booking Available
        </p>
      </div>
        </>
      )}
    </div>
  )
}
