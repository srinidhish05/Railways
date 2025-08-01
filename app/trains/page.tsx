import { TrainDashboard } from '@/components/train-dashboard'
import { LiveTrainMap } from '@/components/live-train-map'

export default function TrainsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] px-0 py-0">
      <div className="w-full">
        <div className="bg-[#1e293b] rounded-none shadow-none p-0 border-none animate-fade-in">
          <h1 className="text-4xl font-extrabold text-center mb-6 tracking-tight drop-shadow-lg animate-pulse">
            <span className="text-[#38bdf8]">Karnataka Trains</span> <span className="text-[#fbbf24]">Dashboard</span>
          </h1>
          <div className="mt-4">
            <TrainDashboard />
            <div className="my-10">
              <LiveTrainMap />
            </div>
          </div>
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