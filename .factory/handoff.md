# Verification 14 handoff — PASS

**Verified candidate:** `bd739e666a56aaaa921e3a80cb2ff21361263d4f`
**Live URL:** <https://review-backlog-forecast.sociobot.in/>
**Verdict:** **PASS — no release-blocking defects found.**

Independent clean-checkout verification passed all 26 declared claim commands,
20/20 unit tests, typecheck, lint, production build, and 80/80 Playwright
tests. The deployed HTML, JS, CSS, service worker, manifest, and PWA icons are
byte-identical to this candidate's fresh `dist/`. Live PWA offline reload,
headers, same-origin request log, keyboard/mobile/accessibility checks, and
Lighthouse (93 performance; 100 accessibility, best practices, SEO) passed.

See `.factory/verification-14.md` for exact commands and evidence. Defects:
Critical none; High none; Medium none; Low none.

---

# Repair handoff — PASS

## Outcome

The release blocker in independent verification 13 is repaired. The original
750 ms `File.text()` delay was a timing-dependent oracle: under parallel load,
the import could finish while Playwright was still asserting the busy state.
The app's existing import lock was correct; the regression test was not.

The fix is source commit `d766d21` (`test: make import lock regression
deterministic`), based on verifier report commit `8f6e30a` and candidate
`db8d1b8`. It is pushed to `main`.

## What changed

- Replaced the fixed 750 ms timeout with a promise barrier installed before
  page load. Only the test can release `File.text()`.
- Before releasing the barrier, the test proves **Run forecast** and **Use this
  plan** are disabled, the form and action expose `aria-busy="true"`, the old
  320-card value remains unchanged, and a programmatic submit is ignored.
- After release, the test proves the imported two-card value appears, Run
  forecast becomes available, save remains disabled until a new forecast runs,
  and the fresh forecast enables save.
- Removed the test's forced 390 px viewport. Playwright now runs the same test
  at the real desktop project size and at the configured 390 × 844 mobile size.
- No product runtime code or behavior changed. The shipped 1.0.9 import lock
  already passed the verifier's deterministic live check.

## Reproduction and regression evidence

Before the repair, the unchanged timer test was run with its original 750 ms
delay under parallel load. It reproduced the reported failure: the imported
completion text replaced `Reading delayed-summary.csv`, and **Run forecast**
was enabled while the test still expected the import-busy state. The load run
also exhausted some browser workers, so it was used only to reproduce the bad
time-based assertion.

After the repair:

```text
npx playwright test --grep 'disables forecasting until a controlled file import finishes' --repeat-each=20
40 passed (20 desktop + 20 mobile)
```

The barrier, rather than elapsed time, now defines import completion.

## Clean local verification

All commands ran from the repaired tree on 2026-09-02 UTC.

- `npm ci` — PASS: 143 packages installed, 0 vulnerabilities.
- Every command in `.factory/claims.json` — PASS independently, 26/26.
- `npm test` — PASS: 20/20 unit and release-contract tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; `dist/index.html` produced.
- `npm run test:e2e` — PASS: 80/80 across desktop and 390 × 844 mobile.
- `/opt/fleet/lib/verify-url.sh 'http://127.0.0.1:4173/?demo=1' <evidence-dir>`
  — PASS: HTTP 200, correct title and `lang`, one h1, main landmark, no missing
  alt text or unnamed buttons, and zero console/page errors.
- Playwright axe scans — PASS on Demo, Privacy, Terms, and 404 at desktop and
  mobile sizes; zero serious or critical findings.
- Lighthouse 12.8.2 mobile — 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0.004, 74 KiB
  transferred.
- Final app assets — 20.97 KiB raw / 7.98 KiB gzip JavaScript and 24.86 KiB
  raw / 5.98 KiB gzip CSS. No fonts are downloaded.

The full browser suite covers keyboard navigation, focus contrast, 44 px touch
targets, 200% text, mobile overflow, errors and boundaries, privacy, demo
isolation, storage, CSV/JSON import and export, installability, offline reload,
and the service-worker update path. Package/consumer and server API checks are
not applicable to this static PWA.

## Deployment and live evidence

Deployment used only the scoped command:

```sh
/opt/fleet/lib/deploy-static.sh review-backlog-forecast dist
```

It reused `sf-review-backlog-forecast` in `eastus2`. Deployment
`8363723a-f43e-4848-acbb-b48df094614c` succeeded, and
<https://review-backlog-forecast.sociobot.in/> returned HTTPS 200.

- All 28 public files match the final local `dist/` files byte-for-byte by
  SHA-256. `staticwebapp.config.json` is correctly not public.
- Live URL verification passed with zero console/page errors, title
  `Demo — Review Backlog Forecast`, `lang=en`, one h1, a main landmark, and
  valid image and button labels.
- The controlled import barrier passed against production at 1440 × 900 and
  390 × 844. Before release, both forecast and save stayed disabled and the
  old value stayed at 320. After release, the value became two; only a new
  forecast enabled save.
- Live axe scans found zero serious or critical findings on Demo, Privacy,
  Terms, and 404 at both viewport sizes.
- A live import, forecast, save, export, and reload made 12 same-origin GET
  requests, no request bodies, and retained or sent no unique raw-card marker.
- A fresh live context gained service-worker control, went offline, reloaded,
  and restored the complete forecast plus `Gentle · 320 overdue · 30-minute
  cap` with the offline status visible.
- Root returns 200 and an unknown route returns the styled HTTP 404. Hashed
  assets use one-year immutable caching; the manifest and worker use
  `no-cache`; HTML revalidates after 30 seconds.
- CSP, HSTS, `nosniff`, frame denial, strict referrer policy, and the
  restrictive permissions policy are present. The manifest is served as
  `application/manifest+json`.
- Live identity remains build `1.0.9`: footer build text, manifest start URL,
  and worker cache `rbf-v1.0.9` agree.

## Privacy and known gaps

The product remains static and local-first. It has no backend, account,
analytics, third-party runtime, Anki connection, billing, or AI endpoint. No
infrastructure outside the product's scoped Static Web App was read or changed.

Known gaps: none.

## Run it again

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npx playwright test --grep 'disables forecasting until a controlled file import finishes' --repeat-each=20
```
