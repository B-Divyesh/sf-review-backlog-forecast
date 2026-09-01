# Copy audit — polish 2

All reviewed landing-page, legal-page, and README sentences are 22 words or fewer. No reviewed sentence uses a banned marketing word. “Backlog” appears only in the product name; the workload is always an “overdue queue.”

## Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 5 | Plan an overdue queue. |
| 8 | Plan an overdue queue before changing cards. |
| 15 | For learners returning after missed days, compare capped recovery plans before changing cards in Anki. |
| 7 | See a 320-card overdue queue plan. |
| 4 | Nothing real is saved. |
| 4 | Nothing is rescheduled here. |
| 7 | Use totals, or import a simple CSV. |
| 5 | Labels mark each estimate. |
| 9 | You can edit it before running a forecast. |
| 10 | Import card due dates or a one-row summary. |
| 10 | The file is read in this browser and never uploaded. |
| 6 | Preview only: this forecasts counts only. |
| 8 | It cannot read or change your Anki collection. |
| 10 | Add your overdue queue totals to compare recovery plans. |
| 12 | You can change every assumption and rerun as often as you need. |
| 5 | No card is ever moved. |
| 10 | A free planning tool that keeps plans on this device. |

## README sentences

| Words | Sentence |
| ---: | --- |
| 16 | Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. |
| 10 | It compares three recovery plans before the learner changes anything. |
| 16 | Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. |
| 12 | The demo opens a 320-card overdue queue in its own browser database. |
| 7 | It never reads or changes real plans. |
| 11 | Steady uses the same overdue allowance each study session. |
| 14 | The sample halves the overdue queue in one week and clears it in two. |
| 10 | Deadline uses spare capacity for your chosen finish date. |
| 11 | It says when the deadline cannot fit within your cap. |
| 10 | Gentle starts at half the Steady allowance. |
| 10 | It reaches the full allowance after five study sessions. |
| 11 | Every recovery plan protects due-today and estimated regular reviews first. |
| 13 | It shows cards and minutes, exposes regular-review rollover, and enforces the session cap. |
| 10 | The app does not connect to Anki or reschedule cards. |
| 14 | For people returning to Anki after missed days who need a clear recovery plan. |
| 8 | The app accepts a one-row queue summary CSV. |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. |
| 10 | The browser does not upload or retain raw card content. |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. |
| 6 | The import control restores that backup. |
| 9 | The selected daily schedule exports as CSV for reference. |

## Terminology table

| Concept | One term |
| --- | --- |
| Missed review work | overdue queue |
| A selected option | recovery plan |
| Expected non-overdue work | regular reviews |

## First-screen facts and footer

- The desktop first trust row is ordered `Preview only`, `Stays on this device`, `Free`; the browser test checks the `Free` fact is visible at 1440 × 900.
- The next fact is `No Anki access`. The header states `Ready offline`.
- Every visitor footer uses `A free planning tool that keeps plans on this device.` The landing footer has no generated-image note; the required image record remains in `.factory/design.md`.
