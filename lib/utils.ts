import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// CSS class utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Railway-specific utility functions
export class RailwayUtils {
  
  /**
   * Format train number with proper spacing and validation
   */
  static formatTrainNumber(trainNumber: string): string {
    const cleaned = trainNumber.replace(/\D/g, '') // Remove non-digits
    if (cleaned.length !== 5) {
      throw new Error('Train number must be 5 digits')
    }
    return cleaned
  }

  /**
   * Validate Indian train number format
   */
  static isValidTrainNumber(trainNumber: string): boolean {
    const pattern = /^[0-9]{5}$/
    return pattern.test(trainNumber.replace(/\s/g, ''))
  }

  /**
   * Format currency for Indian Railways (₹)
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Format distance with appropriate units
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    } else if (meters < 100000) {
      return `${(meters / 1000).toFixed(1)}km`
    } else {
      return `${Math.round(meters / 1000)}km`
    }
  }

  /**
   * Format duration in human-readable format
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  /**
   * Format speed with units
   */
  static formatSpeed(kmh: number): string {
    return `${Math.round(kmh)} km/h`
  }

  /**
   * Calculate time difference in human-readable format
   */
  static getTimeAgo(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  /**
   * Get safety status color classes
   */
  static getSafetyStatusClasses(status: 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY'): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold'
    
    switch (status) {
      case 'SAFE':
        return cn(baseClasses, 'bg-green-100 text-green-800')
      case 'NEARLY_FULL':
        return cn(baseClasses, 'bg-yellow-100 text-yellow-800')
      case 'FULL':
        return cn(baseClasses, 'bg-orange-100 text-orange-800')
      case 'OVERCAPACITY':
        return cn(baseClasses, 'bg-red-100 text-red-800')
      default:
        return cn(baseClasses, 'bg-gray-100 text-gray-800')
    }
  }

  /**
   * Get risk level color classes for collision detection
   */
  static getRiskLevelClasses(risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): string {
    const baseClasses = 'px-3 py-1 rounded-lg text-sm font-bold'
    
    switch (risk) {
      case 'LOW':
        return cn(baseClasses, 'bg-green-500 text-white')
      case 'MEDIUM':
        return cn(baseClasses, 'bg-yellow-500 text-white')
      case 'HIGH':
        return cn(baseClasses, 'bg-orange-500 text-white')
      case 'CRITICAL':
        return cn(baseClasses, 'bg-red-500 text-white animate-pulse')
      default:
        return cn(baseClasses, 'bg-gray-500 text-white')
    }
  }

  /**
   * Generate unique device/session ID
   */
  static generateId(prefix: string = 'rail'): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${prefix}_${timestamp}_${randomStr}`
  }

  /**
   * Debounce function for API calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  /**
   * Throttle function for real-time updates
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * Validate and format Indian mobile number
   */
  static formatMobileNumber(mobile: string): string {
    const cleaned = mobile.replace(/\D/g, '')
    if (cleaned.length === 10 && cleaned.match(/^[6-9]/)) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`
    }
    throw new Error('Invalid Indian mobile number')
  }

  /**
   * Format PNR number
   */
  static formatPNR(pnr: string): string {
    const cleaned = pnr.replace(/\D/g, '')
    if (cleaned.length !== 10) {
      throw new Error('PNR must be 10 digits')
    }
    return cleaned
  }

  /**
   * Calculate occupancy percentage with color coding
   */
  static getOccupancyDisplay(current: number, total: number): {
    percentage: number
    display: string
    colorClass: string
  } {
    const percentage = Math.round((current / total) * 100)
    const display = `${current}/${total} (${percentage}%)`
    
    let colorClass = 'text-green-600'
    if (percentage >= 95) colorClass = 'text-red-600'
    else if (percentage >= 80) colorClass = 'text-orange-600'
    else if (percentage >= 60) colorClass = 'text-yellow-600'
    
    return { percentage, display, colorClass }
  }

  /**
   * Format Indian Railways station codes
   */
  static formatStationCode(code: string): string {
    return code.toUpperCase().trim()
  }

  /**
   * Parse route string into station array
   */
  static parseRoute(route: string): string[] {
    return route.split('→').map(station => station.trim())
  }

  /**
   * Get relative time for train schedules
   */
  static getRelativeTime(targetTime: number): string {
    const now = Date.now()
    const diff = targetTime - now
    const absMinutes = Math.abs(Math.floor(diff / (1000 * 60)))
    const absHours = Math.abs(Math.floor(diff / (1000 * 60 * 60)))

    if (diff > 0) {
      // Future time
      if (absHours > 0) {
        return `in ${absHours}h ${absMinutes % 60}m`
      }
      return `in ${absMinutes}m`
    } else {
      // Past time
      if (absHours > 0) {
        return `${absHours}h ${absMinutes % 60}m ago`
      }
      return `${absMinutes}m ago`
    }
  }
}

// Convenience exports for common formatting functions
export const formatTrainNumber = RailwayUtils.formatTrainNumber
export const formatCurrency = RailwayUtils.formatCurrency
export const formatDistance = RailwayUtils.formatDistance
export const formatDuration = RailwayUtils.formatDuration
export const formatSpeed = RailwayUtils.formatSpeed
export const getTimeAgo = RailwayUtils.getTimeAgo
export const getSafetyStatusClasses = RailwayUtils.getSafetyStatusClasses
export const getRiskLevelClasses = RailwayUtils.getRiskLevelClasses
export const generateId = RailwayUtils.generateId
export const debounce = RailwayUtils.debounce
export const throttle = RailwayUtils.throttle

// Type exports for better TypeScript integration
export type SafetyStatus = 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'