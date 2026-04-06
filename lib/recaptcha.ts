const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

export function getRecaptchaSiteKey(): string {
  return RECAPTCHA_SITE_KEY
}

/**
 * Load the reCAPTCHA v3 script if not already loaded.
 * Returns a promise that resolves when the script is ready.
 */
export function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Not in browser'))

    // Already loaded
    if (window.grecaptcha?.ready) {
      window.grecaptcha.ready(() => resolve())
      return
    }

    // Check if script tag already exists
    const existing = document.querySelector(`script[src*="recaptcha/api.js"]`)
    if (existing) {
      // Script tag exists but hasn't loaded yet — wait for it
      const check = () => {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(() => resolve())
        } else {
          setTimeout(check, 100)
        }
      }
      check()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => {
      window.grecaptcha.ready(() => resolve())
    }
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    document.head.appendChild(script)
  })
}

/**
 * Execute reCAPTCHA v3 and return a token.
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  await loadRecaptchaScript()
  return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
}

/**
 * Server-side: verify a reCAPTCHA token.
 * Returns true if the token is valid and the score meets the threshold.
 */
export async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; score?: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not set — skipping verification')
    return { success: true }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 0.0 = very likely a bot, 1.0 = very likely a human
    // Threshold of 0.5 is Google's recommendation
    const score = data.score ?? 0
    const passed = data.success && score >= 0.5

    if (!passed) {
      console.warn('reCAPTCHA verification failed:', { success: data.success, score, action: data.action })
    }

    return { success: passed, score }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false }
  }
}

// Type augmentation for window.grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
