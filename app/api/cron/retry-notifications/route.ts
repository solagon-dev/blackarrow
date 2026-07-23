import { NextRequest, NextResponse } from 'next/server'
import { isSupportedFormType, sendFormNotification } from '@/lib/forms-email'
import {
  getUndeliveredFormSubmissionsForRetry,
  updateFormSubmissionNotification,
} from '@/lib/db'

/**
 * Lead-notification reconciliation job (Plan §4.6).
 *
 * Finds stored submissions whose notification never went out (status `pending`
 * or `failed`) and retries delivery, updating each submission's status. This is
 * the "scheduled retry job" that makes the durable-storage/retryable-delivery
 * model whole: a lead is never lost just because email was down at submit time.
 *
 * Auth: Bearer CRON_SECRET (same pattern as the monthly-post cron). Intended to
 * be wired to a Vercel Cron schedule; can also be invoked manually by ops.
 * Returns only aggregate counts and submission IDs — never customer PII.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function verifyCronAuth(req: NextRequest): boolean {
  const secret = (process.env.CRON_SECRET || '').trim()
  if (!secret) return false
  const auth = (req.headers.get('authorization') || '').trim()
  return auth === `Bearer ${secret}`
}

async function handle(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let pending: Array<{ id: string; form_type: string; data: string; notification_attempts: number }>
  try {
    pending = await getUndeliveredFormSubmissionsForRetry()
  } catch {
    console.error(JSON.stringify({ level: 'alert', event: 'reconcile.query_failed', at: new Date().toISOString() }))
    return NextResponse.json({ ok: false, error: 'Storage unavailable' }, { status: 503 })
  }

  let retried = 0
  let delivered = 0
  let stillFailing = 0

  for (const row of pending) {
    if (!isSupportedFormType(row.form_type)) continue
    retried += 1
    let data: Record<string, unknown>
    try {
      data = JSON.parse(row.data) as Record<string, unknown>
    } catch {
      await updateFormSubmissionNotification(row.id, { status: 'failed', error: 'corrupt stored payload' }).catch(() => {})
      stillFailing += 1
      continue
    }

    try {
      const result = await sendFormNotification({ submissionId: row.id, formType: row.form_type, data })
      await updateFormSubmissionNotification(row.id, { status: 'sent', notificationId: result.id })
      delivered += 1
    } catch {
      await updateFormSubmissionNotification(row.id, { status: 'failed', error: 'retry delivery failed' }).catch(() => {})
      stillFailing += 1
      console.error(
        JSON.stringify({ level: 'alert', event: 'reconcile.retry_failed', submissionId: row.id, formType: row.form_type, at: new Date().toISOString() })
      )
    }
  }

  console.log(
    JSON.stringify({ level: 'info', event: 'reconcile.run', found: pending.length, retried, delivered, stillFailing, at: new Date().toISOString() })
  )
  return NextResponse.json({ ok: true, found: pending.length, retried, delivered, stillFailing })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
