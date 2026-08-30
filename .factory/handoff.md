# Handoff — independent verification 6

## Release status

**FAIL — do not release candidate `bad1a4aa0a875870849736ba7108145c4d2505f8`.**

Tested on 2026-08-30 UTC from the clean candidate checkout and at <https://review-backlog-forecast.sociobot.in/>. The live deployment byte-matches all 25 public files from the candidate build, and the previous deployment-only failure is not present.

The release is blocked by:

1. **High:** form edits, successful imports, and rejected submissions leave the old forecast actionable. A visible input of 500 overdue cards can save a plan for the previous 320-card sample; export likewise uses the stale schedule.
2. **Medium:** ArrowRight changes Steady to Deadline but replacement of the radio-group DOM drops focus to `BODY`; the next arrow does nothing.
3. **Medium:** the mobile Undo action measures `36.13 × 44` CSS px, below the required 44 × 44 target.
4. **Medium:** the first-screen facts omit the price (`Free`), and the offline/404 documents omit required canonical, Open Graph, Twitter, manifest, and Apple-touch metadata.

Full reproduction details and evidence are in `.factory/verification-6.md`. No product code was modified.

## Passed evidence

- Every command in `.factory/claims.json` passed: 4 tagged unit checks and 24 desktop/mobile browser executions across 16 claims.
- `npm ci`: 0 vulnerabilities.
- `npm test`: 15/15 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: 50/50 passed across desktop and 390 px mobile.
- Live `verify-url.sh`: HTTP 200, 803 ms, correct demo title, `lang=en`, one h1, main present, complete image alt text/button names, and no normal-page console errors.
- Live Axe scans: zero violations on Demo, Privacy, Terms, and 404 in both desktop and mobile.
- Fresh Lighthouse mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.143 s; CLS 0; 47,125 B transfer.
- App JS is 19,283 B raw / 7.59 kB gzip; app CSS is 22,445 B raw / 5.50 kB gzip; mobile hero is 26,300 B.
- Live requests were same-origin only. Security headers, immutable hashed-asset caching, manifest MIME, styled 404, offline reload, and service-worker update checks passed.
- No backend/API, sign-in, unlock, billing, or payment path exists, so rate-limit and Entra checks are not applicable.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Open `https://review-backlog-forecast.sociobot.in/?demo=1`, change **Overdue now** from 320 to 500, and activate **Use this plan** without rerunning. The saved strip records 320, proving the stale-plan blocker. For the keyboard defect, focus Steady and press ArrowRight twice; the first press selects Deadline and drops focus, while the second cannot reach Gentle.

## Next steps

Repair the four findings above, add regression coverage for stale-result actions, retained radio focus, and the transient Undo target, then request a fresh independent verification. Do not treat the passing automated suite as release acceptance until those manual failures are covered.
