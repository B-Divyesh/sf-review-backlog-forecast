# First-read review 2 — Review Backlog Forecast

**Reviewed:** 2026-09-01 UTC
**Production URL:** <https://review-backlog-forecast.sociobot.in/>
**Viewports:** fresh 390 × 844 mobile and 1440 × 900 desktop browser contexts
**Verdict:** **FAIL**

The product is usable and the registered checks pass. This review remains a FAIL because the earlier terminology finding is only partly resolved, and three small copy/layout findings remain. A PASS requires zero findings.

## Cold first read

Before scrolling, the reviewer understood the product as a tool that lets a returning spaced-repetition learner estimate a manageable way to work through overdue reviews before changing cards. It is for learners returning after missed days. The first action is **Try it with sample data**.

The mobile and desktop first views showed:

- `Plan overdue reviews before changing cards.`
- `For learners returning after missed days, compare capped recovery plans before changing an Anki queue.`
- `Try it with sample data`
- `See a 320-card overdue queue plan. Nothing real is saved.`

The product, audience, and first action are clear. The desktop view has no horizontal overflow and the cold-load browser check recorded no console or page errors.

## Findings

### F-1-15 — Blocking — the earlier terminology repair is incomplete

**Exact quote/location:** Landing hero eyebrow: `Plan a spaced-repetition review backlog.` Landing h1: `Plan overdue reviews before changing cards.` Landing lead: `before changing an Anki queue.` The action explanation then says `320-card overdue queue plan.`

**Why this needs correction:** The prior review required one term for the missed-review workload: `overdue queue`. The repaired page removed `channel` and `route`, but still makes a first-time visitor map `review backlog`, `overdue reviews`, `Anki queue`, and `overdue queue` to the same thing. This is a partial repair of F-1-15 rather than a completed one.

**Concrete fix:** Use **overdue queue** for the workload throughout. For example, change the eyebrow to `Plan an overdue queue.`; change the h1 to `Plan an overdue queue before changing cards.`; and change the lead ending to `before changing cards in Anki.` Recheck the landing, rendered demo, README, and terminology table with a copy test that rejects alternate workload terms outside the product name.

### F-2-1 — Minor — the price fact is below the 900 px desktop first view

**Exact quote/location:** Landing trust facts. At 1440 × 900, `Preview only`, `Stays on this device`, and `No Anki access` occupy 866–886 px. `Free` starts at 898 px and ends at 917 px.

**Why this needs correction:** The required first-view facts include privacy, offline, and price. The header shows `Ready offline` and the first trust row shows privacy-related facts, but the price fact is not fully visible without scrolling at the checked desktop viewport.

**Concrete fix:** Put `Free` in the first visible desktop trust row, such as by ordering it before `No Anki access`, or use a layout that keeps the price fact within the hero’s first row. Retain the existing two-row mobile arrangement.

### F-2-2 — Minor — `local-first` is unexplained visitor jargon

**Exact quote/location:** Landing footer: `A free, local-first planning utility.`

**Why this needs correction:** A learner arriving cold cannot reliably infer whether `local-first` describes storage, offline use, or an account requirement. The first-view fact `Stays on this device` already states the useful idea in plain words.

**Concrete fix:** Replace it with `A free planning tool that keeps plans on this device.`

### F-2-3 — Minor — the footer asset-provenance sentence is not useful product copy

**Exact quote/location:** Landing footer: `Original AI-generated instrument image; provenance in the project design notes.`

**Why this needs correction:** `provenance` is specialist language, and the sentence can make a visitor wonder whether the forecast itself uses an AI feature. The required asset record is already complete in `.factory/design.md`; the footer sentence does not help a learner choose or use the product.

**Concrete fix:** Remove this sentence from the visitor footer and retain the full source record in `.factory/design.md`. If a visible note is needed, use `Image details are in the project design notes.`

## Copy audit

Word counts treat a hyphenated term as one word and count readable inline-code content as words. Headings, field labels, and buttons are listed after the sentence tables because they are not sentences. No sentence exceeds 22 words. Findings F-1-15 and F-2-2 through F-2-3 record the terminology and jargon flags.

### Landing sentences

| Words | Sentence |
| ---: | --- |
| 10 | Demo — sample data, nothing is saved to your real plan. |
| 5 | Explore the 320-card example safely. |
| 5 | Plan a spaced-repetition review backlog. |
| 6 | Plan overdue reviews before changing cards. |
| 15 | For learners returning after missed days, compare capped recovery plans before changing an Anki queue. |
| 6 | See a 320-card overdue queue plan. |
| 4 | Nothing real is saved. |
| 4 | Compare three recovery plans. |
| 4 | Nothing is rescheduled here. |
| 7 | Use totals, or import a simple CSV. |
| 4 | Labels mark each estimate. |
| 8 | You can edit it before running a forecast. |
| 8 | Import card due dates or a one-row summary. |
| 10 | The file is read in this browser and never uploaded. |
| 6 | Preview only: this forecasts counts only. |
| 8 | It cannot read or change your Anki collection. |
| 12 | You can change every assumption and rerun as often as you need. |
| 5 | No card is ever moved. |
| 5 | A free, local-first planning utility. |
| 10 | Original AI-generated instrument image; provenance in the project design notes. |

The demo’s immediately rendered result also contains these sentences. Each is 22 words or fewer and maps to a registered claim where it states product behavior.

| Words | Rendered demo sentence |
| ---: | --- |
| 7 | Uses the same overdue allowance each study session. |
| 14 | The sample halves the overdue queue in one week and clears it in two. |
| 9 | Uses the spare capacity needed for your chosen finish date. |
| 10 | It says when the deadline cannot fit within your cap. |
| 7 | Starts at half the Steady allowance. |
| 9 | It reaches the full allowance after five study sessions. |
| 5 | Today stays in the plan. |
| 10 | Due-today and estimated normal reviews get capacity before overdue cards. |
| 6 | One pace for every card. |
| 9 | Minutes are card count × your seconds-per-review estimate. |
| 5 | Rest days add regular reviews. |
| 8 | Unreviewed regular reviews roll forward and stay visible. |
| 5 | Anki scheduling is not simulated. |
| 9 | Future intervals, retention, lapses, and FSRS changes remain unknown. |

### README sentences

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
| 13 | It shows cards and minutes, exposes regular-review rollover, and enforces the session cap. |
| 10 | The app does not connect to Anki or reschedule cards. |
| 14 | For people returning to Anki after missed days who need a clear recovery plan. |
| 8 | The app accepts a one-row queue summary CSV. |
| 17 | It also accepts grouped rows with `due_date` (`YYYY-MM-DD`) or `days_overdue`, plus optional `count` or `quantity`. |
| 10 | The browser does not upload or retain raw card content. |
| 13 | The footer exports a JSON backup of local settings and the chosen plan. |
| 6 | The import control restores that backup. |
| 9 | The selected daily schedule exports as CSV for reference. |
| 7 | Schedule CSVs are not Anki rescheduling files. |
| 8 | Requires Node.js 20.19+ or 22.12+. |
| 7 | Open the local URL printed by Vite. |
| 20 | The exact deploy command is `npm run build`; static output lands in `dist/` with `dist/index.html` at its root. |
| 11 | `npm run test:e2e` builds the production app before starting Playwright. |
| 15 | The suite checks desktop and 390px mobile layouts, keyboard use, accessibility, privacy, persistence, and exports. |
| 15 | It also checks offline reopening, updates, metadata, 404 behavior, touch targets, and startup layout shift. |
| 15 | Every visitor-facing product claim and its exact test command is listed in `.factory/claims.json`. |
| 10 | The isolated test data is documented in `.factory/demo.md`. |
| 8 | Vite and vanilla TypeScript produce a static PWA. |
| 12 | It loads no third-party fonts, scripts, analytics, advertising, or runtime image service. |
| 7 | No account or payment step is required. |
| 10 | Inputs and the last chosen plan are stored in IndexedDB. |
| 13 | The versioned service worker makes the app available offline after the first visit. |
| 17 | See [the privacy page](https://review-backlog-forecast.sociobot.in/privacy/) and [the terms](https://review-backlog-forecast.sociobot.in/terms/). |
| 20 | The researched opportunity lives in `.factory/brief.json`; the product-specific visual system and generated-image provenance live in `.factory/design.md`. |
| 1 | MIT. |
| 2 | See `LICENSE`. |

### Heading, terminology, and button check

- Headings name their sections, including `Forecast inputs`, `Import queue totals`, `Compare recovery plans`, `Forecast assumptions`, and `Three recovery plans`.
- All visible buttons name their result: `Try it with sample data`, `Run forecast`, `Use this plan`, `Export schedule`, `Reset demo`, `Start for real`, `Export my data`, and `Clear local data`.
- `spaced-repetition`, `Anki`, `CSV`, and `IndexedDB` are necessary domain or implementation terms and have nearby explanatory context. `local-first` and `provenance` are flagged above because plain alternatives already exist.
- The intended terminology table remains `overdue queue`, `recovery plan`, and `regular reviews`; F-1-15 records the remaining landing exceptions.

## Demo, storage, and privacy checks

The one-click demo path passes.

- Selecting **Try it with sample data** from a fresh 390 px root page opened `/?demo=1` and immediately showed the 320-overdue-card forecast and all three recovery plans.
- The persistent banner said `Demo — sample data, nothing is saved to your real plan.` and included **Reset demo** and **Start for real**.
- Editing the demo overdue value from 320 to 999 then selecting **Reset demo** restored 320.
- The registered storage-isolation check confirmed a saved real plan is not present in demo storage; demo uses its separate IndexedDB database.
- The fresh live request log contained only `https://review-backlog-forecast.sociobot.in`. The clean-clone privacy checks also confirmed raw imported content is neither sent nor retained and that no third-party runtime request occurs.
- The isolated offline check passed: after service-worker control, the demo reloads offline with its forecast visible.

## Claims and clean-clone verification

A new local clone of the reviewed candidate was installed with `npm ci`. Every exact command in `.factory/claims.json` passed, one command at a time. The passed claim ids are:

`three-policies`, `hard-session-cap`, `due-today-priority`, `rollover-visible`, `steady-recovery-target`, `deadline-feasibility`, `gentle-ramp`, `csv-import`, `grouped-csv-import`, `offline-reload`, `local-only`, `adjustable-estimates`, `demo-isolation`, `local-persistence`, `backup-roundtrip`, `schedule-export`, `clear-local-data`, `anki-isolation`, `no-third-party-runtime`, and `no-account`.

The landing, rendered demo, README, Privacy, and Terms claims were cross-checked against that registry. Each observable product claim maps to a listed entry. There are no unlisted product-claim findings.

The clean-clone quality checks also passed:

| Check | Result |
| --- | --- |
| `npm test` | PASS — 18 tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — produced `dist/` |
| `npm run test:e2e` | PASS — 60 tests, including the committed Axe checks |

## Structure and accessibility checks

- `/`, `/?demo=1`, `/privacy/`, `/terms/`, and the designed unknown-route page have route-appropriate titles, one h1, `lang="en"`, a main landmark, description, canonical URL, social image metadata, favicon, and Apple touch icon.
- The demo title is `Demo — Review Backlog Forecast`. Privacy and Terms use the required `Privacy — Product` and `Terms — Product` title pattern.
- The unknown route returned HTTP 404 with the designed page and a way back. `robots.txt` and `sitemap.xml` load correctly.
- The live link crawl confirmed the home, demo, guide anchor, Privacy, and Terms targets respond successfully. The header/footer contain the expected legal links.
- A live navigation check confirmed focus moves to the Privacy h1 and then back to the demo h1, with route announcements. The committed browser suite also confirms skip-link, keyboard-radio, touch-target, reduced-motion, and 390 px checks.
- The live 390 px page width equals its viewport width. The mid-century planning-instrument identity, original image, and warm paper/enamel system match `.factory/design.md` and are distinct from a generic SaaS layout.
- The live 404 response supplies restrictive same-origin CSP, framing protection, `nosniff`, and a strict referrer policy. No live console or page error was recorded during the reviewed flows.

## Earlier-review history check

The prior review, polish record, and handoff were read in full. The live site, current code, and tests confirm the following.

| Earlier finding | Current check |
| --- | --- |
| F-1-1 | Confirmed fixed: live Privacy navigation and Back focus the destination h1 and update the polite announcement; the browser test covers both directions. |
| F-1-2 | Confirmed fixed: `steady-recovery-target` is registered and its tagged test passed. |
| F-1-3 | Confirmed fixed: `deadline-feasibility` is registered and its tagged test passed. |
| F-1-4 | Confirmed fixed: `gentle-ramp` is registered and its tagged test passed. |
| F-1-5 | Confirmed fixed: `adjustable-estimates` is registered and its tagged browser test passed. |
| F-1-6 | Confirmed fixed: the former recovery-console eyebrow is absent. |
| F-1-7 | Confirmed fixed: the input section is named `Forecast inputs`. |
| F-1-8 | Confirmed fixed: the import section is named `Import queue totals`. |
| F-1-9 | Confirmed fixed: the results section is named `Compare recovery plans`. |
| F-1-10 | Confirmed fixed: the result h2 is `Three recovery plans`. |
| F-1-11 | Confirmed fixed: the empty state is named `No forecast yet`. |
| F-1-12 | Confirmed fixed: the assumptions section is named `Forecast assumptions`. |
| F-1-13 | Confirmed fixed: the form label says `Preview only`. |
| F-1-14 | Confirmed fixed: the README test-suite copy is split into two under-22-word sentences. |
| F-1-15 | Not fully fixed; see the blocking finding above. |

## Missed leverage

No missing AI step is expected. The brief describes a deterministic, reversible local forecast; an optional model action would not improve the stated decision. Import, JSON backup restore, schedule export, local persistence, and offline use are present and tested. No provider key is included in the product.

## What would make this perfect

Use one workload term throughout, keep the price fact visible in the desktop first view, and replace or remove the two footer phrases that add jargon without helping a learner. Then repeat the fresh mobile/desktop copy check, all 20 claim commands, and the full browser suite.
