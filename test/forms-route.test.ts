import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Lead-delivery reliability tests (Plan §4.5–4.7).
 *
 * Every storage × notification outcome is covered, plus idempotency, schema
 * validation, rate limiting, and the PII-in-logs guarantee. db/email/reCAPTCHA
 * are mocked so the suite is hermetic (no DATABASE_URL / network needed).
 */

vi.mock('@/lib/recaptcha', () => ({
  verifyRecaptchaToken: vi.fn(async () => ({ success: true, score: 0.9 })),
}))
vi.mock('@/lib/forms-email', () => ({
  sendFormNotification: vi.fn(async () => ({ id: 'email_abc123' })),
}))
vi.mock('@/lib/db', () => ({
  createFormSubmission: vi.fn(async () => ({
    id: 'sub_1',
    form_type: 'contact',
    idempotency_key: null,
    notification_status: 'pending',
    notification_id: null,
    notification_attempts: 0,
    created_at: '2026-07-23T00:00:00.000Z',
  })),
  findFormSubmissionByIdempotencyKey: vi.fn(async () => undefined),
  updateFormSubmissionNotification: vi.fn(async () => {}),
}))

import { POST } from '@/app/api/forms/route'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import { sendFormNotification } from '@/lib/forms-email'
import {
  createFormSubmission,
  findFormSubmissionByIdempotencyKey,
  updateFormSubmissionNotification,
} from '@/lib/db'
import { __resetRateLimit } from '@/lib/rate-limit'

const mockRecaptcha = vi.mocked(verifyRecaptchaToken)
const mockSendEmail = vi.mocked(sendFormNotification)
const mockCreate = vi.mocked(createFormSubmission)
const mockFindByKey = vi.mocked(findFormSubmissionByIdempotencyKey)
const mockUpdateNotif = vi.mocked(updateFormSubmissionNotification)

function makeRequest(payload: unknown, ip = '10.0.0.1') {
  return new Request('http://localhost/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  }) as unknown as Parameters<typeof POST>[0]
}

const validContact = {
  form_type: 'contact',
  recaptcha_token: 'tok',
  data: { name: 'Jane Driver', email: 'jane@example.com', message: 'Please quote my auto.' },
}

let uniqueIp = 0
function freshIp() {
  uniqueIp += 1
  return `10.1.0.${uniqueIp}`
}

beforeEach(() => {
  vi.clearAllMocks()
  __resetRateLimit()
  // Restore default happy-path implementations after clearAllMocks.
  mockRecaptcha.mockResolvedValue({ success: true, score: 0.9 })
  mockSendEmail.mockResolvedValue({ id: 'email_abc123' })
  mockCreate.mockResolvedValue({
    id: 'sub_1',
    form_type: 'contact',
    idempotency_key: null,
    notification_status: 'pending',
    notification_id: null,
    notification_attempts: 0,
    created_at: '2026-07-23T00:00:00.000Z',
  })
  mockFindByKey.mockResolvedValue(undefined)
  mockUpdateNotif.mockResolvedValue(undefined)
})

describe('POST /api/forms — delivery outcomes (§4.7)', () => {
  it('stored AND emailed → 200 success (both paths)', async () => {
    const res = await POST(makeRequest({ ...validContact }, freshIp()))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ success: true, stored: true, notified: true })
    const storedId = mockCreate.mock.calls[0][0].id
    expect(mockUpdateNotif).toHaveBeenCalledWith(storedId, expect.objectContaining({ status: 'sent' }))
  })

  it('stored but email FAILS → 202 success, lead preserved and failure observable', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Resend 500'))
    const res = await POST(makeRequest({ ...validContact }, freshIp()))
    expect(res.status).toBe(202)
    const json = await res.json()
    expect(json).toMatchObject({ success: true, stored: true, notified: false })
    // Stored lead exists AND the notification failure is recorded for retry.
    expect(mockCreate).toHaveBeenCalledOnce()
    const storedId = mockCreate.mock.calls[0][0].id
    expect(mockUpdateNotif).toHaveBeenCalledWith(storedId, expect.objectContaining({ status: 'failed' }))
  })

  it('email succeeds but storage FAILS → 202 success, email id preserved', async () => {
    mockCreate.mockRejectedValueOnce(new Error('DB down'))
    const res = await POST(makeRequest({ ...validContact }, freshIp()))
    expect(res.status).toBe(202)
    const json = await res.json()
    expect(json).toMatchObject({ success: true, stored: false, notified: true })
    expect(mockSendEmail).toHaveBeenCalledOnce()
  })

  it('BOTH storage and email fail → 503, NO false success', async () => {
    mockCreate.mockRejectedValueOnce(new Error('DB down'))
    mockSendEmail.mockRejectedValueOnce(new Error('Resend down'))
    const res = await POST(makeRequest({ ...validContact }, freshIp()))
    expect(res.status).toBe(503)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toMatch(/call us|try again/i)
  })
})

describe('POST /api/forms — idempotency (§4.5.13)', () => {
  it('a duplicate retry (same key) does not create a second notification', async () => {
    mockFindByKey.mockResolvedValueOnce(undefined) // first: new
    const first = await POST(makeRequest({ ...validContact, idempotency_key: 'key-1' }, '10.2.0.1'))
    expect(first.status).toBe(200)
    expect(mockSendEmail).toHaveBeenCalledTimes(1)

    // second call: key already found
    mockFindByKey.mockResolvedValueOnce({
      id: 'sub_1',
      form_type: 'contact',
      idempotency_key: 'key-1',
      notification_status: 'sent',
      notification_id: 'email_abc123',
      notification_attempts: 1,
      created_at: '2026-07-23T00:00:00.000Z',
    })
    const second = await POST(makeRequest({ ...validContact, idempotency_key: 'key-1' }, '10.2.0.1'))
    const json = await second.json()
    expect(second.status).toBe(200)
    expect(json.duplicate).toBe(true)
    // Still only one email total — the retry did not send another.
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
  })

  it('a unique-violation race is treated as an idempotent duplicate, not a failure', async () => {
    const err = Object.assign(new Error('duplicate key'), { code: '23505' })
    mockCreate.mockRejectedValueOnce(err)
    const res = await POST(makeRequest({ ...validContact, idempotency_key: 'key-race' }, '10.2.0.2'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.duplicate).toBe(true)
  })
})

describe('POST /api/forms — validation & abuse (§4.5.1, §4.5.12)', () => {
  it('rejects unsupported form type', async () => {
    const res = await POST(makeRequest({ form_type: 'nope', recaptcha_token: 't', data: {} }, freshIp()))
    expect(res.status).toBe(400)
  })

  it('rejects a submission with no contactable identity', async () => {
    const res = await POST(
      makeRequest({ form_type: 'contact', recaptcha_token: 't', data: { name: 'X', message: 'hi' } }, freshIp())
    )
    expect(res.status).toBe(400)
  })

  it('rejects an oversized field', async () => {
    const res = await POST(
      makeRequest(
        {
          form_type: 'contact',
          recaptcha_token: 't',
          data: { name: 'X', email: 'x@y.com', message: 'a'.repeat(6000) },
        },
        freshIp()
      )
    )
    expect(res.status).toBe(400)
  })

  it('rejects malformed JSON', async () => {
    const res = await POST(makeRequest('{not json', freshIp()))
    expect(res.status).toBe(400)
  })

  it('fails reCAPTCHA → 403 and never stores or emails', async () => {
    mockRecaptcha.mockResolvedValueOnce({ success: false })
    const res = await POST(makeRequest({ ...validContact }, freshIp()))
    expect(res.status).toBe(403)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  it('rate limits after the configured burst → 429', async () => {
    const ip = '10.3.0.1'
    let last: Response | undefined
    for (let i = 0; i < 10; i++) {
      last = (await POST(makeRequest({ ...validContact }, ip))) as unknown as Response
    }
    expect(last!.status).toBe(429)
  })
})

describe('POST /api/forms — logs never contain PII (§4.7)', () => {
  it('does not log policy number, loan number, or full payload', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const payload = {
      form_type: 'change-mortgagee',
      recaptcha_token: 'tok',
      data: {
        policyNumber: 'POL-SECRET-99887',
        loanNumber: 'LOAN-SECRET-44556',
        insuredName: 'Jane Homeowner',
        email: 'jane@example.com',
        phone: '252-555-0100',
      },
    }
    await POST(makeRequest(payload, freshIp()))

    const allOutput = [...logSpy.mock.calls, ...errSpy.mock.calls].flat().join(' ')
    expect(allOutput).not.toContain('POL-SECRET-99887')
    expect(allOutput).not.toContain('LOAN-SECRET-44556')
    expect(allOutput).not.toContain('jane@example.com')
    // It SHOULD still log the structured submission id + form type for ops.
    expect(allOutput).toContain('change-mortgagee')

    logSpy.mockRestore()
    errSpy.mockRestore()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
