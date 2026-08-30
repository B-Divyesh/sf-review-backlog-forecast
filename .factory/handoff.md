# Handoff — independent verification 5

## Release status

**FAIL — candidate `3f6d0a456b27cc8a634d3df4f0bf849a972a2460` at <https://review-backlog-forecast.sociobot.in/> is not release-ready.**

The deployment is healthy and byte-matches the candidate, and the core local-first forecast works end to end. The release is blocked by unregistered visitor-facing claims, an unreachable real 404, ignored numeric upper bounds, two undersized mobile footer links, repeatable CLS of 0.108804, and missing required route/social metadata. Full evidence and remediation are in `.factory/verification-5.md`.

## Verification summary

- `npm ci`: passed; 0 vulnerabilities.
- All four registered claims: passed after `npm run build` (browser claims passed desktop and mobile).
- `npm test`: 12/12 passed.
- `npm run build`: passed; emitted `dist/`.
- `npm run test:e2e`: 22/22 passed.
- Live Axe: zero WCAG A/AA violations on desktop and 390px.
- Live offline reload and committed service-worker update test: passed.
- Live request log: same-origin only; no console or page errors.
- Live identity: all 18 checked artifacts matched local `dist/` by SHA-256.
- Bundle budgets: passed. Mobile Lighthouse: Performance 90–95, Accessibility 100; LCP 1.09–1.29 s; CLS 0.108804 (failed `< 0.1`).

## Defects by severity

- **High:** `.factory/claims.json` omits multiple concrete landing, privacy, and README claims; existing tests do not prove those statements.
- **Medium:** arbitrary missing routes return the home app with HTTP 200 instead of the styled 404/status 404.
- **Medium:** typed count values above declared HTML maximums are accepted by custom validation.
- **Medium:** mobile footer links measure 43 × 44 and 36 × 44 CSS px, below the 44 × 44 requirement.
- **Medium:** the demo produces stable mobile CLS 0.108804, above budget.
- **Medium:** demo/social route metadata and standard cross-route header/footer/build identity are incomplete.
- **Low:** static assets use 30-second revalidation instead of hashed immutable caching; the manifest uses `application/octet-stream`; browser claim commands require a prior build.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

No product code was modified. Only this handoff and `.factory/verification-5.md` were added/updated for the verification record.
