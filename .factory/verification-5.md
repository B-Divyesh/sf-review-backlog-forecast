# Independent verification 5 — FAIL

**Work order:** `review-backlog-forecast-verify-5`  
**Candidate:** `3f6d0a456b27cc8a634d3df4f0bf849a972a2460`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-08-30 UTC  
**Verdict:** **FAIL — the deployed candidate is functional, but it does not satisfy the claims, routing, input-boundary, touch-target, metadata, and CLS requirements below.**

The previous deployment-only failure is resolved. Standard HTTPS works, and every checked live artifact byte-matches this candidate. No product code was changed during this verification.

## Release-blocking findings

### High — visitor-facing claims are missing from `.factory/claims.json`

The claims registry contains exactly four entries: hard session cap, summary CSV import, offline reload, and sample-data locality. Each has exactly one tagged test, and each behavior passed after the production build.

The live pages and README make additional concrete claims with no registry entry or dedicated sandbox test. Examples include:

- Landing page: `Preview only`, `No Anki access`, `Nothing is rescheduled here`, `The file is read in this browser and never uploaded`, JSON backup import, schedule export, data export, and local-data deletion.
- Privacy page: imported raw content is not retained; there are no third-party fonts, scripts, analytics, advertising, accounts, or runtime image-service calls.
- README: grouped `due_date` / `days_overdue` import, JSON backup restore, schedule CSV export, due-today priority, rollover visibility, and demo/real database isolation.

The existing `local-only` claim test only selects and saves the demo plan while checking request origins. It does not import a file, inspect retention, export/restore data, clear data, or prove the broader privacy statements. The supplied claims contract explicitly makes unlisted claim-like copy a failed review.

### Medium — unknown URLs return the home app with HTTP 200

`GET /definitely-missing-verifier-route` returned HTTP **200**, the home title, and the home h1. The styled `/404.html` exists, but the navigation fallback rewrites unknown paths to `/index.html` before the configured 404 response override can apply. This fails the required real 404 route and can cause incorrect indexing and misleading links.

### Medium — declared numeric upper bounds are accepted

The form uses `novalidate`, while `validateInput` checks only that the four count fields are non-negative integers. Live input `overdue=100001` was accepted and rendered a forecast even though the input declares `max="100000"`; `HTMLInputElement.validity.valid` was false. The same validation gap applies to the other count maximums, including `newCards max="10000"`. Invalid typed values must be rejected with the same focused, actionable recovery used for lower bounds.

### Medium — two mobile touch targets are narrower than 44 px

At a 390 × 844 viewport, the footer `Privacy` link measured **43 × 44 CSS px** and `Terms` measured **36 × 44 CSS px**. Hidden 1 × 1 radio inputs were excluded because their full policy-card labels are the interactive visual targets. All remaining visible controls met the baseline. The supplied accessibility contract requires touch targets of at least 44 × 44 px.

### Medium — the demo has repeatable layout shift above budget

Three fresh mobile Lighthouse 12.8.2 runs measured CLS **0.108804** each, above the required `< 0.1`. Lighthouse identified `main#main` as the shifted region when the demo forecast is inserted. The same runs scored Performance **93, 95, and 90**, Accessibility 100, Best Practices 100, and SEO 100; LCP was 1.09–1.29 s. The aggregate score passes, but the explicit CLS budget does not.

### Medium — required route metadata and shared site skeleton are incomplete

- The home document has no Open Graph or Twitter metadata and no 1200 × 630 social image.
- `/?demo=1` keeps the home title instead of a demo-specific title.
- Privacy and Terms use a reduced header/footer instead of the standard site header/footer.
- The main footer has no build/version identifier.

These are mandatory items in the supplied site-structure contract.

## Non-blocking deployment findings

- Static JS, CSS, images, and icons use `Cache-Control: public, must-revalidate, max-age=30`; assets are not content-hashed or long-lived immutable as required by the performance guidance. The worker itself correctly uses `no-cache`.
- `/manifest.webmanifest` is served as `application/octet-stream`, not `application/manifest+json`. Chromium nevertheless reported zero manifest errors and zero installability errors.
- After `npm ci` but before `npm run build`, the exact browser claim command timed out because Playwright starts `vite preview` while `dist/` does not exist. The documented full workflow builds first, after which all claim commands pass, but the claim commands are not independently runnable from a clean installed checkout.

## Mandatory first-read and demo check

**PASS.** A fresh browser saw:

- What: `Plan overdue reviews before changing cards.`
- Who: `For learners returning after missed days, compare capped recovery plans before changing an Anki queue.`
- First click: visible `Try it with sample data`, followed by `See a 320-card backlog plan. Nothing real is saved.`

One click opened `/?demo=1`, immediately populated 320 overdue / 48 due today / 36 daily due / 30-minute cap / 14-day deadline / six study days, rendered all three policies, and showed the persistent demo banner with Reset demo and Start for real.

## Claims and clean-checkout gates

| Check | Result | Evidence |
| --- | --- | --- |
| Install | PASS | `npm ci`: 59 packages installed; audit reported zero vulnerabilities. |
| `hard-session-cap` | PASS | `npm test -- -t @claim:hard-session-cap`: 1 passed. |
| `csv-import` | PASS after build | `npm run test:e2e -- --grep @claim:csv-import`: 2/2 desktop/mobile passed. |
| `offline-reload` | PASS after build | 2/2 desktop/mobile passed. |
| `local-only` | PASS after build | 2/2 desktop/mobile passed; only the app origin was observed. |
| Unit/integration | PASS | `npm test`: 12/12 passed. |
| Type check/build | PASS | `npm run build` ran `tsc --noEmit && vite build` and emitted `dist/`. |
| Lint | N/A | No lint script is defined. |
| Browser suite | PASS | `npm run test:e2e`: 22/22 passed across desktop and 390px projects. |

## Product exercise

- The live sample rendered three distinct plans. The visible 21-day sample schedule peaked at **19.8 minutes**, below the configured 30-minute cap; the calculated capacity was 150 cards.
- Arrow-key radio selection changed Deadline to Gentle and updated the detail heading. `Export schedule` downloaded `gentle-recovery-plan.csv` successfully.
- Minimum valid input (zero queue, 3 seconds/card, 5-minute cap, two-day deadline, one study day) produced `Already clear` and a 100-card capacity.
- Invalid lower bounds produced a focused alert naming overdue count, seconds/card, cap, deadline, and study-day corrections. Unsupported columns and `2026-02-31` produced actionable CSV errors. Corrected input recovered normally.
- The over-maximum count path failed as documented above.

## Accessibility, privacy, PWA, and browser behavior

- `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, descriptive title, `lang=en`, one h1, main landmark, no missing image alt text, no unnamed buttons, and no console/page errors.
- Independent Axe WCAG 2 A/AA and WCAG 2.1 AA scans of the populated desktop and 390px demo found **zero violations**, including zero serious/critical findings.
- Keyboard Tab/Enter exposed the skip link and moved focus to `main`; ArrowRight changed the policy radio; no trap was observed. Focus indicators were visible.
- Under `prefers-reduced-motion: reduce`, root scrolling became `auto` and transition/animation durations became `0.01ms`.
- At 390px, `scrollWidth` equalled `innerWidth` (390px); the interface had no page-level horizontal overflow. Visual inspection found the full forecast usable.
- Normal, invalid, export, mobile, and offline paths emitted no console errors or uncaught page errors.
- The live demo request log contained only `https://review-backlog-forecast.sociobot.in`. No API or server-side endpoint exists, so rate-limit and Entra sign-in checks are not applicable.
- A fresh service-worker context was controlled by an activated worker with `rbf-v1.0.2-shell`; offline reload retained the title, h1, sample results, and `Offline · forecast still works`. The committed isolated update test also passed on desktop and mobile.
- Live responses include HSTS, CSP with `frame-ancestors 'none'`, Permissions-Policy, `nosniff`, strict referrer policy, and `X-Frame-Options: DENY`.

## Performance and live identity

- Initial transfer was **45 KiB**. App JS is 19,032 B raw / 7,457 B gzip, CSS 22,256 B raw / 5,433 B gzip, and the mobile hero is 26,300 B. All size budgets pass; no web fonts are fetched.
- Three mobile Lighthouse runs: Performance 93/95/90, Accessibility 100/100/100; FCP 0.93–1.12 s, LCP 1.09–1.29 s, TBT 166–306 ms, CLS 0.108804 in every run.
- SHA-256 matched between local `dist/` and production for root HTML, app JS/CSS, legal CSS, both hero images, all icons, manifest, service worker, privacy, terms, offline, 404, robots, and sitemap. Root matched at `6d92920d035105209315926f882f7d2d31bac08d223ba40c1a742a0c5c5799ee`.

## Required next work

1. Register and test every visitor-facing claim, especially import privacy, backup/export/clear behavior, Anki isolation, and documented import variants.
2. Enforce numeric maximums in custom validation and add browser tests.
3. Make unknown routes serve the styled 404 with status 404.
4. Expand the two footer link hit areas to at least 44 × 44 px.
5. Reserve demo result space or render its initial state without the measured CLS.
6. Add route-specific demo/social metadata, consistent legal-page chrome, a social image, and build identity.
7. Content-hash static assets, apply immutable caching, and serve the manifest with its standard MIME type.
