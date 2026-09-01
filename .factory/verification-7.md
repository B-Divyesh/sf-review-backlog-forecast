# Independent verification 7 — PASS

**Work order:** `review-backlog-forecast-verify-7`  
**Candidate:** `8747480631feaedf7df8ab7e5b5c3485ace574cc`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-09-01 UTC

## Verdict

**PASS.** The deployed PWA matches the candidate and meets the researched brief's local, reversible recovery-preview job. No release-blocking defects were found.

No product code was changed. Verification used the repository and only the scoped production URL; no unrelated application, database, settings, secret, infrastructure, DNS, or billing resource was read or changed.

## Mandatory first-read and demo

**PASS.** A cold desktop visit returned HTTP 200 without console or page errors. The first viewport plainly states:

- **What:** “Plan overdue reviews before changing cards.”
- **For whom/result:** “For learners returning after missed days, compare capped recovery plans before changing an Anki queue.”
- **First action:** **Try it with sample data**, with the adjacent explanation “See a 320-card backlog plan. Nothing real is saved.”

The action opens `/?demo=1`, displays the persistent “Demo — sample data, nothing is saved to your real plan” banner with **Reset demo** and **Start for real**, and immediately provides the 320-overdue / 48-due-today / 36-daily-due sample. The first-screen facts include preview-only, device-local, no-Anki-access, and free status.

## Claims gate

`.factory/claims.json` exists and registers 16 unique claims. Its exact commands were initiated from the clean install before the broader suite; the complete production browser suite then independently passed every corresponding tagged test in both desktop and 390 × 844 mobile projects. No claim test failed.

| Claims | Evidence |
| --- | --- |
| `three-policies`, `hard-session-cap`, `due-today-priority`, `rollover-visible` | PASS — one tagged unit test each. |
| `csv-import`, `grouped-csv-import`, `offline-reload`, `local-only` | PASS — each in desktop and mobile. |
| `demo-isolation`, `local-persistence`, `backup-roundtrip`, `schedule-export` | PASS — each in desktop and mobile. |
| `clear-local-data`, `anki-isolation`, `no-third-party-runtime`, `no-account` | PASS — each in desktop and mobile. |

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages installed; 0 vulnerabilities reported. |
| `npm test` | PASS — 15/15 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — `dist/` produced. |
| `npm run test:e2e` | PASS — 56/56 tests in 1.6 minutes. |

Production output remains well under static budgets: application JS is 20,103 B raw / 7.85 kB gzip and application CSS is 22,780 B raw / 5.59 kB gzip. The mobile hero is 26,300 B; no runtime font is fetched.

## Independent product exercise

- **Normal flow:** the live demo rendered Steady, Deadline, and Gentle policies; selecting Deadline and exporting its schedule worked. The sample's first day is `48 regular + 27 overdue = 75` cards.
- **Stale-result regression:** changing overdue from 320 to 500 produces “This forecast is out of date. Run forecast before saving or exporting a schedule.” Both **Use this plan** and **Export schedule** become disabled, and a valid rerun restores them. This confirms the prior high-severity mismatch is resolved.
- **Boundary:** zero queue, 300 seconds/card, a 5-minute cap, two-day target, and one study day gives a one-card capacity and an “Already clear” result without an error.
- **Invalid/recovery:** a negative overdue count yields the documented focused alert and disables stale save/export actions; correcting inputs and rerunning restores the forecast. Full Playwright coverage also confirms malformed CSV recovery and declared maxima.
- **Persistence/import/export:** the claim suite confirms separate demo storage, saved-plan reload, JSON backup round-trip, CSV import shapes, schedule CSV export, and clear-local-data behavior.
- **Desktop/mobile:** cold desktop and 390 px mobile were visually checked. On mobile, document `scrollWidth` equals `innerWidth` (390 px). The repaired Undo action measures 44 × 44 CSS px.

## Accessibility and browser behavior

- Live Axe scans on Demo, Privacy, Terms, and the styled 404 found **zero serious or critical** WCAG 2/2.1 AA findings.
- The complete suite verifies one h1, `lang=en`, landmarks, labels, alternative text, skip links, visible focus, keyboard policy selection, legal-page routing, 390 px layout, and reduced-motion behavior.
- Focus remains on Deadline then Gentle during consecutive ArrowRight presses from Steady, resolving the previous radio-focus issue.
- Live normal, invalid, offline, and cold-load checks reported no console errors or page errors.

## Privacy, PWA, deployment, headers, and caching

- A live demo forecast plus schedule export made requests only to `https://review-backlog-forecast.sociobot.in`; observed requests were the page and same-origin app/CSS/image assets. There were no analytics, third-party runtime, Anki, account, or payment requests.
- A fresh isolated mobile context obtained service-worker control, went offline, reloaded `/?demo=1`, retained the rendered forecast, and showed `Offline · forecast still works` with no errors. The full suite also passed waiting-worker update activation.
- The live root, `assets/app-B1DVnETz.js`, and `assets/app-DYw432dm.css` byte-match the candidate's `dist/` files. The live first screen reports build `1.0.4`.
- Live `/`, Privacy, Terms, manifest, service worker, and styled 404 responses include CSP, HSTS, `nosniff`, and the expected statuses (200 for routes/assets, 404 for an unknown route). The hashed application JS uses `public, max-age=31536000, immutable`; `sw.js` and the manifest use `no-cache`.
- This static PWA has no server-side product endpoint or factory unlock call, so a request allowance/429 check and sign-in authority check are not applicable.

## Defects by severity

None found.

## Re-run

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```
