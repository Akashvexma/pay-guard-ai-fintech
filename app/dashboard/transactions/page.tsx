"use client"

import { useState } from "react"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  Search,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import type { Transaction } from "@/lib/types"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approve" | "review" | "decline">("all")

  const demoTransactions: Transaction[] = [
    {
      id: "txn_001",
      merchant_id: "demo",
      external_id: "ext_001",
      amount_cents: 15000,
      currency: "usd",
      customer_email: "john.smith@gmail.com",
      customer_ip: "203.0.113.42",
      customer_country: "US",
      card_bin: "424242",
      card_last_four: "4242",
      card_brand: "visa",
      risk_score: 12,
      decision: "approve",
      risk_factors: [],
      created_at: new Date().toISOString(),
    },
    {
      id: "txn_002",
      merchant_id: "demo",
      external_id: "ext_002",
      amount_cents: 89900,
      currency: "usd",
      customer_email: "suspicious@tempmail.com",
      customer_ip: "192.168.1.100",
      customer_country: "NG",
      card_bin: "400000",
      card_last_four: "0000",
      card_brand: "visa",
      risk_score: 78,
      decision: "decline",
      risk_factors: [
        { factor: "disposable_email", score: 25, description: "Disposable email provider detected", severity: "high" },
        { factor: "high_risk_country", score: 30, description: "Transaction from high-risk country", severity: "high" },
      ],
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "txn_003",
      merchant_id: "demo",
      external_id: "ext_003",
      amount_cents: 4500,
      currency: "usd",
      customer_email: "alice@company.com",
      customer_ip: "8.8.8.8",
      customer_country: "US",
      card_bin: "555555",
      card_last_four: "4444",
      card_brand: "mastercard",
      risk_score: 8,
      decision: "approve",
      risk_factors: [],
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "txn_004",
      merchant_id: "demo",
      external_id: "ext_004",
      amount_cents: 32000,
      currency: "usd",
      customer_email: "buyer@gmail.com",
      customer_ip: "45.67.89.10",
      customer_country: "CA",
      card_bin: "411111",
      card_last_four: "1111",
      card_brand: "visa",
      risk_score: 45,
      decision: "review",
      risk_factors: [
        { factor: "high_amount", score: 20, description: "Transaction amount above average", severity: "medium" },
        { factor: "new_customer", score: 15, description: "First transaction from this customer", severity: "low" },
      ],
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "txn_005",
      merchant_id: "demo",
      external_id: "ext_005",
      amount_cents: 150000,
      currency: "usd",
      customer_email: "fraud@fake.net",
      customer_ip: "185.220.101.1",
      customer_country: "RU",
      card_bin: "511111",
      card_last_four: "9999",
      card_brand: "mastercard",
      risk_score: 92,
      decision: "decline",
      risk_factors: [
        { factor: "velocity", score: 35, description: "Multiple transactions in short period", severity: "high" },
        { factor: "high_risk_country", score: 30, description: "Transaction from high-risk country", severity: "high" },
        { factor: "large_amount", score: 25, description: "Unusually large transaction", severity: "high" },
      ],
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: "txn_006",
      merchant_id: "demo",
      external_id: "ext_006",
      amount_cents: 7500,
      currency: "usd",
      customer_email: "regular@outlook.com",
      customer_ip: "72.14.192.1",
      customer_country: "US",
      card_bin: "424242",
      card_last_four: "1234",
      card_brand: "visa",
      risk_score: 5,
      decision: "approve",
      risk_factors: [],
      created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "txn_007",
      merchant_id: "demo",
      external_id: "ext_007",
      amount_cents: 24999,
      currency: "usd",
      customer_email: "shopper@yahoo.com",
      customer_ip: "98.45.12.78",
      customer_country: "US",
      card_bin: "378282",
      card_last_four: "8888",
      card_brand: "amex",
      risk_score: 22,
      decision: "approve",
      risk_factors: [],
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
    {
      id: "txn_008",
      merchant_id: "demo",
      external_id: "ext_008",
      amount_cents: 67500,
      currency: "usd",
      customer_email: "business@corp.io",
      customer_ip: "54.23.67.89",
      customer_country: "GB",
      card_bin: "453243",
      card_last_four: "5678",
      card_brand: "visa",
      risk_score: 38,
      decision: "review",
      risk_factors: [
        { factor: "new_card", score: 18, description: "Card not previously used", severity: "low" },
        { factor: "high_amount", score: 15, description: "Above average transaction", severity: "medium" },
      ],
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  ]

  const filteredTransactions = demoTransactions.filter((txn) => {
    const matchesSearch =
      searchQuery === "" ||
      txn.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.card_last_four.includes(searchQuery)

    const matchesFilter = filterStatus === "all" || txn.decision === filterStatus

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: demoTransactions.length,
    approved: demoTransactions.filter((t) => t.decision === "approve").length,
    reviewed: demoTransactions.filter((t) => t.decision === "review").length,
    declined: demoTransactions.filter((t) => t.decision === "decline").length,
    volume: demoTransactions.reduce((sum, t) => sum + t.amount_cents, 0) / 100,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[#00ffc8]" />
            Transaction History
          </h2>
          <p className="text-[#6b7b9a] text-sm mt-1">Monitor and analyze all processed transactions</p>
        </div>
        <Button
          variant="outline"
          className="border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235] bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00ffc8]/10">
                <TrendingUp className="h-5 w-5 text-[#00ffc8]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-[#6b7b9a]">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-xs text-[#6b7b9a]">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.reviewed}</p>
                <p className="text-xs text-[#6b7b9a]">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.declined}</p>
                <p className="text-xs text-[#6b7b9a]">Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1322] border-[#1a2235]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#a855f7]/10">
                <DollarSign className="h-5 w-5 text-[#a855f7]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${stats.volume.toLocaleString()}</p>
                <p className="text-xs text-[#6b7b9a]">Volume</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7b9a]" />
          <Input
            placeholder="Search by email, transaction ID, or card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0d1322] border-[#1a2235] text-white placeholder:text-[#6b7b9a] focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "approve", "review", "decline"] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={
                filterStatus === status
                  ? status === "approve"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : status === "review"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : status === "decline"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                  : "border-[#1a2235] text-[#6b7b9a] hover:text-white hover:bg-[#1a2235]"
              }
            >
              {status === "all" && <Filter className="h-4 w-4 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  )
}
