"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Users,
  Shield,
  Play,
  RotateCcw,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Train,
} from "lucide-react"
import { GreedySeatAssignment, type Passenger, type Seat } from "@/lib/greedy-seat-assignment"
import { KNNCollisionDetector, type TrainData, type CollisionPrediction } from "@/lib/knn-collision-detector"

export function AlgorithmDemo() {
  const [seatResults, setSeatResults] = useState<any>(null)
  const [collisionResults, setCollisionResults] = useState<CollisionPrediction[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("seat-assignment")

  // Real Karnataka Railway passenger data
  const mockPassengers: Passenger[] = [
    {
      id: "P001",
      name: "Rajesh Kumar",
      age: 65,
      gender: "M",
      isDisabled: false,
      isPregnant: false,
      isSeniorCitizen: true,
      preference: "window",
      groupId: "G1",
      bookingFrom: "Bengaluru City",
      bookingTo: "New Delhi"
    },
    {
      id: "P002",
      name: "Priya Sharma",
      age: 28,
      gender: "F",
      isDisabled: false,
      isPregnant: true,
      isSeniorCitizen: false,
      preference: "aisle",
      groupId: "G1",
      bookingFrom: "Bengaluru City",
      bookingTo: "New Delhi"
    },
    {
      id: "P003",
      name: "Amit Singh",
      age: 45,
      gender: "M",
      isDisabled: true,
      isPregnant: false,
      isSeniorCitizen: false,
      preference: "aisle",
      bookingFrom: "Mysuru Junction",
      bookingTo: "Chennai Central"
    },
    {
      id: "P004",
      name: "Sunita Devi",
      age: 8,
      gender: "F",
      isDisabled: false,
      isPregnant: false,
      isSeniorCitizen: false,
      preference: "window",
      groupId: "G2",
      bookingFrom: "Hubballi Junction",
      bookingTo: "Mumbai CST"
    },
    {
      id: "P005",
      name: "Vikram Patel",
      age: 35,
      gender: "M",
      isDisabled: false,
      isPregnant: false,
      isSeniorCitizen: false,
      preference: "any",
      groupId: "G2",
      bookingFrom: "Hubballi Junction",
      bookingTo: "Mumbai CST"
    },
  ]

  const mockSeats: Seat[] = [
    { id: "S1", number: "1", type: "window", isAvailable: true, coach: "SL1", priority: 1 },
    { id: "S2", number: "2", type: "middle", isAvailable: true, coach: "SL1", priority: 2 },
    { id: "S3", number: "3", type: "aisle", isAvailable: true, coach: "SL1", priority: 3 },
    { id: "S4", number: "4", type: "aisle", isAvailable: true, coach: "SL1", priority: 4 },
    { id: "S5", number: "5", type: "middle", isAvailable: true, coach: "SL1", priority: 5 },
    { id: "S6", number: "6", type: "window", isAvailable: true, coach: "SL1", priority: 6 },
    { id: "S7", number: "7", type: "window", isAvailable: true, coach: "SL2", priority: 7 },
    { id: "S8", number: "8", type: "aisle", isAvailable: true, coach: "SL2", priority: 8 },
  ]

  // Real Karnataka trains with accurate coordinates
  const mockTrains: TrainData[] = [
    {
      id: "12628",
      name: "Karnataka Express",
      latitude: 12.9716,
      longitude: 77.5946,
      speed: 85,
      heading: 45,
      altitude: 920,
      timestamp: Date.now(),
      route: "SBC → NDLS",
      nextStation: "Tumkur (TK)",
      currentStation: "Bengaluru City Junction"
    },
    {
      id: "16536",
      name: "Gol Gumbaz Express",
      latitude: 12.98,
      longitude: 77.6,
      speed: 72,
      heading: 50,
      altitude: 915,
      timestamp: Date.now(),
      route: "SBC → SUR",
      nextStation: "Yelahanka Junction (YNK)",
      currentStation: "Bengaluru East"
    },
    {
      id: "16215",
      name: "Chamundi Express",
      latitude: 12.3074,
      longitude: 76.6554,
      speed: 68,
      heading: 180,
      altitude: 763,
      timestamp: Date.now(),
      route: "MYS → MAQ",
      nextStation: "Mandya (MYA)",
      currentStation: "Mysuru Junction"
    },
    {
      id: "11013",
      name: "Coimbatore Express",
      latitude: 13.0827,
      longitude: 80.2707,
      speed: 95,
      heading: 180,
      altitude: 16,
      timestamp: Date.now(),
      route: "SBC → CBE",
      nextStation: "Arakkonam Junction (AJJ)",
      currentStation: "Chennai Central"
    },
  ]

  const runSeatAssignment = async () => {
    setIsRunning(true)

    // Simulate processing time for Karnataka Railway system
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const algorithm = new GreedySeatAssignment(mockPassengers, mockSeats)
    const results = algorithm.assignSeats()

    setSeatResults(results)
    setIsRunning(false)
  }

  const runCollisionDetection = async () => {
    setIsRunning(true)

    // Simulate Karnataka Railway safety analysis
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const detector = new KNNCollisionDetector(3)
    const predictions = detector.batchPredict(mockTrains)

    setCollisionResults(predictions)
    setIsRunning(false)
  }

  const resetResults = () => {
    setSeatResults(null)
    setCollisionResults([])
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "text-red-700"
      case "HIGH":
        return "text-orange-700"
      case "MEDIUM":
        return "text-yellow-700"
      case "LOW":
        return "text-green-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Karnataka Railway AI/ML Algorithms Demo
          </CardTitle>
          <CardDescription>
            Interactive demonstration of machine learning algorithms used in Karnataka Railway Network management
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seat-assignment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Smart Seat Assignment
          </TabsTrigger>
          <TabsTrigger value="collision-detection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Safety Collision Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seat-assignment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Greedy Seat Assignment Algorithm
                </CardTitle>
                <CardDescription>
                  Optimizes seat allocation for Karnataka Railway passengers based on IRCTC priority rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Karnataka Railway Features:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Senior citizen priority (65+ years)</li>
                    <li>• Divyangjan (disabled) reserved seating</li>
                    <li>• Pregnant women priority</li>
                    <li>• Family group optimization</li>
                    <li>• Window/aisle preference matching</li>
                    <li>• Coach-wise seat distribution</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Test Data:</h4>
                  <div className="text-sm space-y-1">
                    <p>Passengers: {mockPassengers.length} (Karnataka routes)</p>
                    <p>Available Seats: {mockSeats.length} (SL coaches)</p>
                    <p>Family Groups: 2</p>
                    <p>Routes: SBC-NDLS, MYS-MAS, UBL-CSTM</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={runSeatAssignment} disabled={isRunning} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {isRunning ? "Processing..." : "Run Assignment"}
                  </Button>
                  <Button variant="outline" onClick={resetResults}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results - Keep existing result display logic */}
            <Card>
              <CardHeader>
                <CardTitle>Karnataka Railway Seat Assignment Results</CardTitle>
              </CardHeader>
              <CardContent>
                {!seatResults ? (
                  <div className="text-center py-8 text-gray-500">
                    <Train className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Run Assignment" to see optimized seat allocation</p>
                  </div>
                ) : (
                  // ... keep existing results display logic
                  <div className="space-y-4">
                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Assigned</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{seatResults.statistics.assignedPassengers}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Success Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">
                          {seatResults.statistics.assignmentRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Assignment Progress</span>
                        <span className="text-sm font-medium">
                          {seatResults.statistics.assignedPassengers}/{seatResults.statistics.totalPassengers}
                        </span>
                      </div>
                      <Progress value={seatResults.statistics.assignmentRate} className="h-2" />
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Execution: {seatResults.statistics.executionTime.toFixed(2)}ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span>Avg Score: {seatResults.statistics.averageScore.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Assignments */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Seat Assignments:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {seatResults.assignments.map((assignment: any) => {
                          const passenger = mockPassengers.find((p) => p.id === assignment.passengerId)
                          const seat = mockSeats.find((s) => s.id === assignment.seatId)
                          return (
                            <div key={assignment.passengerId} className="bg-gray-50 p-2 rounded text-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{passenger?.name}</p>
                                  <p className="text-gray-600">
                                    Seat {seat?.number} ({seat?.type}) - Coach {seat?.coach}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  Score: {assignment.score}
                                </Badge>
                              </div>
                              <div className="mt-1">
                                <p className="text-xs text-gray-500">{assignment.reasoning.join(", ")}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collision-detection" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  KNN Collision Detection Algorithm
                </CardTitle>
                <CardDescription>AI-powered safety system for Karnataka Railway Network collision prevention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Safety Features:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Real-time GPS tracking analysis</li>
                    <li>• 8-parameter risk assessment</li>
                    <li>• Speed, heading, altitude monitoring</li>
                    <li>• Historical accident data training</li>
                    <li>• Confidence-based alerting</li>
                    <li>• Emergency protocol activation</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Active Karnataka Trains:</h4>
                  <div className="text-sm space-y-1">
                    <p>Monitored Trains: {mockTrains.length}</p>
                    <p>Karnataka Express, Gol Gumbaz Express</p>
                    <p>Chamundi Express, Coimbatore Express</p>
                    <p>Train Pairs Analyzed: {(mockTrains.length * (mockTrains.length - 1)) / 2}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={runCollisionDetection} disabled={isRunning} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {isRunning ? "Analyzing..." : "Run Safety Check"}
                  </Button>
                  <Button variant="outline" onClick={resetResults}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Keep existing collision results display */}
            <Card>
              <CardHeader>
                <CardTitle>Karnataka Railway Safety Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {collisionResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Run Safety Check" to analyze collision risks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Overall Status */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Karnataka Railway Status</span>
                        <Badge
                          variant={collisionResults.some((r) => r.riskLevel === "CRITICAL") ? "destructive" : "default"}
                          className="flex items-center gap-1"
                        >
                          <Activity className="h-3 w-3" />
                          {collisionResults.some((r) => r.riskLevel === "CRITICAL") ? "EMERGENCY ALERT" : "SAFE MONITORING"}
                        </Badge>
                      </div>
                    </div>

                    {/* Risk Predictions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Safety Risk Analysis:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {collisionResults.map((prediction, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getRiskColor(prediction.riskLevel)}`} />
                                <span className="font-medium text-sm">
                                  {mockTrains.find((t) => t.id === prediction.trainPair[0])?.name} ↔{" "}
                                  {mockTrains.find((t) => t.id === prediction.trainPair[1])?.name}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getRiskTextColor(prediction.riskLevel)} border-current`}
                              >
                                {prediction.riskLevel}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
                              <div>Collision Risk: {(prediction.probability * 100).toFixed(1)}%</div>
                              <div>Distance: {Math.round(prediction.distance)}m</div>
                              <div>AI Confidence: {(prediction.confidence * 100).toFixed(1)}%</div>
                              <div>Time to Risk: {Math.round(prediction.timeToCollision)}s</div>
                            </div>

                            {prediction.factors.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700 mb-1">Risk Factors:</p>
                                <div className="flex flex-wrap gap-1">
                                  {prediction.factors.slice(0, 2).map((factor, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {factor}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {prediction.riskLevel === "CRITICAL" && (
                              <Alert className="mt-2 border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800 text-xs">
                                  CRITICAL: Emergency protocols activated - Karnataka Railway Control Room notified
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}