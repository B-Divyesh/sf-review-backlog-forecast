# Independent verification 4 — FAIL

**Work order:** `review-backlog-forecast-verify-4`  
**Candidate:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`  
**Required URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-08-28 UTC  
**Verdict:** **FAIL — do not release until the three medium defects below are fixed and independently reverified.**

This was a clean, detached checkout of the requested candidate followed by fresh local and live-browser evidence. The deployment-only failure reported previously is resolved: standard HTTPS works and the live artifact byte-matches the candidate. The product is nevertheless not release-ready because it still fails the supplied invalid-input, touch-target, and keyboard-only requirements.

## Release-blocking defects

### Medium — impossible calendar dates are silently accepted

At the live URL, importing this card-row CSV did not report a date error:

```csv
due_date,count
2026-02-31,1
```

Instead the UI announced: `Read 1 card rows: 1 overdue and 0 due today. Add your usual daily due estimate.` JavaScript normalizes February 31 before the parser classifies it. This silently changes a learner's forecast and is incompatible with the product's recovery-transparency purpose. Reject dates whose parsed year, month, and day do not equal the supplied `YYYY-MM-DD`, and add parser and browser coverage.

### Medium — help controls fail the 44 px touch-target requirement

At a 390 × 844 mobile viewport, both `About overdue cards` and `About cards due today` buttons measured **30 × 30 CSS px**. The attached accessibility/product contract requires every touch target to be at least 44 × 44px. Keep the compact visual marker if desired, but enlarge the actual button hit area.

### Medium — skip link does not transfer keyboard focus to main content

Keyboard Tab reached `Skip to forecast controls` and Enter changed the location hash to `#main`, but the active element became `BODY` because `<main id="main">` is not focusable. Keyboard users do not receive the promised focus handoff. Make the destination programmatically focusable and explicitly transfer focus, with an E2E assertion.

## Clean-checkout quality gates

The candidate was tested in a new detached worktree at the exact SHA:

```sh
git worktree add --detach <temporary-worktree> 81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8
cd <temporary-worktree>
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

| Check | Result | Fresh evidence |
| --- | --- | --- |
| Install | PASS | `npm ci` installed 58 packages and reported 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 11/11 tests passed. |
| Type check / production build | PASS | `npm run build` ran `tsc --noEmit && vite build` and emitted `dist/`. No lint script is defined. |
| Repository browser suite | PASS | `npm run test:e2e`: all 10 desktop and 390px-mobile tests passed. The initial invocation could not find the lockfile's Playwright Chromium; after `npx playwright install chromium`, the unchanged suite passed. |
| Bundle budgets | PASS | `app.js` 18,211 B raw / 7,220 B gzip; `app.css` 21,558 B raw / 5,358 B gzip; mobile hero WebP 26,300 B. Each is under its stated budget. |
| Live mobile Lighthouse | PASS | Lighthouse 12.8.2: Performance 100, Accessibility 100; LCP 1.1s, CLS 0, TBT 0ms, interactive 1.1s. |

## Product, accessibility, and privacy exercise

- **Normal path:** loaded the example, ran the forecast, selected Deadline, saved it, undid the save, and verified the 21-row ledger. The observed maximum was 99 cards, below the calculated 150-card cap (30 minutes at 12 seconds/card).
- **Invalid/recovery paths:** negative overdue count and a 2-second time estimate produced a focused alert naming both corrections. Unsupported CSV and invalid backup JSON gave actionable messages; valid `days_overdue,count` rows imported 5 overdue and 2 due-today cards. The impossible-calendar-date case above is the failed recovery path.
- **Persistence and reversibility:** the repository E2E suite saved a plan in IndexedDB and restored it after reload. Local backup export/restore, plan undo, schedule export, and confirmed local-data deletion are exposed. The app does not read, modify, authenticate to, or sync with Anki.
- **Desktop / mobile:** at 390px, document `scrollWidth` equalled `innerWidth` (390); controls measured 52–56px except the two failed help buttons. Visual inspection found the small-screen forecast readable, with internal ledger scrolling contained.
- **Keyboard / focus / motion:** native policy radios work by keyboard and focused controls use a visible 3px outline. Under reduced motion, computed policy-card transition duration was `0.00001s`. The skip-link failure above remains.
- **Accessibility:** the populated live app has `lang=en`, one `h1`, a title, `<main>`, labelled fields, alt text, and no axe WCAG 2/2.1 A/AA violations (zero total, including serious/critical).
- **Privacy / errors:** local and live normal, invalid, mobile, and offline paths produced no console or page errors. Captured live browser requests were same-origin only; source and request inspection found no analytics, beacons, third-party fonts/scripts, credentials, or API calls. Inputs and plans are IndexedDB-only.

## PWA, live identity, and response policies

- **Offline:** after the live page became service-worker controlled, `context.setOffline(true)` followed by reload displayed the app heading and allowed a new forecast.
- **Update:** an isolated static-server test of the exact `dist/` artifact changed only worker version `rbf-v1.0.1` → `rbf-v1.0.2`. The UI showed `A new version is ready.`; clicking Update left a controlling worker in `activated` state, with no console errors.
- **Live identity:** SHA-256 equality was verified for `/`, app JS/CSS, service worker, manifest, both hero WebPs, privacy, and terms pages. For example, local and live `/` were both `12cd57587c99de7f41c77fa8d89f6f9b884fa451c6ad2ebccdfb900d132382bf`.
- **Installability:** live Chromium reported no manifest or installability errors, despite the deployment serving the manifest as `application/octet-stream`.
- **Headers / caching:** live responses are HTTPS 200 with HSTS, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. They use `Cache-Control: public, must-revalidate, max-age=30`; CSP, Permissions-Policy, and frame-ancestors/clickjacking protection are absent. These are deployment-hardening follow-ups, not the release blockers above; the functional PWA cache is versioned and passed offline/update tests.

## Required re-verification

1. Reject impossible `YYYY-MM-DD` CSV calendar dates and cover the correction path.
2. Make both help-button hit targets at least 44 × 44px.
3. Move focus to the skip destination and cover it with keyboard E2E.
4. Rebuild/redeploy, then repeat the three fixes at 390px plus live identity, offline reload, and service-worker update checks. Address CSP/frame and immutable-cache hardening in the deployment configuration when practical.
