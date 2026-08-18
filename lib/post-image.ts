/**
 * Blog featured-image resolver.
 *
 * Post featured images were AI-generated illustrations stored at
 * `/images/insights/<slug>.png`. They've been replaced with real licensed
 * stock photos at `/images/blog/<slug>.jpg` (same slugs, 1:1). The paths are
 * still stored in the database in the old form, so rewrite them on render
 * rather than migrating the DB. Anything that isn't an insights PNG — an
 * admin-uploaded Vercel Blob URL, say — passes through untouched.
 */
/**
 * Thumbnails whose photography was replaced a second time, because the original
 * stock choice was visibly not North Carolina — a car on Russian plates, a
 * sailboat under alpine mountains, a Portuguese shopfront.
 *
 * These live at `<slug>-2.jpg` rather than overwriting `<slug>.jpg`. Replacing
 * the bytes at an unchanged URL does not actually work: next/image and the CDN
 * both cache optimized variants keyed by URL, so the old picture keeps being
 * served until every cache entry expires — which is exactly what happened on
 * the first attempt. Changing the filename changes the URL and busts all of
 * them at once.
 *
 * Add a slug here whenever a thumbnail is replaced, and ship the new file with
 * the `-2` suffix.
 */
const REPLACED_THUMBNAILS = new Set([
  'do-red-cars-really-cost-more-to-insure-debunking-auto-insurance-myths',
  'do-you-need-boat-insurance-year-round-understanding-seasonal-coverage',
  'how-much-general-liability-insurance-coverage-does-your-business-really-need',
  'the-cost-of-not-having-general-liability-insurance-risks-for-small-business-owners',
  'how-rental-dwelling-insurance-differs-from-homeowners-insurance',
])

export function resolvePostImage<T extends string | null | undefined>(src: T): T {
  if (!src) return src

  const blogPath = src
    .replace('/images/insights/', '/images/blog/')
    .replace(/\.png$/i, '.jpg')

  const slug = blogPath.match(/^\/images\/blog\/(.+)\.jpg$/i)?.[1]
  if (slug && REPLACED_THUMBNAILS.has(slug)) {
    return `/images/blog/${slug}-2.jpg` as T
  }

  return blogPath as T
}
