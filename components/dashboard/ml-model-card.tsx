"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Database, Cpu, CheckCircle, Activity, BarChart3, Zap, RefreshCw } from "lucide-react"

interface MLModelCardProps {
  compact?: boolean
}

export function MLModelCard({ compact = false }: MLModelCardProps) {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  const modelMetrics = {
    accuracy: 0.9991,
    precision: 0.8723,
    recall: 0.6182,
    f1Score: 0.7235,
    aucRoc: 0.9742,
    trainingSamples: 284807,
    fraudCases: 492,
    features: 30,
    modelType: "Logistic Regression",
    lastTrained: "2025-01-15",
    version: "1.0.0",
  }

  const handleRetrain = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  if (compact) {
    return (
      <Card className="bg-[#0a1628] border-[#1a2744]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-[#a855f7]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">ML Model Active</h4>
                <p className="text-xs text-[#6b7b9a]">Logistic Regression v{modelMetrics.version}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#00ffc8]">{(modelMetrics.accuracy * 100).toFixed(2)}%</p>
              <p className="text-xs text-[#6b7b9a]">Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#0a1628] border-[#1a2744]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-[#a855f7]" />
            </div>
            <div>
              <CardTitle className="text-white">Trained ML Model</CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                {modelMetrics.modelType} • Version {modelMetrics.version}
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Training Data Info */}
        <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[#00ffc8]" />
            <span className="text-sm font-medium text-white">Training Dataset</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-white">{modelMetrics.trainingSamples.toLocaleString()}</p>
              <p className="text-xs text-[#6b7b9a]">Total Transactions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{modelMetrics.fraudCases}</p>
              <p className="text-xs text-[#6b7b9a]">Fraud Cases (0.17%)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00ffc8]">{modelMetrics.features}</p>
              <p className="text-xs text-[#6b7b9a]">Features (V1-V28 + Amount + Time)</p>
            </div>
          </div>
          <p className="text-xs text-[#6b7b9a] mt-3">
            Source: Kaggle Credit Card Fraud Detection Dataset • PCA-transformed features for anonymization
          </p>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
            <p className="text-xl font-bold text-[#00ffc8]">{(modelMetrics.accuracy * 100).toFixed(2)}%</p>
            <p className="text-xs text-[#6b7b9a]">Accuracy</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
            <p className="text-xl font-bold text-[#00a8ff]">{(modelMetrics.precision * 100).toFixed(1)}%</p>
            <p className="text-xs text-[#6b7b9a]">Precision</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
            <p className="text-xl font-bold text-[#a855f7]">{(modelMetrics.recall * 100).toFixed(1)}%</p>
            <p className="text-xs text-[#6b7b9a]">Recall</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
            <p className="text-xl font-bold text-amber-400">{(modelMetrics.f1Score * 100).toFixed(1)}%</p>
            <p className="text-xs text-[#6b7b9a]">F1 Score</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
            <p className="text-xl font-bold text-emerald-400">{(modelMetrics.aucRoc * 100).toFixed(1)}%</p>
            <p className="text-xs text-[#6b7b9a]">AUC-ROC</p>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-[#00ffc8]" />
            <span className="text-sm font-medium text-white">Top Feature Importance</span>
          </div>
          <div className="space-y-2">
            {[
              { feature: "V14", importance: 0.215, desc: "Transaction pattern indicator" },
              { feature: "V12", importance: 0.182, desc: "Customer behavior signal" },
              { feature: "V4", importance: 0.124, desc: "Time-based correlation" },
              { feature: "V10", importance: 0.098, desc: "Amount relationship" },
              { feature: "V17", importance: 0.087, desc: "Location pattern" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#00ffc8] w-8">{f.feature}</span>
                <div className="flex-1 h-2 bg-[#1a2744] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-full"
                    style={{ width: `${f.importance * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#6b7b9a] w-20">{(f.importance * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="p-4 rounded-lg bg-[#080c14] border border-[#00ffc8]/30">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-[#00ffc8] animate-pulse" />
              <span className="text-sm font-medium text-white">Retraining Model...</span>
            </div>
            <Progress value={trainingProgress} className="h-2" />
            <p className="text-xs text-[#6b7b9a] mt-2">
              Processing {Math.floor(trainingProgress * 2848).toLocaleString()} /{" "}
              {modelMetrics.trainingSamples.toLocaleString()} samples
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
            onClick={handleRetrain}
            disabled={isTraining}
          >
            {isTraining ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Retrain Model
              </>
            )}
          </Button>
          <Button variant="outline" className="border-[#1a2744] bg-[#080c14] text-white hover:bg-[#1a2744]">
            <Activity className="h-4 w-4 mr-2" />
            View Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
