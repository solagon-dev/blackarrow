import Link from 'next/link'
import type { Metadata } from 'next'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'File an Insurance Claim — Direct Carrier Links',
  description: 'File an insurance claim directly with your carrier through BlackArrow Insurance. Quick-access links to Progressive, Travelers, Safeco, Universal Property, The Hartford, and 15+ other claims portals.',
  alternates: { canonical: '/file-a-claim' },
  openGraph: {
    title: 'File an Insurance Claim | BlackArrow Insurance',
    description: 'Direct links to every carrier claims portal. File your home, auto, or commercial claim through BlackArrow Insurance.',
    url: 'https://www.blackarrow.co/file-a-claim',
    type: 'website',
  },
}

const carrierLinks: { name: string; url: string }[] = [
  { name: 'Progressive', url: 'https://www.progressive.com/claims/' },
  { name: 'Universal Property', url: 'https://www.universalproperty.com/claims' },
  { name: 'National General', url: 'https://www.nationalgeneral.com/claims/' },
  { name: 'NCJUA', url: 'https://www.ncjua.com' },
  { name: 'Hagerty', url: 'https://www.hagerty.com/insurance/claims' },
  { name: 'Halifax Mutual', url: 'https://www.halifaxnc.com' },
  { name: 'Foremost', url: 'https://www.foremost.com/claims/' },
  { name: 'Johnson & Johnson', url: 'https://www.jjins.com' },
  { name: 'The Hartford', url: 'https://www.thehartford.com/claims' },
  { name: 'Liberty Mutual', url: 'https://www.libertymutual.com/claims' },
  { name: 'JM Wilson', url: 'https://www.jmwilson.com' },
  { name: 'Safeco', url: 'https://www.safeco.com/claims' },
  { name: 'Orion 180', url: 'https://www.orion180.com' },
  { name: 'Orchid Insurance', url: 'https://www.orchidinsurance.com' },
  { name: 'Tower Hill', url: 'https://www.thig.com/claims' },
  { name: 'SageSure', url: 'https://www.sagesure.com' },
  { name: 'Travelers', url: 'https://www.travelers.com/claims' },
  { name: 'CAB', url: '#' },
]

export default function FileAClaimPage() {
  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/AdobeStock_45348884.jpeg" alt="Homeowner filing an insurance claim after property damage" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Policy Management</p>
            <h1 className="text-white mb-4 sm:mb-6">File a Claim</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              Click on one of the carriers below to file an insurance claim directly with your insurance company.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <p className="section-label mb-10">Select your carrier to begin</p>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {carrierLinks.map((carrier, idx) => (
                <ScrollReveal key={carrier.name} delay={idx * 30}>
                  <a
                    href={carrier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 flex items-center justify-between group block hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">{carrier.name}</span>
                    <svg className="w-4 h-4 text-navy-400 group-hover:text-navy-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div className="mt-12 text-center">
                <p className="text-navy-600 mb-4">Don&apos;t see your carrier? Contact us and we&apos;ll help you get connected.</p>
                <Link href="/contact" className="btn-primary">Contact Our Team</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
