"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  Activity,
  Unlock,
  Clock,
  Server,
  Ban,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
} from "lucide-react"

interface APILog {
  id: string
  timestamp: Date
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  clientIP: string
  apiKey: string
  statusCode: number
  responseTime: number
  success: boolean
}

interface Alert {
  id: string
  type: "rate_limit" | "auth_failure" | "anomaly"
  clientIP: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  resolved: boolean
}

interface BlockedClient {
  ip: string
  reason: string
  blockedAt: Date
  expiresAt: Date
}

export default function APISentinelPage() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [logs, setLogs] = useState<APILog[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [blockedClients, setBlockedClients] = useState<BlockedClient[]>([])
  const [metrics, setMetrics] = useState({
    requestsPerMinute: 0,
    avgResponseTime: 0,
    successRate: 0,
    totalRequests: 0,
    blockedRequests: 0,
  })

  // Rate limit tracking per IP
  const [rateLimits, setRateLimits] = useState<Record<string, number>>({})

  // Simulate API traffic
  useEffect(() => {
    if (!isMonitoring) return

    const endpoints = [
      { path: "/api/balance", method: "GET" as const },
      { path: "/api/transaction", method: "POST" as const },
      { path: "/api/history", method: "GET" as const },
      { path: "/api/analyze-risk", method: "POST" as const },
    ]

    const ips = [
      "192.168.1.100",
      "10.0.0.45",
      "172.16.0.88",
      "203.0.113.50",
      "198.51.100.23",
      "185.220.101.1", // Suspicious IP (Tor exit node pattern)
    ]

    const interval = setInterval(() => {
      // Generate random API log
      const ip = ips[Math.floor(Math.random() * ips.length)]
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      const isMalicious = ip === "185.220.101.1" || Math.random() > 0.95
      const isRateLimited = (rateLimits[ip] || 0) > 100

      const log: APILog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        endpoint: endpoint.path,
        method: endpoint.method,
        clientIP: ip,
        apiKey: `pk_${ip.replace(/\./g, "").substring(0, 8)}`,
        statusCode: isRateLimited ? 429 : isMalicious && Math.random() > 0.5 ? 401 : 200,
        responseTime: Math.floor(Math.random() * 200) + 10,
        success: !isRateLimited && !isMalicious,
      }

      setLogs((prev) => [log, ...prev].slice(0, 200))

      // Update rate limits
      setRateLimits((prev) => ({
        ...prev,
        [ip]: (prev[ip] || 0) + 1,
      }))

      // Check for anomalies
      if (isRateLimited) {
        const existingAlert = alerts.find((a) => a.clientIP === ip && a.type === "rate_limit" && !a.resolved)
        if (!existingAlert) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: "rate_limit",
            clientIP: ip,
            severity: "high",
            message: `Rate limit exceeded: ${rateLimits[ip]} requests/min`,
            timestamp: new Date(),
            resolved: false,
          }
          setAlerts((prev) => [newAlert, ...prev])
        }
      }

      if (log.statusCode === 401) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: "auth_failure",
          clientIP: ip,
          severity: "medium",
          message: "Failed authentication attempt",
          timestamp: new Date(),
          resolved: false,
        }
        setAlerts((prev) => [newAlert, ...prev])
      }

      // Update metrics
      setMetrics((prev) => {
        const totalReqs = prev.totalRequests + 1
        const successReqs = (prev.successRate * prev.totalRequests) / 100 + (log.success ? 1 : 0)
        return {
          requestsPerMinute: Math.floor(Math.random() * 50) + 30,
          avgResponseTime: Math.floor((prev.avgResponseTime * prev.totalRequests + log.responseTime) / totalReqs),
          successRate: (successReqs / totalReqs) * 100,
          totalRequests: totalReqs,
          blockedRequests: prev.blockedRequests + (log.statusCode === 429 ? 1 : 0),
        }
      })
    }, 300)

    // Reset rate limits every minute
    const resetInterval = setInterval(() => {
      setRateLimits({})
    }, 60000)

    return () => {
      clearInterval(interval)
      clearInterval(resetInterval)
    }
  }, [isMonitoring, rateLimits, alerts])

  const blockClient = (ip: string, reason: string) => {
    const blocked: BlockedClient = {
      ip,
      reason,
      blockedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    }
    setBlockedClients((prev) => [...prev, blocked])
  }

  const unblockClient = (ip: string) => {
    setBlockedClients((prev) => prev.filter((b) => b.ip !== ip))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)))
  }

  const unresolvedAlerts = alerts.filter((a) => !a.resolved)
  const criticalAlerts = unresolvedAlerts.filter((a) => a.severity === "critical" || a.severity === "high")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">API Sentinel</h1>
              <p className="text-sm text-[#6b7b9a]">Track 6: API Abuse Detection Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {criticalAlerts.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {criticalAlerts.length} Critical
            </Badge>
          )}
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={
              isMonitoring
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30 hover:bg-[#00ffc8]/30"
            }
          >
            {isMonitoring ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Requests/min</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{metrics.requestsPerMinute}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{metrics.avgResponseTime}ms</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-[#00ffc8] font-mono">{metrics.successRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-2">
              <Server className="h-4 w-4" />
              <span className="text-xs">Total Requests</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{metrics.totalRequests.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-2">
              <Ban className="h-4 w-4" />
              <span className="text-xs">Blocked</span>
            </div>
            <p className="text-2xl font-bold text-red-400 font-mono">{metrics.blockedRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="bg-[#0a1628] border border-[#1a2744]">
          <TabsTrigger value="logs" className="data-[state=active]:bg-[#1a2744]">
            API Logs
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-[#1a2744]">
            Alerts ({unresolvedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="blocked" className="data-[state=active]:bg-[#1a2744]">
            Blocked ({blockedClients.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00ffc8]" />
                Live API Traffic
                {isMonitoring && (
                  <Badge className="ml-2 bg-[#00ffc8]/20 text-[#00ffc8] border-[#00ffc8]/30">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
                {logs.slice(0, 50).map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-center gap-4 py-2 px-3 rounded ${
                      log.statusCode === 429
                        ? "bg-red-500/10"
                        : log.statusCode === 401
                          ? "bg-yellow-500/10"
                          : "bg-transparent hover:bg-[#1a2744]/50"
                    }`}
                  >
                    <span className="text-[#6b7b9a] w-20">{log.timestamp.toLocaleTimeString()}</span>
                    <Badge
                      className={`w-16 justify-center ${
                        log.method === "GET"
                          ? "bg-[#00ffc8]/20 text-[#00ffc8]"
                          : log.method === "POST"
                            ? "bg-[#00a8ff]/20 text-[#00a8ff]"
                            : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {log.method}
                    </Badge>
                    <span className="text-white flex-1">{log.endpoint}</span>
                    <span className="text-[#6b7b9a] w-28">{log.clientIP}</span>
                    <Badge
                      className={`w-12 justify-center ${
                        log.statusCode === 200
                          ? "bg-[#00ffc8]/20 text-[#00ffc8]"
                          : log.statusCode === 429
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {log.statusCode}
                    </Badge>
                    <span className="text-[#6b7b9a] w-16 text-right">{log.responseTime}ms</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {unresolvedAlerts.length === 0 ? (
                  <div className="text-center py-8 text-[#6b7b9a]">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-[#00ffc8]" />
                    <p>No active alerts</p>
                  </div>
                ) : (
                  unresolvedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.severity === "critical"
                          ? "bg-red-500/10 border-red-500/30"
                          : alert.severity === "high"
                            ? "bg-orange-500/10 border-orange-500/30"
                            : "bg-yellow-500/10 border-yellow-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.severity === "critical" || alert.severity === "high"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }`}
                          />
                          <div>
                            <p className="text-white font-medium">{alert.message}</p>
                            <p className="text-xs text-[#6b7b9a]">
                              IP: {alert.clientIP} | {alert.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => blockClient(alert.clientIP, alert.message)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Block
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                            className="border-[#00ffc8]/30 text-[#00ffc8] hover:bg-[#00ffc8]/20"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-400" />
                Blocked Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockedClients.length === 0 ? (
                  <div className="text-center py-8 text-[#6b7b9a]">
                    <Unlock className="h-12 w-12 mx-auto mb-3" />
                    <p>No blocked clients</p>
                  </div>
                ) : (
                  blockedClients.map((client) => (
                    <div key={client.ip} className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-mono">{client.ip}</p>
                          <p className="text-xs text-[#6b7b9a]">{client.reason}</p>
                          <p className="text-xs text-red-400 mt-1">Expires: {client.expiresAt.toLocaleString()}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unblockClient(client.ip)}
                          className="border-[#00ffc8]/30 text-[#00ffc8] hover:bg-[#00ffc8]/20"
                        >
                          <Unlock className="h-3 w-3 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
