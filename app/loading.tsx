import { Train, Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Railway Logo Animation */}
        <div className="relative mb-8">
          <Train className="h-20 w-20 text-blue-600 mx-auto animate-bounce" />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-blue-200 rounded-full animate-pulse"></div>
          
          {/* Railway Track Effect */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gray-400 opacity-50"></div>
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gray-400 opacity-30"></div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gray-400 opacity-20"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Karnataka Railway Network</h2>
        <p className="text-gray-600 mb-8 text-lg">Connecting Karnataka with reliable rail services...</p>

        {/* Status Indicator */}
        <div className="flex justify-center items-center space-x-3 mb-6">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Initializing railway network...</span>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          <div 
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div 
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div 
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Railway Services */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "500ms" }}></div>
            <span>PNR Status</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: "1000ms" }}></div>
            <span>Seat Booking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "1500ms" }}></div>
            <span>Route Planning</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Loading railway services...</p>
        </div>
      </div>
    </div>
  )
}