"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const UserDashboard = dynamic(() => import("@/components/user-dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Loading dashboard...</p>
      </div>
    </div>
  ),
})

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-[#334155] animate-fade-in">
          <h1 className="text-4xl font-extrabold text-center mb-6 tracking-tight drop-shadow-lg animate-pulse">
            <span className="text-[#38bdf8]">User</span> <span className="text-[#fbbf24]">Dashboard</span>
          </h1>
          <Suspense fallback={
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-lg text-blue-200">Preparing dashboard...</p>
              </div>
            </div>
          }>
            <UserDashboard />
          </Suspense>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 10px #38bdf8, 0 0 20px #fbbf24; }
          50% { text-shadow: 0 0 20px #38bdf8, 0 0 40px #fbbf24; }
        }
      `}</style>
    </div>
  )
}