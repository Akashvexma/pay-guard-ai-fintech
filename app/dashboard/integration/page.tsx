"use client"

import { IntegrationGuide } from "@/components/dashboard/integration-guide"
import { WebhookSimulator } from "@/components/dashboard/webhook-simulator"
import { StripeIntegration } from "@/components/dashboard/stripe-integration"
import { getDemoSessionClient } from "@/lib/demo-auth"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Zap, Shield, Globe, CreditCard } from "lucide-react"

export default function IntegrationPage() {
  const [apiKey, setApiKey] = useState("pg_live_demo_xxxxxxxxxxxx")

  useEffect(() => {
    const session = getDemoSessionClient()
    if (session) {
      setApiKey(`pg_live_${session.id.substring(0, 16)}`)
    }
  }, [])

  const integrations = [
    { name: "Stripe", status: "connected", icon: CreditCard, color: "#635bff" },
    { name: "Shopify", status: "available", icon: Globe, color: "#96bf48" },
    { name: "WooCommerce", status: "available", icon: Zap, color: "#7f54b3" },
    { name: "Magento", status: "coming", icon: Shield, color: "#f26322" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-[#00a8ff]/10 text-[#00a8ff] border-[#00a8ff]/30">
            <Code className="h-3 w-3 mr-1" />
            Developer Tools
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-white">API Integration</h1>
        <p className="text-[#6b7b9a] mt-1">Connect PayGuard AI to your checkout flow with our simple API</p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((integration) => (
          <Card
            key={integration.name}
            className={`bg-[#0d1221] border-[#1a2744] ${integration.status === "connected" ? "border-green-500/30" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${integration.color}20` }}
                >
                  <integration.icon className="h-5 w-5" style={{ color: integration.color }} />
                </div>
                <div>
                  <p className="font-medium text-white">{integration.name}</p>
                  <p
                    className={`text-xs ${
                      integration.status === "connected"
                        ? "text-green-400"
                        : integration.status === "available"
                          ? "text-[#00a8ff]"
                          : "text-[#6b7b9a]"
                    }`}
                  >
                    {integration.status === "connected"
                      ? "Connected"
                      : integration.status === "available"
                        ? "Available"
                        : "Coming Soon"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stripe Integration */}
      <StripeIntegration />

      {/* API Guide */}
      <IntegrationGuide apiKey={apiKey} />

      {/* Webhook Simulator */}
      <WebhookSimulator />
    </div>
  )
}
