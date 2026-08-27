# Handoff — Review Backlog Forecast v1

## What shipped

- A complete import-and-preview recovery planner with **Steady**, **Deadline**, and **Gentle** policies.
- Manual queue inputs plus two CSV shapes: one-row totals and one-card/group-per-row `due_date` or `days_overdue` imports.
- A hard minute cap in the forecast engine. Due-today and estimated regular reviews use capacity before overdue cards; regular rollover stays visible instead of being hidden.
- Plan comparison, 21-day visual plot, up to 60 days of accessible daily ledger detail, half-queue/finish estimates, deadline feasibility warnings, schedule CSV export, and clear non-guarantee language.
- IndexedDB persistence for inputs and the selected plan, reversible plan replacement, JSON data export/restore, and confirmed local-data deletion.
- Installable local-first PWA with a versioned service worker, deterministic precached app shell, cache-first same-origin assets, offline fallback, update prompt, 192/512/maskable icons, and matching splash colors.
- Responsive 390px and keyboard layouts, designed focus states, reduced-motion fallback, semantic structure, one H1, alt text, live validation/status, and a keyboard-focusable wide ledger.
- Privacy and terms pages, README, MIT license, robots.txt, and sitemap.
- Product-specific mid-century instrument-panel system and generated-asset provenance in `.factory/design.md`. The original source is retained in `assets/src/`; shipped WebP files are 26 KB and 67 KB.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The deploy command is exactly `npm run build`. It produces `dist/index.html`, `dist/privacy/index.html`, and `dist/terms/index.html`.

Final verification on 2026-08-27:

- `npm test`: 11/11 unit tests passed.
- `npm run build`: passed; initial app JavaScript 18.21 KB raw / 7.22 KB gzip, CSS 21.56 KB raw / 5.36 KB gzip.
- Playwright Chromium: desktop and 390×844 mobile flows passed for forecast creation, policy selection, CSV import, IndexedDB persistence, viewport overflow, and interactive offline reopen after first visit.
- Axe via Playwright: no serious or critical WCAG 2/2.1 A/AA violations in the populated application on desktop or mobile.
- Factory `verify-url.sh`: HTTP 200, title and `lang`, one H1, main landmark, all images with alt, all buttons labelled, and no console errors.
- Lighthouse 12.8.2, mobile defaults against the production preview: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.2 s**, TBT **0 ms**, CLS **0**, Speed Index **0.9 s**.
- Production asset checks: mobile hero 26,300 bytes; large hero 67,352 bytes; no runtime CDN requests.

## Known boundaries

- This models counts, not card identities or future Anki/FSRS intervals. It intentionally cannot open `.apkg`/collection databases or reschedule cards.
- For card-row imports, future-due rows are divided across 28 days to propose an editable daily-due estimate. The UI labels that value as an estimate.
- Forecasts extend up to 730 days. The on-screen ledger is capped at 60 days for usability; the exported schedule contains at least 28 days and continues through the projected finish when it falls within the model horizon.
- No analytics or page counter is included. The product is free and has no billing integration.

## Suggested next steps

- Pilot with returning learners and measure the brief’s 14-day queue-reduction outcome.
- If pilots need greater precision, add an optional histogram import for future due counts without accepting collection credentials or writing back to Anki.
