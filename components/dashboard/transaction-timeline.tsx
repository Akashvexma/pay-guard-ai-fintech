"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Cpu, CheckCircle2, XCircle, Clock, Wifi, Globe, Mail, Fingerprint } from "lucide-react"

interface TimelineStep {
  icon: typeof CreditCard
  title: string
  description: string
  time: string
  status: "complete" | "active" | "pending"
  color: string
}

interface TransactionTimelineProps {
  transactionId?: string
  decision?: "approve" | "review" | "decline"
}

export function TransactionTimeline({
  transactionId = "txn_demo_001",
  decision = "approve",
}: TransactionTimelineProps) {
  const steps: TimelineStep[] = [
    {
      icon: CreditCard,
      title: "Transaction Received",
      description: "Payment request captured",
      time: "0ms",
      status: "complete",
      color: "#00a8ff",
    },
    {
      icon: Fingerprint,
      title: "Device Fingerprint",
      description: "Browser & device analyzed",
      time: "8ms",
      status: "complete",
      color: "#a855f7",
    },
    {
      icon: Globe,
      title: "Geo Analysis",
      description: "Location risk assessed",
      time: "12ms",
      status: "complete",
      color: "#00ffc8",
    },
    {
      icon: Wifi,
      title: "Velocity Check",
      description: "Rate limits verified",
      time: "18ms",
      status: "complete",
      color: "#ffc107",
    },
    {
      icon: Mail,
      title: "Identity Signals",
      description: "Email & customer data",
      time: "25ms",
      status: "complete",
      color: "#00a8ff",
    },
    {
      icon: Cpu,
      title: "ML Scoring",
      description: "Neural network analysis",
      time: "38ms",
      status: "complete",
      color: "#a855f7",
    },
    {
      icon: decision === "approve" ? CheckCircle2 : XCircle,
      title: decision === "approve" ? "Approved" : decision === "review" ? "Flagged for Review" : "Declined",
      description:
        decision === "approve"
          ? "Low risk, proceed"
          : decision === "review"
            ? "Manual check needed"
            : "High risk blocked",
      time: "42ms",
      status: "complete",
      color: decision === "approve" ? "#00ffc8" : decision === "review" ? "#ffc107" : "#ff4757",
    },
  ]

  return (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#00a8ff]" />
            Transaction Journey
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs border-[#1a2744] text-[#6b7b9a]">
            {transactionId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <div key={index} className="flex gap-4 pb-6 last:pb-0">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: `${step.color}15`,
                      borderColor: `${step.color}50`,
                      boxShadow: `0 0 15px ${step.color}30`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-[#1a2744] to-[#1a2744]/20" />}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <span className="text-xs font-mono text-[#6b7b9a]">{step.time}</span>
                  </div>
                  <p className="text-sm text-[#6b7b9a] mt-0.5">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total time */}
        <div className="mt-4 pt-4 border-t border-[#1a2744] flex items-center justify-between">
          <span className="text-sm text-[#6b7b9a]">Total Processing Time</span>
          <Badge className="bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30 font-mono">42ms</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
