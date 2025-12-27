"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Mail,
  RefreshCw,
  ChevronDown,
  CreditCard,
  Activity,
} from "lucide-react"
import { useCurrency } from "@/lib/currency-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AuditLogEntry {
  id: string
  transaction_id: string
  timestamp: string
  amount: number
  currency: string
  customer_email?: string
  customer_ip?: string
  customer_country?: string
  card_bin?: string
  card_last_four?: string
  fraud_probability: number
  risk_score: number
  decision: "approve" | "review" | "decline"
  risk_level: "low" | "medium" | "high" | "critical"
  reviewed: boolean
  reviewed_by?: string
  reviewed_at?: string
  review_decision?: "approved" | "rejected" | "escalated"
  feature_contributions: Array<{
    feature: string
    value: number
    contribution: number
    impact: string
  }>
  model_version: string
  processing_time_ms: number
}

// Generate mock data for demo (will be replaced by real API data when available)
function generateMockAuditLogs(): AuditLogEntry[] {
  const countries = ["US", "GB", "DE", "FR", "NG", "RU", "IN", "BR", "JP", "AU", "CA", "MX"]
  const emails = [
    "john.doe@gmail.com",
    "jane.smith@yahoo.com",
    "test123@tempmail.com",
    "mike.wilson@outlook.com",
    "fraud@disposable.email",
    "sarah.jones@company.com",
    "alex.kumar@gmail.com",
    "temp4829@guerrillamail.com",
    "business@enterprise.co",
    "customer@shop.com",
  ]

  return Array.from({ length: 50 }, (_, i) => {
    const fraudProb = Math.random()
    const decision: "approve" | "review" | "decline" =
      fraudProb < 0.3 ? "approve" : fraudProb < 0.7 ? "review" : "decline"
    const riskLevel: "low" | "medium" | "high" | "critical" =
      fraudProb < 0.25 ? "low" : fraudProb < 0.5 ? "medium" : fraudProb < 0.75 ? "high" : "critical"

    return {
      id: crypto.randomUUID(),
      transaction_id: `txn_${Math.random().toString(36).substr(2, 12)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      amount: Math.floor(Math.random() * 50000) + 100,
      currency: "USD",
      customer_email: emails[Math.floor(Math.random() * emails.length)],
      customer_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      customer_country: countries[Math.floor(Math.random() * countries.length)],
      card_bin: ["411111", "555555", "378282", "4242"][Math.floor(Math.random() * 4)],
      card_last_four: String(Math.floor(1000 + Math.random() * 9000)),
      fraud_probability: Number(fraudProb.toFixed(4)),
      risk_score: Math.round(fraudProb * 100),
      decision,
      risk_level: riskLevel,
      reviewed: decision !== "approve" ? Math.random() > 0.6 : false,
      reviewed_by: Math.random() > 0.5 ? "admin@payguard.ai" : undefined,
      reviewed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined,
      review_decision:
        Math.random() > 0.6 ? (["approved", "rejected", "escalated"][Math.floor(Math.random() * 3)] as any) : undefined,
      feature_contributions: [
        {
          feature: "V14",
          value: (Math.random() - 0.5) * 4,
          contribution: (Math.random() - 0.5) * 0.5,
          impact: Math.random() > 0.5 ? "increases_risk" : "decreases_risk",
        },
        {
          feature: "V12",
          value: (Math.random() - 0.5) * 3,
          contribution: (Math.random() - 0.5) * 0.4,
          impact: Math.random() > 0.5 ? "increases_risk" : "decreases_risk",
        },
        {
          feature: "V4",
          value: (Math.random() - 0.5) * 2,
          contribution: (Math.random() - 0.5) * 0.3,
          impact: Math.random() > 0.5 ? "increases_risk" : "decreases_risk",
        },
        { feature: "Amount", value: Math.random() * 1000, contribution: Math.random() * 0.1, impact: "increases_risk" },
      ],
      model_version: "1.0.0",
      processing_time_ms: Math.floor(Math.random() * 30) + 5,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function AuditLogContent() {
  const { formatAmount } = useCurrency()
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDecision, setFilterDecision] = useState<string>("all")
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, flagged: 0, pending: 0, declined: 0 })

  // Fetch audit logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/audit-log?limit=100")
      if (response.ok) {
        const data = await response.json()
        if (data.transactions && data.transactions.length > 0) {
          setLogs(data.transactions)
          setFilteredLogs(data.transactions)
          setStats({
            total: data.stats?.total_analyzed || data.transactions.length,
            flagged:
              data.stats?.total_flagged ||
              data.transactions.filter((t: AuditLogEntry) => t.decision !== "approve").length,
            pending:
              data.stats?.pending_review ||
              data.transactions.filter((t: AuditLogEntry) => t.decision === "review" && !t.reviewed).length,
            declined:
              data.stats?.total_declined ||
              data.transactions.filter((t: AuditLogEntry) => t.decision === "decline").length,
          })
        } else {
          // Use mock data if no real transactions
          const mockLogs = generateMockAuditLogs()
          setLogs(mockLogs)
          setFilteredLogs(mockLogs)
          setStats({
            total: mockLogs.length,
            flagged: mockLogs.filter((l) => l.decision !== "approve").length,
            pending: mockLogs.filter((l) => l.decision === "review" && !l.reviewed).length,
            declined: mockLogs.filter((l) => l.decision === "decline").length,
          })
        }
      } else {
        // Fallback to mock data
        const mockLogs = generateMockAuditLogs()
        setLogs(mockLogs)
        setFilteredLogs(mockLogs)
        setStats({
          total: mockLogs.length,
          flagged: mockLogs.filter((l) => l.decision !== "approve").length,
          pending: mockLogs.filter((l) => l.decision === "review" && !l.reviewed).length,
          declined: mockLogs.filter((l) => l.decision === "decline").length,
        })
      }
    } catch {
      // Fallback to mock data
      const mockLogs = generateMockAuditLogs()
      setLogs(mockLogs)
      setFilteredLogs(mockLogs)
      setStats({
        total: mockLogs.length,
        flagged: mockLogs.filter((l) => l.decision !== "approve").length,
        pending: mockLogs.filter((l) => l.decision === "review" && !l.reviewed).length,
        declined: mockLogs.filter((l) => l.decision === "decline").length,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Filter logs
  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.transaction_id.toLowerCase().includes(term) ||
          log.customer_email?.toLowerCase().includes(term) ||
          log.customer_ip?.includes(term),
      )
    }

    if (filterDecision !== "all") {
      filtered = filtered.filter((log) => log.decision === filterDecision)
    }

    if (filterRiskLevel !== "all") {
      filtered = filtered.filter((log) => log.risk_level === filterRiskLevel)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, filterDecision, filterRiskLevel])

  // Handle review action
  const handleReview = async (logId: string, decision: "approved" | "rejected" | "escalated") => {
    try {
      const response = await fetch("/api/audit-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: logId,
          review_decision: decision,
          reviewed_by: "admin@payguard.ai",
        }),
      })

      if (response.ok) {
        setLogs((prev) =>
          prev.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  reviewed: true,
                  reviewed_by: "admin@payguard.ai",
                  reviewed_at: new Date().toISOString(),
                  review_decision: decision,
                }
              : log,
          ),
        )
      }
    } catch {
      // Update locally anyway for demo
      setLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? {
                ...log,
                reviewed: true,
                reviewed_by: "admin@payguard.ai",
                reviewed_at: new Date().toISOString(),
                review_decision: decision,
              }
            : log,
        ),
      )
    }
  }

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "approve":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Approved</Badge>
      case "review":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Review</Badge>
      case "decline":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Declined</Badge>
      default:
        return <Badge>{decision}</Badge>
    }
  }

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Low</Badge>
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#00ffc8]" />
            Admin Audit Log
          </h1>
          <p className="text-[#6b7b9a] mt-1">Review transactions flagged as suspicious by the ML model</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#1a2744] bg-[#0a1628] text-white hover:bg-[#1a2744]"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#0a1628] border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b7b9a]">Total Analyzed</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-[#00ffc8]/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-[#00ffc8]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628] border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b7b9a]">Flagged Suspicious</p>
                <p className="text-2xl font-bold text-amber-400">{stats.flagged}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628] border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b7b9a]">Pending Review</p>
                <p className="text-2xl font-bold text-[#00a8ff]">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-[#00a8ff]/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#00a8ff]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628] border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b7b9a]">Auto-Declined</p>
                <p className="text-2xl font-bold text-red-400">{stats.declined}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#0a1628] border-[#1a2744]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7b9a]" />
              <Input
                placeholder="Search by transaction ID, email, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#080c14] border-[#1a2744] text-white placeholder:text-[#6b7b9a]"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#1a2744] bg-[#080c14] text-white hover:bg-[#1a2744]">
                  <Filter className="h-4 w-4 mr-2" />
                  Decision: {filterDecision === "all" ? "All" : filterDecision}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0a1628] border-[#1a2744]">
                <DropdownMenuItem onClick={() => setFilterDecision("all")} className="text-white hover:bg-[#1a2744]">
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterDecision("approve")}
                  className="text-white hover:bg-[#1a2744]"
                >
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDecision("review")} className="text-white hover:bg-[#1a2744]">
                  Review
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterDecision("decline")}
                  className="text-white hover:bg-[#1a2744]"
                >
                  Declined
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#1a2744] bg-[#080c14] text-white hover:bg-[#1a2744]">
                  Risk: {filterRiskLevel === "all" ? "All" : filterRiskLevel}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0a1628] border-[#1a2744]">
                <DropdownMenuItem onClick={() => setFilterRiskLevel("all")} className="text-white hover:bg-[#1a2744]">
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRiskLevel("low")} className="text-white hover:bg-[#1a2744]">
                  Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRiskLevel("medium")}
                  className="text-white hover:bg-[#1a2744]"
                >
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRiskLevel("high")} className="text-white hover:bg-[#1a2744]">
                  High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRiskLevel("critical")}
                  className="text-white hover:bg-[#1a2744]"
                >
                  Critical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-[#0a1628] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white">Transaction Audit Log</CardTitle>
          <CardDescription className="text-[#6b7b9a]">
            {filteredLogs.length} transactions - Model: Logistic Regression v1.0.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-[#00ffc8] animate-spin" />
            </div>
          ) : (
            <div className="rounded-lg border border-[#1a2744] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#080c14] border-[#1a2744] hover:bg-[#080c14]">
                    <TableHead className="text-[#6b7b9a]">Transaction ID</TableHead>
                    <TableHead className="text-[#6b7b9a]">Time</TableHead>
                    <TableHead className="text-[#6b7b9a]">Amount</TableHead>
                    <TableHead className="text-[#6b7b9a]">Customer</TableHead>
                    <TableHead className="text-[#6b7b9a]">Fraud Prob.</TableHead>
                    <TableHead className="text-[#6b7b9a]">Risk Level</TableHead>
                    <TableHead className="text-[#6b7b9a]">Decision</TableHead>
                    <TableHead className="text-[#6b7b9a]">Status</TableHead>
                    <TableHead className="text-[#6b7b9a]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id} className="border-[#1a2744] hover:bg-[#1a2744]/50">
                      <TableCell className="font-mono text-xs text-[#00ffc8]">
                        {log.transaction_id.slice(0, 16)}...
                      </TableCell>
                      <TableCell className="text-[#6b7b9a] text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white font-medium">{formatAmount(log.amount)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-white">
                            <Mail className="h-3 w-3 text-[#6b7b9a]" />
                            {log.customer_email?.slice(0, 20) || "N/A"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#6b7b9a]">
                            <Globe className="h-3 w-3" />
                            {log.customer_country || "Unknown"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#1a2744] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                log.fraud_probability < 0.25
                                  ? "bg-emerald-500"
                                  : log.fraud_probability < 0.5
                                    ? "bg-amber-500"
                                    : log.fraud_probability < 0.75
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                              }`}
                              style={{ width: `${log.fraud_probability * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">{(log.fraud_probability * 100).toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskLevelBadge(log.risk_level)}</TableCell>
                      <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                      <TableCell>
                        {log.reviewed ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : log.decision !== "approve" ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge className="bg-[#1a2744] text-[#6b7b9a]">Auto</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {log.decision !== "approve" && !log.reviewed && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                onClick={() => handleReview(log.id, "approved")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => handleReview(log.id, "rejected")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-[#0a1628] border-[#1a2744] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#00ffc8]" />
                  Transaction Details
                </DialogTitle>
                <DialogDescription className="text-[#6b7b9a]">{selectedLog.transaction_id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-xs text-[#6b7b9a]">Amount</p>
                    <p className="text-lg font-bold text-white">{formatAmount(selectedLog.amount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-xs text-[#6b7b9a]">Fraud Probability</p>
                    <p className="text-lg font-bold text-white">{(selectedLog.fraud_probability * 100).toFixed(2)}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-xs text-[#6b7b9a]">Risk Level</p>
                    {getRiskLevelBadge(selectedLog.risk_level)}
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-xs text-[#6b7b9a]">Decision</p>
                    {getDecisionBadge(selectedLog.decision)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
                  <h4 className="text-sm font-medium text-white mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#6b7b9a]">Email</p>
                      <p className="text-white">{selectedLog.customer_email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[#6b7b9a]">IP Address</p>
                      <p className="text-white font-mono">{selectedLog.customer_ip || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[#6b7b9a]">Country</p>
                      <p className="text-white">{selectedLog.customer_country || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-[#6b7b9a]">Card</p>
                      <p className="text-white">****{selectedLog.card_last_four || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Feature Contributions */}
                <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
                  <h4 className="text-sm font-medium text-white mb-3">ML Feature Contributions</h4>
                  <div className="space-y-2">
                    {selectedLog.feature_contributions.map((fc, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#00ffc8] w-16">{fc.feature}</span>
                        <div className="flex-1 h-2 bg-[#1a2744] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fc.impact === "increases_risk" ? "bg-red-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(Math.abs(fc.contribution) * 200, 100)}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs w-20 text-right ${
                            fc.impact === "increases_risk" ? "text-red-400" : "text-emerald-400"
                          }`}
                        >
                          {fc.contribution > 0 ? "+" : ""}
                          {fc.contribution.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Info */}
                <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7b9a]">Model Version</span>
                    <span className="text-white">{selectedLog.model_version}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[#6b7b9a]">Processing Time</span>
                    <span className="text-white">{selectedLog.processing_time_ms}ms</span>
                  </div>
                </div>

                {/* Review Actions */}
                {selectedLog.decision !== "approve" && !selectedLog.reviewed && (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
                      onClick={() => {
                        handleReview(selectedLog.id, "approved")
                        setSelectedLog(null)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      className="flex-1 bg-red-500 text-white hover:bg-red-600"
                      onClick={() => {
                        handleReview(selectedLog.id, "rejected")
                        setSelectedLog(null)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-amber-500 text-amber-400 hover:bg-amber-500/10 bg-transparent"
                      onClick={() => {
                        handleReview(selectedLog.id, "escalated")
                        setSelectedLog(null)
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AuditLogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-[#00ffc8] animate-spin" />
        </div>
      }
    >
      <AuditLogContent />
    </Suspense>
  )
}
