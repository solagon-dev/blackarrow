import Link from 'next/link'
import Image from 'next/image'
import EgHero from '@/components/ui/EgHero'
import type { Metadata } from 'next'
import { getAllPosts, getCategories } from '@/lib/db'
import { estimateReadingTime } from '@/lib/reading-time'
import { resolvePostImage } from '@/lib/post-image'
import { InsightCard } from '@/components/insights/InsightCard'
import InsightsFilter from '@/components/insights/InsightsFilter'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Insurance Insights & Resources for North Carolina',
  description: 'Expert insurance guides and risk management resources from BlackArrow Insurance. Learn about auto, home, business, and coastal coverage topics for North Carolina residents.',
  alternates: { canonical: '/insights' },
  openGraph: {
    title: 'Insurance Insights & Resources | BlackArrow Insurance',
    description: 'Expert insurance guides and risk management resources for North Carolina homeowners, drivers, and business owners.',
    url: 'https://www.blackarrow.co/insights',
    type: 'website',
  },
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
    <div className="eg-field pt-18">
      <EgHero
        image="/images/AdobeStock_220240507.jpeg"
        title="Insights and resources"
        lede="Guidance on coverage, risk and property protection, written for North Carolina homeowners, drivers and business owners."
        actions={<Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>}
      />

      {hasContent ? (
        <>
          {/* Lead article. A media tile beside a text tile at double height —
              the same pattern as the rest of the site, scaled up rather than a
              one-off layout. */}
          {featuredPost && (
            <section className="container-editorial mt-0.5">
              <Link href={`/post/${featuredPost.slug}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-0.5">
                  <div className="relative h-56 sm:h-72 lg:h-[26rem] bg-navy-900 overflow-hidden">
                    {featuredPost.featured_image ? (
                      <Image
                        src={resolvePostImage(featuredPost.featured_image)}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm text-white/70">{featuredPost.category || 'Insurance'}</span>
                      </div>
                    )}
                  </div>
                  <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                    <div className="flex items-center gap-3 mb-4 text-sm text-navy-600">
                      {featuredPost.category && <span>{featuredPost.category}</span>}
                      {featuredPost.category && featuredPost.published_at && <span className="w-1 h-1 rounded-full bg-navy-300" />}
                      {featuredPost.published_at && (
                        <span>
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h2 className="eg-h2">{featuredPost.title}</h2>
                    {featuredPost.excerpt && (
                      <p className="eg-lede mt-4 line-clamp-3">{featuredPost.excerpt}</p>
                    )}
                    <div className="mt-7 flex items-center justify-between gap-4">
                      <span className="eg-link">Read article &rarr;</span>
                      {featuredPost.readingTime && (
                        <span className="text-sm text-navy-600">{featuredPost.readingTime} min read</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Recent */}
          {secondaryFeatured.length > 0 && (
            <section className="container-editorial mt-0.5">
              <div className="eg-tile p-6 sm:p-10 lg:p-12">
                <h2 className="eg-h2">Recent articles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
                {secondaryFeatured.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={i * 50}>
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
            </section>
          )}

          {/* Everything, searchable */}
          <section className="container-editorial mt-0.5">
            <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
              <h2 className="eg-h2">Browse everything</h2>
              <p className="text-sm text-navy-600 flex-shrink-0">
                {enrichedPosts.length} {enrichedPosts.length === 1 ? 'article' : 'articles'} published
              </p>
            </div>
            <div className="mt-0.5">
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
          <section className="container-editorial mt-0.5 pb-0.5">
            <div className="grid lg:grid-cols-2 gap-0.5">
              <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <h2 className="eg-h2">Have a coverage question?</h2>
                <p className="eg-lede mt-4">
                  A licensed agent can answer it in a phone call, whether it&rsquo;s your home, your
                  vehicle, your business or an investment property.
                </p>
              </div>
              <div className="eg-tile flex flex-col justify-center gap-0.5 p-6 sm:p-10 lg:p-12">
                <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
                <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="container-editorial mt-0.5 pb-0.5">
          <div className="eg-tile p-6 sm:p-12 lg:p-16 text-center">
            <h2 className="eg-h2">Nothing published yet</h2>
            <p className="eg-lede mt-4 max-w-[46ch] mx-auto">
              We&rsquo;re writing up the coverage questions we get asked most. Check back soon.
            </p>
            <Link href="/" className="eg-btn-primary mt-7">Back to home</Link>
          </div>
        </section>
      )}
    </div>
  )
}
