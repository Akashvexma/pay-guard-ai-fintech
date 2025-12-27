// Transaction Store - Persists analyzed transactions for audit log
import { Redis } from "@upstash/redis"

let redis: Redis | null = null

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
} catch {
  console.warn("Redis not configured for transaction store")
}

// In-memory fallback
const memoryTransactions: AnalyzedTransaction[] = []

export interface AnalyzedTransaction {
  id: string
  transaction_id: string
  timestamp: string
  amount: number
  currency: string
  customer_email?: string
  customer_ip?: string
  customer_country?: string
  card_bin?: string
  card_last_four?: string
  device_fingerprint?: string
  fraud_probability: number
  risk_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  decision: "approve" | "review" | "decline"
  feature_contributions: Array<{
    feature: string
    value: number
    contribution: number
    impact: string
  }>
  model_version: string
  processing_time_ms: number
  reviewed: boolean
  reviewed_by?: string
  reviewed_at?: string
  review_decision?: "approved" | "rejected" | "escalated"
}

// Store analyzed transaction
export async function storeTransaction(transaction: AnalyzedTransaction): Promise<void> {
  memoryTransactions.unshift(transaction) // Add to beginning for recent first

  // Keep only last 1000 transactions in memory
  if (memoryTransactions.length > 1000) {
    memoryTransactions.pop()
  }
}

export async function getRecentTransactions(limit = 100): Promise<AnalyzedTransaction[]> {
  return memoryTransactions.slice(0, limit)
}

// Get transaction by ID
export async function getTransactionById(id: string): Promise<AnalyzedTransaction | null> {
  return memoryTransactions.find((t) => t.id === id) || null
}

// Update transaction review status
export async function updateTransactionReview(
  id: string,
  reviewData: {
    reviewed_by: string
    review_decision: "approved" | "rejected" | "escalated"
  },
): Promise<boolean> {
  const idx = memoryTransactions.findIndex((t) => t.id === id)
  if (idx !== -1) {
    memoryTransactions[idx].reviewed = true
    memoryTransactions[idx].reviewed_by = reviewData.reviewed_by
    memoryTransactions[idx].reviewed_at = new Date().toISOString()
    memoryTransactions[idx].review_decision = reviewData.review_decision
    return true
  }
  return false
}

// Get audit stats
export async function getAuditStats(): Promise<{
  total_analyzed: number
  total_flagged: number
  total_declined: number
  pending_review: number
}> {
  return {
    total_analyzed: memoryTransactions.length,
    total_flagged: memoryTransactions.filter((t) => t.decision !== "approve").length,
    total_declined: memoryTransactions.filter((t) => t.decision === "decline").length,
    pending_review: memoryTransactions.filter((t) => t.decision === "review" && !t.reviewed).length,
  }
}

export function getAllTransactions(): AnalyzedTransaction[] {
  return memoryTransactions
}
