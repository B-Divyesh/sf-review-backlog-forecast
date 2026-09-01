# First-read review 3 — Review Backlog Forecast

**Reviewed:** 2026-09-01 UTC  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Candidate:** `33ae89cae207d84ebbc58b855f066f996c439215`  
**Viewports:** fresh 390 × 844 mobile and 1440 × 900 desktop contexts  
**Verdict:** **FAIL**

The cold landing screen is clear, and every exact command in the claim registry passes from a clean clone. The product does not pass this round because the demo result is far below the first post-click viewport, a registered claim check failed once in the full suite, and an earlier terminology finding remains only partly fixed. Minor copy, structure, claim-coverage, and import findings also remain.

## Cold first read

Before scrolling, the following was clear in both fresh contexts.

- **What it does:** it plans a capped recovery schedule for an overdue Anki queue before cards are changed.
- **Who it is for:** learners returning after missed study days.
- **What to select first:** **Try it with sample data**.

The exact first-screen copy supporting that understanding was:

- `Plan an overdue queue before changing cards.`
- `For learners returning after missed days, compare capped recovery plans before changing cards in Anki.`
- `Try it with sample data`
- `See a 320-card overdue queue plan. Nothing real is saved.`
- Mobile showed `Preview only`, `Stays on this device`, `Free`, and `No Anki access`. Desktop fully showed the first three; its header showed `Ready offline`.

The root first screen therefore passes the job, audience, and first-action check. There was no horizontal overflow or console error on the root load.

## Findings

### F-3-1 — Blocking — the one-click demo does not show the product in use on its first screen

**Exact location and evidence:** After selecting `Try it with sample data`, both viewports remained at the top marketing hero. The persistent banner appeared, but the button still read `Try it with sample data`. At 390 × 844, the `Three recovery plans` heading was approximately 3,614 px below the viewport. Neither a plan, daily result, chart, nor populated control was visible without extensive scrolling. The desktop first screen likewise showed the banner and hero, not the working forecast.

**Why this loses a first-time visitor:** The action promises a sample result. Its immediate result instead repeats the invitation and does not show the forecast the visitor selected the action to see.

**Concrete fix:** On entry to `/?demo=1`, place the populated forecast and three plan choices in the first viewport, or move focus and scroll directly to a compact sample result. Replace or hide the now-redundant hero action in demo mode. Add a 390 px and desktop check that selects the landing action and confirms a populated result card intersects the viewport without another action or scroll.

### F-3-2 — Blocking — the registered local-persistence check is timing-sensitive in the full suite

**Exact location and evidence:** The first `npm run test:e2e` run failed at `tests/e2e/app.spec.ts:350` in the desktop `@claim:local-persistence` check. After **Use this plan** and an immediate reload, `Your last chosen plan` was absent; the run finished with 59 passed and 1 failed. The exact isolated claim command passed in both projects, and a second full Playwright run passed 60/60.

**Why this misleads verification:** A claim check that changes result under normal suite load does not provide repeatable evidence that the chosen plan is stored before reload.

**Concrete fix:** Expose a committed-saving state and keep the completion message after the IndexedDB write. In the check, wait for `Deadline plan saved on this device.` or the visible saved-plan strip before reloading. Repeat the full suite several times in CI and require every run to pass.

### F-1-15 — Blocking — the earlier terminology finding is still only partly fixed

**Exact quote/location:** The live form says `Usual daily due`; its assumptions say `estimated normal reviews`; the next assumption says `regular reviews`. `public/manifest.webmanifest` also describes a `spaced-repetition backlog`, although the earlier finding required `overdue queue` outside the product name.

**Why this loses a first-time visitor:** The visitor must decide whether daily due, normal reviews, and regular reviews are separate kinds of work. The manifest also restores the workload synonym that the earlier repair said it removed.

**Concrete fix:** Use `regular reviews` for the same non-overdue work everywhere, such as `Regular reviews per day` and `estimated regular reviews`. Change the manifest description to `Preview capped recovery plans for an overdue spaced-repetition queue.` Expand the terminology regression check to cover the manifest and all visitor copy.

### F-3-3 — Minor — the demo banner uses a vague marketing adjective

**Exact quote/location:** Demo banner: `Explore the 320-card example safely.`

**Why this is unclear:** `safely` adds no checkable information beyond the preceding storage-isolation sentence.

**Concrete rewrite:** `Explore the 320-card example.`

### F-3-4 — Minor — the eyebrow repeats the headline without adding information

**Exact quote/location:** Hero eyebrow: `Plan an overdue queue.` The h1 immediately repeats `Plan an overdue queue before changing cards.`

**Why this is unnecessary:** The first sentence does not tell the visitor anything the headline does not already say.

**Concrete fix:** Remove the eyebrow. The h1 already names the job.

### F-3-5 — Minor — `simple CSV` is subjective copy

**Exact quote/location:** Forecast inputs: `Use totals, or import a simple CSV.`

**Why this is unclear:** `simple` does not tell the visitor what columns the file needs.

**Concrete rewrite:** `Enter totals or import a CSV.` Keep the accepted-column disclosure next to the import action.

### F-3-6 — Minor — a saved-plan button does not name its result

**Exact quote/location:** Saved-plan strip button: `Remove`.

**Why this is unclear:** The button does not say what will be removed.

**Concrete rewrite:** `Remove saved plan`.

### F-3-7 — Minor — the update button does not name its result

**Exact quote/location:** Update notice button: `Update`.

**Why this is unclear:** The visitor cannot tell whether it updates the app, the forecast, or saved data.

**Concrete rewrite:** `Update app`.

### F-3-8 — Minor — the README uses a subjective audience promise

**Exact quote/location:** README, Who it is for: `For people returning to Anki after missed days who need a clear recovery plan.`

**Why this is weak:** `clear` is qualitative and does not say what makes the result useful.

**Concrete rewrite:** `For people returning to Anki after missed days who need cards and minutes planned by day.`

### F-3-9 — Minor — the README uses unexplained planner jargon

**Exact quote/location:** README: `It shows cards and minutes, exposes regular-review rollover, and enforces the session cap.`

**Why this is unclear:** `regular-review rollover` is an internal model term, not a phrase a returning learner is likely to use.

**Concrete rewrite:** `It shows cards and minutes, carries unfinished regular reviews forward, and enforces the session cap.`

### F-3-10 — Minor — the README uses an unexplained abbreviation

**Exact quote/location:** README, Privacy and architecture: `Vite and vanilla TypeScript produce a static PWA.`

**Why this is unclear:** `PWA` is not explained.

**Concrete rewrite:** `Vite and TypeScript produce an installable offline web app.`

### F-3-11 — Minor — the README names an implementation detail instead of the user-visible storage

**Exact quote/location:** README: `Inputs and the last chosen plan are stored in this browser’s IndexedDB.`

**Why this is unclear:** `IndexedDB` does not help a non-developer understand where the data stays.

**Concrete rewrite:** `Inputs and the last chosen plan stay in this browser’s local database.`

### F-3-12 — Minor — the README uses unexplained offline-cache jargon

**Exact quote/location:** README: `The versioned service worker makes the app available offline after the first visit.`

**Why this is unclear:** `versioned service worker` describes implementation rather than the observable result.

**Concrete rewrite:** `After the first visit, the browser’s offline cache keeps the app available without a connection.`

### F-3-13 — Minor — `every assumption` is broader than its registered claim

**Exact quote/location:** Landing empty state: `You can change every assumption and rerun as often as you need.`

**Why this is unlisted:** `adjustable-estimates` checks one marked estimate and one changed capacity. It does not confirm that every assumption can be changed and applied.

**Concrete fix:** Rewrite this as `Edit a marked estimate, then rerun the forecast.` or extend the registered check to change every assumption and confirm each resulting effect.

### F-3-14 — Minor — the cards-and-minutes display claim is not registered

**Exact quote/location:** README: `It shows cards and minutes, exposes regular-review rollover, and enforces the session cap.`

**Why this is unlisted:** The registry covers rollover and cap enforcement, but no claim entry confirms that the rendered daily result shows both card counts and minutes.

**Concrete fix:** Add a `daily-cards-minutes` entry and a demo check that confirms both values for the selected plan, or remove that clause.

### F-3-15 — Minor — input persistence is broader than the registered persistence claim

**Exact quote/location:** README: `Inputs and the last chosen plan are stored in this browser’s IndexedDB.`

**Why this is unlisted:** `local-persistence` promises and checks the chosen plan. It does not separately register or assert that unsaved forecast inputs return after reload.

**Concrete fix:** Add an `input-persistence` claim that edits inputs without saving a plan, reloads, and confirms the values, or narrow the sentence to the chosen-plan claim.

### F-3-16 — Minor — `How it works` does not lead to the required three-step explanation

**Exact location and evidence:** The desktop header link `How it works` points to `/?demo=1#guide`. Its target is headed `Forecast assumptions` / `What moves cards in this forecast` and contains four model assumptions, not three steps for using the product.

**Why this is unclear:** The link label promises a usage explanation but lands on different information. The required site skeleton calls for three direct steps.

**Concrete fix:** Add a `How it works` section with `Enter or import totals`, `Set a session cap`, and `Compare or export a plan`, then point the header link to that section.

### F-3-17 — Minor — the Apple touch icon is not the required size

**Exact location and evidence:** Every route links `/icons/icon-192.672eaa75.png` as `apple-touch-icon`; its PNG dimensions are 192 × 192. The structure contract requires a 180 px Apple touch icon.

**Why this matters:** iOS must resample the supplied icon instead of receiving the standard asset size.

**Concrete fix:** Ship a generated 180 × 180 PNG and reference that file from every route. Add a metadata check that reads its intrinsic dimensions.

### F-3-18 — Minor — the import path does not accept a normal Anki export

**Exact location:** The import control accepts a custom one-row summary or grouped `due_date` / `days_overdue` CSV. It does not accept an Anki package or provide steps for producing the required columns from Anki.

**Why this is missed leverage:** The brief describes a local import-and-preview tool for returning Anki learners. A normal learner has an Anki export, not a custom queue-summary file.

**Concrete feature:** Add a read-only local import for a standard Anki `.apkg` or `.colpkg` export that extracts scheduling counts and discards card content, with fixtures and privacy claims. If that is not practical within the size limit, provide and test exact Anki-to-CSV export steps beside the control.

No model-assisted feature is warranted. The forecast is deterministic, and import, backup restore, schedule export, local persistence, and offline use already cover the useful non-model actions. No provider key or model endpoint appears in product code.

## Copy audit

Counts treat hyphenated compounds and file paths as one word. Words inside commands count normally. Repeated policy text is listed once with its occurrences. The first table covers the cold landing state plus the one-click rendered demo state. No audited sentence exceeds 22 words and no banned term appears.

### Landing and demo sentences

| Words | Sentence | Check |
| ---: | --- | --- |
| 7 | Plan an overdue queue before changing cards. | Route announcement; also appears as the h1 below. |
| 1 | loaded. | Route status confirmation. |
| 10 | Demo — sample data, nothing is saved to your real plan. | Maps to `demo-isolation`. |
| 5 | Explore the 320-card example safely. | F-3-3. |
| 4 | Plan an overdue queue. | F-3-4. |
| 7 | Plan an overdue queue before changing cards. | Clear h1; under nine words. |
| 15 | For learners returning after missed days, compare capped recovery plans before changing cards in Anki. | Clear audience and result. |
| 6 | See a 320-card overdue queue plan. | Demo result is not in the next viewport; F-3-1. |
| 4 | Nothing real is saved. | Maps to `demo-isolation`. |
| 4 | Compare three recovery plans. | Maps to `three-policies`. |
| 4 | Nothing is rescheduled here. | Maps to `anki-isolation`. |
| 7 | Use totals, or import a simple CSV. | F-3-5. |
| 4 | Labels mark each estimate. | Maps to `adjustable-estimates`. |
| 8 | You can edit it before running a forecast. | `it` refers to each marked estimate; accepted with nearby context. |
| 8 | Import card due dates or a one-row summary. | Maps to the two import claims. |
| 10 | The file is read in this browser and never uploaded. | Maps to `local-only`. |
| 9 | Card rows: `due_date` (YYYY-MM-DD) or `days_overdue`, plus optional `count`. | Schema fragment is concrete and necessary. |
| 6 | Preview only: this forecasts counts only. | Maps to `anki-isolation`. |
| 8 | It cannot read or change your Anki collection. | Maps to `anki-isolation`. |
| 11 | 150 cards fit inside the 30-minute cap at 12 seconds each. | Maps to `hard-session-cap`. |
| 8 | Uses the same overdue allowance each study session. | Steady card and selected detail; maps to `three-policies`. |
| 14 | The sample halves the overdue queue in one week and clears it in two. | Appears twice; maps to `steady-recovery-target`. |
| 10 | Uses the spare capacity needed for your chosen finish date. | Maps to `deadline-feasibility`. |
| 10 | It says when the deadline cannot fit within your cap. | Maps to `deadline-feasibility`. |
| 6 | Starts at half the Steady allowance. | Maps to `gentle-ramp`. |
| 9 | It reaches the full allowance after five study sessions. | Maps to `gentle-ramp`. |
| 5 | Today stays in the plan. | Maps to `due-today-priority`. |
| 10 | Due-today and estimated normal reviews get capacity before overdue cards. | Terminology regression; F-1-15. |
| 5 | One pace for every card. | Concrete assumption. |
| 7 | Minutes are card count × your seconds-per-review estimate. | Concrete formula. |
| 5 | Rest days add regular reviews. | Terminology comparison; F-1-15. |
| 8 | Unreviewed regular reviews roll forward and stay visible. | Maps to `rollover-visible`. |
| 5 | Anki scheduling is not simulated. | Maps to `anki-isolation`. |
| 9 | Future intervals, retention, lapses, and FSRS changes remain unknown. | Clear scope limit. |
| 9 | Add your overdue queue totals to compare recovery plans. | Clear empty-state action. |
| 12 | You can change every assumption and rerun as often as you need. | Unlisted breadth; F-3-13. |
| 5 | No card is ever moved. | Maps to `anki-isolation`. |
| 10 | A free planning tool that keeps plans on this device. | Maps to `no-account` and local storage claims. |

### README sentences

| Words | Sentence | Check |
| ---: | --- | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. | Clear. |
| 10 | It compares three recovery plans before the learner changes anything. | `three-policies`. |
| 18 | Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. | Demo path present. |
| 12 | The demo opens a 320-card overdue queue in its own browser database. | `demo-isolation`. |
| 7 | It never reads or changes real plans. | `demo-isolation`. |
| 9 | Steady uses the same overdue allowance each study session. | `three-policies`. |
| 14 | The sample halves the overdue queue in one week and clears it in two. | `steady-recovery-target`. |
| 9 | Deadline uses spare capacity for your chosen finish date. | `deadline-feasibility`. |
| 10 | It says when the deadline cannot fit within your cap. | `deadline-feasibility`. |
| 7 | Gentle starts at half the Steady allowance. | `gentle-ramp`. |
| 9 | It reaches the full allowance after five study sessions. | `gentle-ramp`. |
| 10 | Every recovery plan protects due-today and estimated regular reviews first. | `due-today-priority`. |
| 13 | It shows cards and minutes, exposes regular-review rollover, and enforces the session cap. | F-3-9 and unlisted clause F-3-14. |
| 10 | The app does not connect to Anki or reschedule cards. | `anki-isolation`. |
| 14 | For people returning to Anki after missed days who need a clear recovery plan. | F-3-8. |
| 8 | The app accepts a one-row queue summary CSV. | `csv-import`. |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. | `grouped-csv-import`. |
| 10 | The browser does not upload or retain raw card content. | `local-only`. |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. | `backup-roundtrip`. |
| 6 | The import control restores that backup. | `backup-roundtrip`. |
| 9 | The selected daily schedule exports as CSV for reference. | `schedule-export`. |
| 7 | Schedule CSVs are not Anki rescheduling files. | `anki-isolation`. |
| 5 | Requires Node.js 20.19+ or 22.12+. | Concrete runtime requirement. |
| 7 | Open the local URL printed by Vite. | Concrete run instruction. |
| 18 | The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root. | Concrete build instruction. |
| 11 | `npm run test:e2e` builds the production app before starting Playwright. | Concrete test instruction. |
| 15 | The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. | Confirmed, with F-3-2 reliability exception. |
| 15 | It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift. | Confirmed by test names and rerun. |
| 13 | Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. | Not correct; F-3-13 through F-3-15. |
| 8 | The isolated test data is documented in `.factory/demo.md`. | Confirmed. |
| 8 | Vite and vanilla TypeScript produce a static PWA. | F-3-10. |
| 12 | It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. | `no-third-party-runtime`. |
| 7 | No account or payment step is required. | `no-account`. |
| 12 | Inputs and the last chosen plan are stored in this browser’s IndexedDB. | F-3-11 and unlisted input claim F-3-15. |
| 13 | The versioned service worker makes the app available offline after the first visit. | F-3-12; behavior maps to `offline-reload`. |
| 7 | See the privacy page and the terms. | Both links return 200. |
| 16 | The researched opportunity lives in `.factory/brief.json`; the product-specific visual system and generated-image provenance live in `.factory/design.md`. | Concrete repository documentation. |
| 1 | MIT. | Clear license. |
| 2 | See `LICENSE`. | Clear action. |

### Headings, terms, and controls

- Section headings are direct and understandable: `Forecast inputs`, `Import queue totals`, `Set your limits`, `Three recovery plans`, `Selected recovery plan`, `Forecast assumptions`, and `No forecast yet`. No metaphor or mood heading remains.
- The primary and normal controls name results: `Try it with sample data`, `Import CSV or backup`, `Download CSV template`, `Load sample values`, `Run forecast`, `Use this plan`, `Export schedule`, `Export my data`, `Clear local data`, `Reset demo`, and `Start for real`.
- `Remove` and `Update` are the two control-label findings, F-3-6 and F-3-7.
- The intended term set is `overdue queue`, `recovery plan`, and `regular reviews`. F-1-15 records the remaining conflicts.

## Demo, sandbox, and request checks

- The landing action opens `/?demo=1` in one click and loads a realistic 320-overdue, 48-due-today, 36-regular-review, 30-minute sample.
- The persistent banner says `Demo — sample data, nothing is saved to your real plan.` and exposes **Reset demo** and **Start for real**.
- Editing overdue from 320 to 999 and selecting **Reset demo** restored 320 after the asynchronous reset completed.
- A real seven-card plan saved before demo entry did not appear in demo mode. The demo showed 320 instead. **Start for real** returned to `/`.
- The full live flow requested only `https://review-backlog-forecast.sociobot.in`. The registered raw-content and third-party-request checks passed in fresh browser contexts.
- The isolated offline claim loaded the demo, acquired service-worker control, disabled the connection, reloaded, and retained the forecast in desktop and mobile projects.
- F-3-1 records the failed first-post-click-viewport requirement.

## Claim verification

A fresh clone at `/tmp/rbf-review3-EoeFu4` was installed with `npm ci`. Every exact `test` command in `.factory/claims.json` was run separately.

| Claim id | Exact command result |
| --- | --- |
| `three-policies` | PASS — 1 tagged Vitest check. |
| `hard-session-cap` | PASS — 1 tagged Vitest check. |
| `due-today-priority` | PASS — 1 tagged Vitest check. |
| `rollover-visible` | PASS — 1 tagged Vitest check. |
| `steady-recovery-target` | PASS — 1 tagged Vitest check. |
| `deadline-feasibility` | PASS — 1 tagged Vitest check. |
| `gentle-ramp` | PASS — 1 tagged Vitest check. |
| `csv-import` | PASS — desktop and mobile. |
| `grouped-csv-import` | PASS — desktop and mobile. |
| `offline-reload` | PASS — isolated desktop and mobile contexts. |
| `local-only` | PASS — same-origin requests and no retained raw marker. |
| `adjustable-estimates` | PASS — desktop and mobile. |
| `demo-isolation` | PASS — desktop and mobile. |
| `local-persistence` | PASS in its exact isolated command; see the full-suite failure in F-3-2. |
| `backup-roundtrip` | PASS — desktop and mobile. |
| `schedule-export` | PASS — desktop and mobile. |
| `clear-local-data` | PASS — desktop and mobile. |
| `anki-isolation` | PASS — same-origin requests only. |
| `no-third-party-runtime` | PASS — same-origin requests and no font request. |
| `no-account` | PASS — the complete sample opened without credentials or payment. |

The cross-check found three broader claim-like sentences without matching registry coverage: F-3-13, F-3-14, and F-3-15.

## Earlier review and polish history

Every earlier review, both polish records, and the prior handoff were read. The live site and current source were checked rather than relying on their recorded status.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: Privacy navigation focuses its h1; Back focuses the demo h1; both route announcements update. |
| F-1-2 | Fixed: `steady-recovery-target` is registered and its exact check passes. |
| F-1-3 | Fixed: `deadline-feasibility` is registered and its exact check passes. |
| F-1-4 | Fixed: `gentle-ramp` is registered and its exact check passes. |
| F-1-5 | Fixed: `adjustable-estimates` is registered and its exact check passes. |
| F-1-6 | Fixed: the recovery-console eyebrow is absent. F-3-4 separately covers the redundant replacement. |
| F-1-7 | Fixed: the input section says `Forecast inputs`. |
| F-1-8 | Fixed: the import section says `Import queue totals`. |
| F-1-9 | Fixed: the results eyebrow says `Compare recovery plans`. |
| F-1-10 | Fixed: the result h2 says `Three recovery plans`. |
| F-1-11 | Fixed: the empty state says `No forecast yet`. |
| F-1-12 | Fixed: the assumptions label says `Forecast assumptions`. |
| F-1-13 | Fixed: the form says `Preview only`. |
| F-1-14 | Fixed: the long README test sentence remains split; no audited sentence exceeds 22 words. |
| F-1-15 | Not fully fixed: `daily due`, `normal reviews`, and `regular reviews` remain; the manifest restores `backlog`. This is blocking again above. |
| F-2-1 | Fixed: at 1440 × 900, `Free` is fully visible from y=866.5 to 885.8. |
| F-2-2 | Fixed: `local-first` is absent from visitor copy; the footer explains that plans stay on the device. |
| F-2-3 | Fixed: the generated-image note is absent from the visitor footer; provenance remains in `.factory/design.md`. |

The polish records' route focus, claim registration, direct headings, first-row price, footer copy, and image-note changes are present. The previous handoff's statement that no gaps remain is not confirmed by this round because of the findings above.

## Structure, accessibility, and quality checks

| Check | Result |
| --- | --- |
| Titles | PASS — root, demo, Privacy, Terms, offline, and 404 use route-appropriate plain titles. |
| One h1, language, and main | PASS on every checked route. |
| Description, canonical, Open Graph, Twitter, favicon | PASS; the social image is 1200 × 630. Apple touch size is F-3-17. |
| Designed 404 | PASS — an unknown URL returns HTTP 404 with the product-styled page and links home, Demo, Privacy, and Terms. |
| Deep links, Back, and focus | PASS for `/?demo=1#guide`, Privacy navigation, Back, h1 focus, and polite announcements. F-3-16 covers the guide label/content mismatch. |
| Link crawl | PASS — all internal page links returned 200 or reached an existing same-page target. |
| Header and footer | PASS — consistent product mark, Privacy, Terms, factory credit, and build `1.0.5`. |
| Distinct identity | PASS — the paper, enamel, brass, vermilion, ruled layout, custom mark, and original console image match `.factory/design.md` and do not resemble a generic centered-card template. |
| Request privacy | PASS — live requests stayed same-origin; no third-party script, font, analytics, advertising, Anki, or payment request appeared. |
| Accessibility URL check | PASS — title, `lang=en`, one h1, main, image alt, button labels, and no console errors on the demo route. |
| Axe CLI | PASS — axe-core 4.13.0 returned `violations: []` for WCAG 2 A/AA and WCAG 2.1 AA tags. |
| Keyboard, touch, motion | PASS in committed checks; visible focus, 44 px targets, arrow-key radios, skip links, and reduced-motion rules are present. |
| Mobile layout | PASS — no page-level horizontal overflow at 390 px. |
| First-load size | PASS — built JavaScript is about 8.16 kB gzip, below 150 kB. |
| `npm test` | PASS — 19 tests. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — `dist/` produced. |
| `npm run test:e2e` | FAIL once at `@claim:local-persistence` with 59/60; immediate rerun passed 60/60. See F-3-2. |

## What would make this perfect

Show the populated forecast in the first post-click viewport, make local-persistence verification deterministic, and finish the earlier terminology repair. Then remove subjective and redundant copy, register the three broader product claims, make the header's `How it works` link lead to three actual steps, supply the 180 px touch icon, and provide a direct or clearly documented Anki export import. Repeat every claim command and the complete suite until all runs pass with zero findings.
