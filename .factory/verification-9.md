# Independent verification 9 — PASS

**Work order:** `review-backlog-forecast-verify-9`

**Candidate:** `04f43c82e7b337c8ddeda549fe598db771f66e63`

**Production URL:** <https://review-backlog-forecast.sociobot.in/>

**Verified:** 2026-09-01 UTC

## Verdict

**PASS.** The deployed PWA matches the candidate and completes the researched job: a returning spaced-repetition learner can compare capped Steady, Deadline, and Gentle plans before changing any Anki cards. No product defect was found.

No product source was changed. Checks used the candidate checkout, its local demo entry point, and the scoped production URL only.

## First read and one-click demo

**Confirmed.** A cold production visit returns HTTP 200 and answers all three first-screen questions:

- What it does: “Plan an overdue queue before changing cards.”
- Who it serves: “For learners returning after missed days.”
- What to do first: **Try it with sample data**.

The action opens `/?demo=1` in one click. The first demo screen already shows a forecast for 320 overdue cards and three selectable plans. Its persistent banner says sample data is in use and real-plan data is not saved. **Reset demo** and **Start for real** are present. The first screen also shows Preview only, Stays on this device, Free, and No Anki access.

## Claims gate

**Confirmed.** `.factory/claims.json` exists with 20 unique entries. After the clean lockfile install, every exact listed command passed. Every claim tag occurs exactly once in the unit or browser tests.

| Claim group | Passing claim IDs |
| --- | --- |
| Forecast | `three-policies`, `hard-session-cap`, `due-today-priority`, `rollover-visible`, `steady-recovery-target`, `deadline-feasibility`, `gentle-ramp` |
| Import and estimates | `csv-import`, `grouped-csv-import`, `adjustable-estimates` |
| Local data | `local-only`, `demo-isolation`, `local-persistence`, `backup-roundtrip`, `clear-local-data` |
| Export and product boundaries | `schedule-export`, `anki-isolation`, `no-third-party-runtime`, `no-account` |
| PWA | `offline-reload` |

The browser claim commands each passed on desktop and 390 px mobile. The landing page and README statements map to these listed checks; no unlisted product promise was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages installed; audit reported 0 vulnerabilities. |
| `npm test` | PASS — 19/19 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — `dist/` produced. |
| `npm run test:e2e` | PASS — 60/60 checks across desktop and 390 px mobile. |

The production build is within the static budgets. First-load JavaScript is 20.75 kB raw and about 8.38 kB gzip across the application, route-focus, and demo bootstrap files. Application CSS is 22.83 kB raw and 5.60 kB gzip. No font is downloaded. The mobile hero is 26.30 kB; the desktop hero is 67.35 kB.

## Independent product flow and input handling

**Confirmed.** The live one-click sample rendered all three recovery plans. A selected plan was saved in the isolated demo database and returned after reload. The selected schedule downloaded as CSV. The local suite also confirmed JSON backup export and restore.

**Checked boundary values.** A 3-second review time and 5-minute cap produced a valid 100-card capacity forecast. All documented maximum values were accepted together and produced a forecast with a 96-card capacity under the 480-minute cap. Entering 100,001 overdue cards produced the focused message “Overdue cards must be a whole number between 0 and 100,000.” Save and export remained disabled until the forecast was rerun. Reset restored the 320-card sample, 12-second estimate, results, and confirmation message. Invalid calendar dates and unsupported CSV columns also produced specific recovery guidance in the full suite.

**Checked persistence boundaries.** Demo and real plans use separate IndexedDB databases. Raw imported card content was not retained in IndexedDB, local storage, or session storage. Leaving or resetting the demo clears only demo records. Forecasting remains a preview and does not contact Anki.

## Privacy, requests, headers, and routes

**Confirmed.** The complete production flow recorded 45 page requests. Every request stayed on `https://review-backlog-forecast.sociobot.in`; observed types were document, script, stylesheet, and image. There were no analytics, advertising, third-party font, external script, or external image requests. A uniquely marked CSV value was neither uploaded nor retained. A normal flow produced no console or page errors.

**Checked response policy.** HTML responses include CSP, HSTS, `nosniff`, referrer policy, permissions policy, and frame restrictions. Hashed assets and icons use `public, max-age=31536000, immutable`. The manifest and service worker use `no-cache`; HTML uses a 30-second revalidation policy. `/`, Demo, Privacy, Terms, manifest, service worker, assets, and icons return 200. A missing route returns the styled page with HTTP 404. All normal same-origin navigation links return 200, and fragment targets exist.

This static PWA has no server-side product endpoint, unlock call, sign-in path, or rate-limited API. Request-allowance and identity-provider checks do not apply.

## Accessibility, keyboard, mobile, and motion

**Confirmed.** `/opt/fleet/lib/verify-url.sh` reported a 749 ms demo load, no console or page errors, `lang="en"`, one h1, a main landmark, no images missing alt text, and no unnamed buttons.

**Checked accessibility.** Independent Playwright axe checks found zero serious or critical WCAG 2/2.1 AA findings on Demo, Privacy, Terms, and the styled 404. The skip link becomes visible with a 3 px focus ring and moves focus to `main`. Policy selection works with arrow keys and retains focus. Invalid input moves focus to the error summary. At 390 × 844, page width remained 390 px, no direct interactive target was smaller than 44 px, and no console error occurred.

**Checked motion.** With reduced motion requested, button transitions and animations reduce to `0.00001s`, scroll behavior becomes `auto`, and no essential state disappears.

## Performance and PWA behavior

**Confirmed.** A fresh throttled Lighthouse run scored Performance 96, Accessibility 100, Best Practices 100, and SEO 100. It measured FCP 1.0 s, LCP 1.1 s, Speed Index 1.0 s, CLS 0, and a 71 KiB page. Live interaction event durations reached at most 56 ms, within the 200 ms interaction budget.

**Checked offline behavior.** A fresh browser gained control from `/sw.js`, created the `rbf-v1.0.5-shell` cache, went offline, and reloaded the complete demo with its forecast and “Offline · forecast still works” status. A live worker update check retained the active worker without an unnecessary waiting version. The full local update check installed a changed worker, showed the update notice, activated it, and preserved the demo.

The manifest supplies standalone display, versioned start URL, theme/background colors, 192 px and 512 px icons, and a 512 px maskable icon.

## Deployment identity and documentation

**Confirmed.** All 21 publicly served build files match the locally generated candidate files by SHA-256. The platform routing configuration is consumed by the host and is correctly not public. The live footer reports build `1.0.5`, and the active service-worker cache is version `rbf-v1.0.5`.

**Checked handoff material.** README, MIT license, Privacy, Terms, demo documentation, copy audit, researched brief, and the product-specific visual thesis are present. The visual thesis records palette, typography, spacing, motion, single-mode rationale, and original generated-image provenance. The deterministic forecast and import/export flow fit the brief; no additional model-assisted step is needed for this job.

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
/opt/fleet/lib/verify-url.sh 'https://review-backlog-forecast.sociobot.in/?demo=1' /tmp/review-backlog-verification
```
