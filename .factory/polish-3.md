# Polish 3 — complete review repair evidence

**Repaired candidate:** `33ae89cae207d84ebbc58b855f066f996c439215`  
**Repair commit:** `b5e45b80241f349367bd33f78c4fbc6effb4aa09`  
**Deployed build:** `1.0.6`  
**Live URL:** <https://review-backlog-forecast.sociobot.in/?demo=1&v=1.0.6>  
**Checked:** 2026-09-01 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained route heading focus and polite announcements. Demo mode now promotes its visible result heading to the only h1. | `moves focus to the new route heading and announces normal navigation and Back`; live `live-flow.json`. |
| F-1-2 | Retained the registered Steady target claim. | Clean-clone `npm test -- -t @claim:steady-recovery-target` passed. |
| F-1-3 | Retained the registered Deadline feasibility claim. | Clean-clone `npm test -- -t @claim:deadline-feasibility` passed. |
| F-1-4 | Retained the registered Gentle ramp claim. | Clean-clone `npm test -- -t @claim:gentle-ramp` passed. |
| F-1-5 | Retained the estimate label and rerun claim. | Clean-clone `npm run test:e2e -- --grep @claim:adjustable-estimates` passed in desktop and mobile. |
| F-1-6 | The hero eyebrow remains absent. | Cold root and live demo screenshots; direct h1 remains the job statement. |
| F-1-7 | Retained `Forecast inputs`. | Full browser suite passed. |
| F-1-8 | Retained `Import queue totals`. | Full browser suite passed. |
| F-1-9 | Retained `Compare recovery plans`. | Live desktop screenshot. |
| F-1-10 | Retained `Three recovery plans`. | Live desktop and mobile screenshots. |
| F-1-11 | Retained `No forecast yet`. | Full browser suite passed. |
| F-1-12 | Retained `Forecast assumptions`. | Full browser suite passed. |
| F-1-13 | Retained factual `Preview only`. | `@claim:anki-isolation` passed. |
| F-1-14 | Retained short README test sentences. | `.factory/copy-audit.md`. |
| F-1-15 | Replaced remaining workload synonyms with `regular reviews`; updated validation, runtime status, all visitor pages, manifest description, and regression coverage. | `uses one visitor-facing term for each forecast concept`; live source has `Regular reviews per day`. |
| F-2-1 | Retained `Free` in the first desktop trust row. | `publishes route metadata, shared legal chrome, and build identity` checks its y-position. |
| F-2-2 | Retained factual device-local footer and privacy copy. | Terminology/copy regression and live route check. |
| F-2-3 | Retained removal of the visitor-facing image-provenance note. | Copy regression and live screenshots. |
| F-3-1 | Demo mode now hides the landing hero, starts with the sample results, seeds result cards before the main bundle, and keeps the banner/reset controls. | `opens a populated sample forecast in the first post-click viewport`; live `demo-desktop.png`, `demo-mobile.png`, and `live-flow.json`. |
| F-3-2 | IndexedDB writes now resolve only on transaction completion; the save button exposes `Saving plan…`; the claim waits for committed confirmation. | `@claim:local-persistence` plus three full local 70-test runs and the clean-clone full suite passed. |
| F-3-3 | Rewrote banner copy to `Explore the 320-card example.` | Live screenshots. |
| F-3-4 | Removed the redundant hero eyebrow. | Cold root source and copy audit. |
| F-3-5 | Rewrote `simple CSV` as `Enter totals or import a CSV.` | Copy audit and live import panel. |
| F-3-6 | Renamed `Remove` to `Remove saved plan`. | Live HTML check and full suite. |
| F-3-7 | Renamed the service-worker action to `Update app`. | Update-flow browser test passed. |
| F-3-8 | Rewrote the README audience sentence to name daily cards and minutes. | `.factory/copy-audit.md`. |
| F-3-9 | Rewrote README rollover language as unfinished regular reviews carried forward. | `.factory/copy-audit.md`; `@claim:rollover-visible` passed. |
| F-3-10 | Rewrote README architecture copy as an installable offline web app. | `.factory/copy-audit.md`. |
| F-3-11 | Rewrote browser storage copy as a local database and added input persistence coverage. | Clean-clone `@claim:input-persistence` passed. |
| F-3-12 | Rewrote offline copy as the browser’s offline cache. | Clean-clone `@claim:offline-reload` passed. |
| F-3-13 | Narrowed empty-state copy to editing a marked estimate before rerunning. | `@claim:adjustable-estimates` passed. |
| F-3-14 | Added `daily-cards-minutes` to claims and a populated-ledger browser test. | Clean-clone `npm run test:e2e -- --grep @claim:daily-cards-minutes` passed. |
| F-3-15 | Added `input-persistence`; demo now restores valid edited inputs after reload. | Clean-clone `npm run test:e2e -- --grep @claim:input-persistence` passed. |
| F-3-16 | Added a direct three-step `How it works` section and linked the header to it. | `links How it works to three direct planning steps` passed. |
| F-3-17 | Added a derived 180 × 180 Apple touch icon and linked it from every route. | Metadata test reads its PNG dimensions; live routes return 200. |
| F-3-18 | Added local, read-only Anki Desktop count-to-CSV instructions beside the control and in README, plus a tested template/import flow. | Clean-clone `npm run test:e2e -- --grep @claim:anki-csv-steps` passed. |

## Live evidence

- Cold verifier: `.factory/evidence/polish-3/live-1/verify.json` — 678 ms, no console errors, title/lang/main/alt/button checks pass.
- Live screenshots: `.factory/evidence/polish-3/live-1/demo-desktop.png` and `.factory/evidence/polish-3/live-1/demo-mobile.png`.
- Live behavior: `.factory/evidence/polish-3/live-1/live-flow.json` — desktop and mobile show a result card in the first viewport, reset returns 320, and Privacy/Back move focus to the expected h1.
- Live Playwright Axe: `.factory/evidence/polish-3/live-1/axe-live-playwright.json` — no serious or critical violations on demo, Privacy, Terms, or 404.
