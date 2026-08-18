/**
 * Hero photograph per city. The two office cities get their own building; the
 * service-area cities fall back to a Southern-US home. Wilmington takes the
 * coastal shot — the inland suburban fallback misrepresents it.
 *
 * Lives here rather than in the [slug] template because /locations now shows
 * the same photograph on each city tile, and the two must not drift.
 */
export const locationHeroImages: Record<string, string> = {
  'whiteville-nc': '/images/blackarrow-whiteville.jpg',
  'greenville-nc': '/images/blackarrow_greenville.webp',
  'wilmington-nc': '/images/stock/flood.jpg',
}

export const DEFAULT_LOCATION_HERO = '/images/stock/homeowners.jpg'
