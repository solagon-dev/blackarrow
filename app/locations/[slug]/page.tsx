import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locationPages, getLocationBySlug } from '@/lib/location-data'
import { personalInsurance, commercialInsurance, propertyInsurance, carriers } from '@/lib/insurance-data'
import { getServiceLocationsByCity } from '@/lib/service-location-data'
import { getIconByName } from '@/components/ui/Icons'
import ScrollReveal from '@/components/ui/ScrollReveal'

const featuredServices = [
  { slug: 'homeowners', label: 'Homeowners Insurance', icon: 'home' },
  { slug: 'auto', label: 'Auto Insurance', icon: 'car' },
  { slug: 'rental-dwelling', label: 'Rental Property Insurance', icon: 'building' },
  { slug: 'general-liability', label: 'General Liability', icon: 'shield' },
  { slug: 'commercial-auto', label: 'Commercial Auto', icon: 'clipboard-check' },
  { slug: 'business-owners-package', label: "Business Owner's Package", icon: 'briefcase' },
  { slug: 'short-term-rental', label: 'Short-Term Rental Insurance', icon: 'key' },
  { slug: 'builders-risk', label: "Builder's Risk Insurance", icon: 'hardhat' },
]

const serviceIcons: Record<string, string> = {
  homeowners: 'home',
  auto: 'car',
  'general-liability': 'shield',
  'rental-dwelling': 'building',
  'short-term-rental': 'key',
}

export function generateStaticParams() {
  return locationPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getLocationBySlug(slug)
  if (!page) return {}
  const cleanTitle = page.seoTitle.replace(/\s*\|\s*BlackArrow Insurance\s*$/i, '')
  const canonical = `/locations/${page.slug}`
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

function LocationPageSchema({ page }: { page: (typeof locationPages)[0] }) {
  const pageUrl = `https://www.blackarrow.co/locations/${page.slug}`

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${pageUrl}#localbusiness`,
    name: `BlackArrow Insurance — ${page.city}, ${page.stateAbbr}`,
    description: page.seoDescription,
    url: pageUrl,
    parentOrganization: { '@id': 'https://www.blackarrow.co/#organization' },
    areaServed: {
      '@type': 'City',
      name: page.city,
      containedInPlace: { '@type': 'State', name: page.state },
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'Place', name: `${page.city}, ${page.stateAbbr}` },
    },
    priceRange: '$$',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.blackarrow.co/' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://www.blackarrow.co/locations' },
      { '@type': 'ListItem', position: 3, name: `${page.city}, ${page.stateAbbr}`, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getLocationBySlug(slug)
  if (!page) notFound()

  const allInsurance = [...personalInsurance, ...commercialInsurance, ...propertyInsurance]
  const cityServicePages = getServiceLocationsByCity(page.slug)

  return (
    <>
      <LocationPageSchema page={page} />
      {/* ============= HERO ============= */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">
              {page.city}, {page.stateAbbr}
            </p>
            <h1 className="text-white mb-4 sm:mb-6">{page.heroHeading}</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              {page.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/quote" className="btn-secondary">
                Request a Quote
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Speak with an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============= ABOUT SECTION ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">About BlackArrow in {page.city}</p>
              <h2>{page.aboutHeading}</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <div className="space-y-5 sm:space-y-6 text-navy-600 leading-relaxed text-base sm:text-lg">
                {page.aboutContent.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============= INSURANCE SERVICES ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-16">
              <div>
                <p className="section-label">Insurance Services</p>
                <h2>Insurance Services in {page.city}</h2>
              </div>
              <Link href="/quote" className="link-arrow flex-shrink-0">
                Get a quote
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {featuredServices.map((service, idx) => (
              <ScrollReveal key={service.slug} delay={idx * 50}>
                <Link
                  href={`/insurance/${service.slug}`}
                  className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="icon-box-navy mb-4 sm:mb-5">
                    {getIconByName(service.icon)}
                  </div>
                  <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                    {service.label}
                  </h3>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {allInsurance
                .filter(ins => !featuredServices.some(fs => fs.slug === ins.slug))
                .map(ins => (
                  <Link
                    key={ins.slug}
                    href={`/insurance/${ins.slug}`}
                    className="text-sm font-medium text-navy-400 hover:text-navy-900 transition-colors"
                  >
                    {ins.shortTitle} →
                  </Link>
                ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============= CITY SERVICE PAGES ============= */}
      {cityServicePages.length > 0 && (
        <section className="section-padding-sm bg-white border-b border-gray-200">
          <div className="container-editorial">
            <ScrollReveal>
              <p className="section-label mb-8">Coverage Guides for {page.city}</p>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
              {cityServicePages.map((sp, idx) => (
                <ScrollReveal key={sp.slug} delay={idx * 60}>
                  <Link
                    href={`/${sp.slug}`}
                    className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="icon-box-navy w-10 h-10 mb-4">
                      {getIconByName(serviceIcons[sp.insuranceSlug] || 'shield', 'w-5 h-5')}
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-1 group-hover:text-navy-700 transition-colors">
                      {sp.serviceType} in {sp.city}
                    </h3>
                    <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                      Learn more →
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============= WHY CHOOSE BLACKARROW ============= */}
      <section className="section-padding bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
              <p className="section-label">Why BlackArrow</p>
              <h2>Why Clients in {page.city} Choose BlackArrow</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {page.whyChoose.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 80}>
                <div className="bg-white p-6 sm:p-8 h-full">
                  <span className="text-xs font-semibold text-navy-300 tracking-wide">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-navy-900 mt-3 mb-3">{item.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= LOCAL INSIGHTS ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Local Expertise</p>
              <h2>{page.localInsights.heading}</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <div className="space-y-5 sm:space-y-6 text-navy-600 leading-relaxed text-base sm:text-lg">
                {page.localInsights.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============= PROPERTY OWNERS ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Property Coverage</p>
              <h2>{page.propertyOwnerHeading}</h2>
              <div className="mt-8">
                <Link href="/quote" className="btn-primary">Get a Property Quote</Link>
              </div>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <div className="space-y-5 sm:space-y-6 text-navy-600 leading-relaxed text-base sm:text-lg">
                {page.propertyOwnerContent.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= GUIDANCE ============= */}
      <section className="section-padding bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="max-w-3xl mb-10 sm:mb-16">
              <p className="section-label">Coverage Guidance</p>
              <h2>{page.guidanceHeading}</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-px bg-gray-200">
            {page.guidanceItems.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 80}>
                <div className="bg-white p-6 sm:p-8 h-full">
                  <span className="text-xs font-semibold text-navy-300 tracking-wide">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-navy-900 mt-3 mb-3">{item.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
                </div>
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
              <h2>Serving {page.city} &amp; Surrounding Communities</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <p className="text-navy-600 leading-relaxed text-base sm:text-lg mb-8">
                In addition to {page.city}, BlackArrow Insurance serves clients throughout the surrounding region. Our independent agency model allows us to work with homeowners, renters, property investors, and businesses across a wide service area.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 mb-10">
                <p className="text-sm font-medium text-navy-900">{page.city}</p>
                {page.surroundingAreas.map(area => (
                  <p key={area} className="text-sm text-navy-500">{area}</p>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-navy-400 mb-4">We also serve clients in:</p>
                <div className="flex flex-wrap gap-3">
                  {locationPages.filter(l => l.slug !== page.slug).map(location => (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      className="text-sm font-medium text-navy-400 hover:text-navy-900 transition-colors"
                    >
                      {location.city}, {location.stateAbbr} →
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= CARRIERS ============= */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-6">
            We compare rates from leading carriers for {page.city} clients
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
            <h2 className="text-white mb-4 sm:mb-6">Get Your {page.city} Insurance Quote</h2>
            <p className="text-base sm:text-lg text-navy-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Our licensed agents compare coverage from 20+ carriers to find the right policy for your home, vehicle, rental property, or business in {page.city}. No obligation, no pressure.
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
