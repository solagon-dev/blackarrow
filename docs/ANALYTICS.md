# Analytics & Attribution

How measurement works on the BlackArrow site (Plan §5). The goal is a clean,
consent-aware baseline with **no PII** in analytics and **no hardcoded
credentials**.

## Providers

| Provider | Cookies? | Configured by | Notes |
|---|---|---|---|
| Ahrefs Web Analytics | No (cookieless) | `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY` (defaults to live key) | Loaded in production only. Needs no consent. |
| Google Analytics 4 | Yes | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional. Loaded **only after consent** (banner) unless `NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=false`. |

Analytics runs **only in production** (`NODE_ENV=production` and, on Vercel,
`VERCEL_ENV=production`). Dev and preview never send data to production
(`lib/analytics-config.ts`).

## Environment variables

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 id (`G-…`). Empty → GA disabled. |
| `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY` | Ahrefs key (public). |
| `NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT` | `false` to skip the consent gate for GA. |
| `NEXT_PUBLIC_VERCEL_ENV` | Client mirror of `VERCEL_ENV` (set to `$VERCEL_ENV`). |
| `GOOGLE_SITE_VERIFICATION` | Search Console `<meta>` verification token. |
| `BING_SITE_VERIFICATION` | Bing Webmaster `<meta>` verification token. |

## Event dictionary

Fire events through the typed helpers in `lib/analytics.ts` (`analytics.*`) — never
call a vendor API directly. All params are sanitized: PII-looking values (emails,
phone numbers) are dropped and strings are truncated to 100 chars.

| Event | Helper | Params | Fired when |
|---|---|---|---|
| `page_view` | `analytics.pageView(path)` | `page_path` | Every route change |
| `phone_click` | (delegated) | `office`, `page_path` | Any `tel:` link click |
| `email_click` | (delegated) | `office` | Any `mailto:` link click |
| `directions_click` | (delegated) | `office` | Any maps/directions link click |
| `quote_start` | `analytics.quoteStart(coverage?)` | `coverage?` | Quote flow begins |
| `quote_step_complete` | `analytics.quoteStepComplete(step, coverage?)` | `step`, `coverage?` | A quote step is completed |
| `quote_validation_error` | `analytics.quoteValidationError(step, field?)` | `step`, `field?` | Client validation fails |
| `quote_submit` | `analytics.quoteSubmit(coverage?)` | `coverage?` + attribution | Quote submitted (2xx) |
| `contact_submit` | `analytics.contactSubmit()` | attribution | Contact submitted (2xx) |
| `policy_management_submit` | `analytics.policyManagementSubmit(kind)` | `kind` | Mortgagee/loan form submitted (2xx) |
| `claim_outbound_click` | `analytics.claimOutboundClick(carrier)` | `carrier` | File-a-claim carrier link |
| `article_cta_click` | `analytics.articleCtaClick(target, article)` | `target`, `article` | Article → money-page CTA |

`phone_click` / `email_click` / `directions_click` are captured by one delegated
click listener in `components/analytics/AnalyticsProvider.tsx`, so new links are
tracked automatically without per-link instrumentation.

## Campaign attribution (Plan §5.1)

- The edge middleware **no longer strips** `utm_*` / click-ID params. Duplicate
  content for parametered URLs is handled by the per-page canonical tags.
- On first load, `components/analytics/AnalyticsProvider.tsx` calls
  `captureAttribution()` which stores the campaign params in a first-party
  `ba_attribution` cookie (**first-touch wins**, 90-day expiry), then cleans the
  visible URL via `history.replaceState`.
- Conversion events (`quote_submit`, `contact_submit`) automatically include
  `source` / `medium` / `campaign` / `landing_path` from that cookie.
- Verified end-to-end: a `?utm_source=…&gclid=…` visit records attribution in the
  cookie and the address bar is cleaned to the canonical path.

## Consent (Plan §5.4)

`ba_consent` cookie = `granted` | `denied`. The banner
(`components/analytics/ConsentBanner.tsx`) appears **only** when GA4 is configured
and consent is unset — we never show a banner that controls nothing. The privacy
policy describes analytics, attribution, reCAPTCHA, form storage/email, and
retention to match this implementation.
