import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Just pass through - let the dashboard layout handle auth checks
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
