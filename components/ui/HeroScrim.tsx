/**
 * The overlay that sits between an interior hero photograph and its headline.
 *
 * Every interior hero used to paint a flat `bg-navy-950/80` over its image.
 * At 80% over navy-900 that erases the photo outright — the pages shipped a
 * priority-loaded full-bleed image and rendered as a solid navy slab with an
 * empty right half.
 *
 * Below `lg` the headline runs the full width of the container, so the scrim
 * has to stay even. From `lg` up the copy is capped at `max-w-3xl` and the
 * right ~40% of the frame carries nothing but overlay, so the gradient thins
 * out there and lets the photograph read.
 *
 * The top band is separate: the header is fixed and transparent over these
 * heroes, and its white nav links land on whatever happens to be the brightest
 * part of the image.
 */
export default function HeroScrim() {
  return (
    <>
      <div className="absolute inset-0 bg-navy-950/[0.78] lg:hidden" />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(10,25,41,0.94) 0%, rgba(10,25,41,0.90) 42%, rgba(10,25,41,0.62) 68%, rgba(10,25,41,0.38) 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950/70 to-transparent" />
    </>
  )
}
