# Handoff — polish 2

## Status

**PASS.** Commit `44773a4` is pushed to `main` and deployed as build `1.0.5` at <https://review-backlog-forecast.sociobot.in/>.

## What changed

- Completed all findings in `.factory/review-1.md` and `.factory/review-2.md`; the complete mapping is in `.factory/polish-2.md`.
- Standardized the first screen, metadata, and audit on `overdue queue`; the h1 is now `Plan an overdue queue before changing cards.`
- Moved `Free` into the first desktop trust row and added a 1440 × 900 regression assertion.
- Replaced unexplained `local-first` footer wording on every route and removed the visitor-facing image-provenance sentence.
- Preserved the isolated `?demo=1` workflow, reset/start-real controls, IndexedDB namespace separation, existing claims, routing, 404, focus handoff, legal pages, PWA behavior, and visual system.
- Bumped the PWA/service-worker and manifest version to `1.0.5` so installed clients receive the repaired shell.

## Verification

Fresh clone `/tmp/review-backlog-forecast-clean-c55J7l`:

```sh
npm ci
npm test                 # 19 passed
npm run lint             # passed
npm run typecheck        # passed
npm run build            # passed; dist/ produced
npm run test:e2e         # 60 passed
```

All 20 exact commands in `.factory/claims.json` passed independently in that clone. The browser suite covers Axe, privacy request origins, demo isolation, offline reload, service-worker update, 390 px layout, controls, routing, and 404.

Deployment used the owned Static Web App only:

```sh
swa deploy ./dist --env production
```

Cold live evidence:

- `/opt/fleet/lib/verify-url.sh https://review-backlog-forecast.sociobot.in/?demo=1 .factory/evidence/polish-2` passed: 789 ms, no console/page errors, `lang=en`, one h1, main landmark, no missing alt text, no unnamed buttons.
- Fresh live Playwright check: desktop `Free` fact y = `866.5px` in a 1440 × 900 viewport; mobile has no page overflow; zero serious/critical Axe violations; `/privacy/` and `/terms/` return 200; an unknown path returns 404.
- Live demo reset restored the sample `320` overdue queue. Privacy navigation and Back focused their new h1s.

Screenshots: `.factory/evidence/polish-2/live-desktop-root.png` and `.factory/evidence/polish-2/live-mobile-demo.png`.

## Known gaps

None.
