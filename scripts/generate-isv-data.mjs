import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Only public presentation fields; never snapshot contacts or internal analysis.
const fields = 'solution_id,name,vendor,vendor_slug,short_description,category,type,tier,tags,industries,geo,what,use_cases,when_fits,combos,products,industry_focus,partner_slugs,vendor_website,logo_url,delivery_model,best_for,considerations,information_status,last_verified_date,premium_product,demo_video_url,customer_cases,product_gallery,product_features,integration_evidence,partner_evidence,is_published,updated_at';
let local = {};
try {
  for (const line of readFileSync(resolve('.env'), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match) local[match[1]] = match[2];
  }
} catch { /* environment may supply the configuration */ }
const env = { ...local, ...process.env };
const base = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!base || !key) throw new Error('ISV snapshot configuration missing');
const headers = { apikey: key, Authorization: `Bearer ${key}` };
const read = async (path) => {
  const response = await fetch(`${base}/rest/v1/${path}`, { headers });
  if (!response.ok) throw new Error(`ISV snapshot unavailable (${response.status})`);
  return response.json();
};
const [products, vendors, overrides, facts] = await Promise.all([
  read(`isv_solutions?select=${fields}&is_published=eq.true&order=name.asc&limit=10000`),
  read('isv_vendors?select=slug,name,website,description,logo_url,information_status,last_verified_date&publication_status=eq.published'),
  read('isv_solution_overrides_public?select=solution_id,short_description,what,when_fits,use_cases,combos,products,industries,partner_slugs,vendor_name,vendor_website,vendor_updated_at'),
  read('rpc/public_isv_product_facts'),
]);
if (!Array.isArray(products) || !products.length) throw new Error('Refusing empty ISV snapshot');
writeFileSync(resolve('src/data/isvPublicSnapshot.json'), JSON.stringify({ products, vendors, overrides, facts }, null, 2) + '\n');
console.log(`ISV public snapshot: ${products.length} products, ${vendors.length} vendors`);