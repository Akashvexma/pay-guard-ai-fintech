"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, DollarSign, Calendar, ShieldAlert } from "lucide-react"

interface PredictedChargeback {
  transactionId: string
  amount: number
  probability: number
  predictedDate: string
  reason: string
  customer: string
}

export function ChargebackPrediction() {
  const [predictions, setPredictions] = useState<PredictedChargeback[]>([
    {
      transactionId: "txn_8f7a3b",
      amount: 299.99,
      probability: 78,
      predictedDate: "Jan 20, 2024",
      reason: "Item not received claim likely",
      customer: "j***@gmail.com",
    },
    {
      transactionId: "txn_2c9d1e",
      amount: 149.5,
      probability: 65,
      predictedDate: "Jan 22, 2024",
      reason: "Pattern matches friendly fraud",
      customer: "m***@yahoo.com",
    },
    {
      transactionId: "txn_5k8m2n",
      amount: 89.0,
      probability: 45,
      predictedDate: "Jan 25, 2024",
      reason: "High refund request history",
      customer: "s***@outlook.com",
    },
  ])

  const [stats, setStats] = useState({
    totalAtRisk: 538.49,
    predictedChargebacks: 3,
    accuracy: 94.2,
    savedThisMonth: 12450,
  })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        savedThisMonth: prev.savedThisMonth + Math.floor(Math.random() * 50),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#ffc107]" />
          Chargeback Prediction
          <Badge className="ml-2 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 text-xs">ML Powered</Badge>
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">
          AI predicts potential chargebacks before they happen
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#ff4757] mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">At Risk</span>
            </div>
            <p className="text-xl font-bold text-white">${stats.totalAtRisk.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#ffc107] mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Predicted</span>
            </div>
            <p className="text-xl font-bold text-white">{stats.predictedChargebacks}</p>
          </div>
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#00ffc8] mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Accuracy</span>
            </div>
            <p className="text-xl font-bold text-white">{stats.accuracy}%</p>
          </div>
          <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
            <div className="flex items-center gap-2 text-[#00ffc8] mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Saved</span>
            </div>
            <p className="text-xl font-bold text-white">${stats.savedThisMonth.toLocaleString()}</p>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">High-Risk Transactions</h4>
          {predictions.map((prediction) => (
            <div
              key={prediction.transactionId}
              className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744] hover:border-[#ffc107]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-[#00ffc8]">{prediction.transactionId}</code>
                    <Badge
                      className={
                        prediction.probability >= 70
                          ? "bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30"
                          : prediction.probability >= 50
                            ? "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                            : "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                      }
                    >
                      {prediction.probability}% risk
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6b7b9a] mt-1">{prediction.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${prediction.amount.toFixed(2)}</p>
                  <p className="text-xs text-[#6b7b9a]">Est. {prediction.predictedDate}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6b7b9a]">Chargeback Probability</span>
                  <span className="text-white">{prediction.probability}%</span>
                </div>
                <Progress value={prediction.probability} className="h-2 bg-[#1a2744]" />
                <p className="text-xs text-[#8b9dc3] flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-[#ffc107]" />
                  {prediction.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
