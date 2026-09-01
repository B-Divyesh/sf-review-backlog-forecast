# Independent verification 8 — PASS

**Work order:** `review-backlog-forecast-verify-8`
**Candidate:** `fe3f00be1651d2234326f60d9ea70e54b0a99ba9`
**Production URL:** <https://review-backlog-forecast.sociobot.in/>
**Verified:** 2026-09-01 UTC

## Verdict

**PASS.** The deployed PWA byte-matches the candidate’s first-load output and meets the researched brief: it locally previews capped Steady, Deadline, and Gentle recovery plans before any Anki change. No release-blocking product defects were found.

No product source was changed during verification. Checks used the candidate workspace and the scoped production URL only.

## Mandatory first read and demo

**PASS.** A cold live visit returned HTTP 200 with the plain-language heading “Plan overdue reviews before changing cards.” The same first screen says this is for “learners returning after missed days” and presents **Try it with sample data** with “See a 320-card overdue queue plan. Nothing real is saved.” The action opens `/?demo=1` in one click.

The demo immediately shows all three plans and the persistent banner: “Demo — sample data, nothing is saved to your real plan,” with **Reset demo** and **Start for real**. It starts with 320 overdue cards, 48 cards due today, 36 usual daily cards, a 30-minute cap, and a 14-day deadline.

## Claims gate

**PASS.** `.factory/claims.json` exists with 20 unique entries. From the initial clean working tree, `npm ci` completed (143 packages; audit reported 0 vulnerabilities), then every exact listed command passed.

| Claim group | Passing claim IDs |
| --- | --- |
| Unit checks | `three-policies`, `hard-session-cap`, `due-today-priority`, `rollover-visible`, `steady-recovery-target`, `deadline-feasibility`, `gentle-ramp` |
| Browser checks | `csv-import`, `grouped-csv-import`, `offline-reload`, `local-only`, `adjustable-estimates`, `demo-isolation`, `local-persistence`, `backup-roundtrip`, `schedule-export`, `clear-local-data`, `anki-isolation`, `no-third-party-runtime`, `no-account` |

The repeated standalone offline claim passed in desktop and 390 px mobile contexts after the original claim run finished. An earlier simultaneous repeat met a local preview-server refusal; it was not used as evidence because the standalone repeat passed.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm test` | PASS — 18/18 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — `dist/` produced. |
| `npm run test:e2e` | PASS — 60/60 Playwright tests; `test-results/.last-run.json` records `passed`. |

Production build sizes are within the static budgets: first-load application JavaScript is 19.50 kB raw / 7.57 kB gzip and application CSS is 22.83 kB raw / 5.59 kB gzip. No runtime font request occurs.

## Independent live product checks

- **Normal flow:** one-click sample demo rendered all policies. A selected Deadline plan saved in the demo browser database and its saved summary returned after reload. The selected schedule exported as CSV.
- **Boundary and recovery:** the minimum valid 3-seconds-per-review and 5-minute-cap values produced a forecast. Entering `-1` overdue cards produced the focused message “Overdue cards must be a whole number between 0 and 100,000.” Resetting the demo restored a usable forecast. An impossible `2026-02-31` CSV date produced the documented row-specific message.
- **Privacy:** the complete live demo flow (including sample, forecast, save, reload, export, and invalid CSV handling) made requests only to `https://review-backlog-forecast.sociobot.in`. Observed resource types were document, script, stylesheet, and image. There were no console or page errors.
- **PWA/offline:** a fresh live browser context gained service-worker control, was set offline, and reloaded `/?demo=1` with the forecast present and status “Offline · forecast still works.” The full local suite also passed its waiting-worker update check, preserving the demo after activating a versioned worker.
- **Deployment match:** the live `index.html` and all seven first-load files (`app` JS/CSS, demo bootstrap, route-focus JS, and three generated image assets) have the same SHA-256 values as `dist/`. Live footer build identity is `1.0.4`.

## Accessibility, responsive use, headers, and caching

- Live `verify-url.sh` passed: 578 ms cold navigation, no console/page errors, title present, `lang="en"`, one h1, main landmark, zero images without alt text, and zero unnamed buttons.
- Live Playwright axe scan of the demo found zero serious or critical WCAG 2/2.1 AA findings. The full suite additionally passed axe checks for Demo, Privacy, Terms, and 404. The standalone `npx @axe-core/cli` runner was tried with its default and supplied Playwright-browser path, but its Selenium browser launch could not start in this worker; the live Playwright axe result is the browser evidence.
- At 390 × 844, `scrollWidth` and `innerWidth` were both 390. Keyboard activation of the visible skip link focused `main#main`. With reduced motion set, the inspected button transition duration was `0.00001s`. No mobile console/page errors occurred.
- Live routes `/`, `/privacy/`, `/terms/`, manifest, and service worker returned 200; an unknown route returned styled HTTP 404. Responses include CSP, HSTS, `nosniff`, referrer policy, and permissions policy. Hashed JS/CSS assets use `public, max-age=31536000, immutable`; manifest and service worker use `no-cache`.
- All same-origin links collected from landing, demo, legal, offline, and 404 pages returned HTTP 200 (including their in-page fragments).

This static PWA has no server-side product endpoint, rate-limited API, product unlock call, or sign-in path. Request-allowance and tenant checks therefore do not apply.

## Defects by severity

None found.

## Re-run

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
/opt/fleet/lib/verify-url.sh https://review-backlog-forecast.sociobot.in .factory/verification-evidence
```
