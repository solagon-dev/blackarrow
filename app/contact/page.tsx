'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { offices } from '@/lib/team-data'
import { useFormSubmit } from '@/lib/use-form-submit'
import { IconPhone, IconMail, IconMapPin, IconClock } from '@/components/ui/Icons'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const { status, errorMessage, submit } = useFormSubmit('contact', 'contact')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <Image
          src="/images/blackarrow_greenville.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <h1 className="text-white mb-4 sm:mb-6">Contact Us</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              We&apos;re here for you and all your insurance needs. Reach out to our team at either of our office locations.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info — shown after form on mobile */}
            <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
              {offices.map(office => (
                <div key={office.name} className="card-premium overflow-hidden">
                  <div className="relative h-48 bg-navy-100">
                    <Image
                      src={office.image}
                      alt={office.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-navy-900 mb-1">{office.name}</h2>
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

            {/* Contact Form — shown first on mobile */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="card-premium p-5 sm:p-8">
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
                        <label htmlFor="contact-full-name" className="input-label">Full Name *</label>
                        <input id="contact-full-name" type="text" required className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
                      </div>
                      <div>
                        <label htmlFor="contact-email-address" className="input-label">Email Address *</label>
                        <input id="contact-email-address" type="email" required className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone-number" className="input-label">Phone Number</label>
                        <input id="contact-phone-number" type="tel" className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="input-label">Subject</label>
                        <input id="contact-subject" type="text" className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="input-label">Message *</label>
                      <textarea id="contact-message" required rows={5} className="input-field resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your insurance needs..." />
                    </div>
                    <div aria-live="polite">
                      {status === 'error' && (
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                      )}
                    </div>
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
