"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network } from "lucide-react"

interface Node {
  id: string
  x: number
  y: number
  type: "ip" | "card" | "email" | "device"
  risk: "low" | "medium" | "high"
  label: string
}

interface Connection {
  from: string
  to: string
  strength: number
}

export function NetworkVisualization() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "ip1", x: 150, y: 100, type: "ip", risk: "high", label: "192.168.1.x" },
    { id: "ip2", x: 350, y: 80, type: "ip", risk: "low", label: "203.0.113.x" },
    { id: "card1", x: 100, y: 200, type: "card", risk: "high", label: "****4242" },
    { id: "card2", x: 300, y: 220, type: "card", risk: "medium", label: "****5555" },
    { id: "email1", x: 200, y: 150, type: "email", risk: "high", label: "temp@..." },
    { id: "email2", x: 400, y: 160, type: "email", risk: "low", label: "user@..." },
    { id: "device1", x: 250, y: 280, type: "device", risk: "medium", label: "Device A" },
  ])

  const connections: Connection[] = [
    { from: "ip1", to: "card1", strength: 0.9 },
    { from: "ip1", to: "email1", strength: 0.8 },
    { from: "card1", to: "email1", strength: 0.95 },
    { from: "ip2", to: "email2", strength: 0.3 },
    { from: "card2", to: "device1", strength: 0.5 },
    { from: "email1", to: "device1", strength: 0.7 },
  ]

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Animate nodes slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          x: node.x + (Math.random() - 0.5) * 2,
          y: node.y + (Math.random() - 0.5) * 2,
        })),
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "#ff4757"
      case "medium":
        return "#ffc107"
      default:
        return "#00ffc8"
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "ip":
        return "IP"
      case "card":
        return "CC"
      case "email":
        return "@"
      default:
        return "D"
    }
  }

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <Network className="h-5 w-5 text-[#a855f7]" />
          Fraud Network Analysis
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">
          Visualizing connections between suspicious entities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[350px] bg-[#0a0e1a] rounded-lg border border-[#1a2744] overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, i) => {
              const fromNode = nodes.find((n) => n.id === conn.from)
              const toNode = nodes.find((n) => n.id === conn.to)
              if (!fromNode || !toNode) return null

              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to

              return (
                <line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={conn.strength > 0.7 ? "#ff4757" : conn.strength > 0.4 ? "#ffc107" : "#1a2744"}
                  strokeWidth={isHighlighted ? 3 : 1}
                  strokeOpacity={isHighlighted ? 1 : 0.5}
                  strokeDasharray={conn.strength < 0.5 ? "5,5" : "none"}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                left: node.x - 20,
                top: node.y - 20,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold border-2"
                style={{
                  backgroundColor: `${getRiskColor(node.risk)}20`,
                  borderColor: getRiskColor(node.risk),
                  color: getRiskColor(node.risk),
                  boxShadow: hoveredNode === node.id ? `0 0 20px ${getRiskColor(node.risk)}50` : "none",
                }}
              >
                {getNodeIcon(node.type)}
              </div>
              {hoveredNode === node.id && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#1a2744] border border-[#2a3a5a] rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
                  {node.label}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff4757]" />
            <span className="text-xs text-[#6b7b9a]">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ffc107]" />
            <span className="text-xs text-[#6b7b9a]">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#00ffc8]" />
            <span className="text-xs text-[#6b7b9a]">Low Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
