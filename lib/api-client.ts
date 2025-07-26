import { create } from "zustand"

export interface TrainStatus {
  id: string
  name: string
  trainNumber: string
  currentStation: string
  speed: number
  occupancy: number
  temperature: number
  humidity: number
  nextStation: string
  estimatedArrival: string
  delay: number
  status: "on-time" | "delayed" | "stopped"
  lastUpdated: string
  latitude: number
  longitude: number
  heading: number
  destination: string
  collisionRisk?: number
}

interface TrainDataState {
  trains: TrainStatus[]
  isConnected: boolean
  connectionType: "websocket" | "polling" | "offline"
  lastUpdate: Date | null
  error: string | null
  retryCount: number
  connect: () => void
  disconnect: () => void
  setTrains: (trains: TrainStatus[]) => void
  setError: (error: string | null) => void
}

export const useTrainDataStore = create<TrainDataState>((set, get) => ({
  trains: [],
  isConnected: false,
  connectionType: "offline",
  lastUpdate: null,
  error: null,
  retryCount: 0,
  connect: () => {
    initializeConnection()
  },
  disconnect: () => {
    cleanup()
    set({ isConnected: false, connectionType: "offline", error: null })
  },
  setTrains: (trains: TrainStatus[]) => {
    set({ trains, lastUpdate: new Date(), error: null, retryCount: 0 })
  },
  setError: (error: string | null) => {
    set({ error })
  },
}))

let pollingInterval: NodeJS.Timeout | null = null
let reconnectTimeout: NodeJS.Timeout | null = null

function cleanup() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
}

async function initializeConnection() {
  const { retryCount } = useTrainDataStore.getState()
  
  try {
    await loadInitialData()
    startPolling()
  } catch (error) {
    console.error("Connection initialization failed:", error)
    
    // Exponential backoff for reconnection
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000) // Max 30 seconds
    useTrainDataStore.setState({ 
      retryCount: retryCount + 1,
      error: `Connection failed. Retrying in ${delay/1000}s...`
    })
    
    reconnectTimeout = setTimeout(() => {
      initializeConnection()
    }, delay)
  }
}

async function loadInitialData() {
  try {
    const trains = await fetchTrainData()
    useTrainDataStore.getState().setTrains(trains)
    console.info(`[api-client] Loaded ${trains.length} trains successfully`)
  } catch (error) {
    console.warn("Failed to load live data, using mock data:", error)
    const mockTrains = getMockTrainData()
    useTrainDataStore.getState().setTrains(mockTrains)
    useTrainDataStore.getState().setError("Using offline data - limited functionality")
  }
}

function startPolling() {
  cleanup() // Clear any existing intervals
  
  useTrainDataStore.setState({
    isConnected: true,
    connectionType: "polling",
    error: null,
  })

  pollingInterval = setInterval(async () => {
    try {
      const trains = await fetchTrainData()
      useTrainDataStore.getState().setTrains(trains)
    } catch (error) {
      console.error("Polling failed:", error)
      const { retryCount } = useTrainDataStore.getState()
      
      if (retryCount < 3) {
        useTrainDataStore.setState({ 
          retryCount: retryCount + 1,
          error: `Connection issues (${retryCount + 1}/3). Retrying...`
        })
      } else {
        // Fall back to mock data after 3 failures
        console.warn("Multiple polling failures, switching to mock data")
        const mockTrains = getMockTrainData()
        useTrainDataStore.getState().setTrains(mockTrains)
        useTrainDataStore.setState({ 
          connectionType: "offline",
          error: "Offline mode - using simulated data"
        })
      }
    }
  }, 3000)
}

export async function fetchTrainData(): Promise<TrainStatus[]> {
  try {
    const response = await fetch("/api/trains", {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data || !Array.isArray(data.trains)) {
      throw new Error("Invalid response format")
    }

    return data.trains
  } catch (error) {
    console.error("Error fetching train data:", error)
    throw error
  }
}

function getMockTrainData(): TrainStatus[] {
  // Add realistic variation to mock data
  const baseTime = Date.now()
  
  return [
    {
      id: "12628",
      name: "Karnataka Express",
      trainNumber: "12628",
      currentStation: "SBC",
      speed: 75 + Math.random() * 10, // Realistic speed variation
      occupancy: 65 + Math.random() * 20,
      temperature: 24 + Math.random() * 4,
      humidity: 45 + Math.random() * 15,
      nextStation: "TK",
      estimatedArrival: "10:45 AM",
      delay: Math.floor(Math.random() * 5), // Random small delays
      status: "on-time",
      lastUpdated: new Date(baseTime - Math.random() * 30000).toISOString(),
      latitude: 12.9716 + (Math.random() - 0.5) * 0.01, // Small position variation
      longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
      heading: 45 + (Math.random() - 0.5) * 10,
      destination: "New Delhi",
      collisionRisk: Math.random() * 0.1, // Low risk simulation
    },
    {
      id: "16022",
      name: "Kaveri Express",
      trainNumber: "16022",
      currentStation: "MYS",
      speed: 60 + Math.random() * 15,
      occupancy: 80 + Math.random() * 15,
      temperature: 26 + Math.random() * 3,
      humidity: 55 + Math.random() * 15,
      nextStation: "MYA",
      estimatedArrival: "02:30 PM",
      delay: 8 + Math.floor(Math.random() * 5),
      status: Math.random() > 0.7 ? "delayed" : "on-time",
      lastUpdated: new Date(baseTime - Math.random() * 60000).toISOString(),
      latitude: 12.2958 + (Math.random() - 0.5) * 0.01,
      longitude: 76.6394 + (Math.random() - 0.5) * 0.01,
      heading: 175 + (Math.random() - 0.5) * 20,
      destination: "Chennai",
      collisionRisk: Math.random() * 0.05,
    },
    {
      id: "17326",
      name: "Vishwamanava Express",
      trainNumber: "17326",
      currentStation: "SBC",
      speed: Math.random() > 0.5 ? 0 : 25 + Math.random() * 15,
      occupancy: 35 + Math.random() * 20,
      temperature: 22 + Math.random() * 4,
      humidity: 35 + Math.random() * 20,
      nextStation: "Departing Soon",
      estimatedArrival: "11:30 AM",
      delay: Math.floor(Math.random() * 8),
      status: Math.random() > 0.6 ? "stopped" : "on-time",
      lastUpdated: new Date(baseTime - Math.random() * 45000).toISOString(),
      latitude: 12.9716 + (Math.random() - 0.5) * 0.005,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.005,
      heading: Math.random() * 360,
      destination: "Mysuru",
      collisionRisk: Math.random() * 0.02,
    },
  ]
}

export function startMockUpdates() {
  const { connectionType } = useTrainDataStore.getState()
  if (connectionType !== "offline") return

  console.info("[api-client] Starting mock train-data updates")
  startPolling()
}

// Utility function to get connection status
export function getConnectionStatus() {
  const { isConnected, connectionType, error, lastUpdate } = useTrainDataStore.getState()
  return {
    isConnected,
    connectionType,
    error,
    lastUpdate,
    isHealthy: isConnected && !error && lastUpdate && (Date.now() - lastUpdate.getTime()) < 10000
  }
}

// Initialize connection when module loads
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(() => {
    const { connect } = useTrainDataStore.getState()
    connect()
  }, 1000) // Slight delay to ensure app is ready
}