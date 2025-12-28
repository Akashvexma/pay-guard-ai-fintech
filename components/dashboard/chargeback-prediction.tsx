"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, DollarSign, Calendar, ShieldAlert, Brain, RefreshCw } from "lucide-react"
import { analyzeTransaction, MODEL_CONFIG, sigmoid } from "@/lib/ml-model"

interface PredictedChargeback {
  transactionId: string
  amount: number
  probability: number
  predictedDate: string
  reason: string
  customer: string
  mlFeatures: { feature: string; contribution: number }[]
}

class ChargebackModel {
  private coefficients = {
    fraudScore: 0.45,
    amount: 0.0008,
    daysSincePurchase: -0.02,
    previousChargebacks: 0.35,
    isDigitalProduct: 0.15,
    isInternational: 0.12,
    velocityScore: 0.08,
  }
  private intercept = -2.8

  predict(data: {
    fraudScore: number
    amount: number
    daysSincePurchase: number
    previousChargebacks: number
    isDigitalProduct: boolean
    isInternational: boolean
    velocityScore: number
  }): { probability: number; features: { feature: string; contribution: number }[] } {
    const features: { feature: string; contribution: number }[] = []
    let logit = this.intercept

    const contributions = [
      { feature: "Fraud Score", value: data.fraudScore, coef: this.coefficients.fraudScore },
      { feature: "Amount", value: data.amount, coef: this.coefficients.amount },
      { feature: "Days Since Purchase", value: data.daysSincePurchase, coef: this.coefficients.daysSincePurchase },
      { feature: "Previous Chargebacks", value: data.previousChargebacks, coef: this.coefficients.previousChargebacks },
      { feature: "Digital Product", value: data.isDigitalProduct ? 1 : 0, coef: this.coefficients.isDigitalProduct },
      { feature: "International", value: data.isInternational ? 1 : 0, coef: this.coefficients.isInternational },
      { feature: "Velocity Score", value: data.velocityScore, coef: this.coefficients.velocityScore },
    ]

    for (const c of contributions) {
      const contribution = c.value * c.coef
      logit += contribution
      features.push({ feature: c.feature, contribution })
    }

    features.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))

    return {
      probability: sigmoid(logit),
      features: features.slice(0, 3),
    }
  }
}

const chargebackModel = new ChargebackModel()

export function ChargebackPrediction() {
  const [predictions, setPredictions] = useState<PredictedChargeback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAtRisk: 0,
    predictedChargebacks: 0,
    accuracy: MODEL_CONFIG.metrics.accuracy * 100,
    savedThisMonth: 12450,
  })

  const generatePredictions = useCallback(() => {
    const transactions = [
      {
        id: "txn_8f7a3b",
        amount: 299.99,
        customer: "j***@gmail.com",
        country: "NG",
        daysSincePurchase: 5,
        previousChargebacks: 2,
        isDigitalProduct: true,
      },
      {
        id: "txn_2c9d1e",
        amount: 149.5,
        customer: "m***@yahoo.com",
        country: "US",
        daysSincePurchase: 12,
        previousChargebacks: 1,
        isDigitalProduct: false,
      },
      {
        id: "txn_5a8b2f",
        amount: 499.0,
        customer: "s***@outlook.com",
        country: "RU",
        daysSincePurchase: 3,
        previousChargebacks: 0,
        isDigitalProduct: true,
      },
      {
        id: "txn_9d3e7c",
        amount: 89.99,
        customer: "a***@gmail.com",
        country: "IN",
        daysSincePurchase: 8,
        previousChargebacks: 1,
        isDigitalProduct: false,
      },
    ]

    const preds: PredictedChargeback[] = transactions.map((txn) => {
      // Get fraud score from main ML model
      const fraudAnalysis = analyzeTransaction({
        amount: txn.amount,
        email: txn.customer,
        country: txn.country,
      })

      // Use chargeback model for prediction
      const chargebackResult = chargebackModel.predict({
        fraudScore: fraudAnalysis.fraudProbability,
        amount: txn.amount,
        daysSincePurchase: txn.daysSincePurchase,
        previousChargebacks: txn.previousChargebacks,
        isDigitalProduct: txn.isDigitalProduct,
        isInternational: txn.country !== "US",
        velocityScore: fraudAnalysis.riskScore / 100,
      })

      // Deterministic predicted date based on transaction ID
      const daysUntilChargeback = 30 - txn.daysSincePurchase + (txn.id.charCodeAt(4) % 10)
      const predictedDate = new Date()
      predictedDate.setDate(predictedDate.getDate() + daysUntilChargeback)

      return {
        transactionId: txn.id,
        amount: txn.amount,
        probability: chargebackResult.probability,
        predictedDate: predictedDate.toLocaleDateString(),
        reason:
          chargebackResult.probability > 0.6
            ? "Product not as described"
            : chargebackResult.probability > 0.4
              ? "Unauthorized transaction"
              : "Service not received",
        customer: txn.customer,
        mlFeatures: chargebackResult.features,
      }
    })

    // Sort by probability descending
    preds.sort((a, b) => b.probability - a.probability)

    setPredictions(preds)
    setStats((prev) => ({
      ...prev,
      totalAtRisk: preds.reduce((sum, p) => sum + p.amount * p.probability, 0),
      predictedChargebacks: preds.filter((p) => p.probability > 0.5).length,
    }))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    generatePredictions()
  }, [generatePredictions])

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ShieldAlert className="h-5 w-5 text-orange-400" />
            Chargeback Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-orange-400" />
            <span className="ml-2 text-slate-400">Analyzing transactions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldAlert className="h-5 w-5 text-orange-400" />
              Chargeback Prediction
            </CardTitle>
            <CardDescription className="text-slate-400">ML-powered chargeback risk analysis</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
            <Brain className="h-3 w-3 mr-1" />
            {stats.accuracy.toFixed(1)}% Accuracy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <DollarSign className="h-4 w-4 mx-auto text-red-400 mb-1" />
            <div className="text-lg font-bold text-red-400">${stats.totalAtRisk.toFixed(0)}</div>
            <div className="text-xs text-slate-500">At Risk</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <AlertTriangle className="h-4 w-4 mx-auto text-orange-400 mb-1" />
            <div className="text-lg font-bold text-orange-400">{stats.predictedChargebacks}</div>
            <div className="text-xs text-slate-500">Predicted</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 mx-auto text-green-400 mb-1" />
            <div className="text-lg font-bold text-green-400">${stats.savedThisMonth.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Saved</div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-3">
          {predictions.map((pred) => (
            <div key={pred.transactionId} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">{pred.transactionId}</span>
                    <Badge
                      className={
                        pred.probability > 0.7
                          ? "bg-red-500/20 text-red-400"
                          : pred.probability > 0.5
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {(pred.probability * 100).toFixed(0)}% Risk
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{pred.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">${pred.amount.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {pred.predictedDate}
                  </div>
                </div>
              </div>

              <Progress value={pred.probability * 100} className="h-1.5 mb-2 bg-slate-700" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Reason: {pred.reason}</span>
                <div className="flex gap-1">
                  {pred.mlFeatures.slice(0, 2).map((f, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                      {f.feature}: {f.contribution > 0 ? "+" : ""}
                      {f.contribution.toFixed(2)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
