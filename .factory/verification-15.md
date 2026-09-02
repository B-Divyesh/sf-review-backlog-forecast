# Verification 15 — PASS

**Candidate:** `c9aaba416fc3d30607c3b120a6e9462b2e7fbeda`  
**Production URL:** <https://review-backlog-forecast.sociobot.in>  
**Verified:** 2026-09-02

## Decision

**PASS.** This is a working local-first recovery-plan preview for spaced-repetition learners returning after missed days. It imports queue totals, models Steady, Deadline, and Gentle plans under a hard session cap, explains estimates, and does not change Anki.

The cold first screen passes the plain-words and demo checks. It says what it does (plan an overdue queue before changing cards), who it is for (learners returning after missed days), and has the visible one-click **Try it with sample data** action. The next screen opens the populated 320-card sandbox, with the persistent demo banner, Reset demo, and Start for real controls.

## Required claim tests from the clean checkout

After `npm ci`, every exact command registered in `.factory/claims.json` was run separately, in declaration order. All passed. Unit claim tests each ran one tagged Vitest test; browser claim tests passed in both configured projects (desktop and 390 × 844 mobile).

| Claim | Exact command | Result |
| --- | --- | --- |
| `three-policies` | `npm test -- -t @claim:three-policies` | PASS |
| `hard-session-cap` | `npm test -- -t @claim:hard-session-cap` | PASS |
| `minutes-formula` | `npm test -- -t @claim:minutes-formula` | PASS |
| `rest-day-accrual` | `npm test -- -t @claim:rest-day-accrual` | PASS |
| `due-today-priority` | `npm test -- -t @claim:due-today-priority` | PASS |
| `rollover-visible` | `npm test -- -t @claim:rollover-visible` | PASS |
| `steady-recovery-target` | `npm test -- -t @claim:steady-recovery-target` | PASS |
| `deadline-feasibility` | `npm test -- -t @claim:deadline-feasibility` | PASS |
| `gentle-ramp` | `npm test -- -t @claim:gentle-ramp` | PASS |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS |
| `grouped-csv-import` | `npm run test:e2e -- --grep @claim:grouped-csv-import` | PASS |
| `anki-csv-steps` | `npm run test:e2e -- --grep @claim:anki-csv-steps` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `installability` | `npm run test:e2e -- --grep @claim:installability` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `no-forecast-transmission` | `npm run test:e2e -- --grep @claim:no-forecast-transmission` | PASS |
| `adjustable-estimates` | `npm run test:e2e -- --grep @claim:adjustable-estimates` | PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| `local-persistence` | `npm run test:e2e -- --grep @claim:local-persistence` | PASS |
| `saved-plan-offline` | `npm run test:e2e -- --grep @claim:saved-plan-offline` | PASS |
| `input-persistence` | `npm run test:e2e -- --grep @claim:input-persistence` | PASS |
| `backup-roundtrip` | `npm run test:e2e -- --grep @claim:backup-roundtrip` | PASS |
| `schedule-export` | `npm run test:e2e -- --grep @claim:schedule-export` | PASS |
| `daily-cards-minutes` | `npm run test:e2e -- --grep @claim:daily-cards-minutes` | PASS |
| `clear-local-data` | `npm run test:e2e -- --grep @claim:clear-local-data` | PASS |
| `anki-isolation` | `npm run test:e2e -- --grep @claim:anki-isolation` | PASS |
| `no-third-party-runtime` | `npm run test:e2e -- --grep @claim:no-third-party-runtime` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |

## Clean-checkout quality gates

- `npm test`: PASS — 23/23 tests.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; emitted `dist/`.
- `npm run test:e2e`: PASS — 82/82 tests; `test-results/.last-run.json` reports `status: passed`.
- Production build budgets: entry JS is 20.99 kB / 8.01 kB gzip and app CSS is 24.86 kB / 5.98 kB gzip.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.2 s, TBT 60 ms, CLS 0.004.

## Independent live verification

- `/opt/fleet/lib/verify-url.sh` passed for `/demo/`: HTTP 200, `lang=en`, one `h1`, a `main`, all images have alt attributes, no unlabeled buttons, and no console/page errors.
- A fresh desktop first-read showed the plain-language first screen described above. Its primary link opened `/demo/`, whose title is `Demo — Review Backlog Forecast` and which rendered all three plan radios.
- Normal use: changing a demo input made the existing forecast stale and disabled Save/export; rerunning restored a 150-card, 30-minute forecast. Invalid `-1` overdue input focused the `role=alert` error. Arrow navigation selected and kept focus on Deadline; the visible focus outline is solid 3 px.
- Privacy: the complete live demo interaction made 18 same-origin requests only, all `GET`, with document/script/stylesheet/image resource types only. There were no API, Anki, analytics, font, account, billing, or third-party requests. The exact claim tests separately exercise marked CSV content, plan storage, and request bodies.
- Offline/PWA: after service-worker control, the live demo reloaded offline with all three policies and `Offline · forecast still works`. `registration.update()` completed; the active worker is `/sw.js`, cache is `rbf-v1.0.10-shell`, and the manifest is standalone with 192, 512, and maskable 512 icons.
- Mobile: at 390 px the page width equalled viewport width (390 px), without horizontal overflow; reduced motion made root scrolling `auto`.
- Accessibility: independent Playwright Axe scans on Demo, Privacy, Terms, and the real 404 returned zero violations on desktop and 390 px mobile, including zero serious/critical findings. Standalone `npx @axe-core/cli` was also attempted, but its Selenium launcher cannot find a system Chrome binary in this worker; the direct Playwright Axe checks used the installed Chromium successfully.
- Security and caching: live response headers include CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, HSTS, Referrer-Policy, Permissions-Policy, and `X-Frame-Options: DENY`. Hashed assets are `public, max-age=31536000, immutable`; `sw.js` and the manifest are `no-cache`; an unknown route returns HTTP 404.
- Deployment match: SHA-256 comparison of all 23 locally built, publicly served files against production found no differences. The live footer reports Build `1.0.10`.

## Scope checks and defects

There is no server-side product endpoint, product-unlock call, account flow, payment flow, or sign-in flow. Therefore request allowance/429 enforcement and Entra tenant checks do not apply.

**Defects by severity:** none. No release-blocking defects found.
