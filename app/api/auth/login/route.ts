import { NextRequest, NextResponse } from 'next/server'
import { ensureAdminUser, login, SESSION_COOKIE, SESSION_DURATION_MS } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    await ensureAdminUser()
    const result = await login(email, password)

    if (!result.success || !result.sessionId) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
