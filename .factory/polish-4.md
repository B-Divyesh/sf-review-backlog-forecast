# Polish 4 — cumulative finding closure

**Base review:** `c18dd10e5c29441e4a5e2a004e16ddaba9a3f3b0`  
**Repair commit:** `6eddcaef297c1b2e2e8fd628d324923674436674`  
**Deployed build:** `1.0.8`  
**Live demo:** <https://review-backlog-forecast.sociobot.in/?demo=1&v=1.0.8>  
**Checked:** 2026-09-02 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Route loads and Back focus the destination h1 and announce it. | `moves focus to the new route heading and announces normal navigation and Back`; live `routeFocus: true` in `.factory/evidence/polish-4/live-audit.json`. |
| F-1-2 | Registered and retained the Steady sample target. | Clean-clone `npm test -- -t @claim:steady-recovery-target` passed. |
| F-1-3 | Registered and retained reachable and unreachable Deadline results. | Clean-clone `npm test -- -t @claim:deadline-feasibility` passed. |
| F-1-4 | Registered and retained the five-session Gentle ramp. | Clean-clone `npm test -- -t @claim:gentle-ramp` passed. |
| F-1-5 | Estimate labels and their effect are registered. | Clean-clone `@claim:adjustable-estimates` passed in desktop and mobile. |
| F-1-6 | Removed the redundant metaphor eyebrow; the h1 names the job directly. | Live root heading in `live-audit.json`; `.factory/evidence/polish-4/live-mobile-root.png`. |
| F-1-7 | Kept the direct section label `Forecast inputs`. | Full clean-clone browser suite, 78/78 passed. |
| F-1-8 | Kept `Import queue totals`. | `@claim:csv-import`, `@claim:grouped-csv-import`, and full suite passed. |
| F-1-9 | Kept `Compare recovery plans`. | Live demo screenshot `.factory/evidence/polish-4/live-desktop-demo.png`. |
| F-1-10 | Kept the result h1 `Three recovery plans`. | `opens a populated sample forecast in the first post-click viewport`; live screenshots. |
| F-1-11 | Kept the direct empty-state label `No forecast yet`. | `runs a forecast, selects a policy, and persists it` and full suite passed. |
| F-1-12 | Kept `Forecast assumptions`. | Full clean-clone browser suite passed. |
| F-1-13 | Kept the factual `Preview only` label. | Clean-clone `@claim:anki-isolation` passed in both projects. |
| F-1-14 | The long README test sentence remains split into two short sentences. | `.factory/copy-audit.md`; `keeps release documentation in plain words`. |
| F-1-15 | Standardized visitor wording on `overdue queue`, `recovery plan`, and `regular reviews`. | `uses one visitor-facing term for each forecast concept`; copy audit and live root check passed. |
| F-2-1 | Kept `Free` in the first desktop trust row. | `publishes route metadata, shared legal chrome, and build identity`; `.factory/evidence/polish-4/live-desktop-root.png`. |
| F-2-2 | Visitor footer says plans stay on this device. | Terminology regression test and live root footer check passed. |
| F-2-3 | Visitor-facing image-source jargon remains removed; the internal record stays in the design file. | Terminology regression test and live root screenshot. |
| F-3-1 | Demo mode hides the landing hero and opens on populated plan choices. | First-post-click viewport test; live desktop and mobile demo screenshots. |
| F-3-2 | IndexedDB completion controls the saved confirmation and the persistence test waits for it. | Clean-clone `@claim:local-persistence`; live saved-plan online/offline reload in `live-audit.json`. |
| F-3-3 | Banner copy is the factual `Explore the 320-card example.` | Live demo screenshots and URL verifier. |
| F-3-4 | The repeated hero eyebrow remains removed. | Live root screenshots. |
| F-3-5 | Import copy says `Enter totals or import a CSV.` | Copy audit and CSV claim tests. |
| F-3-6 | The saved-plan action says `Remove saved plan`. | `keeps focus indicators above 3:1 contrast on every dark planner surface` addresses the named control. |
| F-3-7 | The service-worker action says `Update app`. | `activates a waiting service-worker update without losing the demo` passed in both projects. |
| F-3-8 | README identifies the audience by cards and minutes planned by day. | `.factory/copy-audit.md`; clean-clone release tests. |
| F-3-9 | README explains unfinished regular reviews in plain words. | `.factory/copy-audit.md`; `@claim:rollover-visible`. |
| F-3-10 | README calls the product an installable offline web app. | `@claim:installability` passed in desktop and mobile. |
| F-3-11 | README says browser local database, with input and plan persistence registered. | `@claim:input-persistence` and `@claim:local-persistence`; live offline check. |
| F-3-12 | README explains that the browser offline cache keeps the app available. | `@claim:offline-reload`; live forecast and saved-plan offline reopen. |
| F-3-13 | Empty-state copy asks the visitor to edit a marked estimate. | `@claim:adjustable-estimates` passed. |
| F-3-14 | Registered cards and minutes for each daily row. | Clean-clone `@claim:daily-cards-minutes` passed in both projects. |
| F-3-15 | Registered edited-input persistence separately. | Clean-clone `@claim:input-persistence` passed in both projects. |
| F-3-16 | Added and retained three direct How it works steps. | `links How it works to three direct planning steps` passed. |
| F-3-17 | Every route uses the 180 × 180 Apple touch icon. | `publishes route metadata, shared legal chrome, and build identity` checks the link and PNG dimensions. |
| F-3-18 | Added local Anki Desktop count-to-CSV steps and a working template. | Clean-clone `@claim:anki-csv-steps` passed in both projects. |
| F-4-1 | Replaced `PWA/service-worker behavior` with `To test offline behavior`. | `keeps release documentation in plain words`; `.factory/copy-audit.md`. |
| F-4-2 | Replaced provenance jargon with `image source record`. | `keeps release documentation in plain words`; `.factory/copy-audit.md`. |

## Complete verification

- Fresh remote clone: `/tmp/rbf-polish4-clean-rdcg65` at `6eddcae`; `npm ci` reported 0 vulnerabilities.
- Every exact command in `.factory/claims.json` passed separately: 26/26 claims. Seven unit claim commands passed once each; 19 browser claim commands passed in desktop and 390 px mobile.
- Full clean-clone gates passed: `npm test` 20/20, lint, typecheck, build, and `npm run test:e2e` 78/78.
- Factory URL verifier: `.factory/evidence/polish-4/verify.json`; 853 ms, no console errors, correct title/lang, one h1, main, alt text, and named buttons.
- Standalone Axe CLI: `.factory/evidence/polish-4/axe-cli.json`; zero violations. Live Playwright Axe also found zero violations on demo, Privacy, Terms, and 404 in both viewports.
- Live audit: `.factory/evidence/polish-4/live-audit.json`; same-origin requests only, no console/page errors, reset to 320, focus/Back, HTTP 404, 200% mobile text, separate databases, Start for real, persistence, and offline reopen all passed.
- Live artifact identity: deployed `index.html` SHA-256 equals clean local `dist/index.html`: `4d39ce2dcc70c8524c11f5be538a151fe2219fb5af5af4d6cd7060920d1ffb45`.
- Fresh mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.004.

No finding of any severity remains.
