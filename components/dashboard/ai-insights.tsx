"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Target, Sparkles } from "lucide-react"

interface Insight {
  id: string
  type: "recommendation" | "warning" | "pattern" | "opportunity"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  metric?: string
  action?: string
}

const insights: Insight[] = [
  {
    id: "1",
    type: "pattern",
    title: "Velocity Attack Pattern Detected",
    description: "23% increase in rapid-fire transactions from Eastern Europe. Consider tightening velocity limits.",
    impact: "high",
    metric: "+23%",
    action: "Adjust Rules",
  },
  {
    id: "2",
    type: "recommendation",
    title: "Lower Review Threshold",
    description:
      "Your false positive rate is 12% above average. Lowering review threshold to 45 could reduce manual reviews by 30%.",
    impact: "medium",
    metric: "-30%",
    action: "Apply",
  },
  {
    id: "3",
    type: "opportunity",
    title: "Whitelist Opportunity",
    description: "15 repeat customers have 100% approval rate. Adding them to whitelist could speed up checkout.",
    impact: "low",
    metric: "15 users",
    action: "Review",
  },
  {
    id: "4",
    type: "warning",
    title: "High-Risk BIN Cluster",
    description: "Cards starting with 411111 have 67% decline rate. Consider adding to auto-block list.",
    impact: "high",
    metric: "67%",
    action: "Block BIN",
  },
]

export function AIInsights() {
  const [activeInsight, setActiveInsight] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveInsight((current) => (current + 1) % insights.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [])

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "pattern":
        return Target
      case "recommendation":
        return Lightbulb
      case "opportunity":
        return TrendingUp
      case "warning":
        return AlertTriangle
    }
  }

  const getColor = (type: Insight["type"]) => {
    switch (type) {
      case "pattern":
        return "#00a8ff"
      case "recommendation":
        return "#00ffc8"
      case "opportunity":
        return "#a855f7"
      case "warning":
        return "#ffc107"
    }
  }

  return (
    <Card className="bg-[#0d1221] border-[#1a2744] overflow-hidden">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#a855f7]" />
            AI Insights
            <Badge className="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 text-[10px]">
              <Sparkles className="h-3 w-3 mr-1" />
              ML-Powered
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Featured Insight */}
        <div className="p-6 border-b border-[#1a2744]">
          {insights.map((insight, index) => {
            const Icon = getIcon(insight.type)
            const color = getColor(insight.type)
            return (
              <div
                key={insight.id}
                className={`transition-all duration-500 ${index === activeInsight ? "block" : "hidden"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                      <Badge
                        className={`text-[10px] ${
                          insight.impact === "high"
                            ? "bg-[#ff4757]/10 text-[#ff4757]"
                            : insight.impact === "medium"
                              ? "bg-[#ffc107]/10 text-[#ffc107]"
                              : "bg-[#00ffc8]/10 text-[#00ffc8]"
                        }`}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6b7b9a]">{insight.description}</p>
                    {insight.action && (
                      <Button size="sm" className="mt-3 h-8 bg-[#1a2744] hover:bg-[#2a3a5a] text-white text-xs">
                        {insight.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  {insight.metric && (
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color }}>
                        {insight.metric}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <Progress value={progress} className="h-0.5 mt-4 bg-[#1a2744]" />
        </div>

        {/* Insight Pills */}
        <div className="p-4 flex gap-2 overflow-x-auto">
          {insights.map((insight, index) => {
            const Icon = getIcon(insight.type)
            const color = getColor(insight.type)
            return (
              <button
                key={insight.id}
                onClick={() => {
                  setActiveInsight(index)
                  setProgress(0)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  index === activeInsight
                    ? "bg-[#1a2744] text-white border border-[#2a3a5a]"
                    : "text-[#6b7b9a] hover:text-white"
                }`}
              >
                <Icon className="h-3 w-3" style={{ color }} />
                {insight.type}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
