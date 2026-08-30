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

test("@claim:csv-import imports a summary CSV and reports the result", async ({ page }) => {
  await page.goto("/");
  await page.locator("#queue-file").setInputFiles({
    name: "queue.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("overdue,due_today,daily_due\n125,31,22\n")
  });
  await expect(page.getByText(/125 overdue and 31 due today/)).toBeVisible();
  await expect(page.locator("#overdue")).toHaveValue("125");
  await expect(page.locator("#daily-due")).toHaveValue("22");
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

test("moves keyboard focus to main when the skip link is activated", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to forecast controls" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(/#main$/);
});

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/?demo=1");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("fits a 390px viewport without page-level horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?demo=1");
  const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth);
  await page.screenshot({ path: "test-results/mobile-forecast.png", fullPage: true });
});

test("@claim:offline-reload reloads the demo forecast while offline after the app shell is cached", async ({ page, context }) => {
  await page.goto("/?demo=1");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle(/Review Backlog Forecast/);
  await expect(page.getByRole("heading", { name: "Plan overdue reviews before changing cards." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  await context.setOffline(false);
});

test("@claim:local-only keeps demo requests on this origin", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/?demo=1");
  await page.getByRole("radio", { name: /Deadline/ }).check();
  await page.getByRole("button", { name: "Use this plan" }).click();
  expect([...origins]).toEqual([new URL(page.url()).origin]);
});

test("keeps demo storage separate from a real saved plan", async ({ page }) => {
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

test("activates a waiting service-worker update without losing the demo", async ({ browser }) => {
  const fixture = mkdtempSync(join(tmpdir(), "rbf-sw-update-"));
  cpSync("dist", fixture, { recursive: true });
  const workerPath = join(fixture, "sw.js");
  const originalWorker = readFileSync(workerPath, "utf8");
  expect(originalWorker).toContain('const VERSION = "rbf-v1.0.2"');
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
    writeFileSync(workerPath, originalWorker.replace("rbf-v1.0.2", "rbf-v1.0.3"));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await expect(page.getByText("A new version is ready.")).toBeVisible();
    await page.getByRole("button", { name: "Update" }).click();
    await page.waitForFunction(async () => (await caches.keys()).includes("rbf-v1.0.3-shell"));
    await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  } finally {
    await context.close();
    await server.close();
    rmSync(fixture, { recursive: true, force: true });
  }
});
