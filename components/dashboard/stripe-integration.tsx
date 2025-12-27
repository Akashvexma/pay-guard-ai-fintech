"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useCurrency } from "@/lib/currency-context"
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap,
  Settings,
  ExternalLink,
  RefreshCw,
  Activity,
} from "lucide-react"

export function StripeIntegration() {
  const { formatAmount } = useCurrency()
  const [isConnected] = useState(true)
  const [radarEnabled, setRadarEnabled] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const stats = {
    totalBlocked: 156,
    amountSaved: 4523400,
    lastSync: "2 minutes ago",
    webhooksActive: true,
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#635bff]/20 border border-[#635bff]/30 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-[#635bff]" />
            </div>
            <div>
              <CardTitle className="text-white">Stripe Integration</CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Enhanced fraud protection for Stripe payments
              </CardDescription>
            </div>
          </div>
          <Badge
            className={
              isConnected
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }
          >
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Fraud Blocked</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalBlocked}</p>
            <p className="text-xs text-green-400">This month</p>
          </div>
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#6b7b9a] mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs">Amount Saved</span>
            </div>
            <p className="text-2xl font-bold text-[#00ffc8]">{formatAmount(stats.amountSaved)}</p>
            <p className="text-xs text-[#6b7b9a]">Prevented losses</p>
          </div>
        </div>

        {/* Radar Integration */}
        <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#635bff]/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-[#635bff]" />
              </div>
              <div>
                <p className="font-medium text-white">Stripe Radar Enhancement</p>
                <p className="text-xs text-[#6b7b9a]">Add PayGuard AI signals to Radar rules</p>
              </div>
            </div>
            <Switch checked={radarEnabled} onCheckedChange={setRadarEnabled} />
          </div>
          {radarEnabled && (
            <div className="space-y-2 pt-3 border-t border-[#1a2744]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6b7b9a]">Risk score sync</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6b7b9a]">Custom metadata</span>
                <span className="text-green-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6b7b9a]">Webhook events</span>
                <span className="text-green-400">{stats.webhooksActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Webhook Status */}
        <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-white">Webhook Status</p>
            <span className="text-xs text-[#6b7b9a]">Last sync: {stats.lastSync}</span>
          </div>
          <div className="space-y-2">
            {["payment_intent.created", "payment_intent.succeeded", "charge.dispute.created"].map((event) => (
              <div key={event} className="flex items-center justify-between p-2 rounded bg-[#0d1221]">
                <span className="text-xs font-mono text-[#6b7b9a]">{event}</span>
                <CheckCircle className="h-3 w-3 text-green-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#1a2744] text-white hover:bg-[#1a2744] bg-transparent"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sync Now
          </Button>
          <Button variant="outline" className="flex-1 border-[#1a2744] text-white hover:bg-[#1a2744] bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" className="border-[#1a2744] text-white hover:bg-[#1a2744] bg-transparent" asChild>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
