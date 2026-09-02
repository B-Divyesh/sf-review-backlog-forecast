# Adversarial first-read review 4 — Review Backlog Forecast

**Reviewed:** 2026-09-02 UTC  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Repository commit:** 16ba9df298567ce952d172d3480f5e5337c77c15  
**Viewports:** fresh 390 × 844 mobile and 1440 × 900 desktop contexts  
**Verdict:** **FAIL**

Two minor README copy findings remain. No blocking demo, privacy, claim,
accessibility, routing, or visual-identity finding remains.

## Cold first read

Before scrolling, both fresh contexts made the job clear: it forecasts a
manageable overdue Anki queue before the learner changes cards. It is for
learners returning after missed days. The first action is **Try it with sample
data**.

The first screen says:

- Plan an overdue queue before changing cards.
- For learners returning after missed days, compare capped recovery plans before changing cards in Anki.
- Try it with sample data
- See a 320-card overdue queue plan. Nothing real is saved.

At 390 px, Preview only, Stays on this device, Free, and No Anki access are
visible. The desktop view also visibly shows Ready offline. No horizontal
overflow or console/page error occurred.

## Findings

### F-4-1 — Minor — README uses unexplained PWA and service-worker jargon

**Exact quote/location:** README, Run locally: “For PWA/service-worker
behavior, use a production build:”

**Why a reader is lost:** The instruction names implementation pieces instead
of the result the reader needs to test. The README elsewhere correctly calls
this an offline web app.

**Concrete fix:** Replace it with: “To test offline behavior, use a production
build:”

### F-4-2 — Minor — README uses provenance jargon for an internal record

**Exact quote/location:** README, Privacy and architecture: “The researched
opportunity lives in .factory/brief.json; the product-specific visual system
and generated-image provenance live in .factory/design.md.”

**Why a reader is lost:** Provenance is specialist vocabulary. The sentence can
name the useful record directly.

**Concrete fix:** Replace it with: “The researched opportunity is in
.factory/brief.json. The visual system and image source record are in
.factory/design.md.”

## Copy audit

The following is the complete unique-sentence audit of the landing/demo and
README prose. Counts treat hyphenated terms, paths, and commands as one word.
Repeated rendered policy text is listed once. No sentence exceeds 22 words.
No banned marketing adjective, metaphor heading, inconsistent product term, or
non-result-naming control was found. F-4-1 and F-4-2 are the only flags.

# Copy audit — polish 3

Checked 2026-09-01. The landing, demo, legal routes, and README use no banned marketing terms. Each audited sentence is 22 words or fewer. Product-name occurrences of “Backlog” are retained only as the proper name **Review Backlog Forecast**.

## Landing and demo sentences

| Words | Sentence |
| ---: | --- |
| 10 | Demo — sample data, nothing is saved to your real plan. |
| 5 | Explore the 320-card example. |
| 7 | Plan an overdue queue before changing cards. |
| 15 | For learners returning after missed days, compare capped recovery plans before changing cards in Anki. |
| 6 | See a 320-card overdue queue plan. |
| 4 | Nothing real is saved. |
| 4 | Compare three recovery plans. |
| 4 | Nothing is rescheduled here. |
| 10 | Preview a recovery plan before you change cards in Anki. |
| 10 | Add your overdue queue, due-today cards, and regular reviews estimate. |
| 10 | Choose the minutes you can study in one session. |
| 12 | Choose a recovery plan, then save or export its daily schedule. |
| 6 | Enter totals or import a CSV. |
| 5 | Labels mark each estimate. |
| 8 | You can edit it before running a forecast. |
| 8 | Import card due dates or a one-row summary. |
| 10 | The file is read in this browser and never uploaded. |
| 11 | In Anki Desktop, open Browse and search `is:review prop:due<0`. |
| 12 | Copy the shown count into `overdue` in the downloaded template. |
| 11 | Search `is:review prop:due=0` and copy its count into `due_today`. |
| 13 | Enter a usual day’s regular reviews in `daily_due`, then import the saved CSV. |
| 6 | Preview only: this forecasts counts only. |
| 8 | It cannot read or change your Anki collection. |
| 11 | 150 cards fit inside the 30-minute cap at 12 seconds each. |
| 8 | Uses the same overdue allowance each study session. |
| 14 | The sample halves the overdue queue in one week and clears it in two. |
| 10 | Uses the spare capacity needed for your chosen finish date. |
| 10 | It says when the deadline cannot fit within your cap. |
| 6 | Starts at half the Steady allowance. |
| 9 | It reaches the full allowance after five study sessions. |
| 10 | Due-today and estimated regular reviews get capacity before overdue cards. |
| 7 | Minutes are card count × your seconds-per-review estimate. |
| 8 | Unreviewed regular reviews roll forward and stay visible. |
| 9 | Future intervals, retention, lapses, and FSRS changes remain unknown. |
| 8 | Edit a marked estimate, then rerun the forecast. |
| 5 | No card is ever moved. |
| 10 | A free planning tool that keeps plans on this device. |

## README sentences

| Words | Sentence |
| ---: | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. |
| 10 | It compares three recovery plans before the learner changes anything. |
| 18 | Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. |
| 12 | The demo opens a 320-card overdue queue in its own browser database. |
| 7 | It never reads or changes real plans. |
| 9 | Steady uses the same overdue allowance each study session. |
| 14 | The sample halves the overdue queue in one week and clears it in two. |
| 9 | Deadline uses spare capacity for your chosen finish date. |
| 10 | It says when the deadline cannot fit within your cap. |
| 7 | Gentle starts at half the Steady allowance. |
| 9 | It reaches the full allowance after five study sessions. |
| 10 | Every recovery plan protects due-today and estimated regular reviews first. |
| 14 | It shows cards and minutes, carries unfinished regular reviews forward, and enforces the session cap. |
| 10 | The app does not connect to Anki or reschedule cards. |
| 14 | For people returning to Anki after missed days who need cards and minutes planned by day. |
| 8 | The app accepts a one-row queue summary CSV. |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. |
| 10 | The browser does not upload or retain raw card content. |
| 10 | To make a summary CSV from Anki Desktop, open **Browse**. |
| 12 | Search `is:review prop:due<0`, then copy the count into `overdue` in the template. |
| 11 | Search `is:review prop:due=0`, then copy that count into `due_today`. |
| 9 | Enter a usual day’s regular reviews in `daily_due`. |
| 6 | Save the file, then import it. |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. |
| 6 | The import control restores that backup. |
| 9 | The selected daily schedule exports as CSV for reference. |
| 7 | Schedule CSVs are not Anki rescheduling files. |
| 8 | Vite and TypeScript produce an installable offline web app. |
| 12 | It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. |
| 7 | No account or payment step is required. |
| 12 | Inputs and the last chosen plan stay in this browser’s local database. |
| 14 | After the first visit, the browser’s offline cache keeps the app available without a connection. |

## Terminology table

| Concept | One term |
| --- | --- |
| Missed review work | overdue queue |
| A learner’s selected option | recovery plan |
| Expected non-overdue work | regular reviews |

The terminology regression test reads landing, README, legal pages, manifest, and visitor-facing runtime copy. It rejects the retired phrases `Usual daily due`, `estimated normal reviews`, `regular-review rollover`, `daily-due estimate`, and `spaced-repetition backlog`.


### README sentences omitted from the prior audit table

| Words | Sentence | Result |
| ---: | --- | --- |
| 11 | For PWA/service-worker behavior, use a production build. | **F-4-1** |
| 18 | The exact deploy command is npm run build; static output lands in dist/ with dist/index.html at its root. | Clear deploy instruction |
| 11 | npm run test:e2e builds the production app before starting Playwright. | Clear test instruction |
| 15 | The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. | Verified |
| 15 | It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift. | Verified |
| 13 | Every visitor-facing product claim and its exact test command is listed in .factory/claims.json. | Verified |
| 8 | The isolated test data is documented in .factory/demo.md. | Verified |
| 7 | See the privacy page and the terms. | Links checked |
| 16 | The researched opportunity lives in .factory/brief.json; the product-specific visual system and generated-image provenance live in .factory/design.md. | **F-4-2** |
| 1 | MIT. | Clear |
| 2 | See LICENSE. | Clear |

## Demo, claims, privacy, and structure

- The first-screen sample action opened /?demo=1 in one click. Its first
  viewport already showed the persistent demo banner, Reset demo, Start for
  real, the Three recovery plans h1, populated policy cards, and Steady plan.
- The sample uses 320 overdue cards, 48 due-today cards, 36 regular reviews
  per day, a 30-minute cap, and a 14-day target. The passing isolation check
  confirms its separate review-backlog-forecast-demo browser database; real
  plans are not read or changed.
- Fresh live request logging observed only same-origin document, script,
  stylesheet, image, and demo-bootstrap requests. Clean-suite privacy claims
  passed for raw imports, forecast-data transmission, Anki isolation, and no
  third-party runtime dependency.
- .factory/claims.json has 26 claims. In clean clone
  /tmp/rbf-review4-clean, all seven tagged Vitest assertions passed. The
  isolated full browser suite executed every registered browser claim in both
  viewports: **78/78 passed**. Focused csv-import and grouped-csv-import
  claim commands also passed. No untested or unlisted product claim was found.
- Every earlier review, polish record, and handoff was read. The live site and
  current source confirm fixes for F-1-1 through F-1-15, F-2-1 through F-2-3,
  and F-3-1 through F-3-18, including focus transfer, terminology, first-view
  demo results, persistence, Anki count instructions, and the 180 px icon.
- Routes, titles, metadata, header/footer, links, styled 404, deep links,
  Back/focus behavior, Axe, keyboard/touch/motion, mobile/200% text layout,
  offline reload, installability, update behavior, and dist/ were checked.
  npm test passed 19/19; lint, typecheck, build, and the full e2e suite passed.
- The paper, enamel, brass, vermilion, ruled-panel system, custom wordmark, and
  original instrument image are distinct and match .factory/design.md; this
  is not a generic SaaS template.
- No AI feature is missing. The brief calls for a deterministic, private local
  simulation; import, backup restore, schedule export, and offline use cover
  the expected practical steps. A model call would not improve this job.

## What would make this perfect

Replace the two README phrases in F-4-1 and F-4-2 with the supplied plain
language, rerun the copy audit and clean-suite checks, then publish a review
with zero findings.

