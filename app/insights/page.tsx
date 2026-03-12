import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts, getCategories } from '@/lib/db'
import { estimateReadingTime } from '@/lib/reading-time'
import { InsightCard } from '@/components/insights/InsightCard'
import InsightsFilter from '@/components/insights/InsightsFilter'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Insights & Resources',
  description: 'Insurance insights, expert guides, and risk management resources from the BlackArrow Insurance team. Stay informed about coverage, protection strategies, and industry trends.',
}

export const dynamic = 'force-dynamic'

const TOPIC_CATEGORIES = [
  { label: 'Homeowner Insurance', slug: 'homeowner-insurance' },
  { label: 'Auto Insurance', slug: 'auto-insurance' },
  { label: 'Commercial Insurance', slug: 'commercial-insurance' },
  { label: 'Rental Property', slug: 'rental-property' },
  { label: 'Risk Management', slug: 'risk-management' },
  { label: 'Insurance Education', slug: 'insurance-education' },
]

export default function InsightsPage() {
  let posts: { id: string; title: string; slug: string; content: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null; author_id: string | null }[] = []
  let categories: string[] = []
  try {
    posts = getAllPosts('published')
    categories = getCategories()
  } catch {}

  // Enrich posts with reading time
  const enrichedPosts = posts.map(post => ({
    ...post,
    readingTime: estimateReadingTime(post.content),
    author: 'BlackArrow Insurance' as string | null,
  }))

  const featuredPost = enrichedPosts[0]
  const secondaryFeatured = enrichedPosts.slice(1, 3)
  const hasContent = enrichedPosts.length > 0

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/AdobeStock_220240507.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">Knowledge Center</p>
              <h1 className="text-white">Insights &amp; Resources</h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-lg text-navy-300 leading-relaxed">
                Expert guidance on insurance coverage, risk management, and property protection — helping you make informed decisions about what matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {hasContent ? (
        <>
          {/* Featured Insight */}
          {featuredPost && (
            <section className="section-padding bg-white">
              <div className="container-editorial">
                <ScrollReveal>
                  <p className="section-label mb-10">Featured</p>
                  <InsightCard
                    slug={featuredPost.slug}
                    title={featuredPost.title}
                    excerpt={featuredPost.excerpt}
                    category={featuredPost.category}
                    featuredImage={featuredPost.featured_image}
                    publishedAt={featuredPost.published_at}
                    readingTime={featuredPost.readingTime}
                    author={featuredPost.author}
                    variant="featured"
                  />
                </ScrollReveal>
              </div>
            </section>
          )}

          {/* Secondary Featured — Editorial Two-Up */}
          {secondaryFeatured.length > 0 && (
            <>
              <div className="rule" />
              <section className="section-padding bg-white">
                <div className="container-editorial">
                  <ScrollReveal>
                    <p className="section-label mb-12">Latest</p>
                  </ScrollReveal>
                  <div className="grid sm:grid-cols-2 gap-px bg-gray-200">
                    {secondaryFeatured.map((post, i) => (
                      <ScrollReveal key={post.slug} delay={i * 60}>
                        <InsightCard
                          slug={post.slug}
                          title={post.title}
                          excerpt={post.excerpt}
                          category={post.category}
                          featuredImage={post.featured_image}
                          publishedAt={post.published_at}
                          readingTime={post.readingTime}
                          author={post.author}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Topic Categories */}
          <section className="py-16 bg-gray-50 border-y border-gray-200">
            <div className="container-editorial">
              <ScrollReveal>
                <p className="section-label mb-10">Explore by Topic</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200">
                  {TOPIC_CATEGORIES.map(topic => (
                    <div key={topic.slug} className="bg-white p-6 text-center">
                      <p className="text-sm font-semibold text-navy-900">{topic.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* All Articles with Search & Filter */}
          <section className="section-padding bg-white">
            <div className="container-editorial">
              <ScrollReveal>
                <p className="section-label mb-2">All Insights</p>
                <h2 className="text-3xl mb-10">Browse Articles</h2>
              </ScrollReveal>
              <InsightsFilter
                posts={enrichedPosts.map(p => ({
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  category: p.category,
                  featured_image: p.featured_image,
                  published_at: p.published_at,
                  readingTime: p.readingTime,
                  author: p.author,
                }))}
                categories={categories}
              />
            </div>
          </section>

          {/* Popular Articles — Editorial two-column layout */}
          {enrichedPosts.length > 5 && (
            <>
              <div className="rule" />
              <section className="section-padding-sm bg-white">
                <div className="container-editorial">
                  <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-5">
                      <ScrollReveal>
                        <p className="section-label">Most Read</p>
                        <h2 className="text-2xl mb-8">Popular Articles</h2>
                        <div>
                          {enrichedPosts.slice(0, 5).map(post => (
                            <InsightCard
                              key={post.slug}
                              slug={post.slug}
                              title={post.title}
                              category={post.category}
                              featuredImage={post.featured_image}
                              readingTime={post.readingTime}
                              variant="compact"
                            />
                          ))}
                        </div>
                      </ScrollReveal>
                    </div>
                    <div className="lg:col-span-7">
                      <ScrollReveal delay={100}>
                        <p className="section-label">Guides</p>
                        <h2 className="text-2xl mb-8">Educational Resources</h2>
                        <p className="text-navy-500 leading-relaxed mb-8 max-w-lg">
                          Our team publishes in-depth guides to help you understand your coverage options, avoid common insurance mistakes, and make informed decisions about protecting what matters.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-px bg-gray-200">
                          {enrichedPosts.slice(0, 4).map(post => (
                            <Link
                              key={`guide-${post.slug}`}
                              href={`/post/${post.slug}`}
                              className="bg-white p-6 group block hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="h-32 bg-navy-50 overflow-hidden flex items-center justify-center mb-4">
                                {post.featured_image ? (
                                  <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  />
                                ) : (
                                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400 px-4 text-center">
                                    {post.category || 'Insight'}
                                  </span>
                                )}
                              </div>
                              {post.category && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-2 block">{post.category}</span>}
                              <h3 className="text-sm font-semibold text-navy-900 group-hover:text-navy-700 transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <span className="text-xs text-navy-400 mt-2 block">{post.readingTime} min read</span>
                            </Link>
                          ))}
                        </div>
                      </ScrollReveal>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* CTA */}
          <section className="bg-navy-900 py-24 lg:py-32 text-white">
            <div className="container-editorial text-center">
              <ScrollReveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">Stay Informed</p>
                <h2 className="text-white mb-6">Insurance guidance when you need it</h2>
                <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Have questions about your coverage? Our team of licensed professionals is ready to help you find the right protection.
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
      ) : (
        /* Empty State */
        <section className="section-padding bg-white">
          <div className="container-editorial text-center">
            <h2 className="text-3xl font-display font-bold text-navy-900 mb-5">Coming Soon</h2>
            <p className="text-lg text-navy-500 mb-10 max-w-lg mx-auto">
              We&apos;re preparing expert insurance insights and educational resources. Check back soon.
            </p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        </section>
      )}
    </>
  )
}
