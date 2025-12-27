"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, Loader2, Sparkles, MessageSquare } from "lucide-react"
import type { SpeechRecognition, SpeechRecognitionEvent } from "types/speech-recognition"

interface VoiceCommandProps {
  onCommand?: (command: string, action: string) => void
}

export function VoiceCommand({ onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Command patterns
  const commandPatterns = [
    {
      pattern: /show.*transaction/i,
      action: "navigate",
      target: "/dashboard/transactions",
      response: "Opening transactions page",
    },
    { pattern: /show.*alert/i, action: "navigate", target: "/dashboard/alerts", response: "Opening alerts page" },
    {
      pattern: /analyze.*risk/i,
      action: "navigate",
      target: "/dashboard/demo",
      response: "Opening live demo for risk analysis",
    },
    { pattern: /show.*report/i, action: "navigate", target: "/dashboard/reports", response: "Opening reports page" },
    {
      pattern: /check.*fraud|audit/i,
      action: "navigate",
      target: "/dashboard/audit-log",
      response: "Opening fraud audit log",
    },
    {
      pattern: /model.*status|ml.*model/i,
      action: "navigate",
      target: "/dashboard/model",
      response: "Opening ML model center",
    },
    {
      pattern: /whale.*alert|whale.*watch/i,
      action: "navigate",
      target: "/dashboard/whale-watcher",
      response: "Opening whale watcher",
    },
    {
      pattern: /api.*status|playground/i,
      action: "navigate",
      target: "/dashboard/playground",
      response: "Opening API playground",
    },
    {
      pattern: /insight|analytic/i,
      action: "navigate",
      target: "/dashboard/insights",
      response: "Opening AI insights",
    },
    {
      pattern: /help/i,
      action: "help",
      response: "You can say: show transactions, check fraud, analyze risk, model status, or whale alerts",
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognitionClass()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex
        const result = event.results[current]
        const text = result[0].transcript

        setTranscript(text)

        if (result.isFinal) {
          processCommand(text)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        setResponse("Sorry, I couldn't hear that. Please try again.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const processCommand = async (text: string) => {
    setIsProcessing(true)

    // Find matching command
    for (const cmd of commandPatterns) {
      if (cmd.pattern.test(text)) {
        setResponse(cmd.response)

        if (cmd.action === "navigate" && cmd.target) {
          setTimeout(() => {
            window.location.href = cmd.target
          }, 1500)
        }

        if (onCommand) {
          onCommand(text, cmd.action)
        }

        // Speak response
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(cmd.response)
          utterance.rate = 1.1
          utterance.pitch = 1
          window.speechSynthesis.speak(utterance)
        }

        setIsProcessing(false)
        return
      }
    }

    // No match found
    setResponse("I didn't understand that. Try saying 'help' for available commands.")
    setIsProcessing(false)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setResponse("Voice recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      setResponse("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return (
    <Card className="bg-[#0a1628] border-[#1a2744]">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleListening}
            className={`h-12 w-12 rounded-full ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] hover:opacity-90"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-[#0a0e1a]" />}
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white">Quick Voice Command</span>
              {isListening && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs animate-pulse">
                  Listening...
                </Badge>
              )}
              {isProcessing && (
                <Badge className="bg-[#00ffc8]/20 text-[#00ffc8] border-[#00ffc8]/30 text-xs">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Processing
                </Badge>
              )}
            </div>

            {transcript && <p className="text-sm text-[#6b7b9a] italic">"{transcript}"</p>}

            {response && (
              <div className="flex items-center gap-2 mt-1">
                <Volume2 className="h-3 w-3 text-[#00ffc8]" />
                <p className="text-sm text-[#00ffc8]">{response}</p>
              </div>
            )}

            {!transcript && !response && !isListening && (
              <p className="text-xs text-[#6b7b9a]">
                Say "help" for commands, or use the AI Assistant (bottom right) for complex questions
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#6b7b9a]" />
            <Sparkles className="h-5 w-5 text-[#a855f7]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
