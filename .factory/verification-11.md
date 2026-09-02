# Independent verification 11 — PASS

**Candidate:** `fdfe4b7f92ff42f9488f3914a64df99b9d737f20` (`fix: preserve mobile layout at text zoom`)

**Verified:** 2026-09-02 UTC  
**Live URL:** <https://review-backlog-forecast.sociobot.in/?demo=1>

## Verdict

**PASS — release candidate accepted.** No release-blocking defects found.

The deployed `index.html` SHA-256 exactly matches a fresh candidate production
build:

```
d5d85db14491951215270d7f5fd670c3958405cd615b979fe4eaea75a4ed3875
```

The only later commit on `origin/main` before this report was documentation;
there was no product-code difference from the candidate.

## First read and end-to-end product check

A cold live visit plainly says it plans an overdue queue before changing cards,
is for learners returning after missed days, and has the visible one-click **Try
it with sample data** action. Its adjacent text says it opens a 320-card plan
and saves nothing real. Clicking it immediately opened the populated
three-policy forecast with its persistent demo banner, Reset demo, and Start
for real controls.

The demo was exercised through normal plan selection/save, summary and grouped
CSV imports, invalid date/count recovery, unreachable deadline, estimate edits,
CSV/JSON export and restore, clear data, offline reopen, and service-worker
update activation. It meets the brief's local import-and-preview job without
connecting to or changing Anki.

## Required claim tests

Ran every exact command declared in `.factory/claims.json` after `npm ci` from
a clean checkout: **26/26 passed.** The seven Vitest claim commands and nineteen
exact Playwright claim commands all passed, including both desktop and 390px
mobile projects. Coverage includes every registered policy, cap, rollover,
import, privacy, demo isolation, persistence, export, offline, installability,
account, and runtime-dependency promise. Logs were retained at
`/tmp/<claim-id>.log` during the run.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 0 vulnerabilities reported |
| `npm test` | PASS — 19/19 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; generated `dist/` |
| `npm run test:e2e` | PASS — 78/78; `.last-run.json` says `passed` |
| Initial app JS | PASS — 7,857 B gzip (under 200 KB) |
| App CSS | PASS — 5,964 B gzip (under 50 KB) |

The browser suite exercises desktop/390px layout, keyboard/focus, error
recovery, touch targets, serious/critical axe checks, metadata/404, CLS,
offline reload, installability, and a waiting service-worker update that keeps
the demo usable.

## Live QA evidence

- `/opt/fleet/lib/verify-url.sh` on the live demo: **200**; title `Demo —
  Review Backlog Forecast`, `lang=en`, one h1, main landmark, no missing image
  alt/unlabeled buttons, and no console errors
  (`/tmp/review-backlog-forecast-verify-11/verify.json`).
- Fresh Playwright desktop and 390×844 mobile contexts: **200**, no console or
  page errors, zero serious/critical axe findings, no horizontal mobile
  overflow, and active reduced-motion preference.
- All observed demo-flow requests were same-origin
  `https://review-backlog-forecast.sociobot.in`; resource types were document,
  script, stylesheet, and image only. No external fonts, analytics, Anki,
  account, billing, or payment requests occurred.
- In both fresh contexts the service worker controlled the app. After offline
  reload the complete forecast remained visible. The local suite separately
  verified waiting-worker update notification and activation.
- Live headers include HSTS, nosniff, strict referrer policy, self-only
  script/connect CSP with `frame-ancestors 'none'`, Permissions-Policy, and
  `X-Frame-Options: DENY`. Hashed assets are immutable for a year; `sw.js` is
  no-cache; the styled unknown route returns HTTP 404.

## Findings

No release-blocking, high, medium, or low product defects found.

## Environment note

Lighthouse 12.8.2 could not run here: its supplied Playwright
`chrome-headless-shell` crashed under Lighthouse, so no Lighthouse score is
claimed. This is not a product defect; the independent checks above establish
semantics, accessibility, offline behavior, request privacy, caching, and
bundle budgets. Live `verify-url.sh` cold load was 545 ms.

