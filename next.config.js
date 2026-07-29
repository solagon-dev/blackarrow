/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimization was previously disabled outright, which meant every visitor
    // downloaded the full-size source: 1024x1024 PNG article art (375–770 KB
    // each) and uncompressed carrier logos. /insights alone shipped ~25 MB.
    // With the optimizer on, Next serves AVIF/WebP at the requested size and
    // caches the result, so the same art lands in tens of kilobytes.
    formats: ['image/avif', 'image/webp'],
    // Article art is square and never rendered wider than ~800 CSS px; the
    // small end of imageSizes covers card thumbnails and carrier logos.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
    // Optimized derivatives are immutable — cache them for a year.
    minimumCacheTTL: 31536000,
    // Admin-uploaded featured images land in Vercel Blob; local art is served
    // from /public. Anything else is rejected rather than silently proxied.
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  serverExternalPackages: ['better-sqlite3'],
  // Normalize trailing slash behavior to prevent canonical/redirect duplicate-content signals.
  trailingSlash: false,
  async redirects() {
    return [
      // Common legacy paths → canonical /insurance/* URLs
      { source: '/home-insurance', destination: '/insurance/homeowners', permanent: true },
      { source: '/homeowners-insurance', destination: '/insurance/homeowners', permanent: true },
      { source: '/auto-insurance', destination: '/insurance/auto', permanent: true },
      { source: '/car-insurance', destination: '/insurance/auto', permanent: true },
      { source: '/life-insurance', destination: '/insurance/life', permanent: true },
      { source: '/business-insurance', destination: '/insurance/business-owners-package', permanent: true },
      { source: '/commercial-insurance', destination: '/insurance/commercial-property', permanent: true },
      { source: '/commercial-auto-insurance', destination: '/insurance/commercial-auto', permanent: true },
      { source: '/general-liability-insurance', destination: '/insurance/general-liability', permanent: true },
      { source: '/workers-comp-insurance', destination: '/insurance/workers-compensation', permanent: true },
      { source: '/workers-compensation', destination: '/insurance/workers-compensation', permanent: true },
      { source: '/cyber-liability-insurance', destination: '/insurance/cyber-liability', permanent: true },
      { source: '/boat-insurance', destination: '/insurance/boat', permanent: true },
      { source: '/builders-risk-insurance', destination: '/insurance/builders-risk', permanent: true },
      { source: '/short-term-rental-insurance', destination: '/insurance/short-term-rental', permanent: true },
      { source: '/airbnb-insurance', destination: '/insurance/short-term-rental', permanent: true },
      { source: '/vacation-rental-insurance', destination: '/insurance/short-term-rental', permanent: true },
      { source: '/rental-property-insurance', destination: '/insurance/rental-dwelling', permanent: true },
      { source: '/landlord-insurance', destination: '/insurance/rental-dwelling', permanent: true },
      { source: '/vacant-property-insurance', destination: '/insurance/vacant-unoccupied', permanent: true },
      { source: '/equipment-insurance', destination: '/insurance/equipment', permanent: true },
      // Legacy location paths
      { source: '/greenville', destination: '/locations/greenville-nc', permanent: true },
      { source: '/whiteville', destination: '/locations/whiteville-nc', permanent: true },
      { source: '/wilmington', destination: '/locations/wilmington-nc', permanent: true },
      { source: '/raleigh', destination: '/locations/raleigh-nc', permanent: true },
      // Blog / content legacy paths
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/blog/:slug', destination: '/post/:slug', permanent: true },
      { source: '/articles', destination: '/insights', permanent: true },
      { source: '/articles/:slug', destination: '/post/:slug', permanent: true },
      { source: '/resources', destination: '/insights', permanent: true },
      // Informational pages
      { source: '/about', destination: '/our-story', permanent: true },
      { source: '/about-us', destination: '/our-story', permanent: true },
      { source: '/team', destination: '/our-story', permanent: true },
      { source: '/claims', destination: '/file-a-claim', permanent: true },
      { source: '/file-claim', destination: '/file-a-claim', permanent: true },
      { source: '/get-a-quote', destination: '/quote', permanent: true },
      { source: '/request-a-quote', destination: '/quote', permanent: true },
      { source: '/quote-request', destination: '/quote', permanent: true },
      { source: '/free-quote', destination: '/quote', permanent: true },
      // Additional informational + legacy paths that were returning 4XX
      { source: '/privacy', destination: '/legal/privacy-policy', permanent: true },
      { source: '/privacy-policy', destination: '/legal/privacy-policy', permanent: true },
      { source: '/terms', destination: '/legal/terms-of-use', permanent: true },
      { source: '/terms-of-service', destination: '/legal/terms-of-use', permanent: true },
      { source: '/terms-of-use', destination: '/legal/terms-of-use', permanent: true },
      { source: '/tos', destination: '/legal/terms-of-use', permanent: true },
      // Legacy city-only and alternate-phrasing URLs seen in backlink data
      { source: '/locations/greenville', destination: '/locations/greenville-nc', permanent: true },
      { source: '/locations/whiteville', destination: '/locations/whiteville-nc', permanent: true },
      { source: '/locations/wilmington', destination: '/locations/wilmington-nc', permanent: true },
      { source: '/locations/raleigh', destination: '/locations/raleigh-nc', permanent: true },
      { source: '/greenville-nc', destination: '/locations/greenville-nc', permanent: true },
      { source: '/whiteville-nc', destination: '/locations/whiteville-nc', permanent: true },
      { source: '/wilmington-nc', destination: '/locations/wilmington-nc', permanent: true },
      { source: '/raleigh-nc', destination: '/locations/raleigh-nc', permanent: true },
      // Common misspellings / alternate service paths
      { source: '/homeinsurance', destination: '/insurance/homeowners', permanent: true },
      { source: '/autoinsurance', destination: '/insurance/auto', permanent: true },
      { source: '/businessinsurance', destination: '/insurance/business-owners-package', permanent: true },
      { source: '/lifeinsurance', destination: '/insurance/life', permanent: true },
      // Renters insurance is tenant contents/liability coverage — route to the
      // dedicated renters page, NOT landlord/rental-dwelling coverage (Plan §6.2).
      { source: '/renters-insurance', destination: '/insurance/renters', permanent: true },
      { source: '/renter-insurance', destination: '/insurance/renters', permanent: true },
      // A dedicated flood page exists — route flood queries there, not homeowners
      // (standard homeowners excludes flood) (Plan §6.2).
      { source: '/flood-insurance', destination: '/insurance/flood', permanent: true },
      // No dedicated windstorm/hurricane page yet. Wind is a homeowners peril, so
      // homeowners is the most relevant destination; the homeowners page cross-links
      // flood for the water side of storm risk. Revisit if a wind/hurricane guide
      // is published (Plan §6.2, §11.3).
      { source: '/hurricane-insurance', destination: '/insurance/homeowners', permanent: true },
      { source: '/windstorm-insurance', destination: '/insurance/homeowners', permanent: true },
      // Content paths that shifted
      { source: '/news', destination: '/insights', permanent: true },
      { source: '/news/:slug', destination: '/post/:slug', permanent: true },
      { source: '/content/:slug', destination: '/post/:slug', permanent: true },
      { source: '/insights/:slug', destination: '/post/:slug', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/reach-us', destination: '/contact', permanent: true },
      // Sitemaps / feeds sometimes linked externally
      { source: '/feed', destination: '/insights', permanent: true },
      { source: '/rss', destination: '/insights', permanent: true },
      { source: '/rss.xml', destination: '/insights', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Long-cache static assets (images, fonts, video)
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
          { key: 'Content-Type', value: 'application/xml' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
