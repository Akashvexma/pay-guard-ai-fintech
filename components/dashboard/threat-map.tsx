"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, AlertTriangle, Zap } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

interface ThreatLocation {
  id: string
  country: string
  city: string
  lat: number
  lng: number
  riskScore: number
  type: "blocked" | "flagged" | "approved"
  amount: number
  timestamp: Date
}

const countries = [
  { code: "US", name: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"] },
  { code: "GB", name: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"] },
  { code: "DE", name: "Germany", cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne"] },
  { code: "FR", name: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"] },
  { code: "CA", name: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"] },
  { code: "AU", name: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"] },
  { code: "IN", name: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"] },
  { code: "NG", name: "Nigeria", cities: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"], highRisk: true },
  { code: "RU", name: "Russia", cities: ["Moscow", "St. Petersburg", "Novosibirsk"], highRisk: true },
  { code: "BR", name: "Brazil", cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"] },
]

export function ThreatMap() {
  const { formatAmount } = useCurrency()
  const [threats, setThreats] = useState<ThreatLocation[]>([])
  const [stats, setStats] = useState({ blocked: 0, flagged: 0, approved: 0 })

  useEffect(() => {
    // Generate initial threats
    const initialThreats: ThreatLocation[] = []
    for (let i = 0; i < 15; i++) {
      initialThreats.push(generateThreat())
    }
    setThreats(initialThreats)

    // Add new threats periodically
    const interval = setInterval(() => {
      const newThreat = generateThreat()
      setThreats((prev) => {
        const updated = [newThreat, ...prev.slice(0, 19)]
        // Update stats
        const newStats = { blocked: 0, flagged: 0, approved: 0 }
        updated.forEach((t) => {
          if (t.type === "blocked") newStats.blocked++
          else if (t.type === "flagged") newStats.flagged++
          else newStats.approved++
        })
        setStats(newStats)
        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  function generateThreat(): ThreatLocation {
    const country = countries[Math.floor(Math.random() * countries.length)]
    const city = country.cities[Math.floor(Math.random() * country.cities.length)]
    const isHighRisk = (country as any).highRisk || Math.random() > 0.7
    const riskScore = isHighRisk ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 50) + 5

    let type: "blocked" | "flagged" | "approved"
    if (riskScore >= 70) type = "blocked"
    else if (riskScore >= 40) type = "flagged"
    else type = "approved"

    return {
      id: `threat_${Date.now()}_${Math.random()}`,
      country: country.code,
      city,
      lat: 0,
      lng: 0,
      riskScore,
      type,
      amount: Math.floor(Math.random() * 50000) + 500,
      timestamp: new Date(),
    }
  }

  return (
    <Card className="bg-[#0d1221] border-[#1a2744] overflow-hidden">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#00ffc8]" />
            Global Threat Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc8]"></span>
            </span>
            <span className="text-xs text-[#00ffc8] font-mono">LIVE</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 border-b border-[#1a2744]">
          <div className="p-4 text-center border-r border-[#1a2744]">
            <div className="text-2xl font-bold text-[#00ffc8]">{stats.approved}</div>
            <div className="text-xs text-[#6b7b9a] flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Approved
            </div>
          </div>
          <div className="p-4 text-center border-r border-[#1a2744]">
            <div className="text-2xl font-bold text-[#ffc107]">{stats.flagged}</div>
            <div className="text-xs text-[#6b7b9a] flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Flagged
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-[#ff4757]">{stats.blocked}</div>
            <div className="text-xs text-[#6b7b9a] flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" /> Blocked
            </div>
          </div>
        </div>

        {/* Threat Feed */}
        <div className="max-h-[300px] overflow-y-auto">
          {threats.map((threat, index) => (
            <div
              key={threat.id}
              className={`flex items-center justify-between p-3 border-b border-[#1a2744]/50 transition-all duration-500 hover:bg-[#1a2744]/30 ${
                index === 0 ? "bg-[#00ffc8]/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    threat.type === "approved"
                      ? "bg-[#00ffc8]"
                      : threat.type === "flagged"
                        ? "bg-[#ffc107]"
                        : "bg-[#ff4757]"
                  } ${index === 0 ? "animate-pulse" : ""}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{threat.city}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-[#1a2744] text-[#6b7b9a]">
                      {threat.country}
                    </Badge>
                  </div>
                  <div className="text-xs text-[#6b7b9a]">
                    {formatAmount(threat.amount)} • Risk: {threat.riskScore}
                  </div>
                </div>
              </div>
              <Badge
                className={`text-[10px] font-mono uppercase ${
                  threat.type === "approved"
                    ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                    : threat.type === "flagged"
                      ? "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                      : "bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30"
                }`}
              >
                {threat.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
