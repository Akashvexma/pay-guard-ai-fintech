import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, businessName, businessType } = body

    console.log("[v0] Demo login API - received:", { email, businessName, businessType })

    const user = {
      id: "demo_" + Math.random().toString(36).substring(2, 15),
      email: email || "demo@payguard.ai",
      businessName: businessName || "Demo Business",
      businessType: businessType || "ecommerce",
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Demo login API - creating user:", user)

    const response = NextResponse.json({ success: true, user })

    response.cookies.set({
      name: "payguard_demo_session",
      value: JSON.stringify(user),
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Demo login API - cookie set, returning response")

    return response
  } catch (error) {
    console.error("[v0] Demo login error:", error)
    return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 })
  }
}
