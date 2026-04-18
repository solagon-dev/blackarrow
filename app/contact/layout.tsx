import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with BlackArrow Insurance. Call, email, or visit our offices in Eastern North Carolina. Our team is ready to help with quotes, claims, and coverage questions.',
  openGraph: {
    title: 'Contact BlackArrow Insurance',
    description: 'Reach out to our team for personalized insurance solutions in Eastern NC. We\'re here to help with quotes, claims, and coverage questions.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
