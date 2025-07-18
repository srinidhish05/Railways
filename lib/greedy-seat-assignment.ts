export interface Passenger {
  id: string
  name: string
  age: number
  gender: "M" | "F" | "T"
  isDisabled: boolean
  isPregnant: boolean
  isSeniorCitizen: boolean
  preference: "window" | "aisle" | "middle" | "any"
  groupId?: string
}

export interface Seat {
  id: string
  number: string
  type: "window" | "aisle" | "middle"
  isAvailable: boolean
  coach: string
  priority: number
}

export interface SeatAssignment {
  passengerId: string
  seatId: string
  score: number
  reasoning: string[]
}

export class GreedySeatAssignment {
  private passengers: Passenger[]
  private seats: Seat[]
  private assignments: SeatAssignment[]

  constructor(passengers: Passenger[], seats: Seat[]) {
    this.passengers = passengers
    this.seats = seats.filter((seat) => seat.isAvailable)
    this.assignments = []
  }

  // Calculate priority score for passenger-seat combination
  private calculateScore(passenger: Passenger, seat: Seat): { score: number; reasoning: string[] } {
    let score = 0
    const reasoning: string[] = []

    // Age-based priority (higher score for elderly and children)
    if (passenger.isSeniorCitizen || passenger.age >= 60) {
      score += 50
      reasoning.push("Senior citizen priority")
    }
    if (passenger.age <= 12) {
      score += 30
      reasoning.push("Child passenger priority")
    }

    // Disability and pregnancy priority
    if (passenger.isDisabled) {
      score += 60
      reasoning.push("Disabled passenger priority")
    }
    if (passenger.isPregnant) {
      score += 55
      reasoning.push("Pregnant passenger priority")
    }

    // Gender-based considerations
    if (passenger.gender === "F") {
      score += 20
      reasoning.push("Female passenger consideration")
    }

    // Seat preference matching
    if (passenger.preference === seat.type) {
      score += 25
      reasoning.push(`Preferred ${seat.type} seat`)
    } else if (passenger.preference === "any") {
      score += 10
      reasoning.push("Flexible seating preference")
    }

    // Window seat priority for children and elderly
    if (seat.type === "window" && (passenger.age <= 12 || passenger.isSeniorCitizen)) {
      score += 15
      reasoning.push("Window seat for comfort")
    }

    // Aisle seat priority for disabled passengers
    if (seat.type === "aisle" && passenger.isDisabled) {
      score += 20
      reasoning.push("Aisle seat for accessibility")
    }

    // Coach preference (lower berth for elderly/disabled)
    if (seat.coach.includes("SL") && (passenger.isSeniorCitizen || passenger.isDisabled)) {
      score += 10
      reasoning.push("Lower berth preference")
    }

    return { score, reasoning }
  }

  // Group passengers together
  private handleGroupAssignments(): void {
    const groups = new Map<string, Passenger[]>()

    // Group passengers by groupId
    this.passengers.forEach((passenger) => {
      if (passenger.groupId) {
        if (!groups.has(passenger.groupId)) {
          groups.set(passenger.groupId, [])
        }
        groups.get(passenger.groupId)!.push(passenger)
      }
    })

    // Assign seats to groups
    groups.forEach((groupPassengers, groupId) => {
      const availableSeats = this.seats.filter(
        (seat) => !this.assignments.some((assignment) => assignment.seatId === seat.id),
      )

      // Find consecutive seats for the group
      const consecutiveSeats = this.findConsecutiveSeats(availableSeats, groupPassengers.length)

      if (consecutiveSeats.length >= groupPassengers.length) {
        // Sort group members by priority
        const sortedGroup = groupPassengers.sort((a, b) => {
          const scoreA = this.calculateScore(a, consecutiveSeats[0]).score
          const scoreB = this.calculateScore(b, consecutiveSeats[0]).score
          return scoreB - scoreA
        })

        // Assign consecutive seats to group
        sortedGroup.forEach((passenger, index) => {
          if (index < consecutiveSeats.length) {
            const seat = consecutiveSeats[index]
            const { score, reasoning } = this.calculateScore(passenger, seat)

            this.assignments.push({
              passengerId: passenger.id,
              seatId: seat.id,
              score: score + 30, // Group bonus
              reasoning: [...reasoning, `Group ${groupId} seating`],
            })
          }
        })
      }
    })
  }

  // Find consecutive seats
  private findConsecutiveSeats(seats: Seat[], count: number): Seat[] {
    const seatsByCoach = new Map<string, Seat[]>()

    seats.forEach((seat) => {
      if (!seatsByCoach.has(seat.coach)) {
        seatsByCoach.set(seat.coach, [])
      }
      seatsByCoach.get(seat.coach)!.push(seat)
    })

    for (const [coach, coachSeats] of seatsByCoach) {
      const sortedSeats = coachSeats.sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))

      for (let i = 0; i <= sortedSeats.length - count; i++) {
        const consecutive = sortedSeats.slice(i, i + count)
        const isConsecutive = consecutive.every((seat, index) => {
          if (index === 0) return true
          return Number.parseInt(seat.number) === Number.parseInt(consecutive[index - 1].number) + 1
        })

        if (isConsecutive) {
          return consecutive
        }
      }
    }

    return []
  }

  // Main assignment algorithm
  public assignSeats(): {
    assignments: SeatAssignment[]
    unassigned: Passenger[]
    statistics: {
      totalPassengers: number
      assignedPassengers: number
      assignmentRate: number
      averageScore: number
      executionTime: number
    }
  } {
    const startTime = performance.now()

    // First, handle group assignments
    this.handleGroupAssignments()

    // Get remaining unassigned passengers
    const assignedPassengerIds = new Set(this.assignments.map((a) => a.passengerId))
    const remainingPassengers = this.passengers.filter((p) => !assignedPassengerIds.has(p.id))

    // Sort remaining passengers by priority (greedy approach)
    const sortedPassengers = remainingPassengers.sort((a, b) => {
      const priorityA = this.getPassengerPriority(a)
      const priorityB = this.getPassengerPriority(b)
      return priorityB - priorityA
    })

    // Assign seats to remaining passengers
    for (const passenger of sortedPassengers) {
      const availableSeats = this.seats.filter(
        (seat) => !this.assignments.some((assignment) => assignment.seatId === seat.id),
      )

      if (availableSeats.length === 0) break

      // Find best seat for this passenger
      let bestSeat: Seat | null = null
      let bestScore = -1
      let bestReasoning: string[] = []

      for (const seat of availableSeats) {
        const { score, reasoning } = this.calculateScore(passenger, seat)
        if (score > bestScore) {
          bestScore = score
          bestSeat = seat
          bestReasoning = reasoning
        }
      }

      if (bestSeat) {
        this.assignments.push({
          passengerId: passenger.id,
          seatId: bestSeat.id,
          score: bestScore,
          reasoning: bestReasoning,
        })
      }
    }

    const endTime = performance.now()
    const executionTime = endTime - startTime

    // Calculate statistics
    const assignedPassengerIds2 = new Set(this.assignments.map((a) => a.passengerId))
    const unassigned = this.passengers.filter((p) => !assignedPassengerIds2.has(p.id))
    const averageScore =
      this.assignments.length > 0 ? this.assignments.reduce((sum, a) => sum + a.score, 0) / this.assignments.length : 0

    return {
      assignments: this.assignments,
      unassigned,
      statistics: {
        totalPassengers: this.passengers.length,
        assignedPassengers: this.assignments.length,
        assignmentRate: (this.assignments.length / this.passengers.length) * 100,
        averageScore,
        executionTime,
      },
    }
  }

  private getPassengerPriority(passenger: Passenger): number {
    let priority = 0
    if (passenger.isDisabled) priority += 100
    if (passenger.isPregnant) priority += 90
    if (passenger.isSeniorCitizen) priority += 80
    if (passenger.age <= 12) priority += 70
    if (passenger.gender === "F") priority += 30
    return priority
  }

  // Get assignment details for a specific passenger
  public getPassengerAssignment(passengerId: string): SeatAssignment | null {
    return this.assignments.find((a) => a.passengerId === passengerId) || null
  }

  // Get seat utilization statistics
  public getSeatUtilization(): {
    totalSeats: number
    assignedSeats: number
    utilizationRate: number
    seatsByType: Record<string, { total: number; assigned: number }>
  } {
    const seatsByType: Record<string, { total: number; assigned: number }> = {}

    this.seats.forEach((seat) => {
      if (!seatsByType[seat.type]) {
        seatsByType[seat.type] = { total: 0, assigned: 0 }
      }
      seatsByType[seat.type].total++
    })

    this.assignments.forEach((assignment) => {
      const seat = this.seats.find((s) => s.id === assignment.seatId)
      if (seat) {
        seatsByType[seat.type].assigned++
      }
    })

    return {
      totalSeats: this.seats.length,
      assignedSeats: this.assignments.length,
      utilizationRate: (this.assignments.length / this.seats.length) * 100,
      seatsByType,
    }
  }
}
