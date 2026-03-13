'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import FeaturedImageField from '@/components/admin/FeaturedImageField'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '',
    featured_image: '', seo_title: '', seo_description: '', status: 'draft',
  })

  useEffect(() => {
    async function load() {
      const sessionRes = await fetch('/api/auth/session')
      if (!sessionRes.ok) {
        router.push('/admin')
        return
      }
      const postRes = await fetch(`/api/posts/${id}`)
      if (postRes.ok) {
        const post = await postRes.json()
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || '',
          featured_image: post.featured_image || '',
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
          status: post.status || 'draft',
        })
      }
      setFetching(false)
    }
    load()
  }, [id, router])

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSave = async (publishStatus?: string) => {
    setLoading(true)
    try {
      const payload = publishStatus ? { ...form, status: publishStatus } : form
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      console.error('Error updating post:', err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="inline-block w-5 h-5 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
        <p className="text-sm text-navy-400 mt-3">Loading post...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-1.5 -ml-1.5 text-navy-400 hover:text-navy-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="text-sm font-semibold text-navy-900">Edit Post</h1>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              form.status === 'published' ? 'text-emerald-700' : 'text-amber-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                form.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'
              }`} />
              {form.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {form.status === 'published' ? (
              <>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50"
                >
                  Unpublish
                </button>
                <button
                  onClick={() => handleSave()}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSave()}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-navy-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  Publish
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 p-5 sm:p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Title</label>
                  <input type="text" className="w-full px-4 py-3 text-lg font-medium border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Slug</label>
                  <input type="text" className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white font-mono" value={form.slug} onChange={e => update('slug', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Excerpt</label>
                  <textarea rows={2} className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white resize-none" value={form.excerpt} onChange={e => update('excerpt', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Content (HTML)</label>
                  <textarea rows={20} className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white font-mono resize-y" value={form.content} onChange={e => update('content', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-5 sm:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-4">Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Category</label>
                  <input type="text" className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white" value={form.category} onChange={e => update('category', e.target.value)} />
                </div>
                <FeaturedImageField value={form.featured_image} slugHint={form.slug || form.title} onChange={value => update('featured_image', value)} />
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-5 sm:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">SEO Title</label>
                  <input type="text" className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white" value={form.seo_title} onChange={e => update('seo_title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 mb-2">Meta Description</label>
                  <textarea rows={3} className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white resize-none" value={form.seo_description} onChange={e => update('seo_description', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
