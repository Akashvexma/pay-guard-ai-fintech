"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Cpu, Network, Layers, ArrowRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface MLExplainerProps {
  riskScore?: number
  decision?: "approve" | "review" | "decline"
  factors?: Array<{ name: string; weight: number; contribution: number }>
}

const defaultFactors = [
  { name: "Velocity Check", weight: 0.25, contribution: -15 },
  { name: "Geographic Risk", weight: 0.2, contribution: 8 },
  { name: "Email Reputation", weight: 0.15, contribution: -10 },
  { name: "Card BIN Analysis", weight: 0.15, contribution: 5 },
  { name: "Device Fingerprint", weight: 0.15, contribution: -8 },
  { name: "Behavioral Score", weight: 0.1, contribution: -5 },
]

export function MLExplainer({ riskScore = 23, decision = "approve", factors = defaultFactors }: MLExplainerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const steps = [
    { name: "Data Input", icon: Layers, description: "Transaction data received" },
    { name: "Feature Extraction", icon: Cpu, description: "200+ features analyzed" },
    { name: "Neural Network", icon: Network, description: "Deep learning model" },
    { name: "Risk Scoring", icon: Brain, description: "Final score computed" },
  ]

  useEffect(() => {
    if (!isAnimating) return
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
    }, 800)
    return () => clearInterval(timer)
  }, [isAnimating, steps.length])

  const DecisionIcon = decision === "approve" ? CheckCircle : decision === "review" ? AlertTriangle : XCircle
  const decisionColor =
    decision === "approve" ? "text-green-400" : decision === "review" ? "text-yellow-400" : "text-red-400"

  return (
    <Card className="bg-[#0d1322] border-[#1a2235]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#a855f7]" />
          ML Decision Explainer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Processing Pipeline */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.name} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`p-3 rounded-lg transition-all duration-500 ${
                    i <= currentStep
                      ? "bg-[#a855f7]/20 border border-[#a855f7]/50"
                      : "bg-[#1a2235] border border-[#1a2235]"
                  }`}
                >
                  <step.icon
                    className={`h-5 w-5 transition-colors duration-500 ${
                      i <= currentStep ? "text-[#a855f7]" : "text-[#6b7b9a]"
                    }`}
                  />
                </div>
                <p className={`text-xs mt-2 ${i <= currentStep ? "text-white" : "text-[#6b7b9a]"}`}>{step.name}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className={`h-4 w-4 mx-2 transition-colors duration-500 ${
                    i < currentStep ? "text-[#a855f7]" : "text-[#1a2235]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        {!isAnimating && (
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2235] animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DecisionIcon className={`h-6 w-6 ${decisionColor}`} />
                <div>
                  <p className={`font-bold ${decisionColor}`}>{decision.toUpperCase()}</p>
                  <p className="text-xs text-[#6b7b9a]">Risk Score: {riskScore}/100</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{riskScore}</p>
                <p className="text-xs text-[#6b7b9a]">Confidence: 94%</p>
              </div>
            </div>

            {/* Feature Contributions */}
            <div className="space-y-2">
              <p className="text-sm text-[#6b7b9a] mb-2">Top Contributing Factors:</p>
              {factors.slice(0, 4).map((factor) => (
                <div key={factor.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">{factor.name}</span>
                      <span className={factor.contribution > 0 ? "text-red-400" : "text-green-400"}>
                        {factor.contribution > 0 ? "+" : ""}
                        {factor.contribution}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${factor.contribution > 0 ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${Math.abs(factor.contribution)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
