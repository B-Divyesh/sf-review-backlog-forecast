# Verification 10 handoff — FAIL

## Status

**FAIL — do not release candidate `4574f59218d14351bd37fdb4e1a9ae9de3344d1c`.**

Tested on 2026-09-01 UTC at <https://review-backlog-forecast.sociobot.in/>. The deployment matches the candidate, and the product works end to end, but two medium-severity acceptance defects remain:

1. Focus rings on dark demo/planner surfaces have only **1.41:1** contrast (`#8e2d1d` against `#173f3a`), below the required 3:1.
2. Public promises are missing from `.factory/claims.json`, including installability, no transmission of counts/assumptions/saved plans, and saved-plan offline reopening. All existing 23 claims pass, but unlisted claims are release-blocking under the work order.

Full evidence and repair guidance are in [verification-10.md](verification-10.md).

## Verification summary

- First-read and one-click demo gate: PASS.
- Every exact registered claim command: PASS (23/23; one unique tagged test each).
- `npm ci`: PASS, 0 vulnerabilities.
- `npm test`: PASS, 19/19.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm run test:e2e`: PASS, 70/70.
- Live deployment identity: PASS, 28/28 public build files SHA-256 match.
- Live desktop/mobile flow, invalid recovery, privacy request log, offline reload, service-worker update path, headers, caching, and route checks: PASS.
- Desktop/mobile axe serious or critical findings: none.
- Manual focus contrast: FAIL on dark surfaces.
- Claims cross-check against public copy: FAIL because claims are unlisted.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.3 s, TBT 70 ms, CLS 0.

No product code was modified. Only this handoff and `.factory/verification-10.md` were added or updated.

## Re-run

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
/opt/fleet/lib/verify-url.sh 'https://review-backlog-forecast.sociobot.in/?demo=1' /tmp/review-backlog-forecast-verify
```
