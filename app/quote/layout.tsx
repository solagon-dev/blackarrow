import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Free Insurance Quote',
  description: 'Request a free, no-obligation insurance quote from BlackArrow Insurance. Compare rates for auto, home, life, business, and commercial insurance in Eastern North Carolina.',
  openGraph: {
    title: 'Get a Free Insurance Quote | BlackArrow Insurance',
    description: 'Request a free, no-obligation quote. Compare rates for auto, home, life, and business insurance in Eastern NC.',
  },
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children
}
