import Link from 'next/link'
import Image from 'next/image'
import EgHero from '@/components/ui/EgHero'
import type { Metadata } from 'next'
import { teamMembers, offices } from '@/lib/team-data'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Our Story — Independent Insurance Agency Since 2002',
  description: 'Learn about BlackArrow Insurance — an independent agency serving Eastern North Carolina since 2002. Meet our licensed agents and leadership team in Greenville and Whiteville, NC.',
  alternates: { canonical: '/our-story' },
  openGraph: {
    title: 'Our Story | BlackArrow Insurance',
    description: 'Independent insurance agency serving Eastern North Carolina since 2002. Meet our team in Greenville and Whiteville, NC.',
    url: 'https://www.blackarrow.co/our-story',
    type: 'website',
  },
}

export default function OurStoryPage() {
  const leadership = teamMembers.filter(m => m.isLeadership)
  const staff = teamMembers.filter(m => !m.isLeadership)

  return (
    <div className="eg-field pt-18">
      <EgHero
        image="/images/blackarrow_greenville.webp"
        title="Two offices, one job"
        lede="Get Eastern North Carolina the right coverage from the right carrier, and be there when a claim comes."
        actions={
          <>
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Speak with an advisor</Link>
          </>
        }
      />

      {/* Who we are */}
      <section className="container-editorial mt-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">A trusted name in Eastern North Carolina insurance</h2>
          </div>
          <div className="eg-tile p-6 sm:p-10 lg:p-12">
            <div className="space-y-4 text-sm sm:text-base text-navy-600 leading-relaxed">
              <p>
                When something goes wrong &mdash; a wreck, a storm, a claim at the worst possible
                time &mdash; you don&rsquo;t want to be routed through a call center. You want
                someone local who already knows your policy and picks up the phone. That&rsquo;s the
                agency we&rsquo;ve built in Eastern North Carolina.
              </p>
              <p>
                We&rsquo;ve done this for more than twenty years as a locally owned, independent
                shop. Independent is the part that matters: we answer to the people we insure, not
                to one company&rsquo;s sales targets, so the advice you get is about your coverage
                rather than this quarter&rsquo;s quota.
              </p>
              <p>
                Founded in 2002 by Scott Baldwin, originally under the name Iventure, the company
                has grown into an established independent agency in Greenville, NC, and has expanded
                to serve clients from our Whiteville office as well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Figures */}
      <div className="container-editorial mt-0.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5">
          {[
            { value: '2002', label: 'Founded' },
            { value: '20+', label: 'Years of service' },
            { value: '2', label: 'Office locations' },
            { value: '20+', label: 'Carrier partners' },
          ].map(stat => (
            <div key={stat.label} className="eg-stat">
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials. Flat text, not a row of bullet-separated badges — these are
          facts about the agency, and dressing them as chips oversold them. */}
      <div className="container-editorial mt-0.5">
        <div className="eg-tile px-6 py-5 sm:px-8">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-navy-600">
            {['Licensed', 'Bonded', 'Insured', 'Locally owned', '20+ carrier partners'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Why clients choose us */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile eg-tile-dark p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Why clients choose us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-0.5">
          {[
            { title: 'Local expertise', desc: 'We live and write policies here, so we know coastal wind, flood zones, and what NC actually requires.' },
            { title: 'Multi-carrier access', desc: 'We run your coverage past 20+ carriers and bring back the ones that actually fit — not a single company’s pitch.' },
            { title: 'One agent, every time', desc: 'You work with the same person year to year — someone who knows your policy without pulling the file.' },
            { title: 'Home, auto and business', desc: 'Personal, commercial and property coverage handled by one agency, so your policies work together rather than against each other.' },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 50}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Owners */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Meet the owners</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {leadership.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 50}>
              <div className="eg-tile h-full flex flex-col">
                <div className="relative aspect-[4/5] bg-navy-900 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      style={{ objectPosition: member.imagePosition || 'center center' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-display font-light text-white/70">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-navy-900">{member.name}</h3>
                  <p className="text-sm text-navy-600 mb-3">{member.role}</p>
                  <p className="text-sm text-navy-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">The people behind BlackArrow</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-0.5">
          {staff.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 40}>
              <div className="eg-tile h-full p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={56}
                      height={56}
                      sizes="56px"
                      /* Square, not a circle: nothing else in this system is
                         rounded, and one circle reads as an import. */
                      className="w-14 h-14 object-cover flex-shrink-0"
                      style={{ objectPosition: member.imagePosition || 'center center' }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-field flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-navy-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-navy-900">{member.name}</h3>
                    <p className="text-sm text-navy-600">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">{member.bio}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Offices */}
      <section className="container-editorial mt-0.5">
        <div className="eg-tile p-6 sm:p-10 lg:p-12">
          <h2 className="eg-h2">Visit us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-0.5">
          {offices.map((office, i) => (
            <ScrollReveal key={office.name} delay={i * 60}>
              <div className="eg-tile h-full flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
                  <Image
                    src={office.image}
                    alt={office.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">{office.name}</h3>
                  <div className="space-y-3 text-sm text-navy-600">
                    <p>{office.address}<br />{office.city}, {office.state} {office.zip}</p>
                    <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="block eg-link">
                      {office.phone}
                    </a>
                    <a href={`mailto:${office.email}`} className="block eg-link">
                      {office.email}
                    </a>
                    <p>{office.hours}<br />{office.closed}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-editorial mt-0.5 pb-0.5">
        <div className="grid lg:grid-cols-2 gap-0.5">
          <div className="eg-tile eg-tile-dark flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h2 className="eg-h2">Let&rsquo;s talk about your coverage</h2>
            <p className="eg-lede mt-4">
              Call either office, or send us what you need covered and we&rsquo;ll come back with
              the market.
            </p>
          </div>
          <div className="eg-tile flex flex-col justify-center gap-0.5 p-6 sm:p-10 lg:p-12">
            <Link href="/quote" className="eg-btn-primary">Request a quote &rarr;</Link>
            <Link href="/contact" className="eg-btn-dark">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
