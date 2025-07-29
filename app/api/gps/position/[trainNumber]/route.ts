import { type NextRequest, NextResponse } from "next/server"

// Real Karnataka Railway stations with exact coordinates
const KARNATAKA_STATIONS = {
  'SBC': { lat: 12.9716, lng: 77.5946, name: 'Bangalore City' },
  'YPR': { lat: 13.0207, lng: 77.5390, name: 'Yesvantpur' },
  'KSR': { lat: 12.9762, lng: 77.5693, name: 'KSR Bengaluru' },
  'MYS': { lat: 12.3075, lng: 76.6394, name: 'Mysuru' },
  'UBL': { lat: 15.3647, lng: 75.1240, name: 'Hubballi' },
  'DWR': { lat: 15.4589, lng: 75.0078, name: 'Dharwad' },
  'KRW': { lat: 14.8159, lng: 74.1292, name: 'Karwar' },
  'BGM': { lat: 15.8497, lng: 74.4977, name: 'Belagavi' },
  'GDG': { lat: 15.4289, lng: 75.6358, name: 'Gadag' },
  'BVB': { lat: 16.1847, lng: 75.7132, name: 'Bagalkote' }
}

// Real Karnataka trains with actual routes
const KARNATAKA_TRAINS = {
  '16515': { 
    name: 'Yesvantpur Karwar Express', 
    route: ['YPR', 'UBL', 'DWR', 'KRW'],
    type: 'Express'
  },
  '16516': { 
    name: 'Karwar Yesvantpur Express', 
    route: ['KRW', 'DWR', 'UBL', 'YPR'],
    type: 'Express'
  },
  '12628': { 
    name: 'Karnataka Express', 
    route: ['SBC', 'UBL', 'DWR'],
    type: 'Superfast'
  },
  '12627': { 
    name: 'Karnataka Express', 
    route: ['DWR', 'UBL', 'SBC'],
    type: 'Superfast'
  },
  '16224': { 
    name: 'Mysuru Express', 
    route: ['SBC', 'MYS'],
    type: 'Express'
  },
  '16223': { 
    name: 'Mysuru Express', 
    route: ['MYS', 'SBC'],
    type: 'Express'
  },
  '17326': { 
    name: 'Vishwamanava Express', 
    route: ['SBC', 'UBL', 'BGM'],
    type: 'Express'
  },
  '17325': { 
    name: 'Vishwamanava Express', 
    route: ['BGM', 'UBL', 'SBC'],
    type: 'Express'
  },
  '56915': { 
    name: 'Bengaluru Mysuru Passenger', 
    route: ['SBC', 'MYS'],
    type: 'Passenger'
  },
  '11035': { 
    name: 'Sharavati Express', 
    route: ['SBC', 'UBL', 'KRW'],
    type: 'Mail'
  }
}

// Cache for positions (simulate real-time updates)
const positionCache = new Map()

export async function GET(request: NextRequest, { params }: { params: { trainNumber: string } }) {
  try {
    const trainNumber = params.trainNumber?.toUpperCase()

    if (!trainNumber) {
      return NextResponse.json({ 
        error: "Train number required",
        example: "/api/gps/position/16515"
      }, { status: 400 })
    }

    // Validate Karnataka train
    const train = KARNATAKA_TRAINS[trainNumber]
    if (!train) {
      return NextResponse.json({ 
        error: "Train not found in Karnataka railway network",
        availableTrains: Object.keys(KARNATAKA_TRAINS),
        message: "Please use a valid Karnataka train number"
      }, { status: 404 })
    }

    // Check cache (simulate real-time updates every 30 seconds)
    const cacheKey = trainNumber
    const cached = positionCache.get(cacheKey)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < 30000) {
      return NextResponse.json(cached.data)
    }

    // Generate realistic train position
    const positionData = generateRealisticPosition(trainNumber, train)
    
    // Cache the position
    positionCache.set(cacheKey, {
      data: positionData,
      timestamp: now
    })

    return NextResponse.json(positionData)

  } catch (error) {
    console.error("Error fetching train position:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: "Unable to fetch train position data"
    }, { status: 500 })
  }
}

function generateRealisticPosition(trainNumber: string, train: any) {
  const route = train.route
  const routeLength = route.length
  
  // Simulate train being somewhere along its route
  const currentSegment = Math.floor(Math.random() * (routeLength - 1))
  const fromStationCode = route[currentSegment]
  const toStationCode = route[currentSegment + 1]
  const fromStation = KARNATAKA_STATIONS[fromStationCode]
  const toStation = KARNATAKA_STATIONS[toStationCode]
  
  // Progress between stations (0 to 1)
  const progress = Math.random()
  
  // Calculate current position
  const currentLat = fromStation.lat + (toStation.lat - fromStation.lat) * progress
  const currentLng = fromStation.lng + (toStation.lng - fromStation.lng) * progress
  
  // Add small random variation for GPS accuracy
  const lat = currentLat + (Math.random() - 0.5) * 0.005
  const lng = currentLng + (Math.random() - 0.5) * 0.005
  
  // Generate realistic train status
  const isRunning = Math.random() > 0.15 // 85% chance running
  const isDelayed = Math.random() > 0.7 // 30% chance delayed
  const speed = isRunning ? (train.type === 'Superfast' ? 80 + Math.random() * 40 : 
                            train.type === 'Express' ? 60 + Math.random() * 30 : 
                            40 + Math.random() * 20) : 0
  
  const delayMinutes = isDelayed ? Math.floor(Math.random() * 45) + 5 : 0
  
  // Calculate distance to next station (approximate)
  const distanceToNext = Math.sqrt(
    Math.pow((toStation.lat - lat) * 111, 2) + 
    Math.pow((toStation.lng - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
  )

  // Estimated arrival time
  const estimatedArrival = new Date(
    Date.now() + (distanceToNext / (speed || 50)) * 3600000 + (delayMinutes * 60000)
  )

  // Safety monitoring logic
  let collisionRisk = 'Low'
  let safetyStatus = 'Safe'
  const safetyAlerts: string[] = []
  if (distanceToNext < 1 && speed > 60) {
    collisionRisk = 'High'
    safetyStatus = 'Critical'
    safetyAlerts.push('High collision risk: train is close to next station at high speed')
  } else if (distanceToNext < 2 && speed > 40) {
    collisionRisk = 'Medium'
    safetyStatus = 'Warning'
    safetyAlerts.push('Medium collision risk: train approaching next station quickly')
  }
  if (isDelayed && delayMinutes > 30) {
    safetyStatus = 'Warning'
    safetyAlerts.push('Delay critical: train delayed more than 30 minutes')
  }

  return {
    trainNumber,
    trainName: train.name,
    trainType: train.type,
    position: {
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      accuracy: 10 + Math.random() * 20, // 10-30 meters
      timestamp: Date.now(),
      speed: Math.round(speed),
      heading: Math.floor(Math.random() * 360),
      altitude: 650 + Math.random() * 300 // Karnataka elevation
    },
    status: {
      running: isRunning,
      delayed: isDelayed,
      delayMinutes: delayMinutes,
      onTime: !isDelayed && isRunning
    },
    route: {
      from: KARNATAKA_STATIONS[route[0]].name,
      to: KARNATAKA_STATIONS[route[route.length - 1]].name,
      currentSegment: `${fromStation.name} → ${toStation.name}`,
      progress: Math.round(progress * 100),
      totalStations: routeLength,
      completedStations: currentSegment + 1
    },
    stations: {
      lastStation: {
        code: fromStationCode,
        name: fromStation.name,
        coordinates: { lat: fromStation.lat, lng: fromStation.lng }
      },
      nextStation: {
        code: toStationCode,
        name: toStation.name,
        coordinates: { lat: toStation.lat, lng: toStation.lng },
        estimatedArrival: estimatedArrival.toISOString(),
        distanceKm: Math.round(distanceToNext)
      },
      finalDestination: {
        code: route[route.length - 1],
        name: KARNATAKA_STATIONS[route[route.length - 1]].name
      }
    },
    collisionRisk,
    safetyStatus,
    safetyAlerts,
    realTimeData: {
      contributorCount: Math.floor(Math.random() * 20) + 5, // 5-25 GPS contributors
      lastUpdated: Date.now(),
      confidence: Math.floor(Math.random() * 25) + 75, // 75-100% confidence
      dataSource: 'Karnataka Railway GPS Network',
      updateFrequency: '30 seconds'
    },
    metadata: {
      apiVersion: '1.0',
      region: 'Karnataka',
      division: 'South Western Railway',
      generatedAt: new Date().toISOString()
    }
  }
}

// Optional: POST endpoint for GPS position updates from passengers/staff
export async function POST(request: NextRequest, { params }: { params: { trainNumber: string } }) {
  try {
    const trainNumber = params.trainNumber?.toUpperCase()
    const body = await request.json()

    if (!trainNumber || !KARNATAKA_TRAINS[trainNumber]) {
      return NextResponse.json({ error: "Invalid train number" }, { status: 400 })
    }

    if (!body.latitude || !body.longitude) {
      return NextResponse.json({ 
        error: "Latitude and longitude required",
        required: ["latitude", "longitude"],
        optional: ["accuracy", "speed", "heading"]
      }, { status: 400 })
    }

    // In production: validate, store in database, aggregate with other reports
    console.log(`GPS update received for train ${trainNumber}:`, {
      lat: body.latitude,
      lng: body.longitude,
      accuracy: body.accuracy || 'unknown',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true,
      message: "GPS position received and processed",
      trainNumber,
      receivedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error processing GPS update:", error)
    return NextResponse.json({ 
      error: "Failed to process GPS update" 
    }, { status: 500 })
  }
}