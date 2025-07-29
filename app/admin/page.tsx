"use client"

import { AdminSection } from "@/components/admin-section"
import { AlgorithmDemo } from "@/components/algorithm-demo"

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <AdminSection />
      <AlgorithmDemo />
    </div>
  )
}