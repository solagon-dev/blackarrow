import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BlackArrow Insurance privacy policy — how we collect, use, and protect your personal information.',
  alternates: { canonical: '/legal/privacy-policy' },
  robots: { index: true, follow: true },
}

const sections = [
  {
    id: 'information-collected',
    title: 'Information We Collect',
    intro: 'We collect personal information that you voluntarily provide to us, including but not limited to:',
    items: [
      'Names, addresses, phone numbers, and email addresses',
      'Information regarding your insurance needs and preferences',
      'Website usage data such as the pages you visit and the actions you take',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    intro: 'We use the information we collect for the following purposes:',
    items: [
      'Providing insurance quotes and processing applications',
      'Servicing your insurance policies',
      'Communicating with you about your coverage',
      'Conducting marketing, research, and analysis to improve our services',
    ],
  },
  {
    id: 'text-messaging',
    title: 'Text Messaging Consent & Privacy',
    content: 'If you opt in to receive text messages from BlackArrow Insurance, your opt-in data and consent will not be shared, sold, or transferred to any third parties under any circumstances. We maintain strict privacy compliance with all text messaging communications.',
  },
  {
    id: 'disclosure',
    title: 'Disclosure of Information',
    intro: 'We may disclose your personal information in the following situations:',
    items: [
      'When required by law or legal process',
      'When necessary to protect our rights, safety, or property',
      'With third-party service providers who assist us in delivering requested services',
    ],
  },
  {
    id: 'security',
    title: 'Security of Information',
    content: 'We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    id: 'third-party-links',
    title: 'Links to Other Websites',
    content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external websites. We encourage you to review the privacy policies of any third-party sites you visit.',
  },
  {
    id: 'childrens-privacy',
    title: 'Children\u2019s Privacy',
    content: 'Our website is not designed for or directed at users under the age of 18. We do not knowingly collect personal information from minors.',
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: 'We reserve the right to update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-navy-950/90" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-4 sm:mb-5">Legal</p>
            <h1 className="text-white mb-4 sm:mb-6">Privacy Policy</h1>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed">
              Black Arrow Financial Group (&ldquo;BlackArrow Insurance,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting the privacy of our customers and website visitors.
            </p>
            <div className="flex items-center gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
              <p className="text-xs text-navy-400">Last updated: January 1, 2025</p>
              <span className="w-1 h-1 rounded-full bg-navy-500" />
              <Link href="/legal/terms-of-use" className="text-xs text-navy-400 hover:text-white transition-colors">
                Terms of Service
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
                  {'content' in section && section.content && (
                    <p className="text-base text-navy-600 leading-[1.85]" style={{ maxWidth: '65ch' }}>
                      {section.content}
                    </p>
                  )}
                  {'intro' in section && section.intro && (
                    <>
                      <p className="text-base text-navy-600 leading-[1.85] mb-4" style={{ maxWidth: '65ch' }}>
                        {section.intro}
                      </p>
                      <ul className="space-y-3">
                        {section.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-base text-navy-600 leading-[1.85]">
                            <span className="w-1.5 h-1.5 rounded-full bg-navy-300 mt-2.5 flex-shrink-0" />
                            <span style={{ maxWidth: '60ch' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
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
              <h3 className="text-lg font-semibold text-navy-900 mb-1">Have questions about this policy?</h3>
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
