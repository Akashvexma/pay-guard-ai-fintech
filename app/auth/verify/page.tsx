"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Shield, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { BlockchainBackground } from "@/components/ui/blockchain-bg"

function VerifyContent() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (verifyError) throw verifyError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const supabase = createClient()
    setIsResending(true)
    setError(null)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (resendError) throw resendError

      setCountdown(60)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <BlockchainBackground />
        <div className="w-full max-w-sm relative z-10">
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <div className="absolute inset-0 rounded-full bg-success/30 blur-xl animate-pulse-glow" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Email Verified</h2>
                <p className="text-sm text-muted-foreground mt-1">Redirecting to dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <BlockchainBackground />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 group">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/30 blur-xl animate-pulse-glow" />
            </div>
            <span className="text-3xl font-bold tracking-tight glow-text text-primary">PayGuard</span>
          </Link>

          {/* Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We sent a 6-digit code to
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-lg bg-input/50 border-border/50" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="text-primary hover:text-primary/80"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend code
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/auth/sign-up"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use a different email
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <BlockchainBackground />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
