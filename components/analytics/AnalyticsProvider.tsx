'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { captureAttribution, ATTRIBUTION_PARAMS } from '@/lib/attribution'
import { analyticsConfig, isGa4Enabled } from '@/lib/analytics-config'
import { getConsent } from '@/lib/consent'

/** External-store subscription so GA gating reacts to consent changes without
 *  setState-in-effect or SSR hydration mismatch. */
function subscribeConsent(callback: () => void): () => void {
  window.addEventListener('ba-consent-change', callback)
  return () => window.removeEventListener('ba-consent-change', callback)
}
function gaAllowedSnapshot(): boolean {
  if (!isGa4Enabled()) return false
  if (!analyticsConfig.gaRequiresConsent) return true
  return getConsent() === 'granted'
}

/**
 * Client analytics orchestrator (Plan §5.1, §5.2, §5.5).
 *
 *  - Captures campaign attribution from the landing URL on first load, then
 *    cleans the visible URL via history.replaceState (attribution already saved).
 *  - Tracks a page_view on every route change.
 *  - Loads GA4 only when configured for production AND consent allows it. Ahrefs
 *    (cookieless) is loaded in the root layout independently.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname()
  const initialized = useRef(false)
  const gaInitialized = useRef(false)
  const lastPageView = useRef<string | null>(null)
  const gaAllowed = useSyncExternalStore(subscribeConsent, gaAllowedSnapshot, () => false)

  // First load: capture attribution, then strip campaign params from the URL.
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      captureAttribution(new Date().toISOString())
      const url = new URL(window.location.href)
      let changed = false
      for (const param of ATTRIBUTION_PARAMS) {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param)
          changed = true
        }
      }
      if (changed) {
        const cleaned = url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash
        window.history.replaceState(window.history.state, '', cleaned)
      }
    } catch {
      // never block rendering
    }
  }, [])

  // Install gtag's queue shim and push js/config BEFORE any event is sent.
  //
  // Declared ahead of the page-view effect on purpose: effects run in
  // declaration order, and gtag.js is afterInteractive, so on first paint
  // window.gtag does not exist yet. Without the shim, track() falls back to
  // dataLayer.push({event}) — GTM object syntax, which gtag.js never consumes —
  // and with send_page_view:false the landing page view was silently dropped.
  // The shim queues calls in gtag's arguments form so gtag.js replays them
  // in order (js → config → event) once it loads.
  useEffect(() => {
    if (!gaAllowed) return
    const id = analyticsConfig.ga4MeasurementId
    if (!id) return
    window.dataLayer = window.dataLayer || []
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        window.dataLayer?.push(arguments)
      }
    }
    if (gaInitialized.current) return
    gaInitialized.current = true
    window.gtag('js', new Date())
    window.gtag('config', id, { anonymize_ip: true, send_page_view: false })
  }, [gaAllowed])

  // Track page views on navigation, and once more when consent first flips GA
  // on, so the page the visitor actually consented on is still recorded.
  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}|${gaAllowed}`
    if (lastPageView.current === key) return
    lastPageView.current = key
    analytics.pageView(pathname)
  }, [pathname, gaAllowed])

  // Delegated tracking for phone / email / directions clicks site-wide (§5.2),
  // so we don't have to instrument every link. No PII is sent.
  useEffect(() => {
    function officeFromPhone(href: string): string {
      const digits = href.replace(/\D/g, '')
      if (digits.includes('9555898')) return 'greenville'
      if (digits.includes('9146074')) return 'whiteville'
      return 'unknown'
    }
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest?.('a')
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      if (href.startsWith('tel:')) {
        analytics.phoneClick(officeFromPhone(href), window.location.pathname)
      } else if (href.startsWith('mailto:')) {
        analytics.emailClick('agency')
      } else if (/(?:maps\.google|google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i.test(href)) {
        analytics.directionsClick('agency')
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  if (!gaAllowed) return null

  const id = analyticsConfig.ga4MeasurementId
  // js/config are queued by the init effect above, not inlined here — an inline
  // afterInteractive script would run after the first page-view effect and
  // re-issue config on every consent change.
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />

}
