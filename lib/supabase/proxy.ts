import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const DEMO_SESSION_COOKIE = "payguard_demo_session"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const demoSession = request.cookies.get(DEMO_SESSION_COOKIE)
    const hasSession = !!demoSession?.value

    if (request.nextUrl.pathname.startsWith("/dashboard") && !hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith("/auth") && !request.nextUrl.pathname.includes("/callback") && hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const demoSession = request.cookies.get(DEMO_SESSION_COOKIE)
  const hasSession = !!demoSession?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages (except callback)
  if (request.nextUrl.pathname.startsWith("/auth") && !request.nextUrl.pathname.includes("/callback") && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
