"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/lib/currency-context"
import {
  Loader2,
  Play,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Zap,
  AlertTriangle,
  Activity,
  Globe,
  CreditCard,
  Mail,
  Wifi,
  Clock,
  TrendingUp,
} from "lucide-react"
import type { RiskScoreResponse } from "@/lib/types"

interface LiveDemoProps {
  apiKey: string
  riskTolerance?: number
}

interface ApiResponse extends Partial<RiskScoreResponse> {
  error?: string
}

const presetScenarios = [
  {
    name: "Legitimate Purchase",
    description: "Regular customer buying a product",
    icon: ShieldCheck,
    color: "#00ffc8",
    data: {
      amount_cents: 4999,
      customer_email: "john.smith@gmail.com",
      customer_ip: "203.0.113.42",
      customer_country: "US",
      card_bin: "424242",
      card_last_four: "4242",
      card_brand: "visa",
    },
  },
  {
    name: "Velocity Attack",
    description: "Bot-like rapid transactions",
    icon: Zap,
    color: "#ffc107",
    data: {
      amount_cents: 9999,
      customer_email: "test123456@tempmail.com",
      customer_ip: "192.168.1.100",
      customer_country: "US",
      card_bin: "400000",
      card_last_four: "0000",
      card_brand: "visa",
    },
  },
  {
    name: "High-Risk Region",
    description: "Transaction from flagged country",
    icon: Globe,
    color: "#ff4757",
    data: {
      amount_cents: 25000,
      customer_email: "buyer@mail.ng",
      customer_ip: "41.58.152.0",
      customer_country: "NG",
      card_bin: "555555",
      card_last_four: "4444",
      card_brand: "mastercard",
    },
  },
  {
    name: "Disposable Email Fraud",
    description: "Round amount + temp email + risky location",
    icon: Mail,
    color: "#ff4757",
    data: {
      amount_cents: 50000,
      customer_email: "user12345@guerrillamail.com",
      customer_ip: "45.67.89.10",
      customer_country: "RU",
      card_bin: "411111",
      card_last_four: "1111",
      card_brand: "visa",
    },
  },
]

export function LiveDemo({ apiKey }: LiveDemoProps) {
  const { formatAmount, symbol, currency } = useCurrency()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [animatingFactors, setAnimatingFactors] = useState<Set<number>>(new Set())
  const [showResult, setShowResult] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    amount: "49.99",
    email: "customer@example.com",
    ip: "203.0.113.42",
    country: "US",
    cardBin: "424242",
    cardLast4: "4242",
    cardBrand: "visa",
  })

  const runTransaction = async (data?: (typeof presetScenarios)[0]["data"]) => {
    setIsLoading(true)
    setResult(null)
    setShowResult(false)
    setAnimatingFactors(new Set())

    const payload = data || {
      amount_cents: Math.round(Number.parseFloat(formData.amount) * 100),
      customer_email: formData.email,
      customer_ip: formData.ip,
      customer_country: formData.country,
      card_bin: formData.cardBin,
      card_last_four: formData.cardLast4,
      card_brand: formData.cardBrand,
    }

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "pg_demo_key",
        },
        body: JSON.stringify(payload),
      })

      const responseData: ApiResponse = await response.json()
      setResult(responseData)

      // Animate risk factors appearing one by one
      if (responseData.risk_factors && responseData.risk_factors.length > 0) {
        responseData.risk_factors.forEach((_, index) => {
          setTimeout(() => {
            setAnimatingFactors((prev) => new Set([...prev, index]))
          }, index * 200)
        })
      }

      // Show result with animation
      setTimeout(() => setShowResult(true), 100)
    } catch (err) {
      setResult({ error: "Network error. Please try again." })
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const hasValidResult = result && result.decision && !result.error

  // Live scanning animation
  const [scanLine, setScanLine] = useState(0)
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setScanLine((prev) => (prev + 1) % 100)
      }, 20)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column - Input */}
      <div className="space-y-6">
        {/* Quick Scenarios */}
        <Card className="border-[#1a2744] bg-[#0d1221] overflow-hidden">
          <CardHeader className="border-b border-[#1a2744]">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#00ffc8]" />
              Quick Test Scenarios
            </CardTitle>
            <CardDescription className="text-[#6b7b9a]">Click to simulate different fraud patterns</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {presetScenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <Button
                    key={scenario.name}
                    variant="outline"
                    className="h-auto justify-start p-4 bg-[#0a0e1a] border-[#1a2744] hover:border-[#00ffc8]/50 hover:bg-[#00ffc8]/5 transition-all group"
                    onClick={() => runTransaction(scenario.data)}
                    disabled={isLoading}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${scenario.color}15`, border: `1px solid ${scenario.color}30` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: scenario.color }} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{scenario.name}</p>
                        <p className="text-xs text-[#6b7b9a] mt-0.5 line-clamp-1">{scenario.description}</p>
                        <p className="text-xs text-[#00ffc8] mt-1 font-mono">
                          {formatAmount(scenario.data.amount_cents)}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Transaction Builder */}
        <Card className="border-[#1a2744] bg-[#0d1221]">
          <CardHeader className="border-b border-[#1a2744]">
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#00a8ff]" />
              Custom Transaction
            </CardTitle>
            <CardDescription className="text-[#6b7b9a]">Build your own test case</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2 bg-[#0a0e1a] border border-[#1a2744]">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] font-medium"
                >
                  Basic
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] font-medium"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label className="text-[#8b9dc3]">Amount ({symbol})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#8b9dc3]">Customer Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#8b9dc3]">Country</Label>
                  <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                    <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="NG">Nigeria (High Risk)</SelectItem>
                      <SelectItem value="RU">Russia (High Risk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[#8b9dc3]">Customer IP</Label>
                    <Input
                      value={formData.ip}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                      className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[#8b9dc3]">Card BIN (6 digits)</Label>
                    <Input
                      value={formData.cardBin}
                      onChange={(e) => setFormData({ ...formData, cardBin: e.target.value })}
                      maxLength={6}
                      className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[#8b9dc3]">Card Last 4</Label>
                    <Input
                      value={formData.cardLast4}
                      onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
                      maxLength={4}
                      className="bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20 font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[#8b9dc3]">Card Brand</Label>
                    <Select
                      value={formData.cardBrand}
                      onValueChange={(v) => setFormData({ ...formData, cardBrand: v })}
                    >
                      <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button
              className="w-full mt-6 h-12 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] hover:opacity-90 text-[#0a0e1a] font-bold text-base shadow-[0_0_20px_rgba(0,255,200,0.3)] transition-all"
              onClick={() => runTransaction()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Transaction...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Run Fraud Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Results */}
      <div ref={resultRef}>
        <Card className="sticky top-6 border-[#1a2744] bg-[#0d1221] overflow-hidden">
          {/* Scanning animation overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ffc8] to-transparent opacity-50"
                style={{ top: `${scanLine}%` }}
              />
              <div className="absolute inset-0 bg-[#00ffc8]/5" />
            </div>
          )}

          <CardHeader className="border-b border-[#1a2744]">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#a855f7]" />
              Risk Analysis Result
            </CardTitle>
            <CardDescription className="text-[#6b7b9a]">Real-time neural network response</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-2 border-[#1a2744] flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full border-2 border-[#00ffc8]/30 flex items-center justify-center animate-pulse">
                      <Activity className="h-10 w-10 text-[#00ffc8] animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-[#00ffc8] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
                <div className="mt-6 text-center">
                  <p className="font-mono text-[#00ffc8] text-sm">SCANNING TRANSACTION</p>
                  <p className="text-xs text-[#6b7b9a] mt-2 font-mono">Analyzing 200+ risk signals...</p>
                </div>
              </div>
            ) : result?.error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-[#ff4757]/10 border border-[#ff4757]/30 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-[#ff4757]" />
                </div>
                <p className="mt-4 font-semibold text-[#ff4757]">Analysis Error</p>
                <p className="text-sm text-[#6b7b9a] mt-1">{result.error}</p>
              </div>
            ) : hasValidResult ? (
              <div className={cn("space-y-6 transition-all duration-500", showResult ? "opacity-100" : "opacity-0")}>
                {/* Main Score Display */}
                <div className="flex items-center justify-center">
                  <div
                    className={cn(
                      "relative flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 transition-all",
                      result.decision === "approve"
                        ? "border-[#00ffc8]/50 bg-[#00ffc8]/5 shadow-[0_0_40px_rgba(0,255,200,0.2)]"
                        : result.decision === "review"
                          ? "border-[#ffc107]/50 bg-[#ffc107]/5 shadow-[0_0_40px_rgba(255,193,7,0.2)]"
                          : "border-[#ff4757]/50 bg-[#ff4757]/5 shadow-[0_0_40px_rgba(255,71,87,0.2)]",
                    )}
                  >
                    {result.decision === "approve" ? (
                      <ShieldCheck className="h-14 w-14 text-[#00ffc8]" />
                    ) : result.decision === "review" ? (
                      <ShieldAlert className="h-14 w-14 text-[#ffc107]" />
                    ) : (
                      <ShieldX className="h-14 w-14 text-[#ff4757]" />
                    )}
                    <span
                      className={cn(
                        "mt-1 text-4xl font-bold font-mono",
                        result.decision === "approve"
                          ? "text-[#00ffc8]"
                          : result.decision === "review"
                            ? "text-[#ffc107]"
                            : "text-[#ff4757]",
                      )}
                    >
                      {result.risk_score}
                    </span>
                  </div>
                </div>

                {/* Decision Badge */}
                <div className="text-center space-y-2">
                  <Badge
                    className={cn(
                      "text-lg px-6 py-2 font-mono font-bold uppercase tracking-wider",
                      result.decision === "approve"
                        ? "bg-[#00ffc8] text-[#0a0e1a] shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                        : result.decision === "review"
                          ? "bg-[#ffc107] text-[#0a0e1a] shadow-[0_0_20px_rgba(255,193,7,0.3)]"
                          : "bg-[#ff4757] text-white shadow-[0_0_20px_rgba(255,71,87,0.3)]",
                    )}
                  >
                    {result.decision}
                  </Badge>
                  <div className="flex items-center justify-center gap-4 text-xs text-[#6b7b9a] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.processing_time_ms || 0}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {result.risk_factors?.length || 0} signals
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-[#00a8ff]" />
                      Detected Risk Signals
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {result.risk_factors.map((factor, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-3 transition-all duration-300",
                            animatingFactors.has(i) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                            factor.severity === "low"
                              ? "border-[#00ffc8]/20 bg-[#00ffc8]/5"
                              : factor.severity === "medium"
                                ? "border-[#ffc107]/20 bg-[#ffc107]/5"
                                : "border-[#ff4757]/20 bg-[#ff4757]/5",
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm">{factor.factor}</p>
                            <p className="text-xs text-[#6b7b9a] line-clamp-1">{factor.description}</p>
                          </div>
                          <Badge
                            className={cn(
                              "ml-3 font-mono text-xs",
                              factor.severity === "low"
                                ? "bg-[#00ffc8]/20 text-[#00ffc8]"
                                : factor.severity === "medium"
                                  ? "bg-[#ffc107]/20 text-[#ffc107]"
                                  : "bg-[#ff4757]/20 text-[#ff4757]",
                            )}
                          >
                            +{factor.score}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 rounded-full bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                  <Play className="h-10 w-10 text-[#6b7b9a]" />
                </div>
                <p className="mt-4 font-medium text-white">Ready to Analyze</p>
                <p className="text-sm text-[#6b7b9a] mt-1">Select a scenario or build a custom transaction</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
