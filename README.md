# Review Backlog Forecast

Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. It compares three recovery plans before the learner changes anything.

Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. The demo opens a 320-card overdue queue in its own browser database. It never reads or changes real plans.

- **Steady** uses the same overdue allowance each study session. The sample halves the overdue queue in one week and clears it in two.
- **Deadline** uses spare capacity for your chosen finish date. It says when the deadline cannot fit within your cap.
- **Gentle** starts at half the Steady allowance. It reaches the full allowance after five study sessions.

Every recovery plan protects due-today and estimated regular reviews first. It shows cards and minutes, carries unfinished regular reviews forward, and enforces the session cap. The app does not connect to Anki or reschedule cards.

Production URL: <https://review-backlog-forecast.sociobot.in>

## Who it is for

For people returning to Anki after missed days who need cards and minutes planned by day.

## Import formats

The app accepts a one-row queue summary CSV:

```csv
overdue,due_today,daily_due
320,48,36
```

It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. The browser does not upload or retain raw card content.

To make a summary CSV from Anki Desktop, open **Browse**. Search `is:review prop:due<0`, then copy the count into `overdue` in the template. Search `is:review prop:due=0`, then copy that count into `due_today`. Enter a usual day’s regular reviews in `daily_due`. Save the file, then import it.

The footer exports a JSON backup of local settings and the chosen plan. The import control restores that backup. The selected daily schedule exports as CSV for reference. Schedule CSVs are not Anki rescheduling files.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To test offline behavior, use a production build:

```sh
npm run build
npm run preview
```

The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root.

## Test

```sh
npm test
npm run typecheck
npm run lint
npm run test:e2e
```

`npm run test:e2e` builds the production app before starting Playwright. The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift. Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. The isolated test data is documented in `.factory/demo.md`.

## Privacy and architecture

Vite and TypeScript produce an installable offline web app. It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. No account or payment step is required. Inputs and the last chosen plan stay in this browser’s local database. After the first visit, the browser’s offline cache keeps the app available without a connection. See [the privacy page](https://review-backlog-forecast.sociobot.in/privacy/) and [the terms](https://review-backlog-forecast.sociobot.in/terms/).

The researched opportunity is in `.factory/brief.json`. The visual system and image source record are in `.factory/design.md`.

## License

MIT. See `LICENSE`.
