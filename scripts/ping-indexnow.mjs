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

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  let xml;
  try {
    xml = readFileSync(SITEMAP_PATH, 'utf-8');
  } catch (err) {
    console.error(`❌ Could not read sitemap at ${SITEMAP_PATH}: ${err.message}`);
    process.exit(0); // do not fail the deploy
  }

  const urls = extractUrls(xml);
  if (urls.length === 0) {
    console.warn('⚠️  No URLs found in sitemap — nothing to ping.');
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
