import { writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://d365.se";
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/crm/", changefreq: "monthly", priority: "0.9" },
  { path: "/businesscentral/", changefreq: "monthly", priority: "0.9" },
  { path: "/businesscentral/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/finance-supply-chain/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365customerservice/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365marketing/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365contactcenter/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365fieldservice/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/businesscentral/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365sales/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365sales/matchningstest/resultat/", changefreq: "monthly", priority: "0.6" },
  { path: "/d365customerservice/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365customerservice/matchningstest/resultat/", changefreq: "monthly", priority: "0.6" },
  { path: "/d365marketing/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365marketing/matchningstest/resultat/", changefreq: "monthly", priority: "0.6" },
  { path: "/d365fieldservice/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365fieldservice/matchningstest/resultat/", changefreq: "monthly", priority: "0.6" },
  { path: "/d365contactcenter/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365contactcenter/matchningstest/resultat/", changefreq: "monthly", priority: "0.6" },
  { path: "/d365sales/roi-kalkylator/", changefreq: "monthly", priority: "0.7" },
  { path: "/finance-supply-chain/", changefreq: "monthly", priority: "0.8" },
  { path: "/finance-supply-chain-management/matchningstest/", changefreq: "monthly", priority: "0.7" },
  { path: "/erp/", changefreq: "monthly", priority: "0.9" },
  { path: "/affarssystem/", changefreq: "monthly", priority: "0.9" },
  { path: "/copilot/", changefreq: "monthly", priority: "0.8" },
  { path: "/agents/", changefreq: "monthly", priority: "0.8" },
  { path: "/aioversikt/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-readiness/", changefreq: "monthly", priority: "0.8" },
  { path: "/qa/", changefreq: "weekly", priority: "0.7" },
  { path: "/kontakt/", changefreq: "monthly", priority: "0.7" },
  { path: "/valjdynamics365partner/", changefreq: "weekly", priority: "0.9" },
  { path: "/alla-d365-partners/", changefreq: "monthly", priority: "0.6" },
  { path: "/partners-per-bransch/", changefreq: "weekly", priority: "0.7" },
  { path: "/ERPbehovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/CRMbehovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/kundservice-behovsanalys/", changefreq: "monthly", priority: "0.8" },
  { path: "/beslutsmognad/", changefreq: "monthly", priority: "0.7" },
  { path: "/kom-igang/", changefreq: "monthly", priority: "0.8" },
  { path: "/branscher/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365sales/", changefreq: "monthly", priority: "0.8" },
  { path: "/business-central-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/dynamics-365-sales-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/dynamics-365-marketing-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365marketing/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365customerservice/", changefreq: "monthly", priority: "0.8" },
  { path: "/dynamics-365-customer-service-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365fieldservice/", changefreq: "monthly", priority: "0.8" },
  { path: "/dynamics-365-field-service-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365contactcenter/", changefreq: "monthly", priority: "0.8" },
  { path: "/dynamics-365-contact-center-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/dynamics-365-ai-copilot-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/finance-supply-chain-partners-sverige/", changefreq: "monthly", priority: "0.7" },
  { path: "/d365projectoperations/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365commerce/", changefreq: "monthly", priority: "0.8" },
  { path: "/d365humanresources/", changefreq: "monthly", priority: "0.8" },
  { path: "/kunskapscenter/", changefreq: "weekly", priority: "0.8" },
  { path: "/kunskapscenter/business-central/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/finance-supply-chain/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/sales/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/customer-service/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/copilot/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/upphandling/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/partners/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/upphandlingsresan/", changefreq: "monthly", priority: "0.7" },
  { path: "/kunskapscenter/business-central-tillagg/", changefreq: "weekly", priority: "0.7" },
  { path: "/kunskapscenter/business-central-tillagg/katalog/", changefreq: "weekly", priority: "0.6" },
  { path: "/kunskapscenter/dynamics-365-tillagg/", changefreq: "weekly", priority: "0.7" },
  { path: "/upphandlingsguiden/", changefreq: "monthly", priority: "0.8" },
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
  { path: "/om-thomas-laine/", changefreq: "yearly", priority: "0.5" },
  { path: "/om-michael-uhman/", changefreq: "yearly", priority: "0.5" },
  { path: "/priser/", changefreq: "monthly", priority: "0.8" },
  { path: "/kostnad/", changefreq: "monthly", priority: "0.8" },
  { path: "/implementationskalkylator/", changefreq: "monthly", priority: "0.8" },
  { path: "/partners-sitemap/", changefreq: "weekly", priority: "0.5" },
  { path: "/jamfor-partners/", changefreq: "monthly", priority: "0.7" },
  { path: "/partnernytt/", changefreq: "daily", priority: "0.8" },
  { path: "/jamfor/", changefreq: "monthly", priority: "0.7" },
  { path: "/dataskydd/", changefreq: "yearly", priority: "0.5" },
  { path: "/friskrivning/", changefreq: "yearly", priority: "0.5" },
];

function readText(p) {
  try { return readFileSync(resolve(p), "utf8"); } catch { return ""; }
}
function mtimeISO(p) {
  try { return statSync(resolve(p)).mtime.toISOString().slice(0, 10); } catch { return TODAY; }
}
function maxMtime(paths) {
  const dates = paths.map((p) => {
    try { return statSync(resolve(p)).mtime.getTime(); } catch { return 0; }
  });
  const m = Math.max(0, ...dates);
  return m ? new Date(m).toISOString().slice(0, 10) : TODAY;
}
function uniqueSlugs(content) {
  const slugs = new Set();
  for (const m of content.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1]);
  return [...slugs];
}

// ---- Build entry lists per sub-sitemap ----

// Pages (static + tool)
const pagesLastmod = maxMtime([
  "src/App.tsx",
  "src/pages/Index.tsx",
  "src/pages/BusinessCentral.tsx",
  "src/pages/BcRoiCalculator.tsx",
  "src/pages/SalesRoiCalculator.tsx",
  "src/pages/BcMatchningstest.tsx",
]);
const pagesEntries = STATIC_ROUTES.map((e) => ({ ...e, lastmod: pagesLastmod }));

// Industries
const industrySrc = "src/data/standardIndustries.ts";
const industryLastmod = mtimeISO(industrySrc);
const industryEntries = uniqueSlugs(readText(industrySrc)).map((slug) => ({
  path: `/branscher/${slug}/`,
  changefreq: "monthly",
  priority: "0.7",
  lastmod: industryLastmod,
}));

// Articles (deep-dive + blog)
const blogSrc = "src/data/blogArticles.tsx";
const blogLastmod = mtimeISO(blogSrc);
const blogEntries = uniqueSlugs(readText(blogSrc)).map((slug) => ({
  path: `/artiklar/${slug}/`,
  changefreq: "monthly",
  priority: "0.6",
  lastmod: blogLastmod,
}));

const articleFiles = readdirSync("src/data").filter(
  (f) => /Articles\.tsx$/.test(f) && f !== "blogArticles.tsx"
);
const deepDiveEntries = [];
const seenDeep = new Set();
let deepLastmodMs = 0;
for (const f of articleFiles) {
  const full = `src/data/${f}`;
  try { deepLastmodMs = Math.max(deepLastmodMs, statSync(resolve(full)).mtime.getTime()); } catch {}
  const src = readText(full);
  const blocks = src.split(/\{\s*\n/);
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
const deepLastmod = deepLastmodMs ? new Date(deepLastmodMs).toISOString().slice(0, 10) : TODAY;
deepDiveEntries.forEach((e) => (e.lastmod = deepLastmod));
const articlesLastmod = blogLastmod > deepLastmod ? blogLastmod : deepLastmod;
const articleEntries = [...deepDiveEntries, ...blogEntries];

// Partners
const partnerRoutesSrc = "src/data/partnerRoutes.json";
const partnersLastmod = mtimeISO(partnerRoutesSrc);
const partners = JSON.parse(readText(partnerRoutesSrc));
const partnerEntries = partners.map((p) => ({
  path: `/partner/${p.slug}/`,
  changefreq: "monthly",
  priority: "0.6",
  lastmod: partnersLastmod,
}));

// Basic partners: fetch slugs live from Supabase (observed data only)
function loadEnvFile() {
  try {
    const txt = readFileSync(resolve(".env"), "utf8");
    const out = {};
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch { return {}; }
}
const _env = { ...loadEnvFile(), ...process.env };
const _supaUrl = _env.VITE_SUPABASE_URL;
const _supaKey = _env.VITE_SUPABASE_PUBLISHABLE_KEY;
let basicPartnerEntries = [];
if (_supaUrl && _supaKey) {
  try {
    const res = await fetch(
      `${_supaUrl}/rest/v1/partners_basic_public?select=slug,updated_at&order=name.asc`,
      { headers: { apikey: _supaKey, Authorization: `Bearer ${_supaKey}` } },
    );
    if (res.ok) {
      const rows = await res.json();
      basicPartnerEntries = (rows || [])
        .filter((r) => r && r.slug)
        .map((r) => ({
          path: `/basic/${r.slug}/`,
          changefreq: "monthly",
          priority: "0.4",
          lastmod: (r.updated_at || "").slice(0, 10) || TODAY,
        }));
    }
  } catch (e) {
    console.warn(`[sitemap] basic partners fetch failed: ${e.message}`);
  }
}
const allPartnerEntries = [...partnerEntries, ...basicPartnerEntries];

// Event-detaljsidor (approved) från databasen
let eventEntries = [];
if (_supaUrl && _supaKey) {
  try {
    const res = await fetch(
      `${_supaUrl}/rest/v1/partner_events?select=id,updated_at&status=eq.approved&order=event_date.desc`,
      { headers: { apikey: _supaKey, Authorization: `Bearer ${_supaKey}` } },
    );
    if (res.ok) {
      const rows = await res.json();
      eventEntries = (rows || [])
        .filter((r) => r && r.id)
        .map((r) => ({
          path: `/events/${r.id}/`,
          changefreq: "weekly",
          priority: "0.5",
          lastmod: (r.updated_at || "").slice(0, 10) || TODAY,
        }));
    }
  } catch (e) {
    console.warn(`[sitemap] events fetch failed: ${e.message}`);
  }
}

// Jämför (ERP comparisons)
const jamforSrc = "src/data/erpComparisons.ts";
const jamforLastmod = mtimeISO(jamforSrc);
const jamforSlugs = [...readText(jamforSrc).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const jamforEntries = jamforSlugs.map((slug) => ({
  path: `/jamfor/${slug}/`,
  changefreq: "monthly",
  priority: "0.7",
  lastmod: jamforLastmod,
}));

// ---- XML helpers ----
function urlset(entries) {
  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${e.lastmod || TODAY}</lastmod>`,
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

function sitemapindex(items) {
  const blocks = items.map((it) =>
    [
      "  <sitemap>",
      `    <loc>${BASE_URL}/${it.file}</loc>`,
      `    <lastmod>${it.lastmod}</lastmod>`,
      "  </sitemap>",
    ].join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...blocks,
    `</sitemapindex>`,
    "",
  ].join("\n");
}

// ---- Write sub-sitemaps + index ----
const eventsLastmod = eventEntries.reduce(
  (max, e) => (e.lastmod > max ? e.lastmod : max),
  TODAY,
);
const groups = [
  { file: "sitemap-pages.xml", entries: pagesEntries, lastmod: pagesLastmod },
  { file: "sitemap-branscher.xml", entries: industryEntries, lastmod: industryLastmod },
  { file: "sitemap-articles.xml", entries: articleEntries, lastmod: articlesLastmod },
  { file: "sitemap-partners.xml", entries: allPartnerEntries, lastmod: partnersLastmod },
  { file: "sitemap-jamfor.xml", entries: jamforEntries, lastmod: jamforLastmod },
  { file: "sitemap-events.xml", entries: eventEntries, lastmod: eventsLastmod },
];

let total = 0;
for (const g of groups) {
  writeFileSync(resolve(`public/${g.file}`), urlset(g.entries));
  total += g.entries.length;
}
writeFileSync(
  resolve("public/sitemap.xml"),
  sitemapindex(groups.map((g) => ({ file: g.file, lastmod: g.lastmod })))
);

console.log(
  `sitemap index written with ${groups.length} sub-sitemaps (${total} URLs total).`
);
