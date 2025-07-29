import { EnhancedTrainBooking } from "@/components/enhanced-train-booking"

export default function BookingTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-[#334155] animate-fade-in">
          <h1 className="text-4xl font-extrabold text-center mb-6 tracking-tight drop-shadow-lg animate-pulse">
            <span className="text-[#38bdf8]">Karnataka Railway</span> <span className="text-[#fbbf24]">Booking System</span>
          </h1>
          <p className="text-center text-lg mb-8 text-[#cbd5e1]">
            Book your train tickets with real-time safety, seat availability, and smart fare capping. Enjoy a seamless, secure, and modern booking experience.
          </p>
          <div className="mt-4">
            <EnhancedTrainBooking />
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
