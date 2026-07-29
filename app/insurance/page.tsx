import type { Metadata } from 'next'
import Link from 'next/link'
import { getInsuranceBySlug } from '@/lib/insurance-data'
import { GREENVILLE_OFFICE, WHITEVILLE_OFFICE } from '@/lib/business-facts'

export const metadata: Metadata = {
  title: 'Insurance Coverage — Find the Right Policy',
  description:
    'Explore BlackArrow Insurance coverage by what you need to protect — your home and family, vehicles, business, rental property, or a specialized risk. Independent agency serving Eastern North Carolina.',
  alternates: { canonical: '/insurance' },
}

/**
 * Insurance hub (Plan §7.1). Organized by user NEED rather than as a flat list of
 * every product, to help visitors choose coverage and route into the right
 * category. Each group links to the relevant coverage pages.
 */
const needGroups: {
  key: string
  title: string
  intro: string
  slugs: string[]
}[] = [
  {
    key: 'home',
    title: 'Protect my home & family',
    intro:
      'Coverage for the place you live and the people who depend on you — including the flood risk that standard homeowners policies leave out.',
    slugs: ['homeowners', 'renters', 'flood', 'life'],
  },
  {
    key: 'vehicle',
    title: 'Protect my vehicle',
    intro:
      'Cars, trucks, and boats on Eastern North Carolina roads and waterways, with the liability limits that changed under NC law in 2025.',
    slugs: ['auto', 'boat'],
  },
  {
    key: 'business',
    title: 'Protect my business',
    intro:
      'From a first general-liability policy to a full commercial program — matched to your industry, payroll, and the risks you actually face.',
    slugs: [
      'business-owners-package',
      'general-liability',
      'commercial-property',
      'commercial-auto',
      'workers-compensation',
      'cyber-liability',
      'equipment',
      'dump-straight-truck',
    ],
  },
  {
    key: 'rental',
    title: 'Protect a rental or investment property',
    intro:
      'Landlord and rental coverage that a homeowners policy will not — for long-term rentals, short-term/vacation rentals, and vacant properties.',
    slugs: ['rental-dwelling', 'long-term-rental', 'short-term-rental', 'vacant-unoccupied'],
  },
  {
    key: 'specialized',
    title: 'Handle a specialized risk',
    intro:
      'Project- and situation-specific coverage for the exposures that off-the-shelf policies do not address.',
    slugs: ['builders-risk'],
  },
]

function BreadcrumbSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.blackarrow.co/' },
      { '@type': 'ListItem', position: 2, name: 'Insurance', item: 'https://www.blackarrow.co/insurance' },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function InsuranceHubPage() {
  return (
    <>
      <BreadcrumbSchema />

      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-navy-950/85" />
        <div className="container-editorial relative">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-navy-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-200">Insurance</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4">Coverage</p>
            <h1 className="text-white mb-4 sm:mb-6">What are you protecting?</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              We&rsquo;re an independent agency, so we compare coverage across many carriers instead of
              selling one company&rsquo;s policies. Start with what matters most to you — a licensed
              local agent will help you weigh the tradeoffs.
            </p>
          </div>
        </div>
      </section>

      {/* Quick jump */}
      <section className="border-b border-gray-200 bg-gray-50 py-4">
        <div className="container-editorial">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {needGroups.map((g) => (
              <li key={g.key}>
                <a href={`#${g.key}`} className="text-navy-600 hover:text-navy-900 underline-offset-4 hover:underline">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Need groups */}
      <section className="section-padding bg-white">
        <div className="container-editorial space-y-16 sm:space-y-20">
          {needGroups.map((group) => {
            const coverages = group.slugs
              .map((slug) => getInsuranceBySlug(slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))
            return (
              <div key={group.key} id={group.key} className="scroll-mt-24">
                <div className="max-w-2xl mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900 mb-3">{group.title}</h2>
                  <p className="text-navy-600 leading-relaxed">{group.intro}</p>
                </div>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
                  {coverages.map((cov) => (
                    <li key={cov.slug} className="bg-white">
                      <Link
                        href={`/insurance/${cov.slug}`}
                        className="block h-full p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <span className="block text-base font-semibold text-navy-900 group-hover:text-navy-700">
                          {cov.shortTitle}
                        </span>
                        <span className="mt-2 block text-sm text-navy-500 leading-relaxed">{cov.tagline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* When to talk to an agent */}
      <section className="section-padding bg-navy-50 border-t border-gray-200">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900 mb-4">
              Not sure which coverage you need?
            </h2>
            <p className="text-navy-600 leading-relaxed mb-2">
              That&rsquo;s exactly what an independent agent is for. If you&rsquo;re buying a first home,
              starting or growing a business, adding a rental, or facing a risk you haven&rsquo;t insured
              before, talk to us before you buy — we&rsquo;ll explain what&rsquo;s included, what&rsquo;s
              commonly excluded, and where North Carolina rules matter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-primary text-center">Request a quote</Link>
              <a href={`tel:${GREENVILLE_OFFICE.phone.replace(/\D/g, '')}`} className="btn-outline text-center">
                Call Greenville: {GREENVILLE_OFFICE.phone}
              </a>
              <a href={`tel:${WHITEVILLE_OFFICE.phone.replace(/\D/g, '')}`} className="btn-outline text-center">
                Call Whiteville: {WHITEVILLE_OFFICE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
