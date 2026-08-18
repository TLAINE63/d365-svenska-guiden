#!/usr/bin/env node
/**
 * Regenerates src/data/partnerData.json from the live Supabase database
 * (partners_public view, is_featured = true).
 *
 * This snapshot is imported by entry-server.tsx and injected into the
 * static HTML for /branscher/:slug, partner profiles and the homepage
 * teaser, so prerendered pages (View Source / SEO / AI crawlers) always
 * reflect the latest production data.
 *
 * Runs via prebuild.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/partnerData.json");
/**
 * Route-listan MÅSTE spegla samma urval som partnerData.json – annars
 * prerenderas /partner/<slug>-sidor utan data ("Laddar partnerinformation…")
 * och hamnar i sitemap trots att de saknar innehåll för crawlers.
 */
const ROUTES_PATH = resolve(__dirname, "../src/data/partnerRoutes.json");

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
    "[generate-partner-data] Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — keeping existing snapshot.",
  );
  process.exit(0);
}

try {
  const url = `${SUPABASE_URL}/rest/v1/partners_public?select=*&is_featured=eq.true&order=name.asc`;
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
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Empty response — refusing to overwrite existing snapshot");
  }
  writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 2) + "\n");
  console.log(
    `[generate-partner-data] Wrote ${rows.length} featured partners → src/data/partnerData.json`,
  );
} catch (err) {
  console.warn(
    `[generate-partner-data] Failed to refresh (${err.message}). Keeping previous snapshot.`,
  );
}
