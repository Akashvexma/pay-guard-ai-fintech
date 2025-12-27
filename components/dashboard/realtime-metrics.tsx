"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/lib/currency-context"
import { Activity, Zap, Shield, Clock, Users, ArrowUp, ArrowDown } from "lucide-react"

export function RealtimeMetrics() {
  const { formatAmountShort } = useCurrency()
  const [metrics, setMetrics] = useState({
    tps: 127,
    avgLatency: 23,
    activeUsers: 1847,
    blockedToday: 34,
    moneyProtected: 4523400,
    successRate: 99.7,
    riskScore: 18,
    regions: 12,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        tps: Math.max(50, Math.min(200, prev.tps + Math.floor(Math.random() * 20 - 10))),
        avgLatency: Math.max(15, Math.min(50, prev.avgLatency + Math.floor(Math.random() * 6 - 3))),
        activeUsers: Math.max(1500, Math.min(2500, prev.activeUsers + Math.floor(Math.random() * 100 - 50))),
        blockedToday: prev.blockedToday + (Math.random() > 0.8 ? 1 : 0),
        moneyProtected: prev.moneyProtected + Math.floor(Math.random() * 10000),
        successRate: Math.max(99, Math.min(100, prev.successRate + (Math.random() * 0.2 - 0.1))),
        riskScore: Math.max(10, Math.min(30, prev.riskScore + Math.floor(Math.random() * 4 - 2))),
        regions: prev.regions,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      label: "Transactions/sec",
      value: metrics.tps.toString(),
      icon: Zap,
      color: "#00ffc8",
      trend: metrics.tps > 120 ? "up" : "down",
      change: "+12%",
    },
    {
      label: "Avg Latency",
      value: `${metrics.avgLatency}ms`,
      icon: Clock,
      color: "#00a8ff",
      trend: metrics.avgLatency < 30 ? "up" : "down",
      change: "-8%",
    },
    {
      label: "Active Merchants",
      value: metrics.activeUsers.toLocaleString(),
      icon: Users,
      color: "#a855f7",
      trend: "up",
      change: "+5%",
    },
    {
      label: "Fraud Blocked",
      value: metrics.blockedToday.toString(),
      icon: Shield,
      color: "#ff4757",
      trend: "up",
      change: "+3",
    },
  ]

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00ffc8]/20 to-[#a855f7]/20 border border-[#00ffc8]/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[#00ffc8]" />
            </div>
            <div>
              <CardTitle className="text-white">Real-time Metrics</CardTitle>
              <p className="text-xs text-[#6b7b9a]">Live system performance</p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-2" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744] hover:border-[#00ffc8]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                <div
                  className={`flex items-center gap-1 text-xs ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
              <p className="text-xs text-[#6b7b9a] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-[#00ffc8]/5 to-[#a855f7]/5 border border-[#1a2744]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-[#00ffc8]" />
              <div>
                <p className="text-xs text-[#6b7b9a]">Money Protected Today</p>
                <p className="text-xl font-bold text-white">{formatAmountShort(metrics.moneyProtected)}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-lg font-bold text-[#00ffc8]">{metrics.successRate.toFixed(1)}%</p>
                <p className="text-xs text-[#6b7b9a]">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#a855f7]">{metrics.riskScore}</p>
                <p className="text-xs text-[#6b7b9a]">Avg Risk Score</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#00a8ff]">{metrics.regions}</p>
                <p className="text-xs text-[#6b7b9a]">Active Regions</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
