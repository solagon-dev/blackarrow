import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/db'
import { estimateReadingTime, formatReadingTime } from '@/lib/reading-time'
import { InsightCard } from '@/components/insights/InsightCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import EgHero from '@/components/ui/EgHero'
import { resolvePostImage } from '@/lib/post-image'

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
  const ogImage = resolvePostImage(post.featured_image)
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
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
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
  const heroImage = resolvePostImage(post.featured_image) || '/images/AdobeStock_315458621.jpeg'

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
    image: post.featured_image ? [resolveArticleImageUrl(resolvePostImage(post.featured_image))] : undefined,
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
    <div className="eg-field pt-18">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <EgHero
        image={heroImage}
        maxWidth="max-w-[52rem]"
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-600">
              <li><Link href="/" className="hover:text-navy-900">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/insights" className="hover:text-navy-900">Insights</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-navy-900 line-clamp-1">{post.title}</li>
            </ol>
          </nav>
        }
        meta={
          <>
            {post.category && <span>{post.category}</span>}
            {post.category && formattedDate && <span className="w-1 h-1 rounded-full bg-navy-300" />}
            {formattedDate && <span>{formattedDate}</span>}
            <span className="w-1 h-1 rounded-full bg-navy-300" />
            <span>{formatReadingTime(readingTime)}</span>
          </>
        }
        title={post.title}
        lede={post.excerpt || undefined}
      />

      {/* Article body. Deliberately NOT a tile grid: long-form prose wants a
          single reading column of ~65 characters, so this is one wide reading
          tile with the author bar and footer bracketing the text. */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-[42rem]">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-navy-900 flex items-center justify-center flex-shrink-0">
                <img src="/images/BlackArrow_Favicon.svg" alt="" aria-hidden="true" width={20} height={20} className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">BlackArrow Insurance</p>
                <p className="text-sm text-navy-600">Insurance advisory &middot; Eastern North Carolina</p>
              </div>
            </div>

            <article className="prose-premium py-8 sm:py-10" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                {post.category && (
                  <Link href="/insights" className="text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors">
                    {post.category}
                  </Link>
                )}
                <span className="text-sm text-navy-600">{formatReadingTime(readingTime)}</span>
              </div>
              <Link href="/insights" className="eg-link">More insights &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Need {post.category ? post.category.toLowerCase() : 'insurance'} coverage?</h2>
            <p className="eg-lede mt-4">
              Talk to a BlackArrow agent about your options. We compare the market and come back
              with what actually fits.
            </p>
          </div>
          <div className="eg-tile flex flex-col justify-center gap-0.5 p-6 sm:p-10 lg:p-12">
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-editorial mt-0.5 pb-0.5">
          <div className="eg-tile flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Related articles</h2>
            <Link href="/insights" className="eg-link flex-shrink-0">All insights &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
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
        </section>
      )}
    </div>
  )
}
