// API response types

import { PNRStatus, Train, Station } from './railway'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PNRResponse {
  success: boolean
  data: PNRStatus
  cached: boolean
}

export interface TrainListResponse {
  trains: Train[]
  total: number
}

export interface StationListResponse {
  stations: Station[]
  total: number
}