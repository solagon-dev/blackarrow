# BlackArrow — North Carolina SEO Action Plan

Built from live Ahrefs + Google Search Console data pulled 2026-07-29. This is
the companion to the on-page/technical work already committed on `main`; it
covers the **off-site and operational** actions that move NC traffic and that
can't be done in the codebase.

## Where things stand

- **Domain Rating 9**, 377 referring domains, 757 backlinks. The link history
  exists (prior site + directories), but Ahrefs shows **0 indexed organic
  keywords** — the rebuild reset rankings and Google is re-establishing them.
- **GSC shows the opposite of invisible:** Google already surfaces the site for
  ~100 NC insurance queries — they're just stuck on pages 4–10. Almost every
  click in the last 90 days was for the brand name.
- **Translation:** the job is not "get discovered." It's "convert impressions
  we already have into page-1 rankings," plus fix the local signals.

## Priority 1 — Google Business Profile (highest ROI, off-site only)

This is the single biggest lever and none of it is in the code. It drives the
"near me" terms, the local pack, and fixes the weak branded CTR.

- [ ] **Claim + verify both offices** as separate GBP listings:
  - Greenville — 905 Conference Dr. 2B, Greenville, NC 27858 · (252) 955-5898
  - Whiteville — 301 Liberty St. Ste 101, Whiteville, NC 28472 · (910) 914-6074
- [ ] **NAP must match the site exactly** (name, address, phone) — same
  formatting as the footer and schema. Inconsistency is why "black arrow
  insurance" only gets ~5% CTR at position 3.
- [ ] Primary category **Insurance agency**; add relevant secondary categories
  (Auto, Home, Commercial, Life insurance agency).
- [ ] Set **service areas** (Greenville/Pitt; Whiteville/Columbus; and the
  service-only metros — Wilmington, Raleigh, Jacksonville).
- [ ] Add hours (match the site: Greenville 9:00–5:30, Whiteville 9:00–5:00),
  photos of both offices, and the services list.
- [ ] Link each GBP to the matching page — Greenville → `/locations/greenville-nc`,
  Whiteville → `/locations/whiteville-nc`.
- [ ] **Reviews:** ask recent happy clients for Google reviews and respond to
  each. Reviews are the strongest local-pack ranking factor and directly lift
  the "near me" terms.

## Priority 2 — Search Console hygiene

- [ ] Confirm the property is set to `https://www.blackarrow.co` (the canonical
  host) and submit `https://www.blackarrow.co/sitemap.xml`.
- [ ] After the next deploy, use **URL Inspection → Request indexing** on the
  pages that already rank but sit deep, so Google re-crawls the improved
  versions: the Greenville auto page, the new NC commercial-auto page, the
  general-liability page, and the Wilmington/Raleigh city pages.
- [ ] Watch the **http / non-www** URLs. Several head terms currently rank the
  `http://blackarrow.co/` version. The site 301s apex→www and Vercel forces
  https, so these should consolidate — confirm in GSC over the next few weeks
  that impressions move to the `https://www` URLs.

## Priority 3 — Local citations & links (authority)

DR 9 is the ceiling on the competitive Wilmington terms (KD 30–47). Raising it
is a slow, steady game:

- [ ] Consistent NAP on the major directories: Yelp, Bing Places, Apple
  Business Connect, YellowPages, and insurance-specific directories.
- [ ] Chambers of commerce (Greenville–Pitt, Whiteville/Columbus, Wilmington)
  — membership pages are real local links.
- [ ] Local sponsorships / community partnerships that carry a link.

## The keyword targets (from the data)

Every page below already exists on the site; the work above is what gets them
to page 1. Ordered by winnability × value.

| Keyword | Vol/mo | Difficulty | Page | Current pos |
|---|---|---|---|---|
| workers compensation near me | 1,100 | 0 | homepage / `/insurance/workers-compensation` | 7 |
| how much general liability insurance do i need | 450 | 13 | `/insurance/general-liability` (FAQ added) + GL blog | 74 |
| auto insurance raleigh nc | 350 | 2 | `/auto-insurance-raleigh-nc` | not yet ranking |
| commercial auto insurance nc | 300 | 2 | `/insurance/commercial-auto-insurance-north-carolina` (new) | new |
| car insurance greenville nc | 250 | 0 | `/auto-insurance-greenville-nc` | 38 |
| auto insurance greenville nc | 200 | 0 | `/auto-insurance-greenville-nc` (de-duped) | 47 → consolidating |
| north carolina boat insurance | 400 combined | 0–2 | `/insurance/boat-insurance-north-carolina` | ~15 (blog) |
| renters insurance wilmington nc | 250 | 4 | `/renters-insurance-wilmington-nc` | not yet ranking |
| home insurance raleigh nc | 200 | 8 | `/home-insurance-raleigh-nc` | not yet ranking |
| business insurance wilmington nc | 700 | 42 | `/business-insurance-wilmington-nc` | longer play (needs authority) |

## What was already done in code (committed on `main`)

- De-duplicated the Greenville auto pages (retired the weaker `/insurance/`
  geo-variant, 301'd it to the richer city page; fixed an outdated NC minimum).
- Added the statewide **Commercial Auto Insurance in North Carolina** page
  (300/mo, KD 2 — no page existed for it).
- Expanded the general-liability page's FAQ to own the "how much do I need /
  $1M–$5M aggregate" query cluster.
- Wired the previously orphaned NC workers-comp page into internal links and
  gave the statewide NC pages real stock hero photos + site-wide footer links.
- (Earlier work: fixed the silent lead-loss bug in the forms API, real analytics,
  image performance, accessibility, and replaced all AI imagery with licensed
  stock.)

## 30 / 60 / 90

- **First 30 days:** GBP claimed + verified for both offices, reviews requested,
  sitemap submitted, key pages re-indexed. This is where the fastest movement
  comes from.
- **60 days:** citations consistent; monitor the pos-4–15 pages climbing as
  Google re-crawls the improved, de-duplicated site.
- **90 days:** begin link outreach for the competitive Wilmington terms; review
  GSC for the next tier of quick wins.
