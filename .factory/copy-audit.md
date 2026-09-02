# Copy audit — polish 5

Checked 2026-09-02. The landing, demo, legal routes, and README use no banned marketing terms. Each audited sentence is 22 words or fewer. Product-name occurrences of “Backlog” are retained only as the proper name **Review Backlog Forecast**.

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
| 5 | Today stays in the plan. |
| 10 | Due-today and estimated regular reviews get capacity before overdue cards. |
| 5 | One pace for every card. |
| 7 | Minutes are card count × your seconds-per-review estimate. |
| 5 | Rest days add regular reviews. |
| 8 | Unreviewed regular reviews roll forward and stay visible. |
| 9 | Future intervals, retention, lapses, and scheduler changes remain unknown. |
| 8 | Edit a marked estimate, then rerun the forecast. |
| 5 | No card is ever moved. |
| 10 | A free planning tool that keeps plans on this device. |

## README sentences

| Words | Sentence |
| ---: | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. |
| 10 | It compares three recovery plans before the learner changes anything. |
| 15 | Try the complete sample at `/demo/`, or use **Try it with sample data** on the first screen. |
| 7 | `?demo=1` also opens the isolated sample. |
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
| 10 | It loads no third-party fonts, scripts, analytics, or advertising. |
| 9 | It does not fetch images from another service. |
| 7 | No account or payment step is required. |
| 12 | Inputs and the last chosen plan stay in this browser’s local database. |
| 14 | After the first visit, the browser’s offline cache keeps the app available without a connection. |
| 7 | Open the local URL printed by Vite. |
| 8 | To test offline behavior, use a production build. |
| 18 | The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root. |
| 11 | `npm run test:e2e` builds the production app before starting Playwright. |
| 15 | The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. |
| 17 | It also checks offline reopening, updates, page details, 404 behavior, touch targets, and content movement while loading. |
| 13 | Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. |
| 8 | The isolated test data is documented in `.factory/demo.md`. |
| 7 | See the privacy page and the terms. |
| 6 | The researched opportunity is in `.factory/brief.json`. |
| 10 | The visual system and image source record are in `.factory/design.md`. |
| 1 | MIT. |
| 2 | See `LICENSE`. |

## Terminology table

| Concept | One term |
| --- | --- |
| Missed review work | overdue queue |
| A learner’s selected option | recovery plan |
| Expected non-overdue work | regular reviews |

The terminology regression test reads landing, README, legal pages, manifest, and visitor-facing runtime copy. It rejects the retired phrases `Usual daily due`, `estimated normal reviews`, `regular-review rollover`, `daily-due estimate`, `spaced-repetition backlog`, and `FSRS changes`.

## Terms sentence changes

| Words | Sentence |
| ---: | --- |
| 15 | The forecast does not model answer ratings, lapses, retention, learning steps, or future scheduler changes. |
| 12 | It also excludes buried cards, suspended cards, timezone changes, and collection settings. |
| 4 | Actual queues will differ. |
| 20 | To the maximum extent allowed by law, the authors are not liable for lost study progress or collection changes. |
| 9 | They are not liable for indirect damages from use. |
