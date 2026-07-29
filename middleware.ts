import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge middleware — canonical host enforcement.
 *
 * 1. Apex → www in a single 301 hop. Vercel's default is a 308 chain
 *    (http://apex → https://apex → https://www), which Ahrefs counts as a
 *    "3XX page receives organic traffic" error for every backlink pointing at
 *    the apex domain. This middleware short-circuits that to one 301 hop for
 *    any non-preview hostname that isn't the canonical www host. The full query
 *    string (including campaign parameters) is PRESERVED across the hop.
 *
 * CAMPAIGN ATTRIBUTION (Plan §5.1): this middleware no longer strips utm_ or
 * click-ID parameters. Doing so previously destroyed attribution before any
 * client analytics could record it. Duplicate-content for parametered URLs is
 * handled by the canonical tags already present on every page (see each route's
 * `alternates.canonical`), which is the correct mechanism — not redirects.
 * The client analytics layer records attribution on first load and then cleans
 * the visible URL via history.replaceState (see components/analytics).
 */

const CANONICAL_HOST = 'www.blackarrow.co'

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

  // Canonical-host enforcement. Anything that isn't the apex www host gets
  // redirected in a single 301 hop, preserving path + query (attribution intact).
  if (host !== CANONICAL_HOST) {
    url.host = CANONICAL_HOST
    url.protocol = 'https:'
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
