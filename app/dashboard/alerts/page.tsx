"use client"

import { useState } from "react"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, ShieldAlert, Info, CheckCircle, Filter, BellOff } from "lucide-react"
import type { Alert } from "@/lib/types"

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all")

  const demoAlerts: Alert[] = [
    {
      id: "alert_001",
      merchant_id: "demo",
      transaction_id: "txn_002",
      alert_type: "high_risk",
      severity: "critical",
      title: "High-Risk Transaction Blocked",
      message:
        "Transaction of $899.00 from suspicious@tempmail.com was automatically declined due to high risk score (78)",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "alert_002",
      merchant_id: "demo",
      transaction_id: "txn_005",
      alert_type: "velocity",
      severity: "critical",
      title: "Velocity Attack Detected",
      message: "Multiple rapid transactions detected from IP 185.220.101.1. 5 transactions in 2 minutes.",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "alert_003",
      merchant_id: "demo",
      transaction_id: "txn_004",
      alert_type: "pattern",
      severity: "high",
      title: "Card Testing Pattern Detected",
      message: "Sequential card number pattern detected suggesting card testing attack.",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "alert_004",
      merchant_id: "demo",
      transaction_id: "txn_008",
      alert_type: "geo",
      severity: "medium",
      title: "Geographic Anomaly",
      message: "Customer location changed from US to Nigeria within 1 hour - impossible travel detected.",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "alert_005",
      merchant_id: "demo",
      transaction_id: null,
      alert_type: "system",
      severity: "low",
      title: "Weekly Report Ready",
      message:
        "Your weekly fraud prevention report is now available. 1,247 transactions scanned, $8,924 in fraud prevented.",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "alert_006",
      merchant_id: "demo",
      transaction_id: null,
      alert_type: "system",
      severity: "low",
      title: "New Rule Activated",
      message: "Your custom rule 'Block High-Risk Countries' is now active and monitoring transactions.",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ]

  const filteredAlerts = demoAlerts.filter((alert) => {
    if (filter === "unread") return !alert.is_read
    if (filter === "critical") return alert.severity === "critical"
    return true
  })

  const stats = {
    total: demoAlerts.length,
    unread: demoAlerts.filter((a) => !a.is_read).length,
    critical: demoAlerts.filter((a) => a.severity === "critical").length,
    resolved: demoAlerts.filter((a) => a.is_read).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#00ffc8]" />
            Security Alerts
          </h2>
          <p className="text-[#6b7b9a] text-sm mt-1">Real-time notifications about suspicious activity</p>
        </div>
        <Button
          variant="outline"
          className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
        >
          <BellOff className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00ffc8]/10">
                <Bell className="h-5 w-5 text-[#00ffc8]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-[#6b7b9a]">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Info className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.unread}</p>
                <p className="text-xs text-[#6b7b9a]">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ShieldAlert className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.critical}</p>
                <p className="text-xs text-[#6b7b9a]">Critical</p>
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
                <p className="text-2xl font-bold text-white">{stats.resolved}</p>
                <p className="text-xs text-[#6b7b9a]">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
              : "border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235]"
          }
        >
          <Filter className="h-4 w-4 mr-2" />
          All ({stats.total})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className={
            filter === "unread"
              ? "bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
              : "border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235]"
          }
        >
          Unread ({stats.unread})
        </Button>
        <Button
          variant={filter === "critical" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("critical")}
          className={
            filter === "critical"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235]"
          }
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Critical ({stats.critical})
        </Button>
      </div>

      {/* Alerts List */}
      <AlertsList alerts={filteredAlerts} />
    </div>
  )
}
