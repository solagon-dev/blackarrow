'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-5">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/images/BlackArrowLogo.svg" alt="BlackArrow Insurance" className="h-8 brightness-0 invert opacity-80" />
        </div>

        {/* Login card */}
        <div className="bg-white p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-xl font-display font-bold text-navy-900 mb-1">Sign in</h1>
            <p className="text-sm text-navy-400">Access your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@blackarrowfg.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 text-navy-900 placeholder:text-navy-300 focus:border-navy-900 focus:ring-0 focus:outline-none transition-colors bg-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-900 text-white text-sm font-medium tracking-wide hover:bg-navy-800 active:bg-navy-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-navy-500 mt-8">
          BlackArrow Insurance &middot; Admin Portal
        </p>
      </div>
    </div>
  )
}
