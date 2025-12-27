// In-memory store for velocity tracking
const memoryStore = new Map<string, { score: number; member: string }[]>()

// Velocity tracking keys
export const velocityKeys = {
  ipTransactions: (ip: string, windowMinutes: number) => `velocity:ip:${ip}:${windowMinutes}m`,
  cardTransactions: (cardBin: string, windowMinutes: number) => `velocity:card:${cardBin}:${windowMinutes}m`,
  emailTransactions: (email: string, windowMinutes: number) => `velocity:email:${email}:${windowMinutes}m`,
  deviceTransactions: (fingerprint: string, windowMinutes: number) =>
    `velocity:device:${fingerprint}:${windowMinutes}m`,
}

export async function trackTransaction(data: {
  ip?: string
  cardBin?: string
  email?: string
  deviceFingerprint?: string
  amount: number
}): Promise<void> {
  try {
    const now = Date.now()
    const windows = [5, 15, 60]

    for (const window of windows) {
      if (data.ip) {
        const key = velocityKeys.ipTransactions(data.ip, window)
        if (!memoryStore.has(key)) memoryStore.set(key, [])
        memoryStore.get(key)!.push({ score: now, member: `${now}:${data.amount}` })
      }
      if (data.cardBin) {
        const key = velocityKeys.cardTransactions(data.cardBin, window)
        if (!memoryStore.has(key)) memoryStore.set(key, [])
        memoryStore.get(key)!.push({ score: now, member: `${now}:${data.amount}` })
      }
      if (data.email) {
        const key = velocityKeys.emailTransactions(data.email.toLowerCase(), window)
        if (!memoryStore.has(key)) memoryStore.set(key, [])
        memoryStore.get(key)!.push({ score: now, member: `${now}:${data.amount}` })
      }
      if (data.deviceFingerprint) {
        const key = velocityKeys.deviceTransactions(data.deviceFingerprint, window)
        if (!memoryStore.has(key)) memoryStore.set(key, [])
        memoryStore.get(key)!.push({ score: now, member: `${now}:${data.amount}` })
      }
    }

    // Clean up old entries (older than 60 minutes)
    const cutoff = now - 60 * 60 * 1000
    memoryStore.forEach((entries, key) => {
      const filtered = entries.filter((e) => e.score >= cutoff)
      if (filtered.length === 0) {
        memoryStore.delete(key)
      } else {
        memoryStore.set(key, filtered)
      }
    })
  } catch (error) {
    // Silently handle errors to prevent API failures
    console.warn("Velocity tracking error (non-critical):", error)
  }
}

export async function getVelocityCounts(data: {
  ip?: string
  cardBin?: string
  email?: string
  deviceFingerprint?: string
}): Promise<{
  ip_5m: number
  ip_15m: number
  card_5m: number
  card_15m: number
  email_5m: number
  email_15m: number
  device_5m: number
  device_15m: number
}> {
  const now = Date.now()
  const defaultCounts = {
    ip_5m: 0,
    ip_15m: 0,
    card_5m: 0,
    card_15m: 0,
    email_5m: 0,
    email_15m: 0,
    device_5m: 0,
    device_15m: 0,
  }

  try {
    const countInWindow = (key: string, windowMs: number): number => {
      const entries = memoryStore.get(key) || []
      const minTime = now - windowMs
      return entries.filter((e) => e.score >= minTime).length
    }

    if (data.ip) {
      defaultCounts.ip_5m = countInWindow(velocityKeys.ipTransactions(data.ip, 5), 5 * 60 * 1000)
      defaultCounts.ip_15m = countInWindow(velocityKeys.ipTransactions(data.ip, 15), 15 * 60 * 1000)
    }
    if (data.cardBin) {
      defaultCounts.card_5m = countInWindow(velocityKeys.cardTransactions(data.cardBin, 5), 5 * 60 * 1000)
      defaultCounts.card_15m = countInWindow(velocityKeys.cardTransactions(data.cardBin, 15), 15 * 60 * 1000)
    }
    if (data.email) {
      defaultCounts.email_5m = countInWindow(velocityKeys.emailTransactions(data.email.toLowerCase(), 5), 5 * 60 * 1000)
      defaultCounts.email_15m = countInWindow(
        velocityKeys.emailTransactions(data.email.toLowerCase(), 15),
        15 * 60 * 1000,
      )
    }
    if (data.deviceFingerprint) {
      defaultCounts.device_5m = countInWindow(velocityKeys.deviceTransactions(data.deviceFingerprint, 5), 5 * 60 * 1000)
      defaultCounts.device_15m = countInWindow(
        velocityKeys.deviceTransactions(data.deviceFingerprint, 15),
        15 * 60 * 1000,
      )
    }
  } catch (error) {
    console.warn("Velocity count error (non-critical):", error)
  }

  return defaultCounts
}

// Dummy export for backward compatibility
export const redis = null
