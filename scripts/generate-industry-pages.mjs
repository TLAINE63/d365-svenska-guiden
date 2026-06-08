#!/usr/bin/env node
/**
 * Generates src/data/industryPages.json by fetching all published
 * industry_pages rows from Supabase via the public REST API.
 *
 * Used by entry-server / IndustryPage for SSR data injection so that
 * intro, processes, challenges, roles, applications and FAQ appear
 * in the prerendered HTML (View Source / SEO / AI crawlers).
 *
 * Runs via predev/prebuild.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/industryPages.json");

// Read VITE_* env from .env so the script works in CI/local without extra setup
function loadEnv() {
  try {
    const txt = readFileSync(resolve(__dirname, "../.env"), "utf8");
    const out = {};
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch {
    return {};
  }
}

const env = { ...loadEnv(), ...process.env };
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "[generate-industry-pages] Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — writing empty snapshot.",
  );
  writeFileSync(OUTPUT_PATH, "[]\n");
  process.exit(0);
}

try {
  const url = `${SUPABASE_URL}/rest/v1/industry_pages?select=*&is_published=eq.true&order=slug.asc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  const rows = await res.json();
  writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 2) + "\n");
  console.log(
    `[generate-industry-pages] Wrote ${rows.length} industry pages → src/data/industryPages.json`,
  );
} catch (err) {
  console.warn(
    `[generate-industry-pages] Failed to fetch (${err.message}). Keeping previous snapshot if any.`,
  );
  try {
    readFileSync(OUTPUT_PATH, "utf8");
  } catch {
    writeFileSync(OUTPUT_PATH, "[]\n");
  }
}
