import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Free Insurance Quote in North Carolina',
  description: 'Free no-obligation insurance quote from BlackArrow Insurance. Compare rates from 20+ carriers for auto, home, life, commercial, and property insurance in Greenville, Whiteville, Wilmington, Raleigh, and Eastern North Carolina.',
  alternates: { canonical: '/quote' },
  openGraph: {
    title: 'Get a Free Insurance Quote | BlackArrow Insurance',
    description: 'Request a free, no-obligation quote. Compare rates from 20+ carriers for auto, home, life, and business insurance in North Carolina.',
    url: 'https://www.blackarrow.co/quote',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get a Free Insurance Quote | BlackArrow Insurance',
    description: 'Compare rates from 20+ carriers in minutes.',
  },
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children
}
