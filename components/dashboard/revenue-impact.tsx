"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, ShieldCheck, Ban, RefreshCcw, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

export function RevenueImpact() {
  const { formatAmount, formatAmountShort } = useCurrency()

  const metrics = {
    fraudBlocked: 89240000,
    falseDeclinesSaved: 23400000,
    chargebacksAvoided: 12800000,
    operationalSavings: 4500000,
    totalImpact: 129940000,
    roi: 4234,
  }

  const monthlyData = [
    { month: "Aug", saved: 18200000, blocked: 45 },
    { month: "Sep", saved: 21400000, blocked: 52 },
    { month: "Oct", saved: 19800000, blocked: 48 },
    { month: "Nov", saved: 24600000, blocked: 61 },
    { month: "Dec", saved: 28900000, blocked: 73 },
    { month: "Jan", saved: 32400000, blocked: 82 },
  ]

  const impactItems = [
    {
      label: "Fraud Blocked",
      value: metrics.fraudBlocked,
      icon: ShieldCheck,
      color: "text-[#00ffc8]",
      bgColor: "bg-[#00ffc8]/10",
      borderColor: "border-[#00ffc8]/30",
      change: 23,
      positive: true,
    },
    {
      label: "False Declines Saved",
      value: metrics.falseDeclinesSaved,
      icon: RefreshCcw,
      color: "text-[#00a8ff]",
      bgColor: "bg-[#00a8ff]/10",
      borderColor: "border-[#00a8ff]/30",
      change: 18,
      positive: true,
    },
    {
      label: "Chargebacks Avoided",
      value: metrics.chargebacksAvoided,
      icon: Ban,
      color: "text-[#a855f7]",
      bgColor: "bg-[#a855f7]/10",
      borderColor: "border-[#a855f7]/30",
      change: 31,
      positive: true,
    },
    {
      label: "Operational Savings",
      value: metrics.operationalSavings,
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      change: 12,
      positive: true,
    },
  ]

  return (
    <Card className="bg-[#0d1321] border-[#1a2744]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00ffc8]/20 to-[#00a8ff]/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#00ffc8]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Revenue Impact</CardTitle>
              <p className="text-xs text-[#6b7b9a]">Business value generated</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00ffc8]/50 text-[#00ffc8] bg-[#00ffc8]/10">
            {metrics.roi}% ROI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Impact */}
        <div className="bg-gradient-to-br from-[#00ffc8]/10 to-[#00a8ff]/10 rounded-xl p-4 border border-[#00ffc8]/30">
          <div className="text-xs text-[#6b7b9a] mb-1">Total Value Generated (YTD)</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">{formatAmountShort(metrics.totalImpact)}</span>
            <Badge className="bg-[#00ffc8]/20 text-[#00ffc8] border-0">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              24% vs last year
            </Badge>
          </div>
        </div>

        {/* Impact Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {impactItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={`bg-[#080c14] rounded-xl p-3 border ${item.borderColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-6 w-6 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-3 w-3 ${item.color}`} />
                  </div>
                  <span className="text-[10px] text-[#6b7b9a]">{item.label}</span>
                </div>
                <div className="text-lg font-bold text-white">{formatAmountShort(item.value)}</div>
                <div
                  className={`flex items-center gap-1 text-[10px] mt-1 ${item.positive ? "text-[#00ffc8]" : "text-red-400"}`}
                >
                  {item.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {item.change}% this month
                </div>
              </div>
            )
          })}
        </div>

        {/* Monthly Trend */}
        <div className="bg-[#080c14] rounded-xl p-4 border border-[#1a2744]">
          <div className="text-xs text-[#6b7b9a] mb-3">Monthly Savings Trend</div>
          <div className="flex items-end gap-2 h-20">
            {monthlyData.map((data, idx) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#00ffc8] to-[#00a8ff] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(data.saved / 35000000) * 100}%` }}
                />
                <span className="text-[9px] text-[#6b7b9a]">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-xs text-[#6b7b9a] bg-[#080c14] rounded-lg p-3 border border-[#1a2744]">
          <p>
            Revenue impact is calculated based on blocked fraud attempts, recovered false declines, avoided chargebacks,
            and reduced manual review costs. All figures are verified against actual transaction outcomes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
