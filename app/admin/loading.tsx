import { Shield } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Shield className="h-16 w-16 text-red-600 mx-auto animate-pulse" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-red-200 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">Initializing system controls...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
