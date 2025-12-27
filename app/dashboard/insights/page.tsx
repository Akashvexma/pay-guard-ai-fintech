"use client"

import { BehavioralBiometrics } from "@/components/dashboard/behavioral-biometrics"
import { FraudRingDetection } from "@/components/dashboard/fraud-ring-detection"
import { DisputeResolution } from "@/components/dashboard/dispute-resolution"
import { RevenueImpact } from "@/components/dashboard/revenue-impact"
import { MLExplainer } from "@/components/dashboard/ml-explainer"
import { ChargebackPrediction } from "@/components/dashboard/chargeback-prediction"
import { Brain, Sparkles } from "lucide-react"

export default function InsightsPage() {
  const mlFactors = [
    { name: "Velocity Check", weight: 0.25, contribution: -15 },
    { name: "Geographic Risk", weight: 0.2, contribution: 8 },
    { name: "Email Reputation", weight: 0.15, contribution: -10 },
    { name: "Card BIN Analysis", weight: 0.15, contribution: 5 },
    { name: "Device Fingerprint", weight: 0.15, contribution: -8 },
    { name: "Behavioral Score", weight: 0.1, contribution: -5 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 flex items-center justify-center border border-[#a855f7]/30">
          <Brain className="h-6 w-6 text-[#a855f7]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            AI Insights
            <Sparkles className="h-5 w-5 text-[#a855f7]" />
          </h1>
          <p className="text-sm text-[#6b7b9a]">Advanced machine learning analytics and predictions</p>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BehavioralBiometrics />
        <FraudRingDetection />
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DisputeResolution />
        <RevenueImpact />
      </div>

      {/* Bottom Row - Pass props to MLExplainer */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MLExplainer riskScore={23} decision="approve" factors={mlFactors} />
        <ChargebackPrediction />
      </div>
    </div>
  )
}
