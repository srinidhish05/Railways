"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Phone, AlertTriangle, Clock, MapPin, User } from "lucide-react"

interface EmergencyResponseModalProps {
  alert: {
    id: string
    trainId: string
    trainName: string
    type: string
    severity: string
    message: string
    location: {
      latitude: number
      longitude: number
      stationName: string
    }
    timestamp: string
  }
  onEmergencyCall: (alertId: string, details: any) => void
  onAcknowledge: (alertId: string) => void
}

export function EmergencyResponseModal({ alert, onEmergencyCall, onAcknowledge }: EmergencyResponseModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCallInProgress, setIsCallInProgress] = useState(false)
  const [responderName, setResponderName] = useState("")
  const [notes, setNotes] = useState("")

  const handleEmergencyCall = async () => {
    if (!responderName.trim()) {
      alert("Please enter responder name")
      return
    }

    setIsCallInProgress(true)

    try {
      await onEmergencyCall(alert.id, {
        responderName,
        notes,
        callTime: new Date().toISOString(),
        location: alert.location,
      })

      // Simulate call duration
      setTimeout(() => {
        setIsCallInProgress(false)
        setIsOpen(false)
        onAcknowledge(alert.id)
      }, 3000)
    } catch (error) {
      console.error("Emergency call failed:", error)
      setIsCallInProgress(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Phone className="h-4 w-4 mr-1" />
          Emergency Call
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Emergency Response
          </DialogTitle>
          <DialogDescription>Initiating emergency response for panic button activation</DialogDescription>
        </DialogHeader>

        <Card className={`border-2 ${getSeverityColor(alert.severity)}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{alert.trainName}</CardTitle>
              <Badge variant="destructive">{alert.severity.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{alert.message}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{alert.location.stationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Coordinates:</strong> {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
            </div>
          </CardContent>
        </Card>

        {!isCallInProgress ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="responder">Emergency Responder Name</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-500" />
                <Input
                  id="responder"
                  placeholder="Enter your name"
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Response Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the emergency response..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEmergencyCall}
                className="flex-1"
                variant="destructive"
                disabled={!responderName.trim()}
              >
                <Phone className="h-4 w-4 mr-2" />
                Initiate Emergency Call
              </Button>
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="animate-pulse">
              <Phone className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Emergency Call in Progress</h3>
              <p className="text-gray-600">Connecting to emergency services...</p>
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
