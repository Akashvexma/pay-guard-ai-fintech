"use client"

import type { Alert } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { AlertTriangle, ShieldAlert, TrendingUp, AlertCircle, CheckCircle2, Bell } from "lucide-react"

interface AlertsListProps {
  alerts: Alert[]
}

const alertIcons = {
  high_risk: ShieldAlert,
  velocity: TrendingUp,
  chargeback: AlertTriangle,
  pattern: AlertCircle,
  system: Bell,
}

const severityColors = {
  low: "bg-[#1a2744] text-[#6b7b9a]",
  medium: "bg-[#ffc107]/10 text-[#ffc107]",
  high: "bg-[#ff4757]/10 text-[#ff4757]",
  critical: "bg-[#ff4757] text-white",
}

export function AlertsList({ alerts }: AlertsListProps) {
  const [localAlerts, setLocalAlerts] = useState(alerts)

  const markAsRead = (alertId: string) => {
    setLocalAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a)))
  }

  const markAllAsRead = () => {
    setLocalAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })))
  }

  return (
    <div className="space-y-4">
      {localAlerts.some((a) => !a.is_read) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="bg-transparent border-[#1a2744] text-[#8b9dc3] hover:bg-[#1a2744] hover:text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      )}

      {localAlerts.length === 0 ? (
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-[#6b7b9a] mb-4" />
            <p className="text-lg font-medium text-white">No alerts yet</p>
            <p className="text-sm text-[#6b7b9a]">Alerts will appear here when high-risk transactions are detected</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {localAlerts.map((alert) => {
            const Icon = alertIcons[alert.alert_type] || Bell
            return (
              <Card
                key={alert.id}
                className={cn(
                  "transition-colors bg-[#0d1221] border-[#1a2744]",
                  !alert.is_read && "border-[#00ffc8]/30",
                )}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      severityColors[alert.severity],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("font-medium", !alert.is_read ? "text-white" : "text-[#8b9dc3]")}>
                        {alert.title}
                      </p>
                      {!alert.is_read && (
                        <Badge className="text-xs bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30">New</Badge>
                      )}
                    </div>
                    {alert.message && <p className="text-sm text-[#6b7b9a]">{alert.message}</p>}
                    <p className="text-xs text-[#4a5568]">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!alert.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                      className="text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
                    >
                      Dismiss
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
