"use client"

import { AdminSection } from "@/components/admin-section"
import { AlgorithmDemo } from "@/components/algorithm-demo"
import SafetyAlertsCard from "@/components/safety-alerts-card"

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-blue-900 mb-8">
        <h2 className="text-3xl font-bold text-purple-400 mb-4">Admin Dashboard Features</h2>
        <ul className="list-disc pl-6 text-gray-200 mb-6">
          <li><span className="font-bold text-blue-300">Collision Prevention and Safety Monitoring:</span> Alert system to loco pilots directly from admin</li>
          <li><span className="font-bold text-yellow-300">Delay Management:</span> See which trains are delayed in route</li>
          <li><span className="font-bold text-green-300">Safety Management of Passengers:</span> Monitor safety of passengers in train coach</li>
        </ul>
        <h2 className="text-2xl font-bold text-purple-400 mb-4">How to open admin dashboard</h2>
        <p className="text-gray-200 text-lg mb-4">Go to the homepage and click the <span className="font-bold text-blue-400">Admin Dashboard</span> button in the top right, or visit <span className="font-mono text-blue-300">/admin</span> directly.</p>
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">Collision Prevention & Safety Monitoring System</h3>
        <div className="mb-2">
          <span className="font-semibold text-blue-300">How It Works (Technical Flow):</span>
          <ul className="list-disc pl-6 text-gray-200">
            <li>Sensors Used:</li>
            <li>🛰️ GPS Module (NEO-6M) – Real-time location and speed tracking</li>
            <li>📡 Ultrasonic or LIDAR Sensors – Measure distance to detect proximity of nearby trains or obstacles</li>
            <li>🌀 MPU6050 (Accelerometer + Gyroscope) – Detects sudden stops, jerks, or derailment movements</li>
            <li>🛑 Emergency Button – For loco pilot or control room use in emergencies</li>
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-blue-300">Process Flow:</span>
          <div className="bg-gray-800 rounded p-3 text-sm text-gray-200 font-mono mb-2">
            Train Sensors ➝ ESP32/Arduino ➝ Cloud Platform (Firebase/IBM Watson) ➝ Alert Engine ➝ Admin Dashboard + Loco Pilot Alert UI
          </div>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-blue-300">Alert System:</span>
          <ul className="list-disc pl-6 text-gray-200">
            <li>If distance between two trains is &lt; X meters, or abnormal acceleration is detected:</li>
            <li>🚨 Immediate Alert to Admin Dashboard</li>
            <li>🚦 Visual & audio alert on Loco Pilot screen</li>
            <li>📱 Optionally notify passengers via app or display system</li>
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-blue-300">Admin Dashboard Addition:</span>
          <ul className="list-disc pl-6 text-gray-200">
            <li>🖥️ Add new card/module: Safety Alerts</li>
            <li>Collision proximity warnings</li>
            <li>Live train spacing map</li>
            <li>Abnormal sensor status flags (jerk, brake, heat, etc.)</li>
          </ul>
        </div>
      </div>
      <SafetyAlertsCard />
      <AdminSection />
      <AlgorithmDemo />
    </div>
  )
}