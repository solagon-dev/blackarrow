# SEO Optimization Guide — BlackArrow Insurance

Canonical source of truth for the SEO state of `blackarrow.co`. Last refreshed: April 2026.

## Current Ahrefs Health Score: 71 → targeted ≥ 95 after this pass

### What drove the 71 (pre-fix)
- 61 URLs with errors, 104 with warnings, 102 with notices across 208 pages.
- Primary errors flagged in the 2026-04-18 crawl:
  - **Duplicate pages without canonical** — every page had `canonical: null` in the HTML because only the homepage set `alternates.canonical`.
  - **3XX / 4XX / 403 pages receiving organic traffic** — legacy URLs (e.g. `/home-insurance`, `/blog/*`, `/about`) had no redirects, so Google was still pointing traffic at dead URLs.
  - **Duplicate `<title>` + duplicate `<meta description>`** across five pages (home, `/contact`, `/change-mortgagee`, etc.) — the static pages were falling back to the root layout's default metadata.
  - **Double-suffix titles** (e.g. `Rental Dwelling Insurance | BlackArrow Insurance | BlackArrow Insurance`) — the Next.js title template `%s | BlackArrow Insurance` was being appended to `seoTitle` fields that already ended with the same suffix.

### What was fixed in this pass

#### Technical SEO
- **Canonical URLs** added to every page via `alternates.canonical`:
  - Insurance detail pages (`/insurance/[slug]`)
  - City location pages (`/locations/[slug]`)
  - Service-location pages (`/[service-city-state]`)
  - Blog posts (`/post/[slug]`)
  - Static pages: `/our-story`, `/locations`, `/insights`, `/file-a-claim`, `/contact`, `/quote`, `/change-mortgagee`, `/loan-number-change`, `/legal/*`
  - Admin pages now emit `noindex, nofollow`.
- **Title template collision resolved** — all generators strip `" | BlackArrow Insurance"` from `seoTitle` before Next.js re-appends it via the root layout's template, so titles are clean and single-suffixed.
- **301 redirects** configured in `next.config.js` for 30+ legacy paths (e.g. `/blog/*`, `/about`, `/home-insurance`, `/airbnb-insurance`, `/greenville`) → clears the "3XX/4XX page receives organic traffic" error class.
- **`trailingSlash: false`** normalized to eliminate `/url` vs. `/url/` duplicate-content signals.
- **Cache-Control headers** added: images immutable for 1 year, sitemap 1 hour, robots 1 day.
- **Permissions-Policy + DNS prefetch** headers added to `next.config.js`.
- **Robots.txt expanded** — disallows tracking-parameter URLs, blocks AI training crawlers that don't send referral traffic (GPTBot, CCBot, Google-Extended), explicitly allows ClaudeBot / PerplexityBot.
- **Sitemap rebalanced** — priority weights now reflect commercial importance: `/quote` = 0.95, service/location pages = 0.85, posts = 0.7, legal = 0.3. Blog posts use actual `updated_at` / `published_at` dates when available.

#### On-page SEO
- **Insurance page titles** rewritten for NC intent (e.g. `Homeowners Insurance in North Carolina — Get a Free Quote`, `Commercial Auto Insurance in North Carolina — NC Fleet Coverage`, `Short Term Rental Insurance in North Carolina — Airbnb & VRBO`).
- **Location titles** rewritten with value prop (e.g. `Insurance Agency in Wilmington, NC — Coastal Home, Auto & Business`).
- **Meta descriptions** tightened on homeowners, auto, and the 3 NC-specific long-tail pages to include keyword + differentiator + CTA.
- **Alt text** added to all previously-empty decorative images on `/our-story`, `/change-mortgagee`, `/loan-number-change`, `/file-a-claim`, `/contact`, `/quote`, `/insights`.

#### Structured data (schema.org JSON-LD)
- **Root layout** — expanded `InsuranceAgency` schema with: 9 NC cities in `areaServed`, 17 insurance products in `knowsAbout`, geo coordinates for both offices, `openingHoursSpecification`, explicit `priceRange`, logo `ImageObject`, alternate names. Added `SearchAction` on the WebSite entity.
- **`/insurance/[slug]`** — emits `Service` (with `OfferCatalog` of coverage types), `FAQPage`, and `BreadcrumbList` JSON-LD.
- **`/locations/[slug]`** — emits `InsuranceAgency` (local), `BreadcrumbList`.
- **`/[service-city-state]`** — emits `InsuranceAgency` (local), `Service`, `FAQPage`, `BreadcrumbList`.
- **`/post/[slug]`** — expanded `Article` schema (wordCount, articleSection, language) + `BreadcrumbList`.

#### Content quality signals
- Descriptive alt text across hero images → better image search eligibility and accessibility score.
- Homepage meta keywords expanded from 9 generic terms to 14 NC-specific long-tails that match tracked keywords in the Ahrefs Rank Tracker project.

### Tracked keywords & intent

The Ahrefs Rank Tracker project (id 9710012, tracked from Wilmington, NC) has 68 keywords grouped as:

- **Brand**: `black arrow insurance`, `blackarrow insurance`, `blackarrow insurance nc`, `blackarrow insurance wilmington` — target rank 1–3, homepage
- **City + insurance type** (highest-volume commercial intent):
  - `home insurance wilmington nc`, `homeowners insurance wilmington nc`, `auto insurance wilmington nc`, `flood insurance wilmington nc`, `boat insurance wilmington nc`, `business insurance wilmington nc`, `life insurance wilmington nc`, `workers comp insurance wilmington nc`, `homeowners insurance raleigh nc`, `auto insurance raleigh nc`, `home insurance greenville nc`, `auto insurance greenville nc`, `home insurance whiteville nc` → target the `/[service-city-state]` pages
- **NC statewide**: `hurricane insurance nc`, `flood insurance nc`, `short term rental insurance nc`, `airbnb insurance nc`, `coastal home insurance nc`, `builders risk insurance nc`, `cyber liability insurance nc`, `general liability insurance nc` → target the `/insurance/*` pages now rewritten for NC
- **Local broker intent**: `insurance broker wilmington nc`, `insurance agent leland nc`, `insurance agency raleigh nc`, `independent insurance agent nc` → target the `/locations/*` pages and homepage

### What Stone should do next

1. **Push these changes to production** so Ahrefs picks them up on the next weekly crawl.
2. **Re-run the site audit** in Ahrefs after deploy. Health score should move from 71 to ~95+; duplicate-canonical errors should clear completely.
3. **Verify Google Search Console** ownership (add the verification string to `metadata.verification.google` in `app/layout.tsx`) and resubmit the sitemap.
4. **Build backlinks** — the domain currently has essentially no referring domains. Priority directories: NC independent agent associations (IIANC), Greenville/Whiteville chambers of commerce, Google Business Profile for both offices, industry directories (Trusted Choice, MyPoly).
5. **Expand blog content** for the striking-distance keywords: there's already good structure at `/insights` — publish 2–3 NC-specific coverage pieces per month (topics: NC hurricane deductibles, NC coastal home insurance premiums, NC workers comp requirements, NC flood zones).
6. **Set up Google Business Profiles** for both Greenville (905 Conference Dr) and Whiteville (301 Liberty St) offices, with the exact NAP that matches the JSON-LD in `app/layout.tsx`.
7. **Consider hreflang** only if expanding beyond US/English (currently not needed).

### Files touched in this pass

- `app/layout.tsx` — metadata, Organization + WebSite schema
- `app/robots.ts` — crawler rules
- `app/sitemap.ts` — priorities and dates
- `app/insurance/[slug]/page.tsx` — metadata + Service/FAQ/Breadcrumb schema
- `app/locations/[slug]/page.tsx` — metadata + LocalBusiness/Breadcrumb schema
- `app/(seo)/[slug]/page.tsx` — metadata + Service/FAQ/Breadcrumb schema, LocalBusiness parentOrganization link
- `app/post/[slug]/page.tsx` — metadata + Article/Breadcrumb schema
- `app/our-story/page.tsx`, `app/locations/page.tsx`, `app/insights/page.tsx` — metadata
- `app/file-a-claim/page.tsx`, `app/legal/privacy-policy/page.tsx`, `app/legal/terms-of-use/page.tsx` — metadata
- `app/quote/layout.tsx`, `app/contact/layout.tsx`, `app/change-mortgagee/layout.tsx`, `app/loan-number-change/layout.tsx` — metadata
- `app/admin/layout.tsx` — `noindex, nofollow`
- `app/our-story/page.tsx`, `app/change-mortgagee/page.tsx`, `app/loan-number-change/page.tsx`, `app/file-a-claim/page.tsx`, `app/contact/page.tsx`, `app/quote/page.tsx`, `app/insights/page.tsx` — alt text on hero images
- `next.config.js` — redirects, headers, trailing-slash policy
- `lib/insurance-data.ts` — 19 seoTitles rewritten for NC relevance
- `lib/location-data.ts` — 4 seoTitles rewritten

### Canonical SEO checklist (current)

- [x] Title tags unique per page (no double-suffix)
- [x] Meta descriptions unique per page
- [x] Canonical URLs on every indexable page
- [x] Heading hierarchy clean (H1 per page, H2/H3 nested)
- [x] Mobile responsive
- [x] Fast Next.js rendering (App Router, RSC, static params for insurance/location/post)
- [x] robots.txt with explicit sitemap
- [x] XML sitemap with priorities + lastmod dates
- [x] Semantic HTML5
- [x] Internal linking dense (footer, header dropdowns, related-insurance rails)
- [x] Accessible (alt text, focus states, aria labels)
- [x] Schema: Organization, WebSite, Service, InsuranceAgency, LocalBusiness, FAQPage, Article, BreadcrumbList, SearchAction
- [x] Open Graph + Twitter Card metadata
- [x] 301 redirects for legacy paths
- [x] Admin paths noindexed
- [ ] Google Search Console ownership verified (needs Stone to paste verification token)
- [ ] Google Business Profile claimed for both offices (off-site work)
- [ ] Initial backlink campaign (off-site work)

### Ongoing SEO maintenance

- **Weekly**: Ahrefs site audit + Search Console scan; review the Rank Tracker change report.
- **Monthly**: Publish 2–3 NC-focused blog posts; refresh 1–2 existing insurance pages with new FAQs / coverage types.
- **Quarterly**: Review Rank Tracker for striking-distance keywords (positions 4–20); update `/insurance/*` pages to target keywords where the page is already ranking 11–20.
- **Annually**: Full content audit, schema validation via Rich Results Test.
