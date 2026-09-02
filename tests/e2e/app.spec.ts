import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, normalize } from "node:path";

function rgbChannels(color: string): [number, number, number] {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Unsupported color: ${color}`);
  return channels as [number, number, number];
}

function relativeLuminance(color: string): number {
  const [red, green, blue] = rgbChannels(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string): number {
  const luminances = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

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
  await expect(page.getByRole("heading", { name: "Add your overdue queue totals to compare recovery plans." })).toBeVisible();

  await page.getByRole("button", { name: "Load sample values" }).click();
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio", { name: /Gentle/ }).check();
  await expect(page.getByRole("heading", { name: "Gentle plan" })).toBeVisible();
  await page.getByRole("button", { name: "Save this plan" }).click();
  await expect(page.getByText("Gentle plan saved on this device.")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  await expect(page.getByText(/Gentle · 320 overdue/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("opens a populated sample forecast in the first post-click viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/demo\//);
  await expect(page.locator(".hero")).toBeHidden();
  await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  const firstPlan = page.locator("#policy-grid .policy-card").first();
  await expect(firstPlan).toBeVisible();
  const box = await firstPlan.boundingBox();
  expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(await page.evaluate(() => window.innerHeight));
});

test("keeps ?demo=1 as an isolated direct sample entry", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Review Backlog Forecast");
  await expect(page.getByRole("heading", { level: 1, name: "Three recovery plans" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start for real" })).toBeVisible();
});

test("links How it works to three direct planning steps", async ({ page }) => {
  await page.goto("/");
  const howItWorks = page.locator('nav[aria-label="Primary"] a[href="/#how-it-works"]');
  await expect(howItWorks).toHaveAttribute("href", "/#how-it-works");
  if (await howItWorks.isVisible()) await howItWorks.click();
  else await page.goto("/#how-it-works");
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.getByRole("heading", { level: 2, name: "How it works" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Enter or import totals" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Set a session cap" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Compare or export a plan" })).toBeVisible();
});

test("invalidates stale forecast actions after edits, imports, and rejected submissions", async ({ page }) => {
  await page.goto("/?demo=1");
  const savePlan = page.getByRole("button", { name: "Save this plan" });
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

test("disables forecasting until a controlled file import finishes", async ({ page }) => {
  await page.addInitScript(() => {
    const originalText = File.prototype.text;
    let releaseFileText: () => void = () => undefined;
    const fileTextBarrier = new Promise<void>((resolve) => {
      releaseFileText = resolve;
    });
    (window as Window & { releaseFileText: () => void }).releaseFileText = releaseFileText;
    File.prototype.text = function () {
      return fileTextBarrier.then(() => originalText.call(this));
    };
  });
  await page.goto("/?demo=1");

  const runForecast = page.getByRole("button", { name: "Run forecast" });
  const savePlan = page.getByRole("button", { name: "Save this plan" });
  await page.locator("#queue-file").setInputFiles({
    name: "delayed-summary.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("overdue,due_today,daily_due\n2,1,1\n")
  });

  await expect(page.locator("#import-message")).toContainText("Reading delayed-summary.csv");
  await expect(runForecast).toBeDisabled();
  await expect(runForecast).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#forecast-form")).toHaveAttribute("aria-busy", "true");
  await expect(savePlan).toBeDisabled();

  // A submitted form event cannot calculate the old demo values while the
  // browser is still reading the selected file.
  await page.locator("#forecast-form").evaluate((form) => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  await expect(savePlan).toBeDisabled();
  await expect(page.locator("#overdue")).toHaveValue("320");

  await page.evaluate(() => (window as Window & { releaseFileText: () => void }).releaseFileText());
  await expect(page.locator("#import-message")).toContainText("2 overdue and 1 due today");
  await expect(page.locator("#overdue")).toHaveValue("2");
  await expect(runForecast).toBeEnabled();
  await expect(runForecast).not.toHaveAttribute("aria-busy", "true");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(savePlan).toBeEnabled();
});

test("keeps focus on the selected policy radio through repeated arrow navigation", async ({ page }) => {
  await page.goto("/?demo=1");
  const steady = page.getByRole("radio", { name: /^Steady/ });
  const deadline = page.getByRole("radio", { name: /^Deadline/ });
  const gentle = page.getByRole("radio", { name: /^Gentle/ });

  await steady.focus();
  await page.keyboard.press("ArrowRight");
  await expect(deadline).toBeChecked();
  await expect(deadline).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(gentle).toBeChecked();
  await expect(gentle).toBeFocused();
});

test("keeps focus indicators above 3:1 contrast on every dark planner surface", async ({ page }) => {
  await page.goto("/?demo=1");
  const savePlan = page.getByRole("button", { name: "Save this plan" });
  await savePlan.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  const controls = [
    ["Reset demo", page.getByRole("button", { name: "Reset demo" })],
    ["Start for real", page.getByRole("link", { name: "Start for real" })],
    ["Download CSV template", page.getByRole("button", { name: "Download CSV template" })],
    ["Accepted CSV columns", page.getByText("Accepted CSV columns", { exact: true })],
    ["Make a queue CSV from Anki", page.getByText("Make a queue CSV from Anki", { exact: true })],
    ["Load sample values", page.getByRole("button", { name: "Load sample values" })],
    ["About overdue cards", page.getByRole("button", { name: "About overdue cards" })],
    ["About cards due today", page.getByRole("button", { name: "About cards due today" })],
    ["Run forecast", page.getByRole("button", { name: "Run forecast" })],
    ["Open plan", page.getByRole("button", { name: "Open plan" })],
    ["Remove saved plan", page.getByRole("button", { name: "Remove saved plan" })]
  ] as const;
  const darkSurface = await page.locator(".planner").evaluate((element) => getComputedStyle(element).backgroundColor);

  for (const [name, control] of controls) {
    await page.keyboard.press("Tab");
    await control.focus();
    await expect(control, name).toBeFocused();
    const style = await control.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        background: computed.backgroundColor,
        outlineColor: computed.outlineColor,
        outlineStyle: computed.outlineStyle,
        outlineWidth: Number.parseFloat(computed.outlineWidth)
      };
    });
    expect(style.outlineStyle, `${name} outline style`).toBe("solid");
    expect(style.outlineWidth, `${name} outline width`).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(style.outlineColor, darkSurface), `${name} ring against enamel`).toBeGreaterThanOrEqual(3);
    if (style.background !== "rgba(0, 0, 0, 0)") {
      expect(contrastRatio(style.outlineColor, style.background), `${name} ring against its control`).toBeGreaterThanOrEqual(3);
    }
  }

  const fileInput = page.locator("#queue-file");
  await page.keyboard.press("Tab");
  await fileInput.focus();
  await expect(fileInput).toBeFocused();
  const fileIndicator = await page.locator("label[for='queue-file']").evaluate((element) => {
    const computed = getComputedStyle(element);
    return { background: computed.backgroundColor, outlineColor: computed.outlineColor, outlineWidth: Number.parseFloat(computed.outlineWidth) };
  });
  expect(fileIndicator.outlineWidth, "Import CSV focus width").toBeGreaterThanOrEqual(3);
  expect(contrastRatio(fileIndicator.outlineColor, darkSurface), "Import CSV ring against enamel").toBeGreaterThanOrEqual(3);
  expect(contrastRatio(fileIndicator.outlineColor, fileIndicator.background), "Import CSV ring against its control").toBeGreaterThanOrEqual(3);
});

test("keeps the transient Undo action at least 44px square on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Save this plan" }).click();
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

test("@claim:anki-csv-steps gives Anki count instructions, a template, and an import path", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/?demo=1");
  await page.locator("#anki-csv-steps summary").click();
  await expect(page.locator("#anki-csv-steps")).toContainText("is:review prop:due<0");
  await expect(page.locator("#anki-csv-steps")).toContainText("is:review prop:due=0");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV template" }).click();
  const downloaded = await downloadPromise;
  const templatePath = await downloaded.path();
  expect(templatePath).not.toBeNull();
  const template = readFileSync(templatePath as string, "utf8");
  expect(template).toContain("overdue,due_today,daily_due");
  await page.locator("#queue-file").setInputFiles({ name: "anki-counts.csv", mimeType: "text/csv", buffer: Buffer.from("overdue,due_today,daily_due\n12,5,18\n") });
  await expect(page.locator("#overdue")).toHaveValue("12");
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
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
    ["#daily-due", "100001", "Regular reviews per day must be a whole number between 0 and 100,000."],
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
  const skip = page.getByRole("link", { name: "Skip to forecast controls" });
  await skip.focus();
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(/#main$/);
});

test("moves keyboard focus to each legal page main landmark", async ({ page }) => {
  for (const route of ["/privacy/", "/terms/"]) {
    await page.goto(route);
    const skip = page.getByRole("link", { name: /^Skip to/ });
    await skip.focus();
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  }
});

test("moves focus to each route heading and announces root, legal pages, and Back", async ({ page }) => {
  await page.goto("/");
  const rootHeading = page.getByRole("heading", { name: "Plan an overdue queue before changing cards." });
  await expect(rootHeading).toBeFocused();
  await expect(page.locator("#route-announcement")).toHaveText("Page loaded: Plan an overdue queue before changing cards.");
  await page.getByRole("banner").getByRole("link", { name: "Privacy" }).click();
  const privacyHeading = page.getByRole("heading", { name: "Keep your queue on your device." });
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator("#route-announcement")).toHaveText("Page loaded: Keep your queue on your device.");
  await page.getByRole("contentinfo").getByRole("link", { name: "Terms" }).click();
  const termsHeading = page.getByRole("heading", { name: "Use forecasts as planning estimates." });
  await expect(termsHeading).toBeFocused();
  await expect(page.locator("#route-announcement")).toHaveText("Page loaded: Use forecasts as planning estimates.");
  await page.goBack();
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator("#route-announcement")).toHaveText("Page loaded: Keep your queue on your device.");
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
  await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
  const zoomedSizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  expect(zoomedSizes.scrollWidth, "page width at 200% text size").toBeLessThanOrEqual(zoomedSizes.innerWidth);
  await expect(page.getByRole("heading", { level: 1, name: "Three recovery plans" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run forecast" })).toBeVisible();
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
    await expect(page.getByRole("heading", { level: 1, name: "Three recovery plans" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("@claim:installability is installable as a standalone PWA", async ({ browser }, testInfo) => {
  const context = await browser.newContext(testInfo.project.name === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {});
  const page = await context.newPage();
  try {
    await page.goto("/?demo=1");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    });
    const cdp = await context.newCDPSession(page);
    const installability = await cdp.send("Page.getInstallabilityErrors");
    expect(installability.installabilityErrors).toEqual([]);
    const manifest = await page.evaluate(async () => await (await fetch("/manifest.webmanifest")).json() as {
      display: string;
      start_url: string;
      icons: Array<{ sizes: string; purpose: string }>;
    });
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toMatch(/^\/?\?source=pwa&v=\d+\.\d+\.\d+$/);
    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192" }),
      expect.objectContaining({ sizes: "512x512", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" })
    ]));
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
  await expect(page.locator("#import-message")).toContainText("2 overdue and 0 due today");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await page.getByRole("button", { name: "Save this plan" }).click();
  await page.locator("#queue-file").setInputFiles({
    name: "private-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      rawMarker: privateMarker,
      input: { overdue: 2, dueToday: 1, dailyDue: 1, newCards: 0, secondsPerCard: 12, capMinutes: 30, deadlineDays: 14, studyDays: 6 }
    }))
  });
  await expect(page.locator("#import-message")).toContainText("Local backup restored. Run the forecast to review it.");
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

test("@claim:no-forecast-transmission sends no counts, imported file data, assumptions, or saved plan", async ({ page }) => {
  const requests: Array<{ headers: Record<string, string>; method: string; postData: string | null; url: string }> = [];
  page.on("request", (request) => requests.push({
    headers: request.headers(),
    method: request.method(),
    postData: request.postData(),
    url: request.url()
  }));
  await page.goto("/?demo=1");

  const fileNameMarker = "PRIVATE_QUEUE_FILE_64193.csv";
  const fileContentMarker = "PRIVATE_FILE_CONTENT_52961";
  await page.locator("#queue-file").setInputFiles({
    name: fileNameMarker,
    mimeType: "text/csv",
    buffer: Buffer.from(`overdue,due_today,daily_due,private_note\n91827,81234,78901,${fileContentMarker}\n`)
  });
  await page.locator("#new-cards").fill("7654");
  await page.locator("#seconds-card").fill("293");
  await page.locator("#cap-minutes").fill("299");
  await page.locator("#deadline-days").fill("83");
  await page.locator("#study-days").fill("4");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await page.getByRole("radio", { name: /Gentle/ }).check();
  await page.getByRole("button", { name: "Save this plan" }).click();
  await expect(page.getByText("Gentle plan saved on this device.")).toBeVisible();

  const savedPlan = await page.evaluate(async () => await new Promise<{ id: string; savedAt: string; input: { overdue: number; secondsPerCard: number } }>((resolve, reject) => {
    const open = indexedDB.open("review-backlog-forecast-demo");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const get = db.transaction("records", "readonly").objectStore("records").get("plan");
      get.onerror = () => reject(get.error);
      get.onsuccess = () => { resolve(get.result); db.close(); };
    };
  }));
  expect(savedPlan.input).toMatchObject({ overdue: 91827, secondsPerCard: 293 });
  await page.reload();
  await expect(page.locator("#saved-summary")).toContainText("Gentle · 91,827 overdue · 299-minute cap");

  const transmitted = JSON.stringify(requests);
  const privateMarkers = [fileNameMarker, fileContentMarker, "91827", "81234", "78901", "7654", "293", "299", "83", savedPlan.id, savedPlan.savedAt];
  expect(requests.every((request) => request.method === "GET" && request.postData === null)).toBe(true);
  for (const marker of privateMarkers) {
    expect(transmitted, `outgoing requests must omit ${marker}`).not.toContain(marker);
    expect(transmitted, `outgoing requests must omit encoded ${marker}`).not.toContain(encodeURIComponent(marker));
  }
});

test("@claim:adjustable-estimates labels estimates and recalculates when one changes", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.locator("label[for='seconds-card']")).toContainText("estimate");
  await expect(page.locator("#capacity-readout")).toContainText("150 cards");
  await page.locator("#seconds-card").fill("20");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(page.locator("#capacity-readout")).toContainText("90 cards");
});

test("@claim:demo-isolation keeps demo storage separate from a real saved plan", async ({ page }) => {
  await page.goto("/");
  await page.locator("#overdue").fill("7");
  await page.locator("#due-today").fill("2");
  await page.locator("#daily-due").fill("1");
  await page.getByRole("button", { name: "Run forecast" }).click();
  await page.getByRole("button", { name: "Save this plan" }).click();
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toHaveCount(0);
  await expect(page.locator("#overdue")).toHaveValue("320");
});

test("@claim:local-persistence restores a chosen demo plan after reload", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Deadline/ }).check();
  await page.getByRole("button", { name: "Save this plan" }).click();
  await expect(page.getByText("Deadline plan saved on this device.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
  await expect(page.locator("#saved-summary")).toContainText("Deadline · 320 overdue");
});

test("@claim:saved-plan-offline reopens a saved plan without a connection", async ({ browser }, testInfo) => {
  const context = await browser.newContext(testInfo.project.name === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {});
  const page = await context.newPage();
  try {
    await page.goto("/?demo=1");
    await page.getByRole("radio", { name: /Gentle/ }).check();
    await page.getByRole("button", { name: "Save this plan" }).click();
    await expect(page.getByText("Gentle plan saved on this device.")).toBeVisible();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    });
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Three recovery plans" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your last chosen plan" })).toBeVisible();
    await expect(page.locator("#saved-summary")).toContainText("Gentle · 320 overdue · 30-minute cap");
    await expect(page.locator("#connection-status")).toContainText("Offline · forecast still works");
  } finally {
    await context.close();
  }
});

test("@claim:input-persistence restores edited inputs without saving a plan", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.locator("#daily-due").fill("44");
  await expect.poll(async () => page.evaluate(async () => new Promise<number | undefined>((resolve, reject) => {
    const request = indexedDB.open("review-backlog-forecast-demo");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const get = db.transaction("records", "readonly").objectStore("records").get("input");
      get.onerror = () => reject(get.error);
      get.onsuccess = () => { resolve((get.result as { dailyDue?: number } | undefined)?.dailyDue); db.close(); };
    };
  }))).toBe(44);
  await page.reload();
  await expect(page.locator("#daily-due")).toHaveValue("44");
  await expect(page.locator("#saved-strip")).toBeHidden();
});

test("@claim:backup-roundtrip exports and restores inputs and a chosen plan", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Gentle/ }).check();
  await page.getByRole("button", { name: "Save this plan" }).click();
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

test("@claim:daily-cards-minutes shows numeric card totals and minutes in the daily ledger", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.getByRole("columnheader", { name: "Total" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Minutes" })).toBeVisible();
  const firstDay = page.locator("#schedule-body tr").first();
  await expect(firstDay).toBeVisible();
  await expect(firstDay.locator("td").nth(2)).toHaveText(/^\d+$/);
  await expect(firstDay.locator("td").nth(3)).toHaveText(/^\d+$/);
  await expect(firstDay.locator("td").nth(4)).toHaveText(/^\d+$/);
});

test("@claim:clear-local-data removes saved inputs and the chosen plan", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Save this plan" }).click();
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
  await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  expect(requests.some((url) => /login|signin|checkout|billing|payment/i.test(url))).toBe(false);
});

test("serves unknown routes as the styled 404 with an HTTP 404 status", async ({ page }) => {
  const response = await page.goto("/definitely-missing-verifier-route");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found — Review Backlog Forecast");
  await expect(page.getByRole("heading", { level: 1, name: "This forecast page does not exist." })).toBeVisible();
});

test("publishes route metadata, shared chrome, and build identity", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /recovery-console-social\.[a-f0-9]{8}\.jpg$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const freeFact = page.locator(".trust-list li", { hasText: "Free" });
  await expect(freeFact).toBeVisible();
  expect((await freeFact.boundingBox())?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(880);
  await page.goto("/demo/");
  await expect(page).toHaveTitle("Demo — Review Backlog Forecast");
  await expect(page.locator("h1")).toHaveCount(1);

  for (const route of ["/privacy/", "/terms/", "/offline.html"]) {
    await page.goto(route);
    await expect(page.getByRole("banner").getByRole("link", { name: "Review Backlog Forecast home" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "How it works" })).toHaveAttribute("href", "/#how-it-works");
    await expect(page.getByRole("contentinfo")).toContainText("Built by Param Factory · Build 1.0.10");
  }
  for (const [route, title, canonical] of [
    ["/", "Review Backlog Forecast — Plan an overdue queue", "https://review-backlog-forecast.sociobot.in/"],
    ["/demo/", "Demo — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/demo/"],
    ["/privacy/", "Privacy — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/privacy/"],
    ["/terms/", "Terms — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/terms/"],
    ["/offline.html", "Offline — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/offline.html"],
    ["/404.html", "Page not found — Review Backlog Forecast", "https://review-backlog-forecast.sociobot.in/404.html"]
  ]) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/icons/icon-180.8072a37b.png");
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("sizes", "180x180");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /recovery-console-social\.[a-f0-9]{8}\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("h1")).toHaveCount(1);
  }
  const social = await request.get("/assets/recovery-console-social.ddcbcf56.jpg");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/jpeg");
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.headers()["content-type"]).toContain("application/manifest+json");
  const appleIcon = await request.get("/icons/icon-180.8072a37b.png");
  const appleIconBytes = await appleIcon.body();
  expect(appleIcon.status()).toBe(200);
  expect(appleIconBytes.readUInt32BE(16)).toBe(180);
  expect(appleIconBytes.readUInt32BE(20)).toBe(180);

  const demoResponse = await request.get("/demo/");
  const demoHead = await demoResponse.text();
  expect(demoHead).toContain('<title>Demo — Review Backlog Forecast</title>');
  expect(demoHead).toContain('name="description" content="Explore a 320-card sample overdue queue and compare capped recovery plans before changing cards in Anki."');
  expect(demoHead).toContain('property="og:url" content="https://review-backlog-forecast.sociobot.in/demo/"');
  expect(demoHead).toContain('rel="canonical" href="https://review-backlog-forecast.sociobot.in/demo/"');
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
  await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  await page.waitForTimeout(300);
  const cls = await page.evaluate(() => (window as typeof window & { __rbfLayoutShifts: number[] }).__rbfLayoutShifts.reduce((sum, value) => sum + value, 0));
  expect(cls).toBeLessThan(0.1);
});

test("activates a waiting service-worker update without losing the demo", async ({ browser }) => {
  const fixture = mkdtempSync(join(tmpdir(), "rbf-sw-update-"));
  cpSync("dist", fixture, { recursive: true });
  const workerPath = join(fixture, "sw.js");
  const originalWorker = readFileSync(workerPath, "utf8");
  expect(originalWorker).toContain('const VERSION = "rbf-v1.0.10"');
  const server = await startStaticServer(fixture);
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${server.origin}/demo/`);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
      }
    });
    writeFileSync(workerPath, originalWorker.replace("rbf-v1.0.10", "rbf-v1.0.11"));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await expect(page.getByText("A new version is ready.")).toBeVisible();
    await page.getByRole("button", { name: "Update app" }).click();
    await page.waitForFunction(async () => (await caches.keys()).includes("rbf-v1.0.11-shell"));
    await expect(page.getByRole("heading", { name: "Three recovery plans" })).toBeVisible();
  } finally {
    await context.close();
    await server.close();
    rmSync(fixture, { recursive: true, force: true });
  }
});
