# Demo sandbox

Open `/?demo=1` or use the first-screen **Try it with sample data** link.

The demo immediately renders a 320-overdue-card sample: 48 cards due today, 36 usual daily cards, a 30-minute cap, and a 14-day deadline. It displays the persistent Demo banner, Reset demo control, and Start for real link. The document title is `Demo — Review Backlog Forecast`.

Demo state uses the separate IndexedDB database `review-backlog-forecast-demo`. The real app uses `review-backlog-forecast`; demo mode never reads or writes that database. A plan saved in demo mode returns after reload inside the demo namespace. Reset demo clears only the demo database. Start for real clears demo state before opening the real app.

The sample supports every claim check: both CSV shapes, raw-import privacy, plan persistence, JSON backup round-trip, schedule CSV export, local clearing, offline reload, and service-worker update. Each check starts in a fresh browser context or Playwright test page. The exact commands are in `.factory/claims.json`.
