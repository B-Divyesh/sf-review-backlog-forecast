# Independent verification 10 — FAIL

**Work order:** `review-backlog-forecast-verify-10`  
**Candidate:** `4574f59218d14351bd37fdb4e1a9ae9de3344d1c`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-09-01 UTC  
**Verdict:** **FAIL — do not release until the two medium-severity findings below are corrected.**

The product works end to end and the deployment matches the candidate. The failure is caused by a manual focus-contrast defect and by public promises that are absent from the mandatory claims registry.

No product source was changed during verification.

## Release-blocking defects

### Medium — focus rings fail the required contrast on dark product surfaces

The global focused-control ring is `#8e2d1d` on the dark enamel surface `#173f3a`. Their measured contrast is **1.41:1**, below the attached accessibility contract's **3:1** minimum for visible focus.

Live computed styles show `outline: 3px solid rgb(142, 45, 29)` on these controls while they sit on the dark surface:

- **Reset demo** and **Start for real**
- **Download CSV template**
- **Accepted CSV columns** and **Make a queue CSV from Anki**
- **Load sample values**
- the two `?` help buttons
- **Run forecast**

The ring is visible on the warm paper background (6.95:1) but not sufficiently distinct on the dark panels. Use a context-specific light or brass focus token on dark surfaces and verify at least 3:1 against both the control and adjacent surface.

### Medium — visitor-facing claims are missing from `.factory/claims.json`

All 23 registered claims pass, but the claims contract also requires every public promise to be listed and covered by exactly one tagged test. At least these promises are unregistered or stronger than their registered tests:

- README: “Vite and TypeScript produce an **installable** offline web app.” There is no installability claim or `@claim:...` test. An independent CDP check found zero current installability errors, but that does not satisfy the required registry.
- Privacy: “It does not send card counts, imported files, assumptions, or saved plans to us.” `local-only` covers a raw imported-content marker and same-origin requests; it does not register or exercise unique markers for counts, assumptions, and saved plans, and same-origin requests are allowed by that test.
- Offline page: “After one online visit, the forecast and its saved data open without a connection.” `offline-reload` checks the sample forecast offline, while `local-persistence` checks a saved plan online. No registered claim checks the combined saved-plan-offline promise.

The independent live checks found only static GET requests and successfully restored a saved plan offline, so this is a claims coverage failure rather than evidence of data transmission or broken PWA behavior. Add precise claim entries with one tagged sandbox test each, or narrow the public copy to the existing registered claims.

## First-read and demo gate

**PASS.** A cold visit returns 200 and the first viewport answers all three required questions:

- What: “Plan an overdue queue before changing cards.”
- Who: “For learners returning after missed days.”
- First action: **Try it with sample data**, followed by “See a 320-card overdue queue plan. Nothing real is saved.”

The action opens `/?demo=1` in one click. At 390 px, the first result card begins at 304 px, inside the 844 px viewport. The persistent demo notice, **Reset demo**, and **Start for real** are present. The demo starts with 320 overdue, 48 due today, 36 regular reviews per day, a 30-minute cap, and all three recovery plans.

## Claims gate

**Registered claims: PASS.** `.factory/claims.json` exists with 23 unique entries. After `npm ci`, every exact listed command passed independently. All 23 claim tags occur exactly once in the unit or browser tests. Browser claim commands passed in both desktop and 390 px mobile projects.

| Group | Passing claim IDs |
| --- | --- |
| Forecast | `three-policies`, `hard-session-cap`, `due-today-priority`, `rollover-visible`, `steady-recovery-target`, `deadline-feasibility`, `gentle-ramp` |
| Import and estimates | `csv-import`, `grouped-csv-import`, `anki-csv-steps`, `adjustable-estimates` |
| Local data | `local-only`, `demo-isolation`, `local-persistence`, `input-persistence`, `backup-roundtrip`, `clear-local-data` |
| Export and boundaries | `schedule-export`, `daily-cards-minutes`, `anki-isolation`, `no-third-party-runtime`, `no-account` |
| PWA | `offline-reload` |

The unlisted public promises above still fail the overall claims gate under the acceptance contract.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages installed; audit reported 0 vulnerabilities. |
| `npm test` | PASS — 19/19 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — exact production build produced `dist/`. |
| `npm run test:e2e` | PASS — 70/70 Playwright checks with the configured two workers. |

An additional four-worker stress run passed 68 checks but its two multi-route axe checks exceeded the 30-second test timeout. The repository's exact `npm run test:e2e` command then passed both axe checks and all 70 tests. This resource-contention observation is not a product defect.

Production output is well inside the static budgets:

- initial application JavaScript: 22.37 kB raw / 8.88 kB gzip across app, route-focus, and demo-bootstrap files;
- application CSS: 24.42 kB raw / 5.88 kB gzip;
- mobile hero: 26.30 kB;
- no runtime font download.

## Independent product exercise

- **Normal flow:** the one-click sample showed Steady, Deadline, and Gentle. Arrow-key selection moved focus and selection from Steady to Deadline. Saving completed, and `Deadline · 320 overdue · 30-minute cap` returned after reload.
- **Export:** the selected schedule downloaded with the documented nine-column CSV header and 28 daily rows in the exercised plan.
- **Boundary:** zero queue values with 3 seconds per review, a 5-minute cap, a 2-day deadline, and one study day produced a valid 100-card capacity and an already-clear queue.
- **Invalid and recovery:** 100,001 overdue cards focused the error summary and disabled stale actions. `2026-02-31` produced the row-specific real-calendar-date error. Importing a valid summary immediately afterward restored usable values.
- **Privacy:** a unique raw-card marker was absent from IndexedDB, local storage, and session storage after import, forecast, and save. The complete exercised flow made only same-origin GET requests for documents, scripts, styles, and images. No console or page errors occurred on normal routes.
- **Scope:** source and browser request scans found no API, unlock, sign-in, billing, or server endpoint. Rate-limit and Entra tenant checks do not apply to this static PWA.
- **Missed leverage:** no model-assisted feature is warranted. The brief calls for a deterministic, local forecast; CSV import/export and Anki count instructions cover the implied handoff.

## Accessibility, mobile, and routing

- `/opt/fleet/lib/verify-url.sh` passed the live demo in 799 ms: no console/page errors, `lang="en"`, one h1, one main landmark, no missing alt text, and no unnamed buttons.
- Independent Playwright axe scans found zero serious or critical WCAG 2/2.1 A/AA findings on Demo, Privacy, Terms, and the styled 404 at desktop and 390 px mobile. The manual focus-ring failure is outside that automated result.
- The skip link has a 3 px ring and moves focus to `main`; policy radios work with arrow keys. Invalid input moves focus to its error summary. No keyboard trap was found.
- At 390 × 844, `scrollWidth` equals 390 px. Visible controls meet the 44 px target through their direct controls or enclosing labels. At 200% root text size, the page still fits 390 px and the h1 and forecast action remain available.
- Reduced motion changes scrolling to `auto` and animation/transition duration to `0.00001s`.
- Titles, `lang`, one h1, main landmark, alt text, canonical metadata, and route-specific titles are correct on Home, Demo, Privacy, Terms, Offline, and 404. Normal same-origin navigation targets return 200; an unknown route returns the styled page with HTTP 404.

## Performance and PWA

A fresh throttled mobile Lighthouse 12.8.2 run scored **100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**. It measured FCP 1.2 s, LCP 1.3 s, TBT 70 ms, CLS 0, Speed Index 1.2 s, and 73 KiB transferred. Live interaction event durations reached at most 32 ms, below the 200 ms interaction budget.

A fresh live context installed and controlled the page with `/sw.js`, using cache `rbf-v1.0.6-shell`. After saving Gentle, going offline, and reloading, the complete demo and `Gentle · 320 overdue` saved summary remained available; the status read “Offline · forecast still works,” and export stayed enabled. A worker update check found the current active worker and no stale waiting worker. The full local suite also passed its simulated `1.0.6` → `1.0.7` waiting-worker activation test without losing the demo.

Chromium reported no manifest errors and no installability errors. The manifest provides standalone display, a versioned start URL, matching theme/background colors, 192 px and 512 px icons, and a 512 px maskable icon.

## Deployment identity, headers, and caching

All **28/28** publicly served build files match the locally generated candidate files by SHA-256. The live footer and service worker report build `1.0.6`.

Live HTML includes CSP, HSTS, `nosniff`, referrer policy, permissions policy, and frame denial. Hashed assets and icons use `public, max-age=31536000, immutable`; manifest and service worker use `no-cache`; HTML revalidates after 30 seconds. No CSP or other console error occurred on normal routes.

## Required repair and rerun

1. Give controls on dark surfaces a focus indicator with at least 3:1 contrast.
2. Register and tag tests for every public promise, especially installability, complete no-transmission wording, and saved-plan offline reopening; alternatively narrow the copy.
3. Rerun every exact claim command, the complete local gates, the manual dark-surface focus check, and the live deployment match.
