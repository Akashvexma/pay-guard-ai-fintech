"use client"

import { FraudPatterns } from "@/components/dashboard/fraud-patterns"
import { NetworkVisualization } from "@/components/dashboard/network-visualization"
import { RoiCalculator } from "@/components/dashboard/roi-calculator"
import { ThreatMap } from "@/components/dashboard/threat-map"
import { ChargebackPrediction } from "@/components/dashboard/chargeback-prediction"
import { ComplianceStatus } from "@/components/dashboard/compliance-status"
import { ExportReports } from "@/components/dashboard/export-reports"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30">
            <BarChart3 className="h-3 w-3 mr-1" />
            Analytics
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
        <p className="text-[#6b7b9a] mt-1">Deep insights into fraud patterns, predictions, and compliance</p>
      </div>

      <ThreatMap />

      <ChargebackPrediction />

      <FraudPatterns />

      <div className="grid gap-6 lg:grid-cols-2">
        <NetworkVisualization />
        <RoiCalculator />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ComplianceStatus />
        <ExportReports />
      </div>
    </div>
  )
}
