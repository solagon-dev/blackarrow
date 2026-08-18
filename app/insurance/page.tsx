import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getInsuranceBySlug, getInsuranceHeroImage } from '@/lib/insurance-data'
import EgHero from '@/components/ui/EgHero'
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
    <div className="eg-field pt-18">
      <BreadcrumbSchema />

      <EgHero
        image="/images/AdobeStock_315458621.jpeg"
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-navy-600">
              <li><Link href="/" className="hover:text-navy-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-900">Insurance</li>
            </ol>
          </nav>
        }
        title="What are you protecting?"
        lede="We're an independent agency, so we compare coverage across many carriers instead of selling one company's policies. Start with what matters most to you."
        actions={<Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>}
      />

      {/* Jump tiles. These are the five real routes through the page, so they
          carry more weight as tiles than as the underlined text list they
          replace. */}
      <nav aria-label="Coverage categories" className="container-editorial mt-0.5">
        <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-0.5">
          {needGroups.map((g) => (
            <li key={g.key} className="flex">
              <a href={`#${g.key}`} className="eg-tile w-full border-t-2 border-signal px-5 py-5 hover:bg-gray-50 transition-colors">
                <span className="block text-sm font-semibold text-navy-900">{g.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {needGroups.map((group) => {
        const coverages = group.slugs
          .map((slug) => getInsuranceBySlug(slug))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
        return (
          <section key={group.key} id={group.key} className="container-editorial mt-0.5 scroll-mt-24">
            <div className="eg-tile p-6 sm:p-10 lg:p-12">
              <h2 className="eg-h2 max-w-[24ch]">{group.title}</h2>
              <p className="eg-lede mt-4 max-w-[62ch]">{group.intro}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
              {coverages.map((cov) => (
                <li key={cov.slug} className="flex">
                  <Link
                    href={`/insurance/${cov.slug}`}
                    className="eg-tile group flex w-full flex-col hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                      <Image
                        src={getInsuranceHeroImage(cov.slug)}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-base font-semibold text-navy-900 mb-2">{cov.shortTitle}</h3>
                      <p className="text-sm text-navy-600 leading-relaxed">{cov.tagline}</p>
                      <span className="eg-link mt-auto pt-5">Learn more &rarr;</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <section className="container-editorial mt-0.5 pb-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Not sure which coverage you need?</h2>
            <p className="eg-lede mt-4">
              That&rsquo;s exactly what an independent agent is for. Buying a first home, growing a
              business, adding a rental, or facing a risk you haven&rsquo;t insured before &mdash;
              talk to us before you buy. We&rsquo;ll explain what&rsquo;s included, what&rsquo;s
              commonly excluded, and where North Carolina rules matter.
            </p>
          </div>
          <div className="eg-tile flex flex-col justify-center gap-0.5 p-6 sm:p-10 lg:p-12">
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <a href={`tel:${GREENVILLE_OFFICE.phone.replace(/\D/g, '')}`} className="eg-btn-dark">
              Call Greenville &middot; {GREENVILLE_OFFICE.phone}
            </a>
            <a href={`tel:${WHITEVILLE_OFFICE.phone.replace(/\D/g, '')}`} className="eg-btn-dark">
              Call Whiteville &middot; {WHITEVILLE_OFFICE.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
