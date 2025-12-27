"use client"

import { useCurrency } from "@/lib/currency-context"
import { TrendingUp, TrendingDown, Shield, Activity, Zap, Clock } from "lucide-react"

interface QuickStatsWidgetProps {
  compact?: boolean
}

export function QuickStatsWidget({ compact = false }: QuickStatsWidgetProps) {
  const { formatAmountShort, currency } = useCurrency()

  const stats = [
    {
      label: "Protected Today",
      value: formatAmountShort(1245600),
      icon: Shield,
      trend: "+12%",
      trendUp: true,
      color: "#00ffc8",
    },
    {
      label: "Transactions",
      value: "1,847",
      icon: Activity,
      trend: "+8%",
      trendUp: true,
      color: "#00a8ff",
    },
    {
      label: "Blocked",
      value: "23",
      icon: Zap,
      trend: "-15%",
      trendUp: false,
      color: "#ff4757",
    },
    {
      label: "Avg Response",
      value: "38ms",
      icon: Clock,
      trend: "-5ms",
      trendUp: true,
      color: "#a855f7",
    },
  ]

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-xs">
        {stats.slice(0, 2).map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex items-center gap-2">
              <Icon className="h-3 w-3" style={{ color: stat.color }} />
              <span className="text-white font-medium">{stat.value}</span>
              <span className={`${stat.trendUp ? "text-[#00ffc8]" : "text-[#ff4757]"}`}>
                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744] hover:border-[#2a3a5a] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
              <span
                className={`text-[10px] flex items-center gap-0.5 ${stat.trendUp ? "text-[#00ffc8]" : "text-[#ff4757]"}`}
              >
                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-[#6b7b9a]">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
