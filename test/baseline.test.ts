import { describe, it, expect } from 'vitest'
import { isSupportedFormType } from '@/lib/forms-email'

/**
 * Baseline harness sanity check — confirms Vitest resolves the `@/` alias and
 * can import app library code. Real feature coverage lives in the phase-specific
 * test files.
 */
describe('test harness baseline', () => {
  it('resolves the @/ alias and imports lib code', () => {
    expect(isSupportedFormType('contact')).toBe(true)
    expect(isSupportedFormType('quote')).toBe(true)
    expect(isSupportedFormType('not-a-real-form')).toBe(false)
  })
})
