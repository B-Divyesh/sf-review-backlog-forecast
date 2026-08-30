# Demo sandbox

Open `/?demo=1` or use the first-screen **Try it with sample data** link.

The demo immediately renders a 320-overdue-card sample: 48 cards due today, 36 usual daily cards, a 30-minute cap, and a 14-day deadline. It displays the persistent Demo banner, Reset demo control, and Start for real link.

Demo state uses the separate IndexedDB database `review-backlog-forecast-demo`. The real app uses `review-backlog-forecast`; demo mode never reads or writes that database. Reset demo clears only the demo database. Start for real clears demo state before opening the real app.
