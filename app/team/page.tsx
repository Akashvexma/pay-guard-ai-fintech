"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Hexagon,
  Github,
  Linkedin,
  Twitter,
  ArrowLeft,
  Code2,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Rocket,
  Brain,
  Globe,
  Lock,
  Zap,
  Trophy,
  Target,
  Lightbulb,
  Clock,
  CheckCircle,
} from "lucide-react"

const teamMembers = [
  {
    name: "Akash Verma",
    role: "Full Stack Developer",
    bio: "Architecting the core infrastructure and API systems. Passionate about building scalable, secure fintech solutions that protect businesses worldwide.",
    avatar: "AV",
    gradient: "from-[#00ffc8] to-[#00a8ff]",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "System Design"],
    icon: Code2,
    contributions: ["Core API Architecture", "Database Design", "Risk Engine Integration"],
    github: "https://github.com/akashverma",
    linkedin: "https://linkedin.com/in/akashverma",
    twitter: "https://twitter.com/akashverma",
  },
  {
    name: "Aditya Geete",
    role: "ML & Backend Engineer",
    bio: "Developing the neural risk engine and fraud detection algorithms. Turning complex data patterns into actionable intelligence that stops fraud in real-time.",
    avatar: "AG",
    gradient: "from-[#a855f7] to-[#00ffc8]",
    skills: ["Python", "TensorFlow", "Risk Modeling", "APIs", "Data Science"],
    icon: Brain,
    contributions: ["ML Risk Scoring", "Velocity Tracking", "Pattern Detection"],
    github: "https://github.com/adityageete",
    linkedin: "https://linkedin.com/in/adityageete",
    twitter: "https://twitter.com/adityageete",
  },
  {
    name: "Neev Modi",
    role: "Product & Frontend Lead",
    bio: "Crafting the user experience and visual design. Ensuring PayGuard is as beautiful as it is powerful, with intuitive interfaces that merchants love.",
    avatar: "NM",
    gradient: "from-[#00a8ff] to-[#a855f7]",
    skills: ["React", "UI/UX", "Tailwind CSS", "Figma", "Product Strategy"],
    icon: Layers,
    contributions: ["Dashboard UI", "Landing Page", "Design System"],
    github: "https://github.com/neevmodi",
    linkedin: "https://linkedin.com/in/neevmodi",
    twitter: "https://twitter.com/neevmodi",
  },
]

const techStack = [
  { name: "Next.js 14", icon: Globe, description: "App Router & RSC" },
  { name: "TypeScript", icon: Code2, description: "Type-safe code" },
  { name: "Supabase", icon: Database, description: "PostgreSQL + Auth" },
  { name: "Redis", icon: Zap, description: "Velocity tracking" },
  { name: "Stripe", icon: Lock, description: "Payments" },
  { name: "Vercel", icon: Rocket, description: "Edge deployment" },
]

const projectJourney = [
  { phase: "Ideation", description: "Identified SMB fraud problem", icon: Lightbulb, status: "complete" },
  { phase: "Architecture", description: "Designed scalable system", icon: Target, status: "complete" },
  { phase: "Development", description: "Built core features", icon: Code2, status: "complete" },
  { phase: "Polish", description: "Refined UX & performance", icon: Sparkles, status: "complete" },
  { phase: "Launch", description: "Ready for demo", icon: Rocket, status: "complete" },
]

const achievements = [
  { metric: "200+", label: "Risk Signals Analyzed" },
  { metric: "<50ms", label: "Avg Response Time" },
  { metric: "99.7%", label: "Detection Accuracy" },
  { metric: "$4.5B", label: "Problem We're Solving" },
]

export default function TeamPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0e1a]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#00ffc8]/10 blur-[150px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[#a855f7]/10 blur-[180px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#00a8ff]/5 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1a2744] bg-[#0a0e1a]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Hexagon className="h-8 w-8 text-[#00ffc8] stroke-[1.5]" />
              <Shield className="h-4 w-4 text-[#00ffc8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xl font-bold text-white">
              Pay<span className="text-[#00ffc8]">Guard</span>
            </span>
            <Badge className="ml-2 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 text-[10px]">AI</Badge>
          </Link>
          <Button variant="ghost" asChild className="text-[#6b7b9a] hover:text-[#00ffc8] hover:bg-[#1a2744]">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30">
            <Trophy className="h-3 w-3 mr-1" />
            FinTech Hackathon 2024
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-white mb-6">
            Meet the <span className="text-[#00ffc8] drop-shadow-[0_0_30px_rgba(0,255,200,0.3)]">Innovators</span>
          </h1>
          <p className="text-lg text-[#6b7b9a] max-w-2xl mx-auto mb-12">
            Three engineers united by a mission: democratize fraud prevention and protect small businesses from the
            $4.5B annual fraud epidemic.
          </p>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#0d1221] border border-[#1a2744] hover:border-[#00ffc8]/30 transition-all"
              >
                <p className="text-2xl md:text-3xl font-bold text-[#00ffc8]">{achievement.metric}</p>
                <p className="text-xs text-[#6b7b9a] mt-1">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => {
              const Icon = member.icon
              return (
                <Card
                  key={member.name}
                  className="bg-[#0d1221] border-[#1a2744] overflow-hidden group hover:border-[#00ffc8]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,200,0.1)]"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${member.gradient}`} />
                  <CardContent className="p-8">
                    {/* Avatar */}
                    <div className="relative mx-auto mb-6 text-center">
                      <div
                        className={`h-28 w-28 rounded-full bg-gradient-to-br ${member.gradient} p-[3px] mx-auto group-hover:shadow-[0_0_40px_rgba(0,255,200,0.3)] transition-all`}
                      >
                        <div className="h-full w-full rounded-full bg-[#0d1221] flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">{member.avatar}</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <div className="h-10 w-10 rounded-lg bg-[#0a0e1a] border border-[#1a2744] flex items-center justify-center">
                          <Icon className="h-5 w-5 text-[#00ffc8]" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-[#00ffc8] text-sm font-medium mb-4">{member.role}</p>
                      <p className="text-[#6b7b9a] text-sm leading-relaxed mb-6">{member.bio}</p>
                    </div>

                    {/* Contributions */}
                    <div className="mb-6">
                      <p className="text-xs text-[#4a5568] uppercase tracking-wider mb-2 text-center">
                        Key Contributions
                      </p>
                      <div className="space-y-1">
                        {member.contributions.map((contribution) => (
                          <div key={contribution} className="flex items-center gap-2 text-xs text-[#8b9dc3]">
                            <CheckCircle className="h-3 w-3 text-[#00ffc8]" />
                            {contribution}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {member.skills.map((skill) => (
                        <Badge key={skill} className="bg-[#1a2744] text-[#8b9dc3] border-[#2a3a5a] text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center text-[#6b7b9a] hover:text-[#00ffc8] hover:border-[#00ffc8]/50 transition-all"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center text-[#6b7b9a] hover:text-[#00a8ff] hover:border-[#00a8ff]/50 transition-all"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center text-[#6b7b9a] hover:text-[#a855f7] hover:border-[#a855f7]/50 transition-all"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Project Journey */}
      <section className="py-20 border-t border-[#1a2744]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30">
              <Clock className="h-3 w-3 mr-1" />
              48-Hour Build
            </Badge>
            <h2 className="text-3xl font-bold text-white">Our Hackathon Journey</h2>
            <p className="text-[#6b7b9a] mt-2">From idea to working product in one weekend</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {projectJourney.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={step.phase} className="flex flex-col items-center text-center relative">
                    <div className="h-16 w-16 rounded-full bg-[#0d1221] border-2 border-[#00ffc8] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,255,200,0.2)]">
                      <Icon className="h-7 w-7 text-[#00ffc8]" />
                    </div>
                    <p className="font-semibold text-white">{step.phase}</p>
                    <p className="text-xs text-[#6b7b9a] max-w-[120px]">{step.description}</p>
                    {i < projectJourney.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(100%+8px)] w-[calc(100%-16px)] h-0.5 bg-gradient-to-r from-[#00ffc8] to-[#00ffc8]/30" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 border-t border-[#1a2744]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30">
              <Cpu className="h-3 w-3 mr-1" />
              Tech Stack
            </Badge>
            <h2 className="text-3xl font-bold text-white">Built With Modern Tools</h2>
            <p className="text-[#6b7b9a] mt-2">Production-ready technologies for scale and performance</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
            {techStack.map((tech) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.name}
                  className="text-center p-4 rounded-xl bg-[#0d1221] border border-[#1a2744] hover:border-[#00ffc8]/30 transition-all group"
                >
                  <div className="h-12 w-12 rounded-lg bg-[#1a2744] border border-[#2a3a5a] flex items-center justify-center mx-auto mb-3 group-hover:border-[#00ffc8]/50 transition-all">
                    <Icon className="h-6 w-6 text-[#00ffc8]" />
                  </div>
                  <p className="font-semibold text-white text-sm">{tech.name}</p>
                  <p className="text-[#6b7b9a] text-xs mt-1">{tech.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-[#0d1221]/50 border-t border-[#1a2744]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30">
                <Target className="h-3 w-3 mr-1" />
                The Challenge
              </Badge>
              <h2 className="text-3xl font-bold text-white">Why We Built PayGuard AI</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-[#0a0e1a] border border-[#ff4757]/30">
                <h3 className="text-lg font-bold text-[#ff4757] mb-4">The Problem</h3>
                <ul className="space-y-3 text-sm text-[#8b9dc3]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff4757]">•</span>
                    SMBs lose $4.5 billion annually to payment fraud
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff4757]">•</span>
                    Enterprise fraud tools cost $10K-50K/year
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff4757]">•</span>
                    One chargeback wipes out profit from 10 sales
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff4757]">•</span>
                    30M+ SMBs in the US alone are vulnerable
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[#0a0e1a] border border-[#00ffc8]/30">
                <h3 className="text-lg font-bold text-[#00ffc8] mb-4">Our Solution</h3>
                <ul className="space-y-3 text-sm text-[#8b9dc3]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00ffc8] mt-0.5 shrink-0" />
                    Affordable pricing at $0.02/transaction
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00ffc8] mt-0.5 shrink-0" />
                    5-minute integration with simple API
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00ffc8] mt-0.5 shrink-0" />
                    Explainable AI - see why transactions flagged
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00ffc8] mt-0.5 shrink-0" />
                    75% reduction in chargebacks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to <span className="text-[#00ffc8]">Stop Fraud</span>?
          </h2>
          <p className="text-[#6b7b9a] mb-8 max-w-lg mx-auto">
            Try PayGuard AI today and join the movement to protect small businesses everywhere.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 bg-[#00ffc8] hover:bg-[#00ffc8]/90 text-[#0a0e1a] font-bold shadow-[0_0_20px_rgba(0,255,200,0.3)]"
            >
              <Link href="/auth/sign-up">
                <Rocket className="h-4 w-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 border-[#1a2744] hover:border-[#00ffc8]/50 text-white hover:bg-[#00ffc8]/5 bg-transparent"
            >
              <Link href="/dashboard/demo">View Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2744] py-8 bg-[#080c14]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Hexagon className="h-5 w-5 text-[#00ffc8] stroke-[1.5]" />
            <span className="font-bold text-white">PayGuard AI</span>
          </div>
          <p className="text-sm text-[#6b7b9a] mb-2">Built with passion for FinTech Hackathon 2024</p>
          <p className="text-xs text-[#4a5568]">By Akash Verma, Aditya Geete & Neev Modi</p>
        </div>
      </footer>
    </div>
  )
}
