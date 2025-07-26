// Railway system type definitions

export interface PNRStatus {
  pnrNumber: string
  trainNumber: string
  trainName: string
  journeyDate: string
  from: string
  to: string
  passengers: Passenger[]
  currentStatus: 'CNF' | 'RAC' | 'WL' | 'PQWL' | 'RLWL'
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