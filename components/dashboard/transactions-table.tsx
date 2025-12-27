"use client"

import type { Transaction } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Search, Filter, Eye, Download } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [search, setSearch] = useState("")
  const [filterDecision, setFilterDecision] = useState<string>("all")
  const { formatAmount, currency } = useCurrency()

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      tx.customer_ip?.includes(search) ||
      tx.external_id?.includes(search)
    const matchesDecision = filterDecision === "all" || tx.decision === filterDecision
    return matchesSearch && matchesDecision
  })

  return (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-white">All Transactions</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6b7b9a]" />
              <Input
                placeholder="Search email, IP, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full sm:w-[250px] bg-[#0a0e1a] border-[#1a2744] text-white placeholder:text-[#4a5568] focus:border-[#00ffc8]/50 focus:ring-[#00ffc8]/20"
              />
            </div>
            <Select value={filterDecision} onValueChange={setFilterDecision}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[#0a0e1a] border-[#1a2744] text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="approve">Approved</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="decline">Declined</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-[#1a2744] text-[#6b7b9a] hover:text-white hover:bg-[#1a2744] bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1a2744] hover:bg-transparent">
                <TableHead className="text-[#6b7b9a] font-semibold">Amount ({currency})</TableHead>
                <TableHead className="text-[#6b7b9a] font-semibold">Decision</TableHead>
                <TableHead className="text-[#6b7b9a] font-semibold">Risk Score</TableHead>
                <TableHead className="hidden md:table-cell text-[#6b7b9a] font-semibold">Email</TableHead>
                <TableHead className="hidden lg:table-cell text-[#6b7b9a] font-semibold">Country</TableHead>
                <TableHead className="hidden sm:table-cell text-[#6b7b9a] font-semibold">Time</TableHead>
                <TableHead className="text-right text-[#6b7b9a] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-[#6b7b9a]">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-[#1a2744] hover:bg-[#1a2744]/30">
                    <TableCell className="font-semibold text-white">{formatAmount(tx.amount_cents)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          tx.decision === "approve" && "bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30",
                          tx.decision === "review" && "bg-[#ffc107]/20 text-[#ffc107] border border-[#ffc107]/30",
                          tx.decision === "decline" && "bg-[#ff4757]/20 text-[#ff4757] border border-[#ff4757]/30",
                        )}
                      >
                        {tx.decision}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-bold font-mono",
                          tx.risk_score <= 30
                            ? "text-[#00ffc8]"
                            : tx.risk_score <= 70
                              ? "text-[#ffc107]"
                              : "text-[#ff4757]",
                        )}
                      >
                        {tx.risk_score}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[#8b9dc3]">{tx.customer_email || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-[#8b9dc3]">{tx.customer_country || "-"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-[#6b7b9a]">
                      {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <TransactionDetailDialog transaction={tx} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function TransactionDetailDialog({ transaction }: { transaction: Transaction }) {
  const { formatAmount } = useCurrency()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#0d1221] border-[#1a2744]">
        <DialogHeader>
          <DialogTitle className="text-white">Transaction Details</DialogTitle>
          <DialogDescription className="text-[#6b7b9a]">
            Full details and risk analysis for this transaction
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Amount</p>
              <p className="text-xl font-bold text-white">{formatAmount(transaction.amount_cents)}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Risk Score</p>
              <p
                className={cn(
                  "text-xl font-bold",
                  transaction.risk_score <= 30
                    ? "text-[#00ffc8]"
                    : transaction.risk_score <= 70
                      ? "text-[#ffc107]"
                      : "text-[#ff4757]",
                )}
              >
                {transaction.risk_score}/100
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Customer Email</p>
              <p className="text-white">{transaction.customer_email || "-"}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Customer IP</p>
              <p className="text-white font-mono text-sm">{transaction.customer_ip || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Card</p>
              <p className="text-white">
                {transaction.card_brand ? `${transaction.card_brand} ****${transaction.card_last_four}` : "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <p className="text-sm font-medium text-[#6b7b9a] mb-1">Country</p>
              <p className="text-white">{transaction.customer_country || "-"}</p>
            </div>
          </div>
          {transaction.risk_factors && transaction.risk_factors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#6b7b9a] mb-2">Risk Factors</p>
              <div className="space-y-2">
                {transaction.risk_factors.map((factor, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#0a0e1a] p-3"
                  >
                    <div>
                      <p className="font-medium text-white">{factor.factor}</p>
                      <p className="text-sm text-[#6b7b9a]">{factor.description}</p>
                    </div>
                    <Badge
                      className={cn(
                        "font-mono",
                        factor.severity === "low" && "bg-[#00ffc8]/20 text-[#00ffc8]",
                        factor.severity === "medium" && "bg-[#ffc107]/20 text-[#ffc107]",
                        factor.severity === "high" && "bg-[#ff4757]/20 text-[#ff4757]",
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
      </DialogContent>
    </Dialog>
  )
}
