"use client"
import { useState, useEffect } from "react"
import { searchTrains, TrainSchedule } from "@/data/karnataka-trains"

export function LiveTrainMap() {
  const [search, setSearch] = useState("")
  const [trains, setTrains] = useState<TrainSchedule[]>([])

  useEffect(() => {
    setTrains(searchTrains(""))
  }, [])

  // Accurate local filtering
  const filteredTrains = trains.filter(train => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      train.trainName.toLowerCase().includes(q) ||
      train.trainNumber.includes(q) ||
      train.fromName.toLowerCase().includes(q) ||
      train.toName.toLowerCase().includes(q) ||
      train.type.toLowerCase().includes(q)
    )
  }).slice(0, 90) // Show up to 90 trains

  return (
    <div
      className="w-full max-w-5xl mx-auto px-2 py-8"
      style={{
        background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
      aria-label="Live Train Map Section"
      role="region"
    >
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          className="w-full sm:w-96 px-4 py-2 border border-blue-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-[#1e293b] dark:text-white dark:border-blue-700"
          placeholder="Search by train name, number, station, or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search trains"
        />
      </div>
      {/* Skeleton loader for initial load */}
      {trains.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/60 dark:bg-[#1e293b]/60 rounded-xl shadow-lg p-5 border border-blue-100 dark:border-blue-700 flex flex-col h-56">
              <div className="h-6 w-2/3 bg-blue-200 dark:bg-blue-900 rounded mb-4" />
              <div className="h-4 w-1/2 bg-blue-100 dark:bg-blue-800 rounded mb-2" />
              <div className="h-4 w-1/3 bg-blue-100 dark:bg-blue-800 rounded mb-2" />
              <div className="h-3 w-1/2 bg-blue-50 dark:bg-blue-700 rounded mb-2" />
              <div className="h-3 w-1/3 bg-blue-50 dark:bg-blue-700 rounded mb-2" />
              <div className="h-3 w-1/4 bg-blue-50 dark:bg-blue-700 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTrains.length === 0 ? (
        <div className="text-center text-gray-500 py-12" role="alert">
          <span className="text-lg font-semibold">No trains found for your search.</span>
          <br />
          <span>Try another train name, number, station or route.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrains.map(train => (
            <div
              key={`${train.trainNumber}-${train.fromName}-${train.departureTime}`}
              className="bg-white/70 dark:bg-[#1e293b]/70 rounded-xl shadow-lg p-5 border border-blue-100 dark:border-blue-700 hover:shadow-2xl transition-shadow flex flex-col focus-within:ring-2 focus-within:ring-blue-400"
              tabIndex={0}
              aria-label={`Train ${train.trainName} ${train.trainNumber}`}
              role="article"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-blue-900 dark:text-blue-200">{train.trainName}</span>
                <span className="text-xs text-blue-600 font-mono bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">{train.trainNumber}</span>
              </div>
              <div className="mb-2 text-base text-gray-700 dark:text-gray-200 font-medium flex flex-wrap items-center">
                <span>{train.fromName}</span>
                <span className="mx-2 text-blue-400">→</span>
                <span>{train.toName}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap items-center">
                <span className="font-semibold">Departure:</span> <span className="ml-1">{train.departureTime}</span>
                <span className="mx-2">|</span>
                <span className="font-semibold">Arrival:</span> <span className="ml-1">{train.arrivalTime}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap items-center">
                <span className="font-semibold">Type:</span> <span className="ml-1">{train.type}</span>
                <span className="mx-2">|</span>
                <span className="font-semibold">Days:</span> <span className="ml-1">{train.runningDays.join(", ")}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Classes:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {train.classes.map(cls => (
                    <span key={cls.class} className={`px-2 py-1 rounded text-xs font-semibold border focus:ring-2 focus:ring-blue-400 ${cls.status === "AVAILABLE" ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700" : "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700"}`}>
                      {cls.className} ({cls.class}) <span className="font-normal">{cls.status}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex flex-wrap items-center">
                <span className="font-semibold">Distance:</span> <span className="ml-1">{train.distance} km</span>
                <span className="mx-2">|</span>
                <span className="font-semibold">Duration:</span> <span className="ml-1">{train.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
