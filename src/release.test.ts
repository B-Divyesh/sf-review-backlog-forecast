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
});
