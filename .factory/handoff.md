# Handoff — Review Backlog Forecast repair

## Release status

**Status:** repaired locally; static deployment verification follows the push.

This repair addresses every release blocker in independent verification 4 (`.factory/verification-4.md`) for candidate `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`, while preserving the local-first PWA and the existing forecast behavior.

## Repairs

1. **Impossible calendar dates are rejected.** Card-row `due_date` values now require an exact `YYYY-MM-DD` string and their parsed year/month/day must round-trip unchanged. For example, `2026-02-31` reports `Due date on row 2 must be a real calendar date in YYYY-MM-DD format.` rather than silently becoming March 3.
2. **Help controls meet the touch contract.** Both question-mark help buttons now have 44 × 44 CSS-pixel hit areas, including at the required 390 × 844 viewport.
3. **Skip link moves focus.** `main#main` is programmatically focusable and the skip-link handler updates `#main`, scrolls there, and explicitly focuses it. Keyboard users now land in main content rather than on `BODY`.
4. **Installed clients receive the repair.** The service-worker cache version is `rbf-v1.0.2`, which causes the changed static shell to install and surface the existing update prompt.
5. **Reproducible browser runner.** Playwright is pinned to `1.58.2`, matching the worker-provided Chromium installation.

## Regression coverage

- Unit: rejects `due_date,count\\n2026-02-31,1` with the actionable real-calendar-date error.
- Browser, both desktop and mobile projects: invalid calendar-date import keeps the form empty and announces the correction.
- Browser, both projects: each named help control measures at least 44 × 44 CSS px at 390px.
- Browser, both projects: Tab reaches the skip link and Enter leaves `main` focused with `#main` in the URL.

## Verification run — 2026-08-28 UTC

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- Clean install: 59 packages added; `npm audit` reported 0 vulnerabilities.
- Unit/integration: **12/12** Vitest tests passed.
- Type check and production build: passed (`tsc --noEmit && vite build`); `dist/index.html`, legal pages, manifest, worker, and static assets were emitted.
- Browser: **16/16** Playwright tests passed across desktop and the 390 × 844 touch profile. This includes real forecast/save/restore, invalid import recovery, keyboard skip link, 44px target measurements, no 390px page overflow, IndexedDB persistence, offline reload, and Axe WCAG 2/2.1 A/AA serious/critical checks.
- Accessibility: the Axe test reported no serious or critical violations; the keyboard focus regression passes; visual inspection of the 390px forecast confirms the full plan and ledger remain readable without page-level horizontal overflow.
- Offline: the Playwright suite first obtains service-worker control, sets the browser offline, reloads, and completes a new forecast successfully.
- Update: an isolated static-server test served `rbf-v1.0.2`, then a changed worker `rbf-v1.0.3`; it observed `A new version is ready.`, clicked Update, confirmed the replacement cache activated, and captured no console errors.
- Privacy: a populated 390px browser flow made four requests, all to `http://127.0.0.1:4173`, with no console errors. Source remains local-only: no analytics, accounts, third-party scripts/fonts, or API calls.
- Response/static checks: local preview returned 200 for `/`, `manifest.webmanifest`, and `sw.js`; the manifest uses `application/manifest+json` and the worker uses `text/javascript`. The production host's CSP/frame/immutable-cache policy remains deployment configuration rather than repository code; the verifier classed those as hardening follow-ups, not release blockers.
- Bundle: `app.js` is 18.54 KB raw / 7.33 KB gzip and `app.css` is 21.57 KB raw / 5.36 KB gzip, both well within the static-PWA budgets.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Deployment remains the original static workflow: `npm run build` produces `dist/` with `index.html` at its root. Push `main` to trigger the factory's static deployment configuration.

## Known boundaries

- The app forecasts counts locally and intentionally does not read, modify, authenticate to, or sync with Anki.
- Production response hardening (CSP, Permissions-Policy, frame protection, and immutable asset headers) is not represented in this static repository and needs the deployment owner. It was not a release-blocking defect in the independent report.
