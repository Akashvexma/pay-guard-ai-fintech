"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { getDemoSessionClient, type DemoUser } from "@/lib/demo-auth"
import { CurrencyProvider } from "@/lib/currency-context"
import { GlobalAIAssistant } from "@/components/global-ai-assistant"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getDemoSessionClient()
    if (!session) {
      window.location.href = "/auth/login"
      return
    }
    setUser(session)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ffc8]" />
          <p className="text-[#6b7b9a]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const merchant = {
    id: user.id,
    business_name: user.businessName,
    business_type: user.businessType,
    risk_tolerance: 50,
    api_key: "pg_live_" + user.id.substring(0, 8),
    is_active: true,
    created_at: user.createdAt,
    updated_at: user.createdAt,
  }

  return (
    <CurrencyProvider>
      <div className="flex min-h-screen bg-[#0a0e1a] relative">
        {/* Background effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#0a0e1a]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#00ffc8]/5 blur-[150px]" />
          <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#00a8ff]/5 blur-[150px]" />
        </div>

        <DashboardNav />
        <div className="flex flex-1 flex-col">
          <DashboardHeader merchant={merchant} />
          <main className="flex-1 p-6">{children}</main>
        </div>

        <GlobalAIAssistant />
      </div>
    </CurrencyProvider>
  )
}
