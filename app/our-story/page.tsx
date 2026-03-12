import Link from 'next/link'
import type { Metadata } from 'next'
import { teamMembers, offices } from '@/lib/team-data'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about BlackArrow Insurance — serving Eastern North Carolina for over 20 years with personalized insurance solutions. Meet our team of dedicated professionals.',
}

export default function OurStoryPage() {
  const leadership = teamMembers.filter(m => m.isLeadership)
  const staff = teamMembers.filter(m => !m.isLeadership)

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <img src="/images/blackarrow_greenville.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 mb-5">About BlackArrow</p>
            <h1 className="text-white mb-6">Our Story</h1>
            <p className="text-lg text-navy-300 leading-relaxed max-w-2xl">
              Our mission is to provide reliable, personalized insurance solutions that protect what matters most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are — Editorial two-column */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <ScrollReveal className="lg:col-span-5">
              <p className="section-label">Who We Are</p>
              <h2>A Trusted Name in Eastern North Carolina Insurance</h2>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-7" delay={100}>
              <div className="space-y-6 text-navy-600 leading-relaxed text-lg">
                <p>
                  We are proud to be a trusted source for insurance in the Eastern North Carolina region and are committed to being there for our customers when they need us most.
                </p>
                <p>
                  We have been serving the Eastern North Carolina community for over 20 years. We are a locally-owned and operated insurance company, committed to providing our customers with the highest level of service and protection.
                </p>
                <p>
                  Founded in 2002 by Scott Baldwin, originally under the name Iventure, the company has grown into the largest insurance agency in Greenville, NC, and has expanded to serve clients from our Whiteville office as well.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Image + Stats */}
      <section className="bg-white pb-24 lg:pb-36">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="overflow-hidden mb-12">
              <img src="/images/AdobeStock_315860783.jpeg" alt="Team collaboration" className="w-full h-64 lg:h-80 object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
              {[
                { value: '2002', label: 'Founded' },
                { value: '20+', label: 'Years of Service' },
                { value: '2', label: 'Office Locations' },
                { value: '20+', label: 'Carrier Partners' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-3xl lg:text-4xl font-display font-bold text-navy-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-navy-400 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="rule" />

      {/* Trust Bar */}
      <section className="py-10 bg-white">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-navy-400">
            {['Licensed', 'Bonded', 'Insured', 'Locally Owned', '20+ Carrier Partners'].map((item, i) => (
              <span key={item} className="flex items-center gap-4">
                {i > 0 && <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-navy-300" />}
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="section-label">Why BlackArrow</p>
              <h2>Why Clients Choose Us</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {[
              { title: 'Local Expertise', desc: 'Deep roots in Eastern NC with knowledge of local risks and coverage needs.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              { title: 'Multi-Carrier Access', desc: 'We compare rates from 20+ carriers to find you the best coverage at the best price.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'Personalized Service', desc: 'Every client gets dedicated attention and a policy tailored to their specific needs.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { title: 'Full-Service Agency', desc: 'From personal to commercial to property insurance — we handle it all under one roof.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="bg-white p-8 h-full">
                  <div className="icon-box-navy mb-5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="mb-16">
              <p className="section-label">Leadership</p>
              <h2>Meet Our Owners</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {leadership.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 80}>
                <div className="bg-white h-full">
                  <div className="h-72 lg:h-80 bg-navy-900 relative overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: member.imagePosition || 'center center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-display font-bold text-navy-500">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-semibold text-navy-900">{member.name}</h3>
                    <p className="text-sm text-navy-400 mb-4">{member.role}</p>
                    <p className="text-sm text-navy-500 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="mb-16">
              <p className="section-label">Our Team</p>
              <h2>The People Behind BlackArrow</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {staff.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 60}>
                <div className="bg-white p-8 h-full">
                  <div className="flex items-center gap-5 mb-5">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        style={{ objectPosition: member.imagePosition || 'center center' }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-display font-bold text-navy-400">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-navy-900">{member.name}</h3>
                      <p className="text-sm text-navy-400">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-navy-500 leading-relaxed">{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="mb-16">
              <p className="section-label">Our Offices</p>
              <h2>Visit Us</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-px bg-gray-200 max-w-5xl">
            {offices.map((office, i) => (
              <ScrollReveal key={office.name} delay={i * 100}>
                <div className="bg-white h-full">
                  <div className="h-56 overflow-hidden bg-navy-100">
                    <img src={office.image} alt={office.imageAlt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-navy-900 mb-5">{office.name}</h3>
                    <div className="space-y-4 text-sm text-navy-500">
                      <p>{office.address}<br />{office.city}, {office.state} {office.zip}</p>
                      <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="block font-medium text-navy-900 hover:text-navy-700 transition-colors">
                        {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} className="block font-medium text-navy-900 hover:text-navy-700 transition-colors">
                        {office.email}
                      </a>
                      <p className="text-navy-400">{office.hours}<br />{office.closed}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-24 lg:py-32 text-white">
        <div className="container-editorial text-center">
          <ScrollReveal>
            <h2 className="text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Let our team of experienced professionals help you find the right coverage for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-secondary px-8 py-4">Request a Quote</Link>
              <Link href="/contact" className="btn-outline-white px-8 py-4">Speak with an Advisor</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
