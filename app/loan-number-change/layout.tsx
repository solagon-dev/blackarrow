import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loan Number Change',
  description: 'Submit a loan number change request for your insurance policy with BlackArrow Insurance. Keep your policy records up to date with your current loan information.',
  openGraph: {
    title: 'Loan Number Change | BlackArrow Insurance',
    description: 'Submit a loan number change request. Keep your policy records up to date with your current loan information.',
  },
}

export default function LoanNumberChangeLayout({ children }: { children: React.ReactNode }) {
  return children
}
