import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, normalize } from "node:path";

function contentType(file: string): string {
  if (file.endsWith(".js")) return "text/javascript";
  if (file.endsWith(".css")) return "text/css";
  if (file.endsWith(".webmanifest")) return "application/manifest+json";
  if (file.endsWith(".html")) return "text/html";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

async function startStaticServer(root: string): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const relative = requested.endsWith("/") ? `${requested}index.html` : requested;
    const file = normalize(join(root, relative));
    if (!file.startsWith(`${root}/`) && file !== join(root, "index.html")) {
      response.writeHead(400).end();
      return;
    }
    try {
      const contents = readFileSync(file);
      response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-cache" });
      response.end(contents);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Static update server did not bind a TCP port.");
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}

test("runs a forecast, selects a policy, and persists it", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Add your queue totals to compare plans." })).toBeVisible();

  await page.getByRole("button", { name: "Load sample values" }).click();
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio", { name: /Gentle/ }).check();
  await expect(page.getByRole("heading", { name: "Gentle plan" })).toBeVisible();
  await page.getByRole("button", { name: "Use this plan" }).click();
  await expect(page.getByText("Gentle plan saved on this device.")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  await expect(page.getByText(/Gentle · 320 overdue/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("invalidates stale forecast actions after edits, imports, and rejected submissions", async ({ page }) => {
  await page.goto("/?demo=1");
  const savePlan = page.getByRole("button", { name: "Use this plan" });
  const exportPlan = page.getByRole("button", { name: "Export schedule" });
  const staleNotice = page.locator("#forecast-status");

  await expect(savePlan).toBeEnabled();
  await expect(exportPlan).toBeEnabled();
  await page.locator("#overdue").fill("500");
  await expect(staleNotice).toContainText("This forecast is out of date");
  await expect(savePlan).toBeDisabled();
  await expect(exportPlan).toBeDisabled();

  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(savePlan).toBeEnabled();
  await expect(exportPlan).toBeEnabled();
  await page.locator("#queue-file").setInputFiles({
    name: "replacement-summary.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("overdue,due_today,daily_due\n125,31,22\n")
  });
  await expect(page.locator("#overdue")).toHaveValue("125");
  await expect(staleNotice).toContainText("Run forecast before saving or exporting");
  await expect(savePlan).toBeDisabled();
  await expect(exportPlan).toBeDisabled();

  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(exportPlan).toBeEnabled();
  await page.locator("#overdue").fill("-1");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(page.getByRole("alert")).toContainText("Overdue cards must be a whole number between 0 and 100,000.");
  await expect(staleNotice).toContainText("This forecast is out of date");
  await expect(savePlan).toBeDisabled();
  await expect(exportPlan).toBeDisabled();
});

test("keeps focus on the selected policy radio through repeated arrow navigation", async ({ page }) => {
  await page.goto("/?demo=1");
  const steady = page.getByRole("radio", { name: /Steady/ });
  const deadline = page.getByRole("radio", { name: /Deadline/ });
  const gentle = page.getByRole("radio", { name: /Gentle/ });

  await steady.focus();
  await page.keyboard.press("ArrowRight");
  await expect(deadline).toBeChecked();
  await expect(deadline).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(gentle).toBeChecked();
  await expect(gentle).toBeFocused();
});

test("keeps the transient Undo action at least 44px square on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Use this plan" }).click();
  const undo = page.getByRole("button", { name: "Undo" });
  await expect(undo).toBeVisible();
  const box = await undo.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("@claim:csv-import imports a summary CSV and reports the result", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.locator("#queue-file").setInputFiles({
    name: "queue.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("overdue,due_today,daily_due\n125,31,22\n")
  });
  await expect(page.getByText(/125 overdue and 31 due today/)).toBeVisible();
  await expect(page.locator("#overdue")).toHaveValue("125");
  await expect(page.locator("#daily-due")).toHaveValue("22");
});

test("@claim:grouped-csv-import imports grouped days-overdue and due-date rows", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.locator("#queue-file").setInputFiles({
    name: "grouped-overdue.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("days_overdue,count\n12,4\n0,3\n-2,8\n")
  });
  await expect(page.locator("#overdue")).toHaveValue("4");
  await expect(page.locator("#due-today")).toHaveValue("3");
  await expect(page.locator("#daily-due")).toHaveValue("1");

  const today = new Date();
  const format = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  await page.locator("#queue-file").setInputFiles({
    name: "grouped-dates.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(`due_date,quantity\n${format(yesterday)},5\n${format(today)},2\n${format(tomorrow)},7\n`)
  });
  await expect(page.locator("#overdue")).toHaveValue("5");
  await expect(page.locator("#due-today")).toHaveValue("2");
  await expect(page.locator("#daily-due")).toHaveValue("1");
});

test("rejects impossible calendar dates during CSV import", async ({ page }) => {
  await page.goto("/");
  await page.locator("#queue-file").setInputFiles({
    name: "invalid-calendar-date.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("due_date,count\n2026-02-31,1\n")
  });
  await expect(page.getByText("Due date on row 2 must be a real calendar date in YYYY-MM-DD format.")).toBeVisible();
  await expect(page.locator("#overdue")).toHaveValue("");
});

test("gives compact help controls a 44px touch target at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const helpButtons = page.getByRole("button", { name: /About (overdue cards|cards due today)/ });
  await expect(helpButtons).toHaveCount(2);
  for (const button of await helpButtons.all()) {
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("keeps every footer policy link at least 44px square at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/?demo=1", "/privacy/", "/terms/"]) {
    await page.goto(route);
    for (const name of ["Privacy", "Terms"]) {
      const link = page.getByRole("contentinfo").getByRole("link", { name });
      const box = await link.boundingBox();
      expect(box?.width, `${route} ${name} width`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${route} ${name} height`).toBeGreaterThanOrEqual(44);
    }
  }
});

test("rejects all count values above their declared maximum and focuses the error", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample values" }).click();
  const cases = [
    ["#overdue", "100001", "Overdue cards must be a whole number between 0 and 100,000."],
    ["#due-today", "100001", "Due today must be a whole number between 0 and 100,000."],
    ["#daily-due", "100001", "Usual daily due must be a whole number between 0 and 100,000."],
    ["#new-cards", "10001", "New cards per day must be a whole number between 0 and 10,000."]
  ] as const;
  for (const [selector, value, message] of cases) {
    const field = page.locator(selector);
    const original = await field.inputValue();
    await field.fill(value);
    await page.getByRole("button", { name: "Run forecast" }).click();
    await expect(page.getByRole("alert")).toContainText(message);
    await expect(page.getByRole("alert")).toBeFocused();
    await expect(page.locator("#results")).toBeHidden();
    await field.fill(original);
  }
});

test("moves keyboard focus to main when the skip link is activated", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to forecast controls" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(/#main$/);
});

test("moves keyboard focus to each legal page main landmark", async ({ page }) => {
  for (const route of ["/privacy/", "/terms/"]) {
    await page.goto(route);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /^Skip to/ })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  }
});

test("has no serious accessibility violations", async ({ page }) => {
  for (const route of ["/?demo=1", "/privacy/", "/terms/", "/definitely-missing-verifier-route"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), route).toEqual([]);
  }
});

test("fits a 390px viewport without page-level horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?demo=1");
  const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth);
  await page.screenshot({ path: "test-results/mobile-forecast.png", fullPage: true });
});

test("@claim:offline-reload reloads the demo forecast while offline after the app shell is cached", async ({ browser }, testInfo) => {
  const context = await browser.newContext(testInfo.project.name === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {});
  const page = await context.newPage();
  try {
    await page.goto("/?demo=1");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    });
    await context.setOffline(true);
    await page.reload();
    await expect(page).toHaveTitle("Demo — Review Backlog Forecast");
    await expect(page.getByRole("heading", { name: "Plan overdue reviews before changing cards." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("@claim:local-only neither uploads nor retains raw imported card content", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/?demo=1");
  const privateMarker = "PRIVATE_RAW_CARD_CONTENT_49812";
  await page.locator("#queue-file").setInputFiles({
    name: "private-cards.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(`card,days_overdue,count\n${privateMarker},8,2\n`)
  });
  await page.getByRole("button", { name: "Run forecast" }).click();
  await page.getByRole("button", { name: "Use this plan" }).click();
  await page.locator("#queue-file").setInputFiles({
    name: "private-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      rawMarker: privateMarker,
      input: { overdue: 2, dueToday: 1, dailyDue: 1, newCards: 0, secondsPerCard: 12, capMinutes: 30, deadlineDays: 14, studyDays: 6 }
    }))
  });
  const retained = await page.evaluate(async () => {
    const records = await new Promise<unknown[]>((resolve, reject) => {
      const request = indexedDB.open("review-backlog-forecast-demo");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const values = db.transaction("records", "readonly").objectStore("records").getAll();
        values.onerror = () => reject(values.error);
        values.onsuccess = () => { resolve(values.result); db.close(); };
      };
    });
    return JSON.stringify({ records, local: { ...localStorage }, session: { ...sessionStorage } });
  });
  expect([...origins]).toEqual([new URL(page.url()).origin]);
  expect(retained).not.toContain(privateMarker);
  await expect(page.locator("#queue-file")).toHaveValue("");
});

test("@claim:demo-isolation keeps demo storage separate from a real saved plan", async ({ page }) => {
  await page.goto("/");
  await page.locator("#overdue").fill("7");
  await page.locator("#due-today").fill("2");
  await page.locator("#daily-due").fill("1");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await page.getByRole("button", { name: "Use this plan" }).click();
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toHaveCount(0);
  await expect(page.locator("#overdue")).toHaveValue("320");
});

test("@claim:local-persistence restores a chosen demo plan after reload", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Deadline/ }).check();
  await page.getByRole("button", { name: "Use this plan" }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  await expect(page.locator("#saved-summary")).toContainText("Deadline · 320 overdue");
});

test("@claim:backup-roundtrip exports and restores inputs and a chosen plan", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Gentle/ }).check();
  await page.getByRole("button", { name: "Use this plan" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export my data" }).click();
  const exported = await downloadPromise;
  const exportPath = await exported.path();
  expect(exportPath).not.toBeNull();
  const backup = readFileSync(exportPath as string, "utf8");
  expect(JSON.parse(backup)).toMatchObject({ version: 1, input: { overdue: 320 }, plan: { policy: "gentle" } });

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear local data" }).click();
  await page.locator("#queue-file").setInputFiles({ name: "review-backlog-forecast-backup.json", mimeType: "application/json", buffer: Buffer.from(backup) });
  await expect(page.getByText("Local backup restored. Run the forecast to review it.")).toBeVisible();
  await expect(page.locator("#overdue")).toHaveValue("320");
  await expect(page.locator("#saved-summary")).toContainText("Gentle · 320 overdue");
});

test("@claim:schedule-export downloads one CSV row for every exported day", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Deadline/ }).check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export schedule" }).click();
  const exported = await downloadPromise;
  expect(exported.suggestedFilename()).toBe("deadline-recovery-plan.csv");
  const exportPath = await exported.path();
  expect(exportPath).not.toBeNull();
  const rows = readFileSync(exportPath as string, "utf8").trim().split("\n");
  expect(rows[0]).toBe("day,date,study_day,regular_reviewed,overdue_reviewed,total,minutes,overdue_remaining,regular_rollover");
  expect(rows.length).toBeGreaterThanOrEqual(29);
  expect(rows[1].split(",")).toHaveLength(9);
});

test("@claim:clear-local-data removes saved inputs and the chosen plan", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Use this plan" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear local data" }).click();
  await expect(page.getByText("All local forecast data cleared.")).toBeVisible();
  await expect(page.locator("#saved-strip")).toBeHidden();
  await expect(page.locator("#results")).toBeHidden();
  const records = await page.evaluate(async () => new Promise<unknown[]>((resolve, reject) => {
    const request = indexedDB.open("review-backlog-forecast-demo");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const values = db.transaction("records", "readonly").objectStore("records").getAll();
      values.onerror = () => reject(values.error);
      values.onsuccess = () => { resolve(values.result); db.close(); };
    };
  }));
  expect(records).toEqual([]);
});

test("@claim:anki-isolation forecasts and exports without contacting Anki", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/?demo=1");
  await expect(page.locator(".form-submit")).toContainText("this forecasts counts only. It cannot read or change your Anki collection.");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export schedule" }).click();
  await downloadPromise;
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(requests.some((url) => /anki/i.test(new URL(url).hostname))).toBe(false);
});

test("@claim:no-third-party-runtime loads no third-party scripts, fonts, analytics, ads, or image services", async ({ page }) => {
  const requests: Array<{ url: string; type: string }> = [];
  page.on("request", (request) => requests.push({ url: request.url(), type: request.resourceType() }));
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  const origin = new URL(page.url()).origin;
  expect(requests.every((request) => new URL(request.url).origin === origin)).toBe(true);
  expect(requests.filter((request) => request.type === "font")).toEqual([]);
  const dependencyUrls = await page.locator('script[src], link[rel="stylesheet"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("src") ?? element.getAttribute("href") ?? ""));
  expect(dependencyUrls.every((url) => !/^https?:/i.test(url))).toBe(true);
});

test("@claim:no-account runs the complete sample without an account or payment step", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  expect(requests.some((url) => /login|signin|checkout|billing|payment/i.test(url))).toBe(false);
});

test("serves unknown routes as the styled 404 with an HTTP 404 status", async ({ page }) => {
  const response = await page.goto("/definitely-missing-verifier-route");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found — Review Backlog Forecast");
  await expect(page.getByRole("heading", { level: 1, name: "This forecast page does not exist." })).toBeVisible();
});

test("publishes route metadata, shared legal chrome, and build identity", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /recovery-console-social\.[a-f0-9]{8}\.jpg$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator(".trust-list")).toContainText("Free");
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Review Backlog Forecast");

  for (const route of ["/privacy/", "/terms/"]) {
    await page.goto(route);
    await expect(page.getByRole("banner").getByRole("link", { name: "Review Backlog Forecast home" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toContainText("Built by Param Factory · Build 1.0.4");
  }
  for (const [route, title, canonical] of [
    ["/offline.html", "Offline — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/offline.html"],
    ["/404.html", "Page not found — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/404.html"]
  ]) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/icons/icon-192.672eaa75.png");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /recovery-console-social\.[a-f0-9]{8}\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  }
  const social = await request.get("/assets/recovery-console-social.ddcbcf56.jpg");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/jpeg");
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.headers()["content-type"]).toContain("application/manifest+json");
});

test("keeps delayed demo startup CLS below 0.1 at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const state = window as typeof window & { __rbfLayoutShifts: number[] };
    state.__rbfLayoutShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput: boolean; value: number }>) {
        if (!entry.hadRecentInput) state.__rbfLayoutShifts.push(entry.value);
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.route(/\/assets\/app-[^/]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  await page.waitForTimeout(300);
  const cls = await page.evaluate(() => (window as typeof window & { __rbfLayoutShifts: number[] }).__rbfLayoutShifts.reduce((sum, value) => sum + value, 0));
  expect(cls).toBeLessThan(0.1);
});

test("activates a waiting service-worker update without losing the demo", async ({ browser }) => {
  const fixture = mkdtempSync(join(tmpdir(), "rbf-sw-update-"));
  cpSync("dist", fixture, { recursive: true });
  const workerPath = join(fixture, "sw.js");
  const originalWorker = readFileSync(workerPath, "utf8");
  expect(originalWorker).toContain('const VERSION = "rbf-v1.0.4"');
  const server = await startStaticServer(fixture);
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${server.origin}/?demo=1`);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
      }
    });
    writeFileSync(workerPath, originalWorker.replace("rbf-v1.0.4", "rbf-v1.0.5"));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await expect(page.getByText("A new version is ready.")).toBeVisible();
    await page.getByRole("button", { name: "Update" }).click();
    await page.waitForFunction(async () => (await caches.keys()).includes("rbf-v1.0.5-shell"));
    await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  } finally {
    await context.close();
    await server.close();
    rmSync(fixture, { recursive: true, force: true });
  }
});
