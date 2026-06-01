#!/usr/bin/env node
/**
 * Logo Usage Guard
 * ----------------
 * Säkerställer att rätt logotypvariant används överallt i kodbasen.
 *
 * Regler:
 *  1. Visuell logotyp i UI-komponenter MÅSTE använda `/d365-logo.svg`
 *     (ljus variant med svart text). Det finns för närvarande ingen
 *     mörk variant — alla ytor har ljus bakgrund.
 *  2. Gamla logotypfiler (`d365guide-logo*`, `d365guide-logo-white-bg*`,
 *     `d365guide-logo-new*`) får INTE refereras från `src/` förutom i
 *     SEO/StructuredData-filer där de bara skickas som schema.org-metadata.
 *  3. Inga hårdkodade externa logo-URL:er i visuella komponenter.
 *
 * Körs automatiskt via `prebuild` så att felaktig logotyp aldrig
 * når en deploy.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SRC = join(ROOT, "src");

// Filer där det är OK att referera de gamla logotyperna (endast som
// schema.org / SEO-metadata, aldrig som visuell <img>).
const SEO_ALLOWLIST = new Set([
  "src/components/StructuredData.tsx",
  "src/pages/BlogArticle.tsx",
  "src/data/knowledgeVideos.ts",
]);

// Mönster som indikerar fel logotyp i visuell kontext.
const FORBIDDEN_PATTERNS = [
  {
    pattern: /d365guide-logo[\w-]*\.(png|webp|svg|jpg)/gi,
    label: "äldre logotyp (d365guide-logo*)",
  },
  {
    pattern: /d365-logo-dark/gi,
    label: "mörk logotypvariant (finns ej — använd /d365-logo.svg)",
  },
];

// Den enda godkända visuella logotypen.
const APPROVED_LOGO = "/d365-logo.svg";

// Komponenter som MÅSTE visa godkänd logotyp.
const REQUIRED_USAGE = [
  "src/components/Navbar.tsx",
  "src/components/Footer.tsx",
];

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (/\.(tsx?|jsx?|css|html)$/.test(entry)) {
      scan(full);
    }
  }
}

function scan(file) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const text = readFileSync(file, "utf8");

  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    const matches = text.match(pattern);
    if (!matches) continue;
    if (SEO_ALLOWLIST.has(rel)) continue;
    violations.push(
      `  ✗ ${rel}: refererar ${label} → ${[...new Set(matches)].join(", ")}`
    );
  }
}

walk(SRC);

// Verifiera att Navbar/Footer faktiskt använder den godkända logotypen.
for (const required of REQUIRED_USAGE) {
  const full = join(ROOT, required);
  const text = readFileSync(full, "utf8");
  if (!text.includes(APPROVED_LOGO)) {
    violations.push(
      `  ✗ ${required}: använder inte godkänd logotyp (${APPROVED_LOGO})`
    );
  }
}

if (violations.length > 0) {
  console.error("\n✗ Logotyp-kontroll misslyckades:\n");
  console.error(violations.join("\n"));
  console.error(
    `\nTillåten visuell logotyp: ${APPROVED_LOGO}` +
      `\nGamla filer får endast användas i SEO-metadata: ${[...SEO_ALLOWLIST].join(", ")}\n`
  );
  process.exit(1);
}

console.log(`✓ Logotyp-kontroll OK (godkänd: ${APPROVED_LOGO})`);
