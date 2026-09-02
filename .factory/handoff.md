# Repair handoff — PASS

## Outcome

Release blocker from independent verification 12 is repaired and deployed.
The shipped repair is source commit `4de93fae0d52a235478c87d421cb60042aca973e`
(`fix: serialize forecast during file imports`), based on the verifier's
candidate `5371959381f9fee0185179fb802defe13a09ce23`. It is pushed to `main`
and deployed as build `1.0.9` to
<https://review-backlog-forecast.sociobot.in/>.

## What changed

- Reproduced the verifier's exact 390 px sequence on the unchanged candidate
  with `File.text()` held for 750 ms: a rapid Run forecast used the old demo
  values, then the finished import showed 2 overdue cards and left both save
  and export disabled as stale.
- While a selected file is parsing, the file control and **Run forecast** are
  disabled. The import message says that reading is in progress, and the form
  and action expose `aria-busy="true"`.
- The existing forecast is made stale before the asynchronous read starts, and
  the submit listener has a defensive import-in-progress guard for Enter or
  programmatic submits.
- Added deterministic desktop and 390 px coverage that delays `File.text()`
  by 750 ms, asserts the submit action cannot use the old 320-card sample,
  waits for the imported 2-card values, then verifies a new forecast enables
  **Use this plan**.
- The `@claim:local-only` privacy test now explicitly waits for each import's
  success message before forecasting or checking storage. This removes its
  timing sensitivity without weakening its raw-content assertions.
- Bumped the PWA cache/manifest/build identity from `1.0.8` to `1.0.9`, so an
  installed app receives a new worker cache after this release.

## Verification

All checks below ran against the final `1.0.9` source/build unless noted.

- `npm ci` — PASS: 143 packages, 0 vulnerabilities.
- Every one of the 26 commands in `.factory/claims.json` — PASS when run
  separately in manifest order. This includes a first clean pass of
  `npm run test:e2e -- --grep @claim:local-only` on both desktop and 390 px.
- `npm test` — PASS: 20 tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS; also runs as part of the production build.
- `npm run build` — PASS and produces `dist/index.html`.
- `npm run test:e2e` — PASS: 80 tests across desktop and 390 × 844 mobile.
  It covers keyboard/skip links/policy radios, touch targets, text zoom,
  desktop/mobile axe scans, raw-data privacy, offline reload, installability,
  saved-plan reopening, and the service-worker update path. The update test
  now verifies `rbf-v1.0.9` progressing to a simulated `rbf-v1.0.10` cache.
- `/opt/fleet/lib/verify-url.sh 'http://127.0.0.1:4173/?demo=1'` — PASS:
  200, Demo title, `lang=en`, one h1, main landmark, no missing image alt or
  unnamed buttons, and no browser errors.
- Lighthouse 12.8.2, local final mobile demo — 100 Performance, 100
  Accessibility, 100 Best Practices, 100 SEO; LCP 1,509 ms, CLS 0.00446,
  75,581 bytes transferred. Final raw/gzip application assets are 20.97/7.98
  KiB JS and 24.86/5.98 KiB CSS.

## Deployment and live evidence

Deployment used `/opt/fleet/lib/deploy-static.sh review-backlog-forecast dist`
only. It reused the scoped `sf-review-backlog-forecast` Static Web App in
`eastus2`; deployment `a8807e11-7ca0-4622-a6ef-095301000585` completed
successfully. The custom production domain returned HTTPS 200 afterward.

- Live URL verifier on `/?demo=1` passed: no console/page errors, title
  `Demo — Review Backlog Forecast`, `lang=en`, one h1, main, and valid image
  and button labels.
- A fresh live Playwright run on desktop and 390 px delayed every `File.text()`
  call by 750 ms. On both, Run forecast stayed disabled while the old sample
  was present; after the 2-overdue/1-due-today import finished, it enabled and
  a fresh forecast enabled save. Live axe scans had zero serious or critical
  findings and both runs had zero console errors.
- Live identity matches the release: footer build `1.0.9`, manifest
  `start_url` version `1.0.9`, and worker cache version `rbf-v1.0.9`.
- Live response checks: root 200; missing route 404; hashed assets use one-year
  immutable caching; manifest and worker use `no-cache`; CSP, HSTS,
  `nosniff`, strict referrer policy, permissions policy, and frame denial are
  present. Manifest returns `application/manifest+json`.

## Privacy and known gaps

The product remains static and local-first: no account, API, analytics,
third-party runtime, Anki connection, or payment path was added. The final
claim runs verify same-origin GET-only traffic and that imported raw markers
are absent from storage and requests.

Known gaps: none.

## Run it again

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

To exercise the product directly, open `/?demo=1`. Select a CSV and observe
the import status before **Run forecast** becomes available; the demo uses its
separate local database and can be reset from its persistent banner.
