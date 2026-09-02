# First-read review 6 — Review Backlog Forecast

**Reviewed:** 2026-09-02 UTC  
**Production URL:** <https://review-backlog-forecast.sociobot.in/>  
**Candidate:** `28b0efdfd3ec8002fafa281d7063910eb0453255`  
**Contexts:** fresh 390 × 844 mobile and 1440 × 900 desktop browser contexts; a separate fresh source clone for tests  
**Verdict:** **PASS**

No blocking, minor, or untested-claim finding remains. This review reran the full checklist.

## Cold first read

Before scrolling, both new contexts made the job, audience, and first action clear.

- **What it does:** plans an overdue Anki queue before cards are changed.
- **Who it is for:** learners returning after missed days.
- **What to do first:** select **Try it with sample data**.

The exact supporting text was `Plan an overdue queue before changing cards.`, `For learners returning after missed days, compare capped recovery plans before changing cards in Anki.`, and `Try it with sample data`. The adjacent outcome says `See a 320-card overdue queue plan. Nothing real is saved.` The four facts—`Preview only`, `Stays on this device`, `Free`, and `No Anki access`—were visible in the mobile first view, and `Free` was visible in the desktop first view. The 390 px document width equalled the viewport. No cold-load page or console error occurred.

## Copy audit

Counts treat hyphenated compounds, paths, and inline code as one word. No listed sentence exceeds 22 words. No jargon, mood heading, generic button, inconsistent visitor term, or banned marketing adjective remains.

### Landing and demo sentences

- 10 — Demo — sample data, nothing is saved to your real plan.
- 5 — Explore the 320-card example.
- 7 — Plan an overdue queue before changing cards.
- 15 — For learners returning after missed days, compare capped recovery plans before changing cards in Anki.
- 6 — See a 320-card overdue queue plan.
- 4 — Nothing real is saved.
- 4 — Compare three recovery plans.
- 4 — Nothing is rescheduled here.
- 10 — Preview a recovery plan before you change cards in Anki.
- 10 — Add your overdue queue, due-today cards, and regular reviews estimate.
- 10 — Choose the minutes you can study in one session.
- 12 — Choose a recovery plan, then save or export its daily schedule.
- 6 — Enter totals or import a CSV.
- 5 — Labels mark each estimate.
- 8 — You can edit it before running a forecast.
- 8 — Import card due dates or a one-row summary.
- 10 — The file is read in this browser and never uploaded.
- 11 — In Anki Desktop, open Browse and search `is:review prop:due<0`.
- 12 — Copy the shown count into `overdue` in the downloaded template.
- 11 — Search `is:review prop:due=0` and copy its count into `due_today`.
- 13 — Enter a usual day’s regular reviews in `daily_due`, then import the saved CSV.
- 6 — Preview only: this forecasts counts only.
- 8 — It cannot read or change your Anki collection.
- 11 — 150 cards fit inside the 30-minute cap at 12 seconds each.
- 8 — Uses the same overdue allowance each study session.
- 14 — The sample halves the overdue queue in one week and clears it in two.
- 10 — Uses the spare capacity needed for your chosen finish date.
- 10 — It says when the deadline cannot fit within your cap.
- 6 — Starts at half the Steady allowance.
- 9 — It reaches the full allowance after five study sessions.
- 5 — Today stays in the plan.
- 10 — Due-today and estimated regular reviews get capacity before overdue cards.
- 5 — One pace for every card.
- 7 — Minutes are card count × your seconds-per-review estimate.
- 5 — Rest days add regular reviews.
- 8 — Unreviewed regular reviews roll forward and stay visible.
- 9 — Future intervals, retention, lapses, and scheduler changes remain unknown.
- 8 — Edit a marked estimate, then rerun the forecast.
- 5 — No card is ever moved.
- 10 — A free planning tool that keeps plans on this device.

Direct headings include `How it works`, `Forecast inputs`, `Import queue totals`, `Set your limits`, `Compare recovery plans`, `Three recovery plans`, `Forecast assumptions`, and `No forecast yet`. Result-naming actions include `Try it with sample data`, `Run forecast`, `Save this plan`, `Export schedule`, `Reset demo`, `Start for real`, `Export my data`, and `Clear local data`. The terminology is consistently **overdue queue**, **recovery plan**, and **regular reviews**.

### README sentences

- 16 — Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue.
- 10 — It compares three recovery plans before the learner changes anything.
- 15 — Try the complete sample at `/demo/`, or use **Try it with sample data** on the first screen.
- 7 — `?demo=1` also opens the isolated sample.
- 12 — The demo opens a 320-card overdue queue in its own browser database.
- 7 — It never reads or changes real plans.
- 9 — Steady uses the same overdue allowance each study session.
- 14 — The sample halves the overdue queue in one week and clears it in two.
- 9 — Deadline uses spare capacity for your chosen finish date.
- 10 — It says when the deadline cannot fit within your cap.
- 7 — Gentle starts at half the Steady allowance.
- 9 — It reaches the full allowance after five study sessions.
- 10 — Every recovery plan protects due-today and estimated regular reviews first.
- 14 — It shows cards and minutes, carries unfinished regular reviews forward, and enforces the session cap.
- 10 — The app does not connect to Anki or reschedule cards.
- 14 — For people returning to Anki after missed days who need cards and minutes planned by day.
- 8 — The app accepts a one-row queue summary CSV.
- 17 — It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`.
- 10 — The browser does not upload or retain raw card content.
- 10 — To make a summary CSV from Anki Desktop, open **Browse**.
- 12 — Search `is:review prop:due<0`, then copy the count into `overdue` in the template.
- 11 — Search `is:review prop:due=0`, then copy that count into `due_today`.
- 9 — Enter a usual day’s regular reviews in `daily_due`.
- 6 — Save the file, then import it.
- 13 — The footer exports a JSON backup of local settings and the chosen plan.
- 6 — The import control restores that backup.
- 9 — The selected daily schedule exports as CSV for reference.
- 7 — Schedule CSVs are not Anki rescheduling files.
- 5 — Requires Node.js 20.19+ or 22.12+.
- 7 — Open the local URL printed by Vite.
- 8 — To test offline behavior, use a production build.
- 18 — The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root.
- 11 — `npm run test:e2e` builds the production app before starting Playwright.
- 15 — The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports.
- 17 — It also checks offline reopening, updates, page details, 404 behavior, touch targets, and content movement while loading.
- 13 — Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`.
- 8 — The isolated test data is documented in `.factory/demo.md`.
- 7 — See the privacy page and the terms.
- 6 — The researched opportunity is in `.factory/brief.json`.
- 10 — The visual system and image source record are in `.factory/design.md`.
- 1 — MIT.
- 2 — See `LICENSE`.

All live behavioural claims map to `.factory/claims.json`: offline use to `offline-reload`, local processing/storage to `local-only` and `no-forecast-transmission`, no Anki connection to `anki-isolation`, and no account/payment step to `no-account`.

## Demo, sandbox, privacy, and claims

Selecting **Try it with sample data** from a fresh root context navigated to `/demo/`. The first post-click viewport already contained the `Three recovery plans` h1 and a populated Steady plan card, not the landing hero. The banner read `Demo — sample data, nothing is saved to your real plan. Explore the 320-card example.` It retained **Reset demo** and **Start for real**. Reset restored the overdue input to 320 and left the populated demo visible.

The clean-clone `demo-isolation` test passed, including separate real and demo databases. The fresh-clone privacy tests passed. A fresh live demo request log contained only `https://review-backlog-forecast.sociobot.in` requests.

Every exact command in the 28-entry registry passed from `/tmp/review-backlog-forecast-review6-z2TzIz` after `npm ci`:

- The nine deterministic claims passed one at a time: `three-policies`, `hard-session-cap`, `minutes-formula`, `rest-day-accrual`, `due-today-priority`, `rollover-visible`, `steady-recovery-target`, `deadline-feasibility`, and `gentle-ramp`.
- The nineteen browser claims passed one at a time in desktop and 390 px projects: CSV import variants, Anki count steps, offline reload, installability, local-only import, no-transmission, adjustable estimates, demo isolation, input/plan persistence, saved-plan offline reopen, backup round trip, schedule export, daily cards/minutes, clear data, Anki isolation, no third-party runtime, and no account.

`npm test` passed 23 tests. `npm run lint`, `npm run typecheck`, and `npm run build` also passed in the clone. The build produced `dist/`; its application JavaScript is 8.01 kB gzip.

## Structure, routing, accessibility, and identity

| Route | Status | Title | h1 |
| --- | ---: | --- | --- |
| `/` | 200 | `Review Backlog Forecast — Plan an overdue queue` | `Plan an overdue queue before changing cards.` |
| `/demo/` | 200 | `Demo — Review Backlog Forecast` | `Three recovery plans` |
| `/privacy/` | 200 | `Privacy — Review Backlog Forecast` | `Keep your queue on your device.` |
| `/terms/` | 200 | `Terms — Review Backlog Forecast` | `Use forecasts as planning estimates.` |
| `/offline.html` | 200 | `Offline — Review Backlog Forecast` | `Reconnect once to load the planner.` |
| unknown path | 404 | `Page not found — Review Backlog Forecast` | `This forecast page does not exist.` |

Each route has `lang=en`, exactly one h1 and main landmark, description, canonical URL, OG/Twitter metadata, favicon, Apple touch icon, header, footer, Privacy, and Terms. Root links to main, home, demo, How it works, Privacy, and Terms all returned 200. The unknown route is a designed 404 with a working way back.

On mobile, selecting Privacy focused `Keep your queue on your device.` and announced `Page loaded: Keep your queue on your device.` Back returned to `/demo/`, focused `Three recovery plans`, and announced `Page loaded: Three recovery plans`.

The warm ruled-paper field, enamel-green console, brass controls, vermilion action, original console image, and asymmetric layout match `.factory/design.md` and are distinct from a generic SaaS template. No AI addition is expected: the brief calls for a deterministic, reversible forecast. CSV import, JSON backup, schedule export, and offline use supply the implied leverage without an unexplained model feature or key.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. The current live site, code, and exact claim checks confirm each finding is fixed, not merely marked fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Privacy and Back focus the destination h1 and announce it. |
| F-1-2 | `steady-recovery-target` is registered and passes. |
| F-1-3 | `deadline-feasibility` is registered and passes. |
| F-1-4 | `gentle-ramp` is registered and passes. |
| F-1-5 | `adjustable-estimates` is registered and passes. |
| F-1-6 | The former recovery-console metaphor is absent. |
| F-1-7 | The section is `Forecast inputs`. |
| F-1-8 | The section is `Import queue totals`. |
| F-1-9 | The section is `Compare recovery plans`. |
| F-1-10 | The result h1 is `Three recovery plans`. |
| F-1-11 | The empty state is `No forecast yet`. |
| F-1-12 | The assumptions section is `Forecast assumptions`. |
| F-1-13 | The label is factual: `Preview only`. |
| F-1-14 | README test copy remains below 22 words. |
| F-1-15 | Visitor terms remain overdue queue, recovery plan, and regular reviews. |
| F-2-1 | `Free` is visible in the desktop first view. |
| F-2-2 | Visitor copy says plans stay on this device; `local-first` is absent. |
| F-2-3 | Visitor-facing image-source jargon is absent. |
| F-3-1 | `/demo/` first viewport is a populated forecast. |
| F-3-2 | `local-persistence` passes from the clean clone. |
| F-3-3 | The banner names the concrete 320-card example. |
| F-3-4 | The redundant hero eyebrow is absent. |
| F-3-5 | The import instruction is `Enter totals or import a CSV`. |
| F-3-6 | The control says `Remove saved plan`. |
| F-3-7 | The update control says `Update app`. |
| F-3-8 | README names daily cards and minutes. |
| F-3-9 | README says unfinished regular reviews carry forward. |
| F-3-10 | README uses `installable offline web app`. |
| F-3-11 | README names the browser local database and tests persistence. |
| F-3-12 | README explains the browser offline cache. |
| F-3-13 | The empty-state action names a marked estimate. |
| F-3-14 | `daily-cards-minutes` is registered and passes. |
| F-3-15 | `input-persistence` is registered and passes. |
| F-3-16 | How it works has three direct steps. |
| F-3-17 | The 180 px Apple touch icon is served. |
| F-3-18 | Anki count instructions, template, and import work. |
| F-4-1 | README uses `To test offline behavior`. |
| F-4-2 | README uses `image source record`. |
| F-5-1 | `minutes-formula` is registered and passes. |
| F-5-2 | `rest-day-accrual` is registered and passes. |
| F-5-3 | `/demo/` has its own title, description, canonical, and social metadata. |
| F-5-4 | The action says `Save this plan`. |
| F-5-5 | `scheduler changes` replaces the unexplained acronym. |
| F-5-6 | README image-runtime wording is plain and split. |
| F-5-7 | README uses page-details/content-movement wording. |
| F-5-8 | Route announcements use `Page loaded: …`. |
| F-5-9 | `/offline.html` retains How it works. |

## What would make this perfect

Nothing corrective is outstanding. Preserve the direct first-screen job statement, immediate sandbox result, claim registry, and product-specific instrument identity through future changes; rerun this cold mobile and desktop review after copy, routing, or storage changes.
