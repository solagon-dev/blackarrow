'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverage: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-24 bg-arrow-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Info */}
          <div>
            <span className="text-arrow-gold text-sm font-semibold tracking-widest uppercase border-l-4 border-arrow-gold pl-4">
              Get In Touch
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-6 mb-6 leading-tight">
              Ready to Get
              <span className="block text-arrow-gold">Protected?</span>
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Contact us today for a free, no-obligation quote. Our team of experts is ready to help you find the perfect coverage solution.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-arrow-gold/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-arrow-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-gray-400">1-800-ARROW-INS</p>
                  <p className="text-gray-400 text-sm">Mon-Fri 8AM-8PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-arrow-gold/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-arrow-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">info@blackarrowinsurance.com</p>
                  <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-arrow-gold/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-arrow-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Office</h3>
                  <p className="text-gray-400">123 Insurance Plaza</p>
                  <p className="text-gray-400">New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white p-8 lg:p-10 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-arrow-black mb-6">
              Request a Free Quote
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-arrow-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-arrow-gold focus:ring-2 focus:ring-arrow-gold/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-arrow-black mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-arrow-gold focus:ring-2 focus:ring-arrow-gold/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-arrow-black mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-arrow-gold focus:ring-2 focus:ring-arrow-gold/20 outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="coverage" className="block text-sm font-semibold text-arrow-black mb-2">
                  Coverage Type *
                </label>
                <select
                  id="coverage"
                  name="coverage"
                  required
                  value={formData.coverage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-arrow-gold focus:ring-2 focus:ring-arrow-gold/20 outline-none transition-all"
                >
                  <option value="">Select Coverage Type</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="business">Business Insurance</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-arrow-black mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-arrow-gold focus:ring-2 focus:ring-arrow-gold/20 outline-none transition-all resize-none"
                  placeholder="Tell us about your insurance needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-arrow-black text-white px-8 py-4 font-semibold text-lg hover:bg-arrow-gold hover:text-arrow-black transition-all duration-300"
              >
                Get Free Quote
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
