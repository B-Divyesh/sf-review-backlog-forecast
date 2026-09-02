import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("release contract", () => {
  it("maps every registered claim to exactly one tagged test definition", () => {
    const claims = JSON.parse(readFileSync(".factory/claims.json", "utf8")) as Array<{ id: string }>;
    const tests = [
      readFileSync("src/forecast.test.ts", "utf8"),
      readFileSync("src/csv.test.ts", "utf8"),
      readFileSync("tests/e2e/app.spec.ts", "utf8")
    ].join("\n");
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const marker = `@claim:${claim.id}`;
      expect(tests.split(marker).length - 1, marker).toBe(1);
    }
  });

  it("configures a real 404, immutable hashed assets, and the manifest MIME type", () => {
    const config = JSON.parse(readFileSync("public/staticwebapp.config.json", "utf8")) as {
      navigationFallback?: unknown;
      mimeTypes: Record<string, string>;
      routes: Array<{ route: string; headers?: Record<string, string> }>;
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
    expect(config.mimeTypes[".webmanifest"]).toBe("application/manifest+json");
    for (const route of ["/assets/*", "/icons/*"]) {
      expect(config.routes.find((entry) => entry.route === route)?.headers?.["Cache-Control"]).toBe("public, max-age=31536000, immutable");
    }
  });

  it("uses one visitor-facing term for each forecast concept and keeps the free fact in the first row", () => {
    const landing = readFileSync("index.html", "utf8");
    const visitorCopy = [
      landing,
      readFileSync("README.md", "utf8"),
      readFileSync("public/manifest.webmanifest", "utf8"),
      readFileSync("src/app.ts", "utf8"),
      readFileSync("src/csv.ts", "utf8"),
      readFileSync("src/forecast.ts", "utf8"),
      readFileSync("privacy/index.html", "utf8"),
      readFileSync("terms/index.html", "utf8"),
      readFileSync("404.html", "utf8"),
      readFileSync("offline.html", "utf8")
    ].join("\n");
    expect(landing).toContain("Plan an overdue queue before changing cards.");
    expect(landing).toContain("For learners returning after missed days, compare capped recovery plans before changing cards in Anki.");
    expect(landing).toMatch(/<li>Preview only<\/li>\s*<li>Stays on this device<\/li>\s*<li>Free<\/li>/);
    expect(visitorCopy).toContain("Regular reviews per day");
    expect(visitorCopy).toContain("recovery plan");
    expect(readFileSync("public/manifest.webmanifest", "utf8")).toContain("Preview capped recovery plans for an overdue spaced-repetition queue.");
    for (const retiredCopy of [
      "Plan a spaced-repetition review backlog.",
      "Plan overdue reviews before changing cards.",
      "before changing an Anki queue",
      "local-first planning utility",
      "provenance in the project design notes",
      "Usual daily due",
      "estimated normal reviews",
      "regular-review rollover",
      "daily-due estimate",
      "spaced-repetition backlog",
      "FSRS changes"
    ]) expect(visitorCopy).not.toContain(retiredCopy);
  });

  it("keeps release documentation in plain words", () => {
    const readme = readFileSync("README.md", "utf8");
    const catalog = readFileSync(".factory/catalog-description.txt", "utf8").trim();
    expect(readme).toContain("To test offline behavior, use a production build:");
    expect(readme).toContain("The visual system and image source record are in `.factory/design.md`.");
    expect(readme).toContain("It does not fetch images from another service.");
    expect(readme).toContain("It also checks offline reopening, updates, page details, 404 behavior, touch targets, and content movement while loading.");
    expect(readme).not.toMatch(/PWA\/service-worker behavior|generated-image provenance|runtime image service|startup layout shift/);
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^(Plan|Compare)\b/);
  });

  it("ships a static demo document and names the save action by its result", () => {
    const landing = readFileSync("index.html", "utf8");
    const viteConfig = readFileSync("vite.config.ts", "utf8");
    expect(landing).toContain('href="/demo/">Try it with sample data');
    expect(landing).toContain('id="save-plan" type="button">Save this plan');
    expect(landing).not.toContain("Use this plan");
    expect(viteConfig).toContain("https://review-backlog-forecast.sociobot.in/demo/");
    expect(readFileSync("public/sitemap.xml", "utf8")).toContain("https://review-backlog-forecast.sociobot.in/demo/");
  });
});
