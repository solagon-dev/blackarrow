import Link from 'next/link'

interface InsightCardProps {
  slug: string
  title: string
  excerpt?: string | null
  category?: string | null
  featuredImage?: string | null
  publishedAt?: string | null
  readingTime?: number
  author?: string | null
  variant?: 'default' | 'featured' | 'compact'
}

export function InsightCard({ slug, title, excerpt, category, featuredImage, publishedAt, readingTime, author, variant = 'default' }: InsightCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  if (variant === 'featured') {
    return (
      <Link href={`/post/${slug}`} className="group block">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 h-48 sm:h-56 lg:h-80 bg-navy-900 flex items-center justify-center overflow-hidden">
            {featuredImage ? (
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <span className="text-navy-500 text-sm uppercase tracking-[0.2em]">{category || 'Insurance'}</span>
            )}
          </div>
          <div className="lg:col-span-7 py-2">
            <div className="flex items-center gap-3 mb-4">
              {category && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">{category}</span>}
              {category && formattedDate && <span className="w-1 h-1 rounded-full bg-navy-300" />}
              {formattedDate && <span className="text-xs text-navy-400">{formattedDate}</span>}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-4 sm:mb-5 group-hover:text-navy-700 transition-colors leading-tight">
              {title}
            </h2>
            {excerpt && <p className="text-base sm:text-lg text-navy-500 leading-relaxed mb-5 sm:mb-6 max-w-xl">{excerpt}</p>}
            <div className="flex items-center gap-4">
              {author && <span className="text-sm text-navy-500">{author}</span>}
              {author && readingTime && <span className="w-1 h-1 rounded-full bg-navy-300" />}
              {readingTime && <span className="text-sm text-navy-400">{readingTime} min read</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/post/${slug}`} className="group flex gap-5 py-5 border-b border-gray-200 last:border-b-0">
        <div className="w-24 h-24 bg-navy-50 overflow-hidden flex items-center justify-center flex-shrink-0">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-400 px-3 text-center">
              {category || 'Insight'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-navy-900 group-hover:text-navy-700 transition-colors line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-3">
            {category && <span className="text-xs text-navy-400">{category}</span>}
            {category && readingTime && <span className="w-1 h-1 rounded-full bg-navy-300" />}
            {readingTime && <span className="text-xs text-navy-400">{readingTime} min read</span>}
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/post/${slug}`} className="bg-white group flex flex-col h-full hover:bg-gray-50 transition-colors duration-200">
      <div className="h-40 sm:h-52 bg-navy-50 overflow-hidden flex items-center justify-center">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 px-6 text-center">
            {category || 'Insurance'}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-8 flex flex-1 flex-col">
        <div className="flex items-center gap-3 mb-4">
          {category && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">{category}</span>}
          {category && formattedDate && <span className="w-1 h-1 rounded-full bg-navy-300" />}
          {formattedDate && <span className="text-xs text-navy-400">{formattedDate}</span>}
        </div>
        <h3 className="text-lg font-semibold text-navy-900 mb-3 group-hover:text-navy-700 transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-navy-500 line-clamp-3 leading-relaxed mb-4">{excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-auto">
          {author && <span className="text-xs text-navy-500">{author}</span>}
          {author && readingTime && <span className="w-1 h-1 rounded-full bg-navy-300" />}
          {readingTime && <span className="text-xs text-navy-400">{readingTime} min read</span>}
        </div>
      </div>
    </Link>
  )
}
