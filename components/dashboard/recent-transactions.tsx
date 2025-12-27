"use client"

import type { Transaction } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Activity, ShieldCheck, ShieldAlert, ShieldX, ArrowRight } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatAmount } = useCurrency()

  return (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#00a8ff]" />
            Recent Transactions
          </CardTitle>
          <CardDescription className="text-[#6b7b9a]">Latest transactions processed through PayGuard</CardDescription>
        </div>
        <Button asChild variant="ghost" className="text-[#00ffc8] hover:text-[#00ffc8] hover:bg-[#00ffc8]/10">
          <Link href="/dashboard/transactions">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-sm text-[#6b7b9a] py-8">
              No transactions yet. Start by integrating the API or using the demo.
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#0a0e1a] p-4 hover:border-[#2a3a5a] transition-all hover:shadow-[0_0_20px_rgba(0,255,200,0.05)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      tx.decision === "approve"
                        ? "bg-[#00ffc8]/10"
                        : tx.decision === "review"
                          ? "bg-[#ffc107]/10"
                          : "bg-[#ff4757]/10",
                    )}
                  >
                    {tx.decision === "approve" ? (
                      <ShieldCheck className="h-5 w-5 text-[#00ffc8]" />
                    ) : tx.decision === "review" ? (
                      <ShieldAlert className="h-5 w-5 text-[#ffc107]" />
                    ) : (
                      <ShieldX className="h-5 w-5 text-[#ff4757]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{formatAmount(tx.amount_cents)}</span>
                      <Badge
                        className={cn(
                          "text-xs font-mono uppercase",
                          tx.decision === "approve"
                            ? "bg-[#00ffc8]/20 text-[#00ffc8] border-[#00ffc8]/30"
                            : tx.decision === "review"
                              ? "bg-[#ffc107]/20 text-[#ffc107] border-[#ffc107]/30"
                              : "bg-[#ff4757]/20 text-[#ff4757] border-[#ff4757]/30",
                        )}
                        variant="outline"
                      >
                        {tx.decision}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6b7b9a] mt-0.5">
                      {tx.customer_email || "No email"} • {tx.customer_country || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-xl font-bold font-mono",
                      tx.risk_score <= 30
                        ? "text-[#00ffc8]"
                        : tx.risk_score <= 70
                          ? "text-[#ffc107]"
                          : "text-[#ff4757]",
                    )}
                  >
                    {tx.risk_score}
                  </div>
                  <p className="text-xs text-[#6b7b9a]">
                    {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
