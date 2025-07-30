"use client"
import { PNRStatusCard } from "@/components/pnr-status-card"

export default function PNRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Quick Railway Services</h1>
          <h2 className="text-2xl font-bold text-indigo-700 mb-1">PNR Status</h2>
          <p className="text-lg text-gray-700 mb-4">Check ticket status instantly</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">Check Now</button>
        </div>
        <PNRStatusCard />
      </div>
    </div>
  )
}
