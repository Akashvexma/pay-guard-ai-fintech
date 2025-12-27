"use client"

import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { RiskChart } from "@/components/dashboard/risk-chart"
import { ThreatMap } from "@/components/dashboard/threat-map"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { ROICalculator } from "@/components/dashboard/roi-calculator"
import { TransactionTimeline } from "@/components/dashboard/transaction-timeline"
import { SecurityScore } from "@/components/dashboard/security-score"
import { RealtimeMetrics } from "@/components/dashboard/realtime-metrics"
import { VoiceCommand } from "@/components/dashboard/voice-command"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { subDays, format } from "date-fns"
import { Activity, ArrowRight, Shield, Zap, TrendingUp, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/lib/currency-context"

export default function DashboardPage() {
  const { formatAmountShort } = useCurrency()

  // Demo data for hackathon
  const demoTransactions = [
    {
      id: "txn_001",
      merchant_id: "demo",
      customer_email: "john@example.com",
      customer_country: "US",
      amount_cents: 15000,
      currency: "USD",
      risk_score: 12,
      decision: "approve" as const,
      risk_factors: [],
      status: "approved" as const,
      created_at: new Date().toISOString(),
    },
    {
      id: "txn_002",
      merchant_id: "demo",
      customer_email: "suspicious@tempmail.com",
      customer_country: "NG",
      amount_cents: 89900,
      currency: "USD",
      risk_score: 78,
      decision: "decline" as const,
      risk_factors: [],
      status: "declined" as const,
      created_at: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: "txn_003",
      merchant_id: "demo",
      customer_email: "alice@company.com",
      customer_country: "CA",
      amount_cents: 4500,
      currency: "USD",
      risk_score: 8,
      decision: "approve" as const,
      risk_factors: [],
      status: "approved" as const,
      created_at: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: "txn_004",
      merchant_id: "demo",
      customer_email: "buyer@gmail.com",
      customer_country: "US",
      amount_cents: 32000,
      currency: "USD",
      risk_score: 45,
      decision: "review" as const,
      risk_factors: [],
      status: "review" as const,
      created_at: new Date(Date.now() - 180000).toISOString(),
    },
    {
      id: "txn_005",
      merchant_id: "demo",
      customer_email: "fraud@fake.net",
      customer_country: "RU",
      amount_cents: 150000,
      currency: "USD",
      risk_score: 92,
      decision: "decline" as const,
      risk_factors: [],
      status: "declined" as const,
      created_at: new Date(Date.now() - 240000).toISOString(),
    },
  ]

  const stats = {
    totalTransactions: 12847,
    approvedCount: 11234,
    reviewCount: 1089,
    declinedCount: 524,
    totalAmount: 45230000,
    fraudPrevented: 892400,
    avgRiskScore: 23,
  }

  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    chartData.push({
      date: format(date, "MMM dd"),
      approved: Math.floor(Math.random() * 50) + 130,
      review: Math.floor(Math.random() * 15) + 10,
      declined: Math.floor(Math.random() * 10) + 5,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">Command Center</h2>
            <Badge className="bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-[#6b7b9a] text-sm">Real-time fraud prevention intelligence for your business</p>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] hover:border-[#00ffc8]/30 bg-transparent transition-all"
          >
            <Link href="/dashboard/playground">
              <Play className="h-4 w-4 mr-2" />
              API Playground
            </Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] hover:opacity-90 text-[#0a0e1a] font-semibold shadow-[0_0_20px_rgba(0,255,200,0.2)] transition-all"
          >
            <Link href="/dashboard/demo">
              <Zap className="h-4 w-4 mr-2" />
              Live Demo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <VoiceCommand />

      <RealtimeMetrics />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-[#00ffc8]/10 to-transparent border-[#00ffc8]/30 hover:border-[#00ffc8]/50 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#00ffc8]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-[#00ffc8]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{formatAmountShort(892400)} Saved</h3>
                <p className="text-sm text-[#6b7b9a]">Fraud blocked this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#00a8ff]/10 to-transparent border-[#00a8ff]/30 hover:border-[#00a8ff]/50 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#00a8ff]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-[#00a8ff]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">99.7% Uptime</h3>
                <p className="text-sm text-[#6b7b9a]">API availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#a855f7]/10 to-transparent border-[#a855f7]/30 hover:border-[#a855f7]/50 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-[#a855f7]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">42ms Average</h3>
                <p className="text-sm text-[#6b7b9a]">Response latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid - Charts, Map, and Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ThreatMap />
        <AIInsights />
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiskChart data={chartData} />
        <TransactionTimeline />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SecurityScore />
        <ROICalculator />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={demoTransactions} />
    </div>
  )
}
