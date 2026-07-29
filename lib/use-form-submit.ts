'use client'

import { useRef, useState } from 'react'
import { getRecaptchaToken } from './recaptcha'
import { analytics } from './analytics'

/** Map a form type to its conversion analytics event (no PII sent). */
function trackConversion(formType: string) {
  if (formType === 'quote') analytics.quoteSubmit()
  else if (formType === 'contact') analytics.contactSubmit()
  else if (formType === 'change-mortgagee' || formType === 'loan-number-change') {
    analytics.policyManagementSubmit(formType)
  }
}

/**
 * Shared client submit hook for website forms (Plan §4.5, §4.7).
 *
 * Responsibilities:
 *  - Generate a stable idempotency key per submission intent and reuse it across
 *    retries; reset only after a successful (2xx) response so a retried submit
 *    never creates a duplicate lead/notification.
 *  - Surface an accurate error message from the server (used by an aria-live
 *    region in each form — Plan §8/§12.1).
 *  - Treat any 2xx (200 stored+notified, or 202 one durable path) as success,
 *    and any non-2xx (incl. 503 when both paths fail) as an error.
 */

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const GENERIC_ERROR =
  'We could not submit your request. Please try again in a moment, or call us so we can help you directly.'

function newKey(): string {
  const c = globalThis.crypto as Crypto | undefined
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useFormSubmit(formType: string, recaptchaAction: string) {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const keyRef = useRef<string | null>(null)

  async function submit(data: Record<string, unknown>): Promise<boolean> {
    setStatus('loading')
    setErrorMessage('')
    if (!keyRef.current) keyRef.current = newKey()

    try {
      const recaptcha_token = await getRecaptchaToken(recaptchaAction)
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: formType,
          data,
          recaptcha_token,
          idempotency_key: keyRef.current,
        }),
      })

      if (res.ok) {
        keyRef.current = null // allow a fresh submission next time
        trackConversion(formType) // fires once per successful submit (no PII)
        setStatus('success')
        return true
      }

      const body = (await res.json().catch(() => ({}))) as { error?: string }
      setErrorMessage(body.error || GENERIC_ERROR)
      setStatus('error')
      return false
    } catch {
      setErrorMessage(
        'We could not reach the server. Please check your connection and try again, or call us.'
      )
      setStatus('error')
      return false
    }
  }

  function reset() {
    setStatus('idle')
    setErrorMessage('')
  }

  return { status, setStatus, errorMessage, submit, reset }
}
