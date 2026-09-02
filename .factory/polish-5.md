# Polish 5 — cumulative zero-finding repair

**Reviewed base:** `0535b6020cbe87c143cf09621bd0dcb90004c416`
**Feature repair commit:** `52e8c770afc455f81719024bbb11559cbfdddc0d`
**Final deployed commit:** `2be4452`
**Build:** `1.0.10`
**Demo URLs:** <https://review-backlog-forecast.sociobot.in/demo/> and <https://review-backlog-forecast.sociobot.in/?demo=1>

The original warm-paper, enamel, brass, and vermilion recovery-console system remains unchanged. This repair adds no external runtime dependency or tracking.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept h1 focus handoff on normal navigation and Back. | `moves focus to each route heading and announces root, legal pages, and Back` |
| F-1-2 | Kept the registered Steady target and deterministic check. | `@claim:steady-recovery-target` |
| F-1-3 | Kept reachable and unreachable Deadline checks. | `@claim:deadline-feasibility` |
| F-1-4 | Kept the five-session Gentle ramp check. | `@claim:gentle-ramp` |
| F-1-5 | Kept labelled estimate editing and rerun coverage. | `@claim:adjustable-estimates` |
| F-1-6 | Kept the plain h1 and no metaphor eyebrow. | `.factory/copy-audit.md`; local root check |
| F-1-7 | Kept the `Forecast inputs` section label. | Full browser suite |
| F-1-8 | Kept `Import queue totals`. | `@claim:csv-import` |
| F-1-9 | Kept `Compare recovery plans`. | Local demo screenshot |
| F-1-10 | Kept `Three recovery plans`. | `opens a populated sample forecast in the first post-click viewport` |
| F-1-11 | Kept the direct `No forecast yet` state. | `runs a forecast, selects a policy, and persists it` |
| F-1-12 | Kept `Forecast assumptions`. | Full browser suite |
| F-1-13 | Kept factual `Preview only` wording. | `@claim:anki-isolation` |
| F-1-14 | Kept short README test copy. | `.factory/copy-audit.md` |
| F-1-15 | Kept one term each for overdue queue, recovery plan, and regular reviews. | `uses one visitor-facing term for each forecast concept and keeps the free fact in the first row` |
| F-2-1 | Kept Free in the first desktop fact row. | `publishes route metadata, shared chrome, and build identity` |
| F-2-2 | Kept device-local wording in visitor copy. | `.factory/copy-audit.md` |
| F-2-3 | Kept image-source jargon out of visitor copy. | `.factory/copy-audit.md` |
| F-3-1 | Kept the sample result in the first post-click viewport. | `opens a populated sample forecast in the first post-click viewport` |
| F-3-2 | Kept transaction-complete saves before confirmation and reload. | `@claim:local-persistence` |
| F-3-3 | Kept factual demo-banner wording. | Local demo screenshot |
| F-3-4 | Kept the redundant eyebrow removed. | `.factory/copy-audit.md` |
| F-3-5 | Kept concrete CSV import wording. | `@claim:csv-import` |
| F-3-6 | Kept `Remove saved plan`. | Focus-control browser test |
| F-3-7 | Kept `Update app`. | `activates a waiting service-worker update without losing the demo` |
| F-3-8 | Kept the README audience defined by daily cards and minutes. | `.factory/copy-audit.md` |
| F-3-9 | Kept plain rollover wording. | `@claim:rollover-visible` |
| F-3-10 | Kept `installable offline web app` language. | `@claim:installability` |
| F-3-11 | Kept browser-local database language and input persistence. | `@claim:input-persistence` |
| F-3-12 | Kept browser offline-cache wording. | `@claim:offline-reload` |
| F-3-13 | Kept the narrower marked-estimate action. | `@claim:adjustable-estimates` |
| F-3-14 | Kept daily cards-and-minutes registration. | `@claim:daily-cards-minutes` |
| F-3-15 | Kept edited-input persistence registration. | `@claim:input-persistence` |
| F-3-16 | Kept three direct How it works steps. | `links How it works to three direct planning steps` |
| F-3-17 | Kept the 180 px Apple touch icon. | `publishes route metadata, shared chrome, and build identity` |
| F-3-18 | Kept local Anki count-to-CSV steps, template, and import. | `@claim:anki-csv-steps` |
| F-4-1 | Kept `To test offline behavior` instead of implementation jargon. | `keeps release documentation in plain words` |
| F-4-2 | Kept `image source record` instead of provenance jargon. | `keeps release documentation in plain words` |
| F-5-1 | Registered `minutes-formula`; the model now checks all day calculations and 150 cards × 12 seconds = 30 minutes. | `npm test -- -t @claim:minutes-formula` |
| F-5-2 | Registered `rest-day-accrual`; a six-day week proves rest-day regular work is added but not reviewed. | `npm test -- -t @claim:rest-day-accrual` |
| F-5-3 | Generated a real static `/demo/` document with demo-specific title, description, canonical, Open Graph, Twitter, sitemap, and primary links. | Raw-head assertions in `publishes route metadata, shared chrome, and build identity` |
| F-5-4 | Renamed the local save action to `Save this plan`. | `ships a static demo document and names the save action by its result` |
| F-5-5 | Replaced `FSRS changes` with `scheduler changes`; the Terms page uses the same plain wording and splits long legal sentences. | `.factory/copy-audit.md`; terminology regression |
| F-5-6 | Split README privacy copy into the two plain result sentences requested. | `keeps release documentation in plain words` |
| F-5-7 | Replaced metadata/layout-shift implementation terms with page-details/content-movement wording. | `keeps release documentation in plain words` |
| F-5-8 | Route status now announces `Page loaded: …` and tests root, Privacy, Terms, and Back exactly. | `moves focus to each route heading and announces root, legal pages, and Back` |
| F-5-9 | Added `How it works` to `/offline.html` and tested it with shared chrome. | `publishes route metadata, shared chrome, and build identity` |

## Local evidence

- `npm test` — 23/23 passed, including all 28 registered claim markers exactly once.
- `npm run lint`, `npm run typecheck`, and `npm run build` passed. The production bundle is 8,005 bytes gzip JavaScript and 5,983 bytes gzip CSS.
- `npm run test:e2e` — 82/82 passed in desktop and 390 px mobile projects. It includes route focus, raw static-demo metadata, Axe, mobile overflow, 200% text, offline reload, and update coverage.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo/ .factory/evidence/polish-5/local` passed: no console errors, title/lang, one h1, main landmark, alt text, and named buttons. Screenshots: `.factory/evidence/polish-5/local/screenshot-desktop.png` and `.factory/evidence/polish-5/local/screenshot-mobile.png`.
- `npx @axe-core/cli` found 0 violations at the local `/demo/` URL. Output: `.factory/evidence/polish-5/local/axe-cli.json`.

## Live evidence

- Deployed `dist/` from final deployed commit `2be4452` with `swa deploy ./dist --env production --app-name sf-review-backlog-forecast --resource-group sociobot`.
- Cold <https://review-backlog-forecast.sociobot.in/demo/> verifier passed in 780 ms with no console errors, `lang=en`, one h1, a main landmark, image alt text, and named buttons: `.factory/evidence/polish-5/live/verify.json`.
- Raw live `/demo/` head has the demo title, description, canonical, Open Graph URL, and Twitter title; both `/demo/` and `/?demo=1` returned HTTP 200.
- Live functional check: `.factory/evidence/polish-5/live/live-check.json`. It records the persistent banner, 320-card reset, `Save this plan`, formula/rest-day/scheduler wording, same-origin requests, root/Privacy/Terms/Back focus and announcements, the offline How it works link, HTTP 404, and 390 px no-overflow layout.
- Screenshots: `.factory/evidence/polish-5/live/demo-desktop.png` and `.factory/evidence/polish-5/live/demo-mobile.png`.
- Live standalone Axe: `.factory/evidence/polish-5/live/axe-cli.json` — 0 violations.
- Live mobile Lighthouse: `.factory/evidence/polish-5/live/lighthouse.json` — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, TBT 50 ms, CLS 0.004.
- Final cold recheck: `.factory/evidence/polish-5/live-final/verify.json`; the deployed Terms split and demo raw title/canonical/Open Graph URL were confirmed.

No finding of any severity remains.
