# Handoff — first-read review 3

## Status

**FAIL.** The review is recorded in `.factory/review-3.md`. Product code was not changed.

## What was done

- Checked the live root and one-click demo in fresh 390 × 844 and 1440 × 900 browser contexts.
- Audited landing/demo and README sentences, headings, terminology, control labels, and claim-like copy.
- Ran all 20 exact commands in `.factory/claims.json` from a clean clone.
- Confirmed live demo reset, Start for real, separate real/demo storage, same-origin requests, and offline behavior.
- Rechecked every finding from review 1 and review 2 against the live site and current source.
- Checked route titles, metadata, 404 behavior, links, deep links, Back/focus behavior, headers, footers, security headers, mobile layout, accessibility, and visual identity.
- Ran the URL verifier, axe-core CLI, unit checks, lint, typecheck, build, and the full browser suite.

## Verification summary

- All 20 exact registered claim commands passed from `/tmp/rbf-review3-EoeFu4`.
- `npm test`: 19 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/`.
- First `npm run test:e2e`: 59 passed, 1 failed at `@claim:local-persistence`.
- Immediate `npx playwright test` rerun: 60 passed.
- `/opt/fleet/lib/verify-url.sh`: passed with no console errors.
- axe-core 4.13.0: `violations: []` for the checked WCAG tags.

## Findings left for the owner

Three blocking findings remain: the demo result is below the first post-click viewport, local-persistence verification is timing-sensitive, and earlier terminology finding F-1-15 is still only partly fixed. Sixteen minor copy, claim-registration, structure, metadata, and import findings are listed with concrete fixes in the review.

No deployment, infrastructure, DNS, secrets, or unrelated resources were accessed or changed.
