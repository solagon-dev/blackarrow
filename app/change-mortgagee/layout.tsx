import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Change Mortgagee on Homeowners Insurance Policy',
  description: 'Update the mortgagee on your homeowners insurance policy with BlackArrow Insurance. Submit new lender information online — fast processing for North Carolina policyholders who refinanced or switched lenders.',
  alternates: { canonical: '/change-mortgagee' },
  openGraph: {
    title: 'Change Mortgagee on Insurance Policy | BlackArrow Insurance',
    description: 'Submit a mortgagee change request online. Update lender information on your NC homeowners insurance policy.',
    url: 'https://www.blackarrow.co/change-mortgagee',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ChangeMortgageeLayout({ children }: { children: React.ReactNode }) {
  return children
}
