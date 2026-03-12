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
      {/* Search + Filters */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pb-8 border-b border-gray-200">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-center text-sm font-medium transition-colors duration-200 ${
                !activeCategory ? 'text-navy-900' : 'text-navy-400 hover:text-navy-900'
              }`}
            >
              All Topics
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`text-center text-sm font-medium transition-colors duration-200 ${
                  activeCategory === cat ? 'text-navy-900' : 'text-navy-400 hover:text-navy-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search insights..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 bg-white text-navy-900 placeholder:text-navy-400 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-navy-400 text-lg mb-2">No articles found</p>
          <p className="text-navy-400 text-sm">
            {search ? 'Try a different search term.' : 'Check back soon for new insights.'}
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

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="text-xs text-navy-400 mt-8 pt-8 border-t border-gray-200">
          Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {activeCategory ? ` in ${activeCategory}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}
    </div>
  )
}
