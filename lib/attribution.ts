/**
 * First-party campaign attribution (Plan §5.1, §5.2).
 *
 * Parses UTM + click-ID parameters from the landing URL and persists them in a
 * first-party cookie on first touch, so attribution survives even after the
 * visible URL is cleaned. Pure parsing is separated from browser storage so it
 * can be unit-tested without a DOM.
 */

export const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'yclid',
  'mc_cid',
  'mc_eid',
] as const

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number]
export type Attribution = Partial<Record<AttributionParam, string>> & {
  landing_path?: string
  referrer?: string
  first_seen?: string
}

const COOKIE_NAME = 'ba_attribution'
const MAX_VALUE_LEN = 200

/** Pure: extract known attribution params from a query string / URLSearchParams. */
export function parseAttribution(search: string | URLSearchParams): Attribution {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const out: Attribution = {}
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)
    if (value) out[key] = value.slice(0, MAX_VALUE_LEN)
  }
  return out
}

/** Whether an attribution object carries any campaign signal. */
export function hasAttribution(attr: Attribution): boolean {
  return ATTRIBUTION_PARAMS.some((k) => Boolean(attr[k]))
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/** Read the persisted first-touch attribution, if any. */
export function getStoredAttribution(): Attribution | null {
  const raw = readCookie(COOKIE_NAME)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Attribution
  } catch {
    return null
  }
}

/**
 * Capture attribution on the client from the current URL. First-touch wins: an
 * existing stored attribution is not overwritten by a later organic visit.
 * Returns the effective attribution (stored or newly captured), or null.
 */
export function captureAttribution(now: string): Attribution | null {
  if (typeof window === 'undefined') return null

  const existing = getStoredAttribution()
  if (existing && hasAttribution(existing)) return existing

  const fresh = parseAttribution(window.location.search)
  if (!hasAttribution(fresh)) return existing // nothing to capture

  fresh.landing_path = window.location.pathname.slice(0, MAX_VALUE_LEN)
  fresh.referrer = (document.referrer || '').slice(0, MAX_VALUE_LEN)
  fresh.first_seen = now
  writeCookie(COOKIE_NAME, JSON.stringify(fresh), 90)
  return fresh
}
