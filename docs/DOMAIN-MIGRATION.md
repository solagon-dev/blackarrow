# blackarrowfg.com → www.blackarrow.co Migration (Plan §6.3)

**Status:** external configuration required (DNS / Squarespace / Search Console
access). Cannot be completed inside this repository. This is the handoff spec for
the domain administrator.

**Evidence:** Ahrefs shows **no indexed organic pages** for `blackarrowfg.com`
(subdomains mode, 2026-07-23). The old domain therefore has minimal organic
footprint, so the migration is low-risk and is primarily a clean domain-level 301
plus a Search Console change-of-address. Still, preserve any direct traffic and any
backlinks to the apex.

## Required redirects (permanent, HTTPS, one hop)

1. **Apex + www of the old domain → the canonical host**, path-preserving:
   - `http(s)://blackarrowfg.com/*` → `https://www.blackarrow.co/*`
   - `http(s)://www.blackarrowfg.com/*` → `https://www.blackarrow.co/*`
   - Must be **301** (not 302), and must **not** hop through an HTTP intermediate.
2. **Path-preserving where the new site has an equivalent URL.** Most content
   paths map 1:1 (e.g. `/contact`, `/our-story`, `/quote`). The new site's
   `next.config.js` already 301-maps many legacy slugs (`/about` → `/our-story`,
   `/home-insurance` → `/insurance/homeowners`, etc.), so once the domain-level
   301 lands on `www.blackarrow.co`, those app-level redirects finish the job in a
   single additional hop. Confirm no path produces a 2-hop chain for a real inbound
   link; add explicit mappings if any do.
3. **Explicit mappings for changed paths** (fill in from the old Squarespace URL
   inventory — pull it from the old GSC property's Pages report):

   | Old path (blackarrowfg.com) | New URL |
   |---|---|
   | `/` | `https://www.blackarrow.co/` |
   | `/about` or `/about-us` | `/our-story` |
   | `/contact` | `/contact` |
   | `/quote` / `/get-a-quote` | `/quote` |
   | `/home-insurance` | `/insurance/homeowners` |
   | `/auto-insurance` | `/insurance/auto` |
   | `/business` / `/commercial` | `/insurance/business-owners-package` |
   | `/blog/{slug}` | `/post/{slug}` (verify slugs; add per-post mappings if they differ) |
   | (any others) | map to the closest equivalent, not just the home page |

## Search Console / Bing

- Verify **both** properties (old and new). Verification tokens are env-driven:
  set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` (see `.env.example`).
- Submit the new sitemap (`https://www.blackarrow.co/sitemap.xml`) on the new
  property.
- Use the **Change of Address** tool from the old property to the new one once the
  domain-level 301 is verified.

## After migration

- Update high-value external listings/citations (chambers, Trusted Choice, carrier
  directories, GBP website field) to the `www.blackarrow.co` URL.
- Spot-check a sample of old inbound links resolve in **one** hop to a relevant page
  (not the home page, not a 404).

## Note

Do not implement any of the above by changing DNS/Squarespace/GSC without explicit
authorization and access (Plan instruction #10). This document is the plan; execution
is the domain owner's action.
