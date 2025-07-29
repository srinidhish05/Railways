export const dynamic = "force-dynamic"

import ClientDashboard from "./client-dashboard"

export default function UserPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-[#334155] animate-fade-in">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-center mb-8">
            NammaTrain AI
          </h1>
          <ClientDashboard />
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}
