"use client"
import { PNRStatusCard } from "@/components/pnr-status-card"

export default function PNRStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">PNR Status</h1>
        <PNRStatusCard />
      </div>
    </div>
  )
}