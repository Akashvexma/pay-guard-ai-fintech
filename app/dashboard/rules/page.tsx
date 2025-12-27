"use client"

import { useState } from "react"
import { RulesManager } from "@/components/dashboard/rules-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Globe, Clock, AlertTriangle, CheckCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Rule } from "@/lib/types"

export default function RulesPage() {
  const [showStats] = useState(true)

  const demoRules: Rule[] = [
    {
      id: "rule_001",
      merchant_id: "demo",
      name: "Block High-Value Transactions",
      rule_type: "amount",
      condition: { threshold: 100000 },
      action: "review",
      priority: 1,
      is_active: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: "rule_002",
      merchant_id: "demo",
      name: "High-Risk Countries",
      rule_type: "geo",
      condition: { countries: ["NG", "RU", "CN"] },
      action: "decline",
      priority: 2,
      is_active: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: "rule_003",
      merchant_id: "demo",
      name: "Velocity Limit",
      rule_type: "velocity",
      condition: { count: 5, minutes: 10 },
      action: "decline",
      priority: 3,
      is_active: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "rule_004",
      merchant_id: "demo",
      name: "Disposable Email Block",
      rule_type: "email",
      condition: { pattern: "tempmail|guerrilla|mailinator" },
      action: "decline",
      priority: 4,
      is_active: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
  ]

  const ruleStats = {
    total: demoRules.length,
    active: demoRules.filter((r) => r.is_active).length,
    triggered: 156,
    blocked: 89,
  }

  const ruleTemplates = [
    { name: "Block VPN/Proxy", icon: Globe, description: "Block transactions from known VPN/proxy IPs" },
    { name: "Velocity Control", icon: Zap, description: "Limit transactions per time window" },
    { name: "Amount Threshold", icon: AlertTriangle, description: "Flag large transactions for review" },
    { name: "Time-based Rules", icon: Clock, description: "Block transactions outside business hours" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#00ffc8]" />
            Custom Rules Engine
          </h2>
          <p className="text-[#6b7b9a] text-sm mt-1">
            Configure intelligent fraud detection rules tailored to your business
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#0d1322] border-[#1a2235]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00ffc8]/10">
                  <Shield className="h-5 w-5 text-[#00ffc8]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ruleStats.total}</p>
                  <p className="text-xs text-[#6b7b9a]">Total Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0d1322] border-[#1a2235]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ruleStats.active}</p>
                  <p className="text-xs text-[#6b7b9a]">Active Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0d1322] border-[#1a2235]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00a8ff]/10">
                  <Zap className="h-5 w-5 text-[#00a8ff]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ruleStats.triggered}</p>
                  <p className="text-xs text-[#6b7b9a]">Times Triggered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0d1322] border-[#1a2235]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{ruleStats.blocked}</p>
                  <p className="text-xs text-[#6b7b9a]">Blocked Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rule Templates */}
      <Card className="bg-[#0d1322] border-[#1a2235]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ruleTemplates.map((template) => (
              <button
                key={template.name}
                className="p-3 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-[#00ffc8]/50 hover:bg-[#00ffc8]/5 transition-all text-left group"
              >
                <template.icon className="h-5 w-5 text-[#6b7b9a] group-hover:text-[#00ffc8] transition-colors mb-2" />
                <p className="text-sm font-medium text-white">{template.name}</p>
                <p className="text-xs text-[#6b7b9a] mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules Manager */}
      <RulesManager rules={demoRules} merchantId="demo" />
    </div>
  )
}
