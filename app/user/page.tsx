export const dynamic = "force-dynamic"

import ClientDashboard from "./client-dashboard"

export default function UserPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-6">
          <div className="container mx-auto">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex justify-center">
  NammaTrain AI
</h1>
            <ClientDashboard />
          </div>
        </div>
  ) 
}
