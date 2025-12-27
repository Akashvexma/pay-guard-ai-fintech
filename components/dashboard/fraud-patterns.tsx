"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Clock, CreditCard, Mail, Wifi, Zap, ShieldAlert, BarChart3 } from "lucide-react"

const fraudPatterns = [
  {
    name: "Velocity Attack",
    description: "Multiple rapid transactions from same source",
    percentage: 34,
    trend: "+12%",
    severity: "high",
    icon: Zap,
    color: "#ff4757",
  },
  {
    name: "Geographic Anomaly",
    description: "Transactions from high-risk regions",
    percentage: 28,
    trend: "+5%",
    severity: "high",
    icon: Globe,
    color: "#ff4757",
  },
  {
    name: "Card Testing",
    description: "Small amounts to verify stolen cards",
    percentage: 18,
    trend: "-3%",
    severity: "medium",
    icon: CreditCard,
    color: "#ffc107",
  },
  {
    name: "Disposable Email",
    description: "Temporary email services used",
    percentage: 12,
    trend: "+8%",
    severity: "medium",
    icon: Mail,
    color: "#ffc107",
  },
  {
    name: "Bot Traffic",
    description: "Automated transaction attempts",
    percentage: 8,
    trend: "+15%",
    severity: "high",
    icon: Wifi,
    color: "#ff4757",
  },
]

const recentThreats = [
  { time: "2 min ago", type: "Velocity", location: "Lagos, NG", blocked: true },
  { time: "5 min ago", type: "Card Test", location: "Moscow, RU", blocked: true },
  { time: "8 min ago", type: "Bot", location: "Unknown", blocked: true },
  { time: "12 min ago", type: "Geo Risk", location: "Beijing, CN", blocked: false },
  { time: "15 min ago", type: "Velocity", location: "Kiev, UA", blocked: true },
]

export function FraudPatterns() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Fraud Pattern Breakdown */}
      <Card className="border-[#1a2744] bg-[#0d1221]">
        <CardHeader className="border-b border-[#1a2744]">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#00ffc8]" />
            Fraud Pattern Analysis
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">
            Distribution of detected fraud attempts this month
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {fraudPatterns.map((pattern) => {
            const Icon = pattern.icon
            return (
              <div key={pattern.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${pattern.color}15`, border: `1px solid ${pattern.color}30` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: pattern.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{pattern.name}</p>
                      <p className="text-xs text-[#6b7b9a]">{pattern.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{pattern.percentage}%</p>
                    <p className={`text-xs ${pattern.trend.startsWith("+") ? "text-[#ff4757]" : "text-[#00ffc8]"}`}>
                      {pattern.trend} vs last month
                    </p>
                  </div>
                </div>
                <Progress
                  value={pattern.percentage}
                  className="h-2 bg-[#1a2744]"
                  style={{
                    // @ts-ignore
                    "--progress-foreground": pattern.color,
                  }}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Threats */}
      <Card className="border-[#1a2744] bg-[#0d1221]">
        <CardHeader className="border-b border-[#1a2744]">
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#ff4757]" />
            Recent Threat Activity
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">Latest detected fraud attempts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#1a2744]">
            {recentThreats.map((threat, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[#1a2744]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${threat.blocked ? "bg-[#00ffc8]" : "bg-[#ffc107]"}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{threat.type} Attack</p>
                    <div className="flex items-center gap-2 text-xs text-[#6b7b9a]">
                      <Globe className="h-3 w-3" />
                      {threat.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      threat.blocked
                        ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                        : "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                    }
                  >
                    {threat.blocked ? "Blocked" : "Flagged"}
                  </Badge>
                  <p className="text-xs text-[#6b7b9a] mt-1 flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {threat.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
