import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { serviceLocationPages, getServiceLocationBySlug } from '@/lib/service-location-data'
import { getIconByName } from '@/components/ui/Icons'
import { carriers } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import ScrollReveal from '@/components/ui/ScrollReveal'

export function generateStaticParams() {
  return serviceLocationPages.map((page) => ({ slug: page.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getServiceLocationBySlug(slug)
  if (!page) return {}
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
    },
  }
}

function ServiceLocationSchema({ page }: { page: (typeof serviceLocationPages)[0] }) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: 'BlackArrow Insurance',
    description: page.seoDescription,
    url: `https://www.blackarrow.co/${page.slug}`,
    telephone: '(910) 914-6074',
    areaServed: {
      '@type': 'City',
      name: page.city,
      addressRegion: page.stateAbbr,
    },
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
    mainEntity: page.faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  )
}

const serviceIcons: Record<string, string> = {
  homeowners: 'home',
  auto: 'car',
  'general-liability': 'shield',
  'rental-dwelling': 'building',
  'short-term-rental': 'key',
  'commercial-auto': 'clipboard-check',
  'builders-risk': 'hardhat',
  'cyber-liability': 'lock',
  'workers-compensation': 'users',
  'business-owners-package': 'briefcase',
  'dump-straight-truck': 'cube',
  'commercial-property': 'building2',
  equipment: 'wrench',
}

export default async function ServiceLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getServiceLocationBySlug(slug)
  if (!page) notFound()

  const icon = serviceIcons[page.insuranceSlug] || 'shield'
  const location = locationPages.find(l => l.slug === page.locationSlug)

  return (
    <>
      <ServiceLocationSchema page={page} />

      {/* ============= HERO ============= */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">
              {page.serviceType} &middot; {page.city}, {page.stateAbbr}
            </p>
            <h1 className="text-white mb-4 sm:mb-6">{page.heroHeading}</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              {page.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/quote" className="btn-secondary">
                Get a {page.serviceType} Quote
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Speak with an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============= CONTENT SECTIONS ============= */}
      {page.sections.map((section, sIdx) => (
        <section key={sIdx} className={`section-padding ${sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50 border-y border-gray-200'}`}>
          <div className="container-editorial">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
              <ScrollReveal className="lg:col-span-5">
                <p className="section-label">{section.label}</p>
                <h2>{section.heading}</h2>
              </ScrollReveal>
              <ScrollReveal className="lg:col-span-7" delay={100}>
                <div className="space-y-5 sm:space-y-6 text-navy-600 leading-relaxed text-base sm:text-lg">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
                {sIdx === 0 && (
                  <div className="mt-8">
                    <Link href="/quote" className="link-arrow">Request a free quote</Link>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* ============= COVERAGE OPTIONS ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-16">
              <div>
                <p className="section-label">Coverage Options</p>
                <h2>{page.serviceType} Coverage in {page.city}</h2>
              </div>
              <Link href={`/insurance/${page.insuranceSlug}`} className="link-arrow flex-shrink-0">
                Full coverage details
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-px bg-gray-200">
            {page.coverageItems.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 60}>
                <div className="bg-white p-6 sm:p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="icon-box-navy w-10 h-10 flex-shrink-0">
                      {getIconByName(icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= TIPS / GUIDANCE ============= */}
      <section className="section-padding bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="max-w-3xl mb-10 sm:mb-16">
              <p className="section-label">Coverage Guidance</p>
              <h2>{page.serviceType} Tips for {page.city} Residents</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-px bg-gray-200">
            {page.tips.map((tip, idx) => (
              <ScrollReveal key={tip.title} delay={idx * 80}>
                <div className="bg-white p-6 sm:p-8 h-full">
                  <span className="text-xs font-semibold text-navy-300 tracking-wide">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-navy-900 mt-3 mb-3">{tip.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{tip.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= FAQs ============= */}
      {page.faqItems.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-editorial">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal className="text-center mb-16">
                <p className="section-label">FAQs</p>
                <h2>Frequently Asked Questions</h2>
              </ScrollReveal>
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {page.faqItems.map((faq, idx) => (
                  <ScrollReveal key={idx} delay={idx * 40}>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-6 hover:text-navy-700 transition-colors list-none">
                        <h3 className="text-base font-semibold text-navy-900 pr-8">{faq.question}</h3>
                        <svg className="w-4 h-4 text-navy-400 group-open:rotate-45 transition-transform duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </summary>
                      <div className="pb-6 text-navy-500 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </div>
                    </details>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============= RELATED COVERAGE ============= */}
      <section className="section-padding-sm bg-white border-b border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <p className="section-label mb-8">Related Coverage</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {page.relatedServices.map((rs, idx) => (
              <ScrollReveal key={rs.label} delay={idx * 60}>
                <Link
                  href={rs.serviceLocationSlug ? `/${rs.serviceLocationSlug}` : `/insurance/${rs.insuranceSlug}`}
                  className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="icon-box-navy w-10 h-10 mb-4">
                    {getIconByName(serviceIcons[rs.insuranceSlug] || 'shield', 'w-5 h-5')}
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-1 group-hover:text-navy-700 transition-colors">{rs.label}</h3>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= SERVICE AREA ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Service Area</p>
              <h2>Serving {page.city} &amp; Surrounding Areas</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <p className="text-navy-600 leading-relaxed text-base sm:text-lg mb-8">
                BlackArrow Insurance provides {page.serviceType.toLowerCase()} coverage to clients in {page.city} and throughout the surrounding region. As an independent agency, we serve homeowners, renters, property investors, and businesses across a wide service area.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 mb-10">
                <p className="text-sm font-medium text-navy-900">{page.city}</p>
                {page.surroundingAreas.map(area => (
                  <p key={area} className="text-sm text-navy-500">{area}</p>
                ))}
              </div>
              {location && (
                <div className="pt-6 border-t border-gray-200">
                  <Link
                    href={`/locations/${page.locationSlug}`}
                    className="link-arrow text-sm"
                  >
                    All insurance services in {page.city}
                  </Link>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= CARRIERS ============= */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-6">
            We compare {page.serviceType.toLowerCase()} rates from leading carriers
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {carriers.map(name => (
              <span key={name} className="text-sm font-medium text-navy-300">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="section-padding bg-navy-900 text-white">
        <div className="container-editorial text-center">
          <ScrollReveal>
            <h2 className="text-white mb-4 sm:mb-6">Get Your {page.city} {page.serviceType} Quote</h2>
            <p className="text-base sm:text-lg text-navy-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Our licensed agents compare {page.serviceType.toLowerCase()} from 20+ carriers to find the right policy for your needs in {page.city}. No obligation, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/quote" className="btn-secondary px-8 py-4">
                Request a Quote
              </Link>
              <Link href="/contact" className="btn-outline-white px-8 py-4">
                Speak with an Advisor
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
