"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Shield,
  LayoutDashboard,
  Activity,
  Settings,
  FileText,
  ListFilter,
  Bell,
  Code,
  Zap,
  Hexagon,
  BarChart3,
  Users,
  FileBarChart,
  Terminal,
  Brain,
  ClipboardList,
  Cpu,
  Waves,
  Lock,
  Radar,
  Eye,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: Activity },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/insights", label: "AI Insights", icon: Brain },
  { href: "/dashboard/audit-log", label: "Audit Log", icon: ClipboardList, isNew: true },
  { href: "/dashboard/model", label: "ML Model", icon: Cpu, isNew: true },
  { href: "/dashboard/clarity-guardian", label: "Clarity Guardian", icon: Eye, isNew: true }, // Added Track 5
  { href: "/dashboard/whale-watcher", label: "Whale Watcher", icon: Waves, isNew: true },
  { href: "/dashboard/document-vault", label: "Document Vault", icon: Lock, isNew: true },
  { href: "/dashboard/api-sentinel", label: "API Sentinel", icon: Radar, isNew: true },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/rules", label: "Rules", icon: ListFilter },
  { href: "/dashboard/lists", label: "Lists", icon: FileText },
  { href: "/dashboard/integration", label: "API Docs", icon: Code },
  { href: "/dashboard/playground", label: "Playground", icon: Terminal },
  { href: "/dashboard/demo", label: "Live Demo", icon: Zap },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-[#1a2744] bg-[#080c14] lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-[#1a2744] px-6">
        <div className="relative">
          <Hexagon className="h-8 w-8 text-[#00ffc8] stroke-[1.5]" />
          <Shield className="h-4 w-4 text-[#00ffc8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <span className="text-lg font-bold text-white">
          Pay<span className="text-[#00ffc8]">Guard</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#00ffc8]/10 text-[#00ffc8] border border-[#00ffc8]/30"
                  : "text-[#6b7b9a] hover:bg-[#1a2744] hover:text-white border border-transparent",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.isNew && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1a2744] space-y-3">
        <Link
          href="/team"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7b9a] hover:bg-[#1a2744] hover:text-white transition-all"
        >
          <Users className="h-4 w-4" />
          Meet the Team
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#4a5568]">
          <div className="h-2 w-2 rounded-full bg-[#00ffc8] animate-pulse" />
          System Online
        </div>
      </div>
    </aside>
  )
}
