# Polish 1 — review repair evidence

**Candidate repaired:** `0ca9a88`  
**Live URL:** <https://review-backlog-forecast.sociobot.in/?demo=1>  
**Checked:** 2026-09-01 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added a shared route-load module that focuses the destination h1 and updates a polite route announcement on normal load and Back/Forward. Kept Privacy visible in the compact mobile header. | `moves focus to the new route heading and announces normal navigation and Back` (desktop + mobile); live check: Privacy h1 and then demo h1 focused; `.factory/evidence/polish-1/live-mobile-demo.png` |
| F-1-2 | Registered `steady-recovery-target`; added a deterministic check for one-week half reduction and two-week clearing. | `npm test -- -t @claim:steady-recovery-target` — 1 passed in clean clone |
| F-1-3 | Registered `deadline-feasibility`; added reachable and unreachable deadline checks. | `npm test -- -t @claim:deadline-feasibility` — 1 passed in clean clone |
| F-1-4 | Registered `gentle-ramp`; added a six-session allowance check for the documented five-session ramp. | `npm test -- -t @claim:gentle-ramp` — 1 passed in clean clone |
| F-1-5 | Registered `adjustable-estimates`; the demo test changes time per review and observes capacity change. | `npm run test:e2e -- --grep @claim:adjustable-estimates` — 2 passed (desktop/mobile) in clean clone |
| F-1-6 | Replaced the hero eyebrow with `Plan a spaced-repetition review backlog.` | Live cold demo check; `.factory/evidence/polish-1/live-mobile-demo.png` |
| F-1-7 | Replaced `Set the dials` with `Forecast inputs`. | Full browser suite — 60 passed |
| F-1-8 | Replaced `Bring the count` with `Import queue totals`. | Full browser suite — 60 passed |
| F-1-9 | Replaced `Compare the channels` with `Compare recovery plans`. | Full browser suite — 60 passed |
| F-1-10 | Replaced `Three honest routes through the queue` with `Three recovery plans`. | Live cold demo check reports `Three recovery plans`; `.factory/evidence/polish-1/live-mobile-demo.png` |
| F-1-11 | Replaced `Forecast tape is blank` with `No forecast yet`. | Full browser suite — 60 passed |
| F-1-12 | Replaced `Read the fine print` with `Forecast assumptions`. | Full browser suite — 60 passed |
| F-1-13 | Replaced `Safe by design` with the factual `Preview only`. | Full browser suite — 60 passed |
| F-1-14 | Split the README test-suite sentence into the required two plain sentences. | `.factory/copy-audit.md` confirms all audited sentences are at most 22 words |
| F-1-15 | Standardized visitor copy on `overdue queue`, `recovery plan`, and `regular reviews`; rewrote the README audience sentence. | `.factory/copy-audit.md` terminology table and full browser suite — 60 passed |

## Verification evidence

- Fresh clone: `/tmp/review-backlog-forecast-clean-CRi2gl`; `npm ci` completed with 0 vulnerabilities.
- Every command in `.factory/claims.json` passed from that clone: 7 tagged Vitest claims (1 test each) and 13 tagged Playwright claims (2 projects each).
- Local quality gates: `npm test` (18 passed), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e -- --workers=4` (60 passed).
- Committed Playwright Axe scan: `has no serious accessibility violations` passed for demo, Privacy, Terms, and 404 in desktop and mobile contexts.
- Live worker check: `/opt/fleet/lib/verify-url.sh https://review-backlog-forecast.sociobot.in/?demo=1 .factory/evidence/polish-1` passed. Its `verify.json` records 696 ms cold network-idle load, no console/page errors, `lang=en`, one h1, main, and no missing image alt or unnamed button.
- Live mobile route check: title, demo banner, 320-card sample, result heading, 390 px width, Privacy focus/announcement, Back focus/announcement, and console errors are recorded in the command output; screenshot: `.factory/evidence/polish-1/live-mobile-demo.png`.

The standalone `npx @axe-core/cli` command was attempted against the live URL but its Selenium Chrome launcher could not find a Chrome binary in this worker. The repository's Playwright Axe integration uses the preinstalled Playwright browser and passed at the same WCAG tags.
