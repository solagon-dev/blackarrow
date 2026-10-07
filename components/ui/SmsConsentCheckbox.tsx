'use client'

import Link from 'next/link'

/**
 * Optional SMS opt-in checkbox for forms that collect a phone number.
 * Unchecked by default and never required to submit — consent must be an
 * affirmative, optional choice, not a condition of using the form.
 */
export default function SmsConsentCheckbox({
  id,
  checked,
  onChange,
  disabled = false,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 w-4 h-4 flex-shrink-0 border-gray-300 text-navy-900 focus:ring-navy-900 focus:ring-offset-0"
      />
      <label htmlFor={id} className="text-xs text-navy-600 leading-relaxed">
        I agree to receive conversational text messages from BlackArrow Insurance about my quote or policy service at the number provided. Message frequency varies. Message and data rates may apply. Reply HELP for help or STOP to opt out at any time. Consent is optional and is not a condition of purchase.{' '}
        <Link href="/legal/privacy-policy" className="underline hover:text-navy-900">Privacy Policy</Link>
        {disabled && <span className="block mt-1">Enter a phone number to sign up for texts.</span>}
      </label>
    </div>
  )
}
