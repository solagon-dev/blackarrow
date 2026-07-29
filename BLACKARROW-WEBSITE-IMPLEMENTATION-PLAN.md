# BlackArrow Website — Full Implementation Plan

**Project:** BlackArrow Insurance  
**Production site:** https://www.blackarrow.co  
**Primary markets:** Greenville and Whiteville, North Carolina  
**Secondary service areas:** Eastern North Carolina, Wilmington, Raleigh, and selected surrounding communities  
**Prepared:** July 23, 2026  
**Status:** Approved strategic direction; implementation specification

---

## 1. Purpose

This document is the source of truth for the next major improvement pass on the BlackArrow Insurance website. It converts the website audit into an executable engineering, design, content, conversion, accessibility, performance, and SEO plan.

The implementer should complete the work in deliberate phases, validate each phase, preserve existing working behavior, and avoid inventing unsupported business facts. The goal is not merely to make the website prettier. The goal is to produce a distinctive, trustworthy, locally credible website that:

- communicates why BlackArrow is different;
- converts more qualified visitors into calls and quote requests;
- accurately represents current North Carolina insurance requirements;
- ranks through genuinely useful, expert-reviewed content;
- consolidates search authority instead of splitting it across duplicate URLs;
- performs well on mobile devices;
- meets WCAG 2.2 AA expectations;
- reliably captures and reports every lead;
- gives the business usable data about traffic, leads, and revenue.

---

## 2. Non-negotiable implementation principles

1. **Accuracy before aesthetics.** Correct legal, insurance, pricing, and business claims before polishing their presentation.
2. **Lead reliability before conversion experiments.** Never show a success state unless the lead was durably stored or successfully delivered.
3. **One search intent, one canonical page.** Merge pages that compete for the same query.
4. **Real proof over generic marketing.** Prefer real people, offices, expertise, process, reviews, and local examples.
5. **People-first content.** Do not publish thin or automated material solely to create more indexed pages.
6. **Progressive enhancement.** Core navigation, content, and forms must remain usable with assistive technology and under imperfect client-side conditions.
7. **Measure before optimizing.** Establish a clean analytics baseline before claiming conversion improvements.
8. **Do not fabricate.** Never invent review counts, ratings, customers served, carrier appointments, licenses, awards, policy counts, savings, response times, or market-position claims.
9. **Preserve recoverability.** Do not perform destructive repository or data operations without an explicit, verified recovery path.
10. **No silent scope reduction.** If a task requires business credentials, third-party access, legal review, photography, or a human decision, implement everything possible and record the remaining dependency clearly.

---

## 3. Mandatory preflight: repository integrity

### 3.1 Known local workspace problems

The workspace inspected on July 23, 2026 showed the following:

- `git status` failed with `fatal: unable to read tree (57538758bf01e0636fb36d94c0363db54d1b87b8)`.
- `app/page.tsx` and `app/layout.tsx` were absent.
- Dot-prefixed temporary variants existed:
  - `app/.page.tsx.m2dLhx`
  - `app/.page.tsx.rG4Ilp`
  - `app/.layout.tsx.imL7Hs`
  - `app/.layout.tsx.v6Ff3z`
- `data.db` was empty.
- Approximately 22 `.fuse_hidden*` files existed under `public/images`, totaling roughly 80 MB.
- The live production website remained functional, indicating a local workspace/repository problem rather than a confirmed production outage.

### 3.2 Required preflight procedure

Before changing application code:

1. Record the current directory, current branch, remotes, HEAD, and worktree state.
2. Run non-destructive Git integrity checks.
3. Determine whether a clean upstream clone, remote branch, Vercel-connected repository, backup, or known-good archive exists.
4. Compare the duplicate temporary page/layout files byte-for-byte.
5. Do not assume the temporary files are safe replacements until compared with the known-good upstream version.
6. Preserve any uncommitted user work.
7. Restore or rehydrate a clean worktree using the least destructive method available.
8. Confirm that normal Git status, diff, log, and file reads work.
9. Confirm that `app/page.tsx` and `app/layout.tsx` match the production-intended source.
10. Confirm database configuration and migration strategy. Do not treat the empty local `data.db` as production data.
11. Remove `.fuse_hidden*` files only after confirming they are junk, untracked, and unnecessary.
12. Add appropriate ignore rules so temporary FUSE artifacts do not return.
13. Run the baseline validation suite before feature work:
    - dependency install integrity;
    - TypeScript;
    - lint;
    - production build;
    - relevant existing tests;
    - a local smoke test of primary routes.

### 3.3 Stop condition

If repository repair would overwrite unknown user work, rewrite shared history, delete unrecoverable data, or require guessing which source is canonical, stop and ask the user for direction. Do not use destructive Git reset or broad deletion as a shortcut.

### 3.4 Preflight deliverable

Create a short implementation log entry documenting:

- the cause of the repository issue, if determined;
- what was restored;
- which files were preserved;
- the clean baseline commit or source;
- baseline test/build results;
- any unresolved local-data limitations.

---

## 4. Phase 0 — Critical accuracy and lead-safety remediation

Complete this phase before visual redesign.

### 4.1 Correct North Carolina auto minimums

Replace all obsolete 30/60/25 statements in visible copy, metadata, FAQs, and JSON-LD.

For policies issued or renewed on or after July 1, 2025, use:

- $50,000 bodily injury per person;
- $100,000 bodily injury per accident;
- $50,000 property damage.

Authoritative references:

- https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025
- https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-279.21.html

Known affected areas include:

- `lib/insurance-data.ts`
- `lib/service-location-data.ts`
- Greenville auto service pages
- Whiteville auto service pages
- FAQs
- structured-data descriptions generated from the above content

Wording should state the effective date so the page remains historically intelligible.

### 4.2 Review workers’ compensation claims

Use the NC Industrial Commission as the authoritative baseline:

- https://www.ic.nc.gov/wcinsrqmt.html

The general rule is that businesses with three or more employees must carry coverage, subject to exceptions and counting rules. Remove or qualify blanket statements that every construction contractor with one employee is universally required to carry coverage.

Review and correct:

- `lib/insurance-data.ts`
- all workers’ compensation service-location pages;
- FAQ answers;
- penalty descriptions;
- employee-count language;
- rate examples;
- “stop-work order” and personal-liability statements;
- contractor/subcontractor wording.

Where the legal situation is nuanced, use plain language and direct readers to a licensed agent and the NC Industrial Commission. Do not present the site as legal advice.

### 4.3 Build a claims-and-facts registry

Create a maintainable source file or documented data structure for business claims used throughout the site. It should include:

- founding year;
- approved “years in business” display logic;
- number of offices;
- office names, addresses, phones, email, and hours;
- number of carrier relationships, with last verification date;
- approved service-area language;
- licensed states, if supplied by the business;
- verified response-time promises;
- approved claims about size, client count, experience, and market position;
- approved privacy/security language;
- sources and last-reviewed dates for legal or regulatory facts.

Eliminate the 2002/2003 conflict. The current project predominantly says 2002, while the quote sidebar says 2003.

All reusable statistics and office data should come from a single source rather than being hardcoded across templates.

### 4.4 Remove or qualify unsupported claims

Audit and either substantiate, qualify, or remove:

- “best rate”;
- “best price”;
- “most favorable terms”;
- “largest insurance agency in Greenville”;
- “serving thousands of clients”;
- “same-day quotes”;
- “quotes in minutes”;
- “encrypted and secure”;
- “we never sell your data”;
- precise premium ranges;
- specific carrier discounts;
- precise local-risk or traffic assertions;
- claims that a policy “covers hurricane flooding”;
- recommendations such as universal 100/300/100 limits unless presented as a discussion point rather than individualized advice.

### 4.5 Fix form-delivery semantics

Relevant route:

- `app/api/forms/route.ts`

Current behavior returns success even if both durable storage and email delivery fail.

Required behavior:

1. Validate the request with a typed schema and reject malformed or oversized fields.
2. Verify reCAPTCHA as currently intended.
3. Generate a submission ID.
4. Attempt durable storage.
5. Attempt notification delivery.
6. Return a successful client response only when at least one durable recovery path exists.
7. Prefer storage as the source of truth and notification as an alert.
8. If storage succeeds and email fails, return accepted success, log/queue the notification failure, and alert operations.
9. If email succeeds and storage fails, return accepted success but alert operations and preserve the email delivery ID.
10. If both fail, return a non-2xx response and show a clear retry/call message.
11. Never log sensitive form contents in plaintext error logs.
12. Add rate limiting and server-side length constraints.
13. Add idempotency protection against duplicate submission.
14. Add structured server logs with submission ID, form type, storage status, notification status, and timestamps.

### 4.6 Add a lead-reconciliation mechanism

Implement one of the following, choosing the architecture that best fits the existing deployment:

- a stored submission status with retryable notification delivery;
- a small queue;
- a scheduled retry job;
- or a durable outbox pattern.

Provide an operational way to identify:

- stored but not emailed;
- emailed but not stored;
- permanently failed;
- duplicate submissions;
- pending follow-up.

Do not expose customer PII in a public or weakly protected interface.

### 4.7 Form acceptance criteria

- A simulated database failure does not produce a false success when email also fails.
- A simulated email failure preserves a stored lead and makes the failure observable.
- A duplicate retry does not create multiple agent notifications.
- Client success copy accurately describes what happened.
- Errors are announced accessibly.
- No secret, policy number, loan number, or full form payload appears in ordinary logs.

---

## 5. Phase 1 — Measurement and attribution

### 5.1 Stop destroying campaign attribution

Review `middleware.ts`.

The current middleware permanently removes UTM, click-ID, and campaign parameters before client analytics can record them. Replace this approach with one of:

- preserve campaign parameters on the landing URL while relying on canonical tags for clean indexing;
- capture parameters into a first-party attribution cookie/session before redirecting;
- or perform a client-side clean URL replacement only after analytics records attribution.

Do not rely on robots exclusions as the primary duplicate-content solution. Canonical tags already exist.

### 5.2 Add analytics in a consent-aware manner

Implement a maintainable analytics layer using environment-configured IDs. Do not hardcode production credentials.

At minimum, support:

- page views;
- organic landing page;
- referrer;
- UTM and click-ID attribution;
- location-page views;
- coverage-page views;
- phone clicks;
- email clicks;
- direction/map clicks;
- quote-form start;
- quote-form step completion;
- quote-form validation error;
- quote-form abandonment where feasible;
- quote submission accepted;
- contact submission accepted;
- policy-management form accepted;
- file-a-claim outbound carrier click;
- article-to-money-page click;
- conversion source and landing page.

Use a small typed event abstraction so components do not embed vendor-specific calls everywhere.

### 5.3 Search Console and verification support

Add environment-driven metadata support for:

- Google Search Console verification;
- Bing Webmaster verification if desired;
- analytics identifiers.

Document the exact environment variable names in the setup documentation.

### 5.4 Privacy

Update the privacy policy and consent behavior to match the actual analytics, reCAPTCHA, form storage, email delivery, retention, and attribution implementation.

Do not display a generic cookie banner unless it accurately controls the technologies in use.

### 5.5 Measurement acceptance criteria

- A test campaign URL retains or durably records its attribution.
- Form events fire once with no PII.
- Phone clicks can be attributed to page and channel.
- Analytics failure never blocks navigation or form submission.
- Development and preview environments do not pollute production analytics.
- Event names and payloads are documented.

---

## 6. Phase 2 — SEO architecture and migration cleanup

### 6.1 Build a URL consolidation matrix

Before redirecting competing pages, collect:

- Search Console clicks, impressions, average position, and query overlap;
- Ahrefs backlinks and referring domains;
- internal link count;
- form and call conversions;
- content completeness;
- current index status.

For each overlap group, choose one canonical winner and document the reason.

Known overlap groups:

1. Greenville auto:
   - `/insurance/auto-insurance-greenville-nc`
   - `/auto-insurance-greenville-nc`
2. Statewide workers’ compensation:
   - `/insurance/workers-compensation`
   - `/insurance/workers-compensation-north-carolina`
3. Statewide boat insurance:
   - `/insurance/boat`
   - `/insurance/boat-insurance-north-carolina`
4. Wilmington commercial/business:
   - `/commercial-insurance-wilmington-nc`
   - `/business-insurance-wilmington-nc`
5. Any location/service/article pages that target the same primary query and user intent.

For each consolidation:

- merge the strongest accurate content;
- redirect the losing URL permanently;
- update all internal links;
- update canonical tags;
- remove the losing URL from the sitemap;
- update structured data and breadcrumbs;
- check that the redirect is one hop;
- preserve relevant query parameters;
- test old backlinks.

### 6.2 Correct mistaken legacy redirects

In `next.config.js`:

- `/renters-insurance` and `/renter-insurance` should not redirect to landlord/rental-dwelling coverage when a renters page exists.
- `/flood-insurance` should not redirect to homeowners when a flood page exists.
- Review hurricane/windstorm redirects and choose the most relevant destination.
- Review every redirect for intent equivalence rather than merely avoiding a 404.

### 6.3 Finish the `blackarrowfg.com` migration

This requires domain/DNS/Squarespace access and may not be fully implementable in this repository.

Required external configuration:

- direct permanent HTTPS redirect from `blackarrowfg.com` to `https://www.blackarrow.co`;
- path-preserving redirects where equivalent new pages exist;
- explicit mapping for changed paths;
- no temporary 302;
- no HTTP intermediate destination;
- Search Console verification for both old and new properties;
- change-of-address workflow if applicable;
- sitemap submission on the new property;
- updates to high-value backlinks and directories.

Create a migration mapping document or machine-readable redirect map for the domain administrator.

### 6.4 Restructure location and service-area semantics

Physical offices:

- Greenville
- Whiteville

These pages should use complete office-specific LocalBusiness/InsuranceAgency data:

- exact name;
- full postal address;
- office phone;
- office email;
- opening hours;
- coordinates;
- office imagery;
- map/directions link;
- staff assigned to that office;
- office-specific canonical URL.

Non-office markets such as Wilmington, Raleigh, and Jacksonville:

- clearly label them as service areas rather than offices;
- do not imply a physical location;
- use Service schema with `areaServed`;
- avoid LocalBusiness markup without a real address;
- explain how service is delivered;
- retain only pages with meaningful, unique local value.

### 6.5 Structured-data corrections

- Remove or fix the `SearchAction` because `/insights?q=` does not currently initialize the article search.
- Use the most accurate Organization, InsuranceAgency, Service, Article, FAQ, and Breadcrumb types.
- Keep global organization data separate from office-specific data.
- Add only verified `sameAs` profiles.
- Do not add self-serving aggregate review stars.
- Ensure all structured-data statements match visible page content.
- Validate representative pages in the Rich Results Test and Schema Markup Validator.

### 6.6 Sitemap corrections

In `app/sitemap.ts`:

- use actual significant content-modification timestamps;
- do not set every static page’s `lastmod` to build/deployment time;
- omit `lastmod` when no reliable timestamp exists;
- understand that Google ignores `priority` and `changefreq`;
- include only canonical, indexable, 200-status URLs;
- remove consolidated/redirected URLs.

### 6.7 SEO acceptance criteria

- One canonical indexable URL exists for each target search intent.
- No sitemap URL redirects or returns non-200.
- Old internal links do not point through redirects.
- Physical-office schema contains complete address information.
- Remote service-area pages do not impersonate physical offices.
- Representative structured data validates without critical errors.
- The old domain redirects directly and permanently when external access is available.

---

## 7. Phase 3 — Information architecture and navigation

### 7.1 Create a true insurance hub

Add a crawlable `/insurance` page that helps users choose coverage. It should not be a duplicate list of every existing page.

Organize by user need:

- Protect my home and family
- Protect my vehicle
- Protect my business
- Protect a rental or investment property
- Handle a specialized risk

The page should explain when to speak with an agent and link to major categories.

Update breadcrumbs so “Insurance” links to `/insurance`, not `/quote`.

Update “All coverages” links to `/insurance`.

### 7.2 Recommended primary navigation

- Insurance
- Business
- Property & Rentals
- Locations
- Resources
- Client Services
- Get a Quote

“Client Services” should contain:

- Change Mortgagee
- Loan Number Change
- File a Claim
- Contact

Keep acquisition paths visually distinct from existing-client service paths.

### 7.3 Accessible navigation behavior

Desktop dropdowns must:

- open on click as well as appropriate pointer interaction;
- be fully keyboard-operable;
- expose `aria-expanded`;
- expose `aria-controls`;
- close on Escape;
- move focus predictably;
- not disappear while focus is within the menu;
- provide a direct link to the category hub.

Mobile navigation must:

- use correct expanded states;
- maintain focus;
- prevent background interaction when open;
- restore focus to the trigger when closed;
- preserve large touch targets;
- avoid nested scrolling traps.

### 7.4 Location-aware contact behavior

Do not show the Whiteville phone as the universal primary number on Greenville pages.

Implement a documented rule:

- Greenville pages prefer the Greenville office;
- Whiteville pages prefer the Whiteville office;
- secondary service areas use an approved central or nearest-office routing decision;
- general pages either show both offices or a clearly labeled main line.

Do not infer or geolocate the visitor without need or consent.

---

## 8. Phase 4 — Brand and visual system

### 8.1 Strategic visual direction

Evolve the existing restrained navy style into a warmer, locally grounded editorial system.

Retain:

- professional navy foundation;
- strong typography;
- generous whitespace where it serves hierarchy;
- clear rectangular calls to action;
- editorial credibility.

Add:

- a distinct BlackArrow directional motif;
- real team and office photography;
- Eastern NC environmental and architectural imagery;
- one controlled warm accent such as copper, sand, tobacco, or muted red;
- more varied compositions;
- subtle topographic, map, paper, or regional textures;
- useful diagrams and comparison visuals;
- thoughtful microinteractions tied to movement or direction.

Avoid:

- excessive gradients;
- glassmorphism;
- generic glowing cards;
- decorative AI imagery;
- endless equal card grids;
- arbitrary floating shapes;
- excessive scroll animation;
- “pizazz” that reduces readability or trust.

### 8.2 Create design tokens

Centralize:

- brand colors;
- semantic colors;
- typography scale;
- spacing scale;
- content widths;
- border treatments;
- shadows;
- radii;
- motion durations/easing;
- focus styles;
- responsive breakpoints.

Document component variants and remove obsolete aliases after migration.

### 8.3 Use an owned arrow motif

Use the BlackArrow name as a restrained visual system:

- directional rules;
- button transitions;
- map/region callouts;
- progress indicators;
- process diagrams;
- section dividers;
- hover movement;
- quote progression.

Do not add literal arrow decoration to every card.

### 8.4 Photography strategy

Prioritize:

1. BlackArrow agents;
2. Greenville office;
3. Whiteville office;
4. client-facing activity with consent;
5. recognizable Eastern NC environments;
6. authentic homes, businesses, vehicles, rentals, and construction risks;
7. stock imagery only where necessary.

Every image should have:

- an editorial purpose;
- responsive sizing;
- appropriate alt text;
- width and height;
- modern formats;
- a documented focal point where needed.

If required photography is unavailable, implement clean placeholders that are explicitly labeled in the implementation log. Do not fabricate documentary-looking local photography.

---

## 9. Phase 5 — Homepage redesign

### 9.1 Homepage goals

Within the first screen, communicate:

- BlackArrow is an independent insurance agency;
- it serves Eastern North Carolina;
- it has real Greenville and Whiteville offices;
- it compares multiple carriers;
- visitors can request a quote or talk to an agent;
- the brand is local, experienced, and human.

### 9.2 Recommended homepage flow

#### Section 1: Hero

Use a specific, locally grounded value proposition. Replace “Protecting Your Tomorrow, Today” as the primary message or subordinate it to a more useful statement.

Possible strategic direction, not mandatory final copy:

> Local insurance guidance for the risks Eastern North Carolina actually faces.

Support it with:

- independent multi-carrier comparison;
- physical office proof;
- a real photograph;
- one primary CTA;
- one phone/advisor alternative.

Fix the mobile hero so the value proposition appears immediately without a large empty region.

#### Section 2: Trust/proof strip

Use only verified values:

- founded year;
- carrier relationships;
- office count;
- licensed professionals;
- verified rating/review count if supplied and permitted.

#### Section 3: Intent chooser

Ask “What are you protecting?” and route visitors into:

- home and family;
- vehicle;
- business;
- rental/investment property;
- specialized risks.

#### Section 4: Independent-agency process

Explain visually:

1. BlackArrow learns the risk.
2. BlackArrow compares suitable carriers and terms.
3. A licensed agent explains tradeoffs.
4. BlackArrow remains available at renewal and during claims.

#### Section 5: Local proof/story

Feature a real office, team member, customer scenario, or local risk example. If customer-specific, obtain consent and avoid revealing sensitive details.

#### Section 6: Coverage explorer

Show the most important products first and progressively reveal secondary products. Avoid a wall of 17 equal cards.

#### Section 7: Meet the agents

Show real names, roles, specialties, offices, and direct paths to contact.

#### Section 8: Eastern NC field guide

Use a map or editorial visual to explain:

- coastal wind and flood;
- inland storm exposure;
- rental-property risks;
- college-town rental/auto considerations;
- local business and contractor needs.

All factual claims require review.

#### Section 9: How to get covered

Use three simple steps and set an honest expectation for response timing.

#### Section 10: Reviews/testimonials

Use only authentic, permissioned reviews or testimonials. Include source and date where appropriate. Do not fabricate aggregate ratings.

#### Section 11: Offices

Present Greenville and Whiteville as two distinct, real offices with photos, hours, phones, and directions.

#### Section 12: Resources

Feature two or three substantial articles, not thin one-minute posts.

#### Section 13: Final conversion

Use one primary quote CTA and one call/advisor option. Avoid stacking multiple nearly identical dark CTA bands.

### 9.3 Homepage copy requirements

- Use plain, confident language.
- Avoid generic phrases unless substantiated immediately.
- Limit “right coverage,” “tailored,” “peace of mind,” and “best rate.”
- Describe the actual work agents perform.
- Emphasize local risks and long-term service.
- Fix punctuation and accessible text spacing.
- Standardize “Homeowners Insurance,” “Workers’ Compensation,” and hyphenation.

---

## 10. Phase 6 — Template redesign

### 10.1 Coverage-page template

Each coverage page should answer:

1. What problem does this coverage solve?
2. Who typically needs it?
3. What is usually included?
4. What is commonly excluded or separately covered?
5. Which North Carolina considerations matter?
6. What information does an agent need to quote it?
7. Why is BlackArrow qualified to help?
8. What should the visitor do next?

Vary layouts intentionally. Do not render every concept as a three-card grid.

### 10.2 Physical-office template

For Greenville and Whiteville:

- office-specific hero and photograph;
- exact NAP and hours;
- directions/map;
- local staff;
- services;
- surrounding communities;
- real local expertise;
- office-specific calls and quote path;
- verified reviews or local proof;
- FAQs;
- complete office schema.

### 10.3 Remote service-area template

For non-office markets:

- clearly state that BlackArrow serves the area;
- identify which office/team handles service;
- explain remote/in-person availability accurately;
- provide genuinely local risk guidance;
- avoid implying a storefront;
- use Service schema;
- include only when content is unique and valuable.

### 10.4 Article template

Add:

- named author or reviewer;
- qualifications and profile link;
- published and reviewed dates;
- sources/references;
- clear scope/disclaimer where needed;
- article summary;
- table of contents for long guides;
- contextual conversion blocks;
- related service and location links;
- improved reading width and typography;
- social sharing only if useful.

### 10.5 Quote and contact template

Use a branching quote path:

1. coverage/need;
2. tailored qualifying questions;
3. ZIP/location;
4. contact information and preference;
5. review/consent;
6. durable success confirmation.

Avoid asking a life, auto, or cyber visitor for generic “Property Information.”

Offer:

- request a call;
- call an office;
- upload or send current declarations safely if a secure mechanism is implemented;
- schedule a consultation if the business supports it.

Do not implement uploads without a clear security, access, retention, malware scanning, and deletion model.

---

## 11. Phase 7 — Content quality reconstruction

### 11.1 Editorial style guide

Create a concise BlackArrow style guide covering:

- audience;
- tone;
- approved company description;
- agent/advisor/broker terminology;
- product naming;
- capitalization and hyphenation;
- legal disclaimers;
- use of statistics;
- source requirements;
- prohibited hype;
- CTA vocabulary;
- local place-name conventions;
- author/reviewer policy.

### 11.2 Audit the existing 51-article library

For every article, record:

- URL;
- title;
- topic;
- word count;
- author/reviewer;
- current traffic;
- impressions;
- backlinks;
- target query;
- overlap with other articles;
- factual risk;
- conversion contribution;
- action: retain, expand, merge, redirect, noindex, or remove.

Do not mass-delete without mapping traffic and backlinks.

### 11.3 Priority article upgrades

Start with high-intent, locally useful subjects:

- North Carolina’s 2025 auto-insurance minimum changes;
- homeowners versus flood coverage in North Carolina;
- wind/hail and hurricane deductibles;
- Greenville rental-property risks near ECU;
- landlord versus homeowners insurance;
- flood considerations in Greenville, Whiteville, and Wilmington;
- workers’ compensation requirements for NC employers;
- contractor and subcontractor workers’ compensation exposure;
- insurance checklists for Eastern NC small businesses;
- dump and straight truck coverage considerations;
- short-term rental insurance for coastal NC properties;
- replacement-cost reviews after construction-cost increases.

### 11.4 Content requirements

Every retained priority guide should:

- answer the query completely;
- add original local or professional insight;
- use current authoritative sources;
- have a named reviewer;
- provide a reviewed date;
- link naturally to relevant service/location pages;
- avoid keyword stuffing;
- avoid arbitrary word-count targets;
- avoid unsupported price promises;
- be useful even if the reader never requests a quote.

### 11.5 Automated content workflow

Keep AI-assisted generation as draft support only unless the business explicitly approves auto-publication after establishing a licensed review process.

Required controls:

- default status is draft;
- named human reviewer;
- source verification;
- duplicate-topic detection;
- legal/factual checklist;
- plagiarism/originality review;
- no automatic fake freshness;
- audit trail of publication and review.

---

## 12. Phase 8 — Accessibility remediation

Target WCAG 2.2 AA.

### 12.1 Required fixes

- Associate every label with its field using `htmlFor` and `id`.
- Provide autocomplete tokens where appropriate.
- Give search fields accessible names.
- Use `aria-live` or equivalent for form errors and success.
- Communicate required fields and validation errors textually.
- Ensure every control has a visible keyboard focus indicator.
- Make desktop dropdowns keyboard-operable.
- Expose expanded/collapsed state.
- Ensure accordions use appropriate semantics.
- Communicate quote step number, current step, and completion state.
- Fix “Tomorrow,Today” accessible text.
- Validate heading hierarchy.
- Add a skip-to-content link.
- Ensure touch targets meet modern guidance.
- Test dialog/menu focus containment and restoration.
- Test color contrast, including muted navy/gray text and transparent header states.
- Avoid motion that cannot be reduced.
- Ensure all informative images have useful alt text and decorative images have empty alt text.
- Ensure icons do not become the only label.

### 12.2 Accessibility verification

Test representative pages with:

- keyboard only;
- macOS VoiceOver;
- automated accessibility tooling;
- 200% zoom;
- reduced motion;
- high contrast where available;
- mobile screen-reader navigation.

Record and fix all serious and critical findings.

---

## 13. Phase 9 — Performance and asset cleanup

### 13.1 Known issues

- `next.config.js` disables image optimization.
- Most public content imagery uses raw `<img>`.
- Images generally lack intrinsic dimensions.
- Homepage preloads below-the-fold article imagery.
- A sampled article PNG was roughly 628 KB.
- Multiple article images are approximately 600–770 KB.
- `public/images/hero-bg-video.mp4` is roughly 19 MB and appeared unused.
- `.fuse_hidden*` files total roughly 80 MB.
- `public` is roughly 138 MB.
- The homepage HTML is roughly 145 KB.
- Referenced homepage JS/CSS is roughly 688 KB raw before transfer compression.
- The Insights page sends the full article list to the client and filters it there.
- Repeated ScrollReveal components create many client observers.

### 13.2 Required performance work

- Remove verified unused and temporary public assets.
- Add ignore rules for FUSE artifacts.
- Convert oversized images to appropriately sized AVIF/WebP.
- Re-enable a responsive image pipeline or document a justified alternative.
- Add width, height, and responsive `sizes`.
- Eager-load only the true above-the-fold LCP image.
- Lazy-load below-the-fold images.
- Stop preloading homepage article thumbnails unless a trace proves value.
- Paginate or server-filter the article archive.
- Reduce client-side component boundaries.
- Replace many independent reveal observers with a lighter approach or remove unnecessary reveals.
- Avoid rendering content initially invisible when JavaScript fails.
- Review cache/revalidation strategy for Insights and posts.
- Keep third-party scripts non-blocking.
- Remove unused preconnects.

### 13.3 Performance verification

Run formal mobile and desktop tests for:

- homepage;
- quote page;
- Greenville office page;
- Whiteville office page;
- major coverage page;
- major service-area page;
- Insights archive;
- article page.

Measure:

- LCP;
- INP;
- CLS;
- FCP;
- TBT in lab tests;
- transferred bytes;
- image weight;
- unused JavaScript/CSS;
- request chains;
- caching.

Target “Good” Core Web Vitals at the 75th percentile for real users:

- LCP under 2.5 seconds;
- INP under 200 milliseconds;
- CLS under 0.1.

Do not degrade image quality merely to hit an arbitrary score.

---

## 14. Phase 10 — Local growth work

Some items require business-owned accounts and cannot be completed solely in code.

### 14.1 Google Business Profiles

For Greenville and Whiteville:

- verify ownership;
- ensure exact NAP consistency;
- select accurate primary and secondary categories;
- list actual services;
- add office/team/signage photos;
- link each profile to its office page;
- add a quote/appointment URL if supported;
- answer questions and reviews;
- publish useful updates periodically;
- track calls and website visits;
- do not keyword-stuff the business name.

### 14.2 Review program

Create an ethical request process:

- ask customers after a positive service interaction;
- use the same neutral request for all eligible customers;
- do not review-gate;
- do not incentivize positive reviews;
- respond professionally;
- obtain permission before republishing testimonials.

### 14.3 Citation and authority program

Pursue accurate listings and relationships with:

- Greenville-Pitt County Chamber;
- Columbus County/regional chambers;
- Independent Insurance Agents of North Carolina;
- Trusted Choice;
- carrier agency directories;
- realtors;
- mortgage professionals;
- property managers;
- landlord groups;
- builders and contractor associations;
- trucking organizations;
- local nonprofits, sponsorships, and community events;
- relevant local media.

Keep name, address, phone, and website consistent.

### 14.4 Link-worthy resources

Build resources with genuine utility:

- Eastern NC hurricane and wind checklist;
- NC auto-minimum update explainer;
- flood versus homeowners visual guide;
- Greenville rental-property checklist;
- Whiteville small-business risk checklist;
- NC workers’ compensation decision guide reviewed by a qualified professional.

---

## 15. Testing requirements

### 15.1 Automated

Add or update tests for:

- fact-registry consumption;
- form schema validation;
- form delivery state combinations;
- idempotency;
- API failure responses;
- analytics event sanitization;
- route redirects;
- canonical metadata;
- sitemap contents;
- structured-data generation;
- navigation states where practical;
- conditional quote steps.

### 15.2 Route smoke tests

Verify at minimum:

- `/`
- `/insurance`
- `/quote`
- `/contact`
- `/our-story`
- `/locations`
- `/locations/greenville-nc`
- `/locations/whiteville-nc`
- one remote service-area page
- each primary coverage family
- `/insights`
- a retained article
- policy-management pages
- 404 page
- robots and sitemap

### 15.3 Redirect tests

Test:

- apex to `www`;
- HTTP to HTTPS;
- tracking attribution behavior;
- every new consolidation redirect;
- mistaken renters/flood redirect corrections;
- representative legacy paths;
- old-domain mappings when external configuration is complete.

### 15.4 Visual regression

Check:

- 390×844 mobile;
- common tablet width;
- 1280px desktop;
- large desktop;
- long headings;
- empty/missing images;
- slow-loading images;
- mobile menu;
- quote-flow transitions;
- validation errors;
- success and failure states.

---

## 16. Documentation requirements

Update project documentation with:

- architecture overview;
- design tokens and component rules;
- business fact registry;
- content style guide;
- author/reviewer workflow;
- analytics event dictionary;
- environment variables;
- form delivery and retry behavior;
- lead reconciliation procedure;
- redirect/consolidation map;
- structured-data model;
- sitemap update rules;
- image preparation workflow;
- accessibility testing checklist;
- deployment and rollback steps;
- external/off-site tasks.

Create an implementation log that records:

- completed tasks;
- decisions;
- redirects;
- content merged;
- business facts requiring approval;
- external credentials still needed;
- before/after measurements;
- known limitations.

---

## 17. Suggested implementation sequence and commit boundaries

Use small, reviewable commits or equivalent checkpoints:

1. Repository recovery and clean baseline
2. Insurance/legal fact corrections
3. Form reliability and tests
4. Attribution and analytics foundation
5. SEO consolidation and redirect corrections
6. Schema and sitemap corrections
7. Design tokens and accessible navigation
8. Homepage redesign
9. Insurance hub and quote-flow redesign
10. Coverage/location/article templates
11. Content consolidation and editorial upgrades
12. Accessibility pass
13. Performance and asset cleanup
14. Final regression, documentation, and deployment checklist

Do not mix repository recovery with broad design changes in one checkpoint.

---

## 18. Business decisions and inputs that may be required

Do not guess these values. Surface them clearly when needed:

- authoritative founding year if 2002 is not confirmed;
- exact carrier count and eligible carrier logos;
- whether “largest agency” or client-count claims can be substantiated;
- approved response-time promise;
- primary/general phone routing;
- Greenville versus Whiteville staffing;
- verified licenses and professional bios;
- Google Business Profile URLs;
- verified review counts and permission to republish;
- analytics/Search Console IDs;
- desired consent model;
- retention period for lead data;
- who reviews regulated content;
- preferred warm accent within the evolved visual system;
- availability of new staff, office, and local photography;
- old-domain/DNS/Squarespace access;
- access to GSC, Ahrefs, GBP, and production analytics.

Implement safe placeholders or environment hooks where appropriate, but do not publish invented public-facing data.

---

## 19. Definition of done

The project is complete only when:

- repository integrity is restored and documented;
- critical insurance facts are current and reviewed;
- form submissions cannot be falsely acknowledged;
- lead failures are observable and recoverable;
- attribution is preserved;
- conversion events are implemented and documented;
- duplicate search-intent pages are consolidated using evidence;
- legacy redirects match user intent;
- the old-domain migration has a complete external action plan or is finished;
- physical offices and remote service areas are represented accurately;
- a real `/insurance` hub exists;
- navigation is mouse, touch, and keyboard accessible;
- the homepage has a distinctive BlackArrow identity and strong local proof;
- quote questions adapt to the selected coverage;
- core templates are no longer repetitive AI-style compositions;
- priority content is substantial, sourced, and human reviewed;
- schema and sitemap behavior are correct;
- WCAG 2.2 AA issues have been addressed and tested;
- images and public assets are optimized;
- representative pages meet agreed performance targets;
- all tests, lint, type checks, and production build pass;
- documentation and implementation log are complete;
- unresolved external tasks are explicitly listed with owners and next actions.

---

## 20. Reporting format for the implementer

At the end of each phase, report:

1. What changed
2. Why it changed
3. Files affected
4. Tests performed
5. Measured result
6. Remaining risks
7. Business input required
8. Next phase

The final handoff should also include:

- a concise executive summary;
- before/after screenshots;
- before/after performance results;
- redirect map;
- content merge map;
- analytics event list;
- accessibility test results;
- deployment instructions;
- rollback instructions;
- external-account checklist.

