// Component props types

export interface PNRSearchProps {
  onSearch?: (pnr: string) => void
  className?: string
}

export interface TrainCardProps {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  className?: string
}

export interface EmergencyButtonProps {
  type: 'Medical' | 'Fire' | 'Security' | 'Technical'
  onClick?: () => void
  className?: string
}