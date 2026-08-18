import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { serviceLocationPages, getServiceLocationBySlug } from '@/lib/service-location-data'
import Image from 'next/image'
import { carriers, getInsuranceHeroImage } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import ScrollReveal from '@/components/ui/ScrollReveal'
import EgHero from '@/components/ui/EgHero'

export function generateStaticParams() {
  return serviceLocationPages.map((page) => ({ slug: page.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getServiceLocationBySlug(slug)
  if (!page) return {}
  const cleanTitle = page.seoTitle.replace(/\s*\|\s*BlackArrow Insurance\s*$/i, '')
  const canonical = `/${page.slug}`
  return {
    title: cleanTitle,
    description: page.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: cleanTitle,
      description: page.seoDescription,
      url: `https://www.blackarrow.co${canonical}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: page.seoDescription,
    },
  }
}

function ServiceLocationSchema({ page }: { page: (typeof serviceLocationPages)[0] }) {
  const pageUrl = `https://www.blackarrow.co/${page.slug}`

  // Plan §6.4/§6.5: service-area pages describe a SERVICE offered in a city, not
  // a physical office. We therefore emit Service schema with areaServed + an
  // OfferCatalog, and DO NOT emit an addressless InsuranceAgency/LocalBusiness
  // (which would imply a storefront). The real InsuranceAgency NAP lives on the
  // office pages and in the global Organization schema (#organization).
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: `${page.serviceType} in ${page.city}, ${page.stateAbbr}`,
    description: page.heroDescription,
    serviceType: page.serviceType,
    provider: { '@id': 'https://www.blackarrow.co/#organization' },
    areaServed: {
      '@type': 'City',
      name: page.city,
      containedInPlace: { '@type': 'State', name: page.stateAbbr === 'NC' ? 'North Carolina' : page.stateAbbr },
    },
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${page.serviceType} in ${page.city}, ${page.stateAbbr}`,
      itemListElement: page.coverageItems.map(item => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
        },
      })),
    },
  }

  const faqSchema = page.faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: page.faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.blackarrow.co/' },
      { '@type': 'ListItem', position: 2, name: `${page.city}, ${page.stateAbbr}`, item: `https://www.blackarrow.co/locations/${page.locationSlug}` },
      { '@type': 'ListItem', position: 3, name: `${page.serviceType} in ${page.city}`, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}


export default async function ServiceLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getServiceLocationBySlug(slug)
  if (!page) notFound()

  const location = locationPages.find(l => l.slug === page.locationSlug)

  return (
    <div className="eg-field pt-18">
      <ServiceLocationSchema page={page} />

      <EgHero
        image={getInsuranceHeroImage(page.insuranceSlug)}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-600">
              <li><Link href="/" className="hover:text-navy-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/locations" className="hover:text-navy-900">Locations</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-900">{page.serviceType} in {page.city}</li>
            </ol>
          </nav>
        }
        title={page.heroHeading}
        lede={page.heroDescription}
        actions={
          <>
            <Link href="/quote" className="eg-btn-primary">Get a {page.serviceType.toLowerCase()} quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
          </>
        }
      />

      {/* Narrative sections. Heading tile beside body tile — the alternating
          white / grey backgrounds are unnecessary here, since the gutter is
          already doing the separating. */}
      {page.sections.map((section, sIdx) => (
        <section key={sIdx} className="container-editorial mt-0.5">
          <div className="grid lg:grid-cols-2 gap-0.5">
            <div className={`eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12 ${sIdx % 2 === 1 ? 'lg:order-last' : ''}`}>
              <h2 className="eg-h2">{section.heading}</h2>
              {sIdx === 0 && (
                <Link href="/quote" className="eg-btn-primary mt-7 self-start">Request a free quote &rarr;</Link>
              )}
            </div>
            <div className="eg-tile p-6 sm:p-10 lg:p-12">
              <div className="space-y-4 text-sm sm:text-base text-navy-600 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Coverage options */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">What {page.serviceType.toLowerCase()} covers in {page.city}</h2>
          <Link href={`/insurance/${page.insuranceSlug}`} className="eg-link flex-shrink-0">
            Full coverage details &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-0.5">
          {page.coverageItems.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Tips — numbered, since these read as a sequence of things to do */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile eg-tile-dark p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2 max-w-[28ch]">{page.serviceType} advice for {page.city} residents</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 mt-0.5">
          {page.tips.map((tip, idx) => (
            <ScrollReveal key={tip.title} delay={idx * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <span className="block text-sm font-semibold text-signal mb-3 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-navy-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{tip.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {page.faqItems.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">{page.city} {page.serviceType.toLowerCase()} questions</h2>
          </div>
          <div className="eg-tile mt-0.5 px-6 sm:px-10 lg:px-12">
            <div className="divide-y divide-gray-200">
              {page.faqItems.map((faq, idx) => (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer py-5 list-none">
                    <h3 className="text-base font-semibold text-navy-900">{faq.question}</h3>
                    <svg className="w-4 h-4 text-signal group-open:rotate-45 transition-transform duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className="pb-6 text-sm text-navy-600 leading-relaxed max-w-[68ch]">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related coverage */}
      {page.relatedServices.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Related coverage in {page.city}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
            {page.relatedServices.map((rs, idx) => (
              <ScrollReveal key={rs.label} delay={idx * 50}>
                <Link
                  href={rs.serviceLocationSlug ? `/${rs.serviceLocationSlug}` : `/insurance/${rs.insuranceSlug}`}
                  className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                    <Image
                      src={getInsuranceHeroImage(rs.insuranceSlug)}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 760px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-navy-900 mb-2">{rs.label}</h3>
                    <span className="eg-link mt-auto pt-4">Learn more &rarr;</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Service area */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Serving {page.city} and the surrounding area</h2>
            <p className="eg-lede mt-4">
              We write {page.serviceType.toLowerCase()} for homeowners, renters, property investors
              and businesses across the region.
            </p>
            {location && (
              <Link href={`/locations/${page.locationSlug}`} className="eg-link mt-6">
                All insurance services in {page.city} &rarr;
              </Link>
            )}
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span className="text-sm font-semibold text-navy-900">{page.city}</span>
              {page.surroundingAreas.map(area => (
                <span key={area} className="text-sm text-navy-600">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h3 className="text-base font-semibold text-navy-900 mb-5">
            We compare {page.serviceType.toLowerCase()} rates from
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {carriers.map(name => (
              <span key={name} className="text-sm text-navy-600">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-editorial mt-0.5 pb-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Get your {page.city} {page.serviceType.toLowerCase()} quote</h2>
            <p className="eg-lede mt-4">
              We compare {page.serviceType.toLowerCase()} from 20+ carriers to find the right policy
              for {page.city}. No obligation, no pressure.
            </p>
          </div>
          <div className="eg-tile flex flex-col justify-center gap-0.5 p-6 sm:p-10 lg:p-12">
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
