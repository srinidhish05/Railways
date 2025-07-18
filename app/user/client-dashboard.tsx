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
    <Suspense fallback={<div className="text-center p-4">Preparing dashboard...</div>}>
      <UserDashboard />
    </Suspense>
  )
}
