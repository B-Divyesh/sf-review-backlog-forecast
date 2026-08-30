# Independent verification 6 — FAIL

**Work order:** `review-backlog-forecast-verify-6`

**Candidate:** `bad1a4aa0a875870849736ba7108145c4d2505f8`

**Production URL:** <https://review-backlog-forecast.sociobot.in/>

**Verified:** 2026-08-30 UTC

**Verdict:** **FAIL — the build, deployment, claims, privacy, offline behavior, and performance checks pass, but core stale-result behavior and keyboard/touch defects remain.**

No product code was changed. This verification used only the repository and the `sf-review-backlog-forecast` production URL; no unrelated service, database, app settings, secret, infrastructure, DNS, or billing resource was read or changed.

## Release-blocking findings

### High — edited or rejected assumptions leave an actionable stale forecast

The populated demo keeps its previous result and its **Use this plan** and **Export schedule** actions active after the visible inputs change. There is no “out of date” state and no indication that the result no longer matches the form.

Fresh live reproduction at `/?demo=1`:

1. The sample rendered a Deadline forecast for 320 overdue cards.
2. Change **Overdue now** to `500` without rerunning.
3. Activate **Use this plan**.
4. The form still shows `500`, but the saved strip says `Deadline · 320 overdue · 30-minute cap`.
5. Exporting at that point produced the old schedule; its first row was `48 regular + 27 overdue = 75`, with `293` overdue remaining.

The same stale state remains after an explicit failed run. Setting overdue to `-1` and activating **Run forecast** correctly focuses an alert, but the old Deadline result, capacity, save action, and export action remain visible and usable. A successful CSV import also changes the form without invalidating the old result: after importing `125,31,22`, the page still showed the prior 96-card capacity generated from the earlier maximum-boundary inputs.

Impact: a learner can save or export a plan for different assumptions than the ones visibly displayed. That breaks the core job of previewing understandable consequences before changing study behavior.

Required repair: mark results stale on every relevant form or import change and disable/hide save and schedule export until a successful rerun, or rerun automatically. A rejected submission must not leave the prior forecast looking current. Add desktop and mobile tests for edited input, successful import, invalid submit, save, and export.

### Medium — arrow-key policy selection drops focus from the radio group

On the live demo, focus **Steady** and press ArrowRight. **Deadline** becomes selected, but `document.activeElement` becomes `BODY` because `renderPolicies()` replaces the focused radio nodes. A second ArrowRight does nothing, so a keyboard user cannot continue through the native radio group.

Before the first arrow, the radio label had the designed `3px` focus outline. After the DOM replacement there was no focused policy. The committed test checks only that one selection changes and therefore misses the focus loss.

Required repair: preserve or restore focus to the newly selected radio after rendering, preferably by updating existing nodes instead of replacing the group. Test multiple arrow presses and retained focus.

### Medium — the transient Undo action is only 36.13 × 44 CSS px on mobile

At 390 × 844, saving a plan shows an **Undo** button measuring `36.13 × 44` CSS px. All other visible interactive targets in that populated-state scan met 44 × 44 after hidden file/radio inputs were mapped to their visible controls. The supplied accessibility contract requires both dimensions to be at least 44 px.

Required repair: increase the Undo button's interactive width to at least 44 px and add it to the touch-target test.

### Medium — mandatory first-screen facts and secondary-route metadata are incomplete

- The first-screen fact list says `Preview only`, `Stays on this device`, and `No Anki access`. It does not state the price (`Free`), although the attached plain-words contract requires privacy, offline, and price facts on the first screen. `Ready offline` is separately visible in the header, but no first-screen fact gives the price.
- `offline.html` and the 404 document have route-specific titles and descriptions but no canonical, Open Graph, or Twitter metadata. They also omit the manifest and Apple touch icon links. The attached site-structure contract requires the metadata set per route.

These omissions are not responsible for the functional failures above, but they are explicit acceptance requirements.

## Mandatory first-read and demo result

**PASS.** In a cold desktop and 390 px mobile visit, the first viewport answers the three release-gate questions:

- What: `Plan overdue reviews before changing cards.`
- Who/result: `For learners returning after missed days, compare capped recovery plans before changing an Anki queue.`
- First click: `Try it with sample data`, followed by `See a 320-card backlog plan. Nothing real is saved.`

One click opens `/?demo=1`, populates a realistic 320-overdue / 48-due-today / 36-daily-due sample, renders all three policies, and shows the persistent demo banner with **Reset demo** and **Start for real**.

## Claims gate — all registered commands passed

`.factory/claims.json` exists with 16 unique claims. Every listed command was run separately before the general test suite. The four unit claims passed one tagged test each; every browser claim passed in both desktop and 390 px projects.

| Claim | Exact command result |
| --- | --- |
| `three-policies` | PASS — 1 tagged unit test |
| `hard-session-cap` | PASS — 1 tagged unit test |
| `due-today-priority` | PASS — 1 tagged unit test |
| `rollover-visible` | PASS — 1 tagged unit test |
| `csv-import` | PASS — 2/2 desktop/mobile |
| `grouped-csv-import` | PASS — 2/2 desktop/mobile |
| `offline-reload` | PASS — 2/2 desktop/mobile |
| `local-only` | PASS — 2/2 desktop/mobile |
| `demo-isolation` | PASS — 2/2 desktop/mobile |
| `local-persistence` | PASS — 2/2 desktop/mobile |
| `backup-roundtrip` | PASS — 2/2 desktop/mobile |
| `schedule-export` | PASS — 2/2 desktop/mobile |
| `clear-local-data` | PASS — 2/2 desktop/mobile |
| `anki-isolation` | PASS — 2/2 desktop/mobile |
| `no-third-party-runtime` | PASS — 2/2 desktop/mobile |
| `no-account` | PASS — 2/2 desktop/mobile |

The registry integrity test also passed: each registered ID occurs in exactly one tagged test definition. The high finding demonstrates an important untested interaction between otherwise passing claims; it does not invalidate the recorded isolated claim results.

## Clean-checkout quality gates

The supplied checkout was clean and exactly at the candidate SHA before testing.

| Check | Result | Fresh evidence |
| --- | --- | --- |
| Install | PASS | `npm ci`: 143 packages installed, 144 audited, 0 vulnerabilities. |
| Unit/integration | PASS | `npm test`: 15/15 passed across 3 files. |
| Type check | PASS | `npm run typecheck`: passed. |
| Lint | PASS | `npm run lint`: passed. |
| Exact production build | PASS | `npm run build`: passed and emitted `dist/`. |
| Full browser suite | PASS | `npm run test:e2e`: 50/50 passed across desktop and 390 × 844 mobile. |
| Worker URL check | PASS | `verify-url.sh`: HTTP 200; 803 ms network-idle load; correct demo title; `lang=en`; one h1; main present; 0 missing alt attributes; 0 unnamed buttons; 0 console/page errors. |

Production bundle sizes pass: app JS `19,283 B` raw / `7.59 kB` gzip; app CSS `22,445 B` raw / `5.50 kB` gzip; legal CSS `3,031 B` raw / `1.19 kB` gzip; mobile hero `26,300 B`. No runtime font is fetched.

## Independent product exercise

- **Normal sample:** all three policies rendered. The selected sample schedule peaked at `19.8` minutes, below the 30-minute cap. Day one showed `48 regular + 27 overdue = 75` cards and 293 overdue remaining.
- **Minimum boundary:** zero queue, 3 seconds/card, 5-minute cap, 2-day deadline, and 1 study day produced `Already clear` and a 100-card capacity.
- **Maximum boundary:** the declared maxima (100,000 counts, 10,000 new cards, 300 seconds, 480 minutes, 90 days, 7 study days) were accepted without an error and produced a bounded 96-card capacity plus a visible rollover warning.
- **Invalid/recovery:** negative input produced an actionable focused alert; correcting it allowed a rerun. Unknown CSV columns produced the documented format error; a valid summary imported 125 overdue, 31 due today, and 22 daily due. The stale-result failure is documented above.
- **Persistence/exports:** isolated claim tests passed saved-plan reload, JSON backup round-trip, schedule CSV download, and confirmed clear-local-data behavior.
- **Desktop/mobile:** both layouts were visually reviewed. At 390 px, document `scrollWidth` equalled `innerWidth`; no page-level horizontal overflow appeared. A 200% root text-size check reflowed without scroll-width exceeding the effective viewport.

AI would not improve this narrow deterministic forecast, so the absence of an AI feature is appropriate. The product has no library/CLI surface.

## Accessibility and browser behavior

- Fresh live Axe scans on Demo, Privacy, Terms, and styled 404 in both desktop and mobile found zero violations at all reported impacts, including zero serious/critical findings.
- Normal and error flows had no request failures, console errors, or uncaught page errors. The intentional HTTP 404 navigation produces Chromium's expected failed-resource console diagnostic only on that 404 document.
- The skip link is the first keyboard target, has a `3px` visible outline, and moves focus to `main`. Tooltip Escape behavior is implemented; native confirmation dialogs provide focus containment.
- Reduced motion computed to `0.00001s` transition/animation durations and `scroll-behavior: auto`.
- Heading order, `lang=en`, one h1, labels, main landmarks, alternative text, legal-page skip links, and route titles passed. The policy focus-loss and Undo target defects remain.

## Privacy, deployment identity, PWA, headers, and performance

- Browser request logs during complete desktop and mobile demo flows contained only `https://review-backlog-forecast.sociobot.in`; there were no failed requests, analytics, third-party scripts/fonts/images, Anki calls, authentication, or payment calls.
- This is a static PWA with no server-side product endpoint or factory unlock call. Rate-limit/429 and Entra authority checks are therefore not applicable.
- SHA-256 matched the clean local `dist/` for all 25 public artifacts. `staticwebapp.config.json` correctly returned 404 because deployment configuration is not a public asset. Root hash: `b689a486d443395288dda2e6136c7c78597b017594e21e523964cfa290697c79`.
- Unknown routes return the styled page with HTTP 404. Normal internal links resolve successfully. Chromium found no manifest errors; the manifest has 192, 512, and maskable icons and standalone display.
- Live offline reload passed in a fresh isolated mobile context: the activated worker controlled the page, the demo result remained present, the status changed to `Offline · forecast still works`, and caches were `rbf-v1.0.3-shell` / `rbf-v1.0.3-runtime`. The independently run full suite passed waiting-worker update activation in both projects.
- Root responses include HSTS, CSP with `frame-ancestors 'none'`, Permissions-Policy, strict referrer policy, `nosniff`, and `X-Frame-Options: DENY`. Hashed assets use `public, max-age=31536000, immutable`; the service worker and manifest use `no-cache`; the manifest MIME type is `application/manifest+json`.
- Fresh Lighthouse 12.8.2 mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 1.086 s, LCP 1.143 s, TBT 224.5 ms, CLS 0, total transfer 47,125 B. LCP, CLS, and bundle budgets pass. Lab Lighthouse does not provide a field INP value.

## Required next verification

1. Invalidate or rerun results after every assumption/import change; prevent stale save/export, including after rejected submissions.
2. Preserve radio-group focus across policy changes and test multiple arrow-key moves.
3. Make the Undo target at least 44 × 44 px and cover the transient state.
4. Put `Free` in the first-screen facts and complete canonical/Open Graph/Twitter/PWA metadata on offline and 404 routes.
5. Rebuild and redeploy, then rerun every claim plus focused live regressions for the findings above.
