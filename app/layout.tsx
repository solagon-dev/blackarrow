import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    default: 'BlackArrow Insurance | Trusted Insurance Solutions in Eastern NC',
    template: '%s | BlackArrow Insurance',
  },
  description: 'BlackArrow Insurance provides comprehensive personal, commercial, and property insurance solutions across Eastern North Carolina. Locally owned for over 20 years. Get a free quote today.',
  keywords: 'insurance, auto insurance, home insurance, life insurance, business insurance, commercial insurance, Eastern North Carolina, Greenville NC, insurance quotes',
  authors: [{ name: 'BlackArrow Insurance' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BlackArrow Insurance | Trusted Insurance Solutions',
    description: 'Comprehensive insurance solutions tailored to your needs. Personal, commercial, and property coverage from a trusted local agency.',
    url: 'https://www.blackarrow.co',
    type: 'website',
    locale: 'en_US',
    siteName: 'BlackArrow Insurance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackArrow Insurance',
    description: 'Trusted Insurance Solutions in Eastern NC',
  },
  icons: {
    icon: '/images/BlackArrow_Favicon.svg',
    shortcut: '/images/BlackArrow_Favicon.svg',
    apple: '/images/BlackArrow_Favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://www.blackarrow.co'),
}

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': 'https://www.blackarrow.co/#organization',
    name: 'BlackArrow Insurance',
    url: 'https://www.blackarrow.co',
    logo: 'https://www.blackarrow.co/images/BlackArrow_Favicon.svg',
    description: 'BlackArrow Insurance provides comprehensive personal, commercial, and property insurance solutions across Eastern North Carolina. Locally owned for over 20 years.',
    foundingDate: '2002',
    areaServed: {
      '@type': 'State',
      name: 'North Carolina',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-252-955-5898',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: 'English',
      },
    ],
    sameAs: [],
    location: [
      {
        '@type': 'LocalBusiness',
        name: 'BlackArrow Insurance - Greenville',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '905 Conference Dr. 2B',
          addressLocality: 'Greenville',
          addressRegion: 'NC',
          postalCode: '27858',
          addressCountry: 'US',
        },
        telephone: '+1-252-955-5898',
        email: 'service@blackarrowfg.com',
        openingHours: 'Mo-Fr 09:00-17:30',
      },
      {
        '@type': 'LocalBusiness',
        name: 'BlackArrow Insurance - Whiteville',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '301 Liberty St. Ste 101',
          addressLocality: 'Whiteville',
          addressRegion: 'NC',
          postalCode: '28472',
          addressCountry: 'US',
        },
        telephone: '+1-910-914-6074',
        email: 'service@blackarrowfg.com',
        openingHours: 'Mo-Fr 09:00-17:00',
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.blackarrow.co/#website',
    name: 'BlackArrow Insurance',
    url: 'https://www.blackarrow.co',
    publisher: { '@id': 'https://www.blackarrow.co/#organization' },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        {/* Ahrefs Web Analytics — raw <script> so the tag renders in initial HTML
            with data-key intact, avoiding issues with next/script client-side injection
            dropping custom data-* attributes in some Next.js versions. */}
        <script async src="https://analytics.ahrefs.com/analytics.js" data-key="V5dSlzHbIFvtNMzCtxKCGA"></script>
        <div id="site-header"><Header /></div>
        <main className="min-h-screen">
          {children}
        </main>
        <div id="site-footer"><Footer /></div>
      </body>
    </html>
  )
}
