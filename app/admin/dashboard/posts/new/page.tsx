'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '',
    featured_image: '', seo_title: '', seo_description: '', status: 'draft',
  })

  useEffect(() => {
    fetch('/api/auth/session').then(res => {
      if (!res.ok) router.push('/admin')
    })
  }, [router])

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const update = (field: string, value: string) => {
    setForm(f => {
      const updated = { ...f, [field]: value }
      if (field === 'title' && !f.slug) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const handleSubmit = async (publishStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publishStatus }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      console.error('Error creating post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 -mt-20 pt-20">
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="container-premium py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-navy-500 hover:text-navy-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-display font-bold text-navy-900">New Post</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSubmit('draft')} disabled={loading} className="btn-outline text-sm py-2 px-4">
              Save Draft
            </button>
            <button onClick={() => handleSubmit('published')} disabled={loading} className="btn-primary text-sm py-2 px-4">
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-5">
                <div>
                  <label className="input-label">Title</label>
                  <input type="text" className="input-field text-lg" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Post title" />
                </div>
                <div>
                  <label className="input-label">Slug</label>
                  <input type="text" className="input-field" value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="post-url-slug" />
                </div>
                <div>
                  <label className="input-label">Excerpt</label>
                  <textarea rows={2} className="input-field resize-none" value={form.excerpt} onChange={e => update('excerpt', e.target.value)} placeholder="Brief summary for listings and SEO" />
                </div>
                <div>
                  <label className="input-label">Content (HTML)</label>
                  <textarea rows={20} className="input-field font-mono text-sm resize-y" value={form.content} onChange={e => update('content', e.target.value)} placeholder="<p>Write your article content here...</p>" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-navy-900 mb-4">Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Category</label>
                  <input type="text" className="input-field" value={form.category} onChange={e => update('category', e.target.value)} placeholder="e.g., Homeowner's, Auto" />
                </div>
                <div>
                  <label className="input-label">Featured Image URL</label>
                  <input type="text" className="input-field" value={form.featured_image} onChange={e => update('featured_image', e.target.value)} placeholder="/images/post-image.jpg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-navy-900 mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">SEO Title</label>
                  <input type="text" className="input-field" value={form.seo_title} onChange={e => update('seo_title', e.target.value)} placeholder="Custom title for search engines" />
                </div>
                <div>
                  <label className="input-label">Meta Description</label>
                  <textarea rows={3} className="input-field resize-none" value={form.seo_description} onChange={e => update('seo_description', e.target.value)} placeholder="Description for search engine results" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
