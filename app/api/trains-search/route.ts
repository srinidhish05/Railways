import { NextResponse } from "next/server"
import { karnatakaTrains, searchTrains, searchTrainsBetweenStations, getTrainByNumber } from "@/data/karnataka-trains"

// Rate limiting store
const searchLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const query = searchParams.get("query")
  const trainNumber = searchParams.get("trainNumber")
  const type = searchParams.get("type")
  const date = searchParams.get("date")
  const class_type = searchParams.get("class")
  const limit = searchParams.get("limit")
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
  
  try {
    // Rate limiting: 20 searches per minute per IP
    if (!checkSearchRateLimit(clientIP)) {
      return NextResponse.json({
        success: false,
        error: "Rate limit exceeded",
        message: "Too many search requests. Please wait before searching again.",
        retryAfter: 60
      }, { status: 429 })
    }

    // Add realistic search delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    let trains = karnatakaTrains
    let searchType = "all"
    
    // Search by train number (highest priority)
    if (trainNumber) {
      const train = getTrainByNumber(trainNumber)
      searchType = "trainNumber"
      
      return NextResponse.json({
        success: true,
        searchType,
        total: train ? 1 : 0,
        returned: train ? 1 : 0,
        query: { trainNumber },
        trains: train ? [addSafetyFields(train)] : [],
        timestamp: new Date().toISOString(),
        message: train ? "Train found" : "Train number not found in Karnataka network"
      })
    }
    
    // Search between stations (route search)
    if (from && to) {
      trains = searchTrainsBetweenStations(from, to)
      searchType = "route"
      const safeClassType = class_type ?? undefined;
      return NextResponse.json({
        success: true,
        searchType,
        total: karnatakaTrains.length,
        returned: trains.length,
        route: `${from.toUpperCase()} → ${to.toUpperCase()}`,
        query: { from, to, date, class: safeClassType },
        trains: trains.map(train => {
          const t = {
            ...train,
            estimatedJourneyTime: calculateJourneyTime(train, from, to),
            availableClasses: getAvailableClasses(train),
            fareEstimate: calculateFareEstimate(train, from, to, safeClassType)
          };
          return addSafetyFields(t);
        }),
        timestamp: new Date().toISOString(),
        message: trains.length > 0 
          ? `Found ${trains.length} trains on this route` 
          : "No trains found for this route"
      })
    }
    
    // Search by query (train name/number partial match)
    if (query && query.length >= 2) {
      trains = searchTrains(query)
      searchType = "query"
    }
    
    // Filter by train type
    if (type) {
      trains = trains.filter(train => train.type.toLowerCase() === type.toLowerCase())
      searchType = searchType === "all" ? "type" : `${searchType}+type`
    }

    // Filter by class availability
    if (class_type) {
      trains = trains.filter(train => 
        Array.isArray(train.classes) && train.classes.some((cls: string) => {
          return cls.toLowerCase() === class_type.toLowerCase();
        })
      )
    }
    
    // Apply limit if provided
    const limitNum = limit ? parseInt(limit) : 50 // Default limit
    if (limitNum && trains.length > limitNum) {
      trains = trains.slice(0, limitNum)
    }
    
    const safeQuery = query ?? undefined;
    const safeType = type ?? undefined;
    return NextResponse.json({
      success: true,
      searchType,
      total: karnatakaTrains.length,
      returned: trains.length,
      filters: { 
        query: safeQuery, 
        type: safeType, 
        class: class_type ?? undefined, 
        date,
        limit: limitNum 
      },
      trains: trains.map(train => {
        const t = {
          ...train,
          ...(safeQuery && { relevanceScore: calculateRelevanceScore(train, safeQuery) })
        };
        return addSafetyFields(t);
      }),
      timestamp: new Date().toISOString(),
      suggestions: trains.length === 0 ? generateSearchSuggestions(safeQuery, safeType) : null
    })
    
  } catch (error) {
    console.error("Error in train search:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to search trains",
        message: "An error occurred while searching. Please try again.",
        trains: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Rate limiting function
function checkSearchRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const limit = searchLimitStore.get(clientIP)

  if (!limit || now > limit.resetTime) {
    searchLimitStore.set(clientIP, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (limit.count >= 20) return false
  
  limit.count++
  return true
}

// Helper functions
// Add safety/collision monitoring fields to train object
function addSafetyFields(train: any) {
  let collisionRisk = "low";
  let safetyStatus = "safe";
  let safetyAlerts: string[] = [];
  if (train.speed && train.occupancy && train.speed > 80 && train.occupancy > 90) {
    collisionRisk = "medium";
    safetyStatus = "caution";
    safetyAlerts.push("High speed and occupancy detected. Monitor for safety.");
  }
  if (train.delay && train.delay > 10) {
    safetyAlerts.push("Significant delay. Check for operational issues.");
  }
  if (train.status && (train.status === "stopped" || train.status === "delayed" || train.status === "on-time")) {
    collisionRisk = "low";
    safetyStatus = "safe";
  }
  if (train.temperature && train.temperature > 32) {
    safetyAlerts.push("High temperature in coaches. Monitor passenger comfort.");
  }
  return {
    ...train,
    collisionRisk,
    safetyStatus,
    safetyAlerts
  };
}
function calculateJourneyTime(train: any, from: string, to: string): string {
  // Mock calculation - in production, this would use actual station timings
  const baseTime = Math.floor(Math.random() * 8) + 4 // 4-12 hours
  return `${baseTime}h ${Math.floor(Math.random() * 60)}m`
}

function getAvailableClasses(train: any): string[] {
  return train.classes || ["SL", "3A", "2A", "1A"]
}

function calculateFareEstimate(train: any, from: string, to: string, classType?: string): any {
  // Mock fare calculation
  const baseFares = {
    "SL": Math.floor(Math.random() * 500) + 200,
    "3A": Math.floor(Math.random() * 800) + 600,
    "2A": Math.floor(Math.random() * 1200) + 900,
    "1A": Math.floor(Math.random() * 2000) + 1500,
    "CC": Math.floor(Math.random() * 400) + 300
  }
  
  const classKey = classType ? classType.toUpperCase() : undefined;
  if (classKey && Object.prototype.hasOwnProperty.call(baseFares, classKey)) {
    return {
      class: classKey,
      fare: baseFares[classKey as keyof typeof baseFares],
      currency: "INR"
    }
  }
  
  return {
    available: Object.entries(baseFares).map(([cls, fare]) => ({
      class: cls,
      fare,
      currency: "INR"
    }))
  }
}

function calculateRelevanceScore(train: any, query: string): number {
  const lowerQuery = query.toLowerCase()
  const trainName = train.name.toLowerCase()
  const trainNumber = train.trainNumber.toString()
  
  let score = 0
  
  // Exact matches get highest score
  if (trainNumber === lowerQuery) score += 100
  if (trainName === lowerQuery) score += 90
  
  // Partial matches
  if (trainNumber.includes(lowerQuery)) score += 80
  if (trainName.includes(lowerQuery)) score += 70
  
  // Word matches
  const queryWords = lowerQuery.split(' ')
  const nameWords = trainName.split(' ')
  
  queryWords.forEach((qWord: string) => {
    nameWords.forEach((nWord: string) => {
      if (nWord.includes(qWord)) score += 30
    })
  })
  
  return score
}

function generateSearchSuggestions(query?: string, type?: string): string[] {
  const suggestions = [
    "Try searching with train number (e.g., 12628)",
    "Search by train name (e.g., Karnataka Express)",
    "Use station codes for route search (e.g., SBC to NDLS)",
    "Filter by train type: Express, Passenger, Superfast"
  ]
  
  if (query && query.length < 2) {
    suggestions.unshift("Search query should be at least 2 characters long")
  }
  
  return suggestions
}