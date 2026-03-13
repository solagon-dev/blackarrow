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

export default async function InsightsPage() {
  let posts: { id: string; title: string; slug: string; content: string; category: string | null; excerpt: string | null; featured_image: string | null; published_at: string | null; author_id: string | null }[] = []
  let categories: string[] = []
  try {
    posts = await getAllPosts('published')
    categories = await getCategories()
  } catch {}

  const enrichedPosts = posts.map(post => ({
    ...post,
    readingTime: estimateReadingTime(post.content),
    author: 'BlackArrow Insurance' as string | null,
  }))

  const featuredPost = enrichedPosts[0]
  const secondaryFeatured = enrichedPosts.slice(1, 4)
  const hasContent = enrichedPosts.length > 0

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/AdobeStock_220240507.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Knowledge Center</p>
            <h1 className="text-white mb-4 sm:mb-6">Insights &amp; Resources</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed max-w-2xl">
              Expert guidance on insurance coverage, risk management, and property protection — helping you make informed decisions about what matters most.
            </p>
          </div>
        </div>
      </section>

      {hasContent ? (
        <>
          {/* Featured Article */}
          {featuredPost && (
            <section className="section-padding bg-white">
              <div className="container-editorial">
                <ScrollReveal>
                  <p className="section-label mb-10 sm:mb-12">Featured Article</p>
                </ScrollReveal>
                <ScrollReveal>
                  <Link href={`/post/${featuredPost.slug}`} className="group block">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="h-56 sm:h-72 lg:h-[26rem] bg-navy-900 overflow-hidden">
                        {featuredPost.featured_image ? (
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-navy-500 text-sm uppercase tracking-[0.2em]">{featuredPost.category || 'Insurance'}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-5">
                          {featuredPost.category && (
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">{featuredPost.category}</span>
                          )}
                          {featuredPost.category && featuredPost.published_at && <span className="w-1 h-1 rounded-full bg-navy-300" />}
                          {featuredPost.published_at && (
                            <span className="text-xs text-navy-400">
                              {new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900 mb-4 sm:mb-5 group-hover:text-navy-700 transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-base text-navy-500 leading-relaxed mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {featuredPost.readingTime && <span className="text-xs text-navy-400">{featuredPost.readingTime} min read</span>}
                          </div>
                          <span className="text-sm font-medium text-navy-400 group-hover:text-navy-900 transition-colors">
                            Read article →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              </div>
            </section>
          )}

          {/* Latest Articles — 3-up */}
          {secondaryFeatured.length > 0 && (
            <>
              <div className="rule" />
              <section className="section-padding bg-white">
                <div className="container-editorial">
                  <ScrollReveal>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
                      <div>
                        <p className="section-label">Latest</p>
                        <h2 className="text-2xl sm:text-3xl">Recent Articles</h2>
                      </div>
                    </div>
                  </ScrollReveal>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
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

          {/* All Articles with Search & Filter */}
          <section className="section-padding bg-gray-50 border-y border-gray-200">
            <div className="container-editorial">
              <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
                  <div>
                    <p className="section-label">All Insights</p>
                    <h2 className="text-2xl sm:text-3xl">Browse by Topic</h2>
                  </div>
                  <p className="text-sm text-navy-400">{enrichedPosts.length} {enrichedPosts.length === 1 ? 'article' : 'articles'} published</p>
                </div>
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

          {/* CTA */}
          <section className="bg-navy-900 py-16 sm:py-24 lg:py-32 text-white">
            <div className="container-editorial text-center">
              <ScrollReveal>
                <h2 className="text-white mb-4 sm:mb-6">Have a Coverage Question?</h2>
                <p className="text-base sm:text-lg text-navy-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                  Our team of licensed professionals is ready to help you find the right protection for your home, vehicle, business, or investment property.
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
