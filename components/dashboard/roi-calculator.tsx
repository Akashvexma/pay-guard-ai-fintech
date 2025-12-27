"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TrendingUp, Shield, Calculator, Sparkles } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

export function ROICalculator() {
  const { formatAmount, formatAmountShort, symbol, currency, exchangeRate } = useCurrency()
  const [monthlyVolume, setMonthlyVolume] = useState(50000)
  const [currentChargebackRate, setCurrentChargebackRate] = useState(2.5)
  const [animatedSavings, setAnimatedSavings] = useState(0)

  // Calculate savings (base in USD cents, then convert)
  const chargebackCost = 25 // Average cost per chargeback in dollars
  const payguardFee = 0.02 // $0.02 per transaction
  const avgTransactionSize = 75
  const monthlyTransactions = monthlyVolume / avgTransactionSize
  const currentChargebacks = (currentChargebackRate / 100) * monthlyTransactions
  const currentLosses = currentChargebacks * (avgTransactionSize + chargebackCost)
  const payguardCost = monthlyTransactions * payguardFee
  const newChargebackRate = currentChargebackRate * 0.25 // 75% reduction
  const newChargebacks = (newChargebackRate / 100) * monthlyTransactions
  const newLosses = newChargebacks * (avgTransactionSize + chargebackCost)
  const grossSavings = currentLosses - newLosses
  const netSavings = grossSavings - payguardCost
  const roi = payguardCost > 0 ? (netSavings / payguardCost) * 100 : 0

  // Convert to selected currency
  const multiplier = currency === "INR" ? exchangeRate : 1
  const displayVolume = monthlyVolume * multiplier
  const displaySavings = netSavings * multiplier
  const displayCurrentLosses = currentLosses * multiplier
  const displayNewLosses = (newLosses + payguardCost) * multiplier
  const displayPayguardCost = payguardCost * multiplier

  useEffect(() => {
    const target = displaySavings
    const duration = 500
    const steps = 30
    const stepValue = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= target) {
        setAnimatedSavings(target)
        clearInterval(timer)
      } else {
        setAnimatedSavings(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [displaySavings])

  const formatNumber = (num: number) => {
    if (currency === "INR") {
      if (num >= 10000000) return `${symbol}${(num / 10000000).toFixed(1)} Cr`
      if (num >= 100000) return `${symbol}${(num / 100000).toFixed(1)} L`
      if (num >= 1000) return `${symbol}${(num / 1000).toFixed(1)} K`
    } else {
      if (num >= 1000000) return `${symbol}${(num / 1000000).toFixed(1)}M`
      if (num >= 1000) return `${symbol}${(num / 1000).toFixed(1)}K`
    }
    return `${symbol}${num.toFixed(0)}`
  }

  return (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#00ffc8]" />
          ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-[#8b9dc3]">Monthly Transaction Volume</Label>
              <span className="text-white font-mono">{formatNumber(displayVolume)}</span>
            </div>
            <Slider
              value={[monthlyVolume]}
              onValueChange={([v]) => setMonthlyVolume(v)}
              min={5000}
              max={500000}
              step={5000}
              className="[&_[role=slider]]:bg-[#00ffc8] [&_[role=slider]]:border-0"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-[#8b9dc3]">Current Chargeback Rate</Label>
              <span className="text-white font-mono">{currentChargebackRate.toFixed(1)}%</span>
            </div>
            <Slider
              value={[currentChargebackRate]}
              onValueChange={([v]) => setCurrentChargebackRate(v)}
              min={0.5}
              max={5}
              step={0.1}
              className="[&_[role=slider]]:bg-[#ffc107] [&_[role=slider]]:border-0"
            />
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-[#00ffc8]/30 bg-gradient-to-br from-[#00ffc8]/5 to-transparent p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#00ffc8]" />
            <span className="text-[#00ffc8] font-medium">With PayGuard AI</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-bold text-[#00ffc8] drop-shadow-[0_0_20px_rgba(0,255,200,0.3)]">
              {symbol}
              {animatedSavings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <div className="text-sm text-[#6b7b9a] mt-1">Estimated Monthly Savings ({currency})</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <Shield className="h-5 w-5 text-[#00ffc8] mx-auto mb-1" />
              <div className="text-lg font-bold text-white">75%</div>
              <div className="text-[10px] text-[#6b7b9a]">Fraud Reduction</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <TrendingUp className="h-5 w-5 text-[#00a8ff] mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{roi.toFixed(0)}%</div>
              <div className="text-[10px] text-[#6b7b9a]">ROI</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <Calculator className="h-5 w-5 text-[#a855f7] mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{formatNumber(displayPayguardCost)}</div>
              <div className="text-[10px] text-[#6b7b9a]">Monthly Cost</div>
            </div>
          </div>
        </div>

        {/* Before/After */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-[#ff4757]/5 border border-[#ff4757]/20">
            <div className="text-[#ff4757] font-medium mb-1">Without PayGuard</div>
            <div className="text-xl font-bold text-white">{formatNumber(displayCurrentLosses)}</div>
            <div className="text-xs text-[#6b7b9a]">{currentChargebacks.toFixed(0)} chargebacks/mo</div>
          </div>
          <div className="p-4 rounded-lg bg-[#00ffc8]/5 border border-[#00ffc8]/20">
            <div className="text-[#00ffc8] font-medium mb-1">With PayGuard</div>
            <div className="text-xl font-bold text-white">{formatNumber(displayNewLosses)}</div>
            <div className="text-xs text-[#6b7b9a]">{newChargebacks.toFixed(0)} chargebacks/mo</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ROICalculator as RoiCalculator }
