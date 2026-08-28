# Handoff — Review Backlog Forecast v1

## Current independent release status — FAIL

**Candidate tested:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`
**Live URL tested:** <https://review-backlog-forecast.sociobot.in/>
**Verification:** 2026-08-28 UTC, `.factory/verification-3.md`

The earlier deployment/TLS problem is resolved: the live app byte-matches the candidate and its live offline reload works. It is nevertheless **not release-ready**. Independent QA found three medium-severity contract failures:

1. Impossible CSV calendar dates (for example `2026-02-31`) are accepted and silently normalized.
2. The two help buttons are 30 × 30 px instead of the required 44 × 44 px touch targets.
3. Activating the keyboard skip link leaves focus on `BODY`, not in main/forecast controls.

Fresh evidence: `npm ci`, `npm test` (11/11), exact `npm run build`, and `npm run test:e2e` (10/10) pass; live Lighthouse scores are 100/100/100/100. See the verification report for reproduction, PWA update/offline evidence, bundle sizes, privacy/outbound-request checks, response headers, and required fixes.

## Independent verification status: **FAIL — do not release**

**Candidate tested:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`
**Required URL:** `https://review-backlog-forecast.sociobot.in/`
**Verified:** 2026-08-27 UTC

The clean local candidate builds and its unit/browser checks pass, but the required production URL is not usable: Chromium reports `ERR_CERT_COMMON_NAME_INVALID`; normal curl rejects the certificate; and an insecure diagnostic request to `/` receives Azure `404 Site Not Found`, not the app. The deployment does not establish a match to the candidate and cannot be released.

Additional medium-severity accessibility defect: the two mobile help (`?`) buttons measure 30 × 30 CSS px, below the required 44 × 44 px touch target.

See `.factory/verification.md` for exact commands, local behavioral evidence (including offline reload and service-worker update), bundle/Lighthouse results, privacy/outbound-request checks, and all remediation steps. This verifier status supersedes the builder-reported verification notes below.

## What shipped

- A complete import-and-preview recovery planner with **Steady**, **Deadline**, and **Gentle** policies.
- Manual queue inputs plus two CSV shapes: one-row totals and one-card/group-per-row `due_date` or `days_overdue` imports.
- A hard minute cap in the forecast engine. Due-today and estimated regular reviews use capacity before overdue cards; regular rollover stays visible instead of being hidden.
- Plan comparison, 21-day visual plot, up to 60 days of accessible daily ledger detail, half-queue/finish estimates, deadline feasibility warnings, schedule CSV export, and clear non-guarantee language.
- IndexedDB persistence for inputs and the selected plan, reversible plan replacement, JSON data export/restore, and confirmed local-data deletion.
- Installable local-first PWA with a versioned service worker, deterministic precached app shell, cache-first same-origin assets, offline fallback, update prompt, 192/512/maskable icons, and matching splash colors.
- Responsive 390px and keyboard layouts, designed focus states, reduced-motion fallback, semantic structure, one H1, alt text, live validation/status, and a keyboard-focusable wide ledger.
- Privacy and terms pages, README, MIT license, robots.txt, and sitemap.
- Product-specific mid-century instrument-panel system and generated-asset provenance in `.factory/design.md`. The original source is retained in `assets/src/`; shipped WebP files are 26 KB and 67 KB.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The deploy command is exactly `npm run build`. It produces `dist/index.html`, `dist/privacy/index.html`, and `dist/terms/index.html`.

Builder-reported verification on 2026-08-27 (superseded by the independent FAIL above):

- `npm test`: 11/11 unit tests passed.
- `npm run build`: passed; initial app JavaScript 18.21 KB raw / 7.22 KB gzip, CSS 21.56 KB raw / 5.36 KB gzip.
- Playwright Chromium: desktop and 390×844 mobile flows passed for forecast creation, policy selection, CSV import, IndexedDB persistence, viewport overflow, and interactive offline reopen after first visit.
- Axe via Playwright: no serious or critical WCAG 2/2.1 A/AA violations in the populated application on desktop or mobile.
- Factory `verify-url.sh`: HTTP 200, title and `lang`, one H1, main landmark, all images with alt, all buttons labelled, and no console errors.
- Lighthouse 12.8.2, mobile defaults against the production preview: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.2 s**, TBT **0 ms**, CLS **0**, Speed Index **0.9 s**.
- Production asset checks: mobile hero 26,300 bytes; large hero 67,352 bytes; no runtime CDN requests.

## Known boundaries

- This models counts, not card identities or future Anki/FSRS intervals. It intentionally cannot open `.apkg`/collection databases or reschedule cards.
- For card-row imports, future-due rows are divided across 28 days to propose an editable daily-due estimate. The UI labels that value as an estimate.
- Forecasts extend up to 730 days. The on-screen ledger is capped at 60 days for usability; the exported schedule contains at least 28 days and continues through the projected finish when it falls within the model horizon.
- No analytics or page counter is included. The product is free and has no billing integration.

## Suggested next steps

- Pilot with returning learners and measure the brief’s 14-day queue-reduction outcome.
- If pilots need greater precision, add an optional histogram import for future due counts without accepting collection credentials or writing back to Anki.

## Independent verification 2 — 2026-08-28 UTC — FAIL

Candidate verified: `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8` at `https://review-backlog-forecast.sociobot.in/`.

The previously reported TLS/deployment failure is repaired: standard TLS validates and the live shell, JS, CSS, worker, manifest, offline page, and legal pages byte-match the clean candidate build. `npm ci`, 11 unit tests, the TypeScript production build, all 10 Playwright desktop/mobile tests (after installing the lockfile's Chromium), live axe serious/critical checks, offline reload, service-worker update prompt, and a live Lighthouse mobile run all passed. Lighthouse reported 100/100/100/100 (Performance/Accessibility/Best Practices/SEO), LCP 1.1 s, TBT 80 ms, and CLS 0.

**Do not release this candidate.** Independent QA found three medium defects: impossible numeric `due_date` CSV values such as `2026-02-31` are silently accepted and misclassified; both help controls are 30 × 30 px rather than the required 44 × 44 px; and the skip link does not transfer keyboard focus into main content. Details and reproducible evidence are in `.factory/verification-2.md`. Live static files also use 30-second revalidating caching rather than immutable hashed-asset caching; CSP and Permissions-Policy are absent (hardening follow-up).
