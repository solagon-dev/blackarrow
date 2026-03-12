'use client'

import Link from 'next/link'
import { useState } from 'react'
import { insurancePages } from '@/lib/insurance-data'

const insuranceTypes = insurancePages.map(p => ({ value: p.slug, label: p.title }))

export default function QuotePage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    insuranceType: '', currentInsurance: '', address: '',
    city: '', state: 'NC', zip: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_type: 'quote', data: form }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/AdobeStock_300395016.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">Free Quote</p>
            <h1 className="text-white mb-6">Get a Quote</h1>
            <p className="text-lg text-navy-300 leading-relaxed">
              One of our agents will reach out to you about your quote. Please call our office at{' '}
              <a href="tel:2529555898" className="text-white/80 hover:text-white">(252) 955-5898</a>
              {' '}if you have any questions.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          {status === 'success' ? (
            <div className="card-premium p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Quote Request Received!</h2>
              <p className="text-navy-600 mb-2">Thank you! One of our licensed agents will review your request and reach out to you shortly.</p>
              <Link href="/" className="inline-flex items-center justify-center btn-secondary">Back to Home</Link>
            </div>
          ) : (
            <div className="card-premium p-8 sm:p-10">
              <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Request Your Quote</h2>
              <p className="text-navy-600 mb-8">Fill out the form below and we&apos;ll find the best coverage options for you.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">First Name *</label>
                      <input type="text" required className="input-field" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label className="input-label">Last Name *</label>
                      <input type="text" required className="input-field" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                    </div>
                    <div>
                      <label className="input-label">Email Address *</label>
                      <input type="email" required className="input-field" value={form.email} onChange={e => update('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="input-label">Phone Number *</label>
                      <input type="tel" required className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Insurance Info */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Insurance Details</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="input-label">Type of Insurance *</label>
                      <select required className="input-field" value={form.insuranceType} onChange={e => update('insuranceType', e.target.value)}>
                        <option value="">Select a coverage type</option>
                        {insuranceTypes.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Do you currently have insurance?</label>
                      <div className="flex gap-4 mt-1">
                        {['Yes', 'No'].map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="currentInsurance"
                              value={opt}
                              checked={form.currentInsurance === opt}
                              onChange={e => update('currentInsurance', e.target.value)}
                              className="w-4 h-4 text-navy-900 border-gray-300 focus:ring-navy-900"
                            />
                            <span className="text-sm text-navy-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Address</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="input-label">Street Address</label>
                      <input type="text" className="input-field" value={form.address} onChange={e => update('address', e.target.value)} />
                    </div>
                    <div>
                      <label className="input-label">City</label>
                      <input type="text" className="input-field" value={form.city} onChange={e => update('city', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">State</label>
                        <input type="text" className="input-field" value={form.state} onChange={e => update('state', e.target.value)} />
                      </div>
                      <div>
                        <label className="input-label">ZIP Code</label>
                        <input type="text" className="input-field" value={form.zip} onChange={e => update('zip', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="input-label">Additional Information</label>
                  <textarea rows={4} className="input-field resize-none" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Any additional details about your insurance needs..." />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again or call us directly.</p>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
                  {status === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
