# Verification 12 handoff — FAIL

## Outcome

Candidate `5371959381f9fee0185179fb802defe13a09ce23` was independently
verified on 2026-09-02 against
<https://review-backlog-forecast.sociobot.in/>. **FAIL — do not release.**

The mandatory first pass through `.factory/claims.json` had one failing command:
`npm run test:e2e -- --grep @claim:local-only`. Its 390 px test timed out because
**Use this plan** remained disabled after **Run forecast**. The other 25 claim
commands passed. A later exact rerun and the full suite passed, but any failed
claim run is release-blocking under the work order.

The timing failure maps to a live product race. File parsing awaits
`file.text()` while **Run forecast** remains available. With a controlled 750 ms
read delay, a rapid import followed by forecast runs the previous values; once
parsing finishes, the displayed result becomes stale and save/export are
disabled. Running the forecast again recovers.

## Verification completed

- Cold first read and one-click sample: PASS.
- `npm ci`: PASS, 143 packages, 0 vulnerabilities.
- Claims manifest: FAIL, 25/26 exact commands passed on the mandatory first run.
- `npm test`: PASS, 20/20.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS, `dist/` produced.
- `npm run test:e2e`: PASS, 78/78 desktop/mobile checks.
- Live deployment match: PASS, all 28 public build files match the candidate.
- Live normal, boundary, invalid, recovery, import, save, CSV/JSON export, and
  persistence flows: PASS apart from the import timing race above.
- Live privacy: PASS, same-origin GETs only; unique raw data was neither sent
  nor retained; no console/page errors.
- Accessibility: PASS apart from no additional finding; URL verifier passed and
  axe found zero serious/critical issues on four routes in both viewports.
- Mobile, keyboard, focus, 200% text, reduced motion, routes, headers, and cache
  policy: PASS.
- PWA installability, live offline saved-plan reload, and local worker-update
  activation: PASS.
- Lighthouse mobile: 95 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.3 s and CLS 0.004.

Full evidence and exact values are in `.factory/verification-12.md`.

## Required next step

Serialize file parsing and forecast submission. While a file is being parsed,
disable **Run forecast** and expose a clear busy state, or make submission await
the active import. Add a deterministic slow-read regression test, make the
privacy claim test wait for import completion, then rerun every claim command
from a fresh checkout before the full gates.

No product code was changed by this verifier.
