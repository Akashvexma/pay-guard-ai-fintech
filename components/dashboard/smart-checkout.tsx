"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCurrency } from "@/lib/currency-context"
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Lock,
  Zap,
  Eye,
  ArrowRight,
  Sparkles,
} from "lucide-react"

type CheckoutStep = "details" | "processing" | "result"
type Decision = "approve" | "review" | "decline"

export function SmartCheckout() {
  const { formatAmount, symbol } = useCurrency()
  const [step, setStep] = useState<CheckoutStep>("details")
  const [decision, setDecision] = useState<Decision | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [riskScore, setRiskScore] = useState(0)

  const [formData, setFormData] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/25",
    cvc: "123",
    name: "John Smith",
    email: "john@example.com",
    amount: "149.99",
  })

  const processingSteps = [
    { label: "Validating card details", icon: CreditCard },
    { label: "Checking device fingerprint", icon: Eye },
    { label: "Analyzing transaction patterns", icon: Zap },
    { label: "Running ML risk models", icon: Sparkles },
    { label: "Final decision", icon: Shield },
  ]

  const handleSubmit = async () => {
    setStep("processing")
    setProcessingStep(0)

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600))
      setProcessingStep(i + 1)
    }

    // Simulate risk calculation
    const mockScore = Math.floor(Math.random() * 30) + 5
    setRiskScore(mockScore)
    setDecision(mockScore < 40 ? "approve" : mockScore < 70 ? "review" : "decline")
    setStep("result")
  }

  const resetDemo = () => {
    setStep("details")
    setDecision(null)
    setProcessingStep(0)
    setRiskScore(0)
  }

  return (
    <Card className="border-[#1a2744] bg-[#0d1221] overflow-hidden">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00ffc8]/20 to-[#00a8ff]/20 border border-[#00ffc8]/30 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-[#00ffc8]" />
          </div>
          <div>
            <CardTitle className="text-white">Smart Checkout Simulation</CardTitle>
            <CardDescription className="text-[#6b7b9a]">See fraud detection in action during checkout</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {step === "details" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#6b7b9a]">Order Total</span>
                <span className="text-2xl font-bold text-white">
                  {symbol}
                  {formData.amount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#00ffc8]">
                <Shield className="h-3 w-3" />
                <span>Protected by PayGuard AI</span>
              </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#8b9dc3]">Card Number</Label>
                <div className="relative">
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="bg-[#0a0e1a] border-[#1a2744] text-white pl-10 font-mono"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7b9a]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#8b9dc3]">Expiry Date</Label>
                  <Input
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="bg-[#0a0e1a] border-[#1a2744] text-white font-mono"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#8b9dc3]">CVC</Label>
                  <div className="relative">
                    <Input
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      className="bg-[#0a0e1a] border-[#1a2744] text-white font-mono"
                      placeholder="123"
                      type="password"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7b9a]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#8b9dc3]">Cardholder Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2744] text-white"
                  placeholder="John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#8b9dc3]">Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2744] text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-bold hover:opacity-90"
            >
              <Lock className="h-4 w-4 mr-2" />
              Pay {symbol}
              {formData.amount}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-[#6b7b9a]">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                256-bit encryption
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Instant verification
              </span>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-6 py-4">
            <div className="text-center mb-8">
              <div className="relative inline-flex">
                <div className="h-20 w-20 rounded-full bg-[#0a0e1a] border-2 border-[#1a2744] flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-[#00ffc8] animate-spin" />
                </div>
              </div>
              <p className="mt-4 text-white font-medium">Processing Payment</p>
              <p className="text-sm text-[#6b7b9a]">Running fraud analysis...</p>
            </div>

            <div className="space-y-3">
              {processingSteps.map((s, i) => {
                const Icon = s.icon
                const isComplete = processingStep > i
                const isCurrent = processingStep === i

                return (
                  <div
                    key={s.label}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isComplete
                        ? "bg-[#00ffc8]/10 border border-[#00ffc8]/30"
                        : isCurrent
                          ? "bg-[#00a8ff]/10 border border-[#00a8ff]/30"
                          : "bg-[#0a0e1a] border border-[#1a2744]"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-[#00ffc8]" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 text-[#00a8ff] animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 text-[#6b7b9a]" />
                    )}
                    <span className={isComplete ? "text-[#00ffc8]" : isCurrent ? "text-white" : "text-[#6b7b9a]"}>
                      {s.label}
                    </span>
                    {isComplete && (
                      <span className="ml-auto text-xs text-[#6b7b9a]">{Math.floor(Math.random() * 20 + 5)}ms</span>
                    )}
                  </div>
                )
              })}
            </div>

            <Progress value={(processingStep / processingSteps.length) * 100} className="h-2 bg-[#1a2744]" />
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div
                className={`inline-flex h-24 w-24 rounded-full items-center justify-center ${
                  decision === "approve"
                    ? "bg-[#00ffc8]/10 border-2 border-[#00ffc8]"
                    : decision === "review"
                      ? "bg-[#ffc107]/10 border-2 border-[#ffc107]"
                      : "bg-[#ff4757]/10 border-2 border-[#ff4757]"
                }`}
              >
                {decision === "approve" ? (
                  <CheckCircle className="h-12 w-12 text-[#00ffc8]" />
                ) : decision === "review" ? (
                  <AlertTriangle className="h-12 w-12 text-[#ffc107]" />
                ) : (
                  <XCircle className="h-12 w-12 text-[#ff4757]" />
                )}
              </div>

              <h3
                className={`mt-4 text-2xl font-bold ${
                  decision === "approve"
                    ? "text-[#00ffc8]"
                    : decision === "review"
                      ? "text-[#ffc107]"
                      : "text-[#ff4757]"
                }`}
              >
                {decision === "approve"
                  ? "Payment Approved"
                  : decision === "review"
                    ? "Manual Review Required"
                    : "Payment Declined"}
              </h3>

              <p className="text-[#6b7b9a] mt-2">
                {decision === "approve"
                  ? "Transaction passed all security checks"
                  : decision === "review"
                    ? "Additional verification needed"
                    : "High risk signals detected"}
              </p>
            </div>

            {/* Risk Analysis */}
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#6b7b9a]">Risk Score</span>
                <Badge
                  className={
                    riskScore < 40
                      ? "bg-[#00ffc8]/10 text-[#00ffc8]"
                      : riskScore < 70
                        ? "bg-[#ffc107]/10 text-[#ffc107]"
                        : "bg-[#ff4757]/10 text-[#ff4757]"
                  }
                >
                  {riskScore}/100
                </Badge>
              </div>
              <Progress
                value={riskScore}
                className={`h-3 bg-[#1a2744] ${
                  riskScore < 40
                    ? "[&>div]:bg-[#00ffc8]"
                    : riskScore < 70
                      ? "[&>div]:bg-[#ffc107]"
                      : "[&>div]:bg-[#ff4757]"
                }`}
              />
            </div>

            {/* Checks Summary */}
            <div className="space-y-2">
              {[
                { name: "Card Validation", passed: true },
                { name: "Device Fingerprint", passed: true },
                { name: "Velocity Check", passed: decision !== "decline" },
                { name: "Geographic Risk", passed: decision === "approve" },
                { name: "Email Verification", passed: true },
              ].map((check) => (
                <div key={check.name} className="flex items-center justify-between p-2 rounded bg-[#0a0e1a]">
                  <span className="text-sm text-white">{check.name}</span>
                  {check.passed ? (
                    <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#ff4757]" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={resetDemo}
              variant="outline"
              className="w-full border-[#1a2744] text-white hover:bg-[#1a2744] bg-transparent"
            >
              Try Another Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
