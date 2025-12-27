import { NextResponse } from "next/server"
import { calculateRiskScore } from "@/lib/risk-engine"
import type { RiskScoreRequest } from "@/lib/types"

// Rate limiting with simple in-memory store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(apiKey)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(apiKey, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (limit.count >= 100) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: Request) {
  const startTime = performance.now()

  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key. Include x-api-key header." }, { status: 401 })
    }

    // Rate limit check
    if (!checkRateLimit(apiKey)) {
      return NextResponse.json({ error: "Rate limit exceeded. Max 100 requests per minute." }, { status: 429 })
    }

    const isValidDemoKey = apiKey.startsWith("pg_") || apiKey === "demo_key"

    if (!isValidDemoKey) {
      return NextResponse.json({ error: "Invalid API key format. Use pg_* keys." }, { status: 401 })
    }

    // Parse request body
    const body: RiskScoreRequest = await request.json()

    // Validate required fields
    if (typeof body.amount_cents !== "number" || body.amount_cents <= 0) {
      return NextResponse.json({ error: "amount_cents is required and must be a positive number" }, { status: 400 })
    }

    const riskResponse = await calculateRiskScore(body, {
      merchantRiskTolerance: 50,
      whitelistedEmails: new Set<string>(),
      whitelistedIPs: new Set<string>(),
      blacklistedEmails: new Set<string>(),
      blacklistedIPs: new Set<string>(),
    })

    const processingTime = Math.round(performance.now() - startTime)

    return NextResponse.json(
      {
        ...riskResponse,
        processing_time_ms: processingTime,
      },
      {
        headers: {
          "X-Processing-Time": `${processingTime}ms`,
        },
      },
    )
  } catch (error) {
    console.error("Risk scoring error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "PayGuard AI Risk Scoring API",
    version: "1.0.0",
  })
}
