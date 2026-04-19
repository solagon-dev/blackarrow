import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/_next/',
          '/*?*utm_', // block tracking-parameter URLs from being indexed as separate pages
          '/*?*fbclid',
          '/*?*gclid',
        ],
      },
      // Explicitly block AI training crawlers that don't send referral traffic or attribution.
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' }, // allow Anthropic crawler
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: 'https://www.blackarrow.co/sitemap.xml',
    host: 'https://www.blackarrow.co',
  }
}
