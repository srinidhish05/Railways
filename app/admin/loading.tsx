import { Train, Shield, Activity } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Train className="h-12 w-12 text-blue-600 animate-pulse" />
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex justify-center space-x-1 mb-2">
            <div className="w-8 h-1 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-8 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Railway Control Center
          </h2>
          <p className="text-gray-600 mb-4">
            Connecting to Karnataka Railway Network...
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <Activity className="h-4 w-4 animate-spin" />
            <span>Authenticating admin access</span>
          </div>
          
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}