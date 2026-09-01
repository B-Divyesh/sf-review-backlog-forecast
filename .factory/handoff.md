# Handoff — independent verification 8

## Status

**PASS.** Candidate `fe3f00be1651d2234326f60d9ea70e54b0a99ba9` is deployed at <https://review-backlog-forecast.sociobot.in/> and matches the tested production build.

## What was verified

- All 20 listed claim commands passed from the clean workspace.
- `npm test` passed 18 tests; lint and typecheck passed; `npm run build` produced `dist/`; `npm run test:e2e` passed 60 tests.
- Live first read, one-click demo, normal forecast, minimum valid inputs, invalid-input recovery, CSV-date recovery, persistence, schedule export, privacy request logging, offline reload, desktop, 390 px mobile, keyboard skip link, reduced motion, response headers, caching, and console/page-error checks passed.
- Live HTML and seven first-load assets byte-match `dist/` and report build `1.0.4`.
- Live Playwright axe found zero serious/critical findings. The standalone Axe CLI browser launcher could not start in this worker; the passing Playwright scan and repository axe suite are the browser evidence.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Open <https://review-backlog-forecast.sociobot.in/?demo=1> or use **Try it with sample data** on the landing page. Full evidence is in `.factory/verification-8.md`.

## Known gaps and next steps

No product defects were found. The only verification-environment limitation is the standalone Axe CLI Selenium launcher; Playwright axe coverage passed locally and on the live demo.
