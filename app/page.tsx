import Link from 'next/link'
import Image from 'next/image'
import { personalInsurance, commercialInsurance, propertyInsurance, getInsuranceHeroImage } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { getAllPosts } from '@/lib/db'
import { ensureAdminUser } from '@/lib/auth'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CarrierLogoCarousel from '@/components/ui/CarrierLogoCarousel'
import HeroBackground from '@/components/ui/HeroBackground'
import EgHero from '@/components/ui/EgHero'
import { resolvePostImage } from '@/lib/post-image'

/**
 * Homepage — Enterprise Grid.
 *
 * The system is documented in globals.css. The two structural moves that carry
 * this page:
 *
 *  - `bg-field` + `gap-0.5` everywhere a group of tiles sits together. The 2px
 *    of field showing through the gutters is what draws the grid; there are no
 *    borders, radii or shadows anywhere on the page.
 *  - Media is full-bleed inside its own tile and the words sit in the tile
 *    beside it. The single exception is the hero, where a hard-edged tile is
 *    pulled up over the video band — text over a faded photo would dissolve
 *    exactly the structure this system is for.
 *
 * Every image here already existed in the repo: coverage photos come from
 * getInsuranceHeroImage, city photos from the locations port, article images
 * from the posts themselves.
 */

const policyActions = [
  { title: 'Change Mortgagee', desc: 'Update your mortgagee after changing lenders or refinancing.', href: '/change-mortgagee' },
  { title: 'Loan Number Change', desc: 'Update your loan number to keep your insurance records current.', href: '/loan-number-change' },
  { title: 'File a Claim', desc: 'File an insurance claim directly with your carrier.', href: '/file-a-claim' },
]

/** Media tile: a photograph filling its cell edge to edge, nothing on top. */
function MediaTile({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-navy-900 min-h-[240px] sm:min-h-[300px] ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
    </div>
  )
}

/** Coverage tile: locked 16:10 thumbnail, then text. Link foot pinned to the base. */
function CoverageTile({ slug, title, tagline }: { slug: string; title: string; tagline: string }) {
  // h-full matters: the grid item is the ScrollReveal wrapper, so without it the
  // tile shrinks to its content and a two-line tagline drops the link below its
  // neighbours' baseline.
  return (
    <Link href={`/insurance/${slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        <Image
          src={getInsuranceHeroImage(slug)}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-semibold text-navy-900 mb-2">{title}</h3>
        <p className="text-sm text-navy-600 leading-relaxed">{tagline}</p>
        <span className="eg-link mt-auto pt-5">Learn more &rarr;</span>
      </div>
    </Link>
  )
}

export default async function Home() {
  await ensureAdminUser()
  let recentPosts: { title: string; slug: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null }[] = []
  try {
    recentPosts = (await getAllPosts('published')).slice(0, 3)
  } catch {}

  return (
    /* pt-18 clears the fixed header, which on this page is an opaque tile
       rather than a transparent bar over the hero. */
    <div className="eg-field pt-18">

      {/* ============= HERO ============= */}
      <EgHero
        band="tall"
        title={<>Protecting Your Tomorrow, <span className="font-semibold">Today</span></>}
        lede="An independent brokerage serving Eastern North Carolina. We compare coverage from 20+ carriers to find the right protection at the right price."
        actions={
          <>
            <Link href="/quote" className="eg-btn-primary">Request a Quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an Advisor</Link>
          </>
        }
      >
        <HeroBackground />
      </EgHero>

      {/* ============= STATS ============= */}
      <div className="container-editorial mt-0.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5">
          {[
            { value: '20+', label: 'Years' },
            { value: '20+', label: 'Carriers' },
            { value: '2', label: 'Offices' },
            { value: '17+', label: 'Coverages' },
          ].map((stat) => (
            <div key={stat.label} className="eg-stat">
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============= CARRIERS ============= */}
      <div className="mt-0.5">
        <CarrierLogoCarousel />
      </div>

      {/* ============= PERSONAL ============= */}
      <section className="container-editorial mt-0.5">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-0.5">
            <MediaTile
              src="/images/AdobeStock_300395016.jpeg"
              alt="A North Carolina family at home, protected by BlackArrow home and auto coverage"
            />
            <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              {/* Heading names the category itself now that the label above it
                  is gone — "Coverage that fits" alone didn't say personal. */}
              <h2 className="eg-h2">Coverage for your home, your cars and your family</h2>
              <p className="eg-lede mt-4">
                We build the policy around your house, your cars and your risk &mdash; not a template with your name dropped in. In Eastern NC, how a policy handles wind and water is where the real differences show up.
              </p>
              <Link href="/quote" className="eg-link mt-6">All personal coverage &rarr;</Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {personalInsurance.map((ins, idx) => (
            <ScrollReveal key={ins.slug} delay={idx * 50}>
              <CoverageTile slug={ins.slug} title={ins.shortTitle} tagline={ins.tagline} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============= COMMERCIAL ============= */}
      <section className="container-editorial mt-0.5">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-0.5">
            <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:order-first">
              <h2 className="eg-h2">Built for fleets, crews and job sites</h2>
              <p className="eg-lede mt-4">
                Dump trucks, contractors&rsquo; liability, workers&rsquo; comp audits. Once a vehicle is working for the business, a personal auto policy won&rsquo;t answer a claim.
              </p>
              <Link href="/quote" className="eg-link mt-6">Request a business quote &rarr;</Link>
            </div>
            <MediaTile
              src="/images/AdobeStock_415962919.jpeg"
              alt="North Carolina small business owners reviewing their commercial insurance"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {commercialInsurance.slice(0, 6).map((ins, idx) => (
            <ScrollReveal key={ins.slug} delay={idx * 50}>
              <CoverageTile slug={ins.slug} title={ins.shortTitle} tagline={ins.tagline} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============= PROPERTY ============= */}
      <section className="container-editorial mt-0.5">
        <ScrollReveal>
          <div className="eg-tile eg-tile-dark p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2 max-w-[24ch]">From rental units to vacant buildings and construction sites</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {propertyInsurance.map((ins, idx) => (
            <ScrollReveal key={ins.slug} delay={idx * 50}>
              <CoverageTile slug={ins.slug} title={ins.shortTitle} tagline={ins.tagline} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============= LOCATIONS ============= */}
      <section className="container-editorial mt-0.5">
        <ScrollReveal>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Serving communities across North Carolina</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
          {locationPages.map((location, idx) => (
            <ScrollReveal key={location.slug} delay={idx * 50}>
              <Link href={`/locations/${location.slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-navy-900 mb-2">
                    {location.city}, {location.stateAbbr}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed line-clamp-3">{location.heroDescription}</p>
                  <span className="eg-link mt-auto pt-5">Learn more &rarr;</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============= POLICY MANAGEMENT ============= */}
      <section className="container-editorial mt-0.5">
        <ScrollReveal>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Manage an existing policy</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 mt-0.5">
          {policyActions.map((item, idx) => (
            <ScrollReveal key={item.href} delay={idx * 50}>
              <Link href={item.href} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200 p-5 sm:p-6">
                <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.desc}</p>
                <span className="eg-link mt-auto pt-5">Continue &rarr;</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============= INSIGHTS ============= */}
      {recentPosts.length > 0 && (
        <section className="container-editorial mt-0.5 pb-0.5">
          <ScrollReveal>
            <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
              <div>
                <h2 className="eg-h2">Recent articles</h2>
              </div>
              <Link href="/insights" className="eg-link flex-shrink-0">View all &rarr;</Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
            {recentPosts.map((post, idx) => {
              const img = resolvePostImage(post.featured_image)
              return (
                <ScrollReveal key={post.slug} delay={idx * 50}>
                  <Link href={`/post/${post.slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                      {img && (
                        <Image
                          src={img}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(max-width: 760px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      {/* Plain metadata, not a styled eyebrow — a category on an
                          article card is content, the same as a date. */}
                      {post.category && <p className="text-sm text-navy-600 mb-2">{post.category}</p>}
                      <h3 className="text-base font-semibold text-navy-900 mb-2 line-clamp-2">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-navy-600 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                      <span className="eg-link mt-auto pt-5">Read article &rarr;</span>
                    </div>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}
