# First-read review 1 — Review Backlog Forecast

**Reviewed:** 2026-09-01 UTC  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Viewport checks:** fresh 390 × 844 mobile context and fresh 1440 × 900 desktop context  
**Verdict:** **FAIL**

The product is clear and tryable on first read, and the registered functional checks pass. This review remains a FAIL because the navigation focus requirement, the claim registry, and the required plain-language copy checks have findings. The verdict can change to PASS only when every finding below is resolved and rechecked.

## Cold first read

Before scrolling, the reviewer understood the product as a tool that plans overdue spaced-repetition reviews before changing cards. It is for learners returning after missed days, and the first action is **Try it with sample data**.

The mobile first screen showed these exact lines:

- `Plan overdue reviews before changing cards.`
- `For learners returning after missed days, compare capped recovery plans before changing an Anki queue.`
- `Try it with sample data`
- `See a 320-card backlog plan. Nothing real is saved.`

The same information appeared in the desktop first viewport. The check confirmed no horizontal page overflow at 390 px and no console or page errors on the cold landing load.

## Findings

### F-1-1 — Medium — normal route navigation does not move focus to the new page heading

**Location and evidence:** From `/?demo=1`, selecting the visible **Privacy** link loaded `/privacy/` with its correct title and h1, `Keep your queue on your device.` The browser check found `document.activeElement === document.body`. Selecting Back returned to the demo and again left focus on `BODY`, rather than the route h1. The same result applies to the normal multi-page route transition, not the existing skip-link path.

**Why this needs correction:** A keyboard or screen-reader visitor receives no programmatic focus handoff after changing location. This does not meet the route-change focus requirement.

**Concrete fix:** On each route load, move focus to the page h1 (give it `tabindex="-1"`) and provide a polite route announcement. Check a browser test that selects Privacy, confirms the Privacy h1 has focus, invokes Back, and confirms the demo h1 has focus.

### F-1-2 — Minor — the Steady policy behavior is an unlisted claim

**Exact quote/location:** README, Steady bullet: `Steady aims to halve an overdue queue in one week and clear it in two with a consistent allowance.`

**Why this needs correction:** The registered `three-policies` claim confirms distinct policies, but no `claims.json` entry states or tests this one-week/two-week Steady behavior. A visitor can rely on this description when choosing a plan.

**Concrete fix:** Add a `steady-recovery-target` claim and tagged deterministic test that checks the documented sample target and its infeasible-state wording, or replace the sentence with a non-promissory description that is covered by an existing registered claim.

### F-1-3 — Minor — the Deadline policy behavior is an unlisted claim

**Exact quote/location:** README, Deadline bullet and the rendered demo policy card: `Deadline uses the spare capacity needed to meet a chosen date, or shows honestly when the date is out of reach.`

**Why this needs correction:** No claim entry checks the deadline calculation or the out-of-reach result. `three-policies` does not cover that observable outcome.

**Concrete fix:** Add `deadline-feasibility` to `claims.json` and a tagged test that checks an achievable deadline and an infeasible deadline show their respective result, or remove the untested result statement.

### F-1-4 — Minor — the Gentle policy behavior is an unlisted claim

**Exact quote/location:** README, Gentle bullet: `Gentle ramps the overdue allowance over the first five sessions.`

**Why this needs correction:** No claim entry names or tests the five-session ramp. The visitor-facing behavior is more specific than the registered general policy-comparison claim.

**Concrete fix:** Add `gentle-ramp` with a tagged test that checks the first five selected study sessions, or reduce the copy to the registered, testable distinction between the policies.

### F-1-5 — Minor — adjustable estimates are an unlisted claim

**Exact quote/location:** Landing planner: `Estimates are clearly marked and adjustable.`

**Why this needs correction:** The statement promises both visible labelling and editable behavior. It has no corresponding entry in `.factory/claims.json`.

**Concrete fix:** Add an `adjustable-estimates` browser claim that checks the estimate labels, edits an estimate, reruns the forecast, and observes the changed result. Alternatively, remove the sentence.

### F-1-6 — Minor — the hero eyebrow uses an unexplained metaphor

**Exact quote/location:** Landing hero eyebrow: `A recovery console for spaced repetition`

**Why this needs correction:** `console` is product mood language rather than the section or job name. A first-time visitor needs the plain task before the visual metaphor.

**Concrete fix:** Replace it with `Plan a spaced-repetition review backlog.`

### F-1-7 — Minor — the planner eyebrow is a metaphor rather than a section name

**Exact quote/location:** Landing planner eyebrow: `Set the dials`

**Why this needs correction:** The controls are numeric inputs, not dials. The label does not name the section for a visitor or screen-reader heading list.

**Concrete fix:** Replace it with `Forecast inputs`.

### F-1-8 — Minor — the import subsection heading does not name its content

**Exact quote/location:** Landing import panel h3: `Bring the count`

**Why this needs correction:** The phrase does not identify CSV import or queue totals.

**Concrete fix:** Replace it with `Import queue totals`.

### F-1-9 — Minor — the results eyebrow uses a metaphor

**Exact quote/location:** Rendered demo results eyebrow: `Compare the channels`

**Why this needs correction:** `channels` is not the term used for the three recovery choices elsewhere, so the heading adds a term instead of naming the section.

**Concrete fix:** Replace it with `Compare recovery plans`.

### F-1-10 — Minor — the results heading uses a mood adjective and metaphor

**Exact quote/location:** Rendered demo results h2: `Three honest routes through the queue`

**Why this needs correction:** `honest` is an unsupported quality adjective, and `routes` does not name the recovery plans. The heading does not meet the plain section-name requirement.

**Concrete fix:** Replace it with `Three recovery plans`.

### F-1-11 — Minor — the empty-state eyebrow uses a metaphor

**Exact quote/location:** Landing empty state eyebrow: `Forecast tape is blank`

**Why this needs correction:** The product has no tape. The wording makes the empty state less direct than the action it needs to request.

**Concrete fix:** Replace it with `No forecast yet`.

### F-1-12 — Minor — the assumptions eyebrow uses a metaphor

**Exact quote/location:** Rendered demo assumptions eyebrow: `Read the fine print`

**Why this needs correction:** The section describes forecast assumptions, not legal small print.

**Concrete fix:** Replace it with `Forecast assumptions`.

### F-1-13 — Minor — the safety label is vague marketing language

**Exact quote/location:** Landing form submit area: `Safe by design:`

**Why this needs correction:** The following sentences give useful, testable constraints; the label itself gives no criterion for safety.

**Concrete fix:** Replace it with `Preview only:` and retain the two following factual sentences.

### F-1-14 — Minor — the README test-suite sentence exceeds the 22-word limit

**Exact quote/location:** README, Test section: `The suite covers desktop and 390px mobile layouts, keyboard use, Axe checks, privacy, persistence, exports, offline reopening, update handling, metadata, HTTP 404 behavior, touch targets, and delayed-start CLS.` (28 words)

**Why this needs correction:** The sentence exceeds the required hard cap and combines too many independent checks.

**Concrete fix:** Replace it with: `The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift.`

### F-1-15 — Minor — the README uses inconsistent and abstract queue terminology

**Exact quote/location:** README, Who it is for: `People coming back to Anki or another spaced-repetition system after missed days who need a comprehensible recovery plan—not another opaque review button.` The landing and README also alternate among `backlog`, `queue`, `recovery policy`, `recovery plan`, `channel`, and `route` for the same concepts.

**Why this needs correction:** `comprehensible` and `opaque` are abstract terms. Alternating names makes the user map several words to the same overdue-work problem and plan choice.

**Concrete fix:** Use `overdue queue` for the workload and `recovery plan` for the choices throughout. Replace the quoted sentence with `For people returning to Anki after missed days who need a clear recovery plan.`

## Copy audit

Word counts treat hyphenated terms and product names as one word. The sentence lists cover landing-page prose with terminal punctuation and README prose. Labels, headings, and button names without terminal punctuation are checked separately below.

### Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 6 | Plan overdue reviews before changing cards. |
| 15 | For learners returning after missed days, compare capped recovery plans before changing an Anki queue. |
| 5 | See a 320-card backlog plan. |
| 4 | Nothing real is saved. |
| 6 | Three ways through the same queue. |
| 4 | Nothing is rescheduled here. |
| 7 | Use totals, or import a simple CSV. |
| 5 | Estimates are clearly marked and adjustable. |
| 9 | Import card due dates or a one-row summary. |
| 10 | The file is read in this browser and never uploaded. |
| 11 | Card rows: due_date (YYYY-MM-DD) or days_overdue, plus optional count. |
| 8 | Safe by design: this forecasts counts only. |
| 8 | It cannot read or change your Anki collection. |
| 7 | Add your queue totals to compare plans. |
| 12 | You can change every assumption and rerun as often as you need. |
| 5 | No card is ever moved. |
| 5 | A free, local-first planning utility. |
| 9 | Original AI-generated instrument image; provenance in the project design notes. |

The headings and labels checked separately are `A recovery console for spaced repetition`, `Set the dials`, `Describe your queue`, `Bring the count`, `Set your limits`, `Compare the channels`, `Three honest routes through the queue`, `Read the fine print`, and `Forecast tape is blank`. Findings F-1-6 through F-1-13 cover the flags. Button text is result-naming: **Try it with sample data**, **Import CSV or backup**, **Download CSV template**, **Load sample values**, **Run forecast**, **Use this plan**, **Export schedule**, **Export my data**, **Clear local data**, **Reset demo**, and **Start for real**.

### README sentences

| Words | Sentence |
| ---: | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. |
| 10 | It compares three recovery policies before the learner changes anything. |
| 16 | Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. |
| 12 | The demo opens a realistic 320-card backlog in its own browser database. |
| 7 | It never reads or changes real plans. |
| 19 | Steady aims to halve an overdue queue in one week and clear it in two with a consistent allowance. |
| 21 | Deadline uses the spare capacity needed to meet a chosen date, or shows honestly when the date is out of reach. |
| 10 | Gentle ramps the overdue allowance over the first five sessions. |
| 9 | Every plan protects due-today and estimated normal cards first. |
| 13 | It shows cards and minutes, exposes regular-work rollover, and enforces the session cap. |
| 10 | The app does not connect to Anki or reschedule cards. |
| 22 | People coming back to Anki or another spaced-repetition system after missed days who need a comprehensible recovery plan—not another opaque review button. |
| 8 | The app accepts a one-row queue summary CSV. |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. |
| 7 | Future rows produce an editable normal-due estimate. |
| 10 | The browser does not upload or retain raw card content. |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. |
| 6 | The import control restores that backup. |
| 9 | The selected daily schedule exports as CSV for reference. |
| 7 | Schedule CSVs are not Anki rescheduling files. |
| 6 | Requires Node.js 20.19+ or 22.12+. |
| 7 | Open the local URL printed by Vite. |
| 16 | The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root. |
| 10 | `npm run test:e2e` builds the production app before starting Playwright. |
| 28 | The suite covers desktop and 390px mobile layouts, keyboard use, Axe checks, privacy, persistence, exports, offline reopening, update handling, metadata, HTTP 404 behavior, touch targets, and delayed-start CLS. |
| 18 | Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. |
| 9 | The isolated test data is documented in `.factory/demo.md`. |
| 8 | Vite and vanilla TypeScript produce a static PWA. |
| 12 | It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. |
| 7 | No account or payment step is required. |
| 10 | Inputs and the last chosen plan are stored in IndexedDB. |
| 13 | The versioned service worker makes the app available offline after the first visit. |
| 7 | See [the privacy page](https://review-backlog-forecast.sociobot.in/privacy/) and [the terms](https://review-backlog-forecast.sociobot.in/terms/). |
| 18 | The researched opportunity lives in `.factory/brief.json`; the product-specific visual system and generated-image provenance live in `.factory/design.md`. |
| 1 | MIT. |
| 2 | See `LICENSE`. |

The only over-22-word sentence is F-1-14. The terminology and abstract-word flags are F-1-15. No landing or README button uses a generic action label.

### Terminology check

| Concept | Current terms | Recommended single term |
| --- | --- | --- |
| Missed review work | backlog, queue, overdue queue, queue totals | overdue queue |
| Choice a learner selects | policy, plan, channel, route | recovery plan |
| Expected normal work | daily due, normal cards, regular work, regular reviews | regular reviews (define once as due-today plus normal due) |

## Demo, privacy, and sandbox checks

The one-click demo check passed.

- Selecting **Try it with sample data** from a fresh mobile context opened `/?demo=1` and immediately rendered a 320-overdue, 48-due-today, 36-daily-due, 30-minute sample forecast with Steady, Deadline, and Gentle choices.
- The persistent banner read `Demo — sample data, nothing is saved to your real plan.` and exposed **Reset demo** and **Start for real**.
- Changing the sample overdue value to 999 and selecting **Reset demo** restored 320.
- The fresh context exposed separate `review-backlog-forecast` and `review-backlog-forecast-demo` IndexedDB databases. The demo had no saved real-plan strip.
- The complete demo request log contained only `https://review-backlog-forecast.sociobot.in`; no third-party, Anki, account, payment, analytics, or runtime image-service request appeared.
- The registered offline claim passed from the clean checkout in both desktop and mobile projects. It uses an isolated browser context, waits for service-worker control, then reloads the demo offline.

## Claims and clean-checkout verification

The reviewer created a fresh local clone at the base candidate, ran `npm ci`, and ran every exact command registered in `.factory/claims.json` after the production build. All 16 registered claims passed: four model claims passed one tagged Vitest test each, and each of the 12 browser claims passed in desktop and 390 px mobile projects. The full quality-gate rerun also passed:

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 143 packages installed; 0 vulnerabilities reported. |
| `npm test` | PASS — 15/15 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — emitted `dist/`. |
| `npm run test:e2e` | PASS — 56/56 tests; Playwright last-run status `passed`. |

The claim results confirm the listed cap, due-today priority, rollover, CSV import, grouped CSV import, offline reload, local-only raw-content handling, demo isolation, local persistence, backup restore, schedule export, local-data clearing, Anki isolation, third-party-runtime absence, and no-account behavior. Findings F-1-2 through F-1-5 are separate, because the quoted visitor-facing behavior is not itself registered.

## Structure, accessibility, and live-route checks

- The landing title, `Review Backlog Forecast — Preview a capped recovery plan`, matches the product-plus-purpose pattern. The demo title updates to `Demo — Review Backlog Forecast`; Privacy, Terms, and the styled HTTP 404 each have route-specific titles, one h1, description, canonical URL, Open Graph/Twitter image, favicon, and Apple touch icon.
- Fresh checks confirmed `lang="en"`, exactly one h1 on the landing and each checked route, `main`, visible focus styling, valid image alt text, no cold-load console/page errors, a 390 px document width equal to its viewport width, reduced-motion coverage, and no serious or critical Axe finding in the committed browser suite.
- All landing links crawled to HTTP 200: home/demo, the `#main` and `#guide` anchors, Privacy, and Terms. The unknown route returned the styled 404 with HTTP 404. Finding F-1-1 records the outstanding focus handoff.
- The header/footer are visually consistent and include Privacy and Terms. The mid-century recovery-console treatment matches `.factory/design.md`; the generated original hero image and its documented provenance make the identity distinct from a generic SaaS template.

## Earlier-review history check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The earlier verification and handoff records were read in full. The following prior findings were rechecked in the live site and candidate code/tests:

| Earlier finding group | Current check |
| --- | --- |
| Production URL/TLS availability | Confirmed HTTPS 200 and product HTML at the scoped URL. |
| Impossible CSV dates, numeric maximums, compact touch targets, skip-link target | Confirmed by the committed parser and browser checks; full suite passed. |
| Missing claims, 404 response, demo layout shift, metadata, footer build identity | Confirmed repaired by claims registry, styled HTTP 404, metadata, first-screen facts, and build `1.0.4`. |
| Stale results, policy-radio focus, Undo target | Confirmed by committed E2E checks; the prior stale save/export, repeated ArrowRight, and 44 px Undo failures did not reproduce. |

No AI feature is missing for this deterministic local forecast. An AI action would not improve the documented simulation or recovery decision, and no provider key is embedded.

## What would make this perfect

Move focus and announce each changed route, complete the five missing claim registrations or remove their promises, replace the metaphor/abstract copy with direct section names, and make the README use one term for each concept. Then rerun the 16 exact claim commands and the full browser suite from a clean clone.
