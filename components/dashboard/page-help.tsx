"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Target,
  Zap,
  CheckCircle2,
  Play,
  BookOpen,
  Sparkles,
} from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

interface PageHelpProps {
  pageName: string
  pageDescription: string
  features: Feature[]
  tips: string[]
  videoUrl?: string
  quickActions?: { label: string; action: () => void }[]
}

const TOUR_STORAGE_KEY = "payguard_completed_tours"

export function PageHelp({ pageName, pageDescription, features, tips, videoUrl, quickActions }: PageHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(true)
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour for this page
    const completedTours = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || "[]")
    const hasCompleted = completedTours.includes(pageName)
    setHasSeenTour(hasCompleted)

    // Show pulse animation for new users
    if (!hasCompleted) {
      setShowPulse(true)
      // Auto-open help after 2 seconds for first-time visitors
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [pageName])

  const completeTour = () => {
    const completedTours = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || "[]")
    if (!completedTours.includes(pageName)) {
      completedTours.push(pageName)
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(completedTours))
    }
    setHasSeenTour(true)
    setShowTour(false)
    setShowPulse(false)
  }

  const resetAllTours = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY)
    setHasSeenTour(false)
    setShowPulse(true)
  }

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className={`h-12 w-12 rounded-full bg-[#1a2744] border border-[#00ffc8]/30 hover:bg-[#00ffc8]/20 shadow-lg transition-all ${
                showPulse ? "animate-pulse ring-2 ring-[#00ffc8]/50" : ""
              }`}
            >
              <HelpCircle className="h-5 w-5 text-[#00ffc8]" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a1628] border-[#1a2744] max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#00ffc8]" />
                {pageName} Guide
                {!hasSeenTour && <Badge className="bg-[#00ffc8]/20 text-[#00ffc8] border-[#00ffc8]/30">New</Badge>}
              </DialogTitle>
              <DialogDescription className="text-[#6b7b9a]">{pageDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Key Features */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#00ffc8]" />
                  Key Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <Card key={idx} className="bg-[#1a2744]/50 border-[#2a3754]">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#00ffc8]/10 flex items-center justify-center flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-white">{feature.title}</h5>
                            <p className="text-xs text-[#6b7b9a] mt-1">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  Pro Tips
                </h4>
                <div className="space-y-2">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#a0aec0]">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              {quickActions && quickActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#00a8ff]" />
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          action.action()
                          setIsOpen(false)
                        }}
                        className="border-[#00ffc8]/30 text-[#00ffc8] hover:bg-[#00ffc8]/10"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Tour Button */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1a2744]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowTour(true)
                    setTourStep(0)
                    setIsOpen(false)
                  }}
                  className="border-[#00ffc8]/30 text-[#00ffc8] hover:bg-[#00ffc8]/10"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Interactive Tour
                </Button>
                {hasSeenTour && (
                  <Button variant="ghost" size="sm" onClick={resetAllTours} className="text-[#6b7b9a] hover:text-white">
                    Reset All Tours
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interactive Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <Card className="bg-[#0a1628] border-[#00ffc8]/30 shadow-[0_0_30px_rgba(0,255,200,0.2)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {features[tourStep]?.icon}
                    {features[tourStep]?.title || "Tour Complete!"}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowTour(false)} className="text-[#6b7b9a]">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={((tourStep + 1) / features.length) * 100} className="h-1 mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-[#a0aec0] text-sm mb-4">
                  {features[tourStep]?.description ||
                    "You've completed the tour! You're now ready to use all features."}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                    disabled={tourStep === 0}
                    className="text-[#6b7b9a]"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <span className="text-xs text-[#6b7b9a]">
                    {tourStep + 1} of {features.length}
                  </span>
                  {tourStep < features.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setTourStep((s) => s + 1)}
                      className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={completeTour}
                      className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

// Page-specific help configurations
export const pageHelpConfigs: Record<string, Omit<PageHelpProps, "quickActions">> = {
  dashboard: {
    pageName: "Dashboard Overview",
    pageDescription: "Your central hub for monitoring fraud detection metrics, recent transactions, and system health.",
    features: [
      {
        title: "Real-time Metrics",
        description:
          "Live stats on transactions processed, fraud blocked, and system performance updated every second.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Security Score",
        description: "AI-calculated score based on rule coverage, model accuracy, and response times.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Recent Transactions",
        description: "Quick view of latest transactions with risk scores and status indicators.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Risk Distribution",
        description: "Visual breakdown of transactions by risk level (Low/Medium/High/Critical).",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "Click on any stat card to drill down into detailed analytics",
      "Use the currency toggle (top right) to switch between USD and INR",
      "The AI Assistant (bottom right) can answer any questions about the dashboard",
      "Press 'R' to refresh all metrics instantly",
    ],
  },
  "audit-log": {
    pageName: "Audit Log",
    pageDescription: "Review and manage transactions flagged by our ML model for manual verification.",
    features: [
      {
        title: "Smart Filtering",
        description: "Filter transactions by risk level, date range, decision status, and amount.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Feature Analysis",
        description: "See which ML features contributed most to each risk score decision.",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Quick Actions",
        description: "Approve, reject, or escalate transactions with one click. Actions are logged.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Export Data",
        description: "Download filtered results as CSV for compliance reporting.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "High risk (>0.7) transactions are automatically blocked but appear here for review",
      "Click 'View Details' to see the full ML feature breakdown",
      "Use keyboard shortcuts: A=Approve, R=Reject, E=Escalate",
      "Export weekly for PCI-DSS compliance documentation",
    ],
  },
  model: {
    pageName: "ML Model Center",
    pageDescription: "Explore and test our fraud detection model trained on real Kaggle data.",
    features: [
      {
        title: "Live Testing",
        description: "Test individual transactions and see real-time risk scores with feature contributions.",
        icon: <Play className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Model Metrics",
        description: "View accuracy (99.2%), precision, recall, and F1 scores from training.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Feature Importance",
        description: "Understand which of the 28 PCA features (V1-V28) matter most for fraud detection.",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Batch Simulation",
        description: "Run continuous transaction simulation to see the model in action.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "V14 is the strongest fraud indicator - negative values suggest fraud",
      "The model was trained on 284,807 transactions with 492 fraud cases",
      "Test with amounts >$2000 to see higher risk scores",
      "Export transaction history as CSV for analysis",
    ],
  },
  "whale-watcher": {
    pageName: "Whale Watcher",
    pageDescription: "Track 1: Real-time cryptocurrency monitoring with whale trade detection.",
    features: [
      {
        title: "TradingView Charts",
        description: "Full interactive charts with RSI, MACD, Bollinger Bands, and 20+ indicators.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Live Prices",
        description: "Real-time prices from Binance WebSocket - updates on every trade.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Whale Alerts",
        description: "Instant notifications when trades exceed your threshold (default $500K).",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Market Overview",
        description: "50+ coins from CoinGecko with 24h change, volume, and market cap.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "Click 'Connect Live' to start the Binance WebSocket connection for real trades",
      "Adjust whale threshold in settings to customize alert sensitivity",
      "Use the coin selector dropdown to switch between any top 20 cryptocurrencies",
      "Enable sound to hear whale alerts even when the tab is in background",
    ],
  },
  "document-vault": {
    pageName: "Document Vault",
    pageDescription: "Track 4: Zero-Knowledge KYC with client-side AES-256 encryption.",
    features: [
      {
        title: "Client-Side Encryption",
        description: "Your documents are encrypted entirely in your browser - we never see your data.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "AES-256-GCM",
        description: "Military-grade encryption with PBKDF2 key derivation (100,000 iterations).",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "PIN Security Check",
        description: "Verifies your PIN against Have I Been Pwned to avoid compromised passwords.",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Secure Export",
        description: "Download encrypted .pgvault files or decrypt back to original format.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "Use a 6+ digit PIN that you haven't used elsewhere",
      "The green shield icon means your PIN is not in any known data breaches",
      "Encrypted files can only be decrypted with the exact same PIN",
      "Store .pgvault backups safely - they contain your encrypted documents",
    ],
  },
  "clarity-guardian": {
    pageName: "Clarity Guardian",
    pageDescription: "Track 5: Payment Confusion Detector using gaze tracking.",
    features: [
      {
        title: "Gaze Tracking",
        description: "Monitors where you look (via mouse) to detect confusion during checkout.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Confusion Detection",
        description: "Triggers help if you stare at a section >5 seconds or revisit >3 times.",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Adaptive Help",
        description: "Context-aware tooltips appear exactly where confusion is detected.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Heatmap Analytics",
        description: "Visual heatmap showing attention distribution across checkout zones.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "Move your mouse over the checkout form to see real-time gaze tracking",
      "Watch the zone cards update as you hover over different sections",
      "Click 'Run Demo' to see a simulated confused user session",
      "All tracking is local - no images or data leave your browser",
    ],
  },
  "api-sentinel": {
    pageName: "API Sentinel",
    pageDescription: "Track 6: API Abuse Detection with real-time traffic monitoring.",
    features: [
      {
        title: "Traffic Monitor",
        description: "Real-time visualization of API requests per second with anomaly detection.",
        icon: <Zap className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Rate Limiting",
        description: "Configurable sliding window rate limits with automatic blocking.",
        icon: <Target className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Client Management",
        description: "View, block, or whitelist API clients based on behavior patterns.",
        icon: <BookOpen className="h-4 w-4 text-[#00ffc8]" />,
      },
      {
        title: "Security Alerts",
        description: "Instant notifications for DDoS attempts, credential stuffing, and scraping.",
        icon: <Sparkles className="h-4 w-4 text-[#00ffc8]" />,
      },
    ],
    tips: [
      "Red alerts indicate immediate threats requiring attention",
      "Click 'Block' on suspicious clients to immediately revoke API access",
      "The graph shows normal (green) vs anomalous (red) traffic patterns",
      "Export logs for security audit compliance",
    ],
  },
}
