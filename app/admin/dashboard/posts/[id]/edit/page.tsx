'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center -mt-20 pt-20"><p className="text-navy-400">Loading...</p></div>
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
            <h1 className="text-xl font-display font-bold text-navy-900">Edit Post</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-700'
            }`}>{form.status}</span>
          </div>
          <div className="flex items-center gap-3">
            {form.status === 'published' ? (
              <>
                <button onClick={() => handleSave('draft')} disabled={loading} className="btn-ghost text-sm text-brand-600 hover:bg-brand-50">Unpublish</button>
                <button onClick={() => handleSave()} disabled={loading} className="btn-primary text-sm py-2 px-4">Save Changes</button>
              </>
            ) : (
              <>
                <button onClick={() => handleSave()} disabled={loading} className="btn-outline text-sm py-2 px-4">Save Draft</button>
                <button onClick={() => handleSave('published')} disabled={loading} className="btn-primary text-sm py-2 px-4">Publish</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-5">
                <div>
                  <label className="input-label">Title</label>
                  <input type="text" className="input-field text-lg" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Slug</label>
                  <input type="text" className="input-field" value={form.slug} onChange={e => update('slug', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Excerpt</label>
                  <textarea rows={2} className="input-field resize-none" value={form.excerpt} onChange={e => update('excerpt', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Content (HTML)</label>
                  <textarea rows={20} className="input-field font-mono text-sm resize-y" value={form.content} onChange={e => update('content', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-navy-900 mb-4">Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Category</label>
                  <input type="text" className="input-field" value={form.category} onChange={e => update('category', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Featured Image URL</label>
                  <input type="text" className="input-field" value={form.featured_image} onChange={e => update('featured_image', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-navy-900 mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">SEO Title</label>
                  <input type="text" className="input-field" value={form.seo_title} onChange={e => update('seo_title', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Meta Description</label>
                  <textarea rows={3} className="input-field resize-none" value={form.seo_description} onChange={e => update('seo_description', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
