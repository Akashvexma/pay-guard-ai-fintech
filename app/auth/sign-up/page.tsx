"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Shield, ArrowRight, Loader2, Hexagon, Zap } from "lucide-react"
import { setDemoSessionClient, getDemoSessionClient, generateDemoId, type DemoUser } from "@/lib/demo-auth"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("ecommerce")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const existingSession = getDemoSessionClient()
    if (existingSession) {
      window.location.href = "/dashboard"
    }
  }, [])

  const createSessionAndRedirect = (user: DemoUser) => {
    setDemoSessionClient(user)
    window.location.href = "/dashboard"
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const user: DemoUser = {
      id: generateDemoId(),
      email: email || "demo@payguard.ai",
      businessName: businessName || "Demo Business",
      businessType: businessType || "ecommerce",
      createdAt: new Date().toISOString(),
    }
    createSessionAndRedirect(user)
  }

  const handleDemoSignUp = () => {
    setIsLoading(true)
    const user: DemoUser = {
      id: generateDemoId(),
      email: "demo@payguard.ai",
      businessName: "Acme Corp",
      businessType: "ecommerce",
      createdAt: new Date().toISOString(),
    }
    createSessionAndRedirect(user)
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0e1a]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00ffc8]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00a8ff]/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 group">
            <div className="relative">
              <Hexagon className="h-10 w-10 text-[#00ffc8] stroke-[1.5]" />
              <Shield className="h-5 w-5 text-[#00ffc8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              Pay<span className="text-[#00ffc8]">Guard</span>
            </span>
          </Link>

          {/* Card */}
          <Card className="bg-[#0d1221]/80 border-[#1a2744] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffc8]/50 to-transparent" />

            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-white">Create Account</CardTitle>
              <CardDescription className="text-[#6b7b9a]">Initialize your fraud prevention system</CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                type="button"
                onClick={handleDemoSignUp}
                className="w-full h-12 mb-6 font-semibold gap-2 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] hover:opacity-90 text-[#0a0e1a] transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Instant Demo Access
                  </>
                )}
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#1a2744]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0d1221] px-2 text-[#4a5568]">or create account</span>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm text-[#8b9dc3]">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Acme Inc."
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-11 bg-[#0a0e1a] border-[#1a2744] text-white placeholder:text-[#4a5568] focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-sm text-[#8b9dc3]">
                    Business Type
                  </Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger className="h-11 bg-[#0a0e1a] border-[#1a2744] text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="defi">DeFi / Crypto</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-[#8b9dc3]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-[#0a0e1a] border-[#1a2744] text-white placeholder:text-[#4a5568] focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-[#8b9dc3]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-[#8b9dc3]">
                      Confirm
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 bg-[#0a0e1a] border-[#1a2744] text-white focus:border-[#00ffc8] focus:ring-[#00ffc8]/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-12 font-semibold gap-2 border-[#1a2744] bg-transparent text-white hover:bg-[#1a2744] hover:text-white transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-[#6b7b9a]">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-[#00ffc8] hover:text-[#00ffc8]/80">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#4a5568]">
            <span className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00ffc8]" />
              256-bit encryption
            </span>
            <span className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00a8ff]" />
              SOC 2 compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
