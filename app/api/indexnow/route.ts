import { NextResponse } from 'next/server'
const SITE_URL = 'https://www.blackarrow.co'

/**
 * IndexNow integration — submits URLs to Bing, Yandex, Naver, and Seznam
 * via the unified IndexNow API. Bing-led standard; Google ignores
 * gracefully.
 *
 * Usage: POST /api/indexnow with { urls: string[] | string }
 * Typical caller: webhook from CMS on publish/update.
 *
 * Verification: /public/e780af2f8725e1dc41e3d66c854ed2e8.txt holds the key so search engines
 * can confirm we own the domain before accepting submissions.
 */
const INDEXNOW_KEY = 'e780af2f8725e1dc41e3d66c854ed2e8'
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

export async function POST(request: Request) {
  let body: { urls?: string | string[] } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const urls = Array.isArray(body.urls)
    ? body.urls
    : typeof body.urls === 'string'
    ? [body.urls]
    : []

  if (urls.length === 0) {
    return NextResponse.json(
      { error: 'No URLs provided. Send { urls: string[] | string }.' },
      { status: 400 }
    )
  }

  const siteUrl = SITE_URL
  const host = new URL(siteUrl).host

  const sameHostUrls = urls
    .map((u) => (u.startsWith('http') ? u : `${siteUrl}${u.startsWith('/') ? '' : '/'}${u}`))
    .filter((u) => {
      try {
        return new URL(u).host === host
      } catch {
        return false
      }
    })

  if (sameHostUrls.length === 0) {
    return NextResponse.json(
      { error: `All URLs must be on ${host}` },
      { status: 400 }
    )
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
    urlList: sameHostUrls,
  }

  const results = await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => ({ endpoint, status: r.status }))
    )
  )

  return NextResponse.json({
    submitted: sameHostUrls.length,
    urls: sameHostUrls,
    results: results.map((r) =>
      r.status === 'fulfilled' ? r.value : { error: String(r.reason) }
    ),
  })
}
