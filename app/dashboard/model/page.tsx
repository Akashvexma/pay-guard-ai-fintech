"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/lib/currency-context"
import {
  Brain,
  Database,
  Code,
  CheckCircle,
  Copy,
  Play,
  Clock,
  Zap,
  Activity,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react"
import { MLModelCard } from "@/components/dashboard/ml-model-card"

interface TransactionTest {
  id: string
  timestamp: Date
  amount: number
  email: string
  country: string
  ip: string
  cardBin: string
  riskScore: number
  fraudProbability: number
  decision: "approve" | "review" | "decline"
  processingTime: number
  features: { feature: string; value: number; contribution: number; impact: string }[]
}

export default function ModelPage() {
  const { formatAmount, currency } = useCurrency()
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testHistory, setTestHistory] = useState<TransactionTest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [liveStats, setLiveStats] = useState({
    totalTransactions: 0,
    approvedCount: 0,
    declinedCount: 0,
    reviewCount: 0,
    avgProcessingTime: 0,
    avgRiskScore: 0,
  })

  // Test form state
  const [testForm, setTestForm] = useState({
    amount: "150.00",
    email: "customer@example.com",
    ip: "192.168.1.1",
    country: "US",
    cardBin: "424242",
  })

  const analyzeTransaction = useCallback(
    async (data: {
      amount: number
      email: string
      ip: string
      country: string
      cardBin: string
    }): Promise<TransactionTest | null> => {
      const startTime = performance.now()

      try {
        const response = await fetch("/api/analyze-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: data.amount,
            customer_email: data.email,
            customer_ip: data.ip,
            customer_country: data.country,
            card_bin: data.cardBin,
            currency: currency,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        const clientTime = Math.round(performance.now() - startTime)

        return {
          id: result.transaction_id,
          timestamp: new Date(result.timestamp),
          amount: data.amount,
          email: data.email,
          country: data.country,
          ip: data.ip,
          cardBin: data.cardBin,
          riskScore: result.risk_score,
          fraudProbability: result.fraud_probability,
          decision: result.decision,
          processingTime: result.processing_time_ms || clientTime,
          features: result.feature_analysis || [],
        }
      } catch (err) {
        console.error("API call failed:", err)
        setError(err instanceof Error ? err.message : "API call failed")
        return null
      }
    },
    [currency],
  )

  useEffect(() => {
    if (!isRunning) return

    const countries = ["US", "GB", "DE", "FR", "JP", "AU", "CA", "IN", "BR", "NG", "RU", "CN"]
    const emails = [
      "john.doe@gmail.com",
      "jane.smith@yahoo.com",
      "test@tempmail.com",
      "customer@business.com",
      "user123@disposable.net",
      "alice@company.co",
    ]
    const cardBins = ["424242", "411111", "555555", "378282", "400000", "512345", "621234"]

    const runTransaction = async () => {
      // Generate random transaction data
      const amount = Math.random() * 4950 + 50 // $50 - $5000
      const email = emails[Math.floor(Math.random() * emails.length)]
      const country = countries[Math.floor(Math.random() * countries.length)]
      const cardBin = cardBins[Math.floor(Math.random() * cardBins.length)]
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

      const result = await analyzeTransaction({ amount, email, ip, country, cardBin })

      if (result) {
        setTestHistory((prev) => [result, ...prev].slice(0, 100))

        setLiveStats((prev) => {
          const total = prev.totalTransactions + 1
          return {
            totalTransactions: total,
            approvedCount: prev.approvedCount + (result.decision === "approve" ? 1 : 0),
            declinedCount: prev.declinedCount + (result.decision === "decline" ? 1 : 0),
            reviewCount: prev.reviewCount + (result.decision === "review" ? 1 : 0),
            avgProcessingTime: (prev.avgProcessingTime * prev.totalTransactions + result.processingTime) / total,
            avgRiskScore: (prev.avgRiskScore * prev.totalTransactions + result.riskScore) / total,
          }
        })
      }
    }

    // Run transactions at ~1.25/second
    const interval = setInterval(runTransaction, 800)
    return () => clearInterval(interval)
  }, [isRunning, analyzeTransaction])

  const runSingleTest = async () => {
    setIsLoading(true)
    setError(null)

    const result = await analyzeTransaction({
      amount: Number.parseFloat(testForm.amount) || 100,
      email: testForm.email,
      ip: testForm.ip,
      country: testForm.country,
      cardBin: testForm.cardBin,
    })

    if (result) {
      setTestHistory((prev) => [result, ...prev].slice(0, 100))

      setLiveStats((prev) => {
        const total = prev.totalTransactions + 1
        return {
          totalTransactions: total,
          approvedCount: prev.approvedCount + (result.decision === "approve" ? 1 : 0),
          declinedCount: prev.declinedCount + (result.decision === "decline" ? 1 : 0),
          reviewCount: prev.reviewCount + (result.decision === "review" ? 1 : 0),
          avgProcessingTime: (prev.avgProcessingTime * prev.totalTransactions + result.processingTime) / total,
          avgRiskScore: (prev.avgRiskScore * prev.totalTransactions + result.riskScore) / total,
        }
      })
    }

    setIsLoading(false)
  }

  const pythonTrainingCode = `# PayGuard AI - Fraud Detection Model Training
# Based on Kaggle Credit Card Fraud Detection Dataset
# https://www.kaggle.com/mlg-ulb/creditcardfraud

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import joblib
import json

# 1. Load the Kaggle Credit Card Fraud Dataset
print("Loading dataset...")
df = pd.read_csv('creditcard.csv')

print(f"Dataset shape: {df.shape}")
print(f"Fraud cases: {df['Class'].sum()} ({df['Class'].mean()*100:.3f}%)")
print(f"Normal cases: {len(df) - df['Class'].sum()}")

# 2. Prepare features and target
X = df.drop(['Class'], axis=1)  # V1-V28 + Time + Amount
y = df['Class']

# 3. Scale the Amount and Time features
scaler = StandardScaler()
X['Amount'] = scaler.fit_transform(X[['Amount']])
X['Time'] = scaler.fit_transform(X[['Time']])

# 4. Split into training and testing sets (stratified to maintain fraud ratio)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\\nTraining set: {len(X_train)} samples")
print(f"Test set: {len(X_test)} samples")

# 5. Train Logistic Regression model with class balancing
print("\\nTraining model...")
model = LogisticRegression(
    max_iter=1000,
    class_weight='balanced',  # Handle imbalanced data
    solver='lbfgs',
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# 6. Evaluate model
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

print("\\n=== Model Performance ===")
print(classification_report(y_test, y_pred, target_names=['Normal', 'Fraud']))
print(f"AUC-ROC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\\nConfusion Matrix:")
print(f"  TN: {cm[0][0]:,}  FP: {cm[0][1]:,}")
print(f"  FN: {cm[1][0]:,}  TP: {cm[1][1]:,}")

# 7. Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'coefficient': model.coef_[0],
    'abs_importance': np.abs(model.coef_[0])
}).sort_values('abs_importance', ascending=False)

print("\\n=== Top 10 Most Important Features ===")
print(feature_importance.head(10).to_string(index=False))

# 8. Save model and artifacts
print("\\nSaving model...")
joblib.dump(model, 'fraud_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Save coefficients as JSON for JavaScript implementation
coefficients = dict(zip(X.columns, model.coef_[0].tolist()))
with open('model_coefficients.json', 'w') as f:
    json.dump({
        'intercept': model.intercept_[0],
        'coefficients': coefficients,
        'feature_names': X.columns.tolist()
    }, f, indent=2)

print("\\nModel saved successfully!")
print("Files created: fraud_model.pkl, scaler.pkl, model_coefficients.json")`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearHistory = () => {
    setTestHistory([])
    setLiveStats({
      totalTransactions: 0,
      approvedCount: 0,
      declinedCount: 0,
      reviewCount: 0,
      avgProcessingTime: 0,
      avgRiskScore: 0,
    })
  }

  const exportHistory = () => {
    const csv = [
      [
        "Timestamp",
        "Transaction ID",
        "Amount",
        "Email",
        "Country",
        "Card BIN",
        "Risk Score",
        "Decision",
        "Latency (ms)",
      ].join(","),
      ...testHistory.map((t) =>
        [
          t.timestamp.toISOString(),
          t.id,
          t.amount.toFixed(2),
          t.email,
          t.country,
          t.cardBin,
          t.riskScore,
          t.decision,
          t.processingTime,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ml-test-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-[#a855f7]" />
            ML Model Center
          </h1>
          <p className="text-[#6b7b9a] mt-1">Trained fraud detection model with live API testing</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-1.5 px-3">
            <CheckCircle className="h-3 w-3 mr-1" />
            Model Active
          </Badge>
          <Badge className="bg-[#a855f7]/20 text-[#a855f7] border-[#a855f7]/30 py-1.5 px-3">v1.0.0</Badge>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Total Analyzed</p>
            <p className="text-2xl font-bold text-white font-mono">{liveStats.totalTransactions}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Approved</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{liveStats.approvedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Flagged</p>
            <p className="text-2xl font-bold text-amber-400 font-mono">{liveStats.reviewCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Declined</p>
            <p className="text-2xl font-bold text-red-400 font-mono">{liveStats.declinedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Avg Latency</p>
            <p className="text-2xl font-bold text-[#00ffc8] font-mono">{liveStats.avgProcessingTime.toFixed(0)}ms</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7b9a]">Avg Risk</p>
            <p className="text-2xl font-bold text-[#00a8ff] font-mono">{liveStats.avgRiskScore.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto text-red-400">
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Model Overview */}
      <MLModelCard />

      {/* Tabs */}
      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="bg-[#0a1628] border border-[#1a2744]">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Activity className="h-4 w-4 mr-2" />
            Live Testing
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Clock className="h-4 w-4 mr-2" />
            Transaction History
          </TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Code className="h-4 w-4 mr-2" />
            Training Code
          </TabsTrigger>
          <TabsTrigger value="dataset" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Database className="h-4 w-4 mr-2" />
            Dataset Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Test Form */}
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#00ffc8]" />
                  Single Transaction Test
                </CardTitle>
                <CardDescription className="text-[#6b7b9a]">
                  Run a single transaction through the real ML model API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#6b7b9a]">Amount ({currency})</Label>
                    <Input
                      value={testForm.amount}
                      onChange={(e) => setTestForm({ ...testForm, amount: e.target.value })}
                      className="bg-[#080c14] border-[#1a2744] text-white"
                      placeholder="150.00"
                    />
                  </div>
                  <div>
                    <Label className="text-[#6b7b9a]">Country</Label>
                    <Select value={testForm.country} onValueChange={(v) => setTestForm({ ...testForm, country: v })}>
                      <SelectTrigger className="bg-[#080c14] border-[#1a2744] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1628] border-[#1a2744]">
                        <SelectItem value="US" className="text-white">
                          United States
                        </SelectItem>
                        <SelectItem value="GB" className="text-white">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="DE" className="text-white">
                          Germany
                        </SelectItem>
                        <SelectItem value="IN" className="text-white">
                          India
                        </SelectItem>
                        <SelectItem value="NG" className="text-white">
                          Nigeria (High Risk)
                        </SelectItem>
                        <SelectItem value="RU" className="text-white">
                          Russia (High Risk)
                        </SelectItem>
                        <SelectItem value="CN" className="text-white">
                          China (High Risk)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#6b7b9a]">Email</Label>
                    <Input
                      value={testForm.email}
                      onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
                      className="bg-[#080c14] border-[#1a2744] text-white"
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-[#6b7b9a]">Card BIN</Label>
                    <Select value={testForm.cardBin} onValueChange={(v) => setTestForm({ ...testForm, cardBin: v })}>
                      <SelectTrigger className="bg-[#080c14] border-[#1a2744] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1628] border-[#1a2744]">
                        <SelectItem value="424242" className="text-white">
                          424242 (Visa)
                        </SelectItem>
                        <SelectItem value="555555" className="text-white">
                          555555 (Mastercard)
                        </SelectItem>
                        <SelectItem value="378282" className="text-white">
                          378282 (Amex)
                        </SelectItem>
                        <SelectItem value="411111" className="text-white">
                          411111 (Test Card)
                        </SelectItem>
                        <SelectItem value="400000" className="text-white">
                          400000 (High Risk)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[#6b7b9a]">IP Address</Label>
                    <Input
                      value={testForm.ip}
                      onChange={(e) => setTestForm({ ...testForm, ip: e.target.value })}
                      className="bg-[#080c14] border-[#1a2744] text-white"
                      placeholder="192.168.1.1"
                    />
                  </div>
                </div>

                <Button
                  onClick={runSingleTest}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-bold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>

                {/* Latest Result */}
                {testHistory.length > 0 && (
                  <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7b9a]">Latest Result</span>
                      <Badge
                        className={
                          testHistory[0].decision === "approve"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : testHistory[0].decision === "review"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {testHistory[0].decision.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-[#6b7b9a]">Risk Score</p>
                        <p className="text-xl font-bold font-mono text-white">{testHistory[0].riskScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7b9a]">Fraud Prob</p>
                        <p className="text-xl font-bold font-mono text-white">
                          {(testHistory[0].fraudProbability * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7b9a]">Latency</p>
                        <p className="text-xl font-bold font-mono text-[#00ffc8]">{testHistory[0].processingTime}ms</p>
                      </div>
                    </div>
                    {testHistory[0].features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-[#6b7b9a]">Top Contributing Features</p>
                        {testHistory[0].features.slice(0, 5).map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-white font-mono">{f.feature}</span>
                            <span className={f.impact === "increases_risk" ? "text-red-400" : "text-emerald-400"}>
                              {f.contribution > 0 ? "+" : ""}
                              {f.contribution.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Simulation */}
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#a855f7]" />
                  Live Simulation
                  {isRunning && (
                    <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Running
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-[#6b7b9a]">
                  Simulate continuous transaction flow with real API calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#6b7b9a]">Transactions/sec</span>
                    <span className="font-mono text-white">~1.25</span>
                  </div>
                  <div className="h-2 bg-[#1a2744] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] transition-all ${
                        isRunning ? "animate-pulse" : ""
                      }`}
                      style={{ width: isRunning ? "100%" : "0%" }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 ${
                      isRunning
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                        : "bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 hover:bg-[#a855f7]/30"
                    }`}
                  >
                    {isRunning ? "Stop Simulation" : "Start Live Simulation"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearHistory}
                    className="border-[#1a2744] text-[#6b7b9a] hover:text-white bg-transparent"
                  >
                    Clear
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400">Approved</p>
                    <p className="font-mono text-lg text-white">
                      {liveStats.totalTransactions > 0
                        ? ((liveStats.approvedCount / liveStats.totalTransactions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-400">Review</p>
                    <p className="font-mono text-lg text-white">
                      {liveStats.totalTransactions > 0
                        ? ((liveStats.reviewCount / liveStats.totalTransactions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400">Declined</p>
                    <p className="font-mono text-lg text-white">
                      {liveStats.totalTransactions > 0
                        ? ((liveStats.declinedCount / liveStats.totalTransactions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                {/* Live Feed */}
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {testHistory.slice(0, 10).map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between py-2 px-3 rounded bg-[#080c14] text-xs animate-in slide-in-from-top-1"
                    >
                      <span className="text-[#6b7b9a] font-mono">{txn.timestamp.toLocaleTimeString()}</span>
                      <span className="text-white">{formatAmount(txn.amount)}</span>
                      <span className="text-[#6b7b9a]">{txn.country}</span>
                      <span
                        className={
                          txn.riskScore < 30
                            ? "text-emerald-400"
                            : txn.riskScore < 70
                              ? "text-amber-400"
                              : "text-red-400"
                        }
                      >
                        {txn.riskScore}%
                      </span>
                      <Badge
                        className={`text-[10px] ${
                          txn.decision === "approve"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : txn.decision === "review"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {txn.decision}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#00ffc8]" />
                    Transaction History
                  </CardTitle>
                  <CardDescription className="text-[#6b7b9a]">
                    {testHistory.length} transactions analyzed via real API
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportHistory}
                    disabled={testHistory.length === 0}
                    className="border-[#1a2744] text-[#6b7b9a] hover:text-white bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="border-[#1a2744] text-[#6b7b9a] hover:text-white bg-transparent"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a2744] text-[#6b7b9a]">
                      <th className="text-left py-3 px-2">Time</th>
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-right py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Country</th>
                      <th className="text-right py-3 px-2">Risk</th>
                      <th className="text-center py-3 px-2">Decision</th>
                      <th className="text-right py-3 px-2">Latency</th>
                      <th className="text-left py-3 px-2">Top Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testHistory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-[#6b7b9a]">
                          <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
                          <p>No transactions yet</p>
                          <p className="text-xs mt-1">Run a test or start the simulation</p>
                        </td>
                      </tr>
                    ) : (
                      testHistory.map((txn) => (
                        <tr key={txn.id} className="border-b border-[#1a2744]/50 hover:bg-[#1a2744]/20">
                          <td className="py-3 px-2 text-[#6b7b9a] font-mono text-xs">
                            {txn.timestamp.toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-2 text-[#6b7b9a] font-mono text-xs">{txn.id.slice(0, 12)}...</td>
                          <td className="py-3 px-2 text-right text-white font-mono">{formatAmount(txn.amount)}</td>
                          <td className="py-3 px-2 text-[#6b7b9a]">{txn.country}</td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`font-mono ${
                                txn.riskScore < 30
                                  ? "text-emerald-400"
                                  : txn.riskScore < 70
                                    ? "text-amber-400"
                                    : "text-red-400"
                              }`}
                            >
                              {txn.riskScore}%
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Badge
                              className={
                                txn.decision === "approve"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : txn.decision === "review"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {txn.decision}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right text-[#00ffc8] font-mono">{txn.processingTime}ms</td>
                          <td className="py-3 px-2 text-xs text-[#6b7b9a]">
                            {txn.features
                              .slice(0, 3)
                              .map((f) => f.feature)
                              .join(", ")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#00ffc8]" />
                    Python Training Code
                  </CardTitle>
                  <CardDescription className="text-[#6b7b9a]">
                    Scikit-learn Logistic Regression model training script
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(pythonTrainingCode)}
                  className="border-[#1a2744] text-[#6b7b9a] hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744] overflow-x-auto text-sm">
                <code className="text-[#e4e4e7] font-mono whitespace-pre">{pythonTrainingCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataset">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#00ffc8]" />
                  Kaggle Dataset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#080c14] border border-[#1a2744]">
                  <h4 className="text-white font-medium mb-2">Credit Card Fraud Detection</h4>
                  <p className="text-sm text-[#6b7b9a] mb-4">
                    This dataset contains transactions made by credit cards in September 2013 by European cardholders.
                    It presents transactions that occurred in two days, with 492 frauds out of 284,807 transactions.
                  </p>
                  <a
                    href="https://www.kaggle.com/mlg-ulb/creditcardfraud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00ffc8] hover:underline"
                  >
                    View on Kaggle
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
                    <p className="text-2xl font-bold text-white">284,807</p>
                    <p className="text-xs text-[#6b7b9a]">Total Transactions</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
                    <p className="text-2xl font-bold text-red-400">492</p>
                    <p className="text-xs text-[#6b7b9a]">Fraud Cases (0.17%)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
                    <p className="text-2xl font-bold text-[#00ffc8]">30</p>
                    <p className="text-xs text-[#6b7b9a]">Features (V1-V28 + Time + Amount)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744] text-center">
                    <p className="text-2xl font-bold text-[#a855f7]">PCA</p>
                    <p className="text-xs text-[#6b7b9a]">Principal Components</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white">Feature Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-white font-medium">V1 - V28</p>
                    <p className="text-xs text-[#6b7b9a]">
                      Principal components obtained with PCA transformation. Due to confidentiality issues, the original
                      features are not provided.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-white font-medium">Time</p>
                    <p className="text-xs text-[#6b7b9a]">
                      Number of seconds elapsed between this transaction and the first transaction in the dataset.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-white font-medium">Amount</p>
                    <p className="text-xs text-[#6b7b9a]">
                      Transaction amount. Can be used for cost-sensitive learning.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#080c14] border border-[#1a2744]">
                    <p className="text-white font-medium">Class</p>
                    <p className="text-xs text-[#6b7b9a]">Response variable. 1 = fraud, 0 = legitimate transaction.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
