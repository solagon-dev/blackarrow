import { describe, it, expect } from 'vitest'
import { sanitizeParams } from '@/lib/analytics'
import { parseAttribution, hasAttribution } from '@/lib/attribution'

describe('analytics param sanitization (§5.5 — no PII)', () => {
  it('drops values that look like emails or phone numbers', () => {
    const out = sanitizeParams({
      coverage: 'auto',
      email: 'jane@example.com',
      phone: '252-555-0100',
      note: 'call me at (910) 914-6074 please',
    })
    expect(out).toEqual({ coverage: 'auto' })
    expect(out.email).toBeUndefined()
    expect(out.phone).toBeUndefined()
    expect(out.note).toBeUndefined()
  })

  it('keeps numeric and boolean scalars', () => {
    const out = sanitizeParams({ step: 3, done: true, coverage: 'home' })
    expect(out).toEqual({ step: 3, done: true, coverage: 'home' })
  })

  it('truncates long strings and drops empties', () => {
    const out = sanitizeParams({ long: 'x'.repeat(500), blank: '   ' })
    expect((out.long as string).length).toBe(100)
    expect(out.blank).toBeUndefined()
  })
})

describe('campaign attribution parsing (§5.1)', () => {
  it('extracts UTM and click-id params from a query string', () => {
    const attr = parseAttribution(
      '?utm_source=google&utm_medium=cpc&utm_campaign=nc-auto&gclid=ABC123&irrelevant=x'
    )
    expect(attr.utm_source).toBe('google')
    expect(attr.utm_medium).toBe('cpc')
    expect(attr.utm_campaign).toBe('nc-auto')
    expect(attr.gclid).toBe('ABC123')
    expect((attr as Record<string, unknown>).irrelevant).toBeUndefined()
    expect(hasAttribution(attr)).toBe(true)
  })

  it('reports no attribution for an organic (param-free) visit', () => {
    const attr = parseAttribution('')
    expect(hasAttribution(attr)).toBe(false)
  })

  it('caps very long param values', () => {
    const attr = parseAttribution(`?utm_campaign=${'a'.repeat(500)}`)
    expect((attr.utm_campaign as string).length).toBe(200)
  })
})
