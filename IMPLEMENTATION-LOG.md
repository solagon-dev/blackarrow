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
