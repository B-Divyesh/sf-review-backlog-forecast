# Polish 2 — complete review repair evidence

**Candidate repaired:** `44773a4`  
**Deployed build:** `1.0.5`  
**Live URL:** <https://review-backlog-forecast.sociobot.in/?demo=1>  
**Checked:** 2026-09-01 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the shared route-focus handoff and rechecked it against the deployed site. | Live Playwright: Privacy h1 then demo h1 received focus after Back; `moves focus to the new route heading and announces normal navigation and Back` passed in the fresh clone. |
| F-1-2 | Retained the registered Steady target claim and deterministic coverage. | `npm test -- -t @claim:steady-recovery-target` passed in `/tmp/review-backlog-forecast-clean-c55J7l`. |
| F-1-3 | Retained the registered Deadline feasibility claim and deterministic coverage. | `npm test -- -t @claim:deadline-feasibility` passed in the fresh clone. |
| F-1-4 | Retained the registered Gentle ramp claim and deterministic coverage. | `npm test -- -t @claim:gentle-ramp` passed in the fresh clone. |
| F-1-5 | Retained the estimate-label and rerun browser claim. | `npm run test:e2e -- --grep @claim:adjustable-estimates` passed in desktop and mobile from the fresh clone. |
| F-1-6 | Replaced the metaphor eyebrow with `Plan an overdue queue.` | Live desktop root check and `.factory/evidence/polish-2/live-desktop-root.png`. |
| F-1-7 | Retained `Forecast inputs`. | Full fresh-clone browser suite passed. |
| F-1-8 | Retained `Import queue totals`. | Full fresh-clone browser suite passed. |
| F-1-9 | Retained `Compare recovery plans`. | Full fresh-clone browser suite passed. |
| F-1-10 | Retained `Three recovery plans`. | Live mobile demo check and `.factory/evidence/polish-2/live-mobile-demo.png`. |
| F-1-11 | Retained `No forecast yet`. | Full fresh-clone browser suite passed. |
| F-1-12 | Retained `Forecast assumptions`. | Full fresh-clone browser suite passed. |
| F-1-13 | Retained the factual `Preview only` label. | Full fresh-clone browser suite passed. |
| F-1-14 | Retained the split README test-suite sentences, each under 22 words. | `.factory/copy-audit.md`. |
| F-1-15 | Standardized the landing workload term as `overdue queue`: eyebrow, h1, lead, metadata, and audit. Added a regression test rejecting the retired workload phrases. | `uses overdue queue as the visitor-facing workload term and keeps the free fact in the first row` passed; live root check passed. |
| F-2-1 | Ordered `Free` as the third trust fact so it occupies the first desktop row. Added a 1440 × 900 browser assertion. | Live `Free` fact y-position: `866.5px`; `.factory/evidence/polish-2/live-desktop-root.png`; full suite passed. |
| F-2-2 | Replaced `local-first` in all visitor footers with `A free planning tool that keeps plans on this device.` Also rewrote the privacy-page lead. | Source regression test, live root check, and `/privacy/` live route check passed. |
| F-2-3 | Removed the visitor-facing generated-image/provenance sentence. The required original-asset record remains in `.factory/design.md`. | Live root check rejects `provenance`; `.factory/evidence/polish-2/live-desktop-root.png`. |

## Verification evidence

- Fresh clone: `/tmp/review-backlog-forecast-clean-c55J7l`; `npm ci` installed 143 packages and reported 0 vulnerabilities.
- Every exact command listed in `.factory/claims.json` passed separately: 7 tagged Vitest claims and 13 tagged Playwright claims, each browser claim in desktop and mobile projects.
- Fresh-clone quality gates passed: `npm test` (19 tests), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` (60 Playwright tests). The suite includes Axe, privacy request checks, isolated offline reload, mobile layout, 404, route focus, storage isolation, exports, and update handling.
- Deployed with `swa deploy ./dist --env production` to the owned `sf-review-backlog-forecast` Static Web App. `verify-url.sh` passed cold at <https://review-backlog-forecast.sociobot.in/?demo=1>; see `.factory/evidence/polish-2/verify.json`.
- A fresh live Playwright check found zero serious/critical Axe violations, no console errors, no mobile page overflow, HTTP 200 for `/`, `/privacy/`, and `/terms/`, and HTTP 404 for an unknown URL. The live demo reset restored `320`, and normal navigation plus Back focused the destination h1.

## Screenshots

- `.factory/evidence/polish-2/live-desktop-root.png`
- `.factory/evidence/polish-2/live-mobile-demo.png`
