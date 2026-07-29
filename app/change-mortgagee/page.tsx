'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useFormSubmit } from '@/lib/use-form-submit'

export default function ChangeMortgageePage() {
  const [form, setForm] = useState({
    policyNumber: '', insuredName: '', propertyAddress: '',
    newMortgageeName: '', newMortgageeAddress: '', loanNumber: '',
    email: '', phone: '',
  })
  const { status, errorMessage, submit } = useFormSubmit('change-mortgagee', 'change_mortgagee')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit(form)
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <Image
          src="/images/AdobeStock_169692156.jpeg"
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Policy Management</p>
            <h1 className="text-white mb-4 sm:mb-6">Change Mortgagee</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              Keep your insurance coverage current by easily updating your mortgagee information. Whether you&apos;ve changed lenders or refinanced, please fill out the form below.
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
              <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Request Submitted!</h2>
              <p className="text-navy-600 mb-2">Your mortgagee change request has been received. We&apos;ll process it and reach out if we need additional information.</p>
            </div>
          ) : (
            <div className="card-premium p-5 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-600 mb-4">Policy Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label htmlFor="mortgagee-policy-number" className="input-label">Policy Number *</label><input id="mortgagee-policy-number" type="text" required className="input-field" value={form.policyNumber} onChange={e => update('policyNumber', e.target.value)} /></div>
                    <div><label htmlFor="mortgagee-insured-name" className="input-label">Insured Name *</label><input id="mortgagee-insured-name" type="text" required className="input-field" value={form.insuredName} onChange={e => update('insuredName', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label htmlFor="mortgagee-property-address" className="input-label">Property Address *</label><input id="mortgagee-property-address" type="text" required className="input-field" value={form.propertyAddress} onChange={e => update('propertyAddress', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-600 mb-4">New Mortgagee Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2"><label htmlFor="mortgagee-new-mortgagee-name" className="input-label">New Mortgagee Name *</label><input id="mortgagee-new-mortgagee-name" type="text" required className="input-field" value={form.newMortgageeName} onChange={e => update('newMortgageeName', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label htmlFor="mortgagee-new-mortgagee-address" className="input-label">New Mortgagee Address *</label><input id="mortgagee-new-mortgagee-address" type="text" required className="input-field" value={form.newMortgageeAddress} onChange={e => update('newMortgageeAddress', e.target.value)} /></div>
                    <div><label htmlFor="mortgagee-loan-number" className="input-label">Loan Number</label><input id="mortgagee-loan-number" type="text" className="input-field" value={form.loanNumber} onChange={e => update('loanNumber', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-600 mb-4">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label htmlFor="mortgagee-email" className="input-label">Email *</label><input id="mortgagee-email" type="email" required className="input-field" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                    <div><label htmlFor="mortgagee-phone" className="input-label">Phone</label><input id="mortgagee-phone" type="tel" className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                  </div>
                </div>
                <div aria-live="polite">{status === 'error' && <p className="text-red-600 text-sm">{errorMessage}</p>}</div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary">
                  {status === 'loading' ? 'Submitting...' : 'Submit Change Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
