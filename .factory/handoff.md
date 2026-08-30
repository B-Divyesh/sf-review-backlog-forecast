# Handoff — release-blocking QA repair

## Release status

**Repair complete, pushed, deployed, and live.** This repair addresses every release-blocking finding in independent verification 5 for candidate `3f6d0a456b27cc8a634d3df4f0bf849a972a2460`. Product repair commit: `2b759f10f19d16ae130fd4ed9ff4a9bc48702b4d`.

Artifact class remains `pwa-offline`. The production output is `dist/` with `dist/index.html` at its root. No backend, shared database, external runtime service, analytics, or account flow was added.

## Repairs

- Registered 16 visitor-facing claims in `.factory/claims.json`. Each ID appears in exactly one tagged test definition. Coverage now includes both CSV forms, due-today priority, rollover, raw-import privacy, demo isolation, local persistence, JSON backup restore, schedule export, local clearing, Anki isolation, third-party/runtime privacy, no-account use, offline reload, policy comparison, and the hard cap.
- Enforced all declared count maximums in shared validation: 100,000 for overdue, due-today, and daily-due counts; 10,000 for new cards. Invalid values keep results hidden, show an actionable alert, and move focus to it.
- Removed the SPA navigation fallback. Unknown paths now use the styled `404.html` through a status-404 response override. The production preview also returns HTTP 404 so browser regression tests exercise the response, title, and h1.
- Expanded every footer policy link to at least 44 × 44 CSS px. At 390px, Privacy measures 50.98 × 44 and Terms measures 44 × 44.
- Eliminated demo startup shift by applying demo state from a 204-byte same-origin bootstrap before first paint. The original delayed-module reproduction moved from CLS 0.106 to 0.000.
- Added home Open Graph/Twitter metadata and an original-art-derived 1200 × 630 social image. Demo mode now sets `Demo — Review Backlog Forecast` before first paint.
- Rebuilt Privacy, Terms, 404, and offline pages around the shared wordmark/header/navigation/footer system. Every footer includes `Built by Param Factory · Build 1.0.3`.
- Restored content hashing for generated JS/CSS and renamed original images/icons with content hashes. `/assets/*` and `/icons/*` now receive one-year immutable caching. The manifest has an explicit `application/manifest+json` mapping.
- Build-time service-worker injection precaches the current hashed shell. Cache version `rbf-v1.0.3` preserves the tested waiting-worker update flow.
- `npm run test:e2e` now builds first, so every browser claim command runs from a clean installed checkout without a pre-existing `dist/`.
- Added explicit typecheck and ESLint gates. Playwright remains pinned to 1.58.2.

## Verification evidence

Clean checkout-equivalent run on 2026-08-30 UTC:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:e2e
```

- `npm ci`: 143 packages installed; 144 audited; 0 vulnerabilities.
- `npm test`: 15/15 passed across forecast, CSV, claims-registry, and release-policy tests.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test:e2e`: production build passed, then 50/50 Playwright checks passed across desktop Chrome and 390 × 844 mobile.
- All 16 claim tags ran within the passing unit/browser suites. The claims contract test also proves one registered ID to one tagged test definition.
- Playwright Axe scans on populated demo, Privacy, Terms, and styled 404 found 0 serious/critical WCAG A/AA or WCAG 2.1 AA violations in both projects.
- Keyboard tests passed for forecast and legal-page skip links, policy radio operation, imports, buttons, downloads, update action, and dialogs. Reduced-motion rules remain active.
- The worker `verify-url.sh` passed the local production demo: title `Demo — Review Backlog Forecast`, `lang=en`, one h1, main present, 0 missing image alt attributes, 0 unnamed buttons, and 0 console/page errors.
- Desktop and 390px screenshots were reviewed. The populated forecast has no page-level horizontal overflow; `scrollWidth` equals 390 on mobile.
- Delayed-start CLS regression: 0.000 with the app module held for one second. Lighthouse CLS: 0.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.91s, LCP 1.36s, TBT 53ms, CLS 0.
- Production bundles: app JS 19.28 KB raw / 7.59 KB gzip; app CSS 22.45 KB raw / 5.50 KB gzip; legal CSS 3.03 KB raw / 1.19 KB gzip; mobile hero 26.30 KB. All budgets pass.
- Offline reload uses its own browser context and passed in both projects. The isolated waiting-service-worker update test also passed in both projects.
- Local response checks: unknown route 404, manifest MIME `application/manifest+json`, no runtime requests outside the app origin, and no console/page errors across normal, invalid, import, export, legal, 404, mobile, and offline paths.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:e2e
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1`. Claim-specific commands are listed in `.factory/claims.json` and each builds before browser execution.

## Deployment and live identity

The existing Static Web App `sf-review-backlog-forecast` received the exact `dist/` artifact through deployment `0329471a-af8f-44fe-9646-e04e992cb3fe`. No DNS, billing, database, Key Vault, app-settings, or unrelated resource action was performed.

- Production URL: <https://review-backlog-forecast.sociobot.in/>
- `verify-url.sh` against the live demo passed: HTTP 200, 846ms network-idle load, correct demo title, `lang=en`, one h1, main present, 0 missing alt attributes, 0 unnamed buttons, and 0 console/page errors.
- Live desktop and 390px mobile Playwright smoke checks passed with same-origin-only requests, 0 serious/critical Axe violations, no horizontal overflow, correct 50.98px/44px footer target widths, and an active service-worker controller.
- Live over-maximum input showed the bounded error, focused its alert, and kept results hidden.
- Live offline reload retained the demo title, populated result heading, and `Offline · forecast still works` status.
- Live unknown route returned HTTP 404 and the styled 404 h1.
- Live response policy includes HSTS, CSP with `frame-ancestors 'none'`, Permissions-Policy, strict referrer policy, `nosniff`, and `X-Frame-Options: DENY`.
- Live manifest is `application/manifest+json`; the service worker is `no-cache`; hashed JS, CSS, images, and icons are `public, max-age=31536000, immutable`.
- SHA-256 matched local `dist/` for 18/18 checked artifacts: root, Privacy, Terms, 404, offline, manifest, service worker, app JS/CSS, legal CSS, demo bootstrap, three images, and four icons. Root hash: `b689a486d443395288dda2e6136c7c78597b017594e21e523964cfa290697c79`.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.95s, LCP 1.10s, TBT 85ms, CLS 0.
- A live crawl resolved every internal link from Home, Demo, Privacy, Terms, 404, and offline pages with HTTP 200.

## Known gaps and next steps

No release-blocking product gap is known. The forecast remains an estimate and intentionally does not modify an Anki collection or model retention.
