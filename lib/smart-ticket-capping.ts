/**
 * Smart Ticket Capping & Controlled Overbooking System
 * 
 * This system ensures safe capacity management for both reserved and general coaches
 * by implementing intelligent booking limits and preventing dangerous overcrowding.
 * 
 * Authors: [Your 4 Team Members]
 * Feature Lead: Srinidhi
 */

export interface CoachCapacity {
  coachType: 'reserved' | 'general'
  coachId: string // Added for better tracking
  totalSeats: number
  bookedSeats: number
  allowedOverbooking?: number // Only for general coaches
  maxCapacity: number
  currentWaitingList?: number // Added waiting list tracking
}

export interface TrainCapacityData {
  trainNumber: string
  trainName: string
  reservedCoaches: CoachCapacity[]
  generalCoaches: CoachCapacity[]
  totalCapacity: number
  currentOccupancy: number
  safetyStatus: 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY'
  lastUpdated: number // Added timestamp
  route: string // Added route information
}

export interface BookingResult {
  success: boolean
  message: string
  coachAssigned?: string
  waitingListPosition?: number
  estimatedConfirmation?: string
}

export class SmartTicketCappingSystem {
  private static readonly GENERAL_OVERBOOKING_LIMIT = 50;
  private static readonly SAFETY_BUFFER = 0.95;
  private static readonly MAX_WAITING_LIST = 200; // Added waiting list limit
  private static readonly PEAK_HOUR_MULTIPLIER = 0.8; // Reduced capacity during peak hours

  /**
   * Check if reserved coach booking is allowed
   */
  static canBookReservedSeat(coach: CoachCapacity): boolean {
    if (coach.coachType !== 'reserved') return false
    return coach.bookedSeats < coach.totalSeats
  }

  /**
   * Check if general coach ticket can be issued
   */
  static canBookGeneralTicket(coach: CoachCapacity): boolean {
    if (coach.coachType !== 'general') return false
    
    const maxAllowedCapacity = coach.totalSeats + (coach.allowedOverbooking || this.GENERAL_OVERBOOKING_LIMIT)
    return coach.bookedSeats < maxAllowedCapacity
  }

  /**
   * Check if booking is during peak hours
   */
  static isPeakHour(timestamp: number = Date.now()): boolean {
    const hour = new Date(timestamp).getHours()
    // Peak hours: 7-10 AM and 5-9 PM
    return (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21)
  }

  /**
   * Calculate train safety status with peak hour consideration
   */
  static calculateSafetyStatus(trainData: TrainCapacityData): 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY' {
    let occupancyRatio = trainData.currentOccupancy / trainData.totalCapacity
    
    // Apply peak hour restrictions
    if (this.isPeakHour(trainData.lastUpdated)) {
      occupancyRatio = occupancyRatio / this.PEAK_HOUR_MULTIPLIER
    }

    if (occupancyRatio >= 1.5) return 'OVERCAPACITY'
    if (occupancyRatio >= 1.0) return 'FULL'
    if (occupancyRatio >= this.SAFETY_BUFFER) return 'NEARLY_FULL'
    return 'SAFE'
  }

  /**
   * Get booking status message for users
   */
  static getBookingStatusMessage(trainData: TrainCapacityData, requestedTickets: number = 1): string {
    const safetyStatus = this.calculateSafetyStatus(trainData)
    const isPeak = this.isPeakHour(trainData.lastUpdated)
    const peakWarning = isPeak ? ' (Peak hours - limited capacity)' : ''

    switch (safetyStatus) {
      case 'SAFE':
        const remaining = trainData.totalCapacity - trainData.currentOccupancy
        return `Seats Available - ${remaining} seats remaining${peakWarning}`
      
      case 'NEARLY_FULL':
        const limitedRemaining = trainData.totalCapacity - trainData.currentOccupancy
        return `Limited Seats - Only ${limitedRemaining} seats remaining. Book quickly!${peakWarning}`
      
      case 'FULL':
        const generalCapacityLeft = trainData.generalCoaches.reduce((total, coach) => {
          const maxCapacity = coach.totalSeats + (coach.allowedOverbooking || this.GENERAL_OVERBOOKING_LIMIT)
          return total + Math.max(0, maxCapacity - coach.bookedSeats)
        }, 0)

        if (generalCapacityLeft >= requestedTickets) {
          return `Reserved seats full. ${generalCapacityLeft} general tickets available (standing/limited seating)${peakWarning}`
        }
        return `Train Full - Please choose another train or join waiting list${peakWarning}`
      
      case 'OVERCAPACITY':
        return `OVERCAPACITY - Booking blocked for safety reasons. Please choose alternative train${peakWarning}`
      
      default:
        return 'Checking availability...'
    }
  }

  /**
   * Process ticket booking with smart capping and waiting list
   */
  static processBooking(
    trainData: TrainCapacityData, 
    ticketType: 'reserved' | 'general', 
    requestedSeats: number
  ): BookingResult {
    
    if (ticketType === 'reserved') {
      // Find available reserved coach
      for (const coach of trainData.reservedCoaches) {
        const availableSeats = coach.totalSeats - coach.bookedSeats
        
        if (availableSeats >= requestedSeats) {
          return {
            success: true,
            message: `Reserved seats confirmed in Coach ${coach.coachId}`,
            coachAssigned: `Reserved Coach ${coach.coachId} - ${availableSeats - requestedSeats} seats remaining`
          }
        }
      }

      // Check waiting list availability
      const totalWaitingList = trainData.reservedCoaches.reduce((sum, coach) => 
        sum + (coach.currentWaitingList || 0), 0)
      
      if (totalWaitingList < this.MAX_WAITING_LIST) {
        return {
          success: true,
          message: 'Added to waiting list - high confirmation chances',
          waitingListPosition: totalWaitingList + 1,
          estimatedConfirmation: 'Within 2-3 days before departure'
        }
      }

      return {
        success: false,
        message: 'Reserved seats and waiting list both full. Try general coach or another train.'
      }
    }

    if (ticketType === 'general') {
      // Check general coach capacity with overbooking
      for (const coach of trainData.generalCoaches) {
        const maxCapacity = coach.totalSeats + (coach.allowedOverbooking || this.GENERAL_OVERBOOKING_LIMIT)
        const availableCapacity = maxCapacity - coach.bookedSeats
        
        if (availableCapacity >= requestedSeats) {
          const isOverbooking = coach.bookedSeats >= coach.totalSeats
          const warningMessage = isOverbooking 
            ? ' - Standing/limited seating, train will be crowded'
            : ''
          
          return {
            success: true,
            message: `General tickets confirmed${warningMessage}`,
            coachAssigned: `General Coach ${coach.coachId} - ${availableCapacity - requestedSeats} spots remaining`
          }
        }
      }
      
      return {
        success: false,
        message: 'Coach Full - Please choose another train or wait for next departure'
      }
    }

    return {
      success: false,
      message: 'Invalid ticket type'
    }
  }

  /**
   * Get real-time capacity data for train with realistic Karnataka data
   */
  static getTrainCapacityData(trainNumber: string): TrainCapacityData {
    // Enhanced sample data based on actual Karnataka Express configuration
    const sampleData: TrainCapacityData = {
      trainNumber: trainNumber,
      trainName: trainNumber === '12628' ? 'Karnataka Express' : 'Sample Express',
      reservedCoaches: [
        { 
          coachType: 'reserved', 
          coachId: 'A1', 
          totalSeats: 72, 
          bookedSeats: 45, 
          maxCapacity: 72,
          currentWaitingList: 12
        },
        { 
          coachType: 'reserved', 
          coachId: 'B1', 
          totalSeats: 72, 
          bookedSeats: 60, 
          maxCapacity: 72,
          currentWaitingList: 8
        }
      ],
      generalCoaches: [
        { 
          coachType: 'general', 
          coachId: 'GS1',
          totalSeats: 100, 
          bookedSeats: 85, 
          allowedOverbooking: 50, 
          maxCapacity: 150,
          currentWaitingList: 0
        }
      ],
      totalCapacity: 244,
      currentOccupancy: 190,
      safetyStatus: 'NEARLY_FULL',
      lastUpdated: Date.now(),
      route: 'Bangalore City → New Delhi'
    }

    // Recalculate safety status
    sampleData.safetyStatus = this.calculateSafetyStatus(sampleData)
    
    return sampleData
  }

  /**
   * Generate enhanced safety report for railway authorities
   */
  static generateSafetyReport(trainData: TrainCapacityData): string {
    const safetyStatus = this.calculateSafetyStatus(trainData)
    const occupancyPercentage = ((trainData.currentOccupancy / trainData.totalCapacity) * 100).toFixed(1)
    const isPeak = this.isPeakHour(trainData.lastUpdated)
    const totalWaitingList = [...trainData.reservedCoaches, ...trainData.generalCoaches]
      .reduce((sum, coach) => sum + (coach.currentWaitingList || 0), 0)
    
    return `
TRAIN SAFETY REPORT
==========================================
Train: ${trainData.trainName} (${trainData.trainNumber})
Route: ${trainData.route}
Last Updated: ${new Date(trainData.lastUpdated).toLocaleString()}
Peak Hours: ${isPeak ? 'YES - Enhanced monitoring' : 'NO'}

CAPACITY STATUS:
Current Occupancy: ${trainData.currentOccupancy}/${trainData.totalCapacity} (${occupancyPercentage}%)
Safety Status: ${safetyStatus}
Total Waiting List: ${totalWaitingList} passengers

COACH BREAKDOWN:
Reserved Coaches: ${trainData.reservedCoaches.length} coaches
- Total Capacity: ${trainData.reservedCoaches.reduce((sum, coach) => sum + coach.totalSeats, 0)} seats
- Current Booking: ${trainData.reservedCoaches.reduce((sum, coach) => sum + coach.bookedSeats, 0)} seats
- Waiting List: ${trainData.reservedCoaches.reduce((sum, coach) => sum + (coach.currentWaitingList || 0), 0)} passengers

General Coaches: ${trainData.generalCoaches.length} coaches  
- Base Capacity: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.totalSeats, 0)} seats
- With Overbooking: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.maxCapacity, 0)} max
- Current Booking: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.bookedSeats, 0)} passengers

SAFETY RECOMMENDATIONS:
${safetyStatus === 'SAFE' ? '- Normal operations - monitoring continued' : ''}
${safetyStatus === 'NEARLY_FULL' ? '- Approaching capacity - monitor closely' : ''}
${safetyStatus === 'FULL' ? '- Full capacity - restrict further booking' : ''}
${safetyStatus === 'OVERCAPACITY' ? '- OVERCAPACITY - immediate intervention required' : ''}
${isPeak ? '- Peak hour operations - enhanced safety protocols active' : ''}
${totalWaitingList > 100 ? '- High waiting list - consider additional trains' : ''}
    `
  }

  /**
   * Get waiting list statistics
   */
  static getWaitingListStats(trainData: TrainCapacityData): {
    totalWaitingList: number
    reservedWaitingList: number
    estimatedConfirmationRate: number
  } {
    const reservedWaitingList = trainData.reservedCoaches
      .reduce((sum, coach) => sum + (coach.currentWaitingList || 0), 0)
    
    const totalWaitingList = [...trainData.reservedCoaches, ...trainData.generalCoaches]
      .reduce((sum, coach) => sum + (coach.currentWaitingList || 0), 0)
    
    // Historical confirmation rate calculation (simplified)
    const estimatedConfirmationRate = Math.max(0, Math.min(95, 
      80 - (totalWaitingList / this.MAX_WAITING_LIST) * 30))
    
    return {
      totalWaitingList,
      reservedWaitingList,
      estimatedConfirmationRate
    }
  }
}

// Enhanced utility exports
export const checkReservedAvailability = SmartTicketCappingSystem.canBookReservedSeat
export const checkGeneralAvailability = SmartTicketCappingSystem.canBookGeneralTicket
export const getBookingStatus = SmartTicketCappingSystem.getBookingStatusMessage
export const processSmartBooking = SmartTicketCappingSystem.processBooking
export const getCapacityData = SmartTicketCappingSystem.getTrainCapacityData
export const generateSafetyReport = SmartTicketCappingSystem.generateSafetyReport
export const getWaitingListStats = SmartTicketCappingSystem.getWaitingListStats