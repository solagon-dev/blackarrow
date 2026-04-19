import Link from 'next/link'
import type { Metadata } from 'next'
import { locationPages } from '@/lib/location-data'
import ScrollReveal from '@/components/ui/ScrollReveal'

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
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">
              Our Locations
            </p>
            <h1 className="text-white mb-4 sm:mb-6">Insurance Services Across North Carolina</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed max-w-2xl">
              BlackArrow Insurance serves homeowners, property investors, and businesses across Eastern North Carolina and the Triangle. As an independent brokerage, we compare coverage from 20+ carriers to find the right protection at the right price.
            </p>
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="mb-10 sm:mb-16">
              <p className="section-label">Markets We Serve</p>
              <h2>Find Insurance Services Near You</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-px bg-gray-200">
            {locationPages.map((location, idx) => (
              <ScrollReveal key={location.slug} delay={idx * 80}>
                <Link
                  href={`/locations/${location.slug}`}
                  className="bg-white p-8 sm:p-10 group block h-full hover:bg-gray-50 transition-colors duration-200"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-3">
                    {location.stateAbbr}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3 group-hover:text-navy-700 transition-colors">
                    {location.city}
                  </h3>
                  <p className="text-sm text-navy-500 leading-relaxed mb-6 line-clamp-3">
                    {location.heroDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {location.surroundingAreas.slice(0, 4).map(area => (
                      <span key={area} className="text-xs text-navy-400 bg-gray-100 px-2.5 py-1">
                        {area}
                      </span>
                    ))}
                    {location.surroundingAreas.length > 4 && (
                      <span className="text-xs text-navy-400 bg-gray-100 px-2.5 py-1">
                        +{location.surroundingAreas.length - 4} more
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                    View {location.city} services →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-900 text-white">
        <div className="container-editorial text-center">
          <ScrollReveal>
            <h2 className="text-white mb-4 sm:mb-6">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg text-navy-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              No matter where you are in North Carolina, our licensed agents are ready to help you find the right coverage at the best rate.
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
