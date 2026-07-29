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

  // Track page views on navigation.
  useEffect(() => {
    if (!pathname) return
    analytics.pageView(pathname)
  }, [pathname])

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
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true, send_page_view: false });
        `}
      </Script>
    </>
  )
}
