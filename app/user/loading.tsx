import { Train } from "lucide-react"

export default function UserLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Train className="h-16 w-16 text-blue-600 mx-auto animate-bounce" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-200 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading User Portal</h2>
        <p className="text-gray-600 mb-6">Preparing your railway services dashboard...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
