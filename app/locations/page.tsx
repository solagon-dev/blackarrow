import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { locationPages } from '@/lib/location-data'
import ScrollReveal from '@/components/ui/ScrollReveal'
import EgHero from '@/components/ui/EgHero'
import { locationHeroImages, DEFAULT_LOCATION_HERO } from '@/lib/location-images'

export const metadata: Metadata = {
  title: 'Insurance Agency Locations in North Carolina',
  description: 'BlackArrow Insurance serves clients across North Carolina with offices in Greenville and Whiteville. Independent coverage for Wilmington, Raleigh, and Eastern NC communities.',
  alternates: { canonical: '/locations' },
  openGraph: {
    title: 'Insurance Agency Locations in NC | BlackArrow Insurance',
    description: 'Independent insurance agency with North Carolina offices in Greenville and Whiteville. Serving Wilmington, Raleigh, and Eastern NC.',
    url: 'https://www.blackarrow.co/locations',
    type: 'website',
  },
}

export default function LocationsPage() {
  return (
    <div className="eg-field pt-18">
      <EgHero
        image="/images/blackarrow-whiteville.jpg"
        title="Insurance services across North Carolina"
        lede="We serve homeowners, property investors and businesses across Eastern North Carolina and the Triangle, comparing coverage from 20+ carriers."
        actions={<Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>}
      />

      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Find insurance services near you</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-0.5">
          {locationPages.map((location, idx) => (
            <ScrollReveal key={location.slug} delay={idx * 60}>
              <Link
                href={`/locations/${location.slug}`}
                className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
                  <Image
                    src={locationHeroImages[location.slug] || DEFAULT_LOCATION_HERO}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{location.city}, {location.stateAbbr}</h3>
                  <p className="text-sm text-navy-600 leading-relaxed line-clamp-3">{location.heroDescription}</p>
                  {/* Surrounding towns as flat text rather than pills — a pill
                      implies a filter you can press. */}
                  <p className="text-sm text-navy-600 mt-4">
                    Also serving {location.surroundingAreas.slice(0, 4).join(', ')}
                    {location.surroundingAreas.length > 4 && ` and ${location.surroundingAreas.length - 4} more`}.
                  </p>
                  <span className="eg-link mt-auto pt-5">View {location.city} services &rarr;</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="container-editorial mt-0.5 pb-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Wherever you are in North Carolina</h2>
            <p className="eg-lede mt-4">
              Our licensed agents work the whole state from two offices. Tell us what you need
              covered and we&rsquo;ll come back with the market.
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
