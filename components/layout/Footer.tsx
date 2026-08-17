import Link from 'next/link'
import { personalInsurance, commercialInsurance, propertyInsurance } from '@/lib/insurance-data'
import { locationPages } from '@/lib/location-data'
import { serviceLocationPages } from '@/lib/service-location-data'
import { offices } from '@/lib/team-data'

// Highest-traffic-potential city × service combinations. Hand-picked from
// keyword volume + difficulty data (Ahrefs/GSC) so the footer concentrates
// internal link equity on the most valuable landing pages, not all of them.
const topCityServiceSlugs = [
  'business-insurance-wilmington-nc',
  'car-insurance-greenville-nc', // graceful no-op if slug doesn't exist
  'home-insurance-wilmington-nc',
  'flood-insurance-wilmington-nc',
  'renters-insurance-wilmington-nc',
  'workers-comp-greenville-nc',
  'auto-insurance-greenville-nc',
  'short-term-rental-insurance-wilmington-nc',
]
const topCityServicePages = topCityServiceSlugs
  .map(s => serviceLocationPages.find(p => p.slug === s))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

// Statewide NC landing pages that live under /insurance/ as geo variants, so
// they don't appear in the nav/Coverages lists. Surfacing them in the footer
// gives these pages site-wide internal links (they were otherwise reachable
// only from a couple of related-coverage links).
const statewideNcPages = [
  { label: 'Boat Insurance in North Carolina', href: '/insurance/boat-insurance-north-carolina' },
  { label: 'Commercial Auto Insurance in NC', href: '/insurance/commercial-auto-insurance-north-carolina' },
  { label: 'Workers Comp Insurance in NC', href: '/insurance/workers-compensation-north-carolina' },
]

const companyLinks = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Locations', href: '/locations' },
  { label: 'Insights', href: '/insights' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Contact Us', href: '/contact' },
]

const policyLinks = [
  { label: 'Change Mortgagee', href: '/change-mortgagee' },
  { label: 'Loan Number Change', href: '/loan-number-change' },
  { label: 'File a Claim', href: '/file-a-claim' },
]

const legalLinks = [
  { label: 'Terms of Service', href: '/legal/terms-of-use' },
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
]

const allInsurance = [...personalInsurance, ...commercialInsurance, ...propertyInsurance]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* Top CTA Band */}
      <div className="border-b border-white/10">
        <div className="container-editorial py-12 sm:py-16 md:py-20">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 sm:mb-4">
                Ready to discuss your coverage?
              </h2>
              <p className="text-navy-300 text-base sm:text-lg leading-relaxed max-w-lg">
                Our licensed agents compare rates from 20+ carriers to find the right coverage at a competitive rate.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-end">
              <Link href="/quote" className="btn-on-dark whitespace-nowrap">
                Get a Quote
              </Link>
              <Link href="/contact" className="btn-outline-white whitespace-nowrap">
                Speak with an Advisor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-editorial py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="block mb-8">
              <img src="/images/BlackArrowLogo.svg" alt="BlackArrow Insurance" width={115} height={28} className="h-7 w-auto brightness-0 invert" />
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed mb-10 max-w-xs">
              An independent agency serving Eastern North Carolina since 2002 — home, auto, business, and property coverage from 20+ carriers.
            </p>
            {offices.map(office => (
              <div key={office.name} className="mb-6">
                <p className="text-sm font-medium text-white mb-1">{office.name}</p>
                <p className="text-sm text-navy-400 leading-relaxed">{office.address}, {office.city}, {office.state} {office.zip}</p>
                <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="text-sm text-navy-400 hover:text-white transition-colors">
                  {office.phone}
                </a>
              </div>
            ))}
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Management */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-6">Policy management</h3>
            <ul className="space-y-3">
              {policyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-6">Locations</h3>
            <ul className="space-y-3">
              {locationPages.map(location => (
                <li key={location.slug}>
                  <Link href={`/locations/${location.slug}`} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {location.city}, {location.stateAbbr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverages */}
          <div className="col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-6">Coverages</h3>
            {/* CSS columns, not a 2-col grid: in the grid, a label that wrapped
                to two lines ("Dump & Straight Truck") stretched the whole row,
                so the two columns developed uneven gaps down the list. */}
            <ul className="columns-2 gap-x-6">
              {allInsurance.map(ins => (
                <li key={ins.slug} className="mb-3 break-inside-avoid">
                  <Link href={`/insurance/${ins.slug}`} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {ins.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* By City × Service — internal link equity to highest-value local landing pages */}
        {topCityServicePages.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-10 border-t border-white/10">
            <h3 className="text-xs font-semibold tracking-[0.08em] text-navy-400 mb-6">By city &amp; coverage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
              {topCityServicePages.map(p => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="text-sm text-navy-400 hover:text-white transition-colors"
                >
                  {p.serviceType} in {p.city}, {p.stateAbbr}
                </Link>
              ))}
              {statewideNcPages.map(p => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="text-sm text-navy-400 hover:text-white transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-editorial py-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* navy-400, not navy-500: on the navy-950 footer, navy-500 is
                4.14:1 — under AA. navy-400 is 6.09:1. */}
            <p className="text-xs sm:text-sm text-navy-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} BlackArrow Insurance Group. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
              {legalLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-xs sm:text-sm text-navy-400 hover:text-navy-300 transition-colors">
                  {link.label}
                </Link>
              ))}
              {/* navy-400, not navy-600: navy-600 on the navy-950 footer is
                  2.6:1, well under AA — the same reason the copyright line
                  above already uses navy-400. */}
              <span className="text-xs sm:text-sm text-navy-400">
                Website by{' '}
                <a href="https://solagon.com" target="_blank" rel="noopener noreferrer" className="text-navy-400 hover:text-white transition-colors">
                  Solagon
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
