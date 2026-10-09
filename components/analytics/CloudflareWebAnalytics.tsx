'use client'

import { useEffect } from 'react'

export default function CloudflareWebAnalytics() {
  useEffect(() => {
    if (window.location.hostname.replace(/^www\./, '') !== 'blackarrow.co') return
    if (/^\/(?:admin|api|portal)(?:\/|$)/.test(window.location.pathname)) return
    if (document.querySelector('script[data-cf-beacon]')) return
    const beacon = document.createElement('script')
    beacon.type = 'module'
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    beacon.dataset.cfBeacon = JSON.stringify({ token: 'a94aed6da71a4a378fcaee1be64ff2dc' })
    document.head.appendChild(beacon)
  }, [])
  return null
}
