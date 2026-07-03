import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !LOVABLE_API_KEY) {
  console.error("Missing SUPABASE_URL, SUPABASE_ANON_KEY, or LOVABLE_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM = `Du är en seniorrådgivare som skriver korta, köparorienterade sammanfattningar för D365-partnerkort.
Regler:
- Max 1 mening, 12-18 ord.
- Neutral ton, ingen säljjargong, inga superlativ.
- Använd inte ordet "oberoende".
- Fokusera på vad partnern gör, inom vilka produkter och för vilken typ av kund/bransch.
- Skriv i tredje person.
- Exempel: "Specialist på kundrelationer, service och processer inom livsmedelsindustrin." och "Stark inom internationella ERP- och logistikprojekt i Dynamics 365."`;

function locationLabel(geography) {
  const geos = Array.isArray(geography) ? geography : geography ? [geography] : [];
  if (geos.includes("Globalt") || geos.includes("Europa") || geos.includes("Internationellt") || geos.includes("Övriga världen")) return "Norden +";
  if (geos.includes("Norden")) return "Norden";
  if (geos.includes("Sverige")) return "Sverige";
  return geos[0] || "Sverige";
}

function productFocusLabel(p) {
  const pf = p.product_filters || {};
  const keys = Object.keys(pf).filter((k) => !!pf[k]);
  const hasCommerce = (p.applications || []).some((a) => /commerce/i.test(a));
  let crmLabel = null;
  if (keys.includes("sales") && keys.includes("service")) crmLabel = "CRM, Service & Fältservice";
  else if (keys.includes("sales")) crmLabel = "CRM & Sales";
  else if (keys.includes("service")) crmLabel = "Service & Fältservice";
  else if (keys.includes("crm")) crmLabel = "CRM";
  const labels = [];
  if (crmLabel) labels.push(crmLabel);
  if (keys.includes("fsc") || keys.includes("bc")) {
    if (keys.includes("bc") && !keys.includes("fsc")) labels.push(hasCommerce ? "Business Central & Commerce" : "Business Central");
    else if (keys.includes("fsc")) labels.push(hasCommerce ? "ERP, Supply Chain & Commerce" : "ERP & Supply Chain");
  }
  if (labels.length === 0) return (p.applications || []).slice(0, 3).join(" & ") || "Dynamics 365";
  return labels.join(" & ");
}

function shortenIndustry(name) {
  const map = {
    "Tillverkningsindustri": "Tillverkning",
    "Livsmedel & Processindustri": "Livsmedel",
    "Jordbruk & Skogsbruk": "Jordbruk",
    "Hälsa- & sjukvård": "Hälsa & sjukvård",
    "Life Science / Medtech": "Life Science",
    "Non-profit / Organisationer": "Non-profit",
    "Uthyrningsverksamhet": "Uthyrning",
    "Mode, Sport & Textil": "Mode & textil",
  };
  return map[name] || name;
}

function industriesLabel(p) {
  const filters = Object.values(p.product_filters || {}).filter(Boolean);
  const all = [];
  for (const f of filters) {
    for (const i of f.industries || []) if (!all.includes(i)) all.push(i);
  }
  for (const i of p.industries || []) if (!all.includes(i)) all.push(i);
  return all.slice(0, 2).map(shortenIndustry).join(" & ");
}

function sizeLabel(p) {
  const filters = Object.values(p.product_filters || {}).filter(Boolean);
  const buckets = [];
  for (const f of filters) {
    for (const b of f.companySize || []) if (!buckets.includes(b)) buckets.push(b);
  }
  if (buckets.length === 0) return "Alla storlekar";
  const hasSmall = buckets.some((b) => ["1-49", "50-99", "100-249"].includes(b));
  const hasMid = buckets.some((b) => ["250-999", "1.000-4.999"].includes(b));
  const hasLarge = buckets.some((b) => b === ">5.000");
  if ((hasSmall && hasLarge) || (hasSmall && hasMid && hasLarge)) return "SMB–Enterprise";
  if (hasMid && hasLarge) return "Midmarket–Enterprise";
  if (hasSmall && hasMid) return "SMB–Midmarket";
  if (hasSmall) return "SMB";
  if (hasMid) return "Midmarket";
  if (hasLarge) return "Enterprise";
  return "Alla storlekar";
}

async function callAI(prompt) {
  const resp = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) throw new Error(`AI gateway ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  let text = (data?.choices?.[0]?.message?.content || "").trim();
  text = text.replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim();
  return text;
}

async function main() {
  const { data: partners, error } = await supabase.from("partners").select("*").eq("is_featured", true);
  if (error) throw error;
  if (!partners || partners.length === 0) {
    console.log("No featured partners found");
    return;
  }

  const results = [];
  for (const p of partners) {
    const filters = Object.values(p.product_filters || {}).filter(Boolean);
    const first = filters[0] || {};
    const productDescription = first.productDescription || p.description || "";
    const whyChoose = first.whyChoose || "";
    const prompt = `Skriv en kort, köparorienterad AI-sammanfattning för partnerkortet på en partnerlista. Sammanfattningen ska ersätta en lång produktbeskrivning.
Partner: ${p.name}
Produktområden: ${productFocusLabel(p)}
Branscher: ${industriesLabel(p)}
Geografi: ${locationLabel(p.geography)}
Storlek: ${sizeLabel(p)}
Produktbeskrivning: ${productDescription}
${whyChoose ? "Varför välja dem: " + whyChoose : ""}
Skriv sammanfattningen nu:`;

    try {
      const summary = await callAI(prompt);
      results.push({ id: p.id, name: p.name, summary });
      console.log(`✅ ${p.name}: ${summary}`);
    } catch (err) {
      console.error(`❌ ${p.name}: ${err.message}`);
      results.push({ id: p.id, name: p.name, error: err.message });
    }
  }

  const sql = results
    .filter((r) => r.summary)
    .map(
      (r) =>
        `UPDATE partners SET ai_profile = COALESCE(ai_profile, '{}'::jsonb) || jsonb_build_object('card_ai_summary', '${r.summary.replace(/'/g, "''")}', 'card_ai_summary_generated_at', now()) WHERE id = '${r.id}';`
    )
    .join("\n");

  const sqlPath = join(__dirname, "card-summaries-update.sql");
  writeFileSync(sqlPath, sql + "\n");
  console.log(`\nWrote SQL to ${sqlPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
