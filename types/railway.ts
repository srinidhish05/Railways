// Railway system type definitions

export interface PNRStatus {
  pnr: string
  trainNumber: string
  trainName: string
  fromStation: string
  toStation: string
  fromStationName: string
  toStationName: string
  doj: string
  class: string
  quota: string
  passengers: any[]
  chartPrepared: boolean
  status: string
  currentStatusMessage: string
  departureTime: string
  arrivalTime: string
  distance: string
  duration: string
  boardingStation: string
  reservationUpto: string
  lastUpdated: string
  bookingDate: string
  totalFare: number
  ticketType: string
  platform: string
  trainDelay: number
  coachPosition: string
  foodAvailable: boolean
  acAvailable: boolean
}

export interface Passenger {
  name: string
  age: number
  gender: 'M' | 'F'
  seatNumber?: string
  status: 'CNF' | 'RAC' | 'WL'
}

export interface Train {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
}

export interface Station {
  stationCode: string
  stationName: string
  state: string
  latitude: number
  longitude: number
}

export interface EmergencyContact {
  id: string
  name: string
  phoneNumber: string
  department: string
  type: 'Medical' | 'Fire' | 'Security' | 'Technical'
}