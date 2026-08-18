// Genererar d365.se-analys (ai_summary_full, best_fit_for, ai_tags) för publicerade partners.
// Kör: node scripts/generate-partner-ai-insights.mjs
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = Object.fromEntries(
  readFileSync(join(__dirname, "..", ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")])
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SYSTEM = `Du är en senior, köparsidig rådgivare på d365.se som skriver neutrala analyser av Microsoft Dynamics 365-partners.
Regler:
- Skriv på svenska, i tredje person, sakligt och utan säljjargong eller superlativ.
- Använd ALDRIG ordet "oberoende".
- Grunda allt i det underlag du får. Om underlaget är tunt: skriv "Tillgängligt underlag pekar mot ..." i stället för att hitta på.
- Nämn bara de Dynamics 365-applikationer som faktiskt framgår av underlaget. Nämn aldrig Power Platform som eget produktområde.
- Ingen emoji, inga rubriker, inga punktlistor i löptext.`;

const SCHEMA = {
  name: "partner_analysis",
  description: "Neutral d365.se-analys av en Dynamics 365-partner",
  parameters: {
    type: "object",
    properties: {
      ai_summary_full: {
        type: "string",
        description:
          "4-6 stycken löpande text (separerade med \\n) som beskriver partnerns produktfokus, typiska kunder, branscherfarenhet, arbetssätt genom livscykeln, teknisk kompetens och AI/Copilot-kompetens. 1200-2000 tecken.",
      },
      best_fit_for: {
        type: "array",
        description: "6-8 konkreta punkter om vilka organisationer partnern passar bäst för. Varje punkt är en fullständig mening.",
        items: { type: "string" },
      },
      ai_tags: {
        type: "array",
        description: "15-25 korta taggar: applikationer, branscher, projekttyper, tekniker. Inga meningar.",
        items: { type: "string" },
      },
    },
    required: ["ai_summary_full", "best_fit_for", "ai_tags"],
    additionalProperties: false,
  },
};

async function callAI(prompt) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const resp = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        tools: [{ type: "function", function: SCHEMA }],
        tool_choice: { type: "function", function: { name: "partner_analysis" } },
      }),
    });
    if (resp.status === 429 || resp.status >= 500) {
      await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
      continue;
    }
    if (!resp.ok) throw new Error(`AI gateway ${resp.status}: ${await resp.text()}`);
    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("Inget tool-call i svaret");
    return JSON.parse(call.function.arguments);
  }
  throw new Error("Rate limit efter flera försök");
}

const PRODUCT_LABELS = {
  bc: "Dynamics 365 Business Central",
  fsc: "Dynamics 365 Finance & Supply Chain Management",
  crm: "Dynamics 365 Sales, Customer Service, Field Service & Customer Insights",
  sales: "Dynamics 365 Sales",
  service: "Dynamics 365 Customer Service",
  fieldservice: "Dynamics 365 Field Service",
  marketing: "Dynamics 365 Customer Insights",
  commerce: "Dynamics 365 Commerce",
  hr: "Dynamics 365 Human Resources",
  projops: "Dynamics 365 Project Operations",
  contactcenter: "Dynamics 365 Contact Center",
};

function buildPrompt(p) {
  const pf = p.product_filters || {};
  const productBlocks = Object.entries(pf)
    .filter(([, v]) => v && typeof v === "object")
    .map(([k, v]) => {
      const lines = [`### ${PRODUCT_LABELS[k] || k}`];
      if (v.industries?.length) lines.push(`Branscher: ${v.industries.join(", ")}`);
      if (v.secondaryIndustries?.length) lines.push(`Sekundära branscher: ${v.secondaryIndustries.join(", ")}`);
      if (v.companySize?.length) lines.push(`Kundstorlek (anställda): ${v.companySize.join(", ")}`);
      if (v.revenue?.length) lines.push(`Kundomsättning: ${v.revenue.join(", ")}`);
      if (v.productDescription) lines.push(`Beskrivning: ${v.productDescription}`);
      if (v.whyChoose) lines.push(`Varför välja dem: ${v.whyChoose}`);
      if (v.keyPoints) lines.push(`Nyckelpunkter: ${v.keyPoints}`);
      if (v.competencies?.length) lines.push(`Kompetenser: ${v.competencies.join(", ")}`);
      if (v.customerExamples?.length)
        lines.push(
          `Kundexempel: ${v.customerExamples
            .map((c) => (typeof c === "string" ? c : `${c.name || ""} ${c.description || ""}`.trim()))
            .join(" | ")}`
        );
      if (v.deliveryProfile)
        lines.push(
          `Leveransprofil: ${Object.entries(v.deliveryProfile)
            .filter(([, t]) => typeof t === "string" && t.trim())
            .map(([kk, t]) => `${kk}: ${t}`)
            .join(" | ")}`
        );
      return lines.join("\n");
    });

  const ai = p.ai_profile || {};
  const aiLines = Object.entries(ai)
    .filter(([k, v]) => !k.startsWith("card_") && v && (typeof v === "string" ? v.trim() : true))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : v}`);

  return `Analysera följande Dynamics 365-partner och producera en neutral d365.se-analys.

Partner: ${p.name}
Företagsbeskrivning: ${p.description || "-"}
Positionering (partnerns egen): ${p.positioning_statement || "-"}
Applikationer: ${(p.applications || []).join(", ") || "-"}
Branscher: ${(p.industries || []).join(", ") || "-"}
Kundstorlek: ${(p.company_size || []).join(", ") || "-"}
Geografi: ${Array.isArray(p.geography) ? p.geography.join(", ") : p.geography || "-"}
Kontor: ${(p.office_cities || []).join(", ") || "-"}
Lokalt team i Sverige: ${p.team_size_sweden || "-"}
Genomförda implementationer: ${JSON.stringify(p.implementations_per_app || p.implementations_done || "-")}
Plattformskompetenser: ${(p.platform_competencies || []).join(", ") || "-"}
Branschappar: ${JSON.stringify(p.industry_apps || "-")}
Redan formulerat "mindre lämplig för": ${(p.not_a_fit || []).join(" | ") || "-"}

Produktområden:
${productBlocks.join("\n\n") || "-"}

AI-profil:
${aiLines.join("\n") || "-"}

Skriv analysen nu. best_fit_for ska vara konsekvent med produktområden, branscher och kundstorlekar ovan.`;
}

const esc = (s) => String(s).replace(/'/g, "''");
const arr = (a) => `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;

async function main() {
  const only = process.argv.slice(2);
  const { data: partners, error } = await supabase.from("partners").select("*").eq("is_featured", true).order("name");
  if (error) throw error;

  const targets = partners.filter(
    (p) => (only.length ? only.includes(p.name) : !(p.ai_summary_full || "").trim())
  );
  console.log(`Genererar för ${targets.length} partners`);

  const statements = [];
  for (const p of targets) {
    try {
      const out = await callAI(buildPrompt(p));
      statements.push(
        `UPDATE partners SET ai_summary_full = '${esc(out.ai_summary_full)}', best_fit_for = ${arr(
          out.best_fit_for
        )}, ai_tags = ${arr(out.ai_tags)} WHERE id = '${p.id}';`
      );
      console.log(`OK ${p.name} (${out.ai_summary_full.length} tecken, ${out.best_fit_for.length} punkter, ${out.ai_tags.length} taggar)`);
    } catch (e) {
      console.error(`FEL ${p.name}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  const path = join(__dirname, "partner-ai-insights-update.sql");
  writeFileSync(path, statements.join("\n") + "\n");
  console.log(`Skrev ${statements.length} UPDATE-satser till ${path}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
