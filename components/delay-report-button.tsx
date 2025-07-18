"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Loader2, Navigation, Smartphone, WifiOff } from "lucide-react"

interface DelayReportData {
  trainNumber: string
  delayMinutes: number
  reason: string
  description: string
  location: {
    latitude: number
    longitude: number
    accuracy: number
  }
  timestamp: string
  reporterType: "passenger" | "staff" | "anonymous"
}

interface DelayReportButtonProps {
  trainNumber?: string
  onReportSubmitted?: (report: DelayReportData) => void
  className?: string
  variant?: "button" | "card"
  size?: "sm" | "md" | "lg"
}

const delayReasons = [
  { value: "signal", label: "Signal Issues" },
  { value: "technical", label: "Technical Problems" },
  { value: "weather", label: "Weather Conditions" },
  { value: "track", label: "Track Maintenance" },
  { value: "congestion", label: "Traffic Congestion" },
  { value: "accident", label: "Accident/Incident" },
  { value: "other", label: "Other" },
]

export function DelayReportButton({
  trainNumber = "",
  onReportSubmitted,
  className = "",
  variant = "button",
  size = "md",
}: DelayReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCapturingGPS, setIsCapturingGPS] = useState(false)
  const [gpsStatus, setGpsStatus] = useState<"idle" | "capturing" | "success" | "error">("idle")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [formData, setFormData] = useState({
    trainNumber: trainNumber,
    delayMinutes: "",
    reason: "",
    description: "",
    reporterType: "passenger" as const,
  })

  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
    accuracy: number
  } | null>(null)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Capture GPS location
  const captureGPS = async () => {
    if (!navigator.geolocation) {
      setGpsStatus("error")
      return
    }

    setIsCapturingGPS(true)
    setGpsStatus("capturing")

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        })
      })

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      })

      setGpsStatus("success")
    } catch (error) {
      console.error("GPS capture failed:", error)
      setGpsStatus("error")
    } finally {
      setIsCapturingGPS(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location) {
      await captureGPS()
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const reportData: DelayReportData = {
        trainNumber: formData.trainNumber,
        delayMinutes: Number.parseInt(formData.delayMinutes),
        reason: formData.reason,
        description: formData.description,
        location,
        timestamp: new Date().toISOString(),
        reporterType: formData.reporterType,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would be an actual API call
      // await fetch('/api/delay-reports', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reportData)
      // })

      setSubmitStatus("success")
      onReportSubmitted?.(reportData)

      // Reset form after successful submission
      setTimeout(() => {
        setIsOpen(false)
        setFormData({
          trainNumber: trainNumber,
          delayMinutes: "",
          reason: "",
          description: "",
          reporterType: "passenger",
        })
        setLocation(null)
        setGpsStatus("idle")
        setSubmitStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Report submission failed:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Button size classes
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  }

  if (variant === "card") {
    return (
      <Card className={`railway-card ${className}`}>
        <CardHeader className="railway-card-header">
          <CardTitle className="railway-title flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-railway-warning" />
            Report Delay
          </CardTitle>
          <CardDescription className="railway-description">
            Help other passengers by reporting train delays with your location
          </CardDescription>
        </CardHeader>
        <CardContent className="railway-card-content">
          <DelayReportForm
            formData={formData}
            setFormData={setFormData}
            location={location}
            gpsStatus={gpsStatus}
            isCapturingGPS={isCapturingGPS}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            isOnline={isOnline}
            onCaptureGPS={captureGPS}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`railway-button-warning ${sizeClasses[size]} ${className}`}
        disabled={!isOnline}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Report Delay
        {!isOnline && <WifiOff className="h-4 w-4 ml-2" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-railway-overlay z-50 flex items-center justify-center p-4">
          <Card className="railway-modal w-full max-w-md">
            <CardHeader className="railway-card-header">
              <div className="flex items-center justify-between">
                <CardTitle className="railway-title flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-railway-warning" />
                  Report Train Delay
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="railway-button-ghost">
                  ✕
                </Button>
              </div>
              <CardDescription className="railway-description">
                Your location will be captured to verify the report
              </CardDescription>
            </CardHeader>
            <CardContent className="railway-card-content">
              <DelayReportForm
                formData={formData}
                setFormData={setFormData}
                location={location}
                gpsStatus={gpsStatus}
                isCapturingGPS={isCapturingGPS}
                isSubmitting={isSubmitting}
                submitStatus={submitStatus}
                isOnline={isOnline}
                onCaptureGPS={captureGPS}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

// Separate form component for reusability
function DelayReportForm({
  formData,
  setFormData,
  location,
  gpsStatus,
  isCapturingGPS,
  isSubmitting,
  submitStatus,
  isOnline,
  onCaptureGPS,
  onSubmit,
}: {
  formData: any
  setFormData: (data: any) => void
  location: any
  gpsStatus: string
  isCapturingGPS: boolean
  isSubmitting: boolean
  submitStatus: string
  isOnline: boolean
  onCaptureGPS: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Network Status */}
      {!isOnline && (
        <Alert variant="destructive" className="railway-alert">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're offline. Reports will be queued and sent when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Train Number */}
      <div className="railway-form-group">
        <Label htmlFor="trainNumber" className="railway-label">
          Train Number
        </Label>
        <Input
          id="trainNumber"
          value={formData.trainNumber}
          onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
          placeholder="e.g., EXP2024"
          className="railway-input"
          required
        />
      </div>

      {/* Delay Duration */}
      <div className="railway-form-group">
        <Label htmlFor="delayMinutes" className="railway-label">
          Delay Duration (minutes)
        </Label>
        <Input
          id="delayMinutes"
          type="number"
          min="1"
          max="999"
          value={formData.delayMinutes}
          onChange={(e) => setFormData({ ...formData, delayMinutes: e.target.value })}
          placeholder="e.g., 15"
          className="railway-input"
          required
        />
      </div>
      {/* Delay Reason */}
      <div className="railway-form-group">
        <Label htmlFor="reason" className="railway-label">
          Reason for Delay
        </Label>
        <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })} required>
          <SelectTrigger className="railway-select">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent className="railway-select-content">
            {delayReasons.map((reason) => (
              <SelectItem key={reason.value} value={reason.value} className="railway-select-item">
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Description */}
      <div className="railway-form-group">
        <Label htmlFor="description" className="railway-label">
          Additional Details (Optional)
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide any additional information about the delay..."
          className="railway-textarea"
          rows={3}
        />
      </div>
      {/* GPS Location */}
      <div className="railway-form-group">
        <Label className="railway-label">Location Verification</Label>
        <div className="railway-gps-section">
          {!location ? (
            <Button
              type="button"
              onClick={onCaptureGPS}
              disabled={isCapturingGPS}
              className="railway-button-secondary w-full"
            >
              {isCapturingGPS ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Capturing Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Capture Current Location
                </>
              )}
            </Button>
          ) : (
            <div className="railway-location-display">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-railway-success" />
                <span className="railway-text-success">Location Captured</span>
                <Badge variant="outline" className="railway-badge">
                  ±{Math.round(location.accuracy)}m
                </Badge>
              </div>
              <div className="railway-coordinates">
                <Smartphone className="h-4 w-4 text-railway-neutral" />
                <span className="railway-coord-text">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Submit Status */}
      {submitStatus === "success" && (
        <Alert className="railway-alert-success">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Delay report submitted successfully! Thank you for helping other passengers.
          </AlertDescription>
        </Alert>
      )}
      {submitStatus === "error" && (
        <Alert variant="destructive" className="railway-alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to submit report. Please try again or check your connection.</AlertDescription>
        </Alert>
      )}
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!location || isSubmitting || submitStatus === "success"}
        className="railway-button-primary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting Report...
          </>
        ) : submitStatus === "success" ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Report Submitted
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Submit Delay Report
          </>
        )}
      </Button>
    </form>
  )
}
