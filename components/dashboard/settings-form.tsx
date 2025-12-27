"use client"

import type { Merchant } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SettingsForm({ merchant }: { merchant: Merchant }) {
  const [businessName, setBusinessName] = useState(merchant.business_name)
  const [businessType, setBusinessType] = useState(merchant.business_type)
  const [riskTolerance, setRiskTolerance] = useState(merchant.risk_tolerance)
  const [webhookUrl, setWebhookUrl] = useState(merchant.webhook_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
    toast({ title: "Saved", description: "Your settings have been updated (demo mode)" })
  }

  const getRiskLabel = (value: number) => {
    if (value <= 25) return "Very Conservative - Minimal false positives, may block some legitimate transactions"
    if (value <= 50) return "Conservative - Balanced approach, recommended for most merchants"
    if (value <= 75) return "Moderate - Allows more transactions through, slightly higher risk"
    return "Permissive - Maximum approval rate, suitable for low-risk industries"
  }

  return (
    <div className="grid gap-6">
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white">Business Information</CardTitle>
          <CardDescription className="text-[#6b7b9a]">Update your business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="businessName" className="text-[#8b9dc3]">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="bg-[#0a0e1a] border-[#1a2744] text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessType" className="text-[#8b9dc3]">
              Business Type
            </Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white">Risk Tolerance</CardTitle>
          <CardDescription className="text-[#6b7b9a]">Adjust how strictly transactions are screened</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[#8b9dc3]">Risk Tolerance Level</Label>
              <span className="text-sm font-medium text-[#00ffc8]">{riskTolerance}%</span>
            </div>
            <Slider
              value={[riskTolerance]}
              onValueChange={(v) => setRiskTolerance(v[0])}
              min={10}
              max={90}
              step={5}
              className="[&_[role=slider]]:bg-[#00ffc8]"
            />
            <p className="text-sm text-[#6b7b9a]">{getRiskLabel(riskTolerance)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader>
          <CardTitle className="text-white">Webhook Configuration</CardTitle>
          <CardDescription className="text-[#6b7b9a]">Receive real-time notifications for transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="webhook" className="text-[#8b9dc3]">
              Webhook URL (optional)
            </Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://your-site.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="bg-[#0a0e1a] border-[#1a2744] text-white placeholder:text-[#4a5568]"
            />
            <p className="text-xs text-[#6b7b9a]">We&apos;ll POST transaction decisions to this URL in real-time</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
