import { NextResponse } from "next/server"
import { extractFeatures, predictFraud, getRiskLevel, getDecision, MODEL_CONFIG } from "@/lib/ml-model"

// Batch analysis endpoint for testing with CSV data
export async function POST(request: Request) {
  const startTime = performance.now()

  try {
    const body = await request.json()
    const { transactions } = body

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: "transactions array is required" }, { status: 400 })
    }

    if (transactions.length > 1000) {
      return NextResponse.json({ error: "Maximum 1000 transactions per batch" }, { status: 400 })
    }

    const results = transactions.map((txn: any, index: number) => {
      const amount = txn.amount ?? txn.Amount ?? 0

      // Check if Kaggle format
      let features: Record<string, number>
      if (txn.V1 !== undefined) {
        features = {
          V1: txn.V1 ?? 0,
          V2: txn.V2 ?? 0,
          V3: txn.V3 ?? 0,
          V4: txn.V4 ?? 0,
          V5: txn.V5 ?? 0,
          V6: txn.V6 ?? 0,
          V7: txn.V7 ?? 0,
          V8: txn.V8 ?? 0,
          V9: txn.V9 ?? 0,
          V10: txn.V10 ?? 0,
          V11: txn.V11 ?? 0,
          V12: txn.V12 ?? 0,
          V13: txn.V13 ?? 0,
          V14: txn.V14 ?? 0,
          V15: txn.V15 ?? 0,
          V16: txn.V16 ?? 0,
          V17: txn.V17 ?? 0,
          V18: txn.V18 ?? 0,
          V19: txn.V19 ?? 0,
          V20: txn.V20 ?? 0,
          V21: txn.V21 ?? 0,
          V22: txn.V22 ?? 0,
          V23: txn.V23 ?? 0,
          V24: txn.V24 ?? 0,
          V25: txn.V25 ?? 0,
          V26: txn.V26 ?? 0,
          V27: txn.V27 ?? 0,
          V28: txn.V28 ?? 0,
          Amount: amount,
          Time: txn.Time ?? txn.time ?? 0,
        }
      } else {
        features = extractFeatures({
          amount,
          time: txn.time,
          card_bin: txn.card_bin,
          customer_ip: txn.customer_ip,
          customer_email: txn.customer_email,
          customer_country: txn.customer_country,
          device_fingerprint: txn.device_fingerprint,
        })
      }

      const prediction = predictFraud(features)
      const probability = Math.min(Math.max(prediction.probability, 0), 1)

      return {
        index,
        transaction_id: txn.transaction_id || `batch_${index}`,
        amount,
        fraud_probability: Number(probability.toFixed(4)),
        risk_score: Math.round(probability * 100),
        risk_level: getRiskLevel(probability),
        decision: getDecision(probability),
        actual_class: txn.Class, // If provided from Kaggle dataset
      }
    })

    const processingTime = Math.round(performance.now() - startTime)

    // Calculate batch statistics
    const stats = {
      total: results.length,
      approved: results.filter((r) => r.decision === "approve").length,
      review: results.filter((r) => r.decision === "review").length,
      declined: results.filter((r) => r.decision === "decline").length,
      avg_fraud_probability: Number(
        (results.reduce((sum, r) => sum + r.fraud_probability, 0) / results.length).toFixed(4),
      ),
    }

    // If actual labels provided, calculate accuracy
    const withLabels = results.filter((r) => r.actual_class !== undefined)
    let accuracy_metrics = null
    if (withLabels.length > 0) {
      const truePositives = withLabels.filter((r) => r.actual_class === 1 && r.decision === "decline").length
      const trueNegatives = withLabels.filter((r) => r.actual_class === 0 && r.decision === "approve").length
      const falsePositives = withLabels.filter((r) => r.actual_class === 0 && r.decision !== "approve").length
      const falseNegatives = withLabels.filter((r) => r.actual_class === 1 && r.decision === "approve").length

      const precision = truePositives / (truePositives + falsePositives) || 0
      const recall = truePositives / (truePositives + falseNegatives) || 0

      accuracy_metrics = {
        accuracy: (truePositives + trueNegatives) / withLabels.length,
        precision,
        recall,
        f1_score: (2 * (precision * recall)) / (precision + recall) || 0,
        confusion_matrix: {
          true_positives: truePositives,
          true_negatives: trueNegatives,
          false_positives: falsePositives,
          false_negatives: falseNegatives,
        },
      }
    }

    return NextResponse.json({
      batch_id: crypto.randomUUID(),
      model_version: MODEL_CONFIG.version,
      results,
      statistics: stats,
      accuracy_metrics,
      processing_time_ms: processingTime,
      avg_time_per_transaction: Number((processingTime / results.length).toFixed(2)),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch analyze error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
