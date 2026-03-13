'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  category: string | null
  published_at: string | null
  created_at: string
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/session')
      if (!res.ok) {
        router.push('/admin')
        return
      }
      loadPosts()
    }
    checkAuth()
  }, [router])

  async function loadPosts() {
    try {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== id))
    }
  }

  const published = posts.filter(p => p.status === 'published')
  const drafts = posts.filter(p => p.status === 'draft')
  const filteredPosts = filter === 'all' ? posts : filter === 'published' ? published : drafts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-navy-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="/images/BlackArrowLogo.svg" alt="BlackArrow" className="h-5 brightness-0 invert opacity-70" />
            <span className="hidden sm:block text-xs text-navy-400 uppercase tracking-[0.15em] font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-navy-400 hover:text-white transition-colors">
              View Site
            </Link>
            <button onClick={handleLogout} className="text-xs text-navy-400 hover:text-red-400 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Welcome + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 sm:pt-10 pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy-900">Content</h1>
            <p className="text-sm text-navy-400 mt-1">Manage your blog posts and articles</p>
          </div>
          <Link href="/admin/dashboard/posts/new" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-900 text-white text-sm font-medium tracking-wide hover:bg-navy-800 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-gray-200 mb-8">
          {[
            { label: 'Total Posts', value: posts.length, color: 'text-navy-900' },
            { label: 'Published', value: published.length, color: 'text-emerald-600' },
            { label: 'Drafts', value: drafts.length, color: 'text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs + table */}
        <div className="bg-white border border-gray-200 mb-10">
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-gray-200">
            {(['all', 'published', 'draft'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  filter === tab
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-navy-400 hover:text-navy-700'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'published' ? 'Published' : 'Drafts'}
                <span className="ml-2 text-xs text-navy-300">
                  {tab === 'all' ? posts.length : tab === 'published' ? published.length : drafts.length}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-5 h-5 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
              <p className="text-sm text-navy-400 mt-3">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-sm text-navy-500 mb-1">
                {filter === 'all' ? 'No posts yet' : `No ${filter} posts`}
              </p>
              {filter === 'all' && (
                <Link href="/admin/dashboard/posts/new" className="text-sm text-navy-900 font-medium underline underline-offset-4 decoration-navy-300 hover:decoration-navy-900 transition-colors">
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 border-b border-gray-100 bg-gray-50/50">
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1"></div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {filteredPosts.map(post => (
                  <div key={post.id} className="group px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    {/* Desktop */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 min-w-0">
                        <Link href={`/admin/dashboard/posts/${post.id}/edit`} className="font-medium text-navy-900 hover:text-navy-700 transition-colors truncate block">
                          {post.title || 'Untitled'}
                        </Link>
                        <p className="text-xs text-navy-300 mt-0.5 truncate">/{post.slug}</p>
                      </div>
                      <div className="col-span-2">
                        {post.category ? (
                          <span className="text-xs text-navy-500">{post.category}</span>
                        ) : (
                          <span className="text-xs text-navy-300">&mdash;</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          post.status === 'published' ? 'text-emerald-700' : 'text-amber-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`} />
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-navy-400">
                          {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/dashboard/posts/${post.id}/edit`}
                          className="p-1.5 text-navy-400 hover:text-navy-900 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-navy-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link href={`/admin/dashboard/posts/${post.id}/edit`} className="font-medium text-navy-900 block truncate">
                            {post.title || 'Untitled'}
                          </Link>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              post.status === 'published' ? 'text-emerald-700' : 'text-amber-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'
                              }`} />
                              {post.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            {post.category && <span className="text-xs text-navy-400">{post.category}</span>}
                            <span className="text-xs text-navy-300">
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Link
                            href={`/admin/dashboard/posts/${post.id}/edit`}
                            className="p-2 text-navy-400 hover:text-navy-900 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-navy-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
