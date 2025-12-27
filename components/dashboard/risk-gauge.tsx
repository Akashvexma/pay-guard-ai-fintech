"use client"

import { useEffect, useState } from "react"

interface RiskGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function RiskGauge({ score, size = "md", animated = true }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  const dimensions = {
    sm: { size: 80, stroke: 6, fontSize: "text-lg" },
    md: { size: 120, stroke: 8, fontSize: "text-2xl" },
    lg: { size: 160, stroke: 10, fontSize: "text-4xl" },
  }

  const { size: svgSize, stroke, fontSize } = dimensions[size]
  const radius = (svgSize - stroke) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    if (animated) {
      const duration = 1000
      const steps = 60
      const increment = score / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= score) {
          setAnimatedScore(score)
          clearInterval(timer)
        } else {
          setAnimatedScore(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setAnimatedScore(score)
    }
  }, [score, animated])

  const progress = (animatedScore / 100) * circumference
  const offset = circumference - progress

  const getColor = (s: number) => {
    if (s < 30) return "#00ffc8"
    if (s < 70) return "#ffc107"
    return "#ff4757"
  }

  const color = getColor(animatedScore)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        {/* Background circle */}
        <circle cx={svgSize / 2} cy={svgSize / 2} r={radius} fill="none" stroke="#1a2744" strokeWidth={stroke} />
        {/* Progress circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-out, stroke 0.3s ease",
            filter: `drop-shadow(0 0 8px ${color}50)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSize} font-bold font-mono`} style={{ color }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-[10px] text-[#6b7b9a] uppercase tracking-wider">Risk</span>
      </div>
    </div>
  )
}
