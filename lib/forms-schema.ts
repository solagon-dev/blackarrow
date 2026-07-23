import { z } from 'zod'
import type { SupportedFormType } from './forms-email'

/**
 * Typed validation for website form submissions (Plan §4.5.1, §4.5.12).
 *
 * Goals:
 *  - Reject malformed or oversized payloads (anti-abuse) WITHOUT rejecting
 *    legitimate leads. Every field is length-bounded; each form requires a
 *    contactable identity (email or phone) so a captured lead is actionable.
 *  - Stay lenient about extra fields on the quote form, which will grow into a
 *    branching flow (Plan §10.5). Unknown quote fields are preserved; other
 *    forms strip unknown keys.
 */

// Field length limits (characters).
export const LIMITS = {
  short: 200, // names, subject, city, state, policy/loan numbers, insurance type
  email: 254,
  phone: 40,
  address: 300,
  zip: 20,
  message: 5000,
  idempotencyKey: 200,
} as const

/** Maximum raw request body size in bytes (Plan §4.5.12). */
export const MAX_BODY_BYTES = 100 * 1024 // 100 KB

const shortStr = z.string().trim().max(LIMITS.short)
const emailStr = z.string().trim().max(LIMITS.email).email()
const phoneStr = z.string().trim().max(LIMITS.phone)
const messageStr = z.string().trim().max(LIMITS.message)

/** At least one of email/phone must be present and non-empty. */
function requireContactable<T extends { email?: string; phone?: string }>(
  schema: z.ZodType<T>
): z.ZodEffects<z.ZodType<T>> {
  return schema.refine(
    (d) => Boolean((d.email && d.email.length > 0) || (d.phone && d.phone.length > 0)),
    { message: 'Provide an email address or phone number so we can reach you.', path: ['email'] }
  )
}

const contactSchema = requireContactable(
  z
    .object({
      name: shortStr.min(1, 'Name is required'),
      email: emailStr.optional().or(z.literal('')),
      phone: phoneStr.optional(),
      subject: shortStr.optional(),
      message: messageStr.min(1, 'Message is required'),
    })
    .strip()
)

const quoteSchema = requireContactable(
  z
    .object({
      firstName: shortStr.min(1, 'First name is required'),
      lastName: shortStr.optional(),
      email: emailStr.optional().or(z.literal('')),
      phone: phoneStr.optional(),
      insuranceType: shortStr.optional(),
      currentInsurance: shortStr.optional(),
      address: z.string().trim().max(LIMITS.address).optional(),
      city: shortStr.optional(),
      state: shortStr.optional(),
      zip: z.string().trim().max(LIMITS.zip).optional(),
      message: messageStr.optional(),
    })
    // Keep additional branching-flow answers instead of dropping them.
    .passthrough()
)

const changeMortgageeSchema = requireContactable(
  z
    .object({
      policyNumber: shortStr.min(1, 'Policy number is required'),
      insuredName: shortStr.optional(),
      propertyAddress: z.string().trim().max(LIMITS.address).optional(),
      newMortgageeName: shortStr.optional(),
      newMortgageeAddress: z.string().trim().max(LIMITS.address).optional(),
      loanNumber: shortStr.optional(),
      email: emailStr.optional().or(z.literal('')),
      phone: phoneStr.optional(),
    })
    .strip()
)

const loanNumberChangeSchema = requireContactable(
  z
    .object({
      policyNumber: shortStr.min(1, 'Policy number is required'),
      insuredName: shortStr.optional(),
      propertyAddress: z.string().trim().max(LIMITS.address).optional(),
      oldLoanNumber: shortStr.optional(),
      newLoanNumber: shortStr.optional(),
      mortgageeName: shortStr.optional(),
      email: emailStr.optional().or(z.literal('')),
      phone: phoneStr.optional(),
    })
    .strip()
)

const schemasByType: Record<SupportedFormType, z.ZodTypeAny> = {
  contact: contactSchema,
  quote: quoteSchema,
  'change-mortgagee': changeMortgageeSchema,
  'loan-number-change': loanNumberChangeSchema,
}

/** Envelope schema for the top-level request body. */
export const requestEnvelopeSchema = z.object({
  form_type: z.string(),
  data: z.record(z.string(), z.unknown()),
  recaptcha_token: z.string().min(1).max(4000),
  idempotency_key: z.string().trim().min(1).max(LIMITS.idempotencyKey).optional(),
})

export type ValidatedSubmission = {
  formType: SupportedFormType
  data: Record<string, unknown>
}

export type ValidationResult =
  | { success: true; value: ValidatedSubmission }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

function isSupportedFormType(value: string): value is SupportedFormType {
  return value in schemasByType
}

/**
 * Validate a parsed request body. Returns a typed, sanitized submission or a
 * structured error. Never throws.
 */
export function validateFormRequest(body: unknown): ValidationResult {
  const envelope = requestEnvelopeSchema.safeParse(body)
  if (!envelope.success) {
    return { success: false, error: 'Malformed request.' }
  }

  const { form_type, data } = envelope.data
  if (!isSupportedFormType(form_type)) {
    return { success: false, error: 'Unsupported form type.' }
  }

  const parsed = schemasByType[form_type].safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  return { success: true, value: { formType: form_type, data: parsed.data as Record<string, unknown> } }
}
