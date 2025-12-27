"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingUp, Lock, Eye, Server, CheckCircle } from "lucide-react"

export function SecurityScore() {
  const [score, setScore] = useState(0)
  const targetScore = 94

  useEffect(() => {
    const timer = setInterval(() => {
      setScore((prev) => {
        if (prev >= targetScore) return prev
        return prev + 1
      })
    }, 20)
    return () => clearInterval(timer)
  }, [])

  const securityMetrics = [
    { name: "API Security", score: 98, icon: Lock },
    { name: "Data Encryption", score: 100, icon: Server },
    { name: "Fraud Detection", score: 96, icon: Eye },
    { name: "Compliance", score: 92, icon: CheckCircle },
  ]

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="bg-[#0d1322] border-[#1a2235]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00ffc8]" />
          Security Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="45" fill="none" stroke="#1a2235" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ffc8" />
                  <stop offset="100%" stopColor="#00a8ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-xs text-[#6b7b9a]">/ 100</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex-1 space-y-3">
            {securityMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center gap-3">
                <metric.icon className="h-4 w-4 text-[#6b7b9a]" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6b7b9a]">{metric.name}</span>
                    <span className="text-white">{metric.score}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1a2235] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-green-400">+3% from last month</span>
          </div>
          <span className="text-xs text-[#6b7b9a]">Last audit: 2 days ago</span>
        </div>
      </CardContent>
    </Card>
  )
}
