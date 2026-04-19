import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/db'
import { estimateReadingTime, formatReadingTime } from '@/lib/reading-time'
import { InsightCard } from '@/components/insights/InsightCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

function resolveArticleImageUrl(imageUrl: string | null) {
  if (!imageUrl) return undefined
  return imageUrl.startsWith('http') ? imageUrl : `https://www.blackarrow.co${imageUrl}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const rawTitle = post.seo_title || post.title
  const cleanTitle = rawTitle.replace(/\s*\|\s*BlackArrow Insurance\s*$/i, '')
  const description = post.seo_description || post.excerpt || ''
  const canonical = `/post/${post.slug}`
  return {
    title: cleanTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: cleanTitle,
      description,
      url: `https://www.blackarrow.co${canonical}`,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: ['BlackArrow Insurance'],
      section: post.category || undefined,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts('published')
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post || post.status !== 'published') notFound()

  const related = await getRelatedPosts(slug, post.category, 4)
  const readingTime = estimateReadingTime(post.content)
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const heroImage = post.featured_image || '/images/AdobeStock_315458621.jpeg'

  const postUrl = `https://www.blackarrow.co/post/${post.slug}`

  // JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    headline: post.title,
    name: post.title,
    description: post.excerpt || post.seo_description || '',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    articleSection: post.category || 'Insurance',
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : undefined,
    inLanguage: 'en-US',
    author: {
      '@type': 'Organization',
      name: 'BlackArrow Insurance',
      url: 'https://www.blackarrow.co',
    },
    publisher: { '@id': 'https://www.blackarrow.co/#organization' },
    image: post.featured_image ? [resolveArticleImageUrl(post.featured_image)] : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.blackarrow.co/' },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://www.blackarrow.co/insights' },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-24">
        <img src={heroImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/85" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <Link href="/insights" className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-white transition-colors mb-8 sm:mb-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Insights
            </Link>

            {/* Article Metadata */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              {post.category && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">{post.category}</span>}
              {post.category && formattedDate && <span className="w-1 h-1 rounded-full bg-navy-500" />}
              {formattedDate && <span className="text-xs text-navy-400">{formattedDate}</span>}
              <span className="w-1 h-1 rounded-full bg-navy-500" />
              <span className="text-xs text-navy-400">{formatReadingTime(readingTime)}</span>
            </div>

            <h1 className="text-white mb-6 sm:mb-8">{post.title}</h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-navy-300 leading-relaxed max-w-2xl">{post.excerpt}</p>
            )}
          </div>
        </div>
      </section>

      {/* Author Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-editorial py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-navy-900 flex items-center justify-center flex-shrink-0">
              <img src="/images/BlackArrow_Favicon.svg" alt="" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">BlackArrow Insurance</p>
              <p className="text-xs text-navy-400">Insurance Advisory &middot; Eastern North Carolina</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <article className="prose-premium" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </section>

      {/* Article Footer — Tags + Share */}
      <div className="bg-white border-t border-gray-200">
        <div className="container-editorial py-6 sm:py-8">
          <div className="max-w-3xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {post.category && (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 border border-gray-200 px-3 py-1.5">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-navy-400">{formatReadingTime(readingTime)}</span>
            </div>
            <Link href="/insights" className="text-sm font-medium text-navy-400 hover:text-navy-900 transition-colors">
              More insights →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-navy-900 py-14 sm:py-20 lg:py-24">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-4 sm:mb-5">Need {post.category || 'Insurance'} Coverage?</h2>
            <p className="text-navy-300 mb-6 sm:mb-8 leading-relaxed">Talk to a BlackArrow agent about your coverage options today.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/quote" className="btn-secondary">Request a Quote</Link>
              <Link href="/contact" className="btn-outline-white">Speak with an Advisor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <p className="section-label">Continue Reading</p>
                <h2 className="text-2xl sm:text-3xl">Related Articles</h2>
              </div>
              <Link href="/insights" className="link-arrow hidden sm:flex flex-shrink-0">
                All insights
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
              {related.map((rp, i) => (
                <ScrollReveal key={rp.slug} delay={i * 50}>
                  <InsightCard
                    slug={rp.slug}
                    title={rp.title}
                    excerpt={rp.excerpt}
                    category={rp.category}
                    featuredImage={rp.featured_image}
                    publishedAt={rp.published_at}
                    readingTime={estimateReadingTime(rp.content)}
                    author="BlackArrow Insurance"
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
