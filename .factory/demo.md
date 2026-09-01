# Demo sandbox

Open `/?demo=1` or use the first-screen **Try it with sample data** link. The demo opens directly on its populated forecast, not the landing hero.

The demo immediately renders a 320-card overdue queue: 48 cards due today, 36 regular reviews per day, a 30-minute cap, and a 14-day deadline. It displays the persistent Demo banner, Reset demo control, and Start for real link. The document title is `Demo — Review Backlog Forecast`.

Demo state uses the separate browser database `review-backlog-forecast-demo`. The real app uses `review-backlog-forecast`; demo mode never reads or writes that database. Edited inputs and a saved plan return after reload inside the demo namespace. Reset demo clears only the demo database. Start for real clears demo state before opening the real app.

The sample supports every claim check: both CSV shapes, Anki count-to-CSV steps, raw-import privacy, marked forecast-data non-transmission, input and plan persistence, JSON backup round-trip, daily cards and minutes, schedule CSV export, local clearing, installability, offline reload, saved-plan offline reopening, and app updates. Each check starts in a fresh browser context or Playwright test page. The exact commands are in `.factory/claims.json`.
