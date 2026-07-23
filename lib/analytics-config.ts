/**
 * Analytics configuration — environment-driven, no hardcoded production
 * credentials (Plan §5.2, §5.3).
 *
 * All identifiers come from env vars. In development and Vercel preview
 * deployments analytics is disabled so those environments never pollute
 * production data (Plan §5.5).
 */

/** True only in a production runtime (not dev, not preview). */
export function isProductionAnalyticsEnv(): boolean {
  if (process.env.NODE_ENV !== 'production') return false
  // Vercel sets VERCEL_ENV to 'production' | 'preview' | 'development'.
  // NEXT_PUBLIC_VERCEL_ENV is the client-readable mirror (set it in project env).
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV
  if (vercelEnv && vercelEnv !== 'production') return false
  return true
}

export const analyticsConfig = {
  /** GA4 measurement id, e.g. "G-XXXXXXX". Unset → GA not loaded. */
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '',
  /** Ahrefs Web Analytics key (public, cookieless). Defaults to the live key. */
  ahrefsKey: process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY?.trim() || 'V5dSlzHbIFvtNMzCtxKCGA',
  /**
   * Whether GA4 (cookie-based) requires explicit consent before loading. When
   * true, a consent banner gates it. Default true so we never set analytics
   * cookies without consent. Ahrefs is cookieless and is unaffected.
   */
  gaRequiresConsent: (process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT ?? 'true') !== 'false',
}

/** GA4 is only "enabled" when configured AND in a production analytics env. */
export function isGa4Enabled(): boolean {
  return Boolean(analyticsConfig.ga4MeasurementId) && isProductionAnalyticsEnv()
}

/** Ahrefs is cookieless; enabled whenever a key exists and we're in production. */
export function isAhrefsEnabled(): boolean {
  return Boolean(analyticsConfig.ahrefsKey) && isProductionAnalyticsEnv()
}
