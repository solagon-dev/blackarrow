import type { ReactNode } from 'react'
import Image from 'next/image'

/**
 * Enterprise Grid hero.
 *
 * A media band with a hard-edged tile pulled up over its lower edge. This is
 * the system's one sanctioned exception to "words never sit on media" — the
 * tile is opaque, so the type is on a tile like everything else; it just
 * happens to overlap the photograph rather than sit beside it.
 *
 * Pass `image` for a still, or `children` for a custom backdrop (the homepage
 * passes HeroBackground so it keeps the video and its gating).
 */
export default function EgHero({
  title,
  lede,
  meta,
  actions,
  breadcrumb,
  image,
  imageAlt = '',
  children,
  band = 'default',
  maxWidth = 'max-w-[42rem]',
}: {
  title: ReactNode
  lede?: ReactNode
  /** A row of content metadata (category · date · reading time) between the
   *  breadcrumb and the title. Article pages use it; nothing else needs it. */
  meta?: ReactNode
  actions?: ReactNode
  breadcrumb?: ReactNode
  image?: string
  imageAlt?: string
  children?: ReactNode
  /** `tall` is for the homepage, where the hero is the whole first screen. */
  band?: 'default' | 'tall'
  /** The pulled-up tile widens for article titles, which run longer. */
  maxWidth?: string
}) {
  const bandHeight =
    band === 'tall'
      ? 'h-[280px] sm:h-[360px] lg:h-[460px]'
      : 'h-[200px] sm:h-[260px] lg:h-[320px]'

  return (
    <section>
      <div className={`relative overflow-hidden bg-navy-900 ${bandHeight}`}>
        {children}
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : 'true'}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
        {/* Flat, not graduated: the tile below does the legibility work, so this
            only has to stop the media reading brighter than the page around it. */}
        <div className="absolute inset-0 bg-navy-950/25" />
      </div>

      <div className="container-editorial relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
        <div className={`eg-tile ${maxWidth} p-6 sm:p-9 lg:p-11`}>
          {breadcrumb}
          {meta && <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-navy-600">{meta}</div>}
          <h1 className="eg-h1">{title}</h1>
          {lede && <p className="eg-lede mt-4 max-w-[46ch]">{lede}</p>}
          {actions && <div className="flex flex-col sm:flex-row gap-0.5 mt-7">{actions}</div>}
        </div>
      </div>
    </section>
  )
}
