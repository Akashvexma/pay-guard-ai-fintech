// Demo authentication for hackathon - uses localStorage to bypass cookie issues
// Server-side: we check for a header that client sets
// Client-side: we use localStorage

export const DEMO_SESSION_KEY = "payguard_demo_session"

export interface DemoUser {
  id: string
  email: string
  businessName: string
  businessType: string
  createdAt: string
}

// Client-side functions
export function setDemoSessionClient(user: DemoUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
  }
}

export function getDemoSessionClient(): DemoUser | null {
  if (typeof window === "undefined") return null
  try {
    const session = localStorage.getItem(DEMO_SESSION_KEY)
    if (!session) return null
    return JSON.parse(session) as DemoUser
  } catch {
    return null
  }
}

export function clearDemoSessionClient(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_SESSION_KEY)
  }
}

export const clearDemoSession = clearDemoSessionClient

export function generateDemoId(): string {
  return "demo_" + Math.random().toString(36).substring(2, 15)
}
