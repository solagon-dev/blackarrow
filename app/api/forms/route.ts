import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createFormSubmission } from '@/lib/db'
import { isSupportedFormType, sendFormNotification } from '@/lib/forms-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { form_type, data } = body

    if (!form_type || !data) {
      return NextResponse.json({ error: 'Missing form_type or data' }, { status: 400 })
    }

    if (typeof form_type !== 'string' || !isSupportedFormType(form_type)) {
      return NextResponse.json({ error: 'Unsupported form type' }, { status: 400 })
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const submissionId = uuidv4()

    createFormSubmission({
      id: submissionId,
      form_type,
      data: JSON.stringify(data),
    })

    await sendFormNotification({
      submissionId,
      formType: form_type,
      data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
