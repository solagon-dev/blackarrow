'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { personalInsurance, commercialInsurance, propertyInsurance } from '@/lib/insurance-data'

const navInsurance = [
  { label: 'Personal', items: personalInsurance.map(i => ({ label: i.shortTitle, href: `/insurance/${i.slug}` })) },
  { label: 'Commercial', items: commercialInsurance.map(i => ({ label: i.shortTitle, href: `/insurance/${i.slug}` })) },
  { label: 'Property', items: propertyInsurance.map(i => ({ label: i.shortTitle, href: `/insurance/${i.slug}` })) },
]

const policyManagement = [
  { label: 'Change Mortgagee', href: '/change-mortgagee', desc: 'Update lender information' },
  { label: 'Loan Number Change', href: '/loan-number-change', desc: 'Update loan details' },
  { label: 'File a Claim', href: '/file-a-claim', desc: 'Submit to your carrier' },
]

// Pages that do NOT have a dark hero (admin pages, legal, etc.)
const LIGHT_HERO_PAGES = ['/admin', '/legal']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [insuranceOpen, setInsuranceOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [mobileInsuranceOpen, setMobileInsuranceOpen] = useState(false)
  const [mobilePolicyOpen, setMobilePolicyOpen] = useState(false)
  const pathname = usePathname()

  // Determine if current page has a dark hero
  const hasDarkHero = !LIGHT_HERO_PAGES.some(p => pathname.startsWith(p))
  const isTransparent = hasDarkHero && !scrolled && !mobileOpen

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // Dynamic color classes based on transparent state
  const navTextClass = isTransparent
    ? 'text-white/70 hover:text-white'
    : 'text-navy-500 hover:text-navy-900'
  const navTextActiveClass = isTransparent ? 'text-white' : 'text-navy-900'
  const phoneClass = isTransparent
    ? 'text-white/70 hover:text-white'
    : 'text-navy-500 hover:text-navy-900'
  const menuIconClass = isTransparent ? 'text-white' : 'text-navy-900'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-white border-b border-gray-200'
          : hasDarkHero
            ? 'bg-transparent'
            : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container-editorial">
        <nav className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobile}>
            <img
              src="/images/BlackArrowLogo.svg"
              alt="BlackArrow Insurance"
              className={`h-8 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Insurance Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setInsuranceOpen(true)}
              onMouseLeave={() => setInsuranceOpen(false)}
            >
              <button className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${insuranceOpen ? navTextActiveClass : navTextClass}`}>
                Insurance
                <svg className={`w-3 h-3 transition-transform duration-200 ${insuranceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {insuranceOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-white border border-gray-200 shadow-lg p-8 w-[640px]">
                    <div className="grid grid-cols-3 gap-10">
                      {navInsurance.map(group => (
                        <div key={group.label}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 pb-3 border-b border-gray-200">{group.label}</p>
                          <ul className="space-y-1">
                            {group.items.map(item => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block py-1.5 text-sm text-navy-600 hover:text-navy-900 transition-colors duration-200"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-navy-400">Not sure what you need?</p>
                      <Link href="/quote" className="link-arrow text-sm">
                        Request a quote
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Policy Management Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPolicyOpen(true)}
              onMouseLeave={() => setPolicyOpen(false)}
            >
              <button className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${policyOpen ? navTextActiveClass : navTextClass}`}>
                Policy Management
                <svg className={`w-3 h-3 transition-transform duration-200 ${policyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {policyOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-white border border-gray-200 shadow-lg p-2 w-60">
                    <ul>
                      {policyManagement.map(item => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-4 py-3 text-navy-600 hover:text-navy-900 hover:bg-gray-50 transition-all duration-200 group/item"
                          >
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="block text-xs text-navy-400 mt-0.5">{item.desc}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link href="/our-story" className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Company</Link>
            <Link href="/insights" className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Insights</Link>
            <Link href="/contact" className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Contact</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a href="tel:2529555898" className={`text-sm font-medium transition-colors hidden xl:block ${phoneClass}`}>
              (252) 955-5898
            </a>
            <Link href="/quote" className={`inline-flex items-center justify-center text-center text-sm py-2.5 px-6 font-medium tracking-wide transition-colors duration-200 ${
              isTransparent
                ? 'bg-white text-navy-900 hover:bg-gray-100'
                : 'btn-primary'
            }`}>
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${menuIconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[4.5rem] bg-white z-40 overflow-y-auto animate-fade-in">
          <div className="container-editorial py-8 space-y-1">
            {/* Insurance Accordion */}
            <div>
              <button
                onClick={() => setMobileInsuranceOpen(!mobileInsuranceOpen)}
                className="flex items-center justify-between w-full py-4 text-left font-medium text-navy-900 border-b border-gray-100"
              >
                Insurance
                <svg className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${mobileInsuranceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileInsuranceOpen && (
                <div className="pb-4 space-y-6 pt-4 animate-fade-in">
                  {navInsurance.map(group => (
                    <div key={group.label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-3">{group.label}</p>
                      <ul className="space-y-1">
                        {group.items.map(item => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block py-2 text-sm text-navy-600 hover:text-navy-900"
                              onClick={closeMobile}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Policy Management Accordion */}
            <div>
              <button
                onClick={() => setMobilePolicyOpen(!mobilePolicyOpen)}
                className="flex items-center justify-between w-full py-4 text-left font-medium text-navy-900 border-b border-gray-100"
              >
                Policy Management
                <svg className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${mobilePolicyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobilePolicyOpen && (
                <div className="pb-4 pt-4 animate-fade-in">
                  <ul className="space-y-1">
                    {policyManagement.map(item => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block py-2 text-sm text-navy-600 hover:text-navy-900"
                          onClick={closeMobile}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/our-story" onClick={closeMobile} className="block py-4 font-medium text-navy-900 border-b border-gray-100">
              Company
            </Link>
            <Link href="/insights" onClick={closeMobile} className="block py-4 font-medium text-navy-900 border-b border-gray-100">
              Insights
            </Link>
            <Link href="/contact" onClick={closeMobile} className="block py-4 font-medium text-navy-900 border-b border-gray-100">
              Contact
            </Link>

            {/* Mobile CTA */}
            <div className="pt-8 space-y-4">
              <a href="tel:2529555898" className="block text-center text-sm font-medium text-navy-500 py-3">
                (252) 955-5898
              </a>
              <Link href="/quote" onClick={closeMobile} className="btn-primary w-full text-center">
                Get a Quote
              </Link>
              <Link href="/contact" onClick={closeMobile} className="btn-outline w-full text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
