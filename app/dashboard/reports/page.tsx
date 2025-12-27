"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/lib/currency-context"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Shield,
  DollarSign,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  Mail,
  RefreshCw,
} from "lucide-react"

export default function ReportsPage() {
  const { formatAmount, formatAmountShort, symbol } = useCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d")
  const [generating, setGenerating] = useState<string | null>(null)

  const reports = [
    {
      id: "fraud_summary",
      name: "Fraud Prevention Summary",
      description: "Overview of blocked fraud attempts and savings",
      icon: Shield,
      lastGenerated: "2 hours ago",
      status: "ready",
    },
    {
      id: "transaction_analysis",
      name: "Transaction Analysis",
      description: "Detailed breakdown of all processed transactions",
      icon: BarChart3,
      lastGenerated: "1 day ago",
      status: "ready",
    },
    {
      id: "risk_distribution",
      name: "Risk Score Distribution",
      description: "Analysis of risk scores across transactions",
      icon: PieChart,
      lastGenerated: "3 hours ago",
      status: "ready",
    },
    {
      id: "financial_impact",
      name: "Financial Impact Report",
      description: "ROI and cost savings from fraud prevention",
      icon: DollarSign,
      lastGenerated: "6 hours ago",
      status: "ready",
    },
    {
      id: "compliance_audit",
      name: "Compliance Audit Trail",
      description: "Complete audit log for regulatory compliance",
      icon: FileText,
      lastGenerated: "1 hour ago",
      status: "ready",
    },
    {
      id: "performance_metrics",
      name: "API Performance Metrics",
      description: "Response times, uptime, and throughput stats",
      icon: TrendingUp,
      lastGenerated: "30 minutes ago",
      status: "ready",
    },
  ]

  const summaryStats = {
    totalTransactions: 12847,
    fraudBlocked: 234,
    moneySaved: 8942000, // in cents
    avgRiskScore: 23,
    falsePositives: 12,
    accuracy: 99.2,
  }

  const handleDownload = (reportId: string, format: string) => {
    setGenerating(`${reportId}-${format}`)
    setTimeout(() => setGenerating(null), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#00ffc8]" />
            Reports & Analytics
          </h2>
          <p className="text-[#6b7b9a] text-sm mt-1">Generate and download detailed reports</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={
                selectedPeriod === period
                  ? "bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                  : "border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
              }
            >
              <Calendar className="h-4 w-4 mr-1" />
              {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Stats - Updated to use currency context */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{summaryStats.totalTransactions.toLocaleString()}</p>
            <p className="text-xs text-[#6b7b9a]">Transactions</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{summaryStats.fraudBlocked}</p>
            <p className="text-xs text-[#6b7b9a]">Fraud Blocked</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{formatAmountShort(summaryStats.moneySaved)}</p>
            <p className="text-xs text-[#6b7b9a]">Money Saved</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#00ffc8]">{summaryStats.avgRiskScore}</p>
            <p className="text-xs text-[#6b7b9a]">Avg Risk Score</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{summaryStats.falsePositives}</p>
            <p className="text-xs text-[#6b7b9a]">False Positives</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#a855f7]">{summaryStats.accuracy}%</p>
            <p className="text-xs text-[#6b7b9a]">Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card className="bg-[#0d1322] border-[#1a2235]">
        <CardHeader>
          <CardTitle className="text-white">Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-[#00ffc8]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[#00ffc8]/10">
                    <report.icon className="h-5 w-5 text-[#00ffc8]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{report.name}</h4>
                    <p className="text-sm text-[#6b7b9a]">{report.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-[#6b7b9a]" />
                      <span className="text-xs text-[#6b7b9a]">Last generated: {report.lastGenerated}</span>
                      <CheckCircle className="h-3 w-3 text-green-400 ml-2" />
                      <span className="text-xs text-green-400">Ready</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
                    onClick={() => handleDownload(report.id, "pdf")}
                    disabled={generating === `${report.id}-pdf`}
                  >
                    {generating === `${report.id}-pdf` ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
                    onClick={() => handleDownload(report.id, "csv")}
                    disabled={generating === `${report.id}-csv`}
                  >
                    {generating === `${report.id}-csv` ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    CSV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Reports */}
      <Card className="bg-[#0d1322] border-[#1a2235]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#00ffc8]" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a]">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#00a8ff]" />
                <div>
                  <p className="font-medium text-white">Weekly Fraud Summary</p>
                  <p className="text-sm text-[#6b7b9a]">Every Monday at 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Active</Badge>
                <Button variant="ghost" size="sm" className="text-[#6b7b9a] hover:text-white">
                  Edit
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a]">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#a855f7]" />
                <div>
                  <p className="font-medium text-white">Monthly Financial Report</p>
                  <p className="text-sm text-[#6b7b9a]">1st of every month at 8:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Active</Badge>
                <Button variant="ghost" size="sm" className="text-[#6b7b9a] hover:text-white">
                  Edit
                </Button>
              </div>
            </div>
            <Button className="w-full bg-[#1a2235] text-[#6b7b9a] hover:bg-[#1a2235]/80 hover:text-white border border-dashed border-[#1a2235]">
              + Schedule New Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
