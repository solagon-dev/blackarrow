import Link from 'next/link'
import type { Metadata } from 'next'

// 404 page — important for SEO: returns 404 status automatically when rendered
// via Next's notFound(), emits noindex, and links back to high-value pages so
// crawlers discover internal content instead of dead-ending.

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you requested could not be found on BlackArrow Insurance. Browse our North Carolina home, auto, and commercial insurance coverage, or request a free quote.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
}

export default function NotFound() {
  return (
    <main className="bg-white">
      <section className="pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4">
            404 — Page Not Found
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-navy-900 mb-6">
            We couldn&rsquo;t find that page.
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed mb-10">
            The page you&rsquo;re looking for may have moved, been renamed, or
            never existed. Try one of the links below, or head back to our
            homepage to keep exploring BlackArrow Insurance.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <Link
              href="/"
              className="btn-primary text-center"
            >
              Back to homepage
            </Link>
            <Link
              href="/quote"
              className="btn-outline text-center"
            >
              Request a free quote
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">
              Popular pages
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-navy-600">
              <li><Link className="link-arrow" href="/insurance/homeowners">Homeowners Insurance</Link></li>
              <li><Link className="link-arrow" href="/insurance/auto">Auto Insurance</Link></li>
              <li><Link className="link-arrow" href="/insurance/business-owners-package">Business Insurance</Link></li>
              <li><Link className="link-arrow" href="/insurance/life">Life Insurance</Link></li>
              <li><Link className="link-arrow" href="/locations">Our North Carolina offices</Link></li>
              <li><Link className="link-arrow" href="/insights">Insurance insights &amp; articles</Link></li>
              <li><Link className="link-arrow" href="/our-story">About BlackArrow</Link></li>
              <li><Link className="link-arrow" href="/contact">Contact us</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
