import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { insurancePages, getInsuranceBySlug, getInsuranceHeroImage, carriers } from '@/lib/insurance-data'
import { getIconByName } from '@/components/ui/Icons'
import { getPostsByCategory } from '@/lib/db'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { InsightCard } from '@/components/insights/InsightCard'

export function generateStaticParams() {
  return insurancePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getInsuranceBySlug(slug)
  if (!page) return {}
  const heroImage = getInsuranceHeroImage(page.slug)
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    openGraph: { title: page.seoTitle, description: page.seoDescription, images: [heroImage] },
  }
}

export default async function InsurancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getInsuranceBySlug(slug)
  if (!page) notFound()
  const heroImage = getInsuranceHeroImage(page.slug)

  const relatedPages = page.relatedSlugs.map(s => insurancePages.find(p => p.slug === s)).filter(Boolean)
  let relatedPosts: { title: string; slug: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null; content: string }[] = []
  try {
    relatedPosts = getPostsByCategory(page.shortTitle).slice(0, 3)
  } catch {}

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">
                {page.category === 'personal' ? 'Personal Insurance' : page.category === 'commercial' ? 'Commercial Insurance' : 'Property Insurance'}
            </p>
            <h1 className="text-white mb-6">{page.title}</h1>
            <p className="text-lg text-navy-300 leading-relaxed mb-10 max-w-2xl">{page.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-secondary">
                Get a Quote
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Speak with an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal className="max-w-3xl mb-16">
            <p className="section-label">What&apos;s Covered</p>
            <h2>Coverage Types</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {page.coverageTypes.map((coverage, idx) => (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="bg-white p-8 h-full">
                  <span className="text-xs font-semibold text-navy-300 tracking-wide">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg font-semibold text-navy-900 mt-3 mb-3">{coverage.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{coverage.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* Who Needs This */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Who Benefits</p>
              <h2 className="mb-6">Who Needs {page.title}?</h2>
              <p className="text-navy-500 leading-relaxed mb-10">
                {page.title} is designed for a variety of individuals and organizations. Find out if this coverage is right for you.
              </p>
              <Link href="/quote" className="btn-primary">Get a Personalized Quote</Link>
            </ScrollReveal>
            <div className="lg:col-span-7 space-y-px bg-gray-200">
              {page.whoNeeds.map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 60}>
                  <div className="bg-white p-6 flex gap-5">
                    <div className="icon-box-navy w-10 h-10 flex-shrink-0">
                      {getIconByName(page.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="section-padding bg-gray-50 border-y border-gray-200">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <p className="section-label">Pricing Factors</p>
              <h2>What Affects Your Premium</h2>
            </ScrollReveal>
            <div className="space-y-0 border-t border-gray-200">
              {page.costFactors.map((factor, idx) => (
                <ScrollReveal key={idx} delay={idx * 40}>
                  <div className="flex items-start gap-5 py-5 border-b border-gray-200">
                    <span className="text-sm font-semibold text-navy-300 w-8 flex-shrink-0 pt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-navy-700">{factor}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <p className="section-label">FAQs</p>
              <h2>Frequently Asked Questions</h2>
            </ScrollReveal>
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {page.faqs.map((faq, idx) => (
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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding-sm bg-gray-50 border-y border-gray-200">
          <div className="container-editorial">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="section-label">Related Insights</p>
                  <h2 className="text-3xl">{page.shortTitle} Articles</h2>
                </div>
                <Link href="/insights" className="link-arrow hidden sm:flex flex-shrink-0">
                  View all
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {relatedPosts.map((post, idx) => (
                <ScrollReveal key={post.slug} delay={idx * 60}>
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
      )}

      {/* Related Coverage */}
      <section className="section-padding-sm bg-white border-b border-gray-200">
        <div className="container-editorial">
          <ScrollReveal>
            <p className="section-label mb-8">Related Coverages</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-px bg-gray-200">
            {relatedPages.map((rp, idx) => rp && (
              <ScrollReveal key={rp.slug} delay={idx * 60}>
                <Link href={`/insurance/${rp.slug}`} className="bg-white p-8 group block h-full hover:bg-gray-50 transition-colors duration-200">
                  <div className="icon-box-navy w-10 h-10 mb-4">
                    {getIconByName(rp.icon, 'w-5 h-5')}
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">{rp.shortTitle}</h3>
                  <p className="text-sm text-navy-500 line-clamp-2">{rp.tagline}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="py-12 bg-white">
        <div className="container-editorial">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-6">
            We compare {page.shortTitle} rates from leading carriers
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {carriers.map(name => (
              <span key={name} className="text-sm font-medium text-navy-300">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-900 text-white">
        <div className="container-editorial text-center">
          <ScrollReveal>
            <h2 className="text-white mb-6">Get Your {page.shortTitle} Quote Today</h2>
            <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our licensed agents will help you find the right {page.shortTitle.toLowerCase()} coverage at the best rate. No obligation, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
