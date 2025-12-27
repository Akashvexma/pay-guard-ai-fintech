"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Scale, FileText, Clock, ArrowRight, Sparkles, Download } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

interface Dispute {
  id: string
  amount: number
  reason: string
  status: "pending" | "evidence_needed" | "submitted" | "won" | "lost"
  winProbability: number
  dueDate: string
  aiRecommendation: string
}

export function DisputeResolution() {
  const { formatAmount } = useCurrency()
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null)

  const disputes: Dispute[] = [
    {
      id: "dsp_001",
      amount: 15900,
      reason: "Fraudulent Transaction",
      status: "evidence_needed",
      winProbability: 87,
      dueDate: "2024-01-20",
      aiRecommendation:
        "Strong case - device fingerprint, IP geolocation, and velocity data available. Recommend submitting with full evidence package.",
    },
    {
      id: "dsp_002",
      amount: 8900,
      reason: "Product Not Received",
      status: "submitted",
      winProbability: 92,
      dueDate: "2024-01-18",
      aiRecommendation: "Tracking shows delivery confirmation. High win probability.",
    },
    {
      id: "dsp_003",
      amount: 24500,
      reason: "Unauthorized Purchase",
      status: "pending",
      winProbability: 65,
      dueDate: "2024-01-22",
      aiRecommendation:
        "Mixed signals - legitimate device but unusual purchase pattern. Gather additional authentication logs.",
    },
  ]

  const stats = {
    totalDisputes: 23,
    won: 18,
    pending: 5,
    winRate: 78,
    amountRecovered: 45600,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-[#00ffc8] border-[#00ffc8] bg-[#00ffc8]/10"
      case "lost":
        return "text-red-400 border-red-500 bg-red-500/10"
      case "submitted":
        return "text-[#00a8ff] border-[#00a8ff] bg-[#00a8ff]/10"
      case "evidence_needed":
        return "text-yellow-400 border-yellow-500 bg-yellow-500/10"
      default:
        return "text-[#6b7b9a] border-[#1a2744] bg-[#1a2744]/50"
    }
  }

  return (
    <Card className="bg-[#0d1321] border-[#1a2744]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00a8ff]/20 to-[#a855f7]/20 flex items-center justify-center">
              <Scale className="h-5 w-5 text-[#00a8ff]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">AI Dispute Resolution</CardTitle>
              <p className="text-xs text-[#6b7b9a]">Automated chargeback defense</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00ffc8]/50 text-[#00ffc8] bg-[#00ffc8]/10">
            {stats.winRate}% Win Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] text-center">
            <div className="text-lg font-bold text-white">{stats.totalDisputes}</div>
            <div className="text-[10px] text-[#6b7b9a]">Total</div>
          </div>
          <div className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] text-center">
            <div className="text-lg font-bold text-[#00ffc8]">{stats.won}</div>
            <div className="text-[10px] text-[#6b7b9a]">Won</div>
          </div>
          <div className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] text-center">
            <div className="text-lg font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-[10px] text-[#6b7b9a]">Pending</div>
          </div>
          <div className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] text-center">
            <div className="text-lg font-bold text-[#00a8ff]">{formatAmount(stats.amountRecovered)}</div>
            <div className="text-[10px] text-[#6b7b9a]">Recovered</div>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-2">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className={`
                bg-[#080c14] rounded-xl border transition-all cursor-pointer
                ${selectedDispute === dispute.id ? "border-[#00ffc8]/50" : "border-[#1a2744] hover:border-[#1a2744]/80"}
              `}
              onClick={() => setSelectedDispute(selectedDispute === dispute.id ? null : dispute.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{formatAmount(dispute.amount)}</span>
                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(dispute.status)}`}>
                        {dispute.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6b7b9a] mt-1">{dispute.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <Sparkles className="h-3 w-3 text-[#a855f7]" />
                      <span className="text-white font-medium">{dispute.winProbability}%</span>
                      <span className="text-[#6b7b9a]">win chance</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#6b7b9a] mt-1">
                      <Clock className="h-3 w-3" />
                      Due {dispute.dueDate}
                    </div>
                  </div>
                </div>

                {selectedDispute === dispute.id && (
                  <div className="mt-4 pt-4 border-t border-[#1a2744]">
                    <div className="bg-[#0d1321] rounded-lg p-3 border border-[#a855f7]/30 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-[#a855f7]" />
                        <span className="text-xs text-[#a855f7] font-medium">AI Recommendation</span>
                      </div>
                      <p className="text-xs text-[#6b7b9a]">{dispute.aiRecommendation}</p>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#6b7b9a]">Win Probability</span>
                        <span className="text-white">{dispute.winProbability}%</span>
                      </div>
                      <Progress value={dispute.winProbability} className="h-1.5 bg-[#1a2744]" />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#00ffc8]/20 hover:bg-[#00ffc8]/30 text-[#00ffc8] border border-[#00ffc8]/30"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Generate Evidence
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#1a2744] text-[#6b7b9a] hover:text-white bg-transparent"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-[#00a8ff] to-[#a855f7] hover:opacity-90 text-white">
          View All Disputes
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
