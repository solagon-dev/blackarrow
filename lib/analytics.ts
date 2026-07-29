/**
 * Typed analytics event layer (Plan §5.2).
 *
 * Components call the small typed helpers here instead of embedding vendor calls.
 * Events are dispatched to a generic `dataLayer` and to GA4 `gtag` when present.
 *
 * GUARANTEES:
 *  - Never throws — analytics failure must never block navigation or forms (§5.5).
 *  - Never sends PII — params are sanitized; values that look like emails/phones
 *    are dropped, and only short scalar metadata is forwarded (§5.5).
 */

import { getStoredAttribution } from './attribution'

/** Canonical event names — the documented event dictionary. */
export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  directionsClick: 'directions_click',
  quoteStart: 'quote_start',
  quoteStepComplete: 'quote_step_complete',
  quoteValidationError: 'quote_validation_error',
  quoteAbandon: 'quote_abandon',
  quoteSubmit: 'quote_submit',
  contactSubmit: 'contact_submit',
  policyManagementSubmit: 'policy_management_submit',
  claimOutboundClick: 'claim_outbound_click',
  articleCtaClick: 'article_cta_click',
} as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

export type AnalyticsParams = Record<string, string | number | boolean>

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/
const MAX_VALUE_LEN = 100

/** Drop PII-looking values, coerce to scalars, and truncate strings. */
export function sanitizeParams(params?: AnalyticsParams): AnalyticsParams {
  const out: AnalyticsParams = {}
  if (!params) return out
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue
    if (typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value
      continue
    }
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) continue
      if (EMAIL_RE.test(trimmed) || PHONE_RE.test(trimmed)) continue // never forward PII
      out[key] = trimmed.slice(0, MAX_VALUE_LEN)
    }
  }
  return out
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Low-level track. Safe no-op on the server or if analytics isn't present. */
export function track(event: AnalyticsEventName, params?: AnalyticsParams): void {
  try {
    if (typeof window === 'undefined') return
    const clean = sanitizeParams(params)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...clean })
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, clean)
    }
  } catch {
    // Analytics must never break the app.
  }
}

/** Merge campaign attribution (source/medium/campaign) into conversion params. */
function withAttribution(params: AnalyticsParams): AnalyticsParams {
  try {
    const attr = getStoredAttribution()
    if (!attr) return params
    return {
      ...params,
      ...(attr.utm_source ? { source: attr.utm_source } : {}),
      ...(attr.utm_medium ? { medium: attr.utm_medium } : {}),
      ...(attr.utm_campaign ? { campaign: attr.utm_campaign } : {}),
      ...(attr.landing_path ? { landing_path: attr.landing_path } : {}),
    }
  } catch {
    return params
  }
}

/** Typed convenience helpers so components never touch vendor APIs directly. */
export const analytics = {
  pageView: (path: string) => track(ANALYTICS_EVENTS.pageView, { page_path: path }),
  phoneClick: (office: string, page: string) =>
    track(ANALYTICS_EVENTS.phoneClick, { office, page_path: page }),
  emailClick: (office: string) => track(ANALYTICS_EVENTS.emailClick, { office }),
  directionsClick: (office: string) => track(ANALYTICS_EVENTS.directionsClick, { office }),
  quoteStart: (coverage?: string) =>
    track(ANALYTICS_EVENTS.quoteStart, coverage ? { coverage } : {}),
  quoteStepComplete: (step: number, coverage?: string) =>
    track(ANALYTICS_EVENTS.quoteStepComplete, { step, ...(coverage ? { coverage } : {}) }),
  quoteValidationError: (step: number, field?: string) =>
    track(ANALYTICS_EVENTS.quoteValidationError, { step, ...(field ? { field } : {}) }),
  quoteSubmit: (coverage?: string) =>
    track(ANALYTICS_EVENTS.quoteSubmit, withAttribution(coverage ? { coverage } : {})),
  contactSubmit: () => track(ANALYTICS_EVENTS.contactSubmit, withAttribution({})),
  policyManagementSubmit: (kind: string) =>
    track(ANALYTICS_EVENTS.policyManagementSubmit, { kind }),
  claimOutboundClick: (carrier: string) =>
    track(ANALYTICS_EVENTS.claimOutboundClick, { carrier }),
  articleCtaClick: (target: string, article: string) =>
    track(ANALYTICS_EVENTS.articleCtaClick, { target, article }),
}
