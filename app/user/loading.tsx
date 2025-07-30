import { Train, Loader2 } from "lucide-react"

export default function UserLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bae6fd] via-[#38bdf8] to-[#6366f1] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
          <circle cx="500" cy="100" r="80" fill="#38bdf8" fillOpacity="0.12" />
          <circle cx="100" cy="500" r="100" fill="#6366f1" fillOpacity="0.10" />
        </svg>
      </div>
      <div className="relative z-10 text-center px-8 py-12 bg-white/80 rounded-2xl shadow-2xl border border-blue-200 animate-fade-in">
        <div className="relative mb-8">
          <Train className="h-20 w-20 text-blue-600 mx-auto animate-bounce" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-200 rounded-full animate-pulse"></div>
          {/* Railway track effect */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-28 h-0.5 bg-gray-400 opacity-50"></div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gray-400 opacity-30"></div>
        </div>
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 animate-pulse drop-shadow-lg">Loading User Portal</h2>
        <p className="text-blue-600 mb-6 text-lg">Preparing your railway services dashboard...</p>
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-md text-blue-700 font-semibold">Connecting to railway network...</span>
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        .animate-bounce { animation: bounce 1.2s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 10px #38bdf8, 0 0 20px #6366f1; }
          50% { text-shadow: 0 0 20px #38bdf8, 0 0 40px #6366f1; }
        }
      `}</style>
    </div>
  )
}