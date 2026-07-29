'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const POSTER = '/images/hero-poster.jpg'
const VIDEO = '/images/hero-bg-video.mp4'

/**
 * Homepage hero backdrop.
 *
 * The poster always renders and is the LCP candidate; the video is layered on
 * top and faded in only once it can actually play. That ordering matters —
 * previously the hero was a bare autoplaying <video> with no poster, so the
 * hero area stayed empty until enough of the file had buffered.
 *
 * The video is only mounted when all three hold:
 *
 *  - viewport ≥ 640px — phones get the ~30 KB optimized poster instead of a
 *    3 MB download on cellular, and the backdrop is largely hidden behind the
 *    text overlay there anyway.
 *  - prefers-reduced-motion is not set — an auto-playing, looping background
 *    is exactly the motion WCAG 2.2.2 asks us to let people turn off.
 *  - Save-Data is not requested.
 *
 * Mounting conditionally (rather than hiding with CSS) is deliberate: a
 * display:none <video autoplay> still downloads in most browsers, so a CSS-only
 * approach would save no bytes at all.
 */
export default function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const wideEnough = window.matchMedia('(min-width: 640px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true

    const evaluate = () => setShowVideo(wideEnough.matches && !reducedMotion.matches && !saveData)

    evaluate()
    wideEnough.addEventListener('change', evaluate)
    reducedMotion.addEventListener('change', evaluate)
    return () => {
      wideEnough.removeEventListener('change', evaluate)
      reducedMotion.removeEventListener('change', evaluate)
    }
  }, [])

  return (
    <>
      <Image
        src={POSTER}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          src={VIDEO}
        />
      )}
    </>
  )
}
