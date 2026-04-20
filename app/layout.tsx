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


const ogImage = '/images/blackarrow-whiteville.jpg'

export const metadata: Metadata = {
  title: {
    default: 'BlackArrow Insurance | Independent Insurance Agency in NC',
    template: '%s | BlackArrow Insurance',
  },
  description: 'BlackArrow Insurance is an independent insurance agency serving North Carolina. We compare coverage from 20+ carriers for home, auto, commercial, and property insurance. Offices in Greenville & Whiteville, NC.',
  keywords: [
    'insurance agency North Carolina',
    'independent insurance agent NC',
    'home insurance NC',
    'auto insurance NC',
    'commercial insurance NC',
    'business insurance NC',
    'insurance agency Greenville NC',
    'insurance agency Whiteville NC',
    'insurance broker Wilmington NC',
    'Raleigh insurance agency',
    'coastal home insurance NC',
    'flood insurance NC',
    'short term rental insurance NC',
    'BlackArrow Insurance',
  ].join(', '),
  authors: [{ name: 'BlackArrow Insurance' }],
  creator: 'BlackArrow Insurance',
  publisher: 'BlackArrow Insurance',
  applicationName: 'BlackArrow Insurance',
  category: 'Insurance',
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BlackArrow Insurance | Independent Insurance Agency in NC',
    description: 'Independent insurance agency comparing coverage from 20+ carriers. Home, auto, commercial, and property insurance across North Carolina.',
    url: 'https://www.blackarrow.co',
    type: 'website',
    locale: 'en_US',
    siteName: 'BlackArrow Insurance',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'BlackArrow Insurance — Independent Agency in Eastern NC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackArrow Insurance | Independent Agency in NC',
    description: 'We compare coverage from 20+ carriers across North Carolina. Home, auto, commercial, and property insurance.',
    images: [ogImage],
  },
  icons: {
    icon: '/images/BlackArrow_Favicon.svg',
    shortcut: '/images/BlackArrow_Favicon.svg',
    apple: '/images/BlackArrow_Favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://www.blackarrow.co'),
  verification: {
    // Placeholder — Stone should add the Search Console verification string here once verified.
  },
}

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': 'https://www.blackarrow.co/#organization',
    name: 'BlackArrow Insurance',
    legalName: 'BlackArrow Insurance Group',
    alternateName: ['BlackArrow', 'Black Arrow Insurance', 'BlackArrow Insurance Group'],
    url: 'https://www.blackarrow.co',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.blackarrow.co/images/BlackArrowLogo.svg',
      width: 600,
      height: 120,
    },
    image: 'https://www.blackarrow.co/images/blackarrow-whiteville.jpg',
    description: 'BlackArrow Insurance is an independent insurance agency serving North Carolina. We compare coverage from 20+ carriers for home, auto, commercial, and property insurance. Offices in Greenville and Whiteville, NC.',
    foundingDate: '2002',
    slogan: 'Protecting Your Tomorrow, Today',
    priceRange: '$$',
    areaServed: [
      { '@type': 'State', name: 'North Carolina' },
      { '@type': 'City', name: 'Greenville', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Whiteville', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Wilmington', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Raleigh', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Jacksonville', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'New Bern', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Leland', containedInPlace: 'North Carolina' },
      { '@type': 'City', name: 'Southport', containedInPlace: 'North Carolina' },
    ],
    knowsAbout: [
      'Homeowners Insurance',
      'Auto Insurance',
      'Life Insurance',
      'Commercial Insurance',
      'Business Owners Package Insurance',
      'General Liability Insurance',
      'Commercial Auto Insurance',
      'Workers Compensation Insurance',
      'Commercial Property Insurance',
      'Cyber Liability Insurance',
      'Builder\'s Risk Insurance',
      'Rental Dwelling Insurance',
      'Short Term Rental Insurance',
      'Vacant Property Insurance',
      'Flood Insurance',
      'Windstorm Insurance',
      'Boat Insurance',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-252-955-5898',
        contactType: 'customer service',
        areaServed: 'US-NC',
        availableLanguage: 'English',
        hoursAvailable: 'Mo-Fr 09:00-17:30',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+1-910-914-6074',
        contactType: 'customer service',
        areaServed: 'US-NC',
        availableLanguage: 'English',
        hoursAvailable: 'Mo-Fr 09:00-17:00',
      },
    ],
    sameAs: [],
    location: [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.blackarrow.co/#greenville-office',
        name: 'BlackArrow Insurance - Greenville',
        image: 'https://www.blackarrow.co/images/blackarrow_greenville.webp',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '905 Conference Dr. 2B',
          addressLocality: 'Greenville',
          addressRegion: 'NC',
          postalCode: '27858',
          addressCountry: 'US',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 35.6127, longitude: -77.3664 },
        telephone: '+1-252-955-5898',
        email: 'service@blackarrowfg.com',
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00', closes: '17:30',
        }],
        priceRange: '$$',
      },
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.blackarrow.co/#whiteville-office',
        name: 'BlackArrow Insurance - Whiteville',
        image: 'https://www.blackarrow.co/images/blackarrow-whiteville.jpg',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '301 Liberty St. Ste 101',
          addressLocality: 'Whiteville',
          addressRegion: 'NC',
          postalCode: '28472',
          addressCountry: 'US',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 34.3432, longitude: -78.7050 },
        telephone: '+1-910-914-6074',
        email: 'service@blackarrowfg.com',
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00', closes: '17:00',
        }],
        priceRange: '$$',
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
    inLanguage: 'en-US',
    publisher: { '@id': 'https://www.blackarrow.co/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.blackarrow.co/insights?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
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
        {/* Performance: preconnect + dns-prefetch to external origins used on every page.
            Cuts TLS/DNS handshake time for render-blocking + analytics resources. */}
        <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
