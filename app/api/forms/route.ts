import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { isSupportedFormType, sendFormNotification } from '@/lib/forms-email'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { form_type, data, recaptcha_token } = body

    if (!form_type || !data) {
      return NextResponse.json({ error: 'Missing form_type or data' }, { status: 400 })
    }

    if (typeof form_type !== 'string' || !isSupportedFormType(form_type)) {
      return NextResponse.json({ error: 'Unsupported form type' }, { status: 400 })
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    // Verify reCAPTCHA token
    if (!recaptcha_token || typeof recaptcha_token !== 'string') {
      return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 })
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptcha_token)
    if (!recaptchaResult.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 })
    }

    const submissionId = uuidv4()
    let submissionStored = false

    try {
      const { createFormSubmission } = await import('@/lib/db')

      await createFormSubmission({
        id: submissionId,
        form_type,
        data: JSON.stringify(data),
      })
      submissionStored = true
    } catch (storageError) {
      console.error('Form submission storage error:', {
        submissionId,
        formType: form_type,
        error: storageError,
      })
    }

    let emailDelivered = false

    try {
      await sendFormNotification({
        submissionId,
        formType: form_type,
        data,
      })
      emailDelivered = true
    } catch (notificationError) {
      console.error('Form notification delivery error:', {
        submissionId,
        formType: form_type,
        error: notificationError,
      })
    }

    return NextResponse.json({ success: true, emailDelivered, submissionStored })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
