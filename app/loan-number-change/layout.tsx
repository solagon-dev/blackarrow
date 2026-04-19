import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loan Number Change on Homeowners Insurance',
  description: 'Update the loan number on your homeowners insurance policy with BlackArrow Insurance. Submit your new loan information online — quick processing for North Carolina policyholders.',
  alternates: { canonical: '/loan-number-change' },
  openGraph: {
    title: 'Loan Number Change on Insurance Policy | BlackArrow Insurance',
    description: 'Submit a loan number change online. Keep your NC homeowners policy records current after refinancing.',
    url: 'https://www.blackarrow.co/loan-number-change',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function LoanNumberChangeLayout({ children }: { children: React.ReactNode }) {
  return children
}
