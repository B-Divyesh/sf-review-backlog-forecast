# Adversarial first-read review 5 — Review Backlog Forecast

**Reviewed:** 2026-09-02 UTC
**Production URL:** <https://review-backlog-forecast.sociobot.in/>
**Repository commit:** `0535b6020cbe87c143cf09621bd0dcb90004c416`
**Viewports:** fresh 390 × 844 mobile and 1440 × 900 desktop contexts
**Verdict:** **FAIL**

No blocking defect was found. Nine minor findings remain, so the required
zero-finding threshold is not met.

## Cold first read

Before scrolling or reading repository context, both fresh browser contexts
made all three required answers clear.

- **What it does:** compares capped plans for working through overdue Anki
  reviews before the learner changes cards.
- **Who it is for:** learners returning after missed study days.
- **What to select first:** **Try it with sample data**.

The exact first-screen copy was `Plan an overdue queue before changing cards.`,
`For learners returning after missed days, compare capped recovery plans before
changing cards in Anki.`, and `Try it with sample data`. The adjacent result
copy was `See a 320-card overdue queue plan. Nothing real is saved.` Mobile also
showed all four facts: `Preview only`, `Stays on this device`, `Free`, and `No
Anki access`. Desktop showed those facts and `Ready offline`. There was no
horizontal overflow or cold-load console error.

## Findings

### F-5-1 — Minor — the capacity formula is an unlisted claim

**Exact quote/location:** Demo result and Forecast assumptions: `150 cards fit
inside the 30-minute cap at 12 seconds each.` and `One pace for every card.
Minutes are card count × your seconds-per-review estimate.`

**Why this can mislead:** These sentences state the forecast's quantitative
formula. `hard-session-cap` checks only that schedules stay under the cap, and
`adjustable-estimates` registers editability rather than the stated formula.
There is no `claims.json` entry whose claim names this calculation.

**Concrete fix:** Add a `minutes-formula` claim and one tagged deterministic
test that checks several card-count and seconds-per-review combinations,
including `150 × 12 seconds = 30 minutes`. Alternatively, remove both formula
statements.

### F-5-2 — Minor — rest-day queue growth is an unlisted claim

**Exact quote/location:** Landing/demo Forecast assumptions: `Rest days add
regular reviews.`

**Why this can mislead:** `rollover-visible` proves that unfinished regular work
remains visible. It does not register or test the separate rule that new regular
reviews accrue on a non-study day.

**Concrete fix:** Add a `rest-day-accrual` claim and tagged model test that
compares the queue before and after a configured rest day, or remove the
sentence.

### F-5-3 — Minor — the demo route publishes landing-page canonical and social metadata

**Exact quote/location:** The live `/?demo=1` document updates its runtime title
to `Demo — Review Backlog Forecast`, but its raw head still contains canonical
`https://review-backlog-forecast.sociobot.in/`, Open Graph URL `/`, and Open
Graph/Twitter title `Review Backlog Forecast — Plan an overdue queue`.

**Why this can mislead:** The sitemap lists `/?demo=1` as a route, but crawlers
and link previews receive landing-page metadata for it. A shared sample link is
therefore identified as the landing page instead of the populated demo.

**Concrete fix:** Give the demo a static `/demo/` document with `Demo — Review
Backlog Forecast`, demo-specific description, self-canonical URL, and matching
Open Graph/Twitter fields. Update demo links, the sitemap, README, and a test
that inspects the raw response head rather than only `document.title`.

### F-5-4 — Minor — the save action does not name its result

**Exact quote/location:** Selected recovery plan button: `Use this plan`.

**Why this can mislead:** The action only saves the choice in this browser. It
does not apply the schedule to Anki, so `Use` leaves the result unclear despite
the surrounding preview warnings.

**Concrete rewrite:** `Save this plan` or `Save plan on this device`.

### F-5-5 — Minor — the forecast assumptions use an unexplained acronym

**Exact quote/location:** `Future intervals, retention, lapses, and FSRS changes
remain unknown.`

**Why a first-time visitor can be lost:** `FSRS` is not expanded or explained,
and the useful limitation does not require the algorithm name.

**Concrete rewrite:** `Future intervals, retention, lapses, and scheduler
changes remain unknown.`

### F-5-6 — Minor — the README uses `runtime image service` jargon

**Exact quote/location:** README, Privacy and architecture: `It loads no
third-party fonts, scripts, analytics, advertising, or runtime image service.`

**Why a reader can be lost:** `runtime image service` is an implementation
phrase rather than a plain privacy result.

**Concrete rewrite:** `It loads no third-party fonts, scripts, analytics, or
advertising. It does not fetch images from another service.`

### F-5-7 — Minor — the README describes a check with web-performance jargon

**Exact quote/location:** README, Test: `It also checks offline reopening,
updates, metadata, 404 behavior, touch targets, and startup layout shift.`

**Why a reader can be lost:** `metadata` and `startup layout shift` do not name
the visible outcomes being checked.

**Concrete rewrite:** `It also checks offline reopening, updates, page details,
404 behavior, touch targets, and content movement while loading.`

### F-5-8 — Minor — route announcements create a sentence fragment

**Exact quote/location:** The live-region output on the root route is `Plan an
overdue queue before changing cards. loaded.` Privacy similarly announces
`Keep your queue on your device. loaded.` The route script appends ` loaded.`
to h1 text that already ends in a period.

**Why a first-time visitor can be lost:** A screen-reader visitor hears an
ungrammatical second fragment each time a punctuated route heading loads.

**Concrete fix:** Announce `Page loaded: Plan an overdue queue before changing
cards.` or strip terminal punctuation before appending ` loaded.` Add exact
announcement assertions for root, Privacy, Terms, and Back navigation.

### F-5-9 — Minor — the offline route drops a primary navigation link

**Exact location:** Root, Privacy, Terms, and 404 headers contain `Demo`, `How
it works`, and `Privacy`. `/offline.html` contains only `Demo` and `Privacy`.

**Why a first-time visitor can be lost:** The standard header changes on the
one route where a reconnecting visitor may need the usage explanation.

**Concrete fix:** Add the same `How it works` link to the offline header and
extend the shared-chrome test to include `/offline.html`.

## Copy audit

Counts treat hyphenated compounds, paths, and inline commands as one word.
Repeated policy copy is listed once. The landing table covers the cold page and
the immediate one-click demo result. No sentence exceeds 22 words and no banned
marketing adjective appears.

### Landing and immediate demo sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 10 | Demo — sample data, nothing is saved to your real plan. | — |
| 5 | Explore the 320-card example. | — |
| 7 | Plan an overdue queue before changing cards. | — |
| 15 | For learners returning after missed days, compare capped recovery plans before changing cards in Anki. | — |
| 6 | See a 320-card overdue queue plan. | — |
| 4 | Nothing real is saved. | — |
| 4 | Compare three recovery plans. | — |
| 4 | Nothing is rescheduled here. | — |
| 10 | Preview a recovery plan before you change cards in Anki. | — |
| 10 | Add your overdue queue, due-today cards, and regular reviews estimate. | — |
| 10 | Choose the minutes you can study in one session. | — |
| 12 | Choose a recovery plan, then save or export its daily schedule. | — |
| 6 | Enter totals or import a CSV. | — |
| 5 | Labels mark each estimate. | — |
| 8 | You can edit it before running a forecast. | — |
| 8 | Import card due dates or a one-row summary. | — |
| 10 | The file is read in this browser and never uploaded. | — |
| 11 | In Anki Desktop, open Browse and search `is:review prop:due<0`. | — |
| 12 | Copy the shown count into `overdue` in the downloaded template. | — |
| 11 | Search `is:review prop:due=0` and copy its count into `due_today`. | — |
| 13 | Enter a usual day’s regular reviews in `daily_due`, then import the saved CSV. | — |
| 6 | Preview only: this forecasts counts only. | — |
| 8 | It cannot read or change your Anki collection. | — |
| 11 | 150 cards fit inside the 30-minute cap at 12 seconds each. | F-5-1 |
| 8 | Uses the same overdue allowance each study session. | — |
| 14 | The sample halves the overdue queue in one week and clears it in two. | — |
| 10 | Uses the spare capacity needed for your chosen finish date. | — |
| 10 | It says when the deadline cannot fit within your cap. | — |
| 6 | Starts at half the Steady allowance. | — |
| 9 | It reaches the full allowance after five study sessions. | — |
| 5 | Today stays in the plan. | — |
| 10 | Due-today and estimated regular reviews get capacity before overdue cards. | — |
| 6 | One pace for every card. | F-5-1 |
| 7 | Minutes are card count × your seconds-per-review estimate. | F-5-1 |
| 5 | Rest days add regular reviews. | F-5-2 |
| 8 | Unreviewed regular reviews roll forward and stay visible. | — |
| 5 | Anki scheduling is not simulated. | — |
| 9 | Future intervals, retention, lapses, and FSRS changes remain unknown. | F-5-5 |
| 8 | Edit a marked estimate, then rerun the forecast. | — |
| 5 | No card is ever moved. | — |
| 10 | A free planning tool that keeps plans on this device. | — |
| 4 | Three recovery plans loaded. | — |
| 1 | loaded. | F-5-8; generated after a punctuated h1 |

### README sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. | — |
| 10 | It compares three recovery plans before the learner changes anything. | — |
| 18 | Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. | — |
| 12 | The demo opens a 320-card overdue queue in its own browser database. | — |
| 7 | It never reads or changes real plans. | — |
| 9 | Steady uses the same overdue allowance each study session. | — |
| 14 | The sample halves the overdue queue in one week and clears it in two. | — |
| 9 | Deadline uses spare capacity for your chosen finish date. | — |
| 10 | It says when the deadline cannot fit within your cap. | — |
| 7 | Gentle starts at half the Steady allowance. | — |
| 9 | It reaches the full allowance after five study sessions. | — |
| 10 | Every recovery plan protects due-today and estimated regular reviews first. | — |
| 14 | It shows cards and minutes, carries unfinished regular reviews forward, and enforces the session cap. | — |
| 10 | The app does not connect to Anki or reschedule cards. | — |
| 14 | For people returning to Anki after missed days who need cards and minutes planned by day. | — |
| 8 | The app accepts a one-row queue summary CSV. | — |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. | — |
| 10 | The browser does not upload or retain raw card content. | — |
| 10 | To make a summary CSV from Anki Desktop, open **Browse**. | — |
| 12 | Search `is:review prop:due<0`, then copy the count into `overdue` in the template. | — |
| 11 | Search `is:review prop:due=0`, then copy that count into `due_today`. | — |
| 9 | Enter a usual day’s regular reviews in `daily_due`. | — |
| 6 | Save the file, then import it. | — |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. | — |
| 6 | The import control restores that backup. | — |
| 9 | The selected daily schedule exports as CSV for reference. | — |
| 7 | Schedule CSVs are not Anki rescheduling files. | — |
| 5 | Requires Node.js 20.19+ or 22.12+. | — |
| 7 | Open the local URL printed by Vite. | — |
| 8 | To test offline behavior, use a production build. | — |
| 18 | The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root. | — |
| 11 | `npm run test:e2e` builds the production app before starting Playwright. | — |
| 15 | The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. | — |
| 15 | It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift. | F-5-7 |
| 13 | Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. | — |
| 8 | The isolated test data is documented in `.factory/demo.md`. | — |
| 8 | Vite and TypeScript produce an installable offline web app. | — |
| 12 | It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. | F-5-6 |
| 7 | No account or payment step is required. | — |
| 12 | Inputs and the last chosen plan stay in this browser’s local database. | — |
| 14 | After the first visit, the browser’s offline cache keeps the app available without a connection. | — |
| 7 | See the privacy page and the terms. | — |
| 6 | The researched opportunity is in `.factory/brief.json`. | — |
| 10 | The visual system and image source record are in `.factory/design.md`. | — |
| 1 | MIT. | — |
| 2 | See `LICENSE`. | — |

### Headings, controls, and terminology

The section headings name their content: `How it works`, `Enter or import
totals`, `Set a session cap`, `Compare or export a plan`, `Describe your overdue
queue`, `Import queue totals`, `Set your limits`, `Three recovery plans`,
`Steady plan`, `What moves cards in this forecast`, and `No forecast yet`.

The actions are `Try it with sample data`, `Reset demo`, `Start for real`,
`Open plan`, `Remove saved plan`, `Import CSV or backup`, `Download CSV
template`, `Load sample values`, `Run forecast`, `Use this plan`, `Export
schedule`, `Export my data`, `Clear local data`, and `Update app`. F-5-4 is the
only result-naming failure.

| Concept | Consistent term |
| --- | --- |
| Missed review work | overdue queue |
| A selectable option | recovery plan |
| Expected non-overdue work | regular reviews |

## Demo, storage, privacy, and offline behavior

The one-click demo itself passes.

- Selecting **Try it with sample data** from the fresh 390 px root opened
  `/?demo=1`. `Three recovery plans` began at 281 px and the first populated
  Steady card began at 345 px, inside the 844 px first viewport.
- The banner read `Demo — sample data, nothing is saved to your real plan.` and
  exposed **Reset demo** and **Start for real**.
- Changing overdue cards to 999 and selecting **Reset demo** restored 320.
- A real Steady plan saved with 123 overdue cards remained hidden in demo mode.
  Demo opened with 320. After saving a 777-card demo edit and selecting **Start
  for real**, the real 123-card input and saved plan returned unchanged.
- The live demo flow made same-origin GET requests only, with no request bodies
  and no console/page errors.
- In a fresh live service-worker context, Gentle was saved, the browser was put
  offline, and reload restored `Gentle · 320 overdue · 30-minute cap`; the
  status read `Offline · forecast still works`.

## Claims and clean-clone verification

A new clone at `/tmp/rbf-review5-clean-ol4SQs` was checked out at the reviewed
commit and installed with `npm ci` (143 packages, zero reported
vulnerabilities). Every exact command in `.factory/claims.json` was run
separately.

| Claim | Exact test | Result |
| --- | --- | --- |
| `three-policies` | `npm test -- -t @claim:three-policies` | PASS |
| `hard-session-cap` | `npm test -- -t @claim:hard-session-cap` | PASS |
| `due-today-priority` | `npm test -- -t @claim:due-today-priority` | PASS |
| `rollover-visible` | `npm test -- -t @claim:rollover-visible` | PASS |
| `steady-recovery-target` | `npm test -- -t @claim:steady-recovery-target` | PASS |
| `deadline-feasibility` | `npm test -- -t @claim:deadline-feasibility` | PASS |
| `gentle-ramp` | `npm test -- -t @claim:gentle-ramp` | PASS |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS, desktop + mobile |
| `grouped-csv-import` | `npm run test:e2e -- --grep @claim:grouped-csv-import` | PASS, desktop + mobile |
| `anki-csv-steps` | `npm run test:e2e -- --grep @claim:anki-csv-steps` | PASS, desktop + mobile |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, desktop + mobile |
| `installability` | `npm run test:e2e -- --grep @claim:installability` | PASS, desktop + mobile |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS, desktop + mobile |
| `no-forecast-transmission` | `npm run test:e2e -- --grep @claim:no-forecast-transmission` | PASS, desktop + mobile |
| `adjustable-estimates` | `npm run test:e2e -- --grep @claim:adjustable-estimates` | PASS, desktop + mobile |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS, desktop + mobile |
| `local-persistence` | `npm run test:e2e -- --grep @claim:local-persistence` | PASS, desktop + mobile |
| `saved-plan-offline` | `npm run test:e2e -- --grep @claim:saved-plan-offline` | PASS, desktop + mobile |
| `input-persistence` | `npm run test:e2e -- --grep @claim:input-persistence` | PASS, desktop + mobile |
| `backup-roundtrip` | `npm run test:e2e -- --grep @claim:backup-roundtrip` | PASS, desktop + mobile |
| `schedule-export` | `npm run test:e2e -- --grep @claim:schedule-export` | PASS, desktop + mobile |
| `daily-cards-minutes` | `npm run test:e2e -- --grep @claim:daily-cards-minutes` | PASS, desktop + mobile |
| `clear-local-data` | `npm run test:e2e -- --grep @claim:clear-local-data` | PASS, desktop + mobile |
| `anki-isolation` | `npm run test:e2e -- --grep @claim:anki-isolation` | PASS, desktop + mobile |
| `no-third-party-runtime` | `npm run test:e2e -- --grep @claim:no-third-party-runtime` | PASS, desktop + mobile |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS, desktop + mobile |

F-5-1 and F-5-2 are unlisted claims, so their existing implementation does not
replace the missing registry entries and exact tagged tests.

The complete clean-clone gates also passed: `npm test` 20/20, lint, typecheck,
build with `dist/`, and `npm run test:e2e` 80/80. The built application JavaScript
is 7.98 KiB gzip. The deployed `index.html` and `sw.js` hashes match the clean
build.

## Structure, links, accessibility, and identity

- `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/offline.html`, and an unknown path
  returned the expected 200/404 status. Every checked route has `lang=en`, one
  h1, one main landmark, a description, canonical, social image metadata,
  favicon, and 180 px Apple touch icon. F-5-3 records the demo metadata mismatch.
- Every link exposed by the live demo returned HTTP 200: home, demo, main and
  How it works anchors, Privacy, and Terms. The designed unknown route returned
  HTTP 404 and offered a sample-data route back.
- Privacy navigation focused its h1 and announced the route. Browser Back
  restored the demo, focused `Three recovery plans`, and announced it. The
  `#how-it-works` deep link scrolled its target to the viewport top. F-5-8
  records the announcement wording defect.
- `/opt/fleet/lib/verify-url.sh` passed the live demo in 828 ms with no errors,
  one h1, a main landmark, valid alt text, and named buttons.
- Playwright Axe found zero violations on root, demo, Privacy, Terms, offline,
  and 404. Standalone `npx @axe-core/cli` found zero demo violations. The full
  suite also covers keyboard use, focus contrast, reduced motion, 44 px touch
  targets, and 200% text behavior.
- The paper, enamel, brass, vermilion, ruled-grid, and physical three-track
  instrument image match `.factory/design.md`. The asymmetric console is
  recognisably product-specific rather than a generic SaaS template.

## Earlier finding verification

Every earlier review, polish record, and handoff was read. Prior findings were
checked against both the deployed site and the candidate code/tests.

| Earlier finding | Current verification |
| --- | --- |
| Review 1 F-1-1 | Fixed: Privacy and Back focus their h1 and update the live region. F-5-8 is a new wording defect, not a focus regression. |
| Review 1 F-1-2 | Fixed: `steady-recovery-target` is registered and passed. |
| Review 1 F-1-3 | Fixed: `deadline-feasibility` is registered and passed. |
| Review 1 F-1-4 | Fixed: `gentle-ramp` is registered and passed. |
| Review 1 F-1-5 | Fixed: `adjustable-estimates` is registered and passed. |
| Review 1 F-1-6 | Fixed: the recovery-console hero eyebrow is absent. |
| Review 1 F-1-7 | Fixed: the section says `Forecast inputs`. |
| Review 1 F-1-8 | Fixed: the section says `Import queue totals`. |
| Review 1 F-1-9 | Fixed: the section says `Compare recovery plans`. |
| Review 1 F-1-10 | Fixed: the result heading says `Three recovery plans`. |
| Review 1 F-1-11 | Fixed: the empty-state label says `No forecast yet`. |
| Review 1 F-1-12 | Fixed: the section says `Forecast assumptions`. |
| Review 1 F-1-13 | Fixed: the form label says `Preview only`. |
| Review 1 F-1-14 | Fixed: the README test description remains split into short sentences. |
| Review 1 F-1-15 | Fixed: visitor copy consistently uses `overdue queue`, `recovery plan`, and `regular reviews`. |
| Review 2 F-1-15 | Fixed on the live hero, form, assumptions, manifest, and README. |
| Review 2 F-2-1 | Fixed: `Free` is visible in the desktop and mobile first view. |
| Review 2 F-2-2 | Fixed: the visitor footer says plans stay on this device. |
| Review 2 F-2-3 | Fixed: asset-source copy is absent from the visitor footer. |
| Review 3 F-3-1 | Fixed: the first post-click viewport contains populated plan choices; the first card begins at 345 px on mobile. |
| Review 3 F-3-2 | Fixed: the save waits for IndexedDB completion; its claim and full 80-test suite passed. |
| Review 3 F-1-15 | Fixed: retired workload and regular-review synonyms are absent from visitor copy. |
| Review 3 F-3-3 | Fixed: the banner says `Explore the 320-card example.` |
| Review 3 F-3-4 | Fixed: the redundant hero eyebrow is absent. |
| Review 3 F-3-5 | Fixed: the input copy says `Enter totals or import a CSV.` |
| Review 3 F-3-6 | Fixed: the action says `Remove saved plan`. |
| Review 3 F-3-7 | Fixed: the service-worker action says `Update app`. |
| Review 3 F-3-8 | Fixed: the README audience sentence names cards and minutes planned by day. |
| Review 3 F-3-9 | Fixed: the README says unfinished regular reviews carry forward. |
| Review 3 F-3-10 | Fixed: the README says `installable offline web app`. |
| Review 3 F-3-11 | Fixed: the README says `browser’s local database`. |
| Review 3 F-3-12 | Fixed: the README describes offline availability without naming a service worker. |
| Review 3 F-3-13 | Fixed: the empty state asks the visitor to edit a marked estimate. |
| Review 3 F-3-14 | Fixed: `daily-cards-minutes` is registered and passed. |
| Review 3 F-3-15 | Fixed: `input-persistence` is registered and passed. |
| Review 3 F-3-16 | Fixed: `How it works` leads to three direct usage steps. |
| Review 3 F-3-17 | Fixed: every checked route links the 180 × 180 Apple touch icon. |
| Review 3 F-3-18 | Fixed by the permitted fallback: local Anki count steps, a CSV template, and the tagged import test are present. |
| Review 4 F-4-1 | Fixed: the README says `To test offline behavior`. |
| Review 4 F-4-2 | Fixed: the README says `image source record`. |

No earlier blocking finding is unfixed, half-fixed, or regressed.

## Missed leverage

No additional AI step is warranted. The useful result is a deterministic,
auditable forecast, and a model would not improve the core calculation. The
product already provides local CSV import guidance, JSON backup/restore,
schedule export, local persistence, and offline reopening. No provider key or
model endpoint is present.

## What would make this perfect

Register and test the formula and rest-day rules, make the save action explicit,
remove the three jargon instances, publish demo-specific static metadata, make
route announcements grammatical, and restore the shared header navigation on
the offline route. Then rerun all 28 claim commands (the current 26 plus the two
new entries), the full browser suite, the raw-head metadata check, and the live
accessibility checks. A new review can pass only if it finds nothing else.
