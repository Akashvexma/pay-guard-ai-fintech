"use client"

import { ListsManager } from "@/components/dashboard/lists-manager"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ListEntry } from "@/lib/types"
import { FileText, Shield, Ban, CheckCircle, Globe, CreditCard, Mail } from "lucide-react"

export default function ListsPage() {
  const demoLists: ListEntry[] = [
    {
      id: "list_001",
      merchant_id: "demo",
      list_type: "whitelist",
      entry_type: "email",
      value: "vip@trustedcustomer.com",
      reason: "VIP customer with verified history",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      id: "list_002",
      merchant_id: "demo",
      list_type: "whitelist",
      entry_type: "ip",
      value: "203.0.113.0/24",
      reason: "Corporate office IP range",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    },
    {
      id: "list_006",
      merchant_id: "demo",
      list_type: "whitelist",
      entry_type: "card_bin",
      value: "411111",
      reason: "Trusted bank partner BIN",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    },
    {
      id: "list_003",
      merchant_id: "demo",
      list_type: "blacklist",
      entry_type: "email",
      value: "fraudster@scam.com",
      reason: "Confirmed fraudulent account - 3 chargebacks",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    },
    {
      id: "list_004",
      merchant_id: "demo",
      list_type: "blacklist",
      entry_type: "card_bin",
      value: "400000",
      reason: "High chargeback rate from this BIN (12%)",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
      id: "list_005",
      merchant_id: "demo",
      list_type: "blacklist",
      entry_type: "country",
      value: "XX",
      reason: "Blocked region - no legitimate orders",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: "list_007",
      merchant_id: "demo",
      list_type: "blacklist",
      entry_type: "ip",
      value: "192.0.2.100",
      reason: "Known proxy/VPN exit node",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ]

  const whitelistCount = demoLists.filter((l) => l.list_type === "whitelist").length
  const blacklistCount = demoLists.filter((l) => l.list_type === "blacklist").length

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-[#00a8ff]/10 text-[#00a8ff] border-[#00a8ff]/30">
            <FileText className="h-3 w-3 mr-1" />
            Access Control
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-white">Whitelist & Blacklist</h1>
        <p className="text-[#6b7b9a] mt-1">Manage trusted and blocked entities to fine-tune fraud detection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[#00ffc8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{whitelistCount}</p>
              <p className="text-xs text-[#6b7b9a]">Whitelisted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#ff4757]/10 border border-[#ff4757]/30 flex items-center justify-center">
              <Ban className="h-5 w-5 text-[#ff4757]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{blacklistCount}</p>
              <p className="text-xs text-[#6b7b9a]">Blacklisted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#00a8ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">847</p>
              <p className="text-xs text-[#6b7b9a]">Blocked This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1.2K</p>
              <p className="text-xs text-[#6b7b9a]">Auto-Approved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-4 rounded-lg bg-[#00ffc8]/5 border border-[#00ffc8]/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
                <h4 className="text-sm font-medium text-white">Whitelist</h4>
              </div>
              <p className="text-xs text-[#6b7b9a]">
                Trusted entities bypass risk scoring and are automatically approved. Use for VIP customers, corporate
                IPs, and verified partners.
              </p>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-[#ff4757]/5 border border-[#ff4757]/20">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="h-4 w-4 text-[#ff4757]" />
                <h4 className="text-sm font-medium text-white">Blacklist</h4>
              </div>
              <p className="text-xs text-[#6b7b9a]">
                Blocked entities are automatically declined. Use for known fraudsters, high-risk BINs, and blocked
                regions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Entry Types */}
      <Card className="bg-[#0d1221] border-[#1a2744]">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-white mb-3">Supported Entry Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <Mail className="h-4 w-4 text-[#00a8ff]" />
              <span className="text-xs text-[#8b9dc3]">Email Address</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <Globe className="h-4 w-4 text-[#00ffc8]" />
              <span className="text-xs text-[#8b9dc3]">IP Address / CIDR</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <CreditCard className="h-4 w-4 text-[#a855f7]" />
              <span className="text-xs text-[#8b9dc3]">Card BIN (6 digits)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <Globe className="h-4 w-4 text-[#ffc107]" />
              <span className="text-xs text-[#8b9dc3]">Country Code</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ListsManager lists={demoLists} merchantId="demo" />
    </div>
  )
}
