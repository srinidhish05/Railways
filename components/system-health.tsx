"use client";
import React, { useState, useEffect } from "react";
import { Shield, Zap } from "lucide-react";

type SystemMetrics = {
  status: "healthy" | "warning" | "critical";
  database: "connected" | "disconnected";
  activeConnections: number;
  processedTickets: number;
};

const statusColor = {
  healthy: "text-green-400",
  warning: "text-yellow-400",
  critical: "text-red-400",
};

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: "healthy",
    database: "connected",
    activeConnections: 120,
    processedTickets: 1500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeConnections: Math.max(100, Math.floor(Math.random() * 150)),
        processedTickets: prev.processedTickets + Math.floor(Math.random() * 10),
        status: ["healthy", "warning", "critical"][Math.floor(Math.random() * 3)] as SystemMetrics["status"],
        database: Math.random() > 0.1 ? "connected" : "disconnected",
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-block">
      <div className="flex items-center space-x-2 bg-gray-900/80 border border-green-500 rounded-lg px-4 py-2 shadow-lg">
        <Shield className={`h-5 w-5 ${statusColor[metrics.status]}`} />
        <span className="font-semibold text-white">System Health:</span>
        <span className={`font-bold ${statusColor[metrics.status]}`}>{metrics.status}</span>
        <span className="mx-2 text-gray-400">|</span>
        <Zap className="h-5 w-5 text-blue-400" />
        <span className="text-white">DB:</span>
        <span className={metrics.database === "connected" ? "text-green-400" : "text-red-400"}>{metrics.database}</span>
        <span className="text-white">Active:</span>
        <span className="text-blue-400 font-bold">{metrics.activeConnections}</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-white">Tickets:</span>
        <span className="text-yellow-400 font-bold">{metrics.processedTickets}</span>
      </div>
    </div>
  );
}