'use client'

import { useState } from 'react'
import { getRecaptchaToken } from '@/lib/recaptcha'

export default function LoanNumberChangePage() {
  const [form, setForm] = useState({
    policyNumber: '', insuredName: '', propertyAddress: '',
    oldLoanNumber: '', newLoanNumber: '', mortgageeName: '',
    email: '', phone: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const recaptcha_token = await getRecaptchaToken('loan_number_change')
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_type: 'loan-number-change', data: form, recaptcha_token }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/AdobeStock_438274445.jpeg" alt="Homeowner updating loan number on insurance policy after refinancing" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Policy Management</p>
            <h1 className="text-white mb-4 sm:mb-6">Loan Number Change</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              Updating your loan number is quick and simple. Ensure your insurance policy reflects your current financial details by filling out our form.
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
              <p className="text-navy-600 mb-2">Your loan number change has been received. We&apos;ll update your policy and confirm the changes.</p>
            </div>
          ) : (
            <div className="card-premium p-5 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Policy Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className="input-label">Policy Number *</label><input type="text" required className="input-field" value={form.policyNumber} onChange={e => update('policyNumber', e.target.value)} /></div>
                    <div><label className="input-label">Insured Name *</label><input type="text" required className="input-field" value={form.insuredName} onChange={e => update('insuredName', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label className="input-label">Property Address *</label><input type="text" required className="input-field" value={form.propertyAddress} onChange={e => update('propertyAddress', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Loan Number Details</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className="input-label">Current Loan Number</label><input type="text" className="input-field" value={form.oldLoanNumber} onChange={e => update('oldLoanNumber', e.target.value)} /></div>
                    <div><label className="input-label">New Loan Number *</label><input type="text" required className="input-field" value={form.newLoanNumber} onChange={e => update('newLoanNumber', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label className="input-label">Mortgagee Name</label><input type="text" className="input-field" value={form.mortgageeName} onChange={e => update('mortgageeName', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-400 mb-4">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className="input-label">Email *</label><input type="email" required className="input-field" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                    <div><label className="input-label">Phone</label><input type="tel" className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                  </div>
                </div>
                {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
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
