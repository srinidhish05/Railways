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
  totalSeats: number
  bookedSeats: number
  allowedOverbooking?: number // Only for general coaches
  maxCapacity: number
}

export interface TrainCapacityData {
  trainNumber: string
  trainName: string
  reservedCoaches: CoachCapacity[]
  generalCoaches: CoachCapacity[]
  totalCapacity: number
  currentOccupancy: number
  safetyStatus: 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY'
}

export class SmartTicketCappingSystem {
  private static readonly GENERAL_OVERBOOKING_LIMIT = 50; // Maximum 50 extra passengers
  private static readonly SAFETY_BUFFER = 0.95; // 95% capacity warning

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
   * Calculate train safety status
   */
  static calculateSafetyStatus(trainData: TrainCapacityData): 'SAFE' | 'NEARLY_FULL' | 'FULL' | 'OVERCAPACITY' {
    const occupancyRatio = trainData.currentOccupancy / trainData.totalCapacity

    if (occupancyRatio >= 1.5) return 'OVERCAPACITY'
    if (occupancyRatio >= 1.0) return 'FULL'
    if (occupancyRatio >= this.SAFETY_BUFFER) return 'NEARLY_FULL'
    return 'SAFE'
  }

  /**
   * Get booking status message for users
   */
  static getBookingStatusMessage(trainData: TrainCapacityData, requestedTickets: number = 1): string {
    const safetyStatus = SmartTicketCappingSystem.calculateSafetyStatus(trainData)

    switch (safetyStatus) {
      case 'SAFE':
        return `✅ Seats Available - ${trainData.totalCapacity - trainData.currentOccupancy} seats remaining`
      
      case 'NEARLY_FULL':
        const remaining = trainData.totalCapacity - trainData.currentOccupancy
        return `⚠️ Limited Seats - Only ${remaining} seats remaining. Book quickly!`
      
      case 'FULL':
        // Check if general coach overbooking is available
        const generalCapacityLeft = trainData.generalCoaches.reduce((total, coach) => {
          const maxCapacity = coach.totalSeats + (coach.allowedOverbooking || this.GENERAL_OVERBOOKING_LIMIT)
          return total + Math.max(0, maxCapacity - coach.bookedSeats)
        }, 0)

        if (generalCapacityLeft >= requestedTickets) {
          return `🚂 Reserved seats full. ${generalCapacityLeft} general tickets available (standing/limited seating)`
        }
        return `🔴 Train Full - Please choose another train or wait for next departure`
      
      case 'OVERCAPACITY':
        return `🚨 OVERCAPACITY - Booking blocked for safety reasons. Please choose alternative train`
      
      default:
        return 'Checking availability...'
    }
  }

  /**
   * Process ticket booking with smart capping
   */
  static processBooking(
    trainData: TrainCapacityData, 
    ticketType: 'reserved' | 'general', 
    requestedSeats: number
  ): { success: boolean; message: string; coachAssigned?: string } {
    
    if (ticketType === 'reserved') {
      // Find available reserved coach
      for (const coach of trainData.reservedCoaches) {
        const availableSeats = coach.totalSeats - coach.bookedSeats
        
        if (availableSeats >= requestedSeats) {
          return {
            success: true,
            message: `✅ Reserved seats confirmed in Coach ${coach.coachType.toUpperCase()}`,
            coachAssigned: `Reserved Coach - ${availableSeats - requestedSeats} seats remaining`
          }
        }
      }
      return {
        success: false,
        message: '🔴 Reserved seats full. Try general coach or another train.'
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
            ? ' ⚠️ Standing/limited seating - train will be crowded'
            : ''
          
          return {
            success: true,
            message: `✅ General tickets confirmed${warningMessage}`,
            coachAssigned: `General Coach - ${availableCapacity - requestedSeats} spots remaining`
          }
        }
      }
      
      return {
        success: false,
        message: '🚨 Coach Full - Please choose another train or wait for next departure'
      }
    }

    return {
      success: false,
      message: 'Invalid ticket type'
    }
  }

  /**
   * Get real-time capacity data for train
   */
  static getTrainCapacityData(trainNumber: string): TrainCapacityData {
    // This would integrate with IRCTC/UTS systems in production
    // For demo purposes, showing sample data
    
    const sampleData: TrainCapacityData = {
      trainNumber: trainNumber,
      trainName: 'Sample Express',
      reservedCoaches: [
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 45, maxCapacity: 72 },
        { coachType: 'reserved', totalSeats: 72, bookedSeats: 60, maxCapacity: 72 }
      ],
      generalCoaches: [
        { 
          coachType: 'general', 
          totalSeats: 100, 
          bookedSeats: 85, 
          allowedOverbooking: 50, 
          maxCapacity: 150 
        }
      ],
      totalCapacity: 244, // 72+72+100
      currentOccupancy: 190, // 45+60+85
      safetyStatus: 'NEARLY_FULL'
    }

    return sampleData
  }

  /**
   * Generate safety report for railway authorities
   */
  static generateSafetyReport(trainData: TrainCapacityData): string {
    const safetyStatus = SmartTicketCappingSystem.calculateSafetyStatus(trainData)
    const occupancyPercentage = ((trainData.currentOccupancy / trainData.totalCapacity) * 100).toFixed(1)
    
    return `
🚂 TRAIN SAFETY REPORT
━━━━━━━━━━━━━━━━━━━━━━
Train: ${trainData.trainName} (${trainData.trainNumber})
Current Occupancy: ${trainData.currentOccupancy}/${trainData.totalCapacity} (${occupancyPercentage}%)
Safety Status: ${safetyStatus}

📊 COACH BREAKDOWN:
Reserved Coaches: ${trainData.reservedCoaches.length} coaches
- Total Capacity: ${trainData.reservedCoaches.reduce((sum, coach) => sum + coach.totalSeats, 0)} seats
- Current Booking: ${trainData.reservedCoaches.reduce((sum, coach) => sum + coach.bookedSeats, 0)} seats

General Coaches: ${trainData.generalCoaches.length} coaches  
- Base Capacity: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.totalSeats, 0)} seats
- With Overbooking: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.maxCapacity, 0)} max
- Current Booking: ${trainData.generalCoaches.reduce((sum, coach) => sum + coach.bookedSeats, 0)} passengers

⚠️ SAFETY RECOMMENDATIONS:
${safetyStatus === 'SAFE' ? '✅ Normal operations - monitoring continued' : ''}
${safetyStatus === 'NEARLY_FULL' ? '⚠️ Approaching capacity - monitor closely' : ''}
${safetyStatus === 'FULL' ? '🔴 Full capacity - restrict further booking' : ''}
${safetyStatus === 'OVERCAPACITY' ? '🚨 OVERCAPACITY - immediate intervention required' : ''}
    `
  }
}

// Export utility functions for easy integration
export const checkReservedAvailability = SmartTicketCappingSystem.canBookReservedSeat
export const checkGeneralAvailability = SmartTicketCappingSystem.canBookGeneralTicket
export const getBookingStatus = SmartTicketCappingSystem.getBookingStatusMessage
export const processSmartBooking = SmartTicketCappingSystem.processBooking
