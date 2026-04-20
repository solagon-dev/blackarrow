import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge middleware — SEO hygiene.
 *
 * Fixes three Ahrefs-flagged issues at the edge:
 *
 * 1. Apex → www in a single 301 hop. Vercel's default is a 308 chain
 *    (http://apex → https://apex → https://www), which Ahrefs counts as a
 *    "3XX page receives organic traffic" error for every backlink pointing at
 *    the apex domain. This middleware short-circuits that to one 301 hop for
 *    any non-preview hostname that isn't the canonical www host.
 *
 * 2. Strip tracking query params (utm_*, fbclid, gclid, mc_cid, mc_eid, msclkid)
 *    via 301 so Google doesn't index parametered variants as separate URLs.
 *
 * 3. Return 301 (not 308) for canonicalization redirects so older SEO tools
 *    that don't handle 308 correctly still pick up the permanent signal.
 *
 * The middleware is a no-op for Vercel preview URLs (*.vercel.app) and for
 * localhost so development and preview deploys work without redirect loops.
 */

const CANONICAL_HOST = 'www.blackarrow.co'
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid', '_ga', 'yclid',
]

function isInternalOrPreviewHost(host: string): boolean {
  return (
    host.endsWith('.vercel.app') ||
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('0.0.0.0')
  )
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host') || ''

  // Skip preview/dev hosts so deploys and local dev work.
  if (isInternalOrPreviewHost(host)) {
    return NextResponse.next()
  }

  // 1. Canonical-host enforcement. Anything that isn't the apex www host gets
  //    redirected in a single 301 hop, preserving path + query.
  if (host !== CANONICAL_HOST) {
    url.host = CANONICAL_HOST
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // 2. Strip tracking parameters before indexing.
  let trackingParamFound = false
  for (const param of TRACKING_PARAMS) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      trackingParamFound = true
    }
  }
  if (trackingParamFound) {
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  // Apply to every request except Next internals + static asset paths.
  // The static-asset exclusion keeps images/fonts/CSS out of the redirect logic.
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|images/|fonts/|robots.txt|sitemap.xml|api/).*)',
  ],
}
