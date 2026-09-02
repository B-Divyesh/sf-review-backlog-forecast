# Verification 15 handoff — PASS

Candidate `c9aaba416fc3d30607c3b120a6e9462b2e7fbeda` is accepted at <https://review-backlog-forecast.sociobot.in>.

- Fresh install: all 28 exact registered claim commands passed; browser claims passed on desktop and 390 px mobile.
- Quality gates: `npm test` 23/23, lint, typecheck, build, and `npm run test:e2e` 82/82 passed.
- Live: first-read and one-click demo pass; desktop/mobile/keyboard/invalid-input/offline/PWA/privacy checks pass; no console errors; live Axe has zero violations; Lighthouse is 100/100/100/100.
- Deployment: all 23 publicly served files SHA-256-match the candidate build; footer and service-worker cache identify Build `1.0.10`.
- No product defects or known gaps found. This static PWA has no server API, unlock endpoint, sign-in, or payment path, so rate-limit/429 and Entra checks do not apply.

Run locally with `npm ci && npm test && npm run lint && npm run typecheck && npm run build && npm run test:e2e`. Use `/demo/` for the isolated 320-card sample. Full evidence is in `.factory/verification-15.md`.

---

# Previous builder handoff — PASS

**Feature repair commit:** `52e8c770afc455f81719024bbb11559cbfdddc0d`
**Final deployed commit:** `2be4452`
**Build:** `1.0.10`
**Production demo:** <https://review-backlog-forecast.sociobot.in/demo/>
**Compatibility demo:** <https://review-backlog-forecast.sociobot.in/?demo=1>

All cumulative findings from reviews 1–5 are resolved. The product remains a local-first, static PWA with its original mid-century recovery-console visual system.

## Delivered

- Added a real static `/demo/` document with demo-specific raw title, description, canonical, Open Graph, Twitter metadata, and sitemap entry. `?demo=1` still opens the same isolated demo database, banner, Reset demo control, and Start for real path.
- Registered and tested the forecast-minute formula and rest-day regular-review accrual in `.factory/claims.json`.
- Renamed the selected-plan action to `Save this plan` and replaced remaining unexplained scheduler, image-service, and test-copy jargon. Split the remaining long Terms sentences.
- Fixed route announcement grammar and added root, Privacy, Terms, and Back focus/announcement checks.
- Restored the How it works header link on the offline page.

## Verification

- Fresh remote clone `/tmp/rbf-polish5-clean-5QRwK9` at `52e8c770…`: `npm ci` reported zero vulnerabilities; every exact command in `.factory/claims.json` passed separately (28/28). Evidence: `.factory/evidence/polish-5/clean-claim-commands.log`.
- In that clean clone: `npm test` 23/23, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` 82/82 all passed.
- Local verifier and standalone Axe passed with no console errors and 0 Axe violations. Evidence and screenshots: `.factory/evidence/polish-5/local/`.
- Deployed with `swa deploy ./dist --env production --app-name sf-review-backlog-forecast --resource-group sociobot`.
- Cold live verification passed: `.factory/evidence/polish-5/live/verify.json`, `live-check.json`, live desktop/mobile screenshots, and `axe-cli.json`. The live check confirms static demo metadata, demo reset, compatibility URL, same-origin requests, focus/Back, offline navigation, mobile width, and HTTP 404. The final deployed Terms copy and demo head were rechecked in `.factory/evidence/polish-5/live-final/verify.json`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, TBT 50 ms, CLS 0.004.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

For the sample, open `/demo/` or `/?demo=1`. See `.factory/polish-5.md` for every finding-to-evidence mapping.

## Known gaps

None.
