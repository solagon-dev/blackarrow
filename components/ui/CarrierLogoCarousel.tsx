'use client'

import Image from 'next/image'

const logos = [
  { name: 'Progressive', src: '/images/carrier-logos/progressive.jpg' },
  { name: 'Safeco', src: '/images/carrier-logos/safeco.png' },
  { name: 'The Hartford', src: '/images/carrier-logos/the-hartford.png' },
  { name: 'Travelers', src: '/images/carrier-logos/travelers.png' },
  { name: 'Foremost', src: '/images/carrier-logos/foremost.png' },
  { name: 'Universal Property', src: '/images/carrier-logos/universal-property.png' },
  { name: 'Orchid', src: '/images/carrier-logos/orchid.png' },
  { name: 'Orion 180', src: '/images/carrier-logos/orion180.png' },
  { name: 'SageSure', src: '/images/carrier-logos/sage-sure.png' },
  { name: 'Heritage', src: '/images/carrier-logos/heritage.png' },
  { name: 'Halifax', src: '/images/carrier-logos/halifax.png' },
  { name: 'JM Wilson', src: '/images/carrier-logos/jm-wilson.png' },
  { name: 'NCJUA', src: '/images/carrier-logos/ncjua.png' },
  { name: 'Cabrillo Coastal', src: '/images/carrier-logos/cabrillo-coastal.svg' },
]

export default function CarrierLogoCarousel() {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-200 overflow-hidden">
      <div className="container-editorial mb-4 sm:mb-5">
        <p className="text-xs font-medium text-navy-600 text-center">Trusted carrier partners</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex animate-scroll">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex shrink-0 items-center" aria-hidden={copyIndex === 1}>
              {logos.map((logo) => (
                <div
                  key={`${copyIndex}-${logo.name}`}
                  className="flex-shrink-0 w-28 sm:w-36 h-12 sm:h-14 mx-5 sm:mx-8 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                  {/* Sized wrapper rather than max-h on the image itself: `fill`
                      needs a positioned box, and this keeps the rendered cap at
                      the same 28/36px the old max-h classes produced. The
                      sources are wildly oversized for this box (safeco.png is
                      236 KB at 1024px wide for a 144px slot) — `sizes` is what
                      makes the optimizer hand back a logo-sized file. */}
                  <div className="relative w-full h-7 sm:h-9">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
