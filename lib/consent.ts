/**
 * Analytics consent state (Plan §5.4).
 *
 * Stored in a first-party cookie. Only cookie-based analytics (GA4) is gated by
 * this; the cookieless Ahrefs tag is unaffected. A consent UI is shown ONLY when
 * a cookie-based technology is actually configured, so we never display a banner
 * that controls nothing.
 */

export type ConsentValue = 'granted' | 'denied'

const COOKIE_NAME = 'ba_consent'

export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  const value = match.slice(COOKIE_NAME.length + 1)
  return value === 'granted' || value === 'denied' ? value : null
}

export function setConsent(value: ConsentValue): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + 180 * 864e5).toUTCString()
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`
  try {
    window.dispatchEvent(new CustomEvent('ba-consent-change', { detail: value }))
  } catch {
    // no-op
  }
}
