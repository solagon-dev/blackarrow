'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useFormSubmit } from '@/lib/use-form-submit'

export default function LoanNumberChangePage() {
  const [form, setForm] = useState({
    policyNumber: '', insuredName: '', propertyAddress: '',
    oldLoanNumber: '', newLoanNumber: '', mortgageeName: '',
    email: '', phone: '',
  })
  const { status, errorMessage, submit } = useFormSubmit('loan-number-change', 'loan_number_change')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit(form)
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <>
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <Image
          src="/images/AdobeStock_438274445.jpeg"
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
            <p className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-4 sm:mb-5">Policy management</p>
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
                  <h3 className="text-sm font-semibold tracking-[0.04em] text-navy-600 mb-4">Policy information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label htmlFor="loan-policy-number" className="input-label">Policy Number *</label><input id="loan-policy-number" type="text" required className="input-field" value={form.policyNumber} onChange={e => update('policyNumber', e.target.value)} /></div>
                    <div><label htmlFor="loan-insured-name" className="input-label">Insured Name *</label><input id="loan-insured-name" type="text" required className="input-field" value={form.insuredName} onChange={e => update('insuredName', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label htmlFor="loan-property-address" className="input-label">Property Address *</label><input id="loan-property-address" type="text" required className="input-field" value={form.propertyAddress} onChange={e => update('propertyAddress', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-[0.04em] text-navy-600 mb-4">Loan number details</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label htmlFor="loan-current-loan-number" className="input-label">Current Loan Number</label><input id="loan-current-loan-number" type="text" className="input-field" value={form.oldLoanNumber} onChange={e => update('oldLoanNumber', e.target.value)} /></div>
                    <div><label htmlFor="loan-new-loan-number" className="input-label">New Loan Number *</label><input id="loan-new-loan-number" type="text" required className="input-field" value={form.newLoanNumber} onChange={e => update('newLoanNumber', e.target.value)} /></div>
                    <div className="sm:col-span-2"><label htmlFor="loan-mortgagee-name" className="input-label">Mortgagee Name</label><input id="loan-mortgagee-name" type="text" className="input-field" value={form.mortgageeName} onChange={e => update('mortgageeName', e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-[0.04em] text-navy-600 mb-4">Contact information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label htmlFor="loan-email" className="input-label">Email *</label><input id="loan-email" type="email" required className="input-field" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                    <div><label htmlFor="loan-phone" className="input-label">Phone</label><input id="loan-phone" type="tel" className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
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
