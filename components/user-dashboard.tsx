"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/hooks/use-firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  TrendingDown,
  Calendar,
  CreditCard,
  Star,
  Info,
  Zap
} from "lucide-react"

interface Journey {
  id: string;
  from: string;
  to: string;
  date: string;
  fare: number;
  distance: number;
}

export default function UserDashboard() {
  const { getTrains } = useFirebase();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [monthlyCap] = useState(2000);
  const [savings, setSavings] = useState(0);

  // ...existing code...
  useEffect(() => {
    getTrains().then((trains) => {
      const demoJourneys = trains.slice(0, 5).map((train, idx) => ({
        id: train.id,
        from: train.stations[0] ?? "Unknown",
        to: train.stations[train.stations.length - 1] ?? "Unknown",
        date: `2025-01-${20 + idx}`,
        fare: train.price,
        distance: train.distance,
      }));
      setJourneys(demoJourneys);
      const spent = demoJourneys.reduce((sum, j) => sum + j.fare, 0);
      setMonthlySpent(spent);
      setSavings(monthlyCap - spent);
    });
  }, [getTrains, monthlyCap]);

  const cappingProgress = monthlyCap ? (monthlySpent / monthlyCap) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Spent Card */}
        <Card className="bg-[#1f2937] border-l-4 border-blue-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Monthly Spent</p>
                <p className="text-3xl font-bold text-blue-400">₹{monthlySpent}</p>
                <p className="text-sm text-gray-500">Progress</p>
                <Progress value={cappingProgress} className="mt-2" />
              </div>
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        {/* Total Savings Card */}
        <Card className="bg-[#1f2937] border-l-4 border-green-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Savings</p>
                <p className="text-3xl font-bold text-green-400">₹{savings}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        {/* Journeys Card */}
        <Card className="bg-[#1f2937] border-l-4 border-purple-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Journeys</p>
                <p className="text-3xl font-bold text-purple-400">{journeys.length}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* ...add more dashboard features here if needed... */}
    </div>
  );
}
// ...existing code ends here. No code, comments, or JSX after the closing brace.
// ...existing code ends here. No code after the closing brace.