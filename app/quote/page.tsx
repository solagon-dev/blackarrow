'use client'

import Link from 'next/link'
import { useState } from 'react'
import { insurancePages } from '@/lib/insurance-data'

const insuranceTypes = insurancePages.map(p => ({ value: p.slug, label: p.title }))

const steps = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Coverage' },
  { id: 3, label: 'Property' },
  { id: 4, label: 'Review' },
]

export default function QuotePage() {
  const [step, setStep] = useState(1)
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

  const canAdvance = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone
    if (step === 2) return form.insuranceType
    return true
  }

  return (
    <>
      {/* Hero — compact, conversion-focused */}
      <section className="bg-navy-950 relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14 lg:pt-44 lg:pb-20">
        <img src="/images/AdobeStock_300395016.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-950/85" />
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">No Obligation</p>
            <h1 className="text-white mb-4 sm:mb-5">Get Your Free Quote</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed max-w-xl">
              Compare rates from 20+ carriers in minutes. One of our licensed agents will review your needs and find the right coverage at the best price.
            </p>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main form area */}
            <div className="lg:col-span-7 xl:col-span-8">
              {status === 'success' ? (
                <div className="py-16 sm:py-24 text-center">
                  <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900 mb-3">Quote Request Received</h2>
                  <p className="text-navy-500 mb-2 max-w-md mx-auto">Thank you, {form.firstName}. One of our licensed agents will review your request and reach out within one business day.</p>
                  <p className="text-sm text-navy-400 mb-8">Need immediate assistance? Call <a href="tel:2529555898" className="text-navy-900 font-medium">(252) 955-5898</a></p>
                  <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy-900 hover:text-navy-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center gap-0 mb-10 sm:mb-12">
                    {steps.map((s, i) => (
                      <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <button
                          type="button"
                          onClick={() => { if (s.id < step) setStep(s.id) }}
                          className={`flex items-center gap-2.5 group ${s.id <= step ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <span className={`w-8 h-8 flex items-center justify-center text-xs font-semibold transition-colors ${
                            s.id < step
                              ? 'bg-navy-900 text-white'
                              : s.id === step
                              ? 'bg-navy-900 text-white'
                              : 'bg-gray-100 text-navy-300'
                          }`}>
                            {s.id < step ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : s.id}
                          </span>
                          <span className={`text-sm font-medium hidden sm:block ${
                            s.id <= step ? 'text-navy-900' : 'text-navy-300'
                          }`}>
                            {s.label}
                          </span>
                        </button>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-px mx-3 sm:mx-4 ${
                            s.id < step ? 'bg-navy-900' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <div className="animate-fade-in">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">Personal Information</h2>
                        <p className="text-sm text-navy-400 mb-8">Tell us about yourself so we can personalize your quote.</p>
                        <div className="space-y-5">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                              <label className="input-label">First Name *</label>
                              <input type="text" required className="input-field" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="John" />
                            </div>
                            <div>
                              <label className="input-label">Last Name *</label>
                              <input type="text" required className="input-field" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Smith" />
                            </div>
                          </div>
                          <div>
                            <label className="input-label">Email Address *</label>
                            <input type="email" required className="input-field" value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" />
                          </div>
                          <div>
                            <label className="input-label">Phone Number *</label>
                            <input type="tel" required className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(555) 123-4567" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Coverage */}
                    {step === 2 && (
                      <div className="animate-fade-in">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">Coverage Details</h2>
                        <p className="text-sm text-navy-400 mb-8">Select the type of insurance you&apos;re interested in.</p>
                        <div className="space-y-6">
                          <div>
                            <label className="input-label">Type of Insurance *</label>
                            <select required className="input-field" value={form.insuranceType} onChange={e => update('insuranceType', e.target.value)}>
                              <option value="">Select a coverage type</option>
                              {insuranceTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="input-label">Do you currently have insurance?</label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              {['Yes', 'No'].map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => update('currentInsurance', opt)}
                                  className={`py-3.5 text-sm font-medium border transition-colors ${
                                    form.currentInsurance === opt
                                      ? 'border-navy-900 bg-navy-900 text-white'
                                      : 'border-gray-200 text-navy-600 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Property */}
                    {step === 3 && (
                      <div className="animate-fade-in">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">Property Information</h2>
                        <p className="text-sm text-navy-400 mb-8">Help us provide an accurate quote with your property details.</p>
                        <div className="space-y-5">
                          <div>
                            <label className="input-label">Street Address</label>
                            <input type="text" className="input-field" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street" />
                          </div>
                          <div className="grid sm:grid-cols-3 gap-5">
                            <div className="sm:col-span-1">
                              <label className="input-label">City</label>
                              <input type="text" className="input-field" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Greenville" />
                            </div>
                            <div>
                              <label className="input-label">State</label>
                              <input type="text" className="input-field" value={form.state} onChange={e => update('state', e.target.value)} />
                            </div>
                            <div>
                              <label className="input-label">ZIP Code</label>
                              <input type="text" className="input-field" value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="27858" />
                            </div>
                          </div>
                          <div>
                            <label className="input-label">Additional Information</label>
                            <textarea rows={4} className="input-field resize-none" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Any details about your insurance needs, current coverage, or specific concerns..." />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                      <div className="animate-fade-in">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">Review Your Information</h2>
                        <p className="text-sm text-navy-400 mb-8">Please confirm everything looks correct before submitting.</p>

                        <div className="space-y-0 border-t border-gray-200">
                          {[
                            { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                            { label: 'Email', value: form.email },
                            { label: 'Phone', value: form.phone },
                            { label: 'Insurance Type', value: insuranceTypes.find(t => t.value === form.insuranceType)?.label || form.insuranceType },
                            { label: 'Currently Insured', value: form.currentInsurance || 'Not specified' },
                            ...(form.address ? [{ label: 'Address', value: `${form.address}${form.city ? `, ${form.city}` : ''}${form.state ? `, ${form.state}` : ''} ${form.zip}`.trim() }] : []),
                            ...(form.message ? [{ label: 'Additional Info', value: form.message }] : []),
                          ].map(item => (
                            <div key={item.label} className="flex items-start justify-between gap-4 py-4 border-b border-gray-200">
                              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 w-32 sm:w-40 flex-shrink-0 pt-0.5">{item.label}</span>
                              <span className="text-sm text-navy-700 text-right">{item.value}</span>
                            </div>
                          ))}
                        </div>

                        {status === 'error' && (
                          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 mt-6">
                            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-sm text-red-700">Something went wrong. Please try again or call us directly at (910) 914-6074.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={() => setStep(s => s - 1)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </button>
                      ) : <div />}

                      {step < 4 ? (
                        <button
                          type="button"
                          onClick={() => { if (canAdvance()) setStep(s => s + 1) }}
                          disabled={!canAdvance()}
                          className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 text-white text-sm font-medium tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Continue
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 text-white text-sm font-medium tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
                        >
                          {status === 'loading' ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Quote Request
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar — trust signals */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Why BlackArrow */}
                <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-6">Why BlackArrow</h3>
                  <div className="space-y-5">
                    {[
                      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '20+ Years Experience', desc: 'Trusted by Eastern NC since 2003' },
                      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', title: '20+ Carriers Compared', desc: 'We shop the market so you don\'t have to' },
                      { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Licensed Local Agents', desc: 'Real people at two NC offices' },
                      { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'No Obligation', desc: 'Free quotes with zero pressure' },
                    ].map(item => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy-900">{item.title}</p>
                          <p className="text-xs text-navy-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact card */}
                <div className="border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4">Prefer to Talk?</h3>
                  <p className="text-sm text-navy-500 mb-5">Our agents are available Monday through Friday, 8:30 AM to 5:00 PM.</p>
                  <a href="tel:9109146074" className="flex items-center gap-3 group">
                    <span className="w-10 h-10 bg-navy-900 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-lg font-display font-bold text-navy-900 group-hover:text-navy-700 transition-colors">(910) 914-6074</p>
                      <p className="text-xs text-navy-400">Call for immediate assistance</p>
                    </div>
                  </a>
                </div>

                {/* Security note */}
                <div className="flex items-start gap-3 px-1">
                  <svg className="w-4 h-4 text-navy-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs text-navy-400 leading-relaxed">Your information is encrypted and secure. We never sell your data to third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
