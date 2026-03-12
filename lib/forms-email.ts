const RESEND_API_URL = 'https://api.resend.com/emails'
const FORM_NOTIFICATION_TO = 'service@blackarrowfg.com'

const formConfigs = {
  contact: {
    label: 'Contact Form',
    subject: (data: FormPayload) => `New contact form submission from ${getContactIdentity(data)}`,
    fieldOrder: ['name', 'email', 'phone', 'subject', 'message'],
  },
  quote: {
    label: 'Quote Request',
    subject: (data: FormPayload) => `New quote request from ${getQuoteIdentity(data)}`,
    fieldOrder: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'insuranceType',
      'currentInsurance',
      'address',
      'city',
      'state',
      'zip',
      'message',
    ],
  },
  'change-mortgagee': {
    label: 'Mortgagee Change Request',
    subject: (data: FormPayload) => `Mortgagee change request for policy ${getPolicyNumber(data)}`,
    fieldOrder: [
      'policyNumber',
      'insuredName',
      'propertyAddress',
      'newMortgageeName',
      'newMortgageeAddress',
      'loanNumber',
      'email',
      'phone',
    ],
  },
  'loan-number-change': {
    label: 'Loan Number Change Request',
    subject: (data: FormPayload) => `Loan number change request for policy ${getPolicyNumber(data)}`,
    fieldOrder: [
      'policyNumber',
      'insuredName',
      'propertyAddress',
      'oldLoanNumber',
      'newLoanNumber',
      'mortgageeName',
      'email',
      'phone',
    ],
  },
} as const

const fieldLabels: Record<string, string> = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  subject: 'Subject',
  message: 'Message',
  firstName: 'First Name',
  lastName: 'Last Name',
  insuranceType: 'Type of Insurance',
  currentInsurance: 'Currently Insured',
  address: 'Street Address',
  city: 'City',
  state: 'State',
  zip: 'ZIP Code',
  policyNumber: 'Policy Number',
  insuredName: 'Insured Name',
  propertyAddress: 'Property Address',
  newMortgageeName: 'New Mortgagee Name',
  newMortgageeAddress: 'New Mortgagee Address',
  loanNumber: 'Loan Number',
  oldLoanNumber: 'Current Loan Number',
  newLoanNumber: 'New Loan Number',
  mortgageeName: 'Mortgagee Name',
}

type FormPayload = Record<string, unknown>

export type SupportedFormType = keyof typeof formConfigs

type FormEmailField = {
  label: string
  value: string
  isMultiline: boolean
}

type ResendSendEmailResponse = {
  id: string
}

export function isSupportedFormType(value: string): value is SupportedFormType {
  return value in formConfigs
}

export async function sendFormNotification({
  submissionId,
  formType,
  data,
}: {
  submissionId: string
  formType: SupportedFormType
  data: FormPayload
}): Promise<ResendSendEmailResponse> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }

  if (!from) {
    throw new Error('Missing RESEND_FROM_EMAIL')
  }

  const email = buildFormEmail({ submissionId, formType, data })
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': submissionId,
    },
    body: JSON.stringify({
      from,
      to: [FORM_NOTIFICATION_TO],
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: email.replyTo ? { 'Reply-To': email.replyTo } : undefined,
      tags: [
        { name: 'source', value: 'website' },
        { name: 'form_type', value: formType },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Resend request failed (${response.status}): ${errorBody}`)
  }

  return response.json() as Promise<ResendSendEmailResponse>
}

function buildFormEmail({
  submissionId,
  formType,
  data,
}: {
  submissionId: string
  formType: SupportedFormType
  data: FormPayload
}) {
  const config = formConfigs[formType]
  const submittedAt = new Date().toISOString()
  const replyTo = getReplyTo(data)
  const fields = getOrderedFields(config.fieldOrder, data)

  return {
    subject: config.subject(data),
    replyTo,
    text: buildTextBody({
      label: config.label,
      submissionId,
      submittedAt,
      fields,
    }),
    html: buildHtmlBody({
      label: config.label,
      submissionId,
      submittedAt,
      fields,
    }),
  }
}

function buildTextBody({
  label,
  submissionId,
  submittedAt,
  fields,
}: {
  label: string
  submissionId: string
  submittedAt: string
  fields: FormEmailField[]
}) {
  const lines = [
    `BlackArrow website form submission: ${label}`,
    `Submission ID: ${submissionId}`,
    `Submitted At: ${submittedAt}`,
    '',
    ...fields.flatMap(field => [`${field.label}:`, field.value, '']),
  ]

  return lines.join('\n').trim()
}

function buildHtmlBody({
  label,
  submissionId,
  submittedAt,
  fields,
}: {
  label: string
  submissionId: string
  submittedAt: string
  fields: FormEmailField[]
}) {
  const fieldRows = fields
    .map(field => {
      const formattedValue = field.isMultiline
        ? escapeHtml(field.value).replace(/\n/g, '<br />')
        : escapeHtml(field.value)

      return `
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #d7e2ee; font-weight: 600; width: 220px; vertical-align: top; color: #10233f;">
            ${escapeHtml(field.label)}
          </td>
          <td style="padding: 12px 16px; border: 1px solid #d7e2ee; color: #243b53; white-space: pre-line; word-break: break-word;">
            ${formattedValue}
          </td>
        </tr>
      `.trim()
    })
    .join('')

  return `
    <div style="background: #f3f7fb; padding: 32px 16px; font-family: Arial, sans-serif; color: #10233f;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #d7e2ee; border-radius: 16px; overflow: hidden;">
        <div style="background: #10233f; color: #ffffff; padding: 24px 28px;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #b7cce3;">BlackArrow Insurance</p>
          <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">${escapeHtml(label)}</h1>
        </div>
        <div style="padding: 24px 28px;">
          <p style="margin: 0 0 8px;"><strong>Submission ID:</strong> ${escapeHtml(submissionId)}</p>
          <p style="margin: 0 0 24px;"><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tbody>${fieldRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `.trim()
}

function getOrderedFields(fieldOrder: readonly string[], data: FormPayload): FormEmailField[] {
  const orderedFields = fieldOrder.map(key => createField(key, data[key]))
  const extraFields = Object.entries(data)
    .filter(([key]) => !fieldOrder.includes(key))
    .map(([key, value]) => createField(key, value))

  return [...orderedFields, ...extraFields]
}

function createField(key: string, value: unknown): FormEmailField {
  const formattedValue = formatFieldValue(key, value)

  return {
    label: fieldLabels[key] || humanizeKey(key),
    value: formattedValue,
    isMultiline: typeof value === 'string' && value.includes('\n'),
  }
}

function formatFieldValue(key: string, value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) {
      return 'Not provided'
    }

    if (key === 'insuranceType') {
      return humanizeSlug(trimmed)
    }

    return trimmed
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (Array.isArray(value)) {
    return value.map(item => formatFieldValue(key, item)).join(', ')
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return 'Not provided'
}

function getReplyTo(data: FormPayload) {
  const email = typeof data.email === 'string' ? data.email.trim() : ''

  return isValidEmail(email) ? email : undefined
}

function getContactIdentity(data: FormPayload) {
  return getFirstDefinedString(data.name, data.email) || 'website visitor'
}

function getQuoteIdentity(data: FormPayload) {
  const fullName = [data.firstName, data.lastName]
    .filter(part => typeof part === 'string' && part.trim())
    .join(' ')

  return fullName || getFirstDefinedString(data.email) || 'website visitor'
}

function getPolicyNumber(data: FormPayload) {
  return getFirstDefinedString(data.policyNumber) || 'unknown policy'
}

function getFirstDefinedString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function humanizeSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function humanizeKey(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase())
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
