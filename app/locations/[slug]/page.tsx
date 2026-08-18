import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { locationPages, getLocationBySlug } from '@/lib/location-data'
import { personalInsurance, commercialInsurance, propertyInsurance, carriers, getInsuranceHeroImage } from '@/lib/insurance-data'
import { getServiceLocationsByCity } from '@/lib/service-location-data'
import ScrollReveal from '@/components/ui/ScrollReveal'
import EgHero from '@/components/ui/EgHero'
import { locationHeroImages, DEFAULT_LOCATION_HERO } from '@/lib/location-images'

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
    <div className="eg-field pt-18">
      <LocationPageSchema page={page} />

      <EgHero
        image={locationHeroImages[page.slug] || DEFAULT_LOCATION_HERO}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-600">
              <li><Link href="/" className="hover:text-navy-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/locations" className="hover:text-navy-900">Locations</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-900">{page.city}, {page.stateAbbr}</li>
            </ol>
          </nav>
        }
        title={page.heroHeading}
        lede={page.heroDescription}
        actions={
          <>
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
          </>
        }
      />

      {/* About */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">{page.aboutHeading}</h2>
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="space-y-4 text-sm sm:text-base text-navy-600 leading-relaxed">
              {page.aboutContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Insurance services in {page.city}</h2>
          <Link href="/quote" className="eg-link flex-shrink-0">Get a quote &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
          {featuredServices.map((service, idx) => (
            <ScrollReveal key={service.slug} delay={idx * 50}>
              <Link href={`/insurance/${service.slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                  <Image
                    src={getInsuranceHeroImage(service.slug)}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 760px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold text-navy-900 mb-2">{service.label}</h3>
                  <span className="eg-link mt-auto pt-4">Learn more &rarr;</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="eg-tile mt-0.5 p-6 sm:p-8">
          <h3 className="text-base font-semibold text-navy-900 mb-4">Everything else we write</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {allInsurance
              .filter(ins => !featuredServices.some(fs => fs.slug === ins.slug))
              .map(ins => (
                <Link key={ins.slug} href={`/insurance/${ins.slug}`} className="eg-link">
                  {ins.shortTitle} &rarr;
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* City × service pages */}
      {cityServicePages.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Coverage guides for {page.city}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
            {cityServicePages.map((sp, idx) => (
              <ScrollReveal key={sp.slug} delay={idx * 50}>
                <Link href={`/${sp.slug}`} className="eg-tile group flex flex-col h-full p-5 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
                  <h3 className="text-base font-semibold text-navy-900 mb-2">{sp.serviceType} in {sp.city}</h3>
                  <span className="eg-link mt-auto pt-5">Learn more &rarr;</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Why choose us — numbered because whyChoose is an ordered argument */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile eg-tile-dark p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Why clients in {page.city} choose BlackArrow</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
          {page.whyChoose.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <span className="block text-sm font-semibold text-signal mb-3 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Local insights */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">{page.localInsights.heading}</h2>
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="space-y-4 text-sm sm:text-base text-navy-600 leading-relaxed">
              {page.localInsights.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property owners */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="space-y-4 text-sm sm:text-base text-navy-600 leading-relaxed">
              {page.propertyOwnerContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:order-first">
            <h2 className="eg-h2">{page.propertyOwnerHeading}</h2>
            <Link href="/quote" className="eg-btn-primary mt-7 self-start">Get a property quote &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Guidance */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2 max-w-[28ch]">{page.guidanceHeading}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 mt-0.5">
          {page.guidanceItems.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <span className="block text-sm font-semibold text-signal mb-3 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Service area */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Serving {page.city} and the surrounding area</h2>
            <p className="eg-lede mt-4">
              Our independent model lets us write homeowners, renters, property investors and
              businesses right across the region.
            </p>
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
          <h3 className="text-base font-semibold text-navy-900 mb-5">Carriers we compare for {page.city} clients</h3>
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
            <h2 className="eg-h2">Get a {page.city} insurance quote</h2>
            <p className="eg-lede mt-4">
              A licensed agent will compare the market and come back with what actually fits.
              No obligation.
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
