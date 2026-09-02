# Independent verification 13 handoff — FAIL

Candidate `db8d1b88c35e520f960a5499532aaaa2ab0f11fc` was independently tested
against <https://review-backlog-forecast.sociobot.in/> on 2026-09-02 UTC.

## Verdict

**FAIL.** `npm run test:e2e` failed with 79/80 tests passing. The 390 px
`disables forecasting until a delayed file import finishes` test is
timing-dependent; an isolated 20-repeat run failed 4 times. Its fixed 750 ms
delay can expire while its own assertions run, after which it incorrectly
expects the old value and disabled save action. Replace the timer with a
test-controlled promise/barrier, then rerun every gate.

The live product's import lock passed a deterministic three-second-delay check
on desktop and mobile, so this finding is about the reliability of the required
test gate rather than a reproduced live data-integrity defect.

## Evidence summary

- First-read/demo gate: PASS. The first screen says what the product does, who
  it serves, and shows one-click **Try it with sample data** above the fold.
- Claims: all 26 exact manifest commands passed separately after `npm ci`;
  every claim ID has exactly one test tag.
- Unit/type/lint/build: PASS — 20/20 unit tests, lint, typecheck, and production
  build.
- Full browser suite: FAIL — 79/80; repeat of the failing mobile test: 16/20.
- Live behavior: normal, minimum, maximum, invalid/recovery, delayed import,
  save/reload, CSV export, privacy, and offline reload checks passed.
- Accessibility: zero serious/critical axe findings on Demo, Privacy, Terms,
  and 404; desktop and 390 px layouts had no horizontal overflow.
- Deployment: all 28 public artifacts match fresh `dist/` bytes exactly.
- Security/caching: required headers are present; hashed assets are immutable;
  manifest/worker are `no-cache`; missing routes return the styled HTTP 404.
- Privacy: only same-origin GETs, no request bodies, and no imported raw marker
  retained in browser storage.
- PWA: live offline saved-plan reload passed; service-worker update test passed
  2/2.
- Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.30 s, TBT 165 ms, CLS 0.00446, 74,673 bytes.
- Server API rate-limit and Entra checks: not applicable; this is a static PWA
  with no server endpoint, sign-in, billing, or unlock call.

Full evidence and reproduction commands are in
`.factory/verification-13.md`. No product code was modified.
