import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { defineConfig, type Plugin } from "vite";

const root = resolve(import.meta.dirname);
const outDir = resolve(root, "dist");
const appVersion = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version as string;

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function releasePlugin(): Plugin {
  return {
    name: "release-policy",
    enforce: "pre",
    transformIndexHtml(html) {
      return html.replaceAll("%APP_VERSION%", appVersion);
    },
    configurePreviewServer(server) {
      const documents = new Set(["/", "/privacy", "/privacy/", "/terms", "/terms/", "/404.html", "/offline.html"]);
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://preview.local").pathname;
        if (request.method !== "GET" || documents.has(pathname) || extname(pathname)) return next();
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(readFileSync(resolve(outDir, "404.html")));
      });
    },
    closeBundle() {
      const shell = filesBelow(outDir)
        .map((file) => relative(outDir, file).split(sep).join("/"))
        .filter((file) => !file.endsWith(".map") && !["sw.js", "staticwebapp.config.json", "robots.txt", "sitemap.xml"].includes(file))
        .map((file) => file === "index.html" ? "/" : file.endsWith("/index.html") ? `/${file.slice(0, -10)}` : `/${file}`)
        .sort();
      const workerPath = resolve(outDir, "sw.js");
      const worker = readFileSync(workerPath, "utf8").replace(
        "const SHELL = [\"/\"]; // BUILD_INJECT_SHELL",
        `const SHELL = ${JSON.stringify(shell, null, 2)};`
      );
      writeFileSync(workerPath, worker);
    }
  };
}

export default defineConfig({
  plugins: [releasePlugin()],
  build: {
    target: "es2022",
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        app: "index.html",
        privacy: "privacy/index.html",
        terms: "terms/index.html",
        notFound: "404.html",
        offline: "offline.html"
      }
    }
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    coverage: { reporter: ["text", "json"] }
  }
});
