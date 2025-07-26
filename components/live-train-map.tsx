import { create } from 'zustand'

interface TrainLocation {
  id: string
  name: string
  trainNumber: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  status: "on-time" | "delayed" | "stopped"
  delay: number
  occupancy: number
  currentStation: string
  nextStation: string
  destination: string
  lastUpdated: string
}

interface TrainDataStore {
  trains: TrainLocation[]
  isConnected: boolean
  connectionType: 'websocket' | 'polling' | 'offline'
  error: string | null
  connect: () => void
  disconnect: () => void
  updateTrainPosition: (trainId: string, position: Partial<TrainLocation>) => void
}

// Mock Karnataka train data for real-time tracking
const mockKarnatakaTrains: TrainLocation[] = [
  {
    id: "12628",
    name: "Karnataka Express",
    trainNumber: "12628",
    latitude: 12.9716,
    longitude: 77.5946,
    speed: 85,
    heading: 180,
    status: "on-time",
    delay: 0,
    occupancy: 78,
    currentStation: "KSR Bengaluru City Junction",
    nextStation: "Tumakuru",
    destination: "New Delhi",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "16535",
    name: "Gol Gumbaz Express",
    trainNumber: "16535",
    latitude: 15.3173,
    longitude: 75.7139,
    speed: 72,
    heading: 45,
    status: "delayed",
    delay: 25,
    occupancy: 92,
    currentStation: "Hubballi Junction",
    nextStation: "Davangere",
    destination: "KSR Bengaluru City Junction",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "12976",
    name: "JP Double Decker",
    trainNumber: "12976",
    latitude: 12.2958,
    longitude: 76.6394,
    speed: 0,
    heading: 90,
    status: "stopped",
    delay: 10,
    occupancy: 65,
    currentStation: "Mysuru Junction",
    nextStation: "Mandya",
    destination: "KSR Bengaluru City Junction",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "16515",
    name: "Yesvantpur Karwar Express",
    trainNumber: "16515",
    latitude: 13.022,
    longitude: 77.5385,
    speed: 95,
    heading: 270,
    status: "on-time",
    delay: 0,
    occupancy: 58,
    currentStation: "Yesvantpur Junction",
    nextStation: "Tumakuru",
    destination: "Karwar",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "12864",
    name: "YPR Howrah Express",
    trainNumber: "12864",
    latitude: 14.4667,
    longitude: 75.9167,
    speed: 78,
    heading: 135,
    status: "on-time",
    delay: 5,
    occupancy: 88,
    currentStation: "Davangere",
    nextStation: "Ballari",
    destination: "Howrah Junction",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "17309",
    name: "Mysuru Varanasi Express",
    trainNumber: "17309",
    latitude: 12.8697,
    longitude: 74.842,
    speed: 65,
    heading: 120,
    status: "delayed",
    delay: 15,
    occupancy: 74,
    currentStation: "Mangaluru Junction",
    nextStation: "Udupi",
    destination: "Varanasi",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "16526",
    name: "Island Express",
    trainNumber: "16526",
    latitude: 13.2167,
    longitude: 76.15,
    speed: 88,
    heading: 200,
    status: "on-time",
    delay: 0,
    occupancy: 82,
    currentStation: "Arsikere Junction",
    nextStation: "Hassan",
    destination: "Kanyakumari",
    lastUpdated: new Date().toISOString()
  }
]

export const useTrainDataStore = create<TrainDataStore>((set, get) => ({
  trains: [],
  isConnected: false,
  connectionType: 'offline',
  error: null,

  connect: async () => {
    try {
      set({ error: null, connectionType: 'polling' })
      
      // Simulate API connection delay
      setTimeout(() => {
        set({ 
          trains: mockKarnatakaTrains, 
          isConnected: true,
          connectionType: 'websocket'
        })
      }, 1000)

      // Simulate real-time train movement updates
      const updateInterval = setInterval(() => {
        const { trains, isConnected } = get()
        if (!isConnected) return

        const updatedTrains = trains.map(train => {
          // Simulate realistic train movement
          const speedVariation = (Math.random() - 0.5) * 20 // ±10 km/h variation
          const newSpeed = Math.max(0, Math.min(120, train.speed + speedVariation))
          
          // Only move if train is running (speed > 0)
          let newLat = train.latitude
          let newLng = train.longitude
          
          if (newSpeed > 20) { // Train is moving
            // Move train slightly based on heading and speed
            const movementFactor = (newSpeed / 100000) // Scale movement
            const headingRad = (train.heading * Math.PI) / 180
            
            newLat += Math.cos(headingRad) * movementFactor * (Math.random() * 0.5 + 0.5)
            newLng += Math.sin(headingRad) * movementFactor * (Math.random() * 0.5 + 0.5)
            
            // Keep within Karnataka bounds roughly
            newLat = Math.max(11.5, Math.min(16.5, newLat))
            newLng = Math.max(74, Math.min(78.5, newLng))
          }

          // Randomly update delay
          const delayChange = Math.floor((Math.random() - 0.7) * 3) // Slight bias toward increasing delay
          const newDelay = Math.max(0, train.delay + delayChange)
          
          // Update status based on delay
          let newStatus = train.status
          if (newSpeed < 5) {
            newStatus = "stopped"
          } else if (newDelay > 15) {
            newStatus = "delayed"
          } else if (newDelay <= 5) {
            newStatus = "on-time"
          }

          // Simulate occupancy changes
          const occupancyChange = (Math.random() - 0.5) * 5
          const newOccupancy = Math.max(30, Math.min(100, train.occupancy + occupancyChange))

          return {
            ...train,
            latitude: newLat,
            longitude: newLng,
            speed: Math.round(newSpeed),
            delay: newDelay,
            status: newStatus as "on-time" | "delayed" | "stopped",
            occupancy: Math.round(newOccupancy),
            lastUpdated: new Date().toISOString(),
            // Randomly change heading slightly
            heading: (train.heading + (Math.random() - 0.5) * 10) % 360
          }
        })
        
        set({ trains: updatedTrains })
      }, 2000) // Update every 2 seconds for smooth movement

      // Store interval reference for cleanup
      ;(get() as any).updateInterval = updateInterval

    } catch (error) {
      console.error('Connection error:', error)
      set({ 
        error: 'Failed to connect to train tracking service. Using offline mode.',
        isConnected: false,
        connectionType: 'offline',
        trains: mockKarnatakaTrains // Still show data in offline mode
      })
    }
  },

  disconnect: () => {
    const interval = (get() as any).updateInterval
    if (interval) {
      clearInterval(interval)
    }
    
    set({ 
      isConnected: false, 
      connectionType: 'offline',
      trains: []
    })
  },

  updateTrainPosition: (trainId: string, position: Partial<TrainLocation>) => {
    set(state => ({
      trains: state.trains.map(train =>
        train.id === trainId ? { 
          ...train, 
          ...position, 
          lastUpdated: new Date().toISOString() 
        } : train
      )
    }))
  }
}))

// Real API integration functions (replace mock with these when ready)
export const trainAPI = {
  // Get live train positions from real API
  getLivePositions: async (): Promise<TrainLocation[]> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/trains/live', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_TOKEN', // Add your API token
        },
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.trains || []
    } catch (error) {
      console.error('API Error:', error)
      // Fallback to mock data
      return mockKarnatakaTrains
    }
  },

  // Get specific train details
  getTrainDetails: async (trainNumber: string): Promise<TrainLocation | null> => {
    try {
      const response = await fetch(`/api/trains/${trainNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_TOKEN',
        },
      })
      
      if (!response.ok) {
        throw new Error('Train not found')
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      // Fallback to mock data
      return mockKarnatakaTrains.find(train => train.trainNumber === trainNumber) || null
    }
  },

  // WebSocket connection for real-time updates
  connectWebSocket: (onMessage: (data: TrainLocation[]) => void) => {
    // Replace with your actual WebSocket URL
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'wss://your-api-domain.com/ws/trains')
    
    ws.onopen = () => {
      console.log('🚄 WebSocket connected to train tracking service')
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data.trains || [])
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    ws.onclose = () => {
      console.log('🚄 WebSocket disconnected')
    }
    
    return ws
  }
}

// Export types for use in other components
export type { TrainLocation, TrainDataStore }