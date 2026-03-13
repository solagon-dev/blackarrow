import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logout, SESSION_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value

    await logout(sessionId)

    const response = NextResponse.json({ success: true })
    response.cookies.delete(SESSION_COOKIE)
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
