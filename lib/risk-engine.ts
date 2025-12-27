import type { RiskFactor, RiskScoreRequest, RiskScoreResponse } from "./types"
import { getVelocityCounts, trackTransaction } from "./redis"

// High-risk BINs (commonly associated with fraud in test scenarios)
const HIGH_RISK_BINS = new Set(["400000", "411111", "555555"])

// High-risk countries
const HIGH_RISK_COUNTRIES = new Set(["NG", "RU", "CN", "VN", "PH", "ID"])

// Disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "mailinator.com",
  "throwaway.email",
  "temp-mail.org",
  "fakeinbox.com",
])

interface RiskContext {
  merchantRiskTolerance: number
  whitelistedEmails?: Set<string>
  whitelistedIPs?: Set<string>
  blacklistedEmails?: Set<string>
  blacklistedIPs?: Set<string>
}

export async function calculateRiskScore(
  request: RiskScoreRequest,
  context: RiskContext = { merchantRiskTolerance: 50 },
): Promise<RiskScoreResponse> {
  const startTime = performance.now()
  const riskFactors: RiskFactor[] = []
  let totalScore = 0

  // 1. Check whitelist (auto-approve)
  if (context.whitelistedEmails?.has(request.customer_email?.toLowerCase() || "")) {
    return {
      transaction_id: request.transaction_id || crypto.randomUUID(),
      risk_score: 0,
      decision: "approve",
      risk_factors: [{ factor: "whitelist", score: 0, description: "Email is whitelisted", severity: "low" }],
      processing_time_ms: Math.round(performance.now() - startTime),
    }
  }

  if (context.whitelistedIPs?.has(request.customer_ip || "")) {
    return {
      transaction_id: request.transaction_id || crypto.randomUUID(),
      risk_score: 0,
      decision: "approve",
      risk_factors: [{ factor: "whitelist", score: 0, description: "IP is whitelisted", severity: "low" }],
      processing_time_ms: Math.round(performance.now() - startTime),
    }
  }

  // 2. Check blacklist (auto-decline)
  if (context.blacklistedEmails?.has(request.customer_email?.toLowerCase() || "")) {
    return {
      transaction_id: request.transaction_id || crypto.randomUUID(),
      risk_score: 100,
      decision: "decline",
      risk_factors: [{ factor: "blacklist", score: 100, description: "Email is blacklisted", severity: "high" }],
      processing_time_ms: Math.round(performance.now() - startTime),
    }
  }

  if (context.blacklistedIPs?.has(request.customer_ip || "")) {
    return {
      transaction_id: request.transaction_id || crypto.randomUUID(),
      risk_score: 100,
      decision: "decline",
      risk_factors: [{ factor: "blacklist", score: 100, description: "IP is blacklisted", severity: "high" }],
      processing_time_ms: Math.round(performance.now() - startTime),
    }
  }

  // 3. Velocity checks
  const velocityCounts = await getVelocityCounts({
    ip: request.customer_ip,
    cardBin: request.card_bin,
    email: request.customer_email,
    deviceFingerprint: request.device_fingerprint,
  })

  // IP velocity (high if > 3 transactions in 5 min)
  if (velocityCounts.ip_5m > 3) {
    const factor: RiskFactor = {
      factor: "ip_velocity",
      score: Math.min(velocityCounts.ip_5m * 10, 40),
      description: `${velocityCounts.ip_5m} transactions from this IP in last 5 minutes`,
      severity: velocityCounts.ip_5m > 5 ? "high" : "medium",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // Card velocity (high if > 2 transactions in 5 min)
  if (velocityCounts.card_5m > 2) {
    const factor: RiskFactor = {
      factor: "card_velocity",
      score: Math.min(velocityCounts.card_5m * 15, 45),
      description: `${velocityCounts.card_5m} transactions with this card in last 5 minutes`,
      severity: velocityCounts.card_5m > 4 ? "high" : "medium",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // Email velocity
  if (velocityCounts.email_15m > 3) {
    const factor: RiskFactor = {
      factor: "email_velocity",
      score: Math.min(velocityCounts.email_15m * 8, 30),
      description: `${velocityCounts.email_15m} transactions with this email in last 15 minutes`,
      severity: "medium",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // 4. Amount analysis
  if (request.amount_cents > 50000) {
    // > $500
    const factor: RiskFactor = {
      factor: "high_amount",
      score: request.amount_cents > 100000 ? 20 : 10,
      description: `High transaction amount: $${(request.amount_cents / 100).toFixed(2)}`,
      severity: request.amount_cents > 100000 ? "medium" : "low",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // Round amounts (often fraudulent)
  if (request.amount_cents % 10000 === 0 && request.amount_cents > 10000) {
    const factor: RiskFactor = {
      factor: "round_amount",
      score: 10,
      description: "Suspiciously round transaction amount",
      severity: "low",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // 5. Card BIN analysis
  if (request.card_bin && HIGH_RISK_BINS.has(request.card_bin)) {
    const factor: RiskFactor = {
      factor: "high_risk_bin",
      score: 25,
      description: "Card BIN associated with higher fraud rates",
      severity: "medium",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // 6. Geo analysis
  if (request.customer_country && HIGH_RISK_COUNTRIES.has(request.customer_country)) {
    const factor: RiskFactor = {
      factor: "high_risk_country",
      score: 30,
      description: `Transaction from high-risk country: ${request.customer_country}`,
      severity: "high",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // 7. Email analysis
  if (request.customer_email) {
    const emailDomain = request.customer_email.split("@")[1]?.toLowerCase()

    // Disposable email
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
      const factor: RiskFactor = {
        factor: "disposable_email",
        score: 35,
        description: "Using disposable email service",
        severity: "high",
      }
      riskFactors.push(factor)
      totalScore += factor.score
    }

    // Numeric email patterns (often auto-generated)
    const emailLocal = request.customer_email.split("@")[0]
    if (/^\d+$/.test(emailLocal) || /^[a-z]\d{5,}$/i.test(emailLocal)) {
      const factor: RiskFactor = {
        factor: "suspicious_email",
        score: 15,
        description: "Email pattern suggests auto-generation",
        severity: "medium",
      }
      riskFactors.push(factor)
      totalScore += factor.score
    }
  }

  // 8. Missing data penalties
  if (!request.customer_ip) {
    const factor: RiskFactor = {
      factor: "missing_ip",
      score: 10,
      description: "Customer IP address not provided",
      severity: "low",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  if (!request.device_fingerprint) {
    const factor: RiskFactor = {
      factor: "missing_device",
      score: 5,
      description: "Device fingerprint not provided",
      severity: "low",
    }
    riskFactors.push(factor)
    totalScore += factor.score
  }

  // Cap score at 100
  totalScore = Math.min(totalScore, 100)

  // Determine decision based on merchant risk tolerance
  // Lower tolerance = stricter (review/decline at lower scores)
  const approveThreshold = Math.max(20, context.merchantRiskTolerance * 0.4)
  const reviewThreshold = Math.max(50, context.merchantRiskTolerance * 0.8)

  let decision: "approve" | "review" | "decline"
  if (totalScore <= approveThreshold) {
    decision = "approve"
  } else if (totalScore <= reviewThreshold) {
    decision = "review"
  } else {
    decision = "decline"
  }

  // Track this transaction for future velocity checks
  await trackTransaction({
    ip: request.customer_ip,
    cardBin: request.card_bin,
    email: request.customer_email,
    deviceFingerprint: request.device_fingerprint,
    amount: request.amount_cents,
  })

  return {
    transaction_id: request.transaction_id || crypto.randomUUID(),
    risk_score: totalScore,
    decision,
    risk_factors: riskFactors.sort((a, b) => b.score - a.score),
    processing_time_ms: Math.round(performance.now() - startTime),
  }
}
