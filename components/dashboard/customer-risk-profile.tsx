"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCurrency } from "@/lib/currency-context"
import { CreditCard, TrendingUp, Shield, AlertTriangle, CheckCircle, MapPin, History } from "lucide-react"

export function CustomerRiskProfile() {
  const { formatAmount } = useCurrency()

  const customer = {
    email: "john.smith@gmail.com",
    riskScore: 15,
    trustLevel: "high",
    accountAge: "2 years, 3 months",
    totalTransactions: 47,
    totalSpent: 892400, // cents
    avgTransaction: 18987, // cents
    lastTransaction: "2 hours ago",
    location: "New York, US",
    devices: 2,
    chargebacks: 0,
    disputes: 0,
  }

  const transactionHistory = [
    { date: "Today", amount: 14999, status: "approve", risk: 12 },
    { date: "Yesterday", amount: 8999, status: "approve", risk: 8 },
    { date: "3 days ago", amount: 24999, status: "approve", risk: 18 },
    { date: "1 week ago", amount: 4599, status: "approve", risk: 5 },
    { date: "2 weeks ago", amount: 32000, status: "review", risk: 45 },
  ]

  const riskFactors = [
    { name: "Email Age", score: 95, description: "Gmail account, 5+ years old" },
    { name: "Payment History", score: 100, description: "No chargebacks, no disputes" },
    { name: "Device Consistency", score: 90, description: "2 known devices" },
    { name: "Location Stability", score: 85, description: "Consistent US-based activity" },
    { name: "Transaction Patterns", score: 88, description: "Normal spending behavior" },
  ]

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00ffc8] to-[#00a8ff] flex items-center justify-center text-[#0a0e1a] font-bold text-lg">
              JS
            </div>
            <div>
              <CardTitle className="text-white">Customer Risk Profile</CardTitle>
              <CardDescription className="text-[#6b7b9a]">{customer.email}</CardDescription>
            </div>
          </div>
          <Badge className="bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30 px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            TRUSTED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Risk Score */}
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 flex-shrink-0">
            <svg className="h-24 w-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#1a2744" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#00ffc8"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(100 - customer.riskScore) * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#00ffc8]">{customer.riskScore}</span>
              <span className="text-xs text-[#6b7b9a]">Risk</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
                <History className="h-3 w-3" />
                <span className="text-xs">Account Age</span>
              </div>
              <p className="text-sm font-medium text-white">{customer.accountAge}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Transactions</span>
              </div>
              <p className="text-sm font-medium text-white">{customer.totalTransactions}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
                <CreditCard className="h-3 w-3" />
                <span className="text-xs">Total Spent</span>
              </div>
              <p className="text-sm font-medium text-white">{formatAmount(customer.totalSpent)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">Location</span>
              </div>
              <p className="text-sm font-medium text-white">{customer.location}</p>
            </div>
          </div>
        </div>

        {/* Trust Factors */}
        <div>
          <h4 className="text-sm font-medium text-[#8b9dc3] mb-3">Trust Factors</h4>
          <div className="space-y-3">
            {riskFactors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{factor.name}</span>
                  <span className="text-xs text-[#00ffc8] font-mono">{factor.score}%</span>
                </div>
                <Progress value={factor.score} className="h-1.5 bg-[#1a2744]" />
                <p className="text-xs text-[#6b7b9a]">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="text-sm font-medium text-[#8b9dc3] mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {transactionHistory.map((txn, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0a0e1a] border border-[#1a2744]"
              >
                <div className="flex items-center gap-3">
                  {txn.status === "approve" ? (
                    <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-[#ffc107]" />
                  )}
                  <div>
                    <p className="text-sm text-white">{formatAmount(txn.amount)}</p>
                    <p className="text-xs text-[#6b7b9a]">{txn.date}</p>
                  </div>
                </div>
                <Badge className={txn.risk < 30 ? "bg-[#00ffc8]/10 text-[#00ffc8]" : "bg-[#ffc107]/10 text-[#ffc107]"}>
                  Risk: {txn.risk}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1a2744]">
          <div className="text-center">
            <p className="text-xl font-bold text-[#00ffc8]">{customer.chargebacks}</p>
            <p className="text-xs text-[#6b7b9a]">Chargebacks</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#00ffc8]">{customer.disputes}</p>
            <p className="text-xs text-[#6b7b9a]">Disputes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#00ffc8]">{customer.devices}</p>
            <p className="text-xs text-[#6b7b9a]">Devices</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
