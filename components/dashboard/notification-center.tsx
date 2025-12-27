"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ShieldAlert, ShieldX, AlertTriangle, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useCurrency } from "@/lib/currency-context"

interface Notification {
  id: string
  type: "fraud_blocked" | "high_risk" | "system" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  amount?: number
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "fraud_blocked",
    title: "Fraud Attempt Blocked",
    message: "High-risk transaction from Nigeria blocked",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    amount: 89900,
  },
  {
    id: "2",
    type: "high_risk",
    title: "Transaction Flagged",
    message: "Velocity limit exceeded - manual review required",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    amount: 32000,
  },
  {
    id: "3",
    type: "success",
    title: "Daily Report Ready",
    message: "Your fraud prevention summary is available",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "Risk engine updated with new ML model",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
]

export function NotificationCenter() {
  const { formatAmount } = useCurrency()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "fraud_blocked":
        return <ShieldX className="h-4 w-4 text-[#ff4757]" />
      case "high_risk":
        return <ShieldAlert className="h-4 w-4 text-[#ffc107]" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
      case "system":
        return <AlertTriangle className="h-4 w-4 text-[#00a8ff]" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#ff4757] text-[10px] font-bold animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#0d1221] border-[#1a2744]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-white">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-[#00ffc8] hover:text-[#00ffc8] hover:bg-[#00ffc8]/10"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#1a2744]" />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-3 cursor-pointer focus:bg-[#1a2744] ${!notification.read ? "bg-[#00ffc8]/5" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-[#00ffc8]" />}
                  </div>
                  <p className="text-xs text-[#6b7b9a] line-clamp-1">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#4a5568]">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                    {notification.amount && (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-[#1a2744] text-[#8b9dc3] border-0">
                        {formatAmount(notification.amount)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="bg-[#1a2744]" />
        <DropdownMenuItem className="justify-center text-[#00ffc8] hover:text-[#00ffc8] hover:bg-[#00ffc8]/10">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
