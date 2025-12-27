"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Webhook, Send, CheckCircle, XCircle, Clock, Copy, Code } from "lucide-react"

interface WebhookEvent {
  id: string
  type: string
  timestamp: string
  status: "success" | "failed" | "pending"
  responseTime: number
  payload: object
}

const eventTypes = [
  { value: "transaction.approved", label: "Transaction Approved" },
  { value: "transaction.declined", label: "Transaction Declined" },
  { value: "transaction.review", label: "Transaction Flagged for Review" },
  { value: "alert.high_risk", label: "High Risk Alert" },
  { value: "velocity.exceeded", label: "Velocity Limit Exceeded" },
]

export function WebhookSimulator() {
  const [webhookUrl, setWebhookUrl] = useState("https://your-server.com/webhook")
  const [selectedEvent, setSelectedEvent] = useState("transaction.approved")
  const [isSending, setIsSending] = useState(false)
  const [events, setEvents] = useState<WebhookEvent[]>([
    {
      id: "evt_001",
      type: "transaction.approved",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      status: "success",
      responseTime: 145,
      payload: { transaction_id: "txn_abc123", risk_score: 12, decision: "approve" },
    },
    {
      id: "evt_002",
      type: "transaction.declined",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "success",
      responseTime: 89,
      payload: { transaction_id: "txn_def456", risk_score: 85, decision: "decline" },
    },
  ])

  const handleSendWebhook = async () => {
    setIsSending(true)

    // Simulate webhook send
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    const newEvent: WebhookEvent = {
      id: `evt_${Date.now()}`,
      type: selectedEvent,
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.1 ? "success" : "failed",
      responseTime: Math.floor(50 + Math.random() * 200),
      payload: {
        transaction_id: `txn_${Math.random().toString(36).substring(7)}`,
        risk_score: Math.floor(Math.random() * 100),
        decision: selectedEvent.includes("approved")
          ? "approve"
          : selectedEvent.includes("declined")
            ? "decline"
            : "review",
        timestamp: new Date().toISOString(),
      },
    }

    setEvents((prev) => [newEvent, ...prev].slice(0, 10))
    setIsSending(false)
  }

  const samplePayload = {
    event: selectedEvent,
    data: {
      transaction_id: "txn_example123",
      risk_score: 15,
      decision: "approve",
      merchant_id: "merchant_abc",
      timestamp: new Date().toISOString(),
    },
    signature: "sha256=abc123...",
  }

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <Webhook className="h-5 w-5 text-[#a855f7]" />
          Webhook Simulator
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">Test webhook integrations with simulated events</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white">Webhook URL</Label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
              className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Event Type</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                {eventTypes.map((event) => (
                  <SelectItem key={event.value} value={event.value} className="text-white hover:bg-[#1a2744]">
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sample Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center gap-2">
              <Code className="h-4 w-4 text-[#00ffc8]" />
              Sample Payload
            </Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[#6b7b9a] hover:text-[#00ffc8]"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2))}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <pre className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744] text-xs text-[#8b9dc3] overflow-x-auto font-mono">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendWebhook}
          disabled={isSending}
          className="w-full bg-[#a855f7] hover:bg-[#a855f7]/80 text-white"
        >
          {isSending ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Test Webhook
            </>
          )}
        </Button>

        {/* Event History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Recent Events</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]"
              >
                <div className="flex items-center gap-3">
                  {event.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
                  ) : event.status === "failed" ? (
                    <XCircle className="h-4 w-4 text-[#ff4757]" />
                  ) : (
                    <Clock className="h-4 w-4 text-[#ffc107]" />
                  )}
                  <div>
                    <p className="text-sm text-white font-mono">{event.type}</p>
                    <p className="text-xs text-[#6b7b9a]">{new Date(event.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      event.status === "success"
                        ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                        : event.status === "failed"
                          ? "bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30"
                          : "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                    }
                  >
                    {event.status === "success" ? "200 OK" : event.status === "failed" ? "500 Error" : "Pending"}
                  </Badge>
                  <p className="text-xs text-[#6b7b9a] mt-1">{event.responseTime}ms</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
