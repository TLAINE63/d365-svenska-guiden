import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Regressionstest: alla interna länkar i src/ måste matcha en rutt i App.tsx.
 * Fångar upp trasiga länkar (404) innan de publiceras.
 */

const ROOT = resolve(process.cwd(), "src");

function routePatterns(): RegExp[] {
  const app = readFileSync(join(ROOT, "App.tsx"), "utf-8");
  const paths = [...app.matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes("*"));
  return paths.map(
    (p) => new RegExp(`^${p.replace(/:[^/]+/g, "[^/]+").replace(/\/$/, "")}$`),
  );
}

function collectLinks(): Map<string, Set<string>> {
  const links = new Map<string, Set<string>>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "__tests__" || entry.name === "test") continue;
        walk(p);
      } else if (/\.tsx?$/.test(entry.name)) {
        const src = readFileSync(p, "utf-8");
        for (const m of src.matchAll(
          /(?:to|href|path|url)\s*[:=]\s*[{ ]*"(\/[a-zA-Z0-9\-/_]*)"/g,
        )) {
          const url = m[1];
          if (!links.has(url)) links.set(url, new Set());
          links.get(url)!.add(p.replace(`${process.cwd()}/`, ""));
        }
      }
    }
  };
  walk(ROOT);
  return links;
}

describe("interna länkar", () => {
  it("pekar alltid på en existerande rutt", () => {
    const routes = routePatterns();
    const broken: string[] = [];
    for (const [url, files] of collectLinks()) {
      const clean = url.replace(/\/$/, "") || "/";
      if (!routes.some((r) => r.test(clean))) {
        broken.push(`${url}  <-  ${[...files].join(", ")}`);
      }
    }
    expect(broken, `Trasiga interna länkar:\n${broken.join("\n")}`).toEqual([]);
  });
});
