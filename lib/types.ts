export interface Merchant {
  id: string
  business_name: string
  business_type: string
  risk_tolerance: number
  api_key: string
  stripe_account_id?: string
  webhook_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  merchant_id: string
  external_id?: string
  amount_cents: number
  currency: string
  card_bin?: string
  card_last_four?: string
  card_brand?: string
  customer_email?: string
  customer_ip?: string
  customer_country?: string
  device_fingerprint?: string
  risk_score: number
  decision: "approve" | "review" | "decline"
  risk_factors: RiskFactor[]
  status: "pending" | "approved" | "declined" | "review" | "verified"
  stripe_payment_intent_id?: string
  reviewed_at?: string
  reviewed_by?: string
  created_at: string
}

export interface RiskFactor {
  factor: string
  score: number
  description: string
  severity: "low" | "medium" | "high"
}

export interface Rule {
  id: string
  merchant_id: string
  name: string
  rule_type: "velocity" | "amount" | "geo" | "card" | "email" | "custom"
  condition: Record<string, unknown>
  action: "approve" | "review" | "decline" | "add_score"
  score_modifier: number
  is_active: boolean
  priority: number
  created_at: string
}

export interface Alert {
  id: string
  merchant_id: string
  transaction_id?: string
  alert_type: "high_risk" | "velocity" | "chargeback" | "pattern" | "system"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message?: string
  is_read: boolean
  created_at: string
}

export interface ListEntry {
  id: string
  merchant_id: string
  list_type: "whitelist" | "blacklist"
  entry_type: "email" | "ip" | "card_bin" | "country" | "device"
  value: string
  reason?: string
  created_at: string
}

export interface DailyStats {
  id: string
  merchant_id: string
  date: string
  total_transactions: number
  approved_count: number
  declined_count: number
  review_count: number
  total_amount_cents: number
  fraud_prevented_cents: number
  avg_risk_score: number
  created_at: string
}

export interface RiskScoreRequest {
  transaction_id?: string
  amount_cents: number
  currency?: string
  card_bin?: string
  card_last_four?: string
  card_brand?: string
  customer_email?: string
  customer_ip?: string
  customer_country?: string
  device_fingerprint?: string
}

export interface RiskScoreResponse {
  transaction_id: string
  risk_score: number
  decision: "approve" | "review" | "decline"
  risk_factors: RiskFactor[]
  processing_time_ms: number
}
