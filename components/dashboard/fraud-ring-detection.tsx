"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, AlertTriangle, Users, CreditCard, Mail, Globe, Smartphone, ChevronRight, Shield } from "lucide-react"

interface FraudRing {
  id: string
  name: string
  severity: "critical" | "high" | "medium"
  connectedEntities: number
  totalAttempts: number
  amountAtRisk: number
  firstSeen: string
  lastActivity: string
  entities: {
    type: "ip" | "card" | "email" | "device"
    value: string
    connections: number
  }[]
}

export function FraudRingDetection() {
  const [selectedRing, setSelectedRing] = useState<string | null>(null)

  const fraudRings: FraudRing[] = [
    {
      id: "ring_001",
      name: "Eastern European Card Testing Ring",
      severity: "critical",
      connectedEntities: 47,
      totalAttempts: 1234,
      amountAtRisk: 89500,
      firstSeen: "2024-01-10",
      lastActivity: "2 hours ago",
      entities: [
        { type: "ip", value: "185.XX.XX.0/24", connections: 23 },
        { type: "card", value: "4111-XXXX-XXXX-****", connections: 15 },
        { type: "email", value: "*@tempmail.ru", connections: 31 },
        { type: "device", value: "Android Emulator", connections: 8 },
      ],
    },
    {
      id: "ring_002",
      name: "Account Takeover Network",
      severity: "high",
      connectedEntities: 23,
      totalAttempts: 456,
      amountAtRisk: 34200,
      firstSeen: "2024-01-12",
      lastActivity: "5 hours ago",
      entities: [
        { type: "ip", value: "VPN/Proxy Cluster", connections: 12 },
        { type: "email", value: "Compromised Gmail", connections: 18 },
        { type: "device", value: "Headless Chrome", connections: 5 },
      ],
    },
    {
      id: "ring_003",
      name: "Refund Abuse Cluster",
      severity: "medium",
      connectedEntities: 12,
      totalAttempts: 89,
      amountAtRisk: 12800,
      firstSeen: "2024-01-14",
      lastActivity: "1 day ago",
      entities: [
        { type: "ip", value: "Residential Proxy", connections: 6 },
        { type: "card", value: "Virtual Cards", connections: 8 },
        { type: "email", value: "Alias Emails", connections: 12 },
      ],
    },
  ]

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "ip":
        return Globe
      case "card":
        return CreditCard
      case "email":
        return Mail
      case "device":
        return Smartphone
      default:
        return Network
    }
  }

  return (
    <Card className="bg-[#0d1321] border-[#1a2744]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <Network className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Fraud Ring Detection</CardTitle>
              <p className="text-xs text-[#6b7b9a]">AI-powered network analysis</p>
            </div>
          </div>
          <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
            {fraudRings.length} Active Rings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {fraudRings.map((ring) => (
          <div
            key={ring.id}
            className={`
              bg-[#080c14] rounded-xl border transition-all cursor-pointer
              ${selectedRing === ring.id ? "border-[#00ffc8]/50" : "border-[#1a2744] hover:border-[#1a2744]/80"}
            `}
            onClick={() => setSelectedRing(selectedRing === ring.id ? null : ring.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    h-8 w-8 rounded-lg flex items-center justify-center
                    ${ring.severity === "critical" ? "bg-red-500/20" : ""}
                    ${ring.severity === "high" ? "bg-orange-500/20" : ""}
                    ${ring.severity === "medium" ? "bg-yellow-500/20" : ""}
                  `}
                  >
                    <AlertTriangle
                      className={`h-4 w-4
                      ${ring.severity === "critical" ? "text-red-400" : ""}
                      ${ring.severity === "high" ? "text-orange-400" : ""}
                      ${ring.severity === "medium" ? "text-yellow-400" : ""}
                    `}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{ring.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#6b7b9a]">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {ring.connectedEntities} entities
                      </span>
                      <span>{ring.totalAttempts} attempts</span>
                      <span className="text-red-400">${(ring.amountAtRisk / 100).toLocaleString()} at risk</span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-[#6b7b9a] transition-transform ${selectedRing === ring.id ? "rotate-90" : ""}`}
                />
              </div>

              {selectedRing === ring.id && (
                <div className="mt-4 pt-4 border-t border-[#1a2744]">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-xs">
                      <span className="text-[#6b7b9a]">First Seen:</span>
                      <span className="text-white ml-2">{ring.firstSeen}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-[#6b7b9a]">Last Activity:</span>
                      <span className="text-white ml-2">{ring.lastActivity}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-[#6b7b9a]">Connected Entities:</span>
                    {ring.entities.map((entity, idx) => {
                      const Icon = getEntityIcon(entity.type)
                      return (
                        <div key={idx} className="flex items-center justify-between bg-[#0d1321] rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3 w-3 text-[#00ffc8]" />
                            <span className="text-xs text-white font-mono">{entity.value}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] border-[#1a2744] text-[#6b7b9a]">
                            {entity.connections} links
                          </Badge>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Block All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#1a2744] text-[#6b7b9a] hover:text-white bg-transparent"
                    >
                      Investigate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="text-xs text-[#6b7b9a] bg-[#080c14] rounded-lg p-3 border border-[#1a2744]">
          <div className="flex items-center gap-2 mb-2">
            <Network className="h-3 w-3 text-[#00ffc8]" />
            <span className="text-white font-medium">Graph Analysis</span>
          </div>
          <p>
            Our fraud ring detection uses graph neural networks to identify connected fraud attempts across shared IPs,
            devices, cards, and behavioral patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
