import { MetadataRoute } from 'next'
import { insurancePages } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { serviceLocationPages } from '@/lib/service-location-data'
import { getAllPosts } from '@/lib/db'

/**
 * Slugs consolidated away to a canonical winner (Plan §6.1). These are excluded
 * from the sitemap and 301-redirected in next.config.js. A slug belongs here
 * ONLY after an evidence-based decision (Search Console / Ahrefs) — never on an
 * assumption. See docs/SEO-CONSOLIDATION.md for the decision record. Currently
 * empty: consolidation is pending SEO-data access, so no page is destroyed.
 */
const CONSOLIDATED_SLUGS = {
  insurance: new Set<string>([]),
  serviceLocation: new Set<string>([]),
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.blackarrow.co'

  // Plan §6.6: Google ignores priority/changefreq, and stamping every page's
  // lastmod with the build time is a false signal. We therefore OMIT lastmod on
  // pages that have no reliable per-page modification timestamp, and set it only
  // for blog posts (which carry real updated_at/published_at values). Only
  // canonical, indexable, 200-status URLs are included; consolidated/redirected
  // URLs are filtered out via CONSOLIDATED_SLUGS.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/insurance` },
    { url: `${baseUrl}/quote` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/locations` },
    { url: `${baseUrl}/our-story` },
    { url: `${baseUrl}/insights` },
    { url: `${baseUrl}/file-a-claim` },
    { url: `${baseUrl}/change-mortgagee` },
    { url: `${baseUrl}/loan-number-change` },
    { url: `${baseUrl}/legal/privacy-policy` },
    { url: `${baseUrl}/legal/terms-of-use` },
  ]

  const insurancePageUrls: MetadataRoute.Sitemap = insurancePages
    .filter(page => !CONSOLIDATED_SLUGS.insurance.has(page.slug))
    .map(page => ({ url: `${baseUrl}/insurance/${page.slug}` }))

  const locationPageUrls: MetadataRoute.Sitemap = locationPages.map(page => ({
    url: `${baseUrl}/locations/${page.slug}`,
  }))

  const serviceLocationUrls: MetadataRoute.Sitemap = serviceLocationPages
    .filter(page => !CONSOLIDATED_SLUGS.serviceLocation.has(page.slug))
    .map(page => ({ url: `${baseUrl}/${page.slug}` }))

  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts('published')
    blogUrls = posts
      .filter(post => post.updated_at || post.published_at)
      .map(post => ({
        url: `${baseUrl}/post/${post.slug}`,
        // Real content timestamp — the one reliable lastmod we have.
        lastModified: new Date(post.updated_at || (post.published_at as string)),
      }))
  } catch {}

  return [...staticPages, ...insurancePageUrls, ...locationPageUrls, ...serviceLocationUrls, ...blogUrls]
}
