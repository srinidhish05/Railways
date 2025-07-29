import { Train, Shield, Activity, AlertTriangle, Clock, Users, MapPin, Flame } from "lucide-react"

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

        {/* Safety Alerts Card */}
        <div className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto mb-6 border border-blue-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Safety Alerts</h3>
          </div>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li className="flex items-center"><MapPin className="h-4 w-4 text-blue-500 mr-1" /> Collision proximity warning: <span className="font-bold text-red-600 ml-1">Train #12876 & #12901</span> <span className="ml-2 text-xs text-gray-500">(Distance: 350m)</span></li>
            <li className="flex items-center"><Flame className="h-4 w-4 text-orange-500 mr-1" /> Abnormal sensor: <span className="font-bold text-orange-600 ml-1">Brake Overheat</span> <span className="ml-2 text-xs text-gray-500">Coach B2</span></li>
            <li className="flex items-center"><Activity className="h-4 w-4 text-yellow-500 mr-1 animate-pulse" /> Sudden jerk detected: <span className="font-bold text-yellow-600 ml-1">Train #12876</span></li>
          </ul>
        </div>

        {/* Delay Management Card */}
        <div className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto mb-6 border border-yellow-200">
          <div className="flex items-center mb-2">
            <Clock className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Delay Management</h3>
          </div>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li className="flex items-center"><Train className="h-4 w-4 text-blue-500 mr-1" /> <span className="font-bold">Train #12901</span> delayed by <span className="text-red-600 font-bold ml-1">18 min</span> <span className="ml-2 text-xs text-gray-500">(Route: SBC → UBL)</span></li>
            <li className="flex items-center"><Train className="h-4 w-4 text-blue-500 mr-1" /> <span className="font-bold">Train #12876</span> delayed by <span className="text-red-600 font-bold ml-1">7 min</span> <span className="ml-2 text-xs text-gray-500">(Route: UBL → BGM)</span></li>
          </ul>
        </div>

        {/* Safety Management Card */}
        <div className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto border border-green-200">
          <div className="flex items-center mb-2">
            <Users className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Passenger Safety Management</h3>
          </div>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li className="flex items-center"><Shield className="h-4 w-4 text-green-500 mr-1" /> Emergency button status: <span className="font-bold text-green-600 ml-1">All Clear</span></li>
            <li className="flex items-center"><Activity className="h-4 w-4 text-blue-500 mr-1" /> Monitoring coach sensors for abnormal activity...</li>
            <li className="flex items-center"><Train className="h-4 w-4 text-blue-500 mr-1" /> Live train spacing map: <span className="ml-1 text-blue-600 underline cursor-pointer">View Map</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}