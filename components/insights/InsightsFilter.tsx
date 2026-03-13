'use client'

import { useState, useMemo } from 'react'
import { InsightCard } from './InsightCard'

interface Post {
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  featured_image: string | null
  published_at: string | null
  readingTime: number
  author: string | null
}

interface InsightsFilterProps {
  posts: Post[]
  categories: string[]
}

export default function InsightsFilter({ posts, categories }: InsightsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = posts
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    }
    return result
  }, [posts, activeCategory, search])

  return (
    <div>
      {/* Search + Category Filters */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between mb-8 sm:mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 touch-manipulation ${
              !activeCategory
                ? 'bg-navy-900 text-white'
                : 'bg-white text-navy-500 hover:text-navy-900 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 touch-manipulation ${
                activeCategory === cat
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-navy-500 hover:text-navy-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 bg-white text-navy-900 placeholder:text-navy-400 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Active filter indicator */}
      {(activeCategory || search) && (
        <div className="flex items-center gap-3 mb-6">
          <p className="text-sm text-navy-500">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {activeCategory && <> in <span className="font-medium text-navy-700">{activeCategory}</span></>}
            {search && <> matching <span className="font-medium text-navy-700">&ldquo;{search}&rdquo;</span></>}
          </p>
          <button
            onClick={() => { setActiveCategory(null); setSearch('') }}
            className="text-xs font-medium text-navy-400 hover:text-navy-900 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <svg className="w-12 h-12 text-navy-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="text-navy-900 font-semibold mb-1">No articles found</p>
          <p className="text-sm text-navy-400">
            {search ? 'Try a different search term or clear your filters.' : 'Try selecting a different category.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {filtered.map((post) => (
            <InsightCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              featuredImage={post.featured_image}
              publishedAt={post.published_at}
              readingTime={post.readingTime}
              author={post.author}
            />
          ))}
        </div>
      )}
    </div>
  )
}
