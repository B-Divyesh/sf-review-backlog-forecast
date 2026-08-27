import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("runs a forecast, selects a policy, and persists it", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Add your queue totals to compare plans." })).toBeVisible();

  await page.getByRole("button", { name: "Try an example" }).click();
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

test("imports a summary CSV and reports the result", async ({ page }) => {
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

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try an example" }).click();
  await page.getByRole("button", { name: "Run forecast" }).click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("fits a 390px viewport without page-level horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Try an example" }).click();
  await page.getByRole("button", { name: "Run forecast" }).click();
  const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth);
  await page.screenshot({ path: "test-results/mobile-forecast.png", fullPage: true });
});

test("reloads the forecast while offline after the app shell is cached", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle(/Review Backlog Forecast/);
  await expect(page.getByRole("heading", { name: "See the climb before you touch the queue." })).toBeVisible();
  await page.getByRole("button", { name: "Try an example" }).click();
  await page.getByRole("button", { name: "Run forecast" }).click();
  await expect(page.getByRole("heading", { name: "Three honest routes through the queue" })).toBeVisible();
  await context.setOffline(false);
});
