#!/usr/bin/env node
/**
 * Ping IndexNow (Bing, Yandex, Seznam) with all URLs from the generated sitemap.
 * Run after deploy. Google does not support IndexNow but accepts sitemap in robots.txt.
 *
 * Notes:
 * - Google deprecated /ping?sitemap= in June 2023 — do not call it.
 * - IndexNow accepts up to 10 000 URLs per request.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

const HOST = 'd365.se';
const KEY = '1ee300110a6717b5dec524f828e978f2';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = resolve(process.cwd(), 'dist/sitemap.xml');
const DIST_DIR = resolve(process.cwd(), 'dist');

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function fetchXml(url) {
  // Prefer local file in dist/ to avoid network + pre-deploy stale content.
  const filename = url.split('/').pop();
  try {
    return readFileSync(resolve(DIST_DIR, filename), 'utf-8');
  } catch {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch {/* ignore */}
    return '';
  }
}

async function main() {
  let xml;
  try {
    xml = readFileSync(SITEMAP_PATH, 'utf-8');
  } catch (err) {
    console.error(`❌ Could not read sitemap at ${SITEMAP_PATH}: ${err.message}`);
    process.exit(0); // do not fail the deploy
  }

  // If root is a sitemap index, expand into all child sitemaps' <loc> entries.
  let urls = [];
  if (/<sitemapindex\b/.test(xml)) {
    const childSitemaps = extractLocs(xml);
    for (const s of childSitemaps) {
      const childXml = await fetchXml(s);
      urls.push(...extractLocs(childXml));
    }
  } else {
    urls = extractLocs(xml);
  }
  urls = [...new Set(urls)];

  // Skicka bara produktions-URL:er. Preview-byggen ska aldrig pinga sökmotorerna.
  urls = urls.filter((u) => u.startsWith(`https://${HOST}/`) || u === `https://${HOST}`);

  if (urls.length === 0) {
    console.warn('⚠️  No production URLs (https://d365.se) in sitemap — skipping IndexNow ping.');
    return;
  }

  console.log(`📡 Pinging IndexNow with ${urls.length} URLs…`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200 = accepted, 202 = accepted (validation pending), both fine
    if (res.ok || res.status === 202) {
      console.log(`✅ IndexNow accepted ${urls.length} URLs (HTTP ${res.status})`);
    } else {
      const text = await res.text().catch(() => '');
      console.warn(`⚠️  IndexNow returned HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
  } catch (err) {
    console.warn(`⚠️  IndexNow request failed: ${err.message}`);
  }
}

main();
