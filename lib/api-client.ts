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
  connect: () => void
  disconnect: () => void
  setTrains: (trains: TrainStatus[]) => void
}

export const useTrainDataStore = create<TrainDataState>((set, get) => ({
  trains: [],
  isConnected: false,
  connectionType: "offline",
  lastUpdate: null,
  error: null,
  connect: () => {
    initializeConnection()
  },
  disconnect: () => {
    cleanup()
    set({ isConnected: false, connectionType: "offline" })
  },
  setTrains: (trains: TrainStatus[]) => {
    set({ trains, lastUpdate: new Date() })
  },
}))

let pollingInterval: NodeJS.Timeout | null = null

function cleanup() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

async function initializeConnection() {
  await loadInitialData()
  startPolling()
}

async function loadInitialData() {
  try {
    const trains = await fetchTrainData()
    useTrainDataStore.getState().setTrains(trains)
  } catch (error) {
    console.error("Failed to load initial data:", error)
    const mockTrains = getMockTrainData()
    useTrainDataStore.getState().setTrains(mockTrains)
  }
}

function startPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }

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
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.trains
  } catch (error) {
    console.error("Error fetching train data:", error)
    throw error
  }
}

function getMockTrainData(): TrainStatus[] {
  return [
    {
      id: "12628",
      name: "Karnataka Express",
      trainNumber: "12628",
      currentStation: "SBC",
      speed: 80,
      occupancy: 70,
      temperature: 25,
      humidity: 50,
      nextStation: "TK",
      estimatedArrival: "10:45 AM",
      delay: 0,
      status: "on-time",
      lastUpdated: new Date().toISOString(),
      latitude: 12.9716,
      longitude: 77.5946,
      heading: 45,
      destination: "New Delhi",
    },
    {
      id: "16022",
      name: "Kaveri Express",
      trainNumber: "16022",
      currentStation: "MYS",
      speed: 65,
      occupancy: 85,
      temperature: 27,
      humidity: 60,
      nextStation: "MYA",
      estimatedArrival: "02:30 PM",
      delay: 10,
      status: "delayed",
      lastUpdated: new Date().toISOString(),
      latitude: 12.2958,
      longitude: 76.6394,
      heading: 180,
      destination: "Chennai",
    },
    {
      id: "17326",
      name: "Vishwamanava Express",
      trainNumber: "17326",
      currentStation: "SBC",
      speed: 0,
      occupancy: 40,
      temperature: 23,
      humidity: 40,
      nextStation: "Departing Soon",
      estimatedArrival: "11:30 AM",
      delay: 5,
      status: "stopped",
      lastUpdated: new Date().toISOString(),
      latitude: 12.9716,
      longitude: 77.5946,
      heading: 0,
      destination: "Mysuru",
    },
  ]
}

export function startMockUpdates() {
  const { connectionType } = useTrainDataStore.getState()
  if (connectionType !== "offline") return

  console.info("[api-client] Starting mock train-data updates")
  startPolling()
}
