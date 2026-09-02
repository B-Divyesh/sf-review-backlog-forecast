# Independent verification 13 — FAIL

**Work order:** `review-backlog-forecast-verify-13`  
**Candidate:** `db8d1b88c35e520f960a5499532aaaa2ab0f11fc`  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL — the repository's full browser test command is flaky and did not pass.**

No product code was changed during verification. Only this report and the
handoff were updated.

## Release-blocking finding

### Medium — the delayed-import regression test is timing-dependent

The required clean-checkout command `npm run test:e2e` failed with 79 of 80
tests passing. The 390 px mobile instance of `disables forecasting until a
delayed file import finishes` failed at `tests/e2e/app.spec.ts:174`: after a
programmatic form submit, **Use this plan** was enabled when the test expected
it to remain disabled.

An isolated mobile stress run reproduced instability:

```text
npx playwright test --project=mobile \
  --grep 'disables forecasting until a delayed file import finishes' \
  --repeat-each=20
4 failed, 16 passed
```

The failures show the test's fixed 750 ms `File.text()` delay expires while
the test is still making several auto-retrying assertions. Depending on the
timing, the import legitimately finishes before the test asserts that the old
value must still be `320`; failures observed both the imported value `2` and a
newly enabled save action. The test needs a controllable promise/barrier which
the test releases only after checking the busy state. A wall-clock delay is
not deterministic under parallel load.

This is not evidence that the shipped import lock is broken. A fresh live
test used a controlled three-second read delay on desktop and 390 px mobile.
Before completion, **Run forecast** and **Use this plan** were disabled,
`aria-busy="true"` was present, the value remained `320`, and a programmatic
submit was ignored. After completion the value became `2`, Run forecast was
enabled, and save remained disabled until a new forecast ran. Nevertheless,
the acceptance contract requires every available test command to pass, so the
candidate cannot be accepted.

## Mandatory first-read and demo gate

**PASS.** A cold, storage-free production visit returned 200 and showed:

- What: “Plan an overdue queue before changing cards.”
- Who: “For learners returning after missed days, compare capped recovery
  plans before changing cards in Anki.”
- First action: **Try it with sample data**, with adjacent text saying it opens
  a 320-card example and saves nothing real.

The action was visible at y=717 in a 1440 × 900 first viewport. One click
opened `/?demo=1`; at 390 × 844 the persistent demo banner, all three policies,
and the first plan at y=348 were immediately visible. The banner includes
**Reset demo** and **Start for real**.

## Claims gate

`.factory/claims.json` exists and declares 26 claims. Each ID is unique, each
has exactly one matching `@claim:<id>` test in source, and there are no
undeclared claim tags. After `npm ci`, every exact command in the manifest
passed separately in declaration order. Browser claim commands passed on both
desktop and 390 px mobile. The initial pre-install discovery invocation could
not launch Vitest or TypeScript because a clean clone does not contain
`node_modules`; the lockfile install completed with 143 packages and zero
vulnerabilities before the valid claim runs.

Public landing, legal, offline, and README statements were cross-checked with
the registry. No unlisted material product claim was found.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages, 0 vulnerabilities |
| All 26 commands in `.factory/claims.json` | PASS separately after install |
| `npm test` | PASS — 20/20 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `npm run test:e2e` | **FAIL — 79/80; delayed-import mobile test failed** |
| Delayed-import stress repeat | **FAIL — 16/20 passed, 4/20 failed** |
| Service-worker update test alone | PASS — 2/2 desktop/mobile |

The production build contains 20.97 KiB of app JavaScript, 1.05 KiB of route
JavaScript, a 759-byte demo bootstrap, and 24.86 KiB of app CSS. The mobile hero
is 26.3 KiB and no fonts are downloaded. These are well inside the product
budgets.

## Independent product exercise

- Normal/demo: keyboard arrows selected Deadline and preserved radio focus;
  saving and reloading restored `Deadline · 320 overdue · 30-minute cap`.
- Export: Gentle produced `gentle-recovery-plan.csv` with the documented
  nine-column header and 28 daily rows.
- Minimum boundary: zero queue counts, three seconds/card, five-minute cap,
  two-day deadline, and one study day produced a valid 100-card capacity and
  three selectable plans.
- Maximum boundary: 100,000 overdue, due-today, and regular cards; 10,000 new
  cards; 300 seconds/card; 480-minute cap; 90-day deadline; and seven study
  days produced a valid 96-card capacity with no page error.
- Invalid/recovery: `100001` overdue cards focused the live error summary,
  explained the 0–100,000 range, and disabled save. Correcting values and
  rerunning restored all three plans and enabled save.
- Local regression coverage also passed impossible-date import rejection,
  stale forecast invalidation, backup round-trip, and both supported CSV
  shapes.
- Missed leverage: no AI feature is appropriate for this deterministic local
  forecast. The implied import, schedule export, and backup/restore handoffs
  are present and work.

## Privacy and server boundaries

A complete live import, forecast, save, reload, and export flow made only
same-origin GET requests with no request bodies. A unique raw-card marker was
absent from every request, IndexedDB, local storage, and session storage.
There were no console or page errors. No third-party font, script, analytics,
advertising, image, authentication, billing, or AI endpoint was contacted.

Source inspection found no product backend or product-unlock endpoint. API
rate allowance/429 behavior and Entra authority checks are therefore not
applicable to this static PWA.

## Accessibility, responsive behavior, and routes

- Playwright axe scans on live Demo, Privacy, Terms, and 404 pages found zero
  serious or critical WCAG A/AA findings on desktop and mobile.
- Every checked route has one h1, an English language declaration, a distinct
  title, and a main landmark. The live URL verifier found no missing image alt
  text, unnamed buttons, console errors, or page errors.
- Keyboard policy selection worked with arrow keys and kept focus. The skip
  target and focus outline are present. Existing tests verify dark-surface
  focus contrast and visible control behavior.
- At 390 px, document width equaled viewport width. At 200% root text size it
  still had no page-level horizontal overflow. The only measured 1 × 1 native
  controls are visually hidden file/radio inputs represented by larger labels;
  tested visible controls meet the 44 px target.
- Reduced-motion mode reported a 0.00001 s transition/animation duration and
  `scroll-behavior: auto`.
- Every discovered internal link returned 200 and every fragment target
  existed. An unknown route returned the styled 404 with HTTP 404.

## Deployment identity, headers, performance, and PWA

All 28 publicly served build artifacts matched the candidate's fresh `dist/`
files byte-for-byte by SHA-256. The live footer, manifest start URL, and worker
identify build `1.0.9`; the active cache is `rbf-v1.0.9-shell`.

HTML responses include CSP, HSTS, `nosniff`, frame denial, strict referrer
policy, and a restrictive permissions policy. Hashed assets use one-year
immutable caching; the manifest and service worker use `no-cache`; HTML uses
30-second revalidation. The manifest has the correct MIME type.

A fresh Lighthouse 12.8.2 mobile run against the live demo scored **98
Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**. It measured
FCP 1,111 ms, LCP 1,300 ms, TBT 165 ms, CLS 0.00446, Speed Index 1,111 ms, and
74,673 transferred bytes.

A fresh mobile context was controlled by the service worker. After saving
Gentle, an offline reload retained the populated forecast and saved-plan
summary and displayed “Offline · forecast still works.” The isolated
waiting-worker update test passed on desktop and mobile.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** one — the required delayed-import browser regression is flaky,
  causing the repository's full end-to-end command to fail.
- **Low:** none.

## Reproduce

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npx playwright test --project=mobile \
  --grep 'disables forecasting until a delayed file import finishes' \
  --repeat-each=20
```
