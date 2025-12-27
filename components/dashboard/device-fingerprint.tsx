"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Fingerprint,
  Monitor,
  Smartphone,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react"

interface DeviceData {
  fingerprint: string
  browser: string
  os: string
  device: string
  screenRes: string
  timezone: string
  language: string
  cookiesEnabled: boolean
  jsEnabled: boolean
  plugins: number
  fonts: number
  canvas: string
  webgl: string
  audioContext: string
  trustScore: number
  riskLevel: "low" | "medium" | "high"
  flags: string[]
}

export function DeviceFingerprint() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    // Simulate fingerprint collection with progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 50)

    // Generate mock device data after "scanning"
    setTimeout(() => {
      setIsScanning(false)
      setDeviceData({
        fingerprint: "fp_" + Math.random().toString(36).substring(2, 15),
        browser: "Chrome 120.0.6099",
        os: "Windows 11",
        device: "Desktop",
        screenRes: "1920x1080",
        timezone: "America/New_York (UTC-5)",
        language: "en-US",
        cookiesEnabled: true,
        jsEnabled: true,
        plugins: 5,
        fonts: 127,
        canvas: "a8f5f167f44f4964e6c998dee827110c",
        webgl: "NVIDIA GeForce RTX 3080",
        audioContext: "124.04347527516074",
        trustScore: 87,
        riskLevel: "low",
        flags: [],
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { label: "Browser", value: deviceData?.browser || "Scanning...", icon: Globe },
    { label: "Operating System", value: deviceData?.os || "Scanning...", icon: Monitor },
    {
      label: "Device Type",
      value: deviceData?.device || "Scanning...",
      icon: deviceData?.device === "Mobile" ? Smartphone : Monitor,
    },
    { label: "Screen Resolution", value: deviceData?.screenRes || "Scanning...", icon: Monitor },
    { label: "Timezone", value: deviceData?.timezone || "Scanning...", icon: Clock },
    { label: "Language", value: deviceData?.language || "Scanning...", icon: Globe },
  ]

  const technicalMetrics = [
    { label: "Canvas Hash", value: deviceData?.canvas?.substring(0, 16) + "..." || "---", icon: Cpu },
    { label: "WebGL Renderer", value: deviceData?.webgl || "---", icon: HardDrive },
    { label: "Audio Fingerprint", value: deviceData?.audioContext || "---", icon: Wifi },
    { label: "Installed Fonts", value: deviceData?.fonts?.toString() || "---", icon: Eye },
  ]

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#a855f7]/20 to-[#00ffc8]/20 border border-[#a855f7]/30 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-[#a855f7]" />
            </div>
            <div>
              <CardTitle className="text-white">Device Fingerprinting</CardTitle>
              <CardDescription className="text-[#6b7b9a]">Real-time device analysis and bot detection</CardDescription>
            </div>
          </div>
          {deviceData && (
            <Badge
              className={
                deviceData.riskLevel === "low"
                  ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                  : deviceData.riskLevel === "medium"
                    ? "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30"
                    : "bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30"
              }
            >
              {deviceData.riskLevel === "low" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {deviceData.riskLevel.toUpperCase()} RISK
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isScanning ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-2 border-[#1a2744] flex items-center justify-center">
                  <Fingerprint className="h-12 w-12 text-[#a855f7] animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-t-[#a855f7] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7b9a]">Collecting device signals...</span>
                <span className="text-[#00ffc8] font-mono">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-[#1a2744]" />
            </div>
            <p className="text-xs text-center text-[#6b7b9a]">Analyzing 50+ device attributes for fraud signals</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trust Score */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-[#00ffc8]" />
                <div>
                  <p className="text-sm text-[#6b7b9a]">Device Trust Score</p>
                  <p className="text-3xl font-bold text-white font-mono">{deviceData?.trustScore}/100</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b7b9a]">Fingerprint ID</p>
                <p className="text-sm font-mono text-[#00ffc8]">{deviceData?.fingerprint}</p>
              </div>
            </div>

            {/* Basic Metrics */}
            <div>
              <h4 className="text-sm font-medium text-[#8b9dc3] mb-3">Device Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
                    <div className="flex items-center gap-2 mb-1">
                      <metric.icon className="h-3 w-3 text-[#6b7b9a]" />
                      <span className="text-xs text-[#6b7b9a]">{metric.label}</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Fingerprint */}
            <div>
              <h4 className="text-sm font-medium text-[#8b9dc3] mb-3">Technical Fingerprint</h4>
              <div className="grid grid-cols-2 gap-3">
                {technicalMetrics.map((metric) => (
                  <div key={metric.label} className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
                    <div className="flex items-center gap-2 mb-1">
                      <metric.icon className="h-3 w-3 text-[#a855f7]" />
                      <span className="text-xs text-[#6b7b9a]">{metric.label}</span>
                    </div>
                    <p className="text-xs font-mono text-[#00ffc8] truncate">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Checks */}
            <div>
              <h4 className="text-sm font-medium text-[#8b9dc3] mb-3">Security Checks</h4>
              <div className="space-y-2">
                {[
                  { name: "Bot Detection", status: "pass", detail: "No automated behavior detected" },
                  { name: "Headless Browser", status: "pass", detail: "Standard browser environment" },
                  { name: "VPN/Proxy Detection", status: "pass", detail: "Direct connection" },
                  { name: "Device Consistency", status: "pass", detail: "All signals match" },
                  { name: "Timezone Match", status: "pass", detail: "IP and browser timezone align" },
                ].map((check) => (
                  <div key={check.name} className="flex items-center justify-between p-2 rounded bg-[#0a0e1a]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#00ffc8]" />
                      <span className="text-sm text-white">{check.name}</span>
                    </div>
                    <span className="text-xs text-[#6b7b9a]">{check.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
