import { describe, it, expect, vi } from 'vitest'

// Sitemap reads published posts from the DB — mock it so the test is hermetic.
vi.mock('@/lib/db', () => ({
  getAllPosts: vi.fn(async () => [
    { slug: 'a-real-post', updated_at: '2026-05-01T00:00:00.000Z', published_at: '2026-04-01T00:00:00.000Z' },
  ]),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../next.config.js')

describe('legacy redirect corrections (§6.2)', () => {
  it('routes renters queries to the renters page, not rental-dwelling', async () => {
    const redirects = await nextConfig.redirects()
    const renters = redirects.filter((r: { source: string }) =>
      r.source === '/renters-insurance' || r.source === '/renter-insurance'
    )
    expect(renters).toHaveLength(2)
    for (const r of renters) {
      expect(r.destination).toBe('/insurance/renters')
      expect(r.permanent).toBe(true)
    }
  })

  it('routes flood queries to the flood page, not homeowners', async () => {
    const redirects = await nextConfig.redirects()
    const flood = redirects.find((r: { source: string }) => r.source === '/flood-insurance')
    expect(flood?.destination).toBe('/insurance/flood')
  })

  it('has no redirect whose destination is itself (no loops)', async () => {
    const redirects = await nextConfig.redirects()
    for (const r of redirects) {
      expect(r.source).not.toBe(r.destination)
    }
  })
})

describe('sitemap correctness (§6.6)', () => {
  it('includes the /insurance hub and omits build-time lastmod on non-post pages', async () => {
    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()
    const home = entries.find((e) => e.url === 'https://www.blackarrow.co')
    const hub = entries.find((e) => e.url === 'https://www.blackarrow.co/insurance')
    expect(home).toBeDefined()
    expect(hub).toBeDefined()
    // Static/content pages carry no unreliable build-time lastmod.
    expect(home?.lastModified).toBeUndefined()
    // Blog posts keep their real content timestamp.
    const post = entries.find((e) => e.url.includes('/post/a-real-post'))
    expect(post?.lastModified).toBeInstanceOf(Date)
  })

  it('only contains canonical www URLs (no redirected apex/duplicates)', async () => {
    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()
    for (const e of entries) {
      expect(e.url.startsWith('https://www.blackarrow.co')).toBe(true)
    }
  })
})
