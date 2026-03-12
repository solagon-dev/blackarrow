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
  openGraph: {
    title: 'BlackArrow Insurance | Trusted Insurance Solutions',
    description: 'Comprehensive insurance solutions tailored to your needs. Personal, commercial, and property coverage from a trusted local agency.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
