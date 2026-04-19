import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact BlackArrow Insurance — Greenville & Whiteville, NC',
  description: 'Contact BlackArrow Insurance in Greenville (252-955-5898) or Whiteville (910-914-6074), North Carolina. Our licensed agents help with quotes, claims, policy changes, and coverage questions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact BlackArrow Insurance | Greenville & Whiteville NC',
    description: 'Reach our licensed agents in Greenville and Whiteville, NC for quotes, claims, and coverage questions.',
    url: 'https://www.blackarrow.co/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact BlackArrow Insurance',
    description: 'Licensed agents in Greenville and Whiteville, NC.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
