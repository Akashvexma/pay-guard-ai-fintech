import { NextResponse } from "next/server"
import { extractFeatures, predictFraud, getRiskLevel, getDecision, MODEL_CONFIG } from "@/lib/ml-model"
import { storeTransaction, type AnalyzedTransaction } from "@/lib/transaction-store"
import { trackTransaction } from "@/lib/redis"

interface AnalyzeRiskRequest {
  transaction_id?: string
  amount: number
  time?: number
  card_bin?: string
  customer_ip?: string
  customer_email?: string
  customer_country?: string
  device_fingerprint?: string
  currency?: string
  // Direct Kaggle format support
  V1?: number
  V2?: number
  V3?: number
  V4?: number
  V5?: number
  V6?: number
  V7?: number
  V8?: number
  V9?: number
  V10?: number
  V11?: number
  V12?: number
  V13?: number
  V14?: number
  V15?: number
  V16?: number
  V17?: number
  V18?: number
  V19?: number
  V20?: number
  V21?: number
  V22?: number
  V23?: number
  V24?: number
  V25?: number
  V26?: number
  V27?: number
  V28?: number
  Time?: number
  Amount?: number
}

export async function POST(request: Request) {
  const startTime = performance.now()

  try {
    const body: AnalyzeRiskRequest = await request.json()

    // Validate required fields
    const amount = body.amount ?? body.Amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount is required and must be a positive number" }, { status: 400 })
    }

    const transactionId = body.transaction_id || `txn_${crypto.randomUUID().slice(0, 12)}`

    // Check if raw V1-V28 features are provided (Kaggle format)
    let features: Record<string, number>

    if (body.V1 !== undefined) {
      // Use provided Kaggle-format features directly
      features = {
        V1: body.V1 ?? 0,
        V2: body.V2 ?? 0,
        V3: body.V3 ?? 0,
        V4: body.V4 ?? 0,
        V5: body.V5 ?? 0,
        V6: body.V6 ?? 0,
        V7: body.V7 ?? 0,
        V8: body.V8 ?? 0,
        V9: body.V9 ?? 0,
        V10: body.V10 ?? 0,
        V11: body.V11 ?? 0,
        V12: body.V12 ?? 0,
        V13: body.V13 ?? 0,
        V14: body.V14 ?? 0,
        V15: body.V15 ?? 0,
        V16: body.V16 ?? 0,
        V17: body.V17 ?? 0,
        V18: body.V18 ?? 0,
        V19: body.V19 ?? 0,
        V20: body.V20 ?? 0,
        V21: body.V21 ?? 0,
        V22: body.V22 ?? 0,
        V23: body.V23 ?? 0,
        V24: body.V24 ?? 0,
        V25: body.V25 ?? 0,
        V26: body.V26 ?? 0,
        V27: body.V27 ?? 0,
        V28: body.V28 ?? 0,
        Amount: amount,
        Time: body.Time ?? body.time ?? Date.now() / 1000,
      }
    } else {
      // Extract features from transaction data
      features = extractFeatures({
        amount,
        time: body.time,
        card_bin: body.card_bin,
        customer_ip: body.customer_ip,
        customer_email: body.customer_email,
        customer_country: body.customer_country,
        device_fingerprint: body.device_fingerprint,
        hour_of_day: body.time ? Math.floor((body.time % 86400) / 3600) : undefined,
      })
    }

    // Run ML prediction
    const prediction = predictFraud(features)
    const fraudProbability = Math.min(Math.max(prediction.probability, 0), 1)
    const riskScore = Math.round(fraudProbability * 100)
    const riskLevel = getRiskLevel(fraudProbability)
    const decision = getDecision(fraudProbability)

    const processingTime = Math.round(performance.now() - startTime)

    // Track transaction for velocity analysis (non-blocking, with error handling)
    trackTransaction({
      ip: body.customer_ip,
      cardBin: body.card_bin,
      email: body.customer_email,
      deviceFingerprint: body.device_fingerprint,
      amount,
    }).catch(() => {
      // Silently ignore tracking errors
    })

    // Store transaction for audit log (non-blocking, with error handling)
    const analyzedTransaction: AnalyzedTransaction = {
      id: crypto.randomUUID(),
      transaction_id: transactionId,
      timestamp: new Date().toISOString(),
      amount,
      currency: body.currency || "USD",
      customer_email: body.customer_email,
      customer_ip: body.customer_ip,
      customer_country: body.customer_country,
      card_bin: body.card_bin,
      card_last_four: body.card_bin ? body.card_bin.slice(-4) : undefined,
      device_fingerprint: body.device_fingerprint,
      fraud_probability: fraudProbability,
      risk_score: riskScore,
      risk_level: riskLevel,
      decision,
      feature_contributions: prediction.featureContributions.slice(0, 10).map((fc) => ({
        feature: fc.feature,
        value: fc.value,
        contribution: fc.contribution,
        impact: fc.impact,
      })),
      model_version: MODEL_CONFIG.version,
      processing_time_ms: processingTime,
      reviewed: false,
    }

    storeTransaction(analyzedTransaction).catch(() => {
      // Silently ignore storage errors
    })

    // Build response matching Track 3 spec
    const response = {
      transaction_id: transactionId,
      fraud_probability: Number(fraudProbability.toFixed(4)),
      risk_score: riskScore,
      risk_level: riskLevel,
      decision: decision,
      model: {
        version: MODEL_CONFIG.version,
        type: MODEL_CONFIG.type,
        training_dataset: MODEL_CONFIG.dataset,
        training_samples: MODEL_CONFIG.samples,
      },
      feature_analysis: prediction.featureContributions.slice(0, 10).map((fc) => ({
        feature: fc.feature,
        value: fc.value,
        contribution: fc.contribution,
        impact: fc.impact,
      })),
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, {
      headers: {
        "X-Processing-Time": `${processingTime}ms`,
        "X-Model-Version": MODEL_CONFIG.version,
        "X-Risk-Level": riskLevel,
      },
    })
  } catch (error) {
    console.error("Analyze risk error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// GET endpoint for API info and model metadata
export async function GET() {
  return NextResponse.json({
    service: "PayGuard AI - Fraud Detection API",
    version: MODEL_CONFIG.version,
    endpoint: "POST /api/analyze-risk",
    model: {
      type: MODEL_CONFIG.type,
      training_dataset: MODEL_CONFIG.dataset,
      training_date: MODEL_CONFIG.training_date,
      samples: MODEL_CONFIG.samples,
      fraud_cases: MODEL_CONFIG.fraud_cases,
      features: MODEL_CONFIG.features,
      metrics: MODEL_CONFIG.metrics,
    },
    request_format: {
      required: ["amount"],
      optional: [
        "transaction_id",
        "time",
        "card_bin",
        "customer_ip",
        "customer_email",
        "customer_country",
        "device_fingerprint",
        "currency",
      ],
      kaggle_format: "V1-V28, Time, Amount (for direct dataset testing)",
    },
    response_format: {
      fraud_probability: "0.0 - 1.0 (from ML model sigmoid output)",
      risk_score: "0 - 100 (fraud_probability * 100)",
      risk_level: "low (<25%) | medium (25-50%) | high (50-75%) | critical (>75%)",
      decision: "approve (<30%) | review (30-70%) | decline (>70%)",
      feature_analysis: "Top 10 features contributing to the prediction",
    },
    example_request: {
      amount: 149.99,
      customer_email: "john.doe@gmail.com",
      customer_ip: "192.168.1.1",
      customer_country: "US",
      card_bin: "411111",
    },
  })
}
