# Independent verification 12 — FAIL

**Work order:** `review-backlog-forecast-verify-12`  
**Candidate:** `5371959381f9fee0185179fb802defe13a09ce23`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL — do not release until the import/forecast race and its failing claim test are corrected.**

No product source was changed during verification. Only this report and the
handoff were updated.

## Release-blocking defect

### Medium — importing and immediately forecasting can use the previous values

The mandatory first run of every command in `.factory/claims.json` failed on
`@claim:local-only`. Its mobile test timed out after 30 seconds waiting to click
**Use this plan**, which remained disabled. The desktop half passed. The exact
failing command was:

```sh
npm run test:e2e -- --grep @claim:local-only
```

The browser trace in the failure output showed the test had clicked **Run
forecast**, but **Use this plan** became and stayed disabled. This makes the
claims gate fail under the acceptance contract, regardless of later passes.

The behavior has a reproducible product cause. The file-change listener waits
for asynchronous `file.text()` while **Run forecast** remains enabled. A user
can run the forecast against the previous values before parsing finishes. When
the import completes, it updates the fields, marks the displayed result stale,
and disables both **Use this plan** and **Export schedule**.

A fresh 390 × 844 live context with a controlled 750 ms `File.text()` delay
reproduced the sequence:

- the import eventually displayed `2` overdue cards;
- status became “This forecast is out of date. Run forecast before saving or
  exporting a schedule.”;
- save and export were both disabled;
- clicking **Run forecast** a second time recovered the flow and enabled save.

This can affect a real slow device or a larger accepted file. Disable forecast
actions while import parsing is in progress, or make forecast submission await
the active parse. The claim test should also wait for the successful import
message before running the forecast, while a separate regression test covers
the rapid import-then-run interaction.

The exact claim command passed when rerun, and the claim passed inside the full
suite. That confirms timing sensitivity; it does not erase the mandatory first
run failure or the live race.

## First-read and demo gate

**PASS.** A cold, storage-free live visit returned 200 and the first viewport
answered all three required questions:

- What: “Plan an overdue queue before changing cards.”
- Who: “For learners returning after missed days, compare capped recovery
  plans before changing cards in Anki.”
- First action: **Try it with sample data**, with adjacent text explaining that
  it opens a 320-card example and saves nothing real.

One click opened `/?demo=1`. The first mobile viewport contained the first plan
card at y=348 px. Three plan cards were present, and the persistent banner said
“Demo — sample data, nothing is saved to your real plan,” with **Reset demo**
and **Start for real** controls.

## Claims gate

**FAIL.** `.factory/claims.json` exists with 26 unique claims, and every claim
tag occurs exactly once in the unit or browser tests. From the clean candidate
checkout after `npm ci`, every listed command was run separately in manifest
order:

- 25 claim commands exited 0;
- `@claim:local-only` exited 1 because its mobile half timed out on the disabled
  save action;
- the same exact command later passed 2/2, and the full suite also passed it.

The other passing claims cover all three policies, caps, due-today priority,
rollover, sample targets, both CSV formats, Anki instructions, installability,
offline reload, privacy, demo isolation, local persistence, backup and schedule
exports, daily cards/minutes, clearing data, and the no-account boundary.

Landing, legal, runtime, and README promises were cross-checked against the
registry. No unlisted public claim was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages; 0 vulnerabilities |
| `npm test` | PASS — 20/20 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — exact production build generated `dist/` |
| `npm run test:e2e` | PASS — 78/78 across desktop and 390 px mobile |

The full browser suite includes keyboard focus, contrast, touch targets,
desktop/mobile axe, invalid input, metadata, 404, startup CLS, offline reload,
installability, and a simulated service-worker update from `rbf-v1.0.8` to
`rbf-v1.0.9` without losing the demo.

## Independent end-to-end checks

- **Normal case:** selected Deadline with ArrowRight, retained keyboard focus,
  saved it, and reloaded `Deadline · 320 overdue · 30-minute cap`.
- **Exports:** the selected schedule downloaded with the documented nine-column
  header and 28 day rows. JSON backup contained version 1, the 320-card input,
  and the selected Deadline plan.
- **Minimum boundary:** zero queues, 3 seconds per card, 5-minute cap, 2-day
  deadline, and one study day produced a valid 100-card capacity forecast.
- **Maximum boundary:** 100,000 in each review-count field, 10,000 new cards,
  300 seconds per card, a 480-minute cap, 90 days, and seven study days produced
  a valid 96-card-capacity forecast without a browser error.
- **Invalid and recovery:** 100,001 overdue cards focused the error summary,
  hid stale results, and disabled save/export. Correcting it and rerunning
  recovered. `2026-02-31` produced a row-specific real-date error; importing a
  valid summary afterward produced 125 overdue, 31 due today, and 22 regular
  reviews.
- **Missed leverage:** no model-assisted feature is warranted. The researched
  job is deterministic local forecasting, and the product includes the implied
  import, backup, and schedule-export handoffs.

## Privacy, endpoints, and deployment identity

The complete independent privacy flow observed six page requests. Every one
was a same-origin GET for a document, script, stylesheet, or image; no request
body was sent. A unique raw-card marker was absent from every request and from
IndexedDB, local storage, and session storage. No console or page errors
occurred.

Source and runtime request inspection found no server-side product API,
product-unlock call, sign-in, billing, or payment path. Request allowance/429
and Entra authority checks are therefore not applicable to this static PWA.

All 28 publicly served build files matched the fresh candidate `dist/` files
byte-for-byte by SHA-256. This includes HTML, JavaScript, CSS, source maps,
manifest, worker, images, icons, legal pages, and crawl files. In particular,
local and live `index.html` both hash to:

```text
4d39ce2dcc70c8524c11f5be538a151fe2219fb5af5af4d6cd7060920d1ffb45
```

The candidate is a documentation commit on top of product build `1.0.8`, and
the live footer, manifest, and worker all identify build `1.0.8`.

## Accessibility, mobile, routing, and headers

- `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, title and
  `lang=en`, one h1, main landmark, no missing alt text, no unnamed buttons,
  and no console/page errors.
- Independent Playwright axe scans found zero serious/critical WCAG 2/2.1
  A/AA findings on Demo, Privacy, Terms, and the styled 404 in desktop and
  390 px mobile contexts.
- Skip-link activation focused `main`; policy radios worked with arrows and
  retained focus. The full suite verified at least 3:1 focus indicators on the
  dark planner surfaces.
- At 390 px, document width equaled viewport width. The first plan was in the
  post-click viewport, and 200% text produced no page overflow. Direct 1 × 1
  controls were only visually hidden file/radio inputs with larger labelled
  hit areas; tested visible help, footer, and Undo targets meet 44 px.
- Reduced-motion mode changed transition and animation durations to 0.00001 s
  and scrolling to `auto`.
- All collected same-origin links returned 200 and every fragment target
  existed. An unknown route returned the styled page with HTTP 404.
- HTML responses include CSP, HSTS, `nosniff`, strict referrer policy,
  permissions policy, and frame denial. Hashed assets/icons are cached for one
  year as immutable; `manifest.webmanifest` and `sw.js` use `no-cache`; HTML
  uses 30-second revalidation.

## Performance and PWA

A fresh mobile Lighthouse 12.8.2 run scored **95 Performance, 100
Accessibility, 100 Best Practices, and 100 SEO**. It measured FCP 1.1 s, LCP
1.3 s, TBT 270 ms, CLS 0.004, Speed Index 1.1 s, and 73 KiB transferred.
Independent interaction entries reached 40 ms at most, with measured
interaction durations of 24, 24, and 16 ms.

Initial application assets remain far below the budgets:

- JavaScript: 22,369 bytes raw / 8,874 bytes gzip across app, route focus, and
  demo bootstrap;
- CSS: 24,814 bytes raw / 5,944 bytes gzip;
- mobile hero: 26,300 bytes;
- fonts: no runtime font request.

Chromium reported zero installability errors. A fresh mobile context was
controlled by `/sw.js`, with active cache `rbf-v1.0.8-shell` and no waiting
worker. After saving Gentle, an offline reload retained the complete forecast,
the saved summary, enabled export, and showed “Offline · forecast still
works.” The full local suite passed the waiting-worker update path.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** one — asynchronous file import races with forecast submission,
  and the mandatory `local-only` claim command failed on its first run.
- **Low:** none.

## Re-run

```sh
npm ci
# Run every exact command in .factory/claims.json separately, in order.
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
/opt/fleet/lib/verify-url.sh 'https://review-backlog-forecast.sociobot.in/?demo=1' /tmp/rbf-verify
```
