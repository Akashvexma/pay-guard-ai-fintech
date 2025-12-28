"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  DollarSign,
  Eye,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Fingerprint,
  Activity,
  Hexagon,
  TrendingUp,
  Layers,
  Terminal,
  Database,
  Wifi,
  Box,
  Play,
  Star,
  Users,
  Building,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end])

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState([
    { id: 1, status: "approved", amount: "$142.00", location: "New York, US", time: "2s ago" },
    { id: 2, status: "blocked", amount: "$2,499.99", location: "Lagos, NG", time: "5s ago" },
    { id: 3, status: "approved", amount: "$89.50", location: "London, UK", time: "8s ago" },
  ])

  useEffect(() => {
    const locations = ["New York, US", "London, UK", "Paris, FR", "Tokyo, JP", "Sydney, AU", "Lagos, NG", "Moscow, RU"]
    const interval = setInterval(() => {
      const isBlocked = Math.random() > 0.7
      const newTx = {
        id: Date.now(),
        status: isBlocked ? "blocked" : "approved",
        amount: `$${(Math.random() * 500 + 10).toFixed(2)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "now",
      }
      setTransactions((prev) => [newTx, ...prev.slice(0, 2)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      {transactions.map((tx, i) => (
        <div
          key={tx.id}
          className={`flex items-center justify-between p-3 rounded-lg bg-[#0a0e1a]/50 border border-[#1a2744]/50 transition-all ${
            i === 0 ? "animate-pulse" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${tx.status === "approved" ? "bg-[#00ffc8]" : "bg-[#ff4757]"}`} />
            <span className="text-sm text-white font-mono">{tx.amount}</span>
            <span className="text-xs text-[#6b7b9a]">{tx.location}</span>
          </div>
          <Badge
            className={`text-[10px] ${
              tx.status === "approved"
                ? "bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30"
                : "bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30"
            }`}
          >
            {tx.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0e1a] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0e1a]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#00ffc8]/10 blur-[150px] animate-pulse" />
        <div
          className="absolute -right-40 top-1/4 h-[700px] w-[700px] rounded-full bg-[#00a8ff]/8 blur-[180px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#a855f7]/6 blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1a2744] bg-[#0a0e1a]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Hexagon className="h-8 w-8 text-[#00ffc8] stroke-[1.5] group-hover:drop-shadow-[0_0_8px_rgba(0,255,200,0.5)] transition-all" />
              <Shield className="h-4 w-4 text-[#00ffc8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xl font-bold text-white">
              Pay<span className="text-[#00ffc8] drop-shadow-[0_0_10px_rgba(0,255,200,0.3)]">Guard</span>
            </span>
            <Badge className="ml-2 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 text-[10px]">AI</Badge>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-[#6b7b9a] hover:text-[#00ffc8] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[#6b7b9a] hover:text-[#00ffc8] transition-colors"
            >
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-[#6b7b9a] hover:text-[#00ffc8] transition-colors">
              Pricing
            </Link>
            <Link href="/team" className="text-sm font-medium text-[#6b7b9a] hover:text-[#00ffc8] transition-colors">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-[#6b7b9a] hover:text-[#00ffc8] hover:bg-[#1a2744]">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-[#00ffc8] hover:bg-[#00ffc8]/90 text-[#0a0e1a] font-semibold shadow-[0_0_20px_rgba(0,255,200,0.3)]"
            >
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div className="relative z-10">
              {/* Live indicator */}
              <div className="mb-6 inline-flex items-center rounded-full border border-[#00ffc8]/30 bg-[#00ffc8]/5 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc8]"></span>
                </span>
                <span className="text-[#00ffc8] font-mono text-xs tracking-wider">
                  {mounted && <AnimatedCounter end={2847} />} fraudulent transactions blocked today
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight md:text-7xl text-white leading-[1.1]">
                <span className="block">Stop Fraud</span>
                <span className="block text-[#00ffc8] drop-shadow-[0_0_30px_rgba(0,255,200,0.3)]">Before It</span>
                <span className="block bg-gradient-to-r from-[#00a8ff] to-[#a855f7] bg-clip-text text-transparent">
                  Happens
                </span>
              </h1>

              <p className="mt-8 text-lg text-[#8b9dc3] md:text-xl leading-relaxed max-w-lg">
                AI-powered fraud detection that analyzes 200+ signals in under 50ms. Protect your revenue, reduce
                chargebacks by 75%, and never lose another dollar to fraud.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="gap-2 h-14 px-8 bg-[#00ffc8] hover:bg-[#00ffc8]/90 text-[#0a0e1a] font-bold transition-all shadow-[0_0_30px_rgba(0,255,200,0.4)] hover:shadow-[0_0_50px_rgba(0,255,200,0.6)] hover:scale-105"
                >
                  <Link href="/auth/sign-up">
                    <Zap className="h-5 w-5" />
                    Start Free - No Credit Card
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-14 px-8 border-[#00a8ff]/50 hover:border-[#00a8ff] bg-[#00a8ff]/5 hover:bg-[#00a8ff]/10 text-[#00a8ff] font-semibold"
                >
                  <Link href="/auth/login">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1a2744] to-[#2a3a5a] border-2 border-[#0a0e1a] flex items-center justify-center text-xs text-white font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[#ffc107] text-[#ffc107]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#6b7b9a]">Trusted by 10,000+ businesses</p>
                </div>
              </div>
            </div>

            {/* Right - Live Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-[#1a2744] bg-[#0d1221]/90 p-6 backdrop-blur-xl shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffc8]/50 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#00ffc8]/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-[#00ffc8]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Live Threat Monitor</div>
                      <div className="text-xs text-[#6b7b9a] font-mono">Real-time protection active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc8] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc8]"></span>
                    </span>
                    <span className="text-xs text-[#00ffc8] font-mono">LIVE</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-3 text-center">
                    <ShieldCheck className="h-5 w-5 text-[#00ffc8] mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{mounted && <AnimatedCounter end={2847} />}</div>
                    <div className="text-xs text-[#6b7b9a]">Blocked</div>
                  </div>
                  <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-3 text-center">
                    <Cpu className="h-5 w-5 text-[#00a8ff] mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">
                      {mounted && <AnimatedCounter end={89} suffix="K" />}
                    </div>
                    <div className="text-xs text-[#6b7b9a]">Analyzed</div>
                  </div>
                  <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-3 text-center">
                    <Clock className="h-5 w-5 text-[#a855f7] mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">
                      {mounted && <AnimatedCounter end={42} suffix="ms" />}
                    </div>
                    <div className="text-xs text-[#6b7b9a]">Avg Time</div>
                  </div>
                </div>

                {/* Live transaction feed */}
                <LiveTransactionFeed />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-8 -right-8 rounded-xl border border-[#00ffc8]/30 bg-[#0d1221]/90 p-4 backdrop-blur-xl shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#00ffc8]/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[#00ffc8]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">$12,450 Saved</div>
                    <div className="text-xs text-[#00ffc8]">This week</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -left-6 rounded-xl border border-[#a855f7]/30 bg-[#0d1221]/90 p-4 backdrop-blur-xl shadow-lg animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#a855f7]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">99.7% Accuracy</div>
                    <div className="text-xs text-[#a855f7]">ML Detection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y border-[#1a2744] bg-[#0d1221]/30 py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-[#6b7b9a] mb-8">Protecting businesses from startups to enterprises</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Wayne Enterprises"].map((name) => (
              <div key={name} className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#6b7b9a]" />
                <span className="text-[#6b7b9a] font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0d1221]/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: 4.5, suffix: "B+", prefix: "$", label: "Fraud prevented", icon: DollarSign },
              { value: 99.7, suffix: "%", label: "Detection rate", icon: Shield },
              { value: 42, suffix: "ms", label: "Avg response", icon: Zap },
              { value: 10, suffix: "K+", label: "SMBs protected", icon: Users },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2744] border border-[#2a3a5a] mb-4 group-hover:border-[#00ffc8]/50 group-hover:bg-[#00ffc8]/5 transition-all">
                  <stat.icon className="h-6 w-6 text-[#00ffc8]" />
                </div>
                <div className="text-4xl font-bold text-white md:text-5xl">
                  {mounted && (
                    <AnimatedCounter end={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
                  )}
                </div>
                <div className="mt-2 text-sm text-[#6b7b9a]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-y border-[#1a2744]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 bg-[#00a8ff]/10 text-[#00a8ff] border-[#00a8ff]/30">
              <Terminal className="h-3 w-3 mr-1" />
              Simple Integration
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
              Three Steps to <span className="text-[#00ffc8]">Total Protection</span>
            </h2>
            <p className="mt-4 text-lg text-[#6b7b9a]">Get up and running in under 5 minutes</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Code2,
                title: "Add One Line of Code",
                description: "Install our SDK and add a single API call to your checkout. Works with any stack.",
                code: "const result = await payguard.score(transaction)",
                color: "#00ffc8",
              },
              {
                step: "02",
                icon: Cpu,
                title: "AI Analyzes in Real-Time",
                description:
                  "Our neural network evaluates 200+ risk signals including velocity, geo, and behavioral patterns.",
                code: "// Processing time: ~42ms average",
                color: "#00a8ff",
              },
              {
                step: "03",
                icon: Shield,
                title: "Get Instant Decision",
                description: "Receive approve/review/decline with full explainability. Take action with confidence.",
                code: '{ decision: "approve", score: 12 }',
                color: "#a855f7",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <Card className="h-full bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/30 transition-all overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="h-14 w-14 rounded-2xl flex items-center justify-center border"
                        style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}30` }}
                      >
                        <item.icon className="h-7 w-7" style={{ color: item.color }} />
                      </div>
                      <span className="text-5xl font-bold text-[#1a2744] group-hover:text-[#2a3a5a] transition-colors">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-[#6b7b9a] mb-6">{item.description}</p>
                    <div className="rounded-lg bg-[#0a0e1a] border border-[#1a2744] p-3">
                      <code className="text-xs font-mono text-[#00ffc8]">{item.code}</code>
                    </div>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ChevronRight className="h-8 w-8 text-[#1a2744]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30">
              <Layers className="h-3 w-3 mr-1" />
              Full Feature Suite
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
              Everything You Need to <span className="text-[#a855f7]">Fight Fraud</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Large feature card */}
            <Card className="md:col-span-2 lg:row-span-2 bg-gradient-to-br from-[#00ffc8]/5 to-transparent border-[#00ffc8]/30 hover:border-[#00ffc8]/50 transition-all">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00ffc8]/10 border border-[#00ffc8]/30 mb-6">
                  <Cpu className="h-7 w-7 text-[#00ffc8]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Neural Risk Engine</h3>
                <p className="text-[#6b7b9a] leading-relaxed flex-grow">
                  Our AI analyzes 200+ signals per transaction including behavioral patterns, device fingerprints,
                  velocity checks, and geographic anomalies. Trained on billions of data points from real fraud cases.
                </p>
                <div className="mt-6 pt-6 border-t border-[#1a2744] grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00ffc8]">200+</div>
                    <div className="text-xs text-[#6b7b9a]">Risk signals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00a8ff]">42ms</div>
                    <div className="text-xs text-[#6b7b9a]">Avg latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#a855f7]">99.7%</div>
                    <div className="text-xs text-[#6b7b9a]">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature cards */}
            {[
              {
                icon: Eye,
                title: "Explainable AI",
                description: "See exactly why transactions are flagged",
                color: "#00a8ff",
              },
              {
                icon: Terminal,
                title: "Single API",
                description: "One endpoint, 5-minute integration",
                color: "#00ffc8",
              },
              {
                icon: Database,
                title: "Smart Rules",
                description: "Custom thresholds and velocity limits",
                color: "#a855f7",
              },
              {
                icon: Wifi,
                title: "Real-time Alerts",
                description: "Instant notifications on threats",
                color: "#00ffc8",
              },
              {
                icon: Fingerprint,
                title: "Device Intel",
                description: "Advanced fingerprinting tech",
                color: "#00a8ff",
              },
              {
                icon: Box,
                title: "Whitelist/Blacklist",
                description: "Full control over trusted entities",
                color: "#a855f7",
              },
            ].map((feature, i) => (
              <Card key={i} className="bg-[#0d1221] border-[#1a2744] hover:border-[#00ffc8]/30 transition-all">
                <CardContent className="p-6">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg border"
                    style={{ backgroundColor: `${feature.color}10`, borderColor: `${feature.color}30` }}
                  >
                    <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-[#6b7b9a] text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#0d1221]/30 border-y border-[#1a2744]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30">
              <DollarSign className="h-3 w-3 mr-1" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
              Start Free, <span className="text-[#00ffc8]">Scale As You Grow</span>
            </h2>
            <p className="mt-4 text-lg text-[#6b7b9a]">No hidden fees. No long-term contracts. Cancel anytime.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "/month",
                description: "Perfect for testing & small projects",
                features: ["100 scans/month", "Basic ML detection", "Community support", "7-day data retention"],
                highlighted: false,
                cta: "Start Free",
              },
              {
                name: "Growth",
                price: "$0.02",
                period: "/scan",
                description: "For growing businesses",
                features: [
                  "Unlimited scans",
                  "Advanced ML models",
                  "Custom rules engine",
                  "Priority support",
                  "90-day retention",
                  "Webhooks & alerts",
                ],
                highlighted: true,
                cta: "Start Trial",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For high-volume operations",
                features: [
                  "Volume discounts",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantee",
                  "Unlimited retention",
                  "White-label option",
                ],
                highlighted: false,
                cta: "Contact Sales",
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`bg-[#0d1221] border-[#1a2744] relative overflow-hidden ${
                  plan.highlighted ? "border-[#00ffc8]/50 shadow-[0_0_50px_rgba(0,255,200,0.15)] scale-105" : ""
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffc8] to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#00ffc8] text-[#0a0e1a] text-xs font-bold">Most Popular</Badge>
                    </div>
                  </>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-[#6b7b9a] ml-1">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6b7b9a]">{plan.description}</p>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-[#8b9dc3]">
                        <CheckCircle2 className="h-4 w-4 text-[#00ffc8] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-8 w-full h-12 font-semibold ${
                      plan.highlighted
                        ? "bg-[#00ffc8] hover:bg-[#00ffc8]/90 text-[#0a0e1a] shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                        : "bg-[#1a2744] hover:bg-[#2a3a5a] text-white"
                    }`}
                    asChild
                  >
                    <Link href="/auth/sign-up">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1221]/50 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
            Ready to <span className="text-[#00ffc8]">Protect</span> Your Business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#6b7b9a]">
            Join thousands of businesses that trust PayGuard AI to stop fraud before it happens
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-14 px-10 bg-[#00ffc8] hover:bg-[#00ffc8]/90 text-[#0a0e1a] font-bold gap-2 shadow-[0_0_30px_rgba(0,255,200,0.4)] hover:shadow-[0_0_50px_rgba(0,255,200,0.6)] hover:scale-105 transition-all"
            >
              <Link href="/auth/sign-up">
                <Zap className="h-5 w-5" />
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2744] py-12 bg-[#080c14]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Hexagon className="h-6 w-6 text-[#00ffc8] stroke-[1.5]" />
              <span className="font-bold text-white">PayGuard AI</span>
              <span className="text-[#6b7b9a] text-sm ml-2">| FinTech Hackathon 2025</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#6b7b9a]">
              <Link href="/team" className="hover:text-[#00ffc8] transition-colors">
                Team
              </Link>
              <Link href="#" className="hover:text-[#00ffc8] transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-[#00ffc8] transition-colors">
                API Reference
              </Link>
              <Link href="#" className="hover:text-[#00ffc8] transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#1a2744] text-center">
            <p className="text-sm text-[#6b7b9a]">
              Built by <span className="text-white">Akash Verma</span>, <span className="text-white">Aditya Geete</span>
              , and <span className="text-white">Neev Modi</span>
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
