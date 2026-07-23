/**
 * Minimal in-memory sliding-window rate limiter (Plan §4.5.12).
 *
 * NOTE ON DURABILITY: on serverless (Vercel), memory is per-instance, so this
 * throttles abusive bursts against a single warm instance rather than providing
 * a global guarantee. It is a reasonable first line of defense combined with
 * reCAPTCHA. For a hard global limit, back this with Upstash/Redis (documented
 * in the implementation log as a future enhancement).
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
let lastSweep = 0

function sweep(now: number) {
  // Opportunistically drop expired buckets so the map can't grow unbounded.
  if (now - lastSweep < 60_000) return
  lastSweep = now
  const expired: string[] = []
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) expired.push(key)
  })
  expired.forEach((key) => buckets.delete(key))
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 }
}

/** Test helper — clears all buckets. */
export function __resetRateLimit() {
  buckets.clear()
  lastSweep = 0
}
