# Handoff — polish 1

## Status

**PASS.** Repair commit `0ca9a88` is deployed to <https://review-backlog-forecast.sociobot.in/?demo=1>. All 15 findings in `.factory/review-1.md` are repaired and mapped in `.factory/polish-1.md`.

## What changed

- Route loads and Back/Forward focus the destination h1 and announce it politely. Privacy stays visible in the compact mobile header.
- Four missing claims now have registry entries and exact tagged tests: Steady target, Deadline feasibility, Gentle ramp, and adjustable estimates.
- Every required plain-language rewrite is applied in the landing page and README. The catalog description is a verb-first sentence under 120 characters.
- The distinct mid-century recovery-console visual system, local-only demo namespace, banner/reset/start-real controls, PWA, real 404, metadata, and legal links remain intact.

## Exact verification

- Fresh clone `/tmp/review-backlog-forecast-clean-CRi2gl`: `npm ci` succeeded with 0 vulnerabilities.
- Every one of 20 `.factory/claims.json` commands passed: 7 single-test Vitest claims and 13 Playwright claims in desktop and mobile contexts.
- Local: `npm test` — 18 passed; `npm run lint` — passed; `npm run typecheck` — passed; `npm run build` — passed; `npm run test:e2e -- --workers=4` — 60 passed.
- Accessibility: committed Playwright Axe check passed on Demo, Privacy, Terms, and 404 in desktop and mobile. The standalone Axe CLI was attempted, but its Selenium launcher could not find Chrome in this worker; Playwright's bundled browser is the passing evidence.
- Live: `/opt/fleet/lib/verify-url.sh` passed at the demo URL. `.factory/evidence/polish-1/verify.json` records 696 ms cold load, no console/page errors, correct title/lang/one h1/main, and no missing alts or unnamed buttons. Desktop and mobile screenshots are in the same directory.
- Live mobile recheck confirmed the demo banner, sample 320 overdue cards, `Three recovery plans`, 390 px width without overflow, Privacy h1 focus/announcement, and demo h1 focus/announcement on Back. Screenshot: `.factory/evidence/polish-1/live-mobile-demo.png`.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
/opt/fleet/lib/deploy-static.sh review-backlog-forecast dist
```

## Known gaps

None in the product. The only tooling limitation was the standalone Axe CLI Chrome lookup described above; the repository's Playwright Axe coverage passes.
