import Link from 'next/link'
import { personalInsurance, commercialInsurance, propertyInsurance } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { getAllPosts } from '@/lib/db'
import { getIconByName } from '@/components/ui/Icons'
import { ensureAdminUser } from '@/lib/auth'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CarrierLogoCarousel from '@/components/ui/CarrierLogoCarousel'
import { InsightCard } from '@/components/insights/InsightCard'

export default async function Home() {
  await ensureAdminUser()
  let recentPosts: { title: string; slug: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null }[] = []
  try {
    recentPosts = (await getAllPosts('published')).slice(0, 3)
  } catch {}

  return (
    <>
      {/* ============= HERO ============= */}
      <section className="relative bg-navy-950 overflow-hidden min-h-svh sm:min-h-[92vh] flex flex-col">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/hero-bg-video.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/30" />

        {/* Main hero content */}
        <div className="container-editorial relative z-10 mt-auto pb-0">
          {/* Mobile: single-column stacked layout / Desktop: 12-col grid */}
          <div className="flex flex-col gap-6 pb-10 sm:pb-12 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-end lg:pb-20">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5 lg:hidden">Independent Insurance Brokerage</p>
              <h1 className="text-white text-[1.75rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] leading-[1.1] sm:leading-[1.05] font-display font-bold tracking-tight">
                Protecting Your Tomorrow,<br className="hidden sm:block" />
                Today
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-navy-300 leading-relaxed mb-6 sm:mb-8 max-w-md lg:max-w-none">
                An independent brokerage serving Eastern North Carolina. We compare coverage from 20+ carriers to find the right protection at the right price.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-center text-navy-900 font-medium text-sm tracking-wide hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                >
                  Request a Quote
                </Link>
                <Link href="/contact" className="btn-outline-white px-8 py-4">
                  Speak with an Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar — anchored to bottom */}
        <div className="relative z-10 border-t border-white/[0.08] bg-navy-950/40 backdrop-blur-sm">
          <div className="container-editorial py-5 sm:py-6 lg:py-7">
            <div className="flex justify-between lg:grid lg:grid-cols-4 lg:gap-16">
              {[
                { value: '20+', label: 'Years' },
                { value: '20+', label: 'Carriers' },
                { value: '2', label: 'Offices' },
                { value: '17+', label: 'Coverages' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] sm:text-sm text-navy-400 tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= CARRIER BAR ============= */}
      <CarrierLogoCarousel />

      {/* ============= EDITORIAL INTRO ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Our Approach</p>
              <h2>Independent Advice.<br />Better Outcomes.</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <p className="text-base sm:text-lg text-navy-600 leading-relaxed mb-8 max-w-2xl">
                As an independent agency, we work for you — not for any single carrier. We analyze your risk profile and match you with the right coverage from a curated panel of top-rated insurers.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-200">
                {[
                  { title: 'Tailored Coverage', desc: 'We build strategies around your specific needs, not one-size-fits-all products.' },
                  { title: 'Competitive Pricing', desc: 'We compare options across 20+ carriers to secure the most favorable terms.' },
                  { title: 'Ongoing Advisory', desc: 'Dedicated guidance from policy inception through claims resolution.' },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============= PERSONAL INSURANCE ============= */}
      <section className="section-padding bg-white" id="insurance">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-16">
              <div>
                <p className="section-label">Personal Insurance</p>
                <h2>Protection for Individuals &amp; Families</h2>
              </div>
              <Link href="/quote" className="link-arrow flex-shrink-0">
                All coverages
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="relative overflow-hidden mb-10 sm:mb-16 h-48 sm:h-72 lg:h-96">
              <img src="/images/AdobeStock_300395016.jpeg" alt="Family at home" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-transparent" />
              <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
                <p className="text-white text-xl sm:text-2xl font-display font-semibold max-w-md leading-snug">Protecting families across Eastern North Carolina</p>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {personalInsurance.map((ins, idx) => (
              <ScrollReveal key={ins.slug} delay={idx * 50}>
                <Link href={`/insurance/${ins.slug}`} className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200">
                  <div className="icon-box-navy mb-4 sm:mb-5">
                    {getIconByName(ins.icon)}
                  </div>
                  <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                    {ins.shortTitle}
                  </h3>
                  <p className="text-sm text-navy-500 leading-relaxed mb-4 sm:mb-5">{ins.tagline}</p>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= COMMERCIAL INSURANCE ============= */}
      <section className="section-padding bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <ScrollReveal>
              <div>
                <p className="section-label">Commercial Insurance</p>
                <h2 className="mb-6">Coverage Built for Your Business</h2>
                <p className="text-lg text-navy-600 leading-relaxed mb-10">
                  We work with businesses of all sizes to develop insurance programs that address real operational risks — not just check boxes.
                </p>
                <div className="overflow-hidden mb-10 h-44 sm:h-56 lg:h-64">
                  <img src="/images/AdobeStock_415962919.jpeg" alt="Small business owners" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <Link href="/quote" className="btn-primary">
                  Request a Business Quote
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="space-y-px bg-gray-200">
                {commercialInsurance.slice(0, 4).map((ins) => (
                  <Link key={ins.slug} href={`/insurance/${ins.slug}`} className="bg-white p-6 group block hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      <div className="icon-box-navy w-10 h-10 flex-shrink-0">
                        {getIconByName(ins.icon, 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-navy-900 mb-1 group-hover:text-navy-700 transition-colors">{ins.shortTitle}</h3>
                        <p className="text-sm text-navy-500 leading-relaxed line-clamp-2">{ins.description.slice(0, 120)}...</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {commercialInsurance.slice(4).map((ins) => (
                  <Link key={ins.slug} href={`/insurance/${ins.slug}`} className="text-sm font-medium text-navy-400 hover:text-navy-900 transition-colors">
                    {ins.shortTitle} →
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= PROPERTY INSURANCE ============= */}
      <section className="section-padding bg-navy-900 text-white">
        <div className="container-editorial">
          <ScrollReveal className="max-w-2xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4">Property Insurance</p>
            <h2 className="text-white mb-6">Specialized Property Coverage</h2>
            <p className="text-lg text-navy-300 leading-relaxed">
              From rental units to vacant properties and construction projects — we provide coverage for every stage of property ownership.
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {propertyInsurance.map((ins, idx) => (
              <ScrollReveal key={ins.slug} delay={idx * 50}>
                <Link href={`/insurance/${ins.slug}`} className="bg-navy-900 p-6 sm:p-8 hover:bg-navy-800 transition-colors duration-200 group block h-full">
                  <div className="w-11 h-11 bg-white/[0.06] text-white flex items-center justify-center mb-4 sm:mb-5">
                    {getIconByName(ins.icon)}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{ins.shortTitle}</h3>
                  <p className="text-sm text-navy-300 leading-relaxed mb-5 line-clamp-3">{ins.tagline}</p>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-white transition-colors">
                    Learn more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={250}>
              <Link href="/quote" className="bg-white/[0.04] p-6 sm:p-8 hover:bg-white/[0.08] transition-colors duration-200 group block h-full flex flex-col items-start justify-center">
                <p className="text-sm text-navy-400 mb-3">Not sure what you need?</p>
                <span className="text-base font-semibold text-white group-hover:text-navy-200 transition-colors">
                  Request a property quote →
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= ABOUT PREVIEW ============= */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">About BlackArrow</p>
              <h2 className="mb-6">An Established Independent Agency</h2>
              <p className="text-lg text-navy-600 leading-relaxed mb-6">
                BlackArrow Insurance has served the Eastern North Carolina community since 2002. As a locally-owned independent agency, we provide the kind of attentive, consultative service that larger firms cannot.
              </p>
              <p className="text-navy-500 leading-relaxed mb-10">
                Our team of licensed professionals takes the time to understand your situation and build coverage strategies that evolve with your needs.
              </p>
              <div className="flex gap-6">
                <Link href="/our-story" className="link-arrow">Our Story</Link>
                <Link href="/contact" className="link-arrow">Contact Us</Link>
              </div>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <div className="overflow-hidden">
                <img src="/images/blackarrow-whiteville.jpg" alt="BlackArrow Insurance Whiteville office" className="w-full h-56 sm:h-80 lg:h-[28rem] object-cover" loading="lazy" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                {[
                  { value: '2002', label: 'Founded' },
                  { value: '20+', label: 'Partners' },
                  { value: '2', label: 'Offices' },
                  { value: '9', label: 'Team' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-navy-900">{item.value}</p>
                    <p className="text-xs text-navy-400 mt-1 tracking-wide">{item.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============= SERVICE AREAS ============= */}
      <section className="section-padding-sm bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <p className="section-label">Service Areas</p>
                <h2 className="text-2xl sm:text-3xl">Serving Communities Across North Carolina</h2>
              </div>
              <Link href="/locations" className="link-arrow flex-shrink-0">
                All locations
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {locationPages.map((location, idx) => (
              <ScrollReveal key={location.slug} delay={idx * 50}>
                <Link href={`/locations/${location.slug}`} className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200">
                  <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                    {location.city}, {location.stateAbbr}
                  </h3>
                  <p className="text-sm text-navy-500 leading-relaxed mb-4 line-clamp-2">{location.heroDescription.slice(0, 120)}...</p>
                  <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============= POLICY MANAGEMENT ============= */}
      <section className="section-padding-sm bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="mb-8 sm:mb-12">
              <p className="section-label">Policy Management</p>
              <h2 className="text-2xl sm:text-3xl">Manage Your Policy</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-px bg-gray-200">
            {[
              {
                title: 'Change Mortgagee',
                desc: 'Update your mortgagee information after changing lenders or refinancing.',
                href: '/change-mortgagee',
                iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
              },
              {
                title: 'Loan Number Change',
                desc: 'Update your loan number to keep your insurance records current.',
                href: '/loan-number-change',
                iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              },
              {
                title: 'File a Claim',
                desc: 'File an insurance claim directly with your carrier.',
                href: '/file-a-claim',
                iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.href} delay={idx * 50}>
                <Link href={item.href} className="bg-white p-6 sm:p-8 group block h-full hover:bg-gray-50 transition-colors duration-200">
                  <div className="icon-box-navy mb-4 sm:mb-5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= INSIGHTS ============= */}
      {recentPosts.length > 0 && (
        <>
          <div className="rule" />
          <section className="section-padding bg-white">
            <div className="container-editorial">
              <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-16">
                  <div>
                    <p className="section-label">Insights</p>
                    <h2>Recent Articles</h2>
                  </div>
                  <Link href="/insights" className="link-arrow flex-shrink-0">
                    View all
                  </Link>
                </div>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                {recentPosts.map((post, idx) => (
                  <ScrollReveal key={post.slug} delay={idx * 50}>
                    <InsightCard
                      slug={post.slug}
                      title={post.title}
                      excerpt={post.excerpt}
                      category={post.category}
                      featuredImage={post.featured_image}
                      publishedAt={post.published_at}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

    </>
  )
}
