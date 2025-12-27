"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, ShieldAlert, ShieldX, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

interface StatsCardsProps {
  stats: {
    totalTransactions: number
    approvedCount: number
    reviewCount: number
    declinedCount: number
    totalAmount: number
    fraudPrevented: number
    avgRiskScore: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { formatAmount, formatAmountShort } = useCurrency()
  const approvalRate = stats.totalTransactions > 0 ? (stats.approvedCount / stats.totalTransactions) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/30 transition-all group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6b7b9a]">Total Scans</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-[#00ffc8]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="h-4 w-4 text-[#00ffc8]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">{stats.totalTransactions.toLocaleString()}</div>
          <p className="text-xs text-[#6b7b9a] mt-1">{formatAmountShort(stats.totalAmount)} volume</p>
        </CardContent>
      </Card>

      <Card className="bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/30 transition-all group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6b7b9a]">Approved</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-[#00ffc8]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-4 w-4 text-[#00ffc8]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#00ffc8] tracking-tight">{stats.approvedCount.toLocaleString()}</div>
          <p className="flex items-center text-xs text-[#6b7b9a] mt-1">
            <TrendingUp className="mr-1 h-3 w-3 text-[#00ffc8]" />
            {approvalRate.toFixed(1)}% approval rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#0d1221] border-[#1a2744] hover:border-[#ffc107]/30 transition-all group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6b7b9a]">Flagged</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-[#ffc107]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert className="h-4 w-4 text-[#ffc107]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#ffc107] tracking-tight">{stats.reviewCount.toLocaleString()}</div>
          <p className="text-xs text-[#6b7b9a] mt-1">Average risk score: {stats.avgRiskScore.toFixed(0)}</p>
        </CardContent>
      </Card>

      <Card className="bg-[#0d1221] border-[#1a2744] hover:border-[#ff4757]/30 transition-all group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#6b7b9a]">Blocked</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-[#ff4757]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldX className="h-4 w-4 text-[#ff4757]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#ff4757] tracking-tight">{stats.declinedCount.toLocaleString()}</div>
          <p className="flex items-center text-xs text-[#6b7b9a] mt-1">
            <TrendingDown className="mr-1 h-3 w-3 text-[#00ffc8]" />
            {formatAmountShort(stats.fraudPrevented)} saved
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
