type RateLimitStore = Map<string, { count: number; resetTime: number }>

const store: RateLimitStore = new Map()

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const record = store.get(identifier)

  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return true
  }

  if (record.count >= config.maxRequests) {
    return false
  }

  record.count++
  return true
}

export function getRateLimitInfo(identifier: string) {
  const record = store.get(identifier)
  if (!record) {
    return { remaining: 0, resetTime: 0 }
  }

  return {
    remaining: Math.max(0, record.count),
    resetTime: record.resetTime,
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key)
    }
  }
}, 60000) // Clean up every minute
