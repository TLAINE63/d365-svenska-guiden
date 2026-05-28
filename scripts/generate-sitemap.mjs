#!/usr/bin/env node
/**
 * Generates public/sitemap.xml with all indexable, canonical URLs.
 *
 * Sources:
 *  - Static canonical routes (manual list, mirrors src/App.tsx non-Navigate routes)
 *  - Dynamic partners from src/data/partnerRoutes.json
 *  - Dynamic industries from src/data/standardIndustries.ts (regex-parsed)
 *  - Dynamic deep-dive articles from src/data/*Articles.tsx (regex-parsed)
 *  - Blog articles from src/data/blogArticles.tsx (regex-parsed)
 *
 * Convention: trailing slash on every URL (matches site-wide canonical convention).
 * Runs via predev/prebuild.
 */
import { writeFileSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://d365.se";
const TODAY = new Date().toISOString().slice(0, 10);

/** Static canonical routes (public, indexable). Exclude redirects, admin, partner-internal, AI search, dataskydd noindex. */
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/crm/", changefreq: "monthly", priority: "0.9" },
  { path: "/businesscentral/", changefreq: "monthly", priority: "0.9" },
  { path: "/finance-supply-chain/", changefreq: "monthly", priority: "0.8" },
  { path: "/erp/", changefreq: "monthly", priority: "0.9" },
  { path: "/affarssystem/", changefreq: "monthly", priority: "0.9" },
  { path: "/copilot/", changefreq: "monthly", priority: "0.8" },
  { path: "/agents/", changefreq: "monthly", priority: "0.8" },
  { path: "/aioversikt/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-readiness/", changefreq: "monthly", priority: "0.8" },
  { path: "/qa/", changefreq: "weekly", priority: "0.7" },
  { path: "/kontakt/", changefreq: "monthly", priority: "0.7" },
  { path: "/valjdynamics365partner/", changefreq: "weekly", priority: "0.9" },
  { path: "/ERPbehovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/CRMbehovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/kundservice-behovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/kom-igang/", changefreq: "monthly", priority: "0.8" },
  { path: "/branscher/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365sales/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365marketing/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365customerservice/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365fieldservice/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365contactcenter/", changefreq: "monthly", priority: "0.8" },
  { path: "/kunskapscenter/", changefreq: "weekly", priority: "0.8" },
  { path: "/kunskapscenter/upphandlingsresan/", changefreq: "monthly", priority: "0.7" },
  { path: "/kunskapscenter/video/byta-affarssystem/", changefreq: "monthly", priority: "0.6" },
  { path: "/kunskapscenter/video/crm-affarssystem-byte/", changefreq: "monthly", priority: "0.6" },
  { path: "/kunskapscenter/video/inspirerad-personal/", changefreq: "monthly", priority: "0.6" },
  { path: "/kunskapscenter/video/partners-skillnader/", changefreq: "monthly", priority: "0.6" },
  { path: "/events/", changefreq: "weekly", priority: "0.7" },
  { path: "/kravspecifikation/", changefreq: "monthly", priority: "0.7" },
  { path: "/kravspecifikation-sales/", changefreq: "monthly", priority: "0.7" },
  { path: "/kravspecifikation-marketing/", changefreq: "monthly", priority: "0.7" },
  { path: "/kravspecifikation-kundservice/", changefreq: "monthly", priority: "0.7" },
  { path: "/agande-och-intressen/", changefreq: "yearly", priority: "0.5" },
];

function readText(p) {
  try { return readFileSync(resolve(p), "utf8"); } catch { return ""; }
}

function uniqueSlugs(content) {
  const slugs = new Set();
  for (const m of content.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1]);
  return [...slugs];
}

// Partners
const partners = JSON.parse(readText("src/data/partnerRoutes.json"));
const partnerEntries = partners.map((p) => ({
  path: `/partner/${p.slug}/`,
  changefreq: "monthly",
  priority: "0.6",
}));

// Industries
const industrySrc = readText("src/data/standardIndustries.ts");
const industryEntries = uniqueSlugs(industrySrc).map((slug) => ({
  path: `/branscher/${slug}/`,
  changefreq: "monthly",
  priority: "0.7",
}));

// Blog articles
const blogSrc = readText("src/data/blogArticles.tsx");
const blogEntries = uniqueSlugs(blogSrc).map((slug) => ({
  path: `/artiklar/${slug}/`,
  changefreq: "monthly",
  priority: "0.6",
}));

// Deep-dive articles: each *Articles.tsx file (except blog) has objects with slug + productSlug
const articleFiles = readdirSync("src/data").filter(
  (f) => /Articles\.tsx$/.test(f) && f !== "blogArticles.tsx"
);
const deepDiveEntries = [];
const seenDeep = new Set();
for (const f of articleFiles) {
  const src = readText(`src/data/${f}`);
  // Match each article block: capture slug & nearest productSlug
  const blocks = src.split(/\{\s*\n/); // crude per-object split
  for (const b of blocks) {
    const slug = b.match(/slug:\s*"([^"]+)"/)?.[1];
    const productSlug = b.match(/productSlug:\s*"([^"]+)"/)?.[1];
    if (slug && productSlug) {
      const key = `${productSlug}/${slug}`;
      if (!seenDeep.has(key)) {
        seenDeep.add(key);
        deepDiveEntries.push({
          path: `/kunskapscenter/${productSlug}/${slug}/`,
          changefreq: "monthly",
          priority: "0.6",
        });
      }
    }
  }
}

const entries = [
  ...STATIC_ROUTES,
  ...industryEntries,
  ...deepDiveEntries,
  ...blogEntries,
  ...partnerEntries,
];

function xml(entries) {
  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${TODAY}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ].filter(Boolean).join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), xml(entries));
console.log(`sitemap.xml written: ${entries.length} URLs (static=${STATIC_ROUTES.length}, industries=${industryEntries.length}, deep-dive=${deepDiveEntries.length}, blog=${blogEntries.length}, partners=${partnerEntries.length})`);
