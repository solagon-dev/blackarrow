import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Change Mortgagee',
  description: 'Submit a mortgagee change request for your insurance policy with BlackArrow Insurance. Update your lender information quickly and easily.',
  openGraph: {
    title: 'Change Mortgagee | BlackArrow Insurance',
    description: 'Submit a mortgagee change request for your insurance policy. Update your lender information quickly and easily.',
  },
}

export default function ChangeMortgageeLayout({ children }: { children: React.ReactNode }) {
  return children
}
