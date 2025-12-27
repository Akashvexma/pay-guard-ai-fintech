"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Eye, EyeOff, Code, Terminal, Zap, Shield, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function IntegrationGuide({ apiKey }: { apiKey: string }) {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast({ title: "Copied to clipboard", description: "Code snippet copied successfully" })
    setTimeout(() => setCopied(null), 2000)
  }

  const curlExample = `curl -X POST https://api.payguard.ai/v1/score \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "amount_cents": 4999,
    "currency": "usd",
    "customer_email": "customer@example.com",
    "customer_ip": "203.0.113.42",
    "customer_country": "US",
    "card_bin": "424242",
    "card_last_four": "4242",
    "card_brand": "visa"
  }'`

  const jsExample = `// PayGuard AI - Fraud Detection Integration
const checkFraud = async (transaction) => {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${apiKey}'
    },
    body: JSON.stringify({
      amount_cents: transaction.amount * 100,
      customer_email: transaction.email,
      customer_ip: transaction.ip,
      customer_country: transaction.country,
      card_bin: transaction.cardNumber.slice(0, 6),
      card_last_four: transaction.cardNumber.slice(-4),
      card_brand: transaction.cardBrand
    })
  });

  const result = await response.json();
  
  if (result.decision === 'decline') {
    throw new Error('Transaction blocked by fraud detection');
  }
  
  if (result.decision === 'review') {
    // Trigger manual review or 3DS verification
    await triggerVerification(transaction);
  }
  
  return result; // Proceed with payment
};`

  const pythonExample = `import requests

class PayGuardClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.payguard.ai/v1"
    
    def check_fraud(self, transaction: dict) -> dict:
        response = requests.post(
            f"{self.base_url}/score",
            headers={
                "Content-Type": "application/json",
                "x-api-key": self.api_key
            },
            json={
                "amount_cents": int(transaction["amount"] * 100),
                "customer_email": transaction["email"],
                "customer_ip": transaction["ip"],
                "customer_country": transaction["country"],
                "card_bin": transaction["card_number"][:6],
                "card_last_four": transaction["card_number"][-4:],
                "card_brand": transaction["card_brand"]
            }
        )
        return response.json()

# Usage
client = PayGuardClient("${apiKey}")
result = client.check_fraud(transaction_data)`

  const responseExample = {
    transaction_id: "txn_8f7a2b3c4d5e6f7g",
    risk_score: 25,
    decision: "approve",
    risk_factors: [
      {
        factor: "ip_velocity",
        score: 10,
        description: "2 transactions from this IP in last 5 minutes",
        severity: "low",
      },
      {
        factor: "high_amount",
        score: 15,
        description: "Transaction amount exceeds $50",
        severity: "low",
      },
    ],
    processing_time_ms: 47,
  }

  return (
    <div className="grid gap-6">
      {/* API Key Card */}
      <Card className="bg-[#0d1221] border-[#1a2744] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffc8]/50 to-transparent" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#00ffc8]" />
            Your API Key
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">
            Use this key to authenticate requests. Keep it secret.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-[#0a0e1a] border border-[#1a2744] px-4 py-3 font-mono text-sm text-[#00ffc8]">
              {showKey ? apiKey : "pg_live_" + "•".repeat(32)}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowKey(!showKey)}
              className="bg-[#0a0e1a] border-[#1a2744] hover:border-[#00ffc8]/50 hover:bg-[#00ffc8]/10"
            >
              {showKey ? <EyeOff className="h-4 w-4 text-[#6b7b9a]" /> : <Eye className="h-4 w-4 text-[#6b7b9a]" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(apiKey, "apikey")}
              className="bg-[#0a0e1a] border-[#1a2744] hover:border-[#00ffc8]/50 hover:bg-[#00ffc8]/10"
            >
              {copied === "apikey" ? (
                <Check className="h-4 w-4 text-[#00ffc8]" />
              ) : (
                <Copy className="h-4 w-4 text-[#6b7b9a]" />
              )}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[#00ffc8]/30 text-[#00ffc8] bg-[#00ffc8]/5">
              <Zap className="h-3 w-3 mr-1" />
              Rate Limit: 100/min
            </Badge>
            <Badge variant="outline" className="border-[#00a8ff]/30 text-[#00a8ff] bg-[#00a8ff]/5">
              <Clock className="h-3 w-3 mr-1" />
              Avg Latency: 47ms
            </Badge>
            <Badge variant="outline" className="border-[#a855f7]/30 text-[#a855f7] bg-[#a855f7]/5">
              <Shield className="h-3 w-3 mr-1" />
              TLS 1.3 Encrypted
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-[#00a8ff]" />
            Quick Start Integration
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">Copy-paste examples in your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList className="grid w-full grid-cols-3 bg-[#0a0e1a] border border-[#1a2744]">
              <TabsTrigger
                value="javascript"
                className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] font-mono text-sm"
              >
                JavaScript
              </TabsTrigger>
              <TabsTrigger
                value="python"
                className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] font-mono text-sm"
              >
                Python
              </TabsTrigger>
              <TabsTrigger
                value="curl"
                className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] font-mono text-sm"
              >
                cURL
              </TabsTrigger>
            </TabsList>
            <TabsContent value="javascript" className="mt-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4 text-sm font-mono text-[#8b9dc3]">
                  <code>{jsExample}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/50"
                  onClick={() => copyToClipboard(jsExample, "js")}
                >
                  {copied === "js" ? <Check className="h-4 w-4 text-[#00ffc8]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="python" className="mt-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4 text-sm font-mono text-[#8b9dc3]">
                  <code>{pythonExample}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/50"
                  onClick={() => copyToClipboard(pythonExample, "python")}
                >
                  {copied === "python" ? <Check className="h-4 w-4 text-[#00ffc8]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="curl" className="mt-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4 text-sm font-mono text-[#8b9dc3]">
                  <code>{curlExample}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/50"
                  onClick={() => copyToClipboard(curlExample, "curl")}
                >
                  {copied === "curl" ? <Check className="h-4 w-4 text-[#00ffc8]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Format */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-[#a855f7]" />
            API Response Format
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">Understanding the risk scoring response</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4 text-sm font-mono text-[#8b9dc3]">
            <code>{JSON.stringify(responseExample, null, 2)}</code>
          </pre>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-[#00ffc8]" />
                <span className="font-mono text-sm text-white">approve</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Score 0-30: Safe to process</p>
            </div>
            <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-[#ffc107]" />
                <span className="font-mono text-sm text-white">review</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Score 31-70: Needs verification</p>
            </div>
            <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-[#ff4757]" />
                <span className="font-mono text-sm text-white">decline</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Score 71-100: Block transaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Checklist */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#00ffc8]" />
            Integration Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Add API key to environment variables",
              "Call /api/score before processing payment",
              "Handle 'decline' by blocking the transaction",
              "Handle 'review' with 3DS or manual verification",
              "Log transaction_id for debugging",
              "Set up webhook for async alerts (optional)",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded border border-[#1a2744] bg-[#0a0e1a] flex items-center justify-center">
                  <span className="text-xs text-[#6b7b9a]">{i + 1}</span>
                </div>
                <span className="text-[#8b9dc3]">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
