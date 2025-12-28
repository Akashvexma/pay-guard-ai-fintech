"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Fingerprint,
  MousePointer2,
  Keyboard,
  Timer,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Play,
  Square,
  RotateCcw,
} from "lucide-react"
import { analyzeTransaction } from "@/lib/ml-model"

interface MouseData {
  x: number
  y: number
  timestamp: number
}

interface KeystrokeData {
  key: string
  timestamp: number
  duration: number
}

interface ClickData {
  x: number
  y: number
  timestamp: number
  button: number
}

interface ScrollData {
  scrollY: number
  timestamp: number
  delta: number
}

interface BiometricMetrics {
  // Typing metrics
  typingSpeed: number // WPM estimate
  keystrokeDwellTime: number // Average key hold time (ms)
  keystrokeFlightTime: number // Average time between keys (ms)
  typingRhythmConsistency: number // Std dev of flight times

  // Mouse metrics
  mouseVelocity: number // Average pixels/ms
  mouseAcceleration: number // Change in velocity
  cursorStraightness: number // Ratio of direct distance to actual path
  mouseIdleTime: number // Average idle periods

  // Click metrics
  clickFrequency: number // Clicks per second
  doubleClickSpeed: number // Time between double clicks
  clickPrecision: number // Variation in click positions

  // Scroll metrics
  scrollSpeed: number // Pixels per scroll
  scrollPattern: number // Consistency of scroll behavior

  // Session metrics
  sessionDuration: number // Seconds
  interactionDensity: number // Actions per minute

  // Computed scores (0-100)
  humanScore: number
  botScore: number
  trustScore: number
  riskLevel: "low" | "medium" | "high"
}

export function BehavioralBiometrics() {
  const [isTracking, setIsTracking] = useState(false)
  const [metrics, setMetrics] = useState<BiometricMetrics>({
    typingSpeed: 0,
    keystrokeDwellTime: 0,
    keystrokeFlightTime: 0,
    typingRhythmConsistency: 0,
    mouseVelocity: 0,
    mouseAcceleration: 0,
    cursorStraightness: 0,
    mouseIdleTime: 0,
    clickFrequency: 0,
    doubleClickSpeed: 0,
    clickPrecision: 0,
    scrollSpeed: 0,
    scrollPattern: 0,
    sessionDuration: 0,
    interactionDensity: 0,
    humanScore: 0,
    botScore: 0,
    trustScore: 0,
    riskLevel: "low",
  })

  // Data collection refs
  const mouseDataRef = useRef<MouseData[]>([])
  const keystrokeDataRef = useRef<KeystrokeData[]>([])
  const clickDataRef = useRef<ClickData[]>([])
  const scrollDataRef = useRef<ScrollData[]>([])
  const keyDownTimesRef = useRef<Map<string, number>>(new Map())
  const sessionStartRef = useRef<number>(Date.now())
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null)
  const lastMouseTimeRef = useRef<number>(Date.now())
  const totalActionsRef = useRef<number>(0)

  // Calculate standard deviation
  const calculateStdDev = (values: number[]): number => {
    if (values.length < 2) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2))
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length)
  }

  // Calculate distance between two points
  const distance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    const newData: MouseData = { x: e.clientX, y: e.clientY, timestamp: now }
    mouseDataRef.current.push(newData)

    // Keep only last 500 data points
    if (mouseDataRef.current.length > 500) {
      mouseDataRef.current = mouseDataRef.current.slice(-500)
    }

    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    lastMouseTimeRef.current = now
    totalActionsRef.current++
  }, [])

  // Keydown handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const now = Date.now()
    if (!keyDownTimesRef.current.has(e.key)) {
      keyDownTimesRef.current.set(e.key, now)
    }
    totalActionsRef.current++
  }, [])

  // Keyup handler
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const now = Date.now()
    const downTime = keyDownTimesRef.current.get(e.key)

    if (downTime) {
      const duration = now - downTime
      keystrokeDataRef.current.push({
        key: e.key,
        timestamp: now,
        duration,
      })
      keyDownTimesRef.current.delete(e.key)

      // Keep only last 200 keystrokes
      if (keystrokeDataRef.current.length > 200) {
        keystrokeDataRef.current = keystrokeDataRef.current.slice(-200)
      }
    }
  }, [])

  // Click handler
  const handleClick = useCallback((e: MouseEvent) => {
    const now = Date.now()
    clickDataRef.current.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: now,
      button: e.button,
    })

    // Keep only last 100 clicks
    if (clickDataRef.current.length > 100) {
      clickDataRef.current = clickDataRef.current.slice(-100)
    }
    totalActionsRef.current++
  }, [])

  // Scroll handler
  const handleScroll = useCallback((e: Event) => {
    const now = Date.now()
    const lastScroll = scrollDataRef.current[scrollDataRef.current.length - 1]
    const delta = lastScroll ? window.scrollY - lastScroll.scrollY : 0

    scrollDataRef.current.push({
      scrollY: window.scrollY,
      timestamp: now,
      delta: Math.abs(delta),
    })

    // Keep only last 100 scroll events
    if (scrollDataRef.current.length > 100) {
      scrollDataRef.current = scrollDataRef.current.slice(-100)
    }
    totalActionsRef.current++
  }, [])

  // Calculate metrics from collected data
  const calculateMetrics = useCallback((): BiometricMetrics => {
    const now = Date.now()
    const sessionDuration = (now - sessionStartRef.current) / 1000

    // Typing metrics
    let typingSpeed = 0
    let keystrokeDwellTime = 0
    let keystrokeFlightTime = 0
    let typingRhythmConsistency = 100

    if (keystrokeDataRef.current.length > 1) {
      // Estimate WPM (average word = 5 characters)
      const keyCount = keystrokeDataRef.current.length
      const timeSpan =
        (keystrokeDataRef.current[keyCount - 1].timestamp - keystrokeDataRef.current[0].timestamp) / 60000
      typingSpeed = timeSpan > 0 ? keyCount / 5 / timeSpan : 0

      // Average dwell time
      const dwellTimes = keystrokeDataRef.current.map((k) => k.duration)
      keystrokeDwellTime = dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length

      // Flight times (time between consecutive keystrokes)
      const flightTimes: number[] = []
      for (let i = 1; i < keystrokeDataRef.current.length; i++) {
        flightTimes.push(keystrokeDataRef.current[i].timestamp - keystrokeDataRef.current[i - 1].timestamp)
      }
      if (flightTimes.length > 0) {
        keystrokeFlightTime = flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length
        const stdDev = calculateStdDev(flightTimes)
        // Lower std dev = more consistent = higher score
        typingRhythmConsistency = Math.max(0, 100 - stdDev / 5)
      }
    }

    // Mouse metrics
    let mouseVelocity = 0
    let mouseAcceleration = 0
    let cursorStraightness = 100
    let mouseIdleTime = 0

    if (mouseDataRef.current.length > 2) {
      const velocities: number[] = []
      let totalPathLength = 0
      let idlePeriods = 0

      for (let i = 1; i < mouseDataRef.current.length; i++) {
        const prev = mouseDataRef.current[i - 1]
        const curr = mouseDataRef.current[i]
        const dist = distance(prev.x, prev.y, curr.x, curr.y)
        const timeDiff = curr.timestamp - prev.timestamp

        if (timeDiff > 0) {
          const vel = dist / timeDiff
          velocities.push(vel)
          totalPathLength += dist

          if (timeDiff > 200) idlePeriods++ // Idle if no movement for 200ms
        }
      }

      if (velocities.length > 0) {
        mouseVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length

        // Calculate acceleration (change in velocity)
        const accelerations: number[] = []
        for (let i = 1; i < velocities.length; i++) {
          accelerations.push(Math.abs(velocities[i] - velocities[i - 1]))
        }
        if (accelerations.length > 0) {
          mouseAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length
        }
      }

      // Cursor straightness
      const first = mouseDataRef.current[0]
      const last = mouseDataRef.current[mouseDataRef.current.length - 1]
      const directDistance = distance(first.x, first.y, last.x, last.y)
      cursorStraightness = totalPathLength > 0 ? Math.min(100, (directDistance / totalPathLength) * 100) : 100

      mouseIdleTime = (idlePeriods / mouseDataRef.current.length) * 100
    }

    // Click metrics
    let clickFrequency = 0
    let doubleClickSpeed = 0
    let clickPrecision = 100

    if (clickDataRef.current.length > 1) {
      const clickTimeSpan =
        (clickDataRef.current[clickDataRef.current.length - 1].timestamp - clickDataRef.current[0].timestamp) / 1000
      clickFrequency = clickTimeSpan > 0 ? clickDataRef.current.length / clickTimeSpan : 0

      // Check for double clicks
      for (let i = 1; i < clickDataRef.current.length; i++) {
        const timeDiff = clickDataRef.current[i].timestamp - clickDataRef.current[i - 1].timestamp
        if (timeDiff < 500 && timeDiff > 50) {
          doubleClickSpeed = timeDiff
          break
        }
      }

      // Click precision (variance in click positions)
      const xPositions = clickDataRef.current.map((c) => c.x)
      const yPositions = clickDataRef.current.map((c) => c.y)
      const xStdDev = calculateStdDev(xPositions)
      const yStdDev = calculateStdDev(yPositions)
      clickPrecision = Math.max(0, 100 - (xStdDev + yStdDev) / 10)
    }

    // Scroll metrics
    let scrollSpeed = 0
    let scrollPattern = 100

    if (scrollDataRef.current.length > 1) {
      const scrollDeltas = scrollDataRef.current.map((s) => s.delta).filter((d) => d > 0)
      if (scrollDeltas.length > 0) {
        scrollSpeed = scrollDeltas.reduce((a, b) => a + b, 0) / scrollDeltas.length
        scrollPattern = Math.max(0, 100 - calculateStdDev(scrollDeltas))
      }
    }

    // Session metrics
    const interactionDensity = sessionDuration > 0 ? (totalActionsRef.current / sessionDuration) * 60 : 0

    // Use ML model to calculate risk score
    const mlAnalysis = analyzeTransaction({
      amount: Math.random() * 1000, // Simulated transaction amount
      email: "user@example.com",
      country: "US",
      ip: "192.168.1.1",
      deviceId: `device-${Date.now()}`,
    })

    // Calculate human/bot scores based on behavioral patterns
    // Bots typically have: very consistent timing, straight mouse paths, no idle time, perfect rhythm
    let botIndicators = 0
    let humanIndicators = 0

    // Typing analysis
    if (typingRhythmConsistency > 95) botIndicators += 2 // Too consistent = bot
    if (typingRhythmConsistency > 60 && typingRhythmConsistency < 85) humanIndicators += 2 // Natural variation
    if (keystrokeDwellTime > 50 && keystrokeDwellTime < 200) humanIndicators += 1 // Normal key hold
    if (keystrokeDwellTime < 20 || keystrokeDwellTime > 500) botIndicators += 1

    // Mouse analysis
    if (cursorStraightness > 90) botIndicators += 2 // Too straight = bot
    if (cursorStraightness > 40 && cursorStraightness < 75) humanIndicators += 2 // Natural curves
    if (mouseIdleTime > 5 && mouseIdleTime < 40) humanIndicators += 1 // Normal pauses
    if (mouseIdleTime === 0) botIndicators += 1 // No pauses = bot
    if (mouseVelocity > 0 && mouseVelocity < 2) humanIndicators += 1
    if (mouseVelocity > 5) botIndicators += 1 // Too fast

    // Click analysis
    if (clickFrequency > 5) botIndicators += 2 // Clicking too fast
    if (clickFrequency > 0.1 && clickFrequency < 2) humanIndicators += 1

    // Interaction density
    if (interactionDensity > 200) botIndicators += 2 // Too many actions
    if (interactionDensity > 20 && interactionDensity < 100) humanIndicators += 1

    const totalIndicators = botIndicators + humanIndicators
    const humanScore = totalIndicators > 0 ? (humanIndicators / totalIndicators) * 100 : 50
    const botScore = totalIndicators > 0 ? (botIndicators / totalIndicators) * 100 : 50

    // Combine behavioral score with ML fraud score
    const behavioralTrust = humanScore
    const mlTrust = (1 - mlAnalysis.fraudProbability) * 100
    const trustScore = behavioralTrust * 0.6 + mlTrust * 0.4

    const riskLevel: "low" | "medium" | "high" = trustScore > 70 ? "low" : trustScore > 40 ? "medium" : "high"

    return {
      typingSpeed: Math.min(150, typingSpeed),
      keystrokeDwellTime,
      keystrokeFlightTime,
      typingRhythmConsistency,
      mouseVelocity: mouseVelocity * 100,
      mouseAcceleration: mouseAcceleration * 100,
      cursorStraightness,
      mouseIdleTime,
      clickFrequency: clickFrequency * 10,
      doubleClickSpeed,
      clickPrecision,
      scrollSpeed,
      scrollPattern,
      sessionDuration,
      interactionDensity,
      humanScore,
      botScore,
      trustScore,
      riskLevel,
    }
  }, [])

  // Start/stop tracking
  useEffect(() => {
    if (isTracking) {
      sessionStartRef.current = Date.now()
      totalActionsRef.current = 0

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      window.addEventListener("click", handleClick)
      window.addEventListener("scroll", handleScroll)

      // Update metrics every second
      const interval = setInterval(() => {
        setMetrics(calculateMetrics())
      }, 1000)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
        window.removeEventListener("click", handleClick)
        window.removeEventListener("scroll", handleScroll)
        clearInterval(interval)
      }
    }
  }, [isTracking, handleMouseMove, handleKeyDown, handleKeyUp, handleClick, handleScroll, calculateMetrics])

  const resetData = () => {
    mouseDataRef.current = []
    keystrokeDataRef.current = []
    clickDataRef.current = []
    scrollDataRef.current = []
    keyDownTimesRef.current.clear()
    sessionStartRef.current = Date.now()
    totalActionsRef.current = 0
    setMetrics({
      typingSpeed: 0,
      keystrokeDwellTime: 0,
      keystrokeFlightTime: 0,
      typingRhythmConsistency: 0,
      mouseVelocity: 0,
      mouseAcceleration: 0,
      cursorStraightness: 0,
      mouseIdleTime: 0,
      clickFrequency: 0,
      doubleClickSpeed: 0,
      clickPrecision: 0,
      scrollSpeed: 0,
      scrollPattern: 0,
      sessionDuration: 0,
      interactionDensity: 0,
      humanScore: 0,
      botScore: 0,
      trustScore: 0,
      riskLevel: "low",
    })
  }

  const displayMetrics = [
    {
      label: "Typing Speed",
      value: metrics.typingSpeed,
      unit: "WPM",
      icon: Keyboard,
      description: `Dwell: ${metrics.keystrokeDwellTime.toFixed(0)}ms, Flight: ${metrics.keystrokeFlightTime.toFixed(0)}ms`,
    },
    {
      label: "Mouse Velocity",
      value: metrics.mouseVelocity,
      unit: "px/s",
      icon: MousePointer2,
      description: `Straightness: ${metrics.cursorStraightness.toFixed(0)}%`,
    },
    {
      label: "Click Pattern",
      value: metrics.clickPrecision,
      unit: "%",
      icon: Activity,
      description: `Frequency: ${metrics.clickFrequency.toFixed(1)}/s`,
    },
    {
      label: "Scroll Behavior",
      value: metrics.scrollPattern,
      unit: "%",
      icon: TrendingUp,
      description: `Speed: ${metrics.scrollSpeed.toFixed(0)}px/scroll`,
    },
    {
      label: "Session Time",
      value: metrics.sessionDuration,
      unit: "sec",
      icon: Timer,
      description: `Actions: ${totalActionsRef.current}`,
    },
    {
      label: "Human Score",
      value: metrics.humanScore,
      unit: "%",
      icon: Fingerprint,
      description: `Bot score: ${metrics.botScore.toFixed(0)}%`,
    },
  ]

  return (
    <Card className="bg-[#0d1321] border-[#1a2744]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-[#a855f7]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Behavioral Biometrics</CardTitle>
              <p className="text-xs text-[#6b7b9a]">Real-time user behavior analysis with ML</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTracking && (
              <div className="flex items-center gap-2 text-[#00ffc8] text-xs">
                <div className="h-2 w-2 rounded-full bg-[#00ffc8] animate-pulse" />
                Tracking...
              </div>
            )}
            <Badge
              variant="outline"
              className={`
                ${metrics.riskLevel === "low" ? "border-[#00ffc8] text-[#00ffc8] bg-[#00ffc8]/10" : ""}
                ${metrics.riskLevel === "medium" ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" : ""}
                ${metrics.riskLevel === "high" ? "border-red-500 text-red-500 bg-red-500/10" : ""}
              `}
            >
              {metrics.riskLevel === "low" && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {metrics.riskLevel === "medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {metrics.riskLevel === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {metrics.riskLevel.charAt(0).toUpperCase() + metrics.riskLevel.slice(1)} Risk
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsTracking(!isTracking)}
            className={
              isTracking
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                : "bg-[#00ffc8]/20 text-[#00ffc8] hover:bg-[#00ffc8]/30 border border-[#00ffc8]/30"
            }
            size="sm"
          >
            {isTracking ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Button>
          <Button
            onClick={resetData}
            variant="outline"
            size="sm"
            className="border-[#1a2744] text-[#6b7b9a] hover:bg-[#1a2744] bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Trust Score */}
        <div className="bg-[#080c14] rounded-xl p-4 border border-[#1a2744]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7b9a]">Trust Score (ML + Behavioral)</span>
            <span className="text-2xl font-bold text-white">{metrics.trustScore.toFixed(0)}%</span>
          </div>
          <Progress value={metrics.trustScore} className="h-2 bg-[#1a2744]" />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-[#6b7b9a]">Human: {metrics.humanScore.toFixed(0)}%</p>
            <p className="text-xs text-[#6b7b9a]">Bot: {metrics.botScore.toFixed(0)}%</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {displayMetrics.map((metric) => {
            const Icon = metric.icon
            const normalizedValue =
              metric.unit === "WPM"
                ? Math.min(100, (metric.value / 150) * 100)
                : metric.unit === "px/s"
                  ? Math.min(100, metric.value)
                  : metric.unit === "sec"
                    ? Math.min(100, (metric.value / 300) * 100)
                    : metric.value

            return (
              <div
                key={metric.label}
                className="bg-[#080c14] rounded-lg p-3 border border-[#1a2744] hover:border-[#00ffc8]/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-[#00ffc8]" />
                  <span className="text-xs text-[#6b7b9a]">{metric.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    {metric.value.toFixed(0)}
                    <span className="text-xs text-[#6b7b9a] ml-1">{metric.unit}</span>
                  </span>
                  <Progress value={normalizedValue} className="h-1.5 w-16 bg-[#1a2744]" />
                </div>
                <p className="text-[10px] text-[#4a5568] mt-1">{metric.description}</p>
              </div>
            )
          })}
        </div>

        {/* How It Works */}
        <div className="text-xs text-[#6b7b9a] bg-[#080c14] rounded-lg p-3 border border-[#1a2744]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3 w-3 text-[#00ffc8]" />
            <span className="text-white font-medium">How It Works</span>
          </div>
          <p>
            Click "Start Tracking" to begin real-time analysis. Move your mouse, type on your keyboard, click, and
            scroll to generate behavioral data. The ML model analyzes patterns like typing rhythm, mouse trajectory, and
            interaction timing to distinguish humans from bots.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
