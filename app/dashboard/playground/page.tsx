"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Play, Code, Copy, CheckCircle, Clock, Zap, AlertTriangle, RefreshCw } from "lucide-react"

export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    amount: "150.00",
    currency: "usd",
    email: "customer@example.com",
    ip: "203.0.113.42",
    country: "US",
    cardBin: "424242",
    cardLast4: "4242",
  })

  const apiKey = "pg_demo_" + Math.random().toString(36).substring(2, 15)

  const handleSubmit = async () => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          transaction_id: "test_" + Date.now(),
          amount_cents: Math.round(Number.parseFloat(formData.amount) * 100),
          currency: formData.currency,
          customer_email: formData.email,
          customer_ip: formData.ip,
          customer_country: formData.country,
          card_bin: formData.cardBin,
          card_last_four: formData.cardLast4,
        }),
      })

      const data = await res.json()
      setResponse(data)
      setResponseTime(Date.now() - startTime)
    } catch (error) {
      setResponse({ error: "Request failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const copyCode = () => {
    const code = `curl -X POST https://payguard.ai/api/score \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiKey}" \\
  -d '{
    "transaction_id": "txn_123",
    "amount_cents": ${Math.round(Number.parseFloat(formData.amount) * 100)},
    "currency": "${formData.currency}",
    "customer_email": "${formData.email}",
    "customer_ip": "${formData.ip}",
    "customer_country": "${formData.country}",
    "card_bin": "${formData.cardBin}",
    "card_last_four": "${formData.cardLast4}"
  }'`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Code className="h-6 w-6 text-[#00ffc8]" />
          API Playground
        </h2>
        <p className="text-[#6b7b9a] text-sm mt-1">Test the PayGuard API in real-time with custom parameters</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardHeader>
            <CardTitle className="text-white text-lg">Request Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Amount ($)</Label>
                <Input
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Currency</Label>
                <Input
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6b7b9a]">Customer Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#0a0e1a] border-[#1a2235] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Customer IP</Label>
                <Input
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Country Code</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Card BIN (first 6)</Label>
                <Input
                  value={formData.cardBin}
                  onChange={(e) => setFormData({ ...formData, cardBin: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#6b7b9a]">Card Last 4</Label>
                <Input
                  value={formData.cardLast4}
                  onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2235] text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] hover:opacity-90"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                Send Request
              </Button>
              <Button
                variant="outline"
                onClick={copyCode}
                className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
              >
                {copied ? <CheckCircle className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy cURL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response */}
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Response</CardTitle>
              {responseTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[#00ffc8]" />
                  <span className="text-[#00ffc8] font-mono">{responseTime}ms</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                {/* Decision Badge */}
                {response.decision && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2235]">
                    {response.decision === "approve" && (
                      <>
                        <div className="p-2 rounded-full bg-green-500/20">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">APPROVED</p>
                          <p className="text-sm text-[#6b7b9a]">Risk Score: {response.risk_score}</p>
                        </div>
                      </>
                    )}
                    {response.decision === "review" && (
                      <>
                        <div className="p-2 rounded-full bg-yellow-500/20">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-yellow-400">REVIEW</p>
                          <p className="text-sm text-[#6b7b9a]">Risk Score: {response.risk_score}</p>
                        </div>
                      </>
                    )}
                    {response.decision === "decline" && (
                      <>
                        <div className="p-2 rounded-full bg-red-500/20">
                          <Zap className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-red-400">DECLINED</p>
                          <p className="text-sm text-[#6b7b9a]">Risk Score: {response.risk_score}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Raw Response */}
                <div className="relative">
                  <Textarea
                    value={JSON.stringify(response, null, 2)}
                    readOnly
                    className="font-mono text-sm bg-[#0a0e1a] border-[#1a2235] text-[#00ffc8] min-h-[300px]"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-[#6b7b9a]">
                <Code className="h-12 w-12 mb-4 opacity-50" />
                <p>Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Test Scenarios */}
      <Card className="bg-[#0d1322] border-[#1a2235]">
        <CardHeader>
          <CardTitle className="text-white">Quick Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() =>
                setFormData({
                  amount: "49.99",
                  currency: "usd",
                  email: "john@gmail.com",
                  ip: "203.0.113.42",
                  country: "US",
                  cardBin: "424242",
                  cardLast4: "4242",
                })
              }
              className="p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-green-500/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="font-medium text-white">Legitimate</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Low-risk US customer with verified email</p>
            </button>

            <button
              onClick={() =>
                setFormData({
                  amount: "899.00",
                  currency: "usd",
                  email: "test@tempmail.com",
                  ip: "192.168.1.100",
                  country: "NG",
                  cardBin: "400000",
                  cardLast4: "0000",
                })
              }
              className="p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-red-500/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-red-400" />
                <span className="font-medium text-white">High Risk</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Disposable email + high-risk country</p>
            </button>

            <button
              onClick={() =>
                setFormData({
                  amount: "320.00",
                  currency: "usd",
                  email: "buyer@company.com",
                  ip: "45.67.89.10",
                  country: "CA",
                  cardBin: "411111",
                  cardLast4: "1111",
                })
              }
              className="p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-yellow-500/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-white">Needs Review</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">New customer with above-average amount</p>
            </button>

            <button
              onClick={() =>
                setFormData({
                  amount: "1500.00",
                  currency: "usd",
                  email: "fraud@fake.net",
                  ip: "185.220.101.1",
                  country: "RU",
                  cardBin: "511111",
                  cardLast4: "9999",
                })
              }
              className="p-4 rounded-lg border border-[#1a2235] bg-[#0a0e1a] hover:border-red-500/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-red-400" />
                <span className="font-medium text-white">Fraud Attack</span>
              </div>
              <p className="text-xs text-[#6b7b9a]">Multiple red flags - velocity + geo + amount</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
