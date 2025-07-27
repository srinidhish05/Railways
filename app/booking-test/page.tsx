import { EnhancedTrainBooking } from "@/components/enhanced-train-booking"

export default function BookingTestPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Complete Karnataka Railway Booking System
        </h1>
        <EnhancedTrainBooking />
      </div>
    </div>
  )
}
