# BlackArrow Website — Implementation Log

This log records completed work, decisions and rationale, files changed, tests and
results, redirects/content merges, before/after measurements, remaining risks,
external dependencies, and business input still required. It is maintained
continuously per Section 20 of `BLACKARROW-WEBSITE-IMPLEMENTATION-PLAN.md`.

Dates use the project clock. Work started 2026-07-23.

---

## Checkpoint 1 — Repository recovery & clean baseline

### 1a. Repository integrity recovery (Preflight, Plan §3)

**Cause of the repository issue (determined).** A FUSE-based filesystem/sync event
zeroed out a set of files in place: it created dot-prefixed temporary copies
(`.name.XXXXXX`, six random chars) and `.fuse_hidden*` orphan inodes, and in the
process left both the temp copies **and** several live files as all-zero bytes.
This damaged:

- **Working tree:** `app/page.tsx`, `app/layout.tsx`, `public/robots.txt` were
  missing; their dot-prefixed temp copies existed but were 100% null bytes.
- **Git object store:** ~82 loose objects were replaced by all-zero dot-prefixed
  temp files (164 temp files, 2 per object), so `git status` failed with
  `fatal: unable to read tree (5753…)`.
- **Git index:** `.git/index` was emptied (0 tracked entries), so every tracked
  file appeared "deleted" and every on-disk file appeared "untracked".
- **Stale locks:** `.git/index.lock` and `.git/objects/maintenance.lock`
  (0 bytes, dated Jun 1) from an earlier crashed git process.
- **~84 MB** of `.fuse_hidden*` orphans under `public/images` and
  `public/images/staff` (22 files).

**Recovery method (least-destructive, evidence-based).**

1. Confirmed `origin` (`github.com/stonebaldwin/blackarrow`) was reachable and its
   `main` pointed at exactly our local HEAD `33f4000`. GitHub was therefore a
   complete, authoritative source for every object.
2. Verified the dot-prefixed temp files were unrecoverable (all-zero, failed zlib
   decompression) — so they were **not** used as a recovery source.
3. Recovered the object database **additively**: bare-cloned origin into the
   scratchpad and copied its single packfile into `.git/objects/pack/`. No existing
   object or working-tree file was modified or deleted by this step.
4. Removed the two stale `*.lock` files (no git process was running).
5. Rebuilt the index with `git reset --mixed HEAD` (index only; working tree
   untouched). This revealed the true diff: only the 3 zeroed files were missing.
6. **Byte-for-byte comparison** (Plan §3.2.4–5): the dot-prefixed temp copies of
   `page.tsx`/`layout.tsx`/`robots.txt` were confirmed all-zero via null-byte
   counts — i.e. corruption artifacts, **not** uncommitted user work. No unknown
   work existed to preserve, so the stop condition (§3.3) was not triggered.
7. Restored the 3 files from HEAD (`git checkout HEAD -- …`) and verified each
   on-disk SHA-256 matches its committed blob.
8. Removed the corruption artifacts: 6 working-tree temp copies, 22 `.fuse_hidden*`
   files, 164 zeroed `.git/objects/**` temp files.

**Verification.**

- `git fsck --full --strict` → clean (no output).
- `git status` → clean; branch up to date with `origin/main`.
- `git diff HEAD --name-only` → **0 files** (every tracked file matches its
  committed blob exactly — no silent corruption remains).
- `.gitignore` already contained a `.fuse_hidden*` rule (FUSE artifacts won't be
  committed if they reappear).

**Files preserved:** all tracked files (working tree now matches origin/main
exactly). No user commits or history were altered. **No destructive git operation
was used** (no hard reset, no history rewrite, no forced deletion of uncertain
files).

**Clean baseline commit/source:** `origin/main @ 33f4000e86d0…` ("SEO: add IndexNow
integration").

**Local-data limitation:** the local databases are not production data. Root
`data.db` is 0 bytes; `data/blackarrow.db` is a small local SQLite dev DB.
Production uses Neon Postgres via `DATABASE_URL` (`.env.local`). The empty local
DB was **not** treated as production data. Blog content (51 posts) is served from
Neon and rendered successfully during the production build.

### 1b. Clean baseline validation (Plan §3.2.13)

| Check | Command | Result |
|---|---|---|
| Dependency install | `npm ci` | ✅ exit 0 (12 npm-audit advisories noted, non-blocking) |
| TypeScript | `tsc --noEmit` | ✅ no errors |
| Lint | `npm run lint` | ✅ 0 errors, 28 warnings (all `@next/next/no-img-element` — Phase 9) |
| Production build | `next build` | ✅ success — 1 static home, 26 `/[slug]` SEO pages, 22 `/insurance/[slug]`, 4 `/locations/[slug]`, 51 `/post/[slug]`, API routes, middleware |
| Unit tests | `vitest run` | ✅ harness added; baseline test passes (none existed before) |

**Route smoke test** (production server, `next start`): all primary routes → `200`
except `/insurance` → **404** (the insurance hub does not yet exist — a known Plan
§7.1 deliverable, not a regression). 404 page, `robots.txt`, `sitemap.xml` all serve
correctly. Article and SEO-variant routes → `200`.

### 1c. Test framework added

No test framework existed. Added **Vitest 2** + Testing Library (jsdom) for the
lead-delivery, validation, redirect, schema, and component tests the plan requires.

**Files changed in Checkpoint 1:**

- `package.json` — added `typecheck`, `test`, `test:run` scripts; added devDeps
  (vitest, @testing-library/*, jsdom).
- `package-lock.json` — lockfile update for the above.
- `vitest.config.ts` (new) — node default env, `@/` alias, hermetic env.
- `test/setup.ts` (new) — jest-dom matchers.
- `test/baseline.test.ts` (new) — harness sanity check.
- `IMPLEMENTATION-LOG.md` (new) — this log.

**Tests performed:** `vitest run` → 1 file, 1 test passing.

**Remaining risks:** npm-audit advisories in the dependency tree (mostly dev/build
chain); to be reviewed but non-blocking for local work.

**External dependencies / business input:** none required for this checkpoint.

---

## Checkpoint 2 — Phase 0: Accuracy & lead-safety remediation

### What changed & why

**§4.1 NC auto minimums (regulated).** Corrected every obsolete 30/60/25 statement
to the current **$50,000 / $100,000 / $50,000** limits, stating the *effective date*
(policies issued/renewed on or after **July 1, 2025**) so pages stay historically
intelligible, and noting UM/UIM is now included. Verified figures against NCDOI.
The universal "we recommend 100/300/100" advice was reframed as a discussion point
("many drivers choose higher limits… an agent can help you weigh"), not individualized
advice. 5 statements fixed across `lib/insurance-data.ts` and
`lib/service-location-data.ts`. Legitimate non-auto uses of these numbers (ECU's
~30,000 students; renters $25k–$50k contents) were deliberately left untouched.

**§4.2 Workers' compensation (regulated).** Verified rules against the NC Industrial
Commission. Removed the recurring overstatement that "any construction contractor
with even one employee must carry coverage" — the real rule is the **three-employee
threshold applies to construction too**, plus a separate *liability* exposure when a
business uses an uninsured subcontractor. Softened specific penalty figures
("$50–$100/employee/day") to general penalty language, added "general information,
not legal advice" + NCIC referral. Fixed the Greenville/Wilmington/Jacksonville WC
service pages, the statewide WC page FAQs, and the AI blog-topic brief that would
have propagated the error into future posts.

**§4.3 Claims-and-facts registry.** New `lib/business-facts.ts` is the single source
of truth: founding year (standardized on **2002**; fixed the lone "2003" in the quote
sidebar), offices (NAP/hours), carrier count (flagged `verified:false`), service
areas, location-aware phone helper, and the NC auto/WC regulated facts with source
URLs and `lastReviewed` dates. Prohibited-claims checklist included.

**§4.4 Unsupported claims.** Removed/qualified: "largest insurance agency in
Greenville" (×2), "serving thousands of clients", "best rate/price/most favorable
terms" (×9 across pages, components, data), "same-day quotes / free quote in minutes"
(×6), "encrypted and secure / we never sell your data" (now an accurate secure-
connection statement linking the Privacy Policy), and precise premium ranges
(×11 flood/renters/business/WC FAQs → factor-based guidance + "we'll give you an
accurate quote"). Response-time promise on the quote success screen softened
(no unverified SLA).

**§4.5 Form-delivery semantics (lead safety) — the critical fix.** `app/api/forms/route.ts`
rewritten. Previously it **always returned `success:true`** even when storage AND
email both failed. Now:
- typed **zod** schema validation (`lib/forms-schema.ts`) with per-field length caps,
  a 100 KB body cap, and a required contactable identity (email or phone);
- **reCAPTCHA** verified;
- **per-IP rate limiting** (`lib/rate-limit.ts`, in-memory — caveat documented);
- **idempotency** via client key (`lib/use-form-submit.ts` generates a stable key,
  reset only after success) + a unique index; unique-violation races treated as
  duplicates, not failures;
- durable **storage** attempted first (source of truth), then **notification**;
- response contract: **200** stored+notified · **202** exactly one durable path
  (stored-not-notified or notified-not-stored) · **503** both failed (no false
  success) · 400/403/429/413 for validation/recaptcha/rate/oversize;
- **PII-safe structured logs** (submission id, form type, statuses, timestamps — never
  form contents); `alert`-level logs for stored-not-notified, notified-not-stored,
  and lost leads.

**§4.6 Lead reconciliation.** `form_submissions` extended with
`notification_status / notification_id / notification_error / notification_attempts /
idempotency_key / content_hash / updated_at` (safe `ADD COLUMN IF NOT EXISTS`
migration). New reconciliation queries + a CRON_SECRET-protected retry job
(`app/api/cron/retry-notifications`) that re-sends undelivered notifications and
updates status — so a lead is never lost because email was down at submit time.

### Files affected

- Data/content: `lib/insurance-data.ts`, `lib/service-location-data.ts`,
  `lib/location-data.ts`, `lib/team-data.ts`, `lib/auto-post-topics.ts`,
  `app/page.tsx`, `app/our-story/page.tsx`, `app/locations/page.tsx`,
  `app/insurance/[slug]/page.tsx`, `components/layout/Footer.tsx`.
- New: `lib/business-facts.ts`, `lib/forms-schema.ts`, `lib/rate-limit.ts`,
  `lib/use-form-submit.ts`, `app/api/cron/retry-notifications/route.ts`,
  `test/forms-route.test.ts`.
- Changed: `app/api/forms/route.ts` (rewrite), `lib/db.ts` (schema + functions),
  `app/contact/page.tsx`, `app/quote/page.tsx` (+layout), `app/change-mortgagee/page.tsx`,
  `app/loan-number-change/page.tsx` (hook + accessible error regions).

### Tests performed & results

- `vitest run` → **14 passing** (13 lead-delivery + 1 baseline). Covers every
  storage×notification outcome, idempotency (client key + race), schema rejection,
  reCAPTCHA fail, rate-limit 429, and the **no-PII-in-logs** guarantee.
- `tsc --noEmit` clean · `eslint` 0 errors · `next build` succeeds.

### Acceptance criteria (§4.7) — met

- ✅ DB failure + email failure no longer produces a false success (→ 503).
- ✅ Email failure preserves the stored lead and records an observable `failed` status.
- ✅ A duplicate retry (same idempotency key) creates no second notification.
- ✅ Client success copy is accurate (2xx = received; 503 = try again / call us).
- ✅ Errors announced accessibly (aria-live regions on all four forms).
- ✅ No secret/policy/loan number or full payload in ordinary logs (tested).

### Remaining risks / follow-ups

- Rate limiter is per-instance on serverless — fine as a first line with reCAPTCHA;
  a global limiter (Upstash/Redis) is a documented future enhancement.
- The retry cron endpoint exists but is **not yet wired to a Vercel Cron schedule**
  (`vercel.json` crons are intentionally empty per prior build-unblock commit) — add a
  schedule when ready, or invoke manually.
- "20+ carriers" retained (business-supplied) but flagged `verified:false` — needs an
  exact count + verification date.

### Business input required (surfaced, not invented)

- Confirm founding year **2002**. Confirm exact **carrier count**. Approve a
  **response-time** promise (currently no SLA stated). Confirm whether any
  client-count/size claims can be substantiated. Name the **reviewer** for regulated
  (insurance/legal) content.

---

## Pending business inputs (running list — Plan §18)

These will be filled in as phases surface them. None block Checkpoint 1.

- Authoritative founding year (2002 vs 2003 conflict — to resolve in Phase 0).
- Exact carrier count; whether "largest agency"/client-count claims are substantiable.
- Approved response-time promise; phone-routing rules per office.
- Verified licenses, staff bios, review counts + permission to republish.
- Analytics / Search Console / Bing IDs; desired consent model; lead-data retention.
- Who reviews regulated (insurance/legal) content.
- Old-domain (`blackarrowfg.com`) DNS/Squarespace access; GSC/Ahrefs/GBP access.
- New staff/office/local photography availability.
