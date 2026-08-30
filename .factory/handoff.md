# Handoff — Review Backlog Forecast repair 2

## Release status

**Status:** repaired and locally verified. Commit `ff72159` was pushed to `main`; the static host had not promoted that artifact at the time of the final live check.

This repair preserves the local-first forecast PWA and corrects every release-blocking finding in independent verification 4 (`.factory/verification-4.md`) for candidate `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8`.

## Exact reproduction and repairs

Before changing this repair, a detached build of the verifier's candidate reproduced all three reported failures at 390 × 844:

1. Importing `due_date,count\n2026-02-31,1` announced `Read 1 card rows: 1 overdue and 0 due today. Add your usual daily due estimate.`
2. `About overdue cards` and `About cards due today` each measured 30 × 30 CSS pixels.
3. Enter on the focused skip link set `#main` but left `document.activeElement` on `BODY`.

The product now rejects impossible date components after an exact `YYYY-MM-DD` parse; each help control has a 44 × 44 CSS-pixel hit area; and the skip-link listener explicitly focuses programmatically focusable `main#main`. Regression coverage includes all three dates explicitly mentioned by the verifier: `2026-02-31`, `2026-13-01`, and `2026-00-00`.

The first screen now also has a one-click `?demo=1` sample sandbox. It renders a realistic 320-overdue-card plan immediately, uses the separate IndexedDB database `review-backlog-forecast-demo`, shows Reset demo and Start for real controls, and cannot read or write the real `review-backlog-forecast` database. `.factory/demo.md` documents it.

## Verification — 2026-08-30 UTC

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- Clean install: 59 packages installed; `npm audit` reported zero vulnerabilities.
- Unit/integration: **12/12** Vitest tests passed.
- Production build: passed (`tsc --noEmit && vite build`) and emitted `dist/` with the app, legal pages, 404 page, manifest, worker, and static response policy configuration.
- Browser: **22/22** Playwright tests passed across desktop and the 390 × 844 touch profile. They cover real-plan persistence, demo isolation, malformed-import recovery, 44px help controls, keyboard skip focus, no mobile page overflow, Axe WCAG 2/2.1 A/AA serious/critical checks, offline reload, local-only requests, and worker update activation.
- Claims: every `.factory/claims.json` command passed. The tests cover the hard session cap, documented CSV import, offline demo reload, and same-origin-only demo requests.
- Accessibility/local URL smoke: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/?demo=1` returned 200 with zero console/page errors, `lang=en`, one h1, a main landmark, no missing image alt text, and no unlabelled buttons. Axe found no serious or critical violations in the populated desktop and mobile demo.
- PWA: a fresh dedicated browser context waited for worker control, went offline, reloaded `?demo=1`, and retained the forecast. A separate dedicated static-server test changed `rbf-v1.0.2` to `rbf-v1.0.3`, observed `A new version is ready.`, clicked Update, saw the replacement cache activate, and retained the demo forecast.
- Privacy: the populated demo request test recorded only the app origin; no third-party request, analytics, account, sync, or Anki access exists.
- Response policy: `dist/staticwebapp.config.json` validates and supplies CSP with `frame-ancestors 'none'`, Permissions-Policy, nosniff, referrer policy, `X-Frame-Options`, a no-cache worker route, navigation fallback exclusions, and a styled 404 rewrite.
- Performance: root mobile Lighthouse scored **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP 957 ms, LCP 1,209 ms, TBT 0 ms, CLS 0. The browser printed a Chrome tab-crash notice during Lighthouse teardown after report generation.
- Bundle: app JavaScript is 19,032 B raw / 7,481 B gzip; CSS is 22,256 B raw / 5,460 B gzip; mobile hero WebP is 26,300 B. All are inside the static-PWA budgets.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

`npm run build` produces `dist/index.html`. Pushing `main` is the static deployment path. After deployment, verify `https://review-backlog-forecast.sociobot.in/` with normal TLS, live asset identity, headers, and offline reload.

### Live deployment evidence at handoff

Normal TLS for `https://review-backlog-forecast.sociobot.in/` succeeds, but the live root still had SHA-256 `12cd57587c99de7f41c77fa8d89f6f9b884fa451c6ad2ebccdfb900d132382bf`; this repair's local `dist/index.html` is `6d92920d035105209315926f882f7d2d31bac08d223ba40c1a742a0c5c5799ee`. The repository has no checked-in deployment workflow, and GitHub's Actions/deployments API returned no run after the push. Live identity and response-header verification therefore remain pending the factory's static promotion; they must not be inferred from the local checks.

## Known boundaries

- The product models counts locally. It intentionally does not read, modify, authenticate to, or sync with Anki.
- The demo is isolated from real local data; its sample data is stored only in the demo IndexedDB namespace and is cleared by Reset demo or Start for real.
