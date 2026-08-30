# Handoff — repair 4

## Release status

**READY TO DEPLOY.** This repair addresses every release blocker in independent verification 6 for candidate `bad1a4aa0a875870849736ba7108145c4d2505f8`.

## What changed

1. **Stale forecasts are safe.** Any form edit, successful CSV/backup import, or rejected forecast submission now marks the visible result out of date. The notice tells the learner to rerun the forecast, and both **Use this plan** and **Export schedule** are disabled until a successful rerun. Both handlers also reject stale state defensively.
2. **Policy keyboard focus persists.** Re-rendering the policy cards now restores focus to the newly selected native radio. ArrowRight can move from Steady to Deadline to Gentle without focus dropping to `body`.
3. **Undo meets the touch-target requirement.** The transient toast action has a 44px minimum width and remains 44px high.
4. **Required first-screen and route metadata is complete.** The product facts include `Free`; `offline.html` and `404.html` now have canonical, Open Graph, Twitter, manifest, and Apple touch-icon metadata. The PWA version/cache and manifest start URL are now `1.0.4`.

## Regression coverage

`tests/e2e/app.spec.ts` now covers the verifier's exact stale-result sequence in both desktop and 390px projects: edit the 320-card sample, import `125,31,22`, submit `-1`, and observe disabled save/export actions until each valid rerun. It also covers two consecutive policy-arrow moves with focus retention, the 390px Undo measurement, `Free` in the first-screen fact list, and complete metadata on the offline and 404 documents.

## Verification evidence

- `npm ci`: passed; 143 packages installed; 0 vulnerabilities.
- `npm test`: passed, 15/15 tests.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; generated `dist/` with `index.html` at its root.
- `npm run test:e2e`: passed, 56/56 tests across desktop and 390 × 844 mobile.
- Every claim command in `.factory/claims.json` passed independently: 4 tagged unit claims and 12 tagged browser claims, each browser claim in desktop and mobile projects.
- Factory URL check against the production build at `http://127.0.0.1:4173/?demo=1`: HTTP 200; 537 ms network-idle load; title `Demo — Review Backlog Forecast`; `lang=en`; one h1; main landmark; no missing image alt text or unnamed buttons; no console/page errors.
- Existing Playwright Axe WCAG 2/2.1 AA coverage passed on Demo, Privacy, Terms, and the 404 page in both projects with zero serious/critical violations.
- Offline reload and waiting-worker update tests passed in isolated browser contexts. Privacy/request tests passed with only same-origin requests and no Anki, account, billing, or third-party runtime path.
- Local Lighthouse 12.8.2 mobile on `/?demo=1`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 20 ms, CLS 0, total transfer 71 KiB.
- Built app JS: 20,103 B raw / 7.85 kB gzip. Built app CSS: 22,780 B raw / 5.59 kB gzip. Mobile hero: 26,300 B.

## Deploy and rerun

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Deploy the static `dist/` directory using this repository's configured static deployment. After deployment, verify `https://review-backlog-forecast.sociobot.in/?demo=1` for the stale-result sequence, radio-arrow focus, Undo target, and the deployed asset identity.

## Known gaps

None for the repaired scope. A live identity and response-policy check follows the deployment push.
