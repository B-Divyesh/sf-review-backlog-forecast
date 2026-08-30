# Review Backlog Forecast

Review Backlog Forecast is a free planning utility for spaced-repetition learners returning to an overdue queue. It compares three recovery policies before the learner changes anything.

Try the complete sample at `/?demo=1`, or use **Try it with sample data** on the first screen. The demo opens a realistic 320-card backlog in its own browser database. It never reads or changes real plans.

- **Steady** aims to halve an overdue queue in one week and clear it in two with a consistent allowance.
- **Deadline** uses the spare capacity needed to meet a chosen date, or shows honestly when the date is out of reach.
- **Gentle** ramps the overdue allowance over the first five sessions.

Every plan protects due-today and estimated normal cards first. It shows cards and minutes, exposes regular-work rollover, and enforces the session cap. The app does not connect to Anki or reschedule cards.

Production URL: <https://review-backlog-forecast.sociobot.in>

## Who it is for

People coming back to Anki or another spaced-repetition system after missed days who need a comprehensible recovery plan—not another opaque review button.

## Import formats

The app accepts a one-row queue summary CSV:

```csv
overdue,due_today,daily_due
320,48,36
```

It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. Future rows produce an editable normal-due estimate. The browser does not upload or retain raw card content.

The footer exports a JSON backup of local settings and the chosen plan. The import control restores that backup. The selected daily schedule exports as CSV for reference. Schedule CSVs are not Anki rescheduling files.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For PWA/service-worker behavior, use a production build:

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

`npm run test:e2e` builds the production app before starting Playwright. The suite covers desktop and 390px mobile layouts, keyboard use, Axe checks, privacy, persistence, exports, offline reopening, update handling, metadata, HTTP 404 behavior, touch targets, and delayed-start CLS. Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. The isolated test data is documented in `.factory/demo.md`.

## Privacy and architecture

Vite and vanilla TypeScript produce a static PWA. It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. No account or payment step is required. Inputs and the last chosen plan are stored in IndexedDB. The versioned service worker makes the app available offline after the first visit. See [the privacy page](https://review-backlog-forecast.sociobot.in/privacy/) and [the terms](https://review-backlog-forecast.sociobot.in/terms/).

The researched opportunity lives in `.factory/brief.json`; the product-specific visual system and generated-image provenance live in `.factory/design.md`.

## License

MIT. See `LICENSE`.
