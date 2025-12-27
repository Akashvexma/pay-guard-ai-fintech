"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mic,
  MicOff,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Loader2,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Navigation,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import type { SpeechRecognition, SpeechRecognitionEvent } from "types/speech-recognition" // Import SpeechRecognition and SpeechRecognitionEvent

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: { type: "navigate"; path: string }
}

// Comprehensive knowledge base for PayGuard AI
const knowledgeBase: Record<string, { response: string; path?: string; keywords: string[] }> = {
  // Navigation commands
  dashboard: {
    response:
      "Taking you to the main dashboard where you can see an overview of all fraud detection metrics, recent transactions, and security status.",
    path: "/dashboard",
    keywords: ["home", "main", "overview", "start", "dashboard"],
  },
  audit: {
    response:
      "Opening the Audit Log - this is where you can review all transactions flagged by our AI for manual verification. You can filter by risk level, date, and decision status.",
    path: "/dashboard/audit-log",
    keywords: ["audit", "log", "flagged", "review", "manual", "verification"],
  },
  transactions: {
    response:
      "Opening Transactions page - view all processed payments with their risk scores, amounts, and real-time status. You can search, filter, and export transaction data.",
    path: "/dashboard/transactions",
    keywords: ["transaction", "payment", "history", "processed"],
  },
  alerts: {
    response:
      "Opening Alerts page - monitor real-time fraud alerts, security notifications, and system warnings. Each alert shows severity, timestamp, and recommended actions.",
    path: "/dashboard/alerts",
    keywords: ["alert", "notification", "warning", "security"],
  },
  model: {
    response:
      "Opening ML Model Center - explore our Logistic Regression model trained on 284,807 transactions from the Kaggle Credit Card Fraud dataset. Test transactions, view feature importance, and analyze model performance.",
    path: "/dashboard/model",
    keywords: ["model", "ml", "machine learning", "ai", "training", "kaggle"],
  },
  whale: {
    response:
      "Opening Whale Watcher - Track 1 implementation for real-time cryptocurrency monitoring. View live TradingView charts, detect whale trades over $500K, and monitor 50+ coins with CoinGecko data.",
    path: "/dashboard/whale-watcher",
    keywords: ["whale", "crypto", "bitcoin", "trading", "chart", "coinbase", "binance"],
  },
  vault: {
    response:
      "Opening Document Vault - Track 4 Zero-Knowledge KYC implementation. Encrypt documents with AES-256-GCM entirely in your browser. Your PIN never leaves your device.",
    path: "/dashboard/document-vault",
    keywords: ["vault", "document", "kyc", "encrypt", "secure", "privacy"],
  },
  clarity: {
    response:
      "Opening Clarity Guardian - Track 5 Payment Confusion Detector. Uses eye tracking and mouse movement analysis to detect user confusion during checkout and provide contextual help.",
    path: "/dashboard/clarity-guardian",
    keywords: ["clarity", "eye", "tracking", "confusion", "checkout", "help"],
  },
  sentinel: {
    response:
      "Opening API Sentinel - Track 6 API Abuse Detection. Monitor request rates, detect anomalies, manage rate limiting, and block suspicious clients automatically.",
    path: "/dashboard/api-sentinel",
    keywords: ["sentinel", "api", "abuse", "rate", "limit", "security"],
  },
  insights: {
    response:
      "Opening AI Insights - Advanced analytics with behavioral biometrics, fraud ring detection, revenue impact analysis, and ML explainability features.",
    path: "/dashboard/insights",
    keywords: ["insight", "analytics", "behavioral", "fraud ring", "biometric"],
  },
  analytics: {
    response:
      "Opening Analytics dashboard - View threat maps, compliance status, network visualizations, and comprehensive fraud pattern analysis.",
    path: "/dashboard/analytics",
    keywords: ["analytics", "threat", "compliance", "pattern"],
  },
  rules: {
    response:
      "Opening Rules page - Create and manage custom fraud detection rules. Define conditions, set thresholds, and automate actions for specific patterns.",
    path: "/dashboard/rules",
    keywords: ["rule", "custom", "condition", "threshold"],
  },
  settings: {
    response: "Opening Settings - Configure your account, notification preferences, API keys, and security options.",
    path: "/dashboard/settings",
    keywords: ["setting", "config", "preference", "account"],
  },
  reports: {
    response:
      "Opening Reports - Generate and download comprehensive fraud reports, transaction summaries, and compliance documentation.",
    path: "/dashboard/reports",
    keywords: ["report", "download", "export", "summary"],
  },
  playground: {
    response:
      "Opening API Playground - Test the /api/analyze-risk endpoint with custom transactions and see real-time risk scores, feature contributions, and decision explanations.",
    path: "/dashboard/playground",
    keywords: ["playground", "test", "api", "try"],
  },
  demo: {
    response:
      "Opening Live Demo - Experience fraud detection in action with interactive scenarios. Test different transaction types and see how the ML model responds.",
    path: "/dashboard/demo",
    keywords: ["demo", "live", "interactive", "scenario"],
  },
  team: {
    response:
      "Opening Team page - Meet the developers: Akash Verma (Full Stack Lead), Aditya Geete (ML Engineer), and Neev Modi (Frontend Architect).",
    path: "/team",
    keywords: ["team", "developer", "akash", "aditya", "neev", "about"],
  },

  // Feature explanations
  fraud_detection: {
    response:
      "PayGuard AI uses a Logistic Regression model trained on the Kaggle Credit Card Fraud dataset (284,807 transactions, 492 fraud cases). The model analyzes 28 PCA-transformed features (V1-V28) plus Amount and Time. Key indicators: V14 (negative = fraud), V10, V12, V17. Transactions are scored 0-1: above 0.7 = BLOCK, 0.4-0.7 = REVIEW, below 0.4 = APPROVE. Average latency: 23ms.",
    keywords: ["how", "fraud", "detection", "work", "algorithm", "score"],
  },
  track3: {
    response:
      "Track 3 'The Merchant Shield' is our core Fraud Detection API. Components: 1) ML Model - Logistic Regression on Kaggle data with 99.2% accuracy, 2) REST API - /api/analyze-risk endpoint returning JSON risk assessments, 3) Admin Audit Log - Dashboard for reviewing flagged transactions with approve/reject/escalate actions.",
    keywords: ["track 3", "merchant", "shield", "api"],
  },
  track1: {
    response:
      "Track 1 'Whale Watcher' monitors cryptocurrency markets in real-time. Features: Live TradingView charts with RSI/MACD/Bollinger Bands, CoinGecko API for 50+ coin prices, whale trade detection (>$500K), liquidation heatmaps, and buy/sell signals based on technical analysis.",
    keywords: ["track 1", "whale", "watcher", "crypto"],
  },
  track4: {
    response:
      "Track 4 'Zero-Knowledge KYC' encrypts documents entirely in your browser. Technology: Web Crypto API, PBKDF2 key derivation (100,000 iterations), AES-256-GCM encryption. Your PIN never leaves your device - only encrypted data is stored. Also checks if your PIN was compromised via Have I Been Pwned API.",
    keywords: ["track 4", "zero knowledge", "kyc", "encryption"],
  },
  track5: {
    response:
      "Track 5 'Clarity Guardian' is a Payment Confusion Detector. It uses webcam-based eye tracking (or mouse fallback) to monitor where users look during checkout. If they stare at a section >5 seconds or revisit >3 times, it detects confusion and shows contextual help. All processing is local - no images stored.",
    keywords: ["track 5", "clarity", "guardian", "eye tracking"],
  },
  track6: {
    response:
      "Track 6 'API Sentinel' detects API abuse patterns. Features: Real-time traffic monitoring, sliding window rate limiting, anomaly detection for unusual patterns, authentication failure tracking, and automatic client blocking. Protects against DDoS, credential stuffing, and scraping attacks.",
    keywords: ["track 6", "api", "sentinel", "abuse", "rate limit"],
  },

  // General help
  help: {
    response:
      "I'm PayGuard AI Assistant! I can help you: 1) Navigate - say 'show me audit log' or 'open whale watcher', 2) Explain features - ask 'how does fraud detection work?' or 'what is Track 3?', 3) Get help - say 'explain the ML model' or 'what currencies are supported?'. Try voice commands with the microphone button!",
    keywords: ["help", "assist", "what can you", "command"],
  },
  currency: {
    response:
      "PayGuard AI supports both USD ($) and INR (₹) currencies. Use the currency toggle in the top navigation bar to switch. All monetary values throughout the dashboard will update automatically, including transaction amounts, fraud savings, and ROI calculations.",
    keywords: ["currency", "usd", "inr", "rupee", "dollar", "money"],
  },
}

// Find best matching response
function findBestMatch(query: string): { response: string; path?: string } {
  const lowerQuery = query.toLowerCase().trim()

  // Check for direct keyword matches
  for (const [key, value] of Object.entries(knowledgeBase)) {
    for (const keyword of value.keywords) {
      if (lowerQuery.includes(keyword)) {
        return { response: value.response, path: value.path }
      }
    }
  }

  // Check for navigation intent
  const navPatterns = ["go to", "open", "show", "navigate", "take me", "visit"]
  const hasNavIntent = navPatterns.some((p) => lowerQuery.includes(p))

  if (hasNavIntent) {
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (value.path && value.keywords.some((k) => lowerQuery.includes(k))) {
        return { response: value.response, path: value.path }
      }
    }
  }

  // Check for question intent
  const questionPatterns = ["what", "how", "explain", "tell me", "describe", "why"]
  const hasQuestionIntent = questionPatterns.some((p) => lowerQuery.includes(p))

  if (hasQuestionIntent) {
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (!value.path && value.keywords.some((k) => lowerQuery.includes(k))) {
        return { response: value.response }
      }
    }
  }

  // Default response
  return {
    response:
      "I'm here to help! Try asking: 'Show me the audit log', 'How does fraud detection work?', 'What is Track 3?', or 'Open whale watcher'. You can also use voice commands by clicking the microphone button. Type 'help' for more options.",
  }
}

export function GlobalAIAssistant() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm PayGuard AI Assistant. I can navigate you anywhere in the dashboard, explain features, or answer questions about fraud detection. Try saying 'Show me the audit log' or 'How does the ML model work?'",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex
          const result = event.results[current]
          const text = result[0].transcript
          setInputValue(text)
          if (result.isFinal) {
            handleSend(text)
          }
        }

        recognition.onend = () => setIsListening(false)
        recognition.onerror = () => setIsListening(false)

        recognitionRef.current = recognition
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || inputValue
      if (!messageText.trim() || isProcessing) return

      const userMessage: Message = {
        role: "user",
        content: messageText,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsProcessing(true)

      // Simulate brief thinking time
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 300))

      const match = findBestMatch(messageText)

      const assistantMessage: Message = {
        role: "assistant",
        content: match.response,
        timestamp: new Date(),
        action: match.path ? { type: "navigate", path: match.path } : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Navigate if path specified
      if (match.path && match.path !== pathname) {
        setTimeout(() => router.push(match.path!), 500)
      }

      // Speak response if enabled
      if (isSpeaking && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(match.response)
        utterance.rate = 1.1
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      }

      setIsProcessing(false)
    },
    [inputValue, isProcessing, isSpeaking, pathname, router],
  )

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setInputValue("")
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (e) {
        console.error("Speech recognition error:", e)
      }
    }
  }

  // Quick actions
  const quickActions = [
    { label: "Audit Log", path: "/dashboard/audit-log", icon: "📋" },
    { label: "Whale Watcher", path: "/dashboard/whale-watcher", icon: "🐋" },
    { label: "ML Model", path: "/dashboard/model", icon: "🧠" },
    { label: "Help", path: null, icon: "❓" },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] hover:opacity-90 shadow-[0_0_30px_rgba(0,255,200,0.4)] z-50 pulse-glow"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6 text-[#0a0e1a]" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed z-50 bg-[#0a1628]/95 backdrop-blur-xl border-[#00ffc8]/30 shadow-[0_0_40px_rgba(0,255,200,0.2)] transition-all duration-300 ${
        isMinimized ? "bottom-6 right-6 w-80 h-14" : "bottom-6 right-6 w-96 h-[520px] md:w-[420px] md:h-[560px]"
      }`}
    >
      <CardHeader className="p-3 border-b border-[#1a2744] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] flex items-center justify-center">
            <Bot className="h-4 w-4 text-[#0a0e1a]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">PayGuard AI</h3>
            {!isMinimized && <p className="text-xs text-[#6b7b9a]">Voice + Text Assistant</p>}
          </div>
          <Badge className="bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30 text-xs ml-1">Online</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
            onClick={() => setIsSpeaking(!isSpeaking)}
            title={isSpeaking ? "Mute voice" : "Enable voice"}
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#6b7b9a] hover:text-red-400 hover:bg-[#1a2744]"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-60px)]">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-[#a855f7]/20" : "bg-gradient-to-r from-[#00ffc8]/20 to-[#00a8ff]/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-[#a855f7]" />
                    ) : (
                      <Bot className="h-4 w-4 text-[#00ffc8]" />
                    )}
                  </div>
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[80%] ${
                      msg.role === "user" ? "bg-[#a855f7]/20 text-white" : "bg-[#1a2744] text-[#e0e6f0]"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.action?.path && (
                      <div className="mt-2 flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-[#00ffc8]" />
                        <span className="text-xs text-[#00ffc8]">Navigating to {msg.action.path}</span>
                      </div>
                    )}
                    <p className="text-xs text-[#6b7b9a] mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#00ffc8]/20 to-[#00a8ff]/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-[#00ffc8]" />
                  </div>
                  <div className="bg-[#1a2744] rounded-xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-[#00ffc8]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-[#1a2744] flex flex-wrap gap-1">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-[#0a0e1a] border-[#1a2744] text-[#6b7b9a] hover:text-[#00ffc8] hover:border-[#00ffc8]/50"
                onClick={() => {
                  if (action.path) {
                    router.push(action.path)
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "assistant",
                        content: `Navigating to ${action.label}...`,
                        timestamp: new Date(),
                        action: { type: "navigate", path: action.path },
                      },
                    ])
                  } else {
                    handleSend("help")
                  }
                }}
              >
                <span className="mr-1">{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1a2744]">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`flex-shrink-0 border-[#1a2744] ${
                  isListening
                    ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                    : "text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
                }`}
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className="flex-1 bg-[#0a0e1a] border-[#1a2744] text-white placeholder:text-[#6b7b9a] focus:border-[#00ffc8]/50"
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
