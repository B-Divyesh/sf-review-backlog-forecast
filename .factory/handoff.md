# Handoff — first-read review 1

## Status

**FAIL.** The review did not modify product code. It added `.factory/review-1.md` and updated this handoff. The report records one route-focus finding, four claim-registry findings, and ten plain-language findings.

## What was checked

- Fresh desktop and 390 px production visits to the scoped product URL.
- One-click demo, reset behavior, IndexedDB namespaces, same-origin request log, and offline claim coverage.
- Every command in `.factory/claims.json` from a fresh local clone after `npm ci` and build.
- Full clean-checkout gates: `npm test` (15/15), lint, typecheck, build, and `npm run test:e2e` (56/56).
- Metadata, 404, links, keyboard behavior, prior-verification repairs, and copy/terminology audit.

## Required next work

1. Move focus to the new h1 and announce it after normal route navigation and Back.
2. Register/test or remove the four quoted policy/estimate claims in review findings F-1-2 through F-1-5.
3. Apply every concrete plain-language rewrite in F-1-6 through F-1-15.
4. Recheck the complete review checklist, all claim commands, and the full browser suite from a clean clone.

## How to verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Open `https://review-backlog-forecast.sociobot.in/?demo=1` in a fresh browser context. Select Privacy, then use Back, and confirm focus lands on the destination h1 after the repair.
