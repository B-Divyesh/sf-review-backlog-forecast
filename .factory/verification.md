# Independent verification — FAIL

**Work order:** `review-backlog-forecast-verify-1`
**Candidate:** `81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8` (clean detached checkout)
**Required production URL:** `https://review-backlog-forecast.sociobot.in/`
**Verified:** 2026-08-27 UTC
**Verdict:** **FAIL — do not release.**

The candidate is a working local PWA, but the required production URL is not a working deployment. A normal browser fails TLS hostname validation and therefore cannot load it; an insecure diagnostic request to its root returns the Azure default 404 page rather than the app. This independently confirms a deployment failure, regardless of the local build result.

## Blocking defects

### Critical — production URL is unavailable and cannot be verified as the candidate

- Playwright Chromium navigation to the required URL failed with `net::ERR_CERT_COMMON_NAME_INVALID`.
- `curl -I https://review-backlog-forecast.sociobot.in/` failed certificate verification: `no alternative certificate subject name matches target host name`.
- TLS inspection showed the presented certificate CN/SANs are for `*.msha-slice-7-eus2-1-ase.p.azurewebsites.net`, not `review-backlog-forecast.sociobot.in`.
- A diagnostic request made with certificate verification deliberately disabled returned `HTTP/1.1 404 Site Not Found` from Azure for `/` (2,667-byte error document), not the product shell.

Impact: users cannot reach the PWA, so live behavior, response headers, deployment caching, and identity cannot be accepted. Restore the correct custom-domain binding and certificate, route `/` to this candidate’s static `dist/`, then rerun live verification.

### Medium — two information controls miss the required mobile touch target

At a 390 px mobile viewport, the `About overdue cards` and `About cards due today` buttons measure **30 × 30 CSS px**. The acceptance contract requires controls of at least 44 × 44 px. The controls work with keyboard and expose the tooltip, but are too small for a reliable touch target.

## Clean-checkout results

Fresh checkout setup:

```sh
git clone https://github.com/B-Divyesh/sf-review-backlog-forecast.git <temp>
git -C <temp> checkout --detach 81a9dbbb50ef59f3e8dd8f215ad6733af32f97c8
cd <temp>
npm ci
```

| Check | Result | Evidence |
| --- | --- | --- |
| Unit tests | PASS | `npm test`: 11/11 tests passed. |
| Type check / exact build | PASS | `npm run build` (`tsc --noEmit && vite build`) passed and emitted `dist/`. No separate lint script exists. |
| Browser suite | PASS | After installing the Chromium version required by the lockfile (`npx playwright install chromium`), `npm run test:e2e` passed 10/10 desktop and mobile tests. The initially preinstalled browser was for a different Playwright revision and could not launch. |
| Bundle budgets | PASS | Initial app JS 18.21 kB raw / 7.22 kB gzip; app CSS 21.56 kB raw / 5.36 kB gzip; mobile hero WebP 26,300 bytes. All are under the stated budgets. |
| Local Lighthouse | PASS | Lighthouse 12.8.2 against production preview emitted Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 20 ms, CLS 0. Chrome also printed a tab-crash message during teardown after the JSON report was written. |

## Product exercise and browser QA

Performed against the clean candidate’s production `dist/` through a local HTTP origin.

- **Normal recovery path:** loaded the example (320 overdue, 48 due today, 36 usual daily due, 30-minute cap), ran all three policies, selected Gentle via keyboard, saved a plan, and reloaded. The saved-plan strip persisted; a separate run recorded `Deadline · 320 overdue · 30-minute cap` after reload. The visible first day protected 48 regular/due-today cards before 27 overdue cards.
- **Cap and boundary:** with 5 minutes, 300 seconds/card, all queue values zero, deadline 2 days, and 1 study day/week, the app reported capacity of one card and an already-clear queue without error. Unit coverage also verifies all policy schedules remain within the cap.
- **Invalid input and recovery:** submitting `overdue=-1` and `seconds/card=2` moved focus to the alert and announced actionable validation messages. Replacing them with valid boundary values successfully rendered a new forecast.
- **Import error path:** an unsupported CSV (`front,back`) was rejected with the documented actionable column-format message. The committed tests cover summary and card-row CSV forms.
- **Desktop / 390 px mobile:** desktop and mobile end-to-end suites passed. At 390 px the document and body widths were both 390 px (no page-level horizontal overflow); the policy rail and ledger intentionally scroll within their own containers.
- **Keyboard and focus:** the skip link receives a visible `3px` vermilion outline; Enter moves to the main-content target. Radio selection works with Space and the policy card receives its focus-within outline. No keyboard trap was observed.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, transition durations evaluated to `0.01ms` and `scroll-behavior` to `auto`.
- **Accessibility:** semantic smoke check found `lang=en`, a descriptive title, exactly one `h1`, `main`, labels, meaningful image alt text, and a manifest. Axe WCAG 2/2.1 A/AA found **zero serious or critical violations** in the populated state on desktop and mobile. The 30 px help targets remain the medium manual finding above.
- **Errors and privacy:** no console errors or `pageerror` events occurred in local normal/invalid/offline paths. Recorded browser request origins contained only the same local origin; source inspection found no analytics, beacon, third-party font, CDN, account, or API request. Inputs/plans are IndexedDB-only and JSON/CSV export/import and clear-data controls are present.
- **PWA/offline/update:** after service-worker control, `context.setOffline(true)` followed by reload displayed the app and could run a forecast. In an isolated static-server update test, changing the worker cache version from `rbf-v1.0.1` to `rbf-v1.0.2` displayed the in-app “A new version is ready” prompt; activating it replaced the old cache with `rbf-v1.0.2-shell` and `rbf-v1.0.2-runtime` and retained controller ownership.

## Deployment and response-policy evidence

The live check intentionally used normal certificate validation first. It failed before an HTTP response could be trusted, so live security headers and cache policy cannot be accepted. The disabled-verification request above is diagnostic evidence only and must not be interpreted as a valid deployment check.

The app shell was not available at the canonical URL, so the live deployment does **not** establish a match to the tested commit. Local files, service-worker caching behavior, manifests, offline fallback, and static budget checks passed; they do not compensate for the failed live route.

## Required next verification

1. Correct the production custom-domain certificate/SAN and Azure route so a standard TLS client gets the candidate app at `/`.
2. Deploy the candidate’s complete `dist/` (including `manifest.webmanifest`, `/sw.js`, `/assets/app.css`, legal pages, and offline page) with appropriate immutable asset caching.
3. Increase the two help-button hit areas to 44 × 44 px or larger without reducing visual clarity.
4. Rerun this verification against the repaired URL, including normal TLS, response headers/cache policy, PWA offline reload, and the 390 px touch-target check.
