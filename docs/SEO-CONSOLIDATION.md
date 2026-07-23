# URL Consolidation Decision Record (Plan §6.1)

**Method:** evidence-based, using Google Search Console data pulled via Ahrefs
(project *Blackarrow*, id 9710012) for 2025-01-01 → 2026-07-23.

## Key context that shapes every decision

1. **The site is nascent.** The homepage has 17 clicks / 299 impressions; almost
   every interior page has **0 clicks**. There is very little ranking authority to
   split yet, and very little to lose — but also weak signal for picking winners.
2. **The city/service pages are brand new.** Commit `a10a54f` ("SEO: 9 new
   city/service pages") added the top-level `/{service}-{city}-nc` pages recently.
   Their **zero impressions reflect "too new to rank," not "no value."** Redirecting
   them away on that basis would be assumption-based destruction, which Plan
   instruction #15 explicitly forbids.

**Decision:** implement the unambiguous redirect-intent fixes and schema/sitemap
corrections now; **document** the competing-URL consolidations with evidence and
**defer execution** until the new pages have 3–6 months to accumulate data. The
machinery to execute (redirect + `CONSOLIDATED_SLUGS` in `app/sitemap.ts`) is in
place, so each future consolidation is a small, reviewable change.

## Overlap groups & evidence

### Group 1 — Greenville auto
| URL | Clicks | Impr. | Keywords | Avg pos | Note |
|---|---|---|---|---|---|
| `/insurance/auto-insurance-greenville-nc` | 0 | **218** | 21 | 35.1 | Has all the ranking data |
| `/auto-insurance-greenville-nc` (service page) | 0 | 0 | 0 | — | **New** page, no data yet |

**Leaning winner:** `/insurance/auto-insurance-greenville-nc` (it holds the
impressions today). **Caveat:** the top-level service page is new and uses a richer
local template (sections, tips, FAQs, surrounding areas). **Action (deferred):**
re-check in Q4 2026; if the `/insurance/` version stays ahead, merge the unique
local content from the service page into it, then 301 the service page → the
`/insurance/` URL, remove from sitemap (`CONSOLIDATED_SLUGS.serviceLocation`), and
update the two internal links (`components/layout/Footer.tsx:17`,
`lib/service-location-data.ts:297`).

### Group 2 — Statewide workers' compensation
| URL | Clicks | Impr. | Note |
|---|---|---|---|
| `/insurance/workers-compensation` | 0 | 0 | Generic template, thinner |
| `/insurance/workers-compensation-north-carolina` | 0 | 0 | NC-specific, richer (Phase 0 edits) |

Neither has GSC data. **Recommendation:** keep `/insurance/workers-compensation` as
the canonical product page and fold the NC-specific detail into it (or vice-versa),
then 301 the loser. **Deferred** — no evidence to choose, low stakes, so no
destruction now.

### Group 3 — Statewide boat
| `/insurance/boat` vs `/insurance/boat-insurance-north-carolina` | Both 0 clicks / 0 impr. |
Same posture as Group 2. **Recommendation:** canonical `/insurance/boat`; merge NC
content; 301 the geo-variant. **Deferred.**

### Group 4 — Wilmington commercial vs business
| `/commercial-insurance-wilmington-nc` vs `/business-insurance-wilmington-nc` | Both new, 0 data |
Nearly identical intent. **Recommendation:** pick `/commercial-insurance-wilmington-nc`
(broader term), merge, 301 the other. **Deferred** until data exists.

## Executed now (unambiguous, non-destructive)

- **Redirect-intent fixes** (`next.config.js`, Plan §6.2): `/renters-insurance` and
  `/renter-insurance` → `/insurance/renters` (were wrongly → rental-dwelling);
  `/flood-insurance` → `/insurance/flood` (was wrongly → homeowners).
- **Schema** (Plan §6.4/§6.5): service-area pages now emit `Service` schema with
  `areaServed` + `OfferCatalog` and **no** addressless `InsuranceAgency` — offices
  keep the real NAP. `SearchAction` fixed so `/insights?q=` actually filters.
- **Sitemap** (Plan §6.6): dropped build-time `lastmod` from pages without a real
  timestamp; kept real timestamps for posts; `CONSOLIDATED_SLUGS` filter wired.

## How to execute a deferred consolidation later

1. Merge the strongest unique content into the chosen canonical page.
2. Add the loser slug to `CONSOLIDATED_SLUGS` in `app/sitemap.ts`.
3. Add a 301 in `next.config.js` (loser → winner).
4. Update internal links to point at the winner (no linking through redirects).
5. Exclude the loser from the route's `generateStaticParams`.
6. Confirm one-hop redirect + canonical on the winner; re-submit sitemap.
