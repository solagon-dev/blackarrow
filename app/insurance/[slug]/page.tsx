import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { insurancePages, getInsuranceBySlug, getInsuranceHeroImage, carriers } from '@/lib/insurance-data'
import { serviceLocationPages } from '@/lib/service-location-data'
import { getPostsByCategory } from '@/lib/db'
import ScrollReveal from '@/components/ui/ScrollReveal'
import EgHero from '@/components/ui/EgHero'
import { resolvePostImage } from '@/lib/post-image'

export function generateStaticParams() {
  return insurancePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getInsuranceBySlug(slug)
  if (!page) return {}
  const heroImage = getInsuranceHeroImage(page.slug)
  // Strip any pre-existing " | BlackArrow Insurance" suffix — layout template adds it automatically.
  const cleanTitle = page.seoTitle.replace(/\s*\|\s*BlackArrow Insurance\s*$/i, '')
  const canonical = `/insurance/${page.slug}`
  return {
    title: cleanTitle,
    description: page.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: cleanTitle,
      description: page.seoDescription,
      url: `https://www.blackarrow.co${canonical}`,
      type: 'website',
      images: [{ url: heroImage, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: page.seoDescription,
      images: [heroImage],
    },
  }
}

function InsurancePageSchema({ page, heroImage }: { page: (typeof insurancePages)[0]; heroImage: string }) {
  const pageUrl = `https://www.blackarrow.co/insurance/${page.slug}`

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: page.title,
    description: page.description,
    serviceType: page.title,
    provider: { '@id': 'https://www.blackarrow.co/#organization' },
    areaServed: { '@type': 'State', name: 'North Carolina' },
    image: `https://www.blackarrow.co${heroImage}`,
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${page.title} Coverage Types`,
      itemListElement: page.coverageTypes.map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.title, description: c.description },
      })),
    },
  }

  const faqSchema = page.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: page.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.blackarrow.co/' },
      { '@type': 'ListItem', position: 2, name: 'Insurance', item: 'https://www.blackarrow.co/quote' },
      { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}

export default async function InsurancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getInsuranceBySlug(slug)
  if (!page) notFound()
  const heroImage = getInsuranceHeroImage(page.slug)

  const relatedPages = page.relatedSlugs.map(s => insurancePages.find(p => p.slug === s)).filter(Boolean)
  let relatedPosts: { title: string; slug: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null; content: string }[] = []
  try {
    relatedPosts = (await getPostsByCategory(page.shortTitle)).slice(0, 3)
  } catch {}

  return (
    <div className="eg-field pt-18">
      <InsurancePageSchema page={page} heroImage={heroImage} />

      <EgHero
        image={heroImage}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-600">
              <li><Link href="/" className="hover:text-navy-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/insurance" className="hover:text-navy-900">Insurance</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-900">{page.shortTitle}</li>
            </ol>
          </nav>
        }
        title={page.title}
        lede={page.description}
        actions={
          <>
            <Link href="/quote" className="eg-btn-primary">Get a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an agent</Link>
          </>
        }
      />

      {/* Coverage types. Numbered because a policy's coverage parts genuinely
          are an enumerated list, not because numbers look tidy. */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">What {page.shortTitle} covers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {page.coverageTypes.map((coverage, idx) => (
            <ScrollReveal key={idx} delay={idx * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <span className="block text-sm font-semibold text-signal mb-3 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-navy-900 mb-2">{coverage.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{coverage.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Who needs it */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Who needs {page.shortTitle.toLowerCase()} coverage</h2>
            <Link href="/quote" className="eg-btn-primary mt-7 self-start">Get a personalised quote &rarr;</Link>
          </div>
          <div className="grid gap-0.5">
            {page.whoNeeds.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="eg-tile h-full flex gap-5 p-5 sm:p-6">
                  {/* Numbered, not iconed: this used to render the page's own
                      icon on every row, so all three carried the same glyph. */}
                  <span className="text-sm font-semibold text-signal tabular-nums pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-navy-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Premium factors */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">What moves your premium</h2>
            <p className="eg-lede mt-4">
              These are the levers a carrier actually prices on. We&rsquo;ll tell you which of them
              you can change and which you can&rsquo;t.
            </p>
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <ul className="divide-y divide-gray-200">
              {page.costFactors.map((factor, idx) => (
                <li key={idx} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                  <span className="text-sm font-semibold text-signal tabular-nums pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-navy-700 leading-relaxed">{factor}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {page.faqs.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">{page.shortTitle} questions we get asked</h2>
          </div>
          <div className="eg-tile mt-0.5 px-6 sm:px-10 lg:px-12">
            <div className="divide-y divide-gray-200">
              {page.faqs.map((faq, idx) => (
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

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Reading on {page.shortTitle.toLowerCase()}</h2>
            <Link href="/insights" className="eg-link flex-shrink-0">View all &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
            {relatedPosts.map((post, idx) => {
              const img = resolvePostImage(post.featured_image)
              return (
                <ScrollReveal key={post.slug} delay={idx * 50}>
                  <Link href={`/post/${post.slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                      {img && (
                        <Image src={img} alt="" aria-hidden="true" fill sizes="(max-width: 760px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
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

      {/* Related coverage */}
      {relatedPages.length > 0 && (
        <section className="container-editorial mt-0.5">
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Coverage that often goes with it</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 mt-0.5">
            {relatedPages.map((rp, idx) => rp && (
              <ScrollReveal key={rp.slug} delay={idx * 50}>
                <Link href={`/insurance/${rp.slug}`} className="eg-tile group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                    <Image src={getInsuranceHeroImage(rp.slug)} alt="" aria-hidden="true" fill sizes="(max-width: 760px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-base font-semibold text-navy-900 mb-2">{rp.shortTitle}</h3>
                    <p className="text-sm text-navy-600 leading-relaxed">{rp.tagline}</p>
                    <span className="eg-link mt-auto pt-5">Learn more &rarr;</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* By location */}
      {(() => {
        const locationVariants = serviceLocationPages.filter(sp => sp.insuranceSlug === page.slug)
        if (locationVariants.length === 0) return null
        return (
          <section className="container-editorial mt-0.5">
            <div className="eg-tile p-6 sm:p-10 lg:p-12">
              <h3 className="text-base font-semibold text-navy-900 mb-5">{page.shortTitle} by city</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {locationVariants.map(sp => (
                  <Link key={sp.slug} href={`/${sp.slug}`} className="eg-link">
                    {sp.serviceType} in {sp.city}, {sp.stateAbbr} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Carriers */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h3 className="text-base font-semibold text-navy-900 mb-5">
            We compare {page.shortTitle.toLowerCase()} rates from
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
            <h2 className="eg-h2">Get your {page.shortTitle.toLowerCase()} quote</h2>
            <p className="eg-lede mt-4">
              A licensed agent in Greenville or Whiteville will compare the market and come back
              with what actually fits. No obligation.
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
