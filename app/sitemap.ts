import { MetadataRoute } from 'next'
import { insurancePages } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { serviceLocationPages } from '@/lib/service-location-data'
import { getAllPosts } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.blackarrow.co'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/our-story`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/quote`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/change-mortgagee`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/loan-number-change`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/file-a-claim`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/legal/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/legal/terms-of-use`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  const insurancePageUrls = insurancePages.map(page => ({
    url: `${baseUrl}/insurance/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const locationPageUrls = locationPages.map(page => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts('published')
    blogUrls = posts.map(post => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {}

  const serviceLocationUrls = serviceLocationPages.map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...insurancePageUrls, ...locationPageUrls, ...serviceLocationUrls, ...blogUrls]
}
