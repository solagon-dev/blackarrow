'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'
import { analyticsConfig, isGa4Enabled } from '@/lib/analytics-config'

/**
 * Consent banner (Plan §5.4).
 *
 * Renders ONLY when a cookie-based analytics technology (GA4) is actually
 * configured for production AND consent has not yet been recorded — so we never
 * show a banner that controls nothing. The cookieless Ahrefs tag needs no consent.
 *
 * Visibility is read via useSyncExternalStore so it stays in sync with consent
 * changes without setState-in-effect or SSR hydration mismatch (server → hidden).
 */
function subscribeConsent(callback: () => void): () => void {
  window.addEventListener('ba-consent-change', callback)
  return () => window.removeEventListener('ba-consent-change', callback)
}
function shouldShowSnapshot(): boolean {
  if (!isGa4Enabled() || !analyticsConfig.gaRequiresConsent) return false
  return getConsent() === null
}

export default function ConsentBanner() {
  const visible = useSyncExternalStore(subscribeConsent, shouldShowSnapshot, () => false)

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Analytics cookie choice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-200 bg-white shadow-lg"
    >
      <div className="container-editorial flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-700">
          We use privacy-friendly analytics to understand how the site is used. With your
          consent, we also use Google Analytics.{' '}
          <Link href="/legal/privacy-policy" className="underline">
            Learn more
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="rounded border border-navy-300 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="rounded bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  )
}
