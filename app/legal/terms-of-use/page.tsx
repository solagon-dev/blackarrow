import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'BlackArrow Insurance terms of service — the rules and guidelines governing your use of our website and services.',
  alternates: { canonical: '/legal/terms-of-use' },
  robots: { index: true, follow: true },
}

const sections = [
  {
    id: 'use-of-website',
    title: 'Use of the Website',
    content: 'By accessing or using the website, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the website. BlackArrow Insurance reserves the right to modify these terms at any time without prior notice.',
  },
  {
    id: 'services',
    title: 'Services',
    content: 'Our platform facilitates online insurance quote requests and policy management. All insurance policies are subject to the terms and conditions of the individual policy and may not be available in all states.',
  },
  {
    id: 'text-messaging',
    title: 'Text Messaging',
    content: 'Users may opt into SMS communications covering appointment reminders, order alerts, account notifications, and promotional updates. Message frequency varies based on subscription type. Standard carrier message and data rates apply. You can opt out at any time by texting "STOP" and will receive confirmation before messages cease.',
  },
  {
    id: 'user-content',
    title: 'User Content',
    content: 'You remain solely responsible for all information and content you submit through our website. BlackArrow Insurance does not assume any liability for user-submitted content. You warrant that you possess all necessary rights to any submissions you make.',
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    content: 'You agree to use our website only for lawful purposes and in a manner that does not infringe upon the rights of others. Any activities that damage, disable, or impair the website are strictly prohibited.',
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    content: 'Our services are provided "as is" and "as available" without any warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: 'BlackArrow Insurance shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the website or services.',
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: 'You agree to defend, indemnify, and hold harmless BlackArrow Insurance and its affiliates from any third-party claims, damages, or expenses arising from your use of the website or violation of these Terms.',
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: 'These Terms of Service are governed by and construed in accordance with the laws of the United States and the State of North Carolina, without regard to conflict of law principles.',
  },
  {
    id: 'entire-agreement',
    title: 'Entire Agreement',
    content: 'These Terms constitute the entire agreement between you and BlackArrow Insurance regarding the use of our website and supersede all prior agreements and understandings.',
  },
]

export default function TermsOfUsePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-navy-950/90" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Legal</p>
            <h1 className="text-white mb-4 sm:mb-6">Terms of Service</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              Please read these terms carefully before using our website and services. By accessing BlackArrow Insurance, you agree to be bound by these terms.
            </p>
            <div className="flex items-center gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
              <p className="text-xs text-navy-400">Last updated: January 1, 2025</p>
              <span className="w-1 h-1 rounded-full bg-navy-500" />
              <Link href="/legal/privacy-policy" className="text-xs text-navy-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 sm:py-10 bg-gray-50 border-b border-gray-200">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4">Contents</p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              {sections.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-baseline gap-3 py-1.5 group"
                >
                  <span className="text-xs font-semibold text-navy-300 tabular-nums w-5 flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-navy-600 group-hover:text-navy-900 transition-colors">
                    {section.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                id={section.id}
                className={`${idx > 0 ? 'mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-200' : ''}`}
              >
                <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-5">
                  <span className="text-xs font-semibold text-navy-300 tracking-wide tabular-nums pt-2 sm:pt-2.5 w-6 flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-10 sm:pl-12">
                  <p className="text-base text-navy-600 leading-[1.85]" style={{ maxWidth: '65ch' }}>
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
        <div className="container-editorial">
          <div className="max-w-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-1">Have questions about these terms?</h3>
              <p className="text-sm text-navy-500">
                Contact us at{' '}
                <a href="mailto:admin@blackarrowfg.com" className="text-navy-900 underline underline-offset-4 decoration-navy-300 hover:decoration-navy-900 transition-colors">
                  admin@blackarrowfg.com
                </a>
              </p>
            </div>
            <Link href="/contact" className="btn-primary flex-shrink-0">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
