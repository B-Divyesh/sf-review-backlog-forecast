# Independent verification 3 — FAIL

**Work order:** `review-backlog-forecast-verify-3`
**Candidate:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`
**Required URL:** <https://review-backlog-forecast.sociobot.in/>
**Verified:** 2026-08-28 UTC
**Verdict:** **FAIL — do not release until the three medium-severity defects below are fixed and independently reverified.**

This was a fresh, independent run. The prior deployment-only TLS failure is resolved: normal TLS succeeds and the production artifact matches the candidate exactly. The product is otherwise functional, but it fails the supplied invalid-input, 44 px touch-target, and keyboard skip-link acceptance requirements.

## Release-blocking defects

### Medium — impossible `due_date` values are accepted and silently change the import

The CSV parser accepts calendar-impossible dates because JavaScript normalizes them rather than the parser rejecting them. In the actual production build UI, importing:

```csv
due_date,count
2026-02-31,1
```

announced `Read 1 card rows: 1 overdue and 0 due today. Add your usual daily due estimate.` instead of an actionable date error. February 31 is normalized to March 3 before classification. This can silently alter a learner's counts, contrary to the product's transparent recovery purpose and required invalid-input recovery.

Reject impossible year/month/day combinations after parsing the `YYYY-MM-DD` fields, before classifying a card, and add unit plus browser coverage.

### Medium — both help controls are 30 × 30 px, below the required 44 × 44 px touch target

At 390 × 844 and desktop, the `About overdue cards` and `About cards due today` buttons measure **30 × 30 CSS px**. The attached product/accessibility contract requires interactive controls of at least 44 × 44 px. Their visible marker may remain compact, but the actual button hit area must meet the requirement.

### Medium — the skip link does not place keyboard focus in main content

The visible `Skip to forecast controls` link targets `#main`, but `<main id="main">` is not focusable. In a keyboard-only browser exercise, focus was placed on the skip link and Enter was pressed; the resulting active element was `BODY`, not main or a forecast control. A keyboard user therefore does not receive the intended skip behavior. Make the target programmatically focusable and move focus to it; cover this with an E2E assertion.

## Clean-checkout quality gates

Candidate was tested from a new detached worktree at the exact SHA:

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
| Install | PASS | `npm ci` installed 58 packages; audit reported 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 11/11 passed. |
| Type check and exact production build | PASS | `npm run build` runs `tsc --noEmit && vite build`; it emitted `dist/`. No lint script exists. |
| Repository browser suite | PASS | `npm run test:e2e`: 10/10 passed across desktop and 390 × 844 projects. The first attempt exposed only an environment mismatch: the lockfile resolved Playwright 1.62.1 while its Chromium was absent. Installing that pinned browser made the suite pass. |
| Bundle budgets | PASS | `app.js` 18,211 B raw / 7,220 B gzip; `app.css` 21,558 B raw / 5,360 B gzip; 720 px hero 26,300 B. All are below the 200 KB JS, 50 KB CSS, and 300 KB mobile-image budgets. |
| Lighthouse mobile, live URL | PASS | Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0, interactive 1.1 s. Chrome reported a teardown tab crash after writing the JSON report; the completed audit data is valid. |

## Product and browser exercise

- **Normal recovery path:** loaded the supplied example (320 overdue, 48 due today, 36 usual daily due, 30-minute cap), ran all three policies, and changed the policy with ArrowRight. Three choices rendered; first-day schedule protected regular/due-today work before overdue work. The first 21 visible rows peaked at 99 cards, below the 150-card cap calculated from 30 minutes at 12 seconds/card.
- **Boundary and recovery:** submitted `overdue=-1`; the app announced `Overdue cards must be a whole number of 0 or more.` and placed focus on the alert. An unsupported CSV produced the documented accepted-columns error. A valid card-row CSV (`days_overdue` positive, zero, and negative with quantities) read 2 overdue, 1 due today, and estimated 1 daily due. The impossible-date case above is the failed invalid-input path.
- **Persistence and reversibility:** the committed suite saved a selected plan to IndexedDB and verified it after reload. The app exposes backup import/export, schedule CSV export, saved-plan undo, and confirmed clear-local-data actions. It has no Anki collection, account, sync, or rescheduling access.
- **Desktop and 390 px mobile:** no page-level horizontal overflow at 390 px (`scrollWidth = innerWidth = 390`); intended plot/ledger internal overflow remained contained. The two help buttons are the only visible main-form buttons below the target size; hidden 1 px radios are visually represented by their larger policy-card labels.
- **Keyboard, focus, and motion:** policy radios operate by keyboard and the selected card gets a visible 3 px focus-within outline. The skip-link defect above remains. Under `prefers-reduced-motion: reduce`, computed animation/transition duration was `0.01ms` and root smooth scrolling became `auto`.
- **Accessibility:** semantic smoke test confirmed `lang=en`, descriptive title, exactly one `h1`, `<main>`, labelled fields, image alt text, and focus styling. Axe WCAG 2/2.1 A/AA found **zero serious or critical findings** in populated desktop and 390 px mobile states. Axe did not flag the manual target-size or focus-destination defects.
- **Errors and privacy:** normal, invalid, mobile, and live-offline runs emitted no console errors or `pageerror` events. Captured browser requests had only the app origin; source inspection found no analytics, beacons, third-party fonts/scripts, API calls, credentials, or tracking. User inputs and plans are IndexedDB-only.

## PWA, production identity, response policies, and caching

- **Offline:** on the live URL, the page was service-worker controlled with `rbf-v1.0.1-shell`; after `context.setOffline(true)`, reload showed the app heading and ran a new forecast without errors.
- **Update:** in an isolated static-server test of the exact built artifact, changing only the served worker version from `rbf-v1.0.1` to `rbf-v1.0.2` produced `A new version is ready.`. Activating the toast update retained controller ownership and left `rbf-v1.0.2-shell` and `rbf-v1.0.2-runtime` caches.
- **Live identity:** normal TLS validation succeeds. SHA-256 of live `/` exactly matched local `dist/index.html`: `12cd57587c99de7f41c77fa8d89f6f9b884fa451c6ad2ebccdfb900d132382bf`. Live hashes also exactly matched the candidate for app JS/CSS, service worker, manifest, offline page, privacy and terms pages, all three icons, and both hero WebPs.
- **Headers:** checked live responses are HTTP 200 with HSTS, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. They lack Content-Security-Policy, Permissions-Policy, and clickjacking protection; record these as deployment hardening work. The manifest is served as `application/octet-stream`, not a manifest JSON MIME type.
- **Caching follow-up:** all checked HTML, JS, CSS, worker, manifest, and image responses use `Cache-Control: public, must-revalidate, max-age=30`. The versioned service worker makes the PWA functional, but this does not meet the attached long-lived immutable caching guidance for static assets. Use content-hashed assets plus immutable caching in a future deployment.

## Required re-verification

1. Reject malformed calendar dates and cover the parser and UI recovery behavior.
2. Expand each help button's actual hit area to at least 44 × 44 px.
3. Give the skip destination a reliable focus handoff and assert it with keyboard E2E.
4. Rebuild/redeploy, then rerun these three paths at 390 px plus live identity, service-worker offline reload, and update checks. Address response-header and immutable-cache hardening in the same deployment where practical.
