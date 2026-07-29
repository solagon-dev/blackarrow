import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomUUID } from 'crypto'
import { sendFormNotification } from '@/lib/forms-email'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import { validateFormRequest, MAX_BODY_BYTES } from '@/lib/forms-schema'
import { rateLimit } from '@/lib/rate-limit'
import {
  createFormSubmission,
  findFormSubmissionByIdempotencyKey,
  updateFormSubmissionNotification,
} from '@/lib/db'

export const runtime = 'nodejs'

// Per-IP throttle. In-memory (per instance) — see lib/rate-limit.ts caveat.
const RATE_LIMIT = { limit: 8, windowMs: 10 * 60 * 1000 }

/** Structured, PII-free server log (Plan §4.5.11, §4.5.14). Never logs form data. */
function logLead(
  level: 'info' | 'warn' | 'alert',
  event: string,
  fields: Record<string, string | number | boolean | null | undefined>
) {
  const line = { level, event, at: new Date().toISOString(), ...fields }
  if (level === 'alert' || level === 'warn') console.error(JSON.stringify(line))
  else console.log(JSON.stringify(line))
}

/** Truncated, non-sensitive error summary for logs (never includes form data). */
function safeErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error)
  return msg.slice(0, 300)
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '23505')
}

function contentHash(formType: string, data: unknown): string {
  return createHash('sha256').update(`${formType}|${JSON.stringify(data)}`).digest('hex')
}

const BOTH_FAILED_MESSAGE =
  'We could not submit your request right now. Please try again in a moment, or call us so we can help you directly.'

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce a hard body-size cap before parsing (anti-abuse).
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
    }

    // 2. Typed schema validation (rejects malformed / oversized fields).
    const validation = validateFormRequest(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, fieldErrors: validation.fieldErrors },
        { status: 400 }
      )
    }
    const { formType, data } = validation.value
    const idempotencyKey =
      typeof (body as { idempotency_key?: unknown }).idempotency_key === 'string'
        ? ((body as { idempotency_key: string }).idempotency_key.trim() || undefined)
        : undefined

    // 3. Rate limiting (per IP).
    const ip = clientIp(request)
    const limit = rateLimit(`forms:${ip}`, RATE_LIMIT)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    // 4. reCAPTCHA verification.
    const recaptchaToken = (body as { recaptcha_token: string }).recaptcha_token
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken)
    if (!recaptchaResult.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 })
    }

    const submissionId = randomUUID()
    const hash = contentHash(formType, data)

    // 5. Idempotency: if this exact submission was already processed, return the
    //    prior result without re-storing or re-sending (Plan §4.5.13).
    if (idempotencyKey) {
      try {
        const existing = await findFormSubmissionByIdempotencyKey(idempotencyKey)
        if (existing) {
          logLead('info', 'lead.duplicate', {
            submissionId: existing.id,
            formType,
            idempotent: true,
            notificationStatus: existing.notification_status,
          })
          return NextResponse.json(
            { success: true, submissionId: existing.id, duplicate: true, stored: true },
            { status: 200 }
          )
        }
      } catch {
        // DB unavailable for the lookup — fall through and process best-effort.
      }
    }

    // 6. Attempt durable storage (source of truth).
    let stored = false
    try {
      await createFormSubmission({
        id: submissionId,
        form_type: formType,
        data: JSON.stringify(data),
        idempotency_key: idempotencyKey ?? null,
        content_hash: hash,
      })
      stored = true
    } catch (storageError) {
      // A unique-violation means a concurrent request already stored this key —
      // treat as an idempotent duplicate rather than a failure.
      if (idempotencyKey && isUniqueViolation(storageError)) {
        logLead('info', 'lead.duplicate', { submissionId, formType, idempotent: true, race: true })
        return NextResponse.json(
          { success: true, submissionId, duplicate: true, stored: true },
          { status: 200 }
        )
      }
      logLead('warn', 'lead.storage_failed', {
        submissionId,
        formType,
        error: safeErrorMessage(storageError),
      })
    }

    // 7. Attempt notification delivery (alert to the agency).
    let notified = false
    let notificationId: string | null = null
    try {
      const result = await sendFormNotification({ submissionId, formType, data })
      notificationId = result.id
      notified = true
    } catch (notificationError) {
      logLead('warn', 'lead.notification_failed', {
        submissionId,
        formType,
        error: safeErrorMessage(notificationError),
      })
    }

    // 8. If stored, record the notification outcome so reconciliation can retry.
    if (stored) {
      try {
        await updateFormSubmissionNotification(submissionId, {
          status: notified ? 'sent' : 'failed',
          notificationId,
          error: notified ? null : 'notification delivery failed',
        })
      } catch (updateError) {
        logLead('warn', 'lead.status_update_failed', {
          submissionId,
          formType,
          error: safeErrorMessage(updateError),
        })
      }
    }

    // 9. Decide the client response. Success ONLY if at least one durable
    //    recovery path exists (Plan §4.5.6–4.5.10).
    if (stored && notified) {
      logLead('info', 'lead.ok', { submissionId, formType, stored: true, notified: true })
      return NextResponse.json({ success: true, submissionId, stored: true, notified: true }, { status: 200 })
    }

    if (stored && !notified) {
      // Durable: stored. Notification will be retried by reconciliation.
      logLead('alert', 'lead.stored_not_notified', { submissionId, formType, stored: true, notified: false })
      return NextResponse.json({ success: true, submissionId, stored: true, notified: false }, { status: 202 })
    }

    if (!stored && notified) {
      // Durable: the agency received the email. Preserve the delivery id.
      logLead('alert', 'lead.notified_not_stored', {
        submissionId,
        formType,
        stored: false,
        notified: true,
        notificationId,
      })
      return NextResponse.json({ success: true, submissionId, stored: false, notified: true }, { status: 202 })
    }

    // 10. Both failed — no durable path. Do NOT report success.
    logLead('alert', 'lead.lost', { submissionId, formType, stored: false, notified: false })
    return NextResponse.json({ success: false, error: BOTH_FAILED_MESSAGE }, { status: 503 })
  } catch (error) {
    logLead('alert', 'lead.unhandled', { error: safeErrorMessage(error) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
