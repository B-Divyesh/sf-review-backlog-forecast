# Handoff — polish 3 complete

## Status

**PASS.** Build `1.0.6` is deployed to <https://review-backlog-forecast.sociobot.in/?demo=1>.

Repair commit: `b5e45b80241f349367bd33f78c4fbc6effb4aa09` (`fix: complete review three repair set`).

## What changed

- Made `?demo=1` a result-first, isolated sample workspace. It opens with the populated Steady, Deadline, and Gentle plans in view, retains the persistent demo banner, and offers Reset demo and Start for real.
- Fixed IndexedDB persistence so saves resolve only after the transaction commits. Edited valid inputs and chosen plans persist separately inside the demo database.
- Finished the terminology repair: `overdue queue`, `recovery plan`, and `regular reviews` are used consistently in visitor copy, runtime messages, and manifest metadata.
- Rewrote every review-3 copy finding, added direct three-step How it works content, named destructive/update controls precisely, and added local Anki count-to-CSV instructions.
- Added three registered claim tests: `anki-csv-steps`, `input-persistence`, and `daily-cards-minutes`.
- Added the required 180 × 180 Apple touch icon, route metadata coverage, and live mobile/desktop evidence.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e -- --workers=4
```

Every claim command is listed in `.factory/claims.json`. Open `/?demo=1` for the one-click sandbox. Its documented sample and separate storage namespace are in `.factory/demo.md`.

## Exact verification evidence

- Fresh clone: `/tmp/review-backlog-forecast-clean-aNihqk` at `b5e45b8`.
- Fresh clone `npm ci`: 143 packages, 0 vulnerabilities.
- Every exact command in `.factory/claims.json` passed from that clone: 7 tagged Vitest claims and 16 tagged Playwright claims, with each browser claim passing in desktop and mobile.
- Fresh clone gates passed: `npm test` (19 tests), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e -- --workers=4` (70 passed).
- The local full browser suite also passed three consecutive times (70 passed each), specifically rechecking deterministic `@claim:local-persistence`.
- Build output: application JavaScript 7.87 kB gzip; CSS 5.87 kB gzip.
- Deployed using `swa deploy ./dist --env production --app-name sf-review-backlog-forecast --resource-group sociobot`.
- Cold live verifier passed at `?demo=1&v=1.0.6`: `.factory/evidence/polish-3/live-1/verify.json` records 678 ms load, zero console errors, `lang=en`, one h1, main, alt text, and labelled buttons.
- Live desktop/mobile flow, screenshots, route-focus checks, and live Playwright Axe results are in `.factory/evidence/polish-3/live-1/`. The Axe scan found no serious or critical violations on Demo, Privacy, Terms, or the designed 404.

## Known gaps

None. The product remains a static, offline-capable PWA with local browser storage and no third-party runtime services.
