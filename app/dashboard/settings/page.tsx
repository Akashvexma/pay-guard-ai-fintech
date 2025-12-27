"use client"

import { SettingsForm } from "@/components/dashboard/settings-form"
import { getDemoSessionClient } from "@/lib/demo-auth"
import { useEffect, useState } from "react"
import type { Merchant } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Loader2,
  Key,
  Copy,
  RefreshCw,
  Bell,
  Mail,
  Smartphone,
  Shield,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    highRiskOnly: true,
    weeklyReport: true,
  })

  useEffect(() => {
    const session = getDemoSessionClient()
    if (session) {
      setMerchant({
        id: session.id,
        business_name: session.businessName,
        business_type: session.businessType,
        risk_tolerance: 50,
        api_key: `pg_live_${session.id.substring(0, 16)}`,
        webhook_url: null,
        is_active: true,
        created_at: session.createdAt,
        updated_at: session.createdAt,
      })
    }
  }, [])

  const handleCopyApiKey = () => {
    if (merchant) {
      navigator.clipboard.writeText(merchant.api_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!merchant) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ffc8]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-[#6b7b9a]/10 text-[#6b7b9a] border-[#6b7b9a]/30">
            <Settings className="h-3 w-3 mr-1" />
            Configuration
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-[#6b7b9a] mt-1">Manage your account, API keys, and notification preferences</p>
      </div>

      {/* API Key Management */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader className="border-b border-[#1a2744]">
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-[#00ffc8]" />
            API Keys
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">
            Manage your API keys for integration. Keep these secure and never share publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Live API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={merchant.api_key}
                  readOnly
                  className="bg-[#0a0e1a] border-[#1a2744] text-white font-mono pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-[#6b7b9a] hover:text-white"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                className={`border-[#1a2744] ${copied ? "bg-[#00ffc8]/10 border-[#00ffc8]/50 text-[#00ffc8]" : "text-white hover:bg-[#1a2744]"}`}
                onClick={handleCopyApiKey}
              >
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" className="border-[#1a2744] text-white hover:bg-[#1a2744] bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
            </div>
            <p className="text-xs text-[#6b7b9a]">
              Use this key in the <code className="text-[#00ffc8]">x-api-key</code> header for API requests
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#ffc107]/30">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#ffc107] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Security Notice</p>
                <p className="text-xs text-[#6b7b9a] mt-1">
                  Never expose your API key in client-side code. Always make API calls from your server.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardHeader className="border-b border-[#1a2744]">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#a855f7]" />
            Notifications
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">
            Configure how you want to be notified about fraud alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#00a8ff]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Email Alerts</p>
                <p className="text-xs text-[#6b7b9a]">Receive alerts via email</p>
              </div>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-[#00ffc8]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">SMS Alerts</p>
                <p className="text-xs text-[#6b7b9a]">Get text messages for urgent alerts</p>
              </div>
            </div>
            <Switch
              checked={notifications.smsAlerts}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, smsAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-[#ff4757]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">High Risk Only</p>
                <p className="text-xs text-[#6b7b9a]">Only notify for high-risk transactions (70+)</p>
              </div>
            </div>
            <Switch
              checked={notifications.highRiskOnly}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, highRiskOnly: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#ffc107]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Weekly Report</p>
                <p className="text-xs text-[#6b7b9a]">Receive weekly fraud summary via email</p>
              </div>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReport: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <SettingsForm merchant={merchant} />

      {/* Danger Zone */}
      <Card className="bg-[#0d1221] border-[#ff4757]/30">
        <CardHeader className="border-b border-[#ff4757]/20">
          <CardTitle className="text-[#ff4757] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div>
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="text-xs text-[#6b7b9a]">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="outline"
              className="border-[#ff4757]/50 text-[#ff4757] hover:bg-[#ff4757]/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
