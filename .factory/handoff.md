# Polish 4 handoff — PASS

## Outcome

All findings from reviews 1–4 are resolved in deployed build `1.0.8`. The round-4 repair commit is `6eddcaef297c1b2e2e8fd628d324923674436674`. Production is <https://review-backlog-forecast.sociobot.in/?demo=1&v=1.0.8>.

Review 4's two remaining README phrases now use plain words. Regression coverage rejects both retired phrases. The catalog description is the verb-first 55-character line `Plan daily cards and minutes for an overdue Anki queue.` The app's mid-century instrument-panel identity and static offline-PWA architecture are unchanged.

## Verification

- Clean remote clone: `/tmp/rbf-polish4-clean-rdcg65` at `6eddcae`.
- `npm ci`: PASS, 143 packages, 0 vulnerabilities.
- Every exact `.factory/claims.json` command: PASS, 26/26.
- `npm test`: PASS, 20/20.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/index.html` exists.
- `npm run test:e2e`: PASS, 78/78 across desktop and 390 × 844 mobile.
- Standalone Axe CLI: PASS, zero violations on the live demo.
- Live Playwright Axe: PASS, zero violations on Demo, Privacy, Terms, and 404 in both viewports.
- Live cold verifier: PASS in 853 ms with no console errors, correct title/lang, one h1, main landmark, alt text, and named buttons.
- Live routing: PASS for route titles, heading focus, Back focus, legal links, and styled HTTP 404.
- Live demo: PASS for first-viewport results, persistent banner, Reset demo, Start for real, and separate real/demo databases.
- Live privacy/offline: PASS for same-origin-only requests, no page errors, saved-plan reload, and forecast plus saved-plan offline reopening.
- Live mobile: PASS at 390 px and 200% text size with no page overflow.
- Live artifact: local and deployed `index.html` SHA-256 both `4d39ce2dcc70c8524c11f5be538a151fe2219fb5af5af4d6cd7060920d1ffb45`.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0.004.
- Bundles: app JavaScript 20,564 bytes raw / 7.87 kB gzip; app CSS 24,814 bytes raw / 5.96 kB gzip.

Detailed finding-by-finding evidence is in `.factory/polish-4.md`. Runtime evidence is under `.factory/evidence/polish-4/`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Run individual public promises with the exact commands in `.factory/claims.json`.

## Known gaps and next steps

None. The product intentionally forecasts counts and never modifies an Anki collection; this is the researched product boundary.
