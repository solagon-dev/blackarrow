import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BlackArrow Insurance | Precision Protection for Your Future',
  description: 'BlackArrow Insurance provides comprehensive coverage solutions including auto, home, life, and business insurance. Get a free quote today and secure your tomorrow with precision protection.',
  keywords: 'insurance, auto insurance, home insurance, life insurance, business insurance, coverage, insurance quotes',
  authors: [{ name: 'BlackArrow Insurance' }],
  openGraph: {
    title: 'BlackArrow Insurance | Precision Protection for Your Future',
    description: 'Comprehensive insurance solutions tailored to your needs. Auto, home, life, and business coverage.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackArrow Insurance',
    description: 'Precision Protection for Your Future',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
