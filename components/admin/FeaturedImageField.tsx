'use client'

import { useId, useRef, useState } from 'react'

type FeaturedImageFieldProps = {
  value: string
  slugHint?: string
  onChange: (value: string) => void
}

export default function FeaturedImageField({ value, slugHint, onChange }: FeaturedImageFieldProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (slugHint) {
        formData.append('slug', slugHint)
      }

      const response = await fetch('/api/uploads/images', {
        method: 'POST',
        body: formData,
      })

      const body = await response.json().catch(() => null)
      if (!response.ok || !body?.url) {
        throw new Error(body?.error || 'Upload failed')
      }

      onChange(body.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={inputId} className="input-label">Featured Image URL</label>
        <input
          id={inputId}
          type="text"
          className="input-field"
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder="https://... or upload below"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelected}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-outline text-sm py-2 px-4"
        >
          {uploading ? 'Uploading...' : 'Upload with Blob'}
        </button>
        <p className="text-xs text-navy-400">JPG, PNG, or WebP up to 4MB.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {value && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img src={value} alt="" className="w-full h-40 object-cover" />
        </div>
      )}
    </div>
  )
}
