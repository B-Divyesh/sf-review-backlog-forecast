# Independent verification 2 — FAIL

**Work order:** `review-backlog-forecast-verify-2`  
**Candidate:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`  
**Tested URL:** `https://review-backlog-forecast.sociobot.in/`  
**Verified:** 2026-08-28 UTC  
**Verdict:** **FAIL — do not release until the medium-severity defects below are corrected.**

The earlier deployment-only failure is no longer present. A standard TLS connection now validates for the production hostname and the live HTML, JS, CSS, service worker, manifest, offline page, and legal pages byte-match a clean production build of the candidate. The candidate nevertheless misses required keyboard/touch and invalid-input behaviour for this product.

## Release-blocking defects

### Medium — malformed calendar dates are accepted as valid card imports

`parseCardCsv` accepts syntactically numeric but impossible `due_date` values because JavaScript normalizes them rather than rejecting them. For example, the actual UI accepted this CSV:

```csv
due_date
2026-02-31
```

It announced `Read 1 card rows: 1 overdue and 0 due today` instead of the documented actionable invalid-date error. `2026-13-01` and `2026-00-00` are accepted too. That silently changes an import's queue counts and violates the brief's requirement for understandable, reversible input recovery. Validate the parsed year/month/day round-trip before classifying each row, add unit and browser coverage, and reject impossible dates.

### Medium — the two information controls fail the required 44 × 44 px mobile touch target

At both desktop and 390 px mobile, `About overdue cards` and `About cards due today` measure **30 × 30 CSS px**. The product/design/accessibility contract requires at least 44 × 44 px controls. Expand the actual interactive hit area while retaining the compact visual marker.

### Medium — the skip link does not move keyboard focus into main content

The visible `Skip to forecast controls` link points at `<main id="main">`, which is not focusable. In a keyboard-only browser check, Enter on the focused skip link left `document.activeElement` outside `#main`; keyboard users must still tab through header controls instead of landing at the forecast controls. Make the target programmatically focusable and move focus to it, then cover that path in browser tests.

## Clean-checkout build and automated tests

The candidate was tested from a new detached worktree:

```sh
git worktree add --detach <temp> 81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8
cd <temp>
npm ci
npm test
npm run build
npx playwright install chromium
```

| Check | Result | Evidence |
| --- | --- | --- |
| Dependency install | PASS | `npm ci` installed 58 packages; audit reported 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 11/11 passed. |
| Type check / production build | PASS | `npm run build` runs `tsc --noEmit && vite build` and completed successfully. No separate lint script exists. |
| Browser suite | PASS | All 10 committed Playwright tests passed (desktop and 390 × 844 mobile). The pinned Playwright Chromium was installed because the preinstalled browser revision did not match the lockfile. Runs covered forecast/persistence, CSV summary import, axe, mobile overflow, and offline reload. |
| Bundle budget | PASS | Initial `app.js`: 18,211 B raw / 7,220 B gzip; `app.css`: 21,558 B raw / 5,360 B gzip; mobile hero: 26,300 B. All are below 200 KB JS, 50 KB CSS, and 300 KB hero budgets. |
| Lighthouse, production URL | PASS | Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 80 ms, CLS 0. |

## Independent product and browser exercise

- **Normal case:** loaded the supplied 320-overdue / 48-due-today example, ran all three policies, selected Deadline by keyboard with Space, and confirmed day one protects 48 regular cards before 27 overdue cards (`48 + 27 = 75`, 15 minutes). The 30-minute, 12-seconds/card capacity correctly reads 150 cards.
- **Boundary and recovery:** a 5-minute / 3-seconds-per-card, zero-queue, two-day, one-study-day input ran successfully with a 100-card capacity. Invalid `overdue=-1` and `seconds/card=2` focused the alert and produced actionable messages; correcting values rendered the forecast. The malformed-date CSV defect above is the failed recovery path.
- **Desktop and 390 px mobile:** both viewports had no page-level horizontal overflow (390 px document width at the mobile viewport). The intentional policy/ledger internal scrolling remained usable.
- **Keyboard/focus:** policy selection by Space worked and the skip link has a visible 3 px outline, but its target-focus failure is recorded above. No modal or tab trap was encountered.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, `scroll-behavior` was `auto` and nonzero transitions were reduced to `0.01ms`.
- **Accessibility:** the live populated state has `lang=en`, a descriptive title, one `h1`, a `main` landmark, labels, and image alt text. Axe WCAG 2/2.1 A/AA found zero serious or critical violations on desktop and 390 px mobile. Axe does not catch the manual hit-target or skip-target defects.
- **Errors and privacy:** local and live normal flows produced no console errors or `pageerror` events. Observed browser request origins were only the app's own origin. Static inspection found no analytics, beacon, third-party font/script, account, sync, or API request. Inputs and chosen plans are IndexedDB-only; export/import and clear-data controls are available.
- **PWA:** the live service worker controls the page. After first load, a Playwright offline reload preserved the app shell and heading. In an isolated static-server update exercise, serving `rbf-v1.0.2` after `rbf-v1.0.1` caused the in-app `A new version is ready.` prompt and created the new versioned shell cache. The worker precaches the shell and is able to update without data sync.

## Live deployment, identity, headers, and caching

The repaired deployment is the candidate:

- Normal TLS validates with `CN` and SAN `review-backlog-forecast.sociobot.in` (valid 2026-08-27 through 2027-02-27).
- `GET /` returned HTTP 200 and its SHA-256 exactly matched local `dist/index.html`: `12cd57587c99de7f41c77fa8d89f6f9b884fa451c6ad2ebccdfb900d132382bf`.
- SHA-256 values for live `assets/app.js`, `assets/app.css`, `sw.js`, `manifest.webmanifest`, `offline.html`, `/privacy/`, and `/terms/` each exactly matched the local candidate files. Live browser navigation also had no 4xx/5xx responses.
- Responses include HSTS, `nosniff`, and `strict-origin-when-cross-origin`; no Content-Security-Policy or Permissions-Policy header was supplied. This is recorded for hardening, not counted as a release-blocking defect in the stated contract.
- All checked static files use `Cache-Control: public, must-revalidate, max-age=30`. This is functional with the versioned service worker, but it does not meet the attached performance guidance for immutable, long-lived hashed assets; address it as deployment/performance follow-up.

## Required re-verification

1. Reject impossible `due_date` values instead of allowing JavaScript date normalization, with unit and UI tests.
2. Give the two help buttons at least 44 × 44 px actual hit areas.
3. Make the skip target focusable and assert keyboard focus reaches it.
4. Rebuild/redeploy and rerun mobile keyboard, touch-target, malformed-import, offline, and live identity checks. Consider hashed immutable static assets and CSP/Permissions-Policy hardening in the same deployment pass.
