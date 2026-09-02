# Independent verification 14 — PASS

**Work order:** `review-backlog-forecast-verify-14`  
**Candidate commit:** `bd739e666a56aaaa921e3a80cb2ff21361263d4f`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **PASS**

No product code was changed during this verification. This report and the
handoff are the only changes.

## Mandatory cold first-read and demo gate

**PASS.** A cold, storage-free production visit returned 200. Its first screen
answers the required questions in plain words:

- What it does: “Plan an overdue queue before changing cards.”
- Who it is for: “For learners returning after missed days … in Anki.”
- What to click first: one visible **Try it with sample data** link, followed
  by “See a 320-card overdue queue plan. Nothing real is saved.”

One click opens `/?demo=1`. The persistent banner says “Demo — sample data,
nothing is saved to your real plan” and provides **Reset demo** and **Start for
real**. The sample immediately presents Steady, Deadline, and Gentle plans.

## Claims gate

`.factory/claims.json` exists and lists 26 claims. After a clean `npm ci`
(143 packages; 0 vulnerabilities), every declared command passed in manifest
order through the app's demo entry point:

- Seven `npm test -- -t @claim:…` commands passed for the policy, cap,
  due-today, rollover, Steady, Deadline, and Gentle simulation claims.
- Nineteen `npm run test:e2e -- --grep @claim:…` commands passed for CSV and
  Anki-count import, offline reload, installability, local-only/privacy,
  editable estimates, demo isolation, persistence, backup/export, daily
  ledger, clearing data, Anki isolation, no third-party runtime, and no
  account/payment.

The final exact claim run, `@claim:no-account`, completed with a passing
Playwright result; the sequential `set -e` run reached it, so no earlier claim
command failed. The full browser suite below independently re-ran all claim
tests across desktop and 390 px mobile.

No unlisted material product claim was found on the landing, legal, or README
copy. The deterministic local forecast needs no AI feature; the brief-implied
CSV import, preview, export, and backup/restore paths are present.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages; 0 vulnerabilities |
| all 26 declared claim commands | PASS |
| `npm test` | PASS — 20/20 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `npm run test:e2e` | PASS — 80/80, desktop and 390 × 844 mobile |
| `verify-url.sh http://127.0.0.1:4173/?demo=1` | PASS — HTTP 200; title, `lang`, one h1, main, alt text, labels, and console/page errors all clean |

The client build is 20.97 KiB app JavaScript (7.98 KiB gzip), 1.05 KiB route
JavaScript, and 24.86 KiB CSS (5.98 KiB gzip). The mobile hero is 26.3 KiB.
All are inside the static/PWA budgets and no font is fetched.

## Independent product exercise

- Normal flow: the one-click demo renders a realistic 320-overdue-card plan;
  all three distinct policies show daily cards and minutes.
- Boundary/recovery: a negative overdue count is rejected by native range
  validation (“Value must be greater than or equal to 0.”), focus moves to the
  error summary, and correcting it to 321 then rerunning restores the forecast.
- Keyboard/mobile: at 390 px the document width equals the viewport width;
  selecting Deadline by radio control works and has no console/page error.
  The full suite verifies arrow-key policy navigation, skip link, focus
  contrast, 44 px targets, and 200% text without horizontal overflow.
- Reduced motion: the production stylesheet has the required
  `prefers-reduced-motion: reduce` override; the full suite covers the UI
  interaction paths without animation-dependent behavior.

The product correctly remains a reversible count-and-time preview. It does
not connect to, reschedule, or claim to simulate Anki/FSRS scheduling.

## Privacy, headers, PWA, and deployment identity

On a fresh live visit and demo transition, the request log contained only
same-origin GETs: document, local JS/CSS/image assets, and the same-origin demo
URL. There were no console or page errors, no third-party runtime, no auth,
payment, analytics, Anki, AI, or backend endpoint. The claim tests additionally
cover unique raw import marker, counts, assumptions, and saved-plan markers
through import/save/reload/export flows.

This is a static PWA with no server-side product endpoint or product-unlock
call; rate-limit/429 and Entra sign-in checks are not applicable.

Live responses include CSP with `connect-src 'self'`, HSTS, `nosniff`, frame
denial, strict referrer policy, and restrictive permissions policy. Hashed
assets are `max-age=31536000, immutable`; HTML is 30-second revalidation; the
manifest and worker are `no-cache`. An unknown route returns the styled 404
with HTTP 404.

A fresh live context gained service-worker control for `/sw.js`, had active
cache `rbf-v1.0.9-shell`, then reloaded the populated demo forecast while
offline with “Offline · forecast still works” visible and no console error.
The full 80-test suite includes the controlled waiting-worker update test and
passed it. The live manifest is standalone, has valid 192/512/maskable icons,
and identifies `v=1.0.9`.

Candidate deployment identity is confirmed: the live root HTML SHA-256 equals
the fresh `dist/index.html` SHA-256, and the live app JS, CSS, route JS, service
worker, manifest, and all three PWA icon bytes match the fresh candidate
`dist/` files exactly. Their hashes and the cache/manifest build all identify
version 1.0.9.

Live Lighthouse (mobile) scored **93 Performance, 100 Accessibility, 100 Best
Practices, and 100 SEO**: FCP 1.1 s, LCP 1.3 s, TBT 330 ms, CLS 0.004.
Live axe scans found zero serious or critical WCAG A/AA violations.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```
