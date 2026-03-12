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

  return (
    <div className="min-h-screen bg-gray-50 -mt-20 pt-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="container-premium py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-navy-900">Dashboard</h1>
            <span className="badge-brand">{posts.length} Posts</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard/posts/new" className="btn-primary text-sm py-2 px-4">
              New Post
            </Link>
            <button onClick={handleLogout} className="btn-ghost text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-1">Total Posts</p>
            <p className="text-3xl font-display font-bold text-navy-900">{posts.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-1">Published</p>
            <p className="text-3xl font-display font-bold text-green-600">{published.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-1">Drafts</p>
            <p className="text-3xl font-display font-bold text-brand-600">{drafts.length}</p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-navy-900">All Posts</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-navy-400">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-navy-500 mb-4">No posts yet</p>
              <Link href="/admin/dashboard/posts/new" className="btn-primary text-sm">Create Your First Post</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {posts.map(post => (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-navy-900 truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {post.status}
                      </span>
                      {post.category && <span className="text-xs text-navy-400">{post.category}</span>}
                      <span className="text-xs text-navy-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/dashboard/posts/${post.id}/edit`}
                      className="inline-flex items-center justify-center text-center text-sm text-brand-600 hover:text-brand-700 font-medium px-3 py-1 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center justify-center text-center text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
