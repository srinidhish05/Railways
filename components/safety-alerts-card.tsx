import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Zap, Shield, Clock, Thermometer, Activity, Bell } from "lucide-react";

// Mock data for demonstration
const safetyAlerts = [
  {
    type: "Collision Proximity",
    message: "Train SBC123 and MYS456 are within 500 meters!",
    severity: "critical",
    time: "Just now",
  },
  {
    type: "Abnormal Acceleration",
    message: "Sudden jerk detected on Train UBL789 (Coach B2)",
    severity: "warning",
    time: "2 min ago",
  },
  {
    type: "Emergency Button",
    message: "Emergency button pressed by Loco Pilot on Train MAJN321",
    severity: "critical",
    time: "5 min ago",
  },
  {
    type: "High Temperature",
    message: "Coach C1 on Train SBC123 reports high temperature!",
    severity: "warning",
    time: "10 min ago",
  },
];

export default function SafetyAlertsCard() {
  return (
    <Card className="bg-gradient-to-br from-red-900/60 via-yellow-900/40 to-blue-900/30 border border-red-500 shadow-2xl mb-8">
      <CardHeader className="flex items-center gap-2">
        <Bell className="h-7 w-7 text-red-400 animate-bounce" />
        <CardTitle className="text-white text-2xl">Safety Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safetyAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg flex items-center gap-4 shadow-lg border-l-4 ${
                alert.severity === "critical"
                  ? "border-red-500 bg-red-900/40"
                  : "border-yellow-400 bg-yellow-900/20"
              }`}
            >
              {alert.type === "Collision Proximity" && (
                <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
              )}
              {alert.type === "Abnormal Acceleration" && (
                <Activity className="h-6 w-6 text-yellow-400 animate-pulse" />
              )}
              {alert.type === "Emergency Button" && (
                <Shield className="h-6 w-6 text-red-400 animate-pulse" />
              )}
              {alert.type === "High Temperature" && (
                <Thermometer className="h-6 w-6 text-orange-400 animate-pulse" />
              )}
              <div>
                <div className="font-bold text-white text-lg">{alert.type}</div>
                <div className="text-gray-200 text-sm">{alert.message}</div>
                <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Zap className="inline-block h-5 w-5 text-blue-400 mr-2 animate-spin" />
          <span className="text-blue-200 text-sm">Live train spacing map and sensor status coming soon...</span>
        </div>
      </CardContent>
    </Card>
  );
}
