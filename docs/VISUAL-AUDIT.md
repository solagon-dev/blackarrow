# Visual audit — blackarrow.co

Audited at 1280px (desktop) and 390px (mobile) across every distinct template:
home, `/insurance` + 22 product pages, `/locations` + 4 office pages, 26 SEO
city × coverage landing pages, `/insights` + post template, `/quote`,
`/contact`, `/our-story`, policy-management forms, legal, 404.

Findings are grouped by severity. Each one names the file it lives in.

---

## P0 — Reads as broken

### 1. Literal `&rsquo;` printed on the homepage
`app/page.tsx` — the "Our approach" feature list is a plain JS array, not JSX,
so the HTML entity is never decoded. Visitors see:

> "so you see who&rsquo;s actually competitive this year."

Above the fold on mobile. Highest-embarrassment bug on the site.

### 2. The primary CTA looks disabled
`.btn-secondary` (`brand-500`, a muted blue-grey) is used as the *primary*
action on every dark background:

- all 22 `/insurance/[slug]` heroes
- all 26 SEO city landing-page heroes
- the global footer CTA band ("Ready to discuss your coverage?")

Next to `.btn-outline-white` it carries *less* visual weight than the secondary
action, so the money button reads as greyed-out. The homepage hero already does
this correctly with a solid white button — the rest of the site doesn't match.

### 3. Product-hero photography is invisible
`app/insurance/[slug]/page.tsx` paints `bg-navy-950/80` over the hero image.
At 80% opacity over `navy-900` the photo is completely gone — 22 pages ship a
`priority`-loaded, full-width image that nobody can see, and the hero renders as
a flat navy slab with an empty right half.

### 4. Mid-word truncation with a literal `...`
`description.slice(0, 120) + '...'` *combined with* `line-clamp-2`, so the text
is cut twice and often mid-word:

- `components/home/CommercialCoverageSection.tsx` — "exposed customer record..."
- `app/page.tsx` service-area cards — "has served Whiteville and..."

### 5. Property grid ends with two empty boxes
`app/page.tsx` — `GridFillers` is rendered *before* the "Request a property
quote" card, so the last row is `[empty][empty][CTA]`. On the dark section the
two blank bordered cells read as a loading failure, and the CTA is stranded in
the corner.

---

## P1 — Real visual weaknesses

### 6. Header nav is illegible over light hero photos
`components/layout/Header.tsx` uses `text-white/70` while the homepage hero
gradient is only `navy-950/30` at the top — exactly where the header sits. The
hero photo rotates, so on the bright interior shots the nav all but disappears.

### 7. No active-page state in the nav
`navTextActiveClass` exists but is only wired to "dropdown is open". Nothing in
the header tells you which section you're in.

### 8. Ragged "Learn more →" baselines
Card grids let the link sit directly after a variable-length tagline, so across
a five-card row the links land at four different heights. Affects the personal,
property, location and related-coverage grids.

### 9. Image-free heroes on the highest-value pages
`/insights`, `/our-story`, `/locations`, and all 26 SEO city pages render a flat
navy (or navy-gradient) hero with an empty right half — 600–800px of nothing.
These are the pages local search actually lands on.

### 10. "Who Needs X?" repeats one icon three times
`app/insurance/[slug]/page.tsx` calls `getIconByName(page.icon)` inside the
`whoNeeds` map, so three identical house/car/shield glyphs stack vertically.

### 11. Too much vertical whitespace
`.section-padding` is `lg:py-36` on both sides, so consecutive white sections
sit 288px apart with only a 1px rule between them. Pages read as empty rather
than airy — worst on `/our-story` (~700px of dead white) and the product-page
"Who benefits" section.

### 12. Contrast misses
- Footer "Website by" — `navy-600` on `navy-950` ≈ 2.6:1 (`Footer.tsx`)
- Hero eyebrow — `navy-400` over photography (`app/page.tsx`)
- Homepage "Protecting families…" image caption over the bright half of the photo

### 13. Reveal animation has no no-JS fallback
`.reveal { opacity: 0 }` with an IntersectionObserver in
`components/ui/ScrollReveal.tsx`. If JS fails the whole page below the hero is
blank. `threshold: 0.1` also can't fire for elements taller than ~10× the
viewport.

---

## P2 — Editorial / content polish (noted, not all fixed)

- Blog featured images are Mediterranean villas and San Francisco Victorians —
  nothing that looks like Eastern NC.
- The "5 Risks of Leaving Your Property Vacant" thumbnail is a near-white empty
  room that disappears into the white card.
- `whoNeeds` intro copy is templated boilerplate ("is designed for a variety of
  individuals and organizations").
- Nav label inconsistency: "Worker's Comp" vs "Workers Comp (NC)".
