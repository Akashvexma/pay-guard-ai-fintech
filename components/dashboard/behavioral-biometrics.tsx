"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Fingerprint,
  MousePointer2,
  Keyboard,
  Timer,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react"

interface BiometricData {
  typingSpeed: number
  mouseVelocity: number
  clickPatterns: number
  scrollBehavior: number
  sessionDuration: number
  deviceConsistency: number
  overallScore: number
  riskLevel: "low" | "medium" | "high"
}

export function BehavioralBiometrics() {
  const [data, setData] = useState<BiometricData>({
    typingSpeed: 0,
    mouseVelocity: 0,
    clickPatterns: 0,
    scrollBehavior: 0,
    sessionDuration: 0,
    deviceConsistency: 0,
    overallScore: 0,
    riskLevel: "low",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Simulate real-time biometric analysis
    const interval = setInterval(() => {
      const newData: BiometricData = {
        typingSpeed: 85 + Math.random() * 15,
        mouseVelocity: 70 + Math.random() * 20,
        clickPatterns: 88 + Math.random() * 12,
        scrollBehavior: 75 + Math.random() * 20,
        sessionDuration: 90 + Math.random() * 10,
        deviceConsistency: 95 + Math.random() * 5,
        overallScore: 0,
        riskLevel: "low",
      }

      newData.overallScore =
        (newData.typingSpeed +
          newData.mouseVelocity +
          newData.clickPatterns +
          newData.scrollBehavior +
          newData.sessionDuration +
          newData.deviceConsistency) /
        6

      newData.riskLevel = newData.overallScore > 85 ? "low" : newData.overallScore > 70 ? "medium" : "high"

      setData(newData)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 3000)
  }

  const metrics = [
    {
      label: "Typing Pattern",
      value: data.typingSpeed,
      icon: Keyboard,
      description: "Keystroke dynamics analysis",
    },
    {
      label: "Mouse Movement",
      value: data.mouseVelocity,
      icon: MousePointer2,
      description: "Cursor trajectory patterns",
    },
    {
      label: "Click Behavior",
      value: data.clickPatterns,
      icon: Activity,
      description: "Click timing and accuracy",
    },
    {
      label: "Scroll Pattern",
      value: data.scrollBehavior,
      icon: TrendingUp,
      description: "Page navigation behavior",
    },
    {
      label: "Session Analysis",
      value: data.sessionDuration,
      icon: Timer,
      description: "Time-based patterns",
    },
    {
      label: "Device Match",
      value: data.deviceConsistency,
      icon: Fingerprint,
      description: "Hardware fingerprint",
    },
  ]

  return (
    <Card className="bg-[#0d1321] border-[#1a2744]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-[#a855f7]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Behavioral Biometrics</CardTitle>
              <p className="text-xs text-[#6b7b9a]">Real-time user behavior analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-[#00ffc8] text-xs">
                <div className="h-2 w-2 rounded-full bg-[#00ffc8] animate-pulse" />
                Analyzing...
              </div>
            )}
            <Badge
              variant="outline"
              className={`
                ${data.riskLevel === "low" ? "border-[#00ffc8] text-[#00ffc8] bg-[#00ffc8]/10" : ""}
                ${data.riskLevel === "medium" ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" : ""}
                ${data.riskLevel === "high" ? "border-red-500 text-red-500 bg-red-500/10" : ""}
              `}
            >
              {data.riskLevel === "low" && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {data.riskLevel === "medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {data.riskLevel === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)} Risk
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="bg-[#080c14] rounded-xl p-4 border border-[#1a2744]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7b9a]">Trust Score</span>
            <span className="text-2xl font-bold text-white">{data.overallScore.toFixed(0)}%</span>
          </div>
          <Progress value={data.overallScore} className="h-2 bg-[#1a2744]" />
          <p className="text-xs text-[#6b7b9a] mt-2">Based on 6 behavioral signals analyzed in real-time</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div
                key={metric.label}
                className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] hover:border-[#00ffc8]/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-[#00ffc8]" />
                  <span className="text-xs text-[#6b7b9a]">{metric.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">{metric.value.toFixed(0)}%</span>
                  <Progress value={metric.value} className="h-1.5 w-16 bg-[#1a2744]" />
                </div>
                <p className="text-[10px] text-[#4a5568] mt-1">{metric.description}</p>
              </div>
            )
          })}
        </div>

        {/* Analysis Details */}
        <div className="text-xs text-[#6b7b9a] bg-[#080c14] rounded-lg p-3 border border-[#1a2744]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3 w-3 text-[#00ffc8]" />
            <span className="text-white font-medium">How It Works</span>
          </div>
          <p>
            Our behavioral biometrics engine analyzes 200+ micro-signals from user interactions to create a unique
            behavioral fingerprint. This helps identify bots, account takeover attempts, and fraudulent sessions without
            adding friction.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
