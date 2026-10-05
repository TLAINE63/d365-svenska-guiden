#!/usr/bin/env node
/** Hämtar textbanken (site_texts) till src/data/siteTexts.json vid bygget. Behåller befintlig fil om hämtning misslyckas. */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/data/siteTexts.json");

function loadEnv() {
  try {
    const out = {};
    for (const line of readFileSync(resolve(__dirname, "../.env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch { return {}; }
}
const env = { ...loadEnv(), ...process.env };
const URL_ = env.VITE_SUPABASE_URL, KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!URL_ || !KEY) { console.warn("[generate-site-texts] env saknas, behåller befintlig fil"); process.exit(0); }
try {
  const res = await fetch(`${URL_}/rest/v1/site_texts?select=key,value`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows = await res.json();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n");
  console.log(`[generate-site-texts] ${rows.length} texter → src/data/siteTexts.json`);
} catch (e) {
  console.warn("[generate-site-texts] hämtning misslyckades, behåller befintlig fil:", e.message);
}
