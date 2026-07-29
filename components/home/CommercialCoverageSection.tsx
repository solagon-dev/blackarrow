'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { commercialInsurance, getInsuranceHeroImage } from '@/lib/insurance-data'
import { getIconByName } from '@/components/ui/Icons'
import ScrollReveal from '@/components/ui/ScrollReveal'

/**
 * Commercial coverage section with a hover-reactive image.
 *
 * Hovering (or focusing) a coverage swaps the section photo to that coverage's
 * illustration and back to the resting photo on leave. This has to be a client
 * component — the homepage itself is a server component — so it's extracted
 * here rather than living inline in app/page.tsx.
 */

const RESTING_IMAGE = '/images/AdobeStock_415962919.jpeg'
const RESTING_ALT =
  'North Carolina small business owners protected by BlackArrow commercial insurance'
const IMAGE_SIZES = '(max-width: 1024px) 100vw, 600px'

// The preview each coverage swaps to, deduped so the same file is never stacked
// twice.
const swapLayers = Array.from(
  new Set(commercialInsurance.map((ins) => getInsuranceHeroImage(ins.slug)))
)

export default function CommercialCoverageSection() {
  const [active, setActive] = useState(RESTING_IMAGE)

  // Only mount the swap layers on hover-capable pointers. On a phone there's no
  // hover, so preloading nine coverage previews there would be pure waste — the
  // resting photo is all a touch visitor ever sees.
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const rest = () => setActive(RESTING_IMAGE)

  return (
    <section className="section-padding bg-gray-50 border-y border-gray-200">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <ScrollReveal>
            <div>
              <p className="section-label">Commercial insurance</p>
              <h2 className="mb-6">Coverage Built for Your Business</h2>
              <p className="text-lg text-navy-600 leading-relaxed mb-10">
                We work with businesses of all sizes to develop insurance programs that address real operational risks — not just check boxes.
              </p>
              <div className="relative overflow-hidden mb-10 h-44 sm:h-56 lg:h-64 bg-navy-100">
                {/* Resting layer: always present, so there's never a blank frame
                    while a hovered preview is still loading. */}
                <Image
                  src={RESTING_IMAGE}
                  alt={RESTING_ALT}
                  fill
                  sizes={IMAGE_SIZES}
                  className="object-cover"
                />
                {/* Swap layers crossfade on top. Decorative — the card the visitor
                    is pointing at already names the coverage — so aria-hidden. */}
                {canHover &&
                  swapLayers.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes={IMAGE_SIZES}
                      className={`object-cover transition-opacity duration-500 ${
                        active === src ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
              </div>
              <Link href="/quote" className="btn-primary">
                Request a Business Quote
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            {/* Reset to the resting photo once the pointer or focus leaves the
                whole coverage list, not just an individual card. */}
            <div onMouseLeave={rest} onBlur={rest}>
              <div className="space-y-px bg-gray-200">
                {commercialInsurance.slice(0, 4).map((ins) => (
                  <Link
                    key={ins.slug}
                    href={`/insurance/${ins.slug}`}
                    onMouseEnter={() => setActive(getInsuranceHeroImage(ins.slug))}
                    onFocus={() => setActive(getInsuranceHeroImage(ins.slug))}
                    className="bg-white p-6 group block hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="icon-box-navy w-10 h-10 flex-shrink-0">
                        {getIconByName(ins.icon, 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-navy-900 mb-1 group-hover:text-navy-700 transition-colors">{ins.shortTitle}</h3>
                        <p className="text-sm text-navy-600 leading-relaxed line-clamp-2">{ins.description.slice(0, 120)}...</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {commercialInsurance.slice(4).map((ins) => (
                  <Link
                    key={ins.slug}
                    href={`/insurance/${ins.slug}`}
                    onMouseEnter={() => setActive(getInsuranceHeroImage(ins.slug))}
                    onFocus={() => setActive(getInsuranceHeroImage(ins.slug))}
                    className="text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
                  >
                    {ins.shortTitle} →
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
