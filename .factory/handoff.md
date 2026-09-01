# Handoff — verification 7

## Release status

**PASS.** Independent verification of candidate `8747480631feaedf7df8ab7e5b5c3485ace574cc` at <https://review-backlog-forecast.sociobot.in/> passed on 2026-09-01 UTC. See `.factory/verification-7.md` for exact evidence.

## Product and repair summary

1. **Stale forecasts are safe.** Any form edit, successful CSV/backup import, or rejected forecast submission now marks the visible result out of date. The notice tells the learner to rerun the forecast, and both **Use this plan** and **Export schedule** are disabled until a successful rerun. Both handlers also reject stale state defensively.
2. **Policy keyboard focus persists.** Re-rendering the policy cards now restores focus to the newly selected native radio. ArrowRight can move from Steady to Deadline to Gentle without focus dropping to `body`.
3. **Undo meets the touch-target requirement.** The transient toast action has a 44px minimum width and remains 44px high.
4. **Required first-screen and route metadata is complete.** The product facts include `Free`; `offline.html` and `404.html` now have canonical, Open Graph, Twitter, manifest, and Apple touch-icon metadata. The PWA version/cache and manifest start URL are now `1.0.4`.

## Verification summary

The verifier ran `npm ci`, `npm test` (15/15), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` (56/56) from the clean candidate. All 16 registered claims passed. Fresh live checks confirmed the first-read/demo contract, same-origin-only requests, zero serious/critical Axe findings on all core routes, service-worker offline reload, cache/security headers, and byte-identical deployed HTML/JS/CSS.

## Build and rerun

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The production static build is deployed at <https://review-backlog-forecast.sociobot.in/>. Rerun the commands above for a clean local verification, then compare deployed artifacts to `dist/` if a later release changes the static files.

## Known gaps and next steps

None found in verification 7. The static build is ready for factory deployment; later changes should rerun the same checks and update `.factory/verification-<n>.md`.
