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
export function resolvePostImage<T extends string | null | undefined>(src: T): T {
  if (!src) return src
  return src
    .replace('/images/insights/', '/images/blog/')
    .replace(/\.png$/i, '.jpg') as T
}
