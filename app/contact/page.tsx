'use client'

import { useState } from 'react'
import Link from 'next/link'
import { offices } from '@/lib/team-data'
import { IconPhone, IconMail, IconMapPin, IconClock } from '@/components/ui/Icons'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_type: 'contact', data: form }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/blackarrow_greenville.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">Get in Touch</p>
            <h1 className="text-white mb-6">Contact Us</h1>
            <p className="text-lg text-navy-300 leading-relaxed">
              We&apos;re here for you and all your insurance needs. Reach out to our team at either of our office locations.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              {offices.map(office => (
                <div key={office.name} className="card-premium overflow-hidden">
                  <div className="h-48 bg-navy-100">
                    <img src={office.image} alt={office.imageAlt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-900 mb-1">{office.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconMapPin className="w-4 h-4 text-navy-600" />
                        </div>
                        <p className="text-sm text-navy-600">{office.address}<br />{office.city}, {office.state} {office.zip}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <IconPhone className="w-4 h-4 text-navy-600" />
                        </div>
                        <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="text-sm text-navy-600 hover:text-navy-900 transition-colors">{office.phone}</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <IconMail className="w-4 h-4 text-navy-600" />
                        </div>
                        <a href={`mailto:${office.email}`} className="text-sm text-navy-600 hover:text-navy-900 transition-colors">{office.email}</a>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconClock className="w-4 h-4 text-navy-600" />
                        </div>
                        <p className="text-sm text-navy-600">{office.hours}<br />{office.closed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card-premium p-8">
                <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Send Us a Message</h2>
                <p className="text-navy-600 mb-8">Fill out the form below and one of our agents will get back to you shortly.</p>

                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-navy-900 mb-2">Message Sent!</h3>
                    <p className="text-navy-600 mb-2">Thank you for contacting us. We&apos;ll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Full Name *</label>
                        <input type="text" required className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
                      </div>
                      <div>
                        <label className="input-label">Email Address *</label>
                        <input type="email" required className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Phone Number</label>
                        <input type="tel" className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label className="input-label">Subject</label>
                        <input type="text" className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Message *</label>
                      <textarea required rows={5} className="input-field resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your insurance needs..." />
                    </div>
                    {status === 'error' && (
                      <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                    )}
                    <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
                      {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
