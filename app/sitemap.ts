import { MetadataRoute } from 'next'
import { insurancePages } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { serviceLocationPages } from '@/lib/service-location-data'
import { getAllPosts } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.blackarrow.co'
  const now = new Date()

  // Priorities follow SEO best practice: money pages (quote) rank highest under the home page;
  // service + location pages sit at 0.8; informational pages lower.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/quote`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/our-story`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/file-a-claim`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/change-mortgagee`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/loan-number-change`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/legal/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/terms-of-use`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const insurancePageUrls: MetadataRoute.Sitemap = insurancePages.map(page => ({
    url: `${baseUrl}/insurance/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const locationPageUrls: MetadataRoute.Sitemap = locationPages.map(page => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const serviceLocationUrls: MetadataRoute.Sitemap = serviceLocationPages.map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts('published')
    blogUrls = posts.map(post => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updated_at
        ? new Date(post.updated_at)
        : (post.published_at ? new Date(post.published_at) : now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {}

  return [...staticPages, ...insurancePageUrls, ...locationPageUrls, ...serviceLocationUrls, ...blogUrls]
}
