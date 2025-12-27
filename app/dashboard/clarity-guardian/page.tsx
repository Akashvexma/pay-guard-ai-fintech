"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Camera,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Shield,
  Activity,
  Target,
  BarChart3,
  Clock,
  MousePointer,
  Play,
  RotateCcw,
  Video,
  VideoOff,
  Sparkles,
} from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

interface GazePoint {
  x: number
  y: number
  timestamp: number
}

interface Zone {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  dwellTime: number
  visits: number
  isConfused: boolean
  helpText: string
}

interface HeatmapCell {
  x: number
  y: number
  intensity: number
}

interface ConfusionEvent {
  zone: string
  timestamp: Date
  type: string
  dwellTime: number
}

export default function ClarityGuardianPage() {
  const { formatAmount, currency } = useCurrency()
  const [isTracking, setIsTracking] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(true)
  const [trackingMode, setTrackingMode] = useState<"webcam" | "mouse">("mouse")
  const [webcamStatus, setWebcamStatus] = useState<"idle" | "requesting" | "active" | "error">("idle")
  const [currentGaze, setCurrentGaze] = useState<{ x: number; y: number } | null>(null)
  const [gazeHistory, setGazeHistory] = useState<GazePoint[]>([])
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([])
  const [confusionEvents, setConfusionEvents] = useState<ConfusionEvent[]>([])
  const [showHelp, setShowHelp] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const [zones, setZones] = useState<Zone[]>([
    {
      id: "price",
      name: "Price Summary",
      x: 20,
      y: 100,
      width: 340,
      height: 160,
      dwellTime: 0,
      visits: 0,
      isConfused: false,
      helpText: "This shows your order total including all items, taxes, and any discounts applied.",
    },
    {
      id: "items",
      name: "Cart Items",
      x: 20,
      y: 280,
      width: 340,
      height: 180,
      dwellTime: 0,
      visits: 0,
      isConfused: false,
      helpText: "Review the items in your cart. Click on any item to modify quantity or remove it.",
    },
    {
      id: "terms",
      name: "Terms & Conditions",
      x: 380,
      y: 100,
      width: 260,
      height: 80,
      dwellTime: 0,
      visits: 0,
      isConfused: false,
      helpText: "By checking this box, you agree to our standard terms of service and privacy policy.",
    },
    {
      id: "payment",
      name: "Payment Method",
      x: 380,
      y: 200,
      width: 260,
      height: 140,
      dwellTime: 0,
      visits: 0,
      isConfused: false,
      helpText: "Select your preferred payment method. All transactions are secured with 256-bit encryption.",
    },
    {
      id: "submit",
      name: "Submit Button",
      x: 380,
      y: 360,
      width: 260,
      height: 70,
      dwellTime: 0,
      visits: 0,
      isConfused: false,
      helpText: "Click here to complete your purchase. You can review your order before final confirmation.",
    },
  ])

  const [sessionStats, setSessionStats] = useState({
    totalDwellTime: 0,
    confusionCount: 0,
    helpTriggered: 0,
    sessionDuration: 0,
    gazePoints: 0,
  })

  const checkoutRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastZoneRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Checkout items
  const checkoutItems = [
    {
      name: "Premium Annual Plan",
      price: currency === "INR" ? 8299 : 99.99,
      originalPrice: currency === "INR" ? 12499 : 149.99,
    },
    {
      name: "Priority Support Add-on",
      price: currency === "INR" ? 1659 : 19.99,
      originalPrice: currency === "INR" ? 2499 : 29.99,
    },
    {
      name: "Advanced Analytics",
      price: currency === "INR" ? 2074 : 24.99,
      originalPrice: currency === "INR" ? 2999 : 35.99,
    },
  ]
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price, 0)
  const tax = Math.round(subtotal * 0.18 * 100) / 100
  const total = subtotal + tax

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isTracking || !checkoutRef.current) return

      const rect = checkoutRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Only track if mouse is within the checkout area
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setCurrentGaze({ x, y })

        // Add to gaze history
        const gazePoint: GazePoint = { x, y, timestamp: Date.now() }
        setGazeHistory((prev) => [...prev.slice(-500), gazePoint])

        // Update session stats
        setSessionStats((prev) => ({ ...prev, gazePoints: prev.gazePoints + 1 }))

        // Update heatmap - aggregate nearby points
        setHeatmapData((prev) => {
          const cellSize = 20
          const cellX = Math.floor(x / cellSize) * cellSize
          const cellY = Math.floor(y / cellSize) * cellSize

          const existing = prev.find((p) => p.x === cellX && p.y === cellY)
          if (existing) {
            return prev.map((p) =>
              p.x === cellX && p.y === cellY ? { ...p, intensity: Math.min(p.intensity + 0.02, 1) } : p,
            )
          }
          return [...prev.slice(-1000), { x: cellX, y: cellY, intensity: 0.1 }]
        })

        // Check which zone the mouse is in and update dwell time
        updateZoneDwell(x, y)
      }
    },
    [isTracking],
  )

  const updateZoneDwell = useCallback((x: number, y: number) => {
    let currentZoneId: string | null = null

    setZones((prev) =>
      prev.map((zone) => {
        const isInZone = x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height

        if (isInZone) {
          currentZoneId = zone.id
          const isNewVisit = lastZoneRef.current !== zone.id
          const newVisits = isNewVisit ? zone.visits + 1 : zone.visits
          const newDwellTime = zone.dwellTime + 50 // 50ms per update

          // Confusion detection: >4 seconds dwell AND >2 revisits
          const isConfused = newDwellTime > 4000 && newVisits > 2

          if (isConfused && !zone.isConfused) {
            // Trigger confusion event
            setConfusionEvents((prev) => [
              ...prev,
              {
                zone: zone.name,
                timestamp: new Date(),
                type: newDwellTime > 6000 ? "Extended hesitation" : "Multiple revisits",
                dwellTime: newDwellTime,
              },
            ])
            setShowHelp(zone.id)
            setSessionStats((prev) => ({
              ...prev,
              confusionCount: prev.confusionCount + 1,
              helpTriggered: prev.helpTriggered + 1,
            }))
          }

          return { ...zone, dwellTime: newDwellTime, visits: newVisits, isConfused }
        }
        return zone
      }),
    )

    lastZoneRef.current = currentZoneId
  }, [])

  // Start webcam
  const startWebcam = async () => {
    setWebcamStatus("requesting")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setWebcamStatus("active")
        setTrackingMode("webcam")
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      setWebcamStatus("error")
      setTrackingMode("mouse")
    }
  }

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setWebcamStatus("idle")
  }

  // Handle consent
  const handleConsent = (accepted: boolean) => {
    setHasConsent(accepted)
    setShowConsentModal(false)
    if (accepted) {
      startWebcam()
    }
  }

  // Toggle tracking
  const toggleTracking = () => {
    if (!isTracking) {
      setIsTracking(true)
      startTimeRef.current = Date.now()
    } else {
      setIsTracking(false)
      setSessionStats((prev) => ({
        ...prev,
        sessionDuration: Math.round((Date.now() - startTimeRef.current) / 1000),
      }))
    }
  }

  const simulateEyeTracking = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setIsTracking(true)
    resetSession()
    startTimeRef.current = Date.now()

    // Simulate a confused user journey
    const journey = [
      { zoneId: "price", duration: 2000, visits: 1 },
      { zoneId: "items", duration: 1500, visits: 1 },
      { zoneId: "price", duration: 2500, visits: 2 },
      { zoneId: "terms", duration: 5500, visits: 3 }, // Confusion trigger
      { zoneId: "payment", duration: 2000, visits: 1 },
      { zoneId: "price", duration: 3500, visits: 4 }, // Another confusion
      { zoneId: "submit", duration: 1500, visits: 1 },
    ]

    let totalDelay = 0
    journey.forEach((step, index) => {
      setTimeout(() => {
        const zone = zones.find((z) => z.id === step.zoneId)
        if (!zone) return

        const centerX = zone.x + zone.width / 2
        const centerY = zone.y + zone.height / 2
        const isConfusedStep = step.visits > 2 || step.duration > 4000

        let elapsed = 0
        const intervalId = setInterval(() => {
          if (elapsed >= step.duration) {
            clearInterval(intervalId)
            if (index === journey.length - 1) {
              setTimeout(() => {
                setIsSimulating(false)
                setIsTracking(false)
                setSessionStats((prev) => ({
                  ...prev,
                  sessionDuration: Math.round((Date.now() - startTimeRef.current) / 1000),
                }))
              }, 500)
            }
            return
          }

          // Add jitter - more for confused states
          const jitter = isConfusedStep ? 40 : 15
          const x = centerX + (Math.random() - 0.5) * jitter * 2
          const y = centerY + (Math.random() - 0.5) * jitter * 2

          setCurrentGaze({ x, y })
          setGazeHistory((prev) => [...prev.slice(-500), { x, y, timestamp: Date.now() }])
          setSessionStats((prev) => ({ ...prev, gazePoints: prev.gazePoints + 1 }))

          // Update heatmap
          const cellSize = 20
          const cellX = Math.floor(x / cellSize) * cellSize
          const cellY = Math.floor(y / cellSize) * cellSize
          setHeatmapData((prev) => {
            const existing = prev.find((p) => p.x === cellX && p.y === cellY)
            if (existing) {
              return prev.map((p) =>
                p.x === cellX && p.y === cellY
                  ? { ...p, intensity: Math.min(p.intensity + (isConfusedStep ? 0.04 : 0.02), 1) }
                  : p,
              )
            }
            return [...prev.slice(-1000), { x: cellX, y: cellY, intensity: isConfusedStep ? 0.3 : 0.15 }]
          })

          // Update zone
          setZones((prev) =>
            prev.map((z) => {
              if (z.id === step.zoneId) {
                const newDwellTime = z.dwellTime + 50
                const isConfused = newDwellTime > 4000 && step.visits > 2

                if (isConfused && !z.isConfused) {
                  setConfusionEvents((e) => [
                    ...e,
                    {
                      zone: z.name,
                      timestamp: new Date(),
                      type: isConfusedStep ? "Extended hesitation + revisits" : "Multiple revisits",
                      dwellTime: newDwellTime,
                    },
                  ])
                  setShowHelp(z.id)
                  setSessionStats((s) => ({
                    ...s,
                    confusionCount: s.confusionCount + 1,
                    helpTriggered: s.helpTriggered + 1,
                  }))
                }

                return { ...z, dwellTime: newDwellTime, visits: step.visits, isConfused }
              }
              return z
            }),
          )

          elapsed += 50
        }, 50)
      }, totalDelay)

      totalDelay += step.duration + 300
    })
  }

  // Reset session
  const resetSession = () => {
    setZones((prev) => prev.map((z) => ({ ...z, dwellTime: 0, visits: 0, isConfused: false })))
    setGazeHistory([])
    setHeatmapData([])
    setConfusionEvents([])
    setShowHelp(null)
    setCurrentGaze(null)
    setSessionStats({ totalDwellTime: 0, confusionCount: 0, helpTriggered: 0, sessionDuration: 0, gazePoints: 0 })
  }

  // Dismiss help
  const dismissHelp = () => setShowHelp(null)

  // Setup mouse tracking listener
  useEffect(() => {
    if (isTracking && trackingMode === "mouse" && !isSimulating) {
      document.addEventListener("mousemove", handleMouseMove)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isTracking, trackingMode, isSimulating, handleMouseMove])

  // Session timer
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setSessionStats((prev) => ({
          ...prev,
          sessionDuration: Math.round((Date.now() - startTimeRef.current) / 1000),
          totalDwellTime: zones.reduce((acc, z) => acc + z.dwellTime, 0),
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTracking, zones])

  // Cleanup
  useEffect(() => {
    return () => {
      stopWebcam()
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#080c14] p-4 lg:p-6">
      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-[#0a1628] border-[#1a2744]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-[#00ffc8]/10">
                  <Eye className="h-6 w-6 text-[#00ffc8]" />
                </div>
                <div>
                  <CardTitle className="text-white">Eye Tracking Consent</CardTitle>
                  <CardDescription className="text-[#6b7b9a]">Privacy-First Assistance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#8b9dc3] text-sm leading-relaxed">
                Clarity Guardian uses eye/gaze tracking to detect when users are confused during checkout and provides
                contextual help. This helps reduce cart abandonment and improve user experience.
              </p>
              <div className="bg-[#0f1a2e] rounded-lg p-4 border border-[#1a2744] space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#00ffc8]">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Guarantees</span>
                </div>
                <ul className="text-xs text-[#6b7b9a] space-y-1 ml-6">
                  <li>• No images or video are stored or transmitted</li>
                  <li>• All processing happens locally in your browser</li>
                  <li>• You can disable tracking at any time</li>
                  <li>• Mouse fallback available if camera denied</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleConsent(true)}
                  className="flex-1 bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Enable with Camera
                </Button>
                <Button
                  onClick={() => handleConsent(false)}
                  variant="outline"
                  className="flex-1 border-[#1a2744] text-[#6b7b9a] hover:bg-[#1a2744]"
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Mouse Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00ffc8]/20 to-[#00a8ff]/20 border border-[#00ffc8]/30">
                <Eye className="h-6 w-6 text-[#00ffc8]" />
              </div>
              Clarity Guardian
            </h1>
            <p className="text-[#6b7b9a] mt-1">Track 5: Payment Confusion Detector - Real-time gaze tracking</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={`${webcamStatus === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : webcamStatus === "error" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-[#1a2744] text-[#6b7b9a] border-[#2a3a5a]"}`}
            >
              {webcamStatus === "active" ? <Video className="h-3 w-3 mr-1" /> : <VideoOff className="h-3 w-3 mr-1" />}
              {trackingMode === "webcam" ? "Webcam" : "Mouse"} Mode
            </Badge>

            {hasConsent && (
              <div className="flex items-center gap-2 bg-[#0a1628] px-3 py-1.5 rounded-lg border border-[#1a2744]">
                <div className={`h-2 w-2 rounded-full ${isTracking ? "bg-[#00ffc8] animate-pulse" : "bg-[#6b7b9a]"}`} />
                <span className="text-sm text-[#6b7b9a]">{isTracking ? "Tracking" : "Paused"}</span>
                <Switch checked={isTracking} onCheckedChange={toggleTracking} disabled={isSimulating} />
              </div>
            )}

            <Button
              onClick={simulateEyeTracking}
              disabled={isSimulating}
              className="bg-gradient-to-r from-[#a855f7] to-[#00a8ff] text-white"
            >
              {isSimulating ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Demo
                </>
              )}
            </Button>

            <Button onClick={resetSession} variant="outline" className="border-[#1a2744] text-[#6b7b9a] bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00ffc8]/20">
                  <Target className="h-5 w-5 text-[#00ffc8]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{sessionStats.gazePoints}</p>
                  <p className="text-xs text-[#6b7b9a]">Gaze Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{sessionStats.confusionCount}</p>
                  <p className="text-xs text-[#6b7b9a]">Confusions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#a855f7]/20">
                  <HelpCircle className="h-5 w-5 text-[#a855f7]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{sessionStats.helpTriggered}</p>
                  <p className="text-xs text-[#6b7b9a]">Help Shown</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00a8ff]/20">
                  <Clock className="h-5 w-5 text-[#00a8ff]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{sessionStats.sessionDuration}s</p>
                  <p className="text-xs text-[#6b7b9a]">Session Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Activity className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{(sessionStats.totalDwellTime / 1000).toFixed(1)}s</p>
                  <p className="text-xs text-[#6b7b9a]">Total Dwell</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="checkout" className="space-y-4">
          <TabsList className="bg-[#0a1628] border border-[#1a2744]">
            <TabsTrigger
              value="checkout"
              className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout Demo
            </TabsTrigger>
            <TabsTrigger
              value="heatmap"
              className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Heatmap Analysis
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Events Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkout">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Checkout Simulation */}
              <Card className="lg:col-span-2 bg-[#0a1628]/80 border-[#1a2744]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#00ffc8]" />
                    Checkout Page (Move mouse here to track)
                  </CardTitle>
                  <CardDescription className="text-[#6b7b9a]">
                    {isTracking
                      ? "Move your mouse over different sections - confusion is detected after 4+ seconds of dwell time with multiple revisits"
                      : "Enable tracking and move your mouse over the checkout to see gaze analysis"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    ref={checkoutRef}
                    className="relative bg-[#0f1a2e] rounded-lg border border-[#1a2744] overflow-hidden"
                    style={{ height: "500px", width: "100%" }}
                  >
                    {/* Zone Overlays */}
                    {zones.map((zone) => (
                      <div
                        key={zone.id}
                        className={`absolute border-2 rounded-lg transition-all duration-300 ${
                          zone.isConfused
                            ? "border-red-500 bg-red-500/10"
                            : currentGaze &&
                                currentGaze.x >= zone.x &&
                                currentGaze.x <= zone.x + zone.width &&
                                currentGaze.y >= zone.y &&
                                currentGaze.y <= zone.y + zone.height
                              ? "border-[#00ffc8] bg-[#00ffc8]/10"
                              : "border-[#1a2744] bg-transparent"
                        }`}
                        style={{
                          left: zone.x,
                          top: zone.y,
                          width: zone.width,
                          height: zone.height,
                        }}
                      >
                        <div className="absolute -top-6 left-0 text-xs text-[#6b7b9a] whitespace-nowrap">
                          {zone.name} ({(zone.dwellTime / 1000).toFixed(1)}s, {zone.visits} visits)
                        </div>

                        {/* Zone Content */}
                        {zone.id === "price" && (
                          <div className="p-4 h-full flex flex-col justify-center">
                            <p className="text-lg font-semibold text-white mb-3">Order Summary</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between text-[#6b7b9a]">
                                <span>Subtotal</span>
                                <span>{formatAmount(subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-[#6b7b9a]">
                                <span>Tax (18%)</span>
                                <span>{formatAmount(tax)}</span>
                              </div>
                              <div className="flex justify-between text-white font-bold border-t border-[#1a2744] pt-2">
                                <span>Total</span>
                                <span className="text-[#00ffc8]">{formatAmount(total)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {zone.id === "items" && (
                          <div className="p-4 h-full overflow-auto">
                            <p className="text-sm font-semibold text-white mb-3">Cart Items</p>
                            <div className="space-y-3">
                              {checkoutItems.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                  <span className="text-[#8b9dc3]">{item.name}</span>
                                  <div className="text-right">
                                    <span className="text-white">{formatAmount(item.price)}</span>
                                    <span className="text-[#6b7b9a] line-through ml-2 text-xs">
                                      {formatAmount(item.originalPrice)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {zone.id === "terms" && (
                          <div className="p-4 h-full flex items-center">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input type="checkbox" className="mt-1 accent-[#00ffc8]" />
                              <span className="text-xs text-[#6b7b9a]">
                                I agree to the Terms of Service and Privacy Policy
                              </span>
                            </label>
                          </div>
                        )}

                        {zone.id === "payment" && (
                          <div className="p-4 h-full">
                            <p className="text-sm font-semibold text-white mb-3">Payment Method</p>
                            <div className="space-y-2">
                              {["Credit Card", "PayPal", "Apple Pay"].map((method, i) => (
                                <label
                                  key={i}
                                  className="flex items-center gap-3 p-2 rounded-lg bg-[#080c14] border border-[#1a2744] cursor-pointer hover:border-[#00ffc8]/50 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name="payment"
                                    className="accent-[#00ffc8]"
                                    defaultChecked={i === 0}
                                  />
                                  <CreditCard className="h-4 w-4 text-[#6b7b9a]" />
                                  <span className="text-sm text-[#8b9dc3]">{method}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {zone.id === "submit" && (
                          <div className="p-4 h-full flex items-center justify-center">
                            <Button className="w-full bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-semibold py-6">
                              <Shield className="h-5 w-5 mr-2" />
                              Complete Purchase - {formatAmount(total)}
                            </Button>
                          </div>
                        )}

                        {/* Help Popup */}
                        {showHelp === zone.id && (
                          <div className="absolute inset-0 bg-[#0a1628]/95 flex items-center justify-center p-4 z-10 rounded-lg animate-in fade-in duration-300">
                            <div className="text-center space-y-3">
                              <div className="inline-flex p-3 rounded-full bg-[#00ffc8]/20 mb-2">
                                <Sparkles className="h-6 w-6 text-[#00ffc8]" />
                              </div>
                              <p className="text-sm text-white font-medium">Need Help?</p>
                              <p className="text-xs text-[#8b9dc3] leading-relaxed">{zone.helpText}</p>
                              <Button
                                size="sm"
                                onClick={dismissHelp}
                                className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Got it
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Gaze Cursor */}
                    {currentGaze && isTracking && (
                      <div
                        className="absolute pointer-events-none z-20 transition-all duration-75"
                        style={{
                          left: currentGaze.x - 12,
                          top: currentGaze.y - 12,
                        }}
                      >
                        <div className="w-6 h-6 rounded-full border-2 border-[#00ffc8] bg-[#00ffc8]/20 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#00ffc8]" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Zone Analysis */}
              <Card className="bg-[#0a1628]/80 border-[#1a2744]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#00a8ff]" />
                    Zone Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {zones.map((zone) => (
                    <div key={zone.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#8b9dc3]">{zone.name}</span>
                        {zone.isConfused && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Confused</Badge>
                        )}
                      </div>
                      <Progress value={Math.min((zone.dwellTime / 6000) * 100, 100)} className="h-2 bg-[#1a2744]" />
                      <div className="flex justify-between text-xs text-[#6b7b9a]">
                        <span>{(zone.dwellTime / 1000).toFixed(1)}s dwell</span>
                        <span>{zone.visits} visits</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white">Gaze Heatmap</CardTitle>
                <CardDescription className="text-[#6b7b9a]">
                  Visual representation of where users are looking - brighter areas indicate more attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-[#0f1a2e] rounded-lg border border-[#1a2744]" style={{ height: "500px" }}>
                  {/* Heatmap Visualization */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {heatmapData.map((cell, i) => (
                      <rect
                        key={i}
                        x={cell.x}
                        y={cell.y}
                        width={20}
                        height={20}
                        fill={`rgba(0, 255, 200, ${cell.intensity * 0.6})`}
                        className="transition-opacity duration-300"
                      />
                    ))}
                  </svg>

                  {/* Zone outlines */}
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="absolute border border-[#1a2744] rounded"
                      style={{
                        left: zone.x,
                        top: zone.y,
                        width: zone.width,
                        height: zone.height,
                      }}
                    >
                      <span className="absolute -top-5 left-0 text-xs text-[#6b7b9a]">{zone.name}</span>
                    </div>
                  ))}

                  {heatmapData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[#6b7b9a]">No heatmap data yet. Start tracking or run the demo.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Confusion Events Log
                </CardTitle>
                <CardDescription className="text-[#6b7b9a]">
                  Timeline of detected user confusion moments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {confusionEvents.length === 0 ? (
                  <p className="text-center text-[#6b7b9a] py-8">No confusion events detected yet</p>
                ) : (
                  <div className="space-y-3">
                    {confusionEvents.map((event, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-[#0f1a2e] rounded-lg border border-[#1a2744]"
                      >
                        <div className="p-2 rounded-full bg-red-500/20">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium">{event.zone}</p>
                            <span className="text-xs text-[#6b7b9a]">{event.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-[#6b7b9a] mt-1">{event.type}</p>
                          <p className="text-xs text-[#6b7b9a] mt-1">
                            Dwell time: {(event.dwellTime / 1000).toFixed(1)}s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hidden webcam video */}
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      </div>
    </div>
  )
}
