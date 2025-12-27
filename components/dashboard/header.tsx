"use client"

import type { Merchant } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Menu, Shield, Settings, HelpCircle, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "./mobile-nav"
import { CurrencyToggle } from "./currency-toggle"
import { NotificationCenter } from "./notification-center"
import { clearDemoSession } from "@/lib/demo-auth"

export function DashboardHeader({ merchant }: { merchant: Merchant }) {
  const router = useRouter()

  const handleSignOut = () => {
    clearDemoSession()
    window.location.href = "/"
  }

  const initials = merchant.business_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1a2744] bg-[#0d1221]/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#1a2744]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#080c14] border-[#1a2744]">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-8 w-8 rounded-lg bg-[#00ffc8]/10 border border-[#00ffc8]/30 items-center justify-center">
            <Shield className="h-4 w-4 text-[#00ffc8]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{merchant.business_name}</h1>
            <p className="text-xs text-[#6b7b9a] hidden sm:block">Protected by PayGuard AI</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <CurrencyToggle />
        <NotificationCenter />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-[#1a2744]">
              <Avatar className="border-2 border-[#00ffc8]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#0d1221] border-[#1a2744]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white">{merchant.business_name}</p>
                <p className="text-xs text-[#6b7b9a]">{merchant.business_type}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1a2744]" />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="text-[#8b9dc3] hover:text-white hover:bg-[#1a2744] cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/integration")}
              className="text-[#8b9dc3] hover:text-white hover:bg-[#1a2744] cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              API Docs
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#8b9dc3] hover:text-white hover:bg-[#1a2744] cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1a2744]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-[#ff4757] hover:text-[#ff4757] hover:bg-[#ff4757]/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
