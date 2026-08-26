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
  const routes = rows
    .filter((p) => p.slug && p.name)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      description: (p.description || "").slice(0, 200),
    }));
  writeFileSync(ROUTES_PATH, JSON.stringify(routes, null, 2) + "\n");

  /**
   * Maskinläsbart öppet dataset för AI-assistenter och researchers.
   * Innehåller endast publika, icke-personliga uppgifter – inga kontaktpersoner,
   * e-postadresser, faktureringsuppgifter eller interna fält.
   */
  const PUBLIC_DATASET_PATH = resolve(__dirname, "../public/partner-data.json");
  const dataset = {
    name: "Verifierade Microsoft Dynamics 365-partners i Sverige",
    description:
      "Öppet, maskinläsbart dataset över de Dynamics 365-partners som är verifierade och publicerade på d365.se. Endast publika uppgifter ingår.",
    publisher: "d365.se (Dynamic Factory AB)",
    url: "https://d365.se/partner-data.json",
    license: "https://d365.se/friskrivning",
    citation:
      "d365.se – Verifierade Microsoft Dynamics 365-partners i Sverige, https://d365.se/valjdynamics365partner",
    updated: new Date().toISOString().slice(0, 10),
    count: rows.length,
    partners: rows
      .filter((p) => p.slug && p.name)
      .map((p) => ({
        name: p.name,
        slug: p.slug,
        url: `https://d365.se/partner/${p.slug}/`,
        website: p.website || null,
        description: p.description || null,
        products: p.applications || p.products || null,
        industries: p.industries || null,
        offices: p.offices || p.office_locations || null,
        company_size: p.company_size || null,
        geography: p.geography || null,
        related_party: p.related_party ?? false,
      })),
  };
  writeFileSync(PUBLIC_DATASET_PATH, JSON.stringify(dataset, null, 2) + "\n");

  console.log(
    `[generate-partner-data] Wrote ${rows.length} featured partners → src/data/partnerData.json + public/partner-data.json`,
  );
} catch (err) {
  console.warn(
    `[generate-partner-data] Failed to refresh (${err.message}). Keeping previous snapshot.`,
  );
}
