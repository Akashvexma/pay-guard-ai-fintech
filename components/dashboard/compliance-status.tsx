"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Shield, Lock, FileCheck, Globe, Server, Key } from "lucide-react"

const complianceItems = [
  {
    name: "PCI-DSS Level 1",
    status: "compliant",
    description: "Payment Card Industry Data Security Standard",
    icon: Lock,
    lastAudit: "Dec 15, 2024",
    progress: 100,
  },
  {
    name: "GDPR",
    status: "compliant",
    description: "General Data Protection Regulation (EU)",
    icon: Globe,
    lastAudit: "Dec 10, 2024",
    progress: 100,
  },
  {
    name: "SOC 2 Type II",
    status: "in_progress",
    description: "Service Organization Control",
    icon: FileCheck,
    lastAudit: "In Progress",
    progress: 78,
  },
  {
    name: "Data Encryption",
    status: "compliant",
    description: "AES-256 encryption at rest and in transit",
    icon: Key,
    lastAudit: "Always Active",
    progress: 100,
  },
  {
    name: "API Security",
    status: "compliant",
    description: "HMAC authentication, rate limiting, IP allowlisting",
    icon: Server,
    lastAudit: "Dec 20, 2024",
    progress: 100,
  },
]

const securityMetrics = [
  { label: "Uptime", value: "99.99%", trend: "stable" },
  { label: "Avg Response", value: "42ms", trend: "improving" },
  { label: "Threats Blocked", value: "12,847", trend: "increasing" },
  { label: "Data Breaches", value: "0", trend: "stable" },
]

export function ComplianceStatus() {
  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00ffc8]" />
          Security & Compliance
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">
          Enterprise-grade security certifications and status
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Security Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {securityMetrics.map((metric) => (
            <div key={metric.label} className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744] text-center">
              <p className="text-lg font-bold text-white">{metric.value}</p>
              <p className="text-xs text-[#6b7b9a]">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Compliance Items */}
        <div className="space-y-3">
          {complianceItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744] hover:border-[#00ffc8]/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[#00ffc8]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white">{item.name}</h4>
                        <Badge
                          className={
                            item.status === "compliant"
                              ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                              : "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                          }
                        >
                          {item.status === "compliant" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Compliant
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              In Progress
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6b7b9a] mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6b7b9a]">{item.lastAudit}</p>
                </div>
                {item.progress < 100 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6b7b9a]">Certification Progress</span>
                      <span className="text-white">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5 bg-[#1a2744]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Trust Badge */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-[#00ffc8]/10 to-[#00a8ff]/10 border border-[#00ffc8]/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#00ffc8]" />
            <span className="font-semibold text-white">Enterprise Security</span>
          </div>
          <p className="text-xs text-[#6b7b9a]">Your data is protected by industry-leading security standards</p>
        </div>
      </CardContent>
    </Card>
  )
}
