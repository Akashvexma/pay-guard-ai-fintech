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
  ChevronRight,
  Brain,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: { type: "navigate"; path: string }
}

const KNOWLEDGE_BASE = {
  navigation: {
    "audit log": { path: "/dashboard/audit-log", desc: "Review transactions flagged as suspicious by the AI" },
    audit: { path: "/dashboard/audit-log", desc: "Review transactions flagged as suspicious by the AI" },
    flagged: { path: "/dashboard/audit-log", desc: "View flagged transactions in the Audit Log" },
    model: { path: "/dashboard/model", desc: "Test the ML model and view performance metrics" },
    "ml model": { path: "/dashboard/model", desc: "Access the ML Model Center for testing and retraining" },
    train: { path: "/dashboard/model", desc: "Retrain the fraud detection model" },
    whale: { path: "/dashboard/whale-watcher", desc: "Monitor real-time crypto whale trades from Binance" },
    crypto: { path: "/dashboard/whale-watcher", desc: "Track cryptocurrency whale movements" },
    bitcoin: { path: "/dashboard/whale-watcher", desc: "Watch Bitcoin and other crypto trading activity" },
    document: { path: "/dashboard/document-vault", desc: "Securely encrypt and store sensitive documents" },
    vault: { path: "/dashboard/document-vault", desc: "Access the encrypted Document Vault" },
    encrypt: { path: "/dashboard/document-vault", desc: "Encrypt files with AES-256 encryption" },
    kyc: { path: "/dashboard/document-vault", desc: "Manage KYC documents securely" },
    clarity: { path: "/dashboard/clarity-guardian", desc: "Analyze user attention with gaze tracking" },
    eye: { path: "/dashboard/clarity-guardian", desc: "Eye/mouse tracking for UX optimization" },
    gaze: { path: "/dashboard/clarity-guardian", desc: "Track where users look on checkout pages" },
    privacy: { path: "/dashboard/clarity-guardian", desc: "Privacy mode activates when you look away" },
    sentinel: { path: "/dashboard/api-sentinel", desc: "Monitor API usage and detect abuse patterns" },
    api: { path: "/dashboard/api-sentinel", desc: "API abuse detection and rate limiting" },
    abuse: { path: "/dashboard/api-sentinel", desc: "Detect and block API abuse" },
    transaction: { path: "/dashboard/transactions", desc: "View all processed transactions" },
    analytics: { path: "/dashboard/analytics", desc: "Charts, metrics, and business intelligence" },
    chart: { path: "/dashboard/analytics", desc: "View analytics and performance charts" },
    setting: { path: "/dashboard/settings", desc: "Configure your account and preferences" },
    report: { path: "/dashboard/reports", desc: "Generate compliance and audit reports" },
    compliance: { path: "/dashboard/reports", desc: "Access compliance documentation" },
    integration: { path: "/dashboard/integration", desc: "API integration guides and SDK documentation" },
    sdk: { path: "/dashboard/integration", desc: "Get integration code snippets" },
    playground: { path: "/dashboard/playground", desc: "Test API endpoints interactively" },
    test: { path: "/dashboard/playground", desc: "Try the API in the playground" },
    insight: { path: "/dashboard/insights", desc: "AI-powered fraud insights and predictions" },
    demo: { path: "/dashboard/demo", desc: "See a live demonstration of fraud detection" },
    team: { path: "/team", desc: "Meet the team behind PayGuard AI" },
    dashboard: { path: "/dashboard", desc: "Main dashboard overview" },
    home: { path: "/dashboard", desc: "Return to the main dashboard" },
    alert: { path: "/dashboard/alerts", desc: "View and manage fraud alerts" },
    rule: { path: "/dashboard/rules", desc: "Configure fraud detection rules" },
    list: { path: "/dashboard/lists", desc: "Manage whitelist and blacklist" },
  },
  explanations: {
    fraud: `PayGuard uses a Logistic Regression ML model trained on 284,807 real transactions from the Kaggle Credit Card Fraud Detection dataset. The model analyzes 30 features including PCA-transformed components (V1-V28), transaction amount, and time. It achieves 99.2% accuracy with <50ms latency.`,
    "ml model": `Our ML model is a Logistic Regression classifier trained on the Kaggle fraud dataset. Key features: V14, V10, V12, V4 have highest importance. Risk scores: >0.7 = BLOCKED, 0.4-0.7 = REVIEW, <0.4 = APPROVED. You can test transactions and retrain the model in the ML Model Center.`,
    accuracy: `The model achieves 99.2% accuracy, 95% precision, 87% recall, and 0.98 AUC-ROC on the test set. It processes transactions in ~45ms average latency.`,
    "track 3": `Track 3 is "The Merchant Shield" - a Fraud Detection API that uses a trained ML model to analyze transactions and return risk scores. It includes the /api/analyze-risk endpoint and an admin audit log for reviewing flagged transactions.`,
    "track 1": `Track 1 is "Whale Watcher" - real-time detection of large cryptocurrency trades. We connect to Binance WebSocket for live BTC/ETH trades and alert on transactions >$500K.`,
    "track 4": `Track 4 is "Zero-Knowledge KYC" - client-side document encryption using AES-256-GCM and PBKDF2 key derivation. Documents never leave your device unencrypted.`,
    "track 5": `Track 5 is "Clarity Guardian" - payment confusion detection using gaze/mouse tracking. It identifies when users hesitate on checkout and offers contextual help. Privacy mode blurs sensitive data when you look away.`,
    "track 6": `Track 6 is "API Sentinel" - API abuse detection that monitors request patterns, rate limits, and detects anomalies like credential stuffing or DDoS attacks.`,
    finnothon: `This project was built for Finnothon 2025, implementing Track 3 (Fraud Detection API) as the primary focus, plus features from Tracks 1, 4, 5, and 6.`,
    endpoint: `The main API endpoint is POST /api/analyze-risk. Send a JSON body with transaction details (amount, card_number, merchant_category, etc.) and receive a risk assessment with fraud probability, decision, and contributing factors.`,
    retrain: `You can retrain the ML model in the Model Center. The simulation generates training data based on the Kaggle dataset distribution, then runs through preprocessing, scaling, train/test split, and model fitting stages.`,
    privacy: `Clarity Guardian has a Privacy Mode that automatically blurs sensitive information (prices, card numbers) when your gaze leaves the screen. Configure the delay in settings.`,
  },
}

function getSmartResponse(query: string): { response: string; path?: string } {
  const lowerQuery = query.toLowerCase()

  // Check for navigation intent
  const navKeywords = [
    "show",
    "go to",
    "open",
    "take me",
    "navigate",
    "where is",
    "find",
    "access",
    "view",
    "see",
    "visit",
  ]
  const isNavigation = navKeywords.some((kw) => lowerQuery.includes(kw))

  // Search navigation paths
  for (const [keyword, data] of Object.entries(KNOWLEDGE_BASE.navigation)) {
    if (lowerQuery.includes(keyword)) {
      return {
        response: isNavigation
          ? `Taking you to ${data.path}. ${data.desc}`
          : `The ${keyword} feature is at ${data.path}. ${data.desc}. Would you like me to take you there?`,
        path: isNavigation ? data.path : undefined,
      }
    }
  }

  // Search explanations
  for (const [topic, explanation] of Object.entries(KNOWLEDGE_BASE.explanations)) {
    if (lowerQuery.includes(topic)) {
      return { response: explanation }
    }
  }

  // Greeting responses
  if (lowerQuery.match(/^(hi|hello|hey|help|what can you do)/)) {
    return {
      response: `Hello! I'm PayGuard AI Assistant. I can help you:

• Navigate anywhere - "Show me the audit log" or "Go to whale watcher"
• Explain features - "How does fraud detection work?" or "What is Track 3?"
• Answer questions - "What's the model accuracy?" or "How do I retrain?"

Try asking me something!`,
    }
  }

  // Specific question patterns
  if (lowerQuery.includes("how") && lowerQuery.includes("work")) {
    return {
      response: KNOWLEDGE_BASE.explanations.fraud,
    }
  }

  if (lowerQuery.includes("what") && lowerQuery.includes("do")) {
    return {
      response: `PayGuard AI is a fraud detection platform with: ML-powered transaction scoring, real-time whale trade monitoring, encrypted document storage, UX attention tracking, and API abuse detection. Ask me about any specific feature!`,
    }
  }

  // Default response
  return {
    response: `I understand you're asking about "${query}". I can help you navigate the dashboard or explain features. Try asking:
• "Show me the ML model" - to test fraud detection
• "How does fraud detection work?" - for technical details
• "Go to audit log" - to review flagged transactions`,
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
        "Hello! I'm PayGuard AI Assistant. I can navigate you anywhere, explain features, or answer questions about fraud detection. Try 'Show me the audit log' or 'How does the ML model work?'",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
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

      // Small delay to show processing state
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Use smart local knowledge base
      const smartResponse = getSmartResponse(messageText)
      const response = smartResponse.response
      const navigatePath = smartResponse.path

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
        action: navigatePath ? { type: "navigate", path: navigatePath } : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Navigate if path specified
      if (navigatePath && navigatePath !== pathname) {
        setTimeout(() => router.push(navigatePath!), 1000)
      }

      // Speak response if enabled
      if (isSpeaking && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(response)
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

  // Quick navigation actions
  const quickActions = [
    { label: "Audit Log", path: "/dashboard/audit-log" },
    { label: "ML Model", path: "/dashboard/model" },
    { label: "Whale Watcher", path: "/dashboard/whale-watcher" },
    { label: "Transactions", path: "/dashboard/transactions" },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 z-50 transition-all hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <Brain className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed z-50 bg-slate-900/95 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transition-all duration-300 ${
        isMinimized ? "bottom-6 right-6 w-80 h-14" : "bottom-6 right-6 w-96 h-[520px] md:w-[420px] md:h-[560px]"
      }`}
    >
      <CardHeader className="p-3 border-b border-slate-700/50 flex flex-row items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              PayGuard AI
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            </h3>
            {!isMinimized && <p className="text-xs text-slate-400">Your Intelligent Assistant</p>}
          </div>
          <Badge className="text-xs ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Smart Mode</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700/50"
            onClick={() => setIsSpeaking(!isSpeaking)}
            title={isSpeaking ? "Mute voice" : "Enable voice"}
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700/50"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
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
                      msg.role === "user"
                        ? "bg-purple-500/20 border border-purple-500/30"
                        : "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-purple-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-cyan-400" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/20"
                        : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.action?.path && (
                      <div className="mt-2 flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 rounded-lg px-2 py-1">
                        <Navigation className="h-3 w-3" />
                        <span className="text-xs font-medium">Navigating to {msg.action.path}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      <span className="text-xs text-slate-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Navigation */}
          <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30">
            <p className="text-xs text-slate-500 mb-2 font-medium">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => {
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
                  }}
                  className="text-xs border-slate-600 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 h-7 transition-colors"
                >
                  {action.label}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`h-10 w-10 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse ring-2 ring-red-500/50"
                    : "bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600"
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50 rounded-xl"
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isProcessing}
                className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50"
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
