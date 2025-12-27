import { NextResponse } from "next/server"
import { getRecentTransactions, getAuditStats, updateTransactionReview } from "@/lib/transaction-store"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const [transactions, stats] = await Promise.all([getRecentTransactions(limit), getAuditStats()])

    return NextResponse.json({
      transactions,
      stats,
      model_version: "1.0.0",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Audit log fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 })
  }
}

// Update transaction review status
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transaction_id, review_decision, reviewed_by } = body

    if (!transaction_id || !review_decision) {
      return NextResponse.json({ error: "transaction_id and review_decision are required" }, { status: 400 })
    }

    const success = await updateTransactionReview(transaction_id, {
      reviewed_by: reviewed_by || "admin@payguard.ai",
      review_decision,
    })

    if (success) {
      return NextResponse.json({ success: true, message: "Transaction review updated" })
    } else {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Review update error:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
