# Review Backlog Forecast

Review Backlog Forecast is a free, offline-capable planning utility for spaced-repetition learners returning to an overdue queue. It compares three recovery policies before the learner changes anything:

- **Steady** aims to halve an overdue queue in one week and clear it in two with a consistent allowance.
- **Deadline** uses the spare capacity needed to meet a chosen date, or shows honestly when the date is out of reach.
- **Gentle** ramps the overdue allowance over the first five sessions.

Every plan protects due-today and estimated normal cards first, shows cards and minutes per day, exposes regular-work rollover, and enforces a hard session cap. It does not connect to Anki, reschedule cards, or claim to predict retention.

Production URL: <https://review-backlog-forecast.sociobot.in>

## Who it is for

People coming back to Anki or another spaced-repetition system after missed days who need a comprehensible recovery plan—not another opaque review button.

## Import formats

The app accepts UTF-8 CSV up to 2 MB in either shape:

```csv
overdue,due_today,daily_due
320,48,36
```

Or one card/group per row with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count`/`quantity`. Future rows are divided over 28 days to propose an editable normal-due estimate. Imports are parsed locally and raw card rows are not retained.

The footer exports a JSON backup of local settings and the chosen plan; the same import control restores it. A selected daily schedule can be exported as CSV for reference. Schedule CSVs are deliberately not Anki rescheduling files.

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
npm run build
npm run test:e2e
```

Unit tests cover policy distinction, the session cap, due-today priority, rollover visibility, validation, and both CSV import shapes. Playwright tests cover the real forecast path on desktop/mobile, CSV import, local persistence, offline reopening, 390px overflow, and Axe accessibility. The handoff records performance verification.

## Privacy and architecture

Vite + vanilla TypeScript, no runtime dependencies, no CDN resources, no analytics, and no account. Inputs and the last chosen plan are stored in IndexedDB. A versioned service worker caches the app shell and same-origin assets. See [the privacy page](https://review-backlog-forecast.sociobot.in/privacy/) and [the terms](https://review-backlog-forecast.sociobot.in/terms/).

The researched opportunity lives in `.factory/brief.json`; the product-specific visual system and generated-image provenance live in `.factory/design.md`.

## License

MIT. See `LICENSE`.
