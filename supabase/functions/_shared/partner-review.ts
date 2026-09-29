// Partner Review Queue (BizApps). Datakvalitet och partnerverifiering.
// Ingen AI, ingen ranking, ingen matchning. Förifyllning = explicita textregler.
// Se docs/PARTNER-REVIEW-QUEUE.md.
//
// Granskningen är generaliserad per produktområde (bc, fsc, sales, service).
// Ett område kan spänna flera produkter (F&SCM = finance + supply-chain):
// alternativ speglas per produkt med identiska nycklar och raderas/bekräftas
// över alla profiler i gruppen; tillägg skrivs till primärprofilen.

export const REVIEW_DIMENSIONS = ["migration", "competency", "project_type", "delivery_model", "capability"] as const;
export const CAPABILITY_KEYS = ["power-bi", "power-platform", "copilot", "copilot-studio", "ai-agents"];

export interface ReviewProductConfig {
  key: string;
  label: string;
  profileLabel: string;
  productKeys: string[];
  primary: string;
  apps: string[];
  textSources: string[];
}

export const REVIEW_PRODUCTS: Record<string, ReviewProductConfig> = {
  bc: {
    key: "bc", label: "Business Central", profileLabel: "Business Central-profilen",
    productKeys: ["business-central"], primary: "business-central",
    apps: ["Business Central"], textSources: ["Business Central"],
  },
  fsc: {
    key: "fsc", label: "F&SCM", profileLabel: "F&SCM-profilen",
    productKeys: ["finance", "supply-chain"], primary: "finance",
    apps: ["F&SCM"], textSources: ["F&SCM"],
  },
  sales: {
    key: "sales", label: "Sales & Customer Insights", profileLabel: "CRM-profilen (Sales & Customer Insights)",
    productKeys: ["sales", "customer-insights"], primary: "sales",
    apps: ["Sales", "Customer Insights (Marketing)"], textSources: ["Sales", "Customer Insights (Marketing)"],
  },
  service: {
    key: "service", label: "Customer Service & Field Service", profileLabel: "Service-profilen (Customer Service & Field Service)",
    productKeys: ["customer-service", "field-service", "contact-center"], primary: "customer-service",
    apps: ["Customer Service", "Field Service", "Contact Center"], textSources: ["Customer Service", "Field Service", "Contact Center"],
  },
};

export function dimensionTitle(productKey: string, dim: string): string {
  const titles: Record<string, Record<string, string>> = {
    bc: { competency: "Business Central-kompetens" },
    fsc: { competency: "F&SCM-kompetens" },
    sales: { competency: "CRM-kompetens (Sales & Customer Insights)" },
    service: { competency: "Service-kompetens (Customer Service & Field Service)" },
  };
  const base: Record<string, string> = {
    migration: "Migreringserfarenhet", project_type: "Typiska projekt",
    delivery_model: "Leveransmodell", capability: "Tvärgående förmågor",
    industry_solution: "Branschlösning", base: "Grunduppgifter",
  };
  return titles[productKey]?.[dim] || base[dim] || dim;
}

// Regelbaserad förifyllning: endast tydliga, explicita formuleringar.
// Varje regel = [dimension, nyckel, regex]. Om inget matchar lämnas fältet tomt.
const MIG = (sys: string) =>
  new RegExp(`(migrer\\w*|byte|flytt\\w*|uppgrader\\w*|konverter\\w*)[^.]{0,60}\\b${sys}\\b|\\b${sys}\\b[^.]{0,60}(till|->|→)\\s*(dynamics\\s*365\\s*)?(business\\s*central|finance|supply\\s*chain|f&scm|d365)`, "i");

const BC_RULES: [string, string, RegExp][] = [
  ["migration", "nav", /\bnavision\b|\bdynamics\s+nav\b|(migrer\w*|uppgrader\w*|flytt\w*)[^.]{0,60}\bnav\b|\bnav\b[^.]{0,60}(till|->|→)\s*(dynamics\s*365\s*)?business\s*central/i],
  ["migration", "bc_onprem", /business\s*central\s*on[-\s]?prem\w*[^.]{0,60}(till|->|→)\s*(molnet|saas|online|cloud)|(on[-\s]?prem\w*)[^.]{0,40}(till|->|→)\s*(molnet|saas|cloud)/i],
  ["migration", "visma", MIG("visma")],
  ["migration", "monitor", MIG("monitor(\\s*erp)?")],
  ["migration", "pyramid", MIG("pyramid")],
  ["migration", "jeeves", MIG("jeeves")],
  ["migration", "sap_business_one", MIG("sap\\s*business\\s*one")],
  ["migration", "fortnox", MIG("fortnox")],
  ["competency", "finance_accounting", /\b(redovisning|bokslut|ekonomistyrning|ekonomifunktion)\w*/i],
  ["competency", "purchasing", /\binköp(s)?(process|flöde|hantering|avdelning)?\b/i],
  ["competency", "sales_order", /\b(orderhantering|försäljningsorder|orderflöde)\w*/i],
  ["competency", "warehouse_logistics", /\b(lagerhantering|lagerstyrning|lagerhållning|logistik|wms)\w*/i],
  ["competency", "distribution_wholesale", /\b(grossist|partihandel|distributionsföretag|distributörer)\w*/i],
  ["competency", "manufacturing", /\b(tillverkning|tillverkande|produktionsplanering|produktionsföretag)\w*/i],
  ["competency", "projects", /\b(projektverksamhet|projektredovisning|projektstyrning|projektbaserade)\w*/i],
  ["competency", "service_management", /\b(servicehantering|serviceorder|fältservice|service\s+management)\w*/i],
  ["competency", "retail_ecommerce", /\b(e-handel|ehandel|detaljhandel|retail)\w*/i],
  ["competency", "edi", /\bedi\b/i],
  ["competency", "integrations_api", /\b(integrationer|integrationsplattform|api-integration\w*)\b/i],
  ["competency", "multi_company", /\b(flerbolag\w*|koncernkonsolidering|koncernredovisning|intercompany)\b/i],
  ["competency", "international", /\b(internationell\w*\s+(verksamhet|bolag|kunder|utrullning)|flera\s+länder)\b/i],
];

const FSC_RULES: [string, string, RegExp][] = [
  ["migration", "nav", /\bnavision\b|\bdynamics\s+nav\b|(migrer\w*|uppgrader\w*|flytt\w*)[^.]{0,60}\bnav\b/i],
  ["migration", "visma", /\bvisma\b/i],
  ["migration", "monitor", /\bmonitor(\s*erp)?\b/i],
  ["migration", "pyramid", /\bpyramid\b/i],
  ["migration", "jeeves", /\bjeeves\b/i],
  ["migration", "sap_business_one", /\bsap\s*business\s*one\b/i],
  ["migration", "sap", /\bsap\b(?!\s*business\s*one)/i],
  ["migration", "oracle_netsuite", /\b(oracle|netsuite)\b/i],
  ["migration", "ifs", /\bifs\b/i],
  ["migration", "ax", /\b(dynamics\s*ax|d365\s*fo|finance\s*&\s*operations|axapta)\b/i],
  ["migration", "fortnox", /\bfortnox\b/i],
  ["competency", "finance_accounting", /\b(redovisning|bokslut|ekonomistyrning|ekonomi(modul|funktion)?|koncernkonsolidering)\w*/i],
  ["competency", "purchasing", /\binköp(s)?(process|flöde|hantering|avdelning)?\b/i],
  ["competency", "supply_chain_planning", /\b(planering|demand\s*plan|supply\s*plan|efterfrågeplanering)\w*/i],
  ["competency", "warehouse_logistics", /\b(lagerhantering|lagerstyrning|lagerhållning|logistik|wms)\w*/i],
  ["competency", "manufacturing", /\b(tillverkning|tillverkande|produktionsplanering|produktionsföretag|produktion)\w*/i],
  ["competency", "distribution_wholesale", /\b(grossist|partihandel|distributionsföretag|distributörer)\w*/i],
  ["competency", "retail_ecommerce", /\b(e-handel|ehandel|detaljhandel|retail)\w*/i],
  ["competency", "projects", /\b(projektverksamhet|projektredovisning|projektstyrning|projektbaserade)\w*/i],
  ["competency", "service_management", /\b(servicehantering|serviceorder|fältservice|service\s+management)\w*/i],
  ["competency", "sales_order", /\b(orderhantering|försäljningsorder|orderflöde)\w*/i],
  ["competency", "edi", /\bedi\b/i],
  ["competency", "integrations_api", /\b(integrationer|integrationsplattform|api-integration\w*)\b/i],
  ["competency", "multi_company", /\b(flerbolag\w*|koncernkonsolidering|koncernredovisning|intercompany)\b/i],
  ["competency", "international", /\b(internationell\w*\s+(verksamhet|bolag|kunder|utrullning)|flera\s+länder)\b/i],
];

const SALES_RULES: [string, string, RegExp][] = [
  ["migration", "salesforce", /\bsalesforce\b/i],
  ["migration", "hubspot", /\bhubspot\b/i],
  ["migration", "superoffice", /\bsuperoffice\b/i],
  ["migration", "lime", /\blime\b/i],
  ["migration", "dynamics_crm", /\bdynamics\s*crm\b/i],
  ["migration", "spreadsheets", /\b(kalkylblad|excel\s*[-(]?(listor|ark)|egna\s+listor)\b/i],
  ["competency", "sales_process", /\b(säljprocess|försäljningsprocess|pipeline|säljarbete|säljstyrning)\w*/i],
  ["competency", "forecasting", /\b(prognos|forecast|försäljningsprognos)\w*/i],
  ["competency", "quoting", /\b(offert|prislist)\w*/i],
  ["competency", "marketing", /\b(marknadsföring|kampanj|marketing|kundresa|leadshantering)\w*/i],
  ["competency", "customer_data", /\b(kunddata|segmentering|kundprofil|kundregister)\w*/i],
  ["competency", "integrations_api", /\b(integrationer|api-?integration\w*|outlook|teams)\b/i],
  ["competency", "reporting", /\b(rapportering|dashboard|säljrapport)\w*/i],
];

const SERVICE_RULES: [string, string, RegExp][] = [
  ["migration", "zendesk", /\bzendesk\b/i],
  ["migration", "freshdesk", /\bfreshdesk\b/i],
  ["migration", "salesforce_service", /\bsalesforce\b/i],
  ["migration", "dynamics_crm", /\bdynamics\s*crm\b/i],
  ["migration", "spreadsheets", /\b(kalkylblad|excel\b)/i],
  ["competency", "case_management", /\b(ärendehantering|ärenden|ärendehanteringssystem|case\s?management)\w*/i],
  ["competency", "sla_queues", /\b(sla\b|servicenivå|ärendekö\w*)/i],
  ["competency", "field_service", /\b(fältservice|arbetsorder|work\s*order|serviceanläggning\w*)\w*/i],
  ["competency", "scheduling", /\b(schemaläggning|resursplanering|bokningsflöde)\w*/i],
  ["competency", "knowledge_base", /\b(kunskapsbas|självservice|kundportal)\w*/i],
  ["competency", "omnichannel", /\b(omnikanal\w*|flera\s+kanaler|chat|kundtjänst)\w*/i],
  ["competency", "csat", /\b(kundnöjdhet|csat|nöjdhetsmätning)\w*/i],
  ["competency", "integrations_api", /\b(integrationer|api-?integration\w*)\b/i],
];

const SHARED_RULES: [string, string, RegExp][] = [
  ["project_type", "new_implementation", /\b(nyimplementation\w*|nyinförande\w*|implementationsprojekt\w*)\b/i],
  ["project_type", "migration", /\bmigrer(ing|ingar|ingsprojekt)\w*/i],
  ["project_type", "upgrade", /\buppgradering\w*/i],
  ["project_type", "maintenance_support", /\b(förvaltning|supportavtal|förvaltningsavtal)\w*/i],
  ["project_type", "rescue", /\b(rescue|räddningsprojekt)\w*/i],
  ["project_type", "international_rollout", /\b(internationell\s+utrullning|roll-?out)\b/i],
  ["delivery_model", "fixed_price_start", /\b(fast\s+pris|fastpris)\w*/i],
  ["delivery_model", "quickstart_package", /\b(snabbstart\w*|quick\s?start|startpaket)\b/i],
  ["delivery_model", "proof_of_concept", /\b(proof\s+of\s+concept|poc)\b/i],
  ["delivery_model", "phased_implementation", /\b(stegvis\w*|etappvis\w*|successiv\w*\s+(implementation|införande))\b/i],
  ["delivery_model", "maintenance_partner", /\b(förvaltningspartner|förvaltningsavtal)\b/i],
  ["delivery_model", "managed_services", /\bmanaged\s+services?\b/i],
  ["capability", "power-bi", /\bpower\s?bi\b/i],
  ["capability", "power-platform", /\b(power\s+platform|power\s+apps|power\s+automate)\b/i],
  ["capability", "copilot-studio", /\bcopilot\s+studio\b/i],
  ["capability", "copilot", /\bcopilot\b(?!\s+studio)/i],
  ["capability", "ai-agents", /\bai[-\s]agent\w*/i],
];

export const PREFILL_RULE_SETS: Record<string, [string, string, RegExp][]> = {
  bc: [...BC_RULES, ...SHARED_RULES],
  fsc: [...FSC_RULES, ...SHARED_RULES],
  sales: [...SALES_RULES, ...SHARED_RULES],
  service: [...SERVICE_RULES, ...SHARED_RULES],
};
// Bakåtkompatibelt exportnamn (BC)
export const PREFILL_RULES = PREFILL_RULE_SETS.bc;

function collectStrings(v: unknown, out: string[], depth = 0) {
  if (depth > 5 || v == null) return;
  if (typeof v === "string") { if (v.trim()) out.push(v.trim()); return; }
  if (Array.isArray(v)) { for (const x of v) collectStrings(x, out, depth + 1); return; }
  if (typeof v === "object") for (const x of Object.values(v as Record<string, unknown>)) collectStrings(x, out, depth + 1);
}

function excerpt(text: string, re: RegExp): string | null {
  const m = re.exec(text);
  if (!m) return null;
  const s = Math.max(0, m.index - 50), e = Math.min(text.length, m.index + m[0].length + 50);
  return `${s > 0 ? "…" : ""}${text.slice(s, e).replace(/\s+/g, " ").trim()}${e < text.length ? "…" : ""}`;
}

const PREFILL_PREFIX = "Förifyllt från tidigare partnerprofil: ";
const today = () => new Date().toISOString().slice(0, 10);

async function productIds(sb: any, keys: string[]): Promise<Map<string, string>> {
  const { data } = await sb.from("product_catalog").select("id, product_key").in("product_key", keys);
  return new Map((data || []).map((r: any) => [r.product_key, r.id]));
}

/** Profiler för områdets produkter. primary först, sedan övriga i cfg-ordning. */
async function getGroupProfiles(sb: any, partnerId: string, cfg: ReviewProductConfig): Promise<{ ids: string[]; byProduct: Map<string, string> }> {
  const ids = await productIds(sb, cfg.productKeys);
  const pidList = [...ids.values()];
  if (!pidList.length) return { ids: [], byProduct: new Map() };
  const { data } = await sb.from("partner_product_profiles").select("id, product_id").eq("partner_id", partnerId).in("product_id", pidList);
  const byProduct = new Map((data || []).map((p: any) => [p.product_id, p.id]));
  const ordered = cfg.productKeys.map((k) => byProduct.get(ids.get(k))).filter(Boolean) as string[];
  return { ids: ordered, byProduct };
}

async function getProfile(sb: any, partnerId: string, cfg: ReviewProductConfig, create: boolean): Promise<string | null> {
  const { ids } = await getGroupProfiles(sb, partnerId, cfg);
  if (ids.length) return ids[0];
  if (!create) return null;
  const pid = (await productIds(sb, [cfg.primary])).get(cfg.primary);
  if (!pid) return null;
  const { data: ins } = await sb.from("partner_product_profiles").insert({ partner_id: partnerId, product_id: pid }).select("id").single();
  return ins?.id ?? null;
}

export function sourceLabel(sourceType: string | null, status: string): string {
  if (sourceType === "import" || status === "legacy_import") return "Tidigare partnerprofil";
  if (sourceType === "publik_kalla" || status === "public_source") return "Publik källa";
  if (sourceType === "redaktion" || status === "editorial_verified") return "Redaktionen";
  if (sourceType === "partner" || status === "partner_verified") return "Partner";
  return "Okänd källa";
}

// Datakvalitet: confirmed = Bekräftad, partner = Partneruppgift, public = Publik källa / förifyllt
export function quality(status: string, published: boolean): "confirmed" | "partner" | "public" {
  if (published && (status === "partner_verified" || status === "editorial_verified")) return "confirmed";
  if (status === "partner_verified" || status === "editorial_verified") return "partner";
  return "public";
}

export interface ReviewItem {
  dimension: string; key: string; label: string;
  klass: "A" | "B"; quality: "confirmed" | "partner" | "public";
  source: string; excerpt: string | null; verified_at: string | null;
}

/** Klassar en partners information i A (bekräftat), B (förifyllt, kräver bekräftelse) och C (saknas) för ett produktområde. */
export async function computeReview(sb: any, partnerId: string, productKey = "bc") {
  const cfg = REVIEW_PRODUCTS[productKey];
  if (!cfg) throw new Error("Okänt produktområde");
  const { data: partner } = await sb.from("partners")
    .select("id, name, slug, applications, geography, office_cities, team_size_sweden, agreement_signed, agreement_signed_at, is_featured")
    .eq("id", partnerId).single();
  if (!partner) throw new Error("Partnern finns inte");

  const { ids: profileIds } = await getGroupProfiles(sb, partnerId, cfg);
  const products = await productIds(sb, [...cfg.productKeys, ...CAPABILITY_KEYS]);
  const groupIds = cfg.productKeys.map((k) => products.get(k)).filter(Boolean);
  const capIds = CAPABILITY_KEYS.map((k) => products.get(k)).filter(Boolean);

  const [{ data: allOpts }, { data: caps }, attrsRes, capsRes, solsRes, changesRes] = await Promise.all([
    sb.from("product_attribute_options").select("id, product_id, dimension_key, attribute_key, label, is_active").in("product_id", groupIds.length ? groupIds : ["00000000-0000-0000-0000-000000000000"]),
    sb.from("product_catalog").select("id, product_key, name").in("id", capIds.length ? capIds : ["00000000-0000-0000-0000-000000000000"]),
    profileIds.length ? sb.from("partner_product_attributes").select("*").in("partner_product_profile_id", profileIds) : Promise.resolve({ data: [] }),
    profileIds.length ? sb.from("partner_product_capabilities").select("*").in("partner_product_profile_id", profileIds) : Promise.resolve({ data: [] }),
    profileIds.length ? sb.from("partner_industry_solutions").select("*").in("profile_id", profileIds) : Promise.resolve({ data: [] }),
    profileIds.length
      ? sb.from("partner_review_changes").select("*").eq("partner_id", partnerId).in("profile_id", profileIds).in("status", ["pending", "clarification"]).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  // Alternativ deduplicerade per dimension:nyckel (speglande uppsättningar mellan gruppens produkter)
  const optIndex = new Map<string, { ids: string[]; dimension_key: string; attribute_key: string; label: string }>();
  for (const o of allOpts || []) {
    const k = `${o.dimension_key}:${o.attribute_key}`;
    if (!optIndex.has(k)) optIndex.set(k, { ids: [], dimension_key: o.dimension_key, attribute_key: o.attribute_key, label: o.label });
    optIndex.get(k)!.ids.push(o.id);
  }
  const capById = new Map((caps || []).map((c: any) => [c.id, c]));

  // Rader rankas: publicerad + partnerverifierad före övriga (deduplicering över gruppens profiler)
  const rank = (r: any) => (r.is_published ? 2 : 0) + (["partner_verified", "editorial_verified"].includes(r.verification_status) ? 1 : 0);

  const items: ReviewItem[] = [];
  const push = (dimension: string, key: string, label: string, r: any) => {
    const q = quality(r.verification_status, !!r.is_published);
    const note = typeof r.editorial_note === "string" && r.editorial_note.startsWith(PREFILL_PREFIX) ? r.editorial_note.slice(PREFILL_PREFIX.length) : null;
    items.push({ dimension, key, label, klass: q === "public" ? "B" : "A", quality: q,
      source: sourceLabel(r.source_type, r.verification_status), excerpt: note, verified_at: r.verified_at });
  };
  const bestByKey = new Map<string, any>();
  for (const a of attrsRes.data || []) {
    for (const [k, o] of optIndex) {
      if (o.ids.includes(a.product_attribute_option_id)) {
        const cur = bestByKey.get(k);
        if (!cur || rank(a) > rank(cur)) bestByKey.set(k, { attr: a, opt: o });
        break;
      }
    }
  }
  for (const [k, { attr, opt }] of bestByKey) push(opt.dimension_key, opt.attribute_key, opt.label, attr);
  const seenCaps = new Set<string>();
  for (const c of capsRes.data || []) {
    const p: any = capById.get(c.capability_product_id);
    if (!p || seenCaps.has(p.product_key)) continue;
    seenCaps.add(p.product_key);
    push("capability", p.product_key, p.name, c);
  }
  const seenSols = new Set<string>();
  for (const s of solsRes.data || []) {
    if (seenSols.has(s.name)) continue;
    seenSols.add(s.name);
    const status = s.editorial_verified ? "editorial_verified" : s.partner_verified ? "partner_verified" : "unverified";
    push("industry_solution", s.id, s.name, { verification_status: status, is_published: s.is_published, source_type: null, verified_at: s.verified_at });
  }

  // Grunduppgifter som redan finns strukturerat (klass A, ingen åtgärd)
  const base: { key: string; label: string }[] = [];
  if ((partner.applications || []).length) base.push({ key: "applications", label: `Produktområden: ${(partner.applications || []).join(", ")}` });
  if ((partner.geography || []).length) base.push({ key: "geography", label: `Geografi: ${(partner.geography || []).join(", ")}` });
  if ((partner.office_cities || []).length) base.push({ key: "office_cities", label: `Kontor: ${(partner.office_cities || []).join(", ")}` });
  if (partner.team_size_sweden) base.push({ key: "team_size_sweden", label: `Företagsstorlek (Sverige): ${partner.team_size_sweden}` });
  if (partner.agreement_signed) base.push({ key: "agreement", label: "Verifierad partner (avtal)" });
  for (const b of base) items.push({ dimension: "base", key: b.key, label: b.label, klass: "A", quality: "confirmed", source: "Partnerprofil", excerpt: null, verified_at: null });

  const missing = [...REVIEW_DIMENSIONS, "industry_solution"].filter((d) => !items.some((i) => i.dimension === d));
  const options: Record<string, { key: string; label: string }[]> = {};
  for (const d of REVIEW_DIMENSIONS) {
    options[d] = d === "capability"
      ? (caps || []).map((c: any) => ({ key: c.product_key, label: c.name }))
      : [...optIndex.values()].filter((o) => o.dimension_key === d).map((o) => ({ key: o.attribute_key, label: o.label }));
  }
  const lastVerified = items.map((i) => i.verified_at).filter(Boolean).sort().pop() || null;
  const counts = {
    A: items.filter((i) => i.klass === "A").length,
    B: items.filter((i) => i.klass === "B").length,
    C: missing.length,
  };
  const pending = (changesRes.data || []).filter((c: any) => c.status === "pending").length;
  const status = pending ? "Väntar på redaktionen" : counts.B ? "Partnerbekräftelse krävs" : counts.C ? "Ofullständig" : "Komplett";
  const hasApp = (cfg.apps || []).some((a) => (partner.applications || []).includes(a));
  return {
    partner: { id: partner.id, name: partner.name, slug: partner.slug, has_app: hasApp,
      has_bc: (partner.applications || []).includes("Business Central") },
    product_key: cfg.key, product_label: cfg.label, profile_label: cfg.profileLabel,
    profile_id: profileIds[0] ?? null, profile_ids: profileIds, items, missing, options, counts,
    last_verified_at: lastVerified, profile_status: status,
    changes: changesRes.data || [],
    // Publicerade partners (is_featured) får sina ändringar publicerade direkt (beslut 2026-09-29).
    auto_publish: !!partner.is_featured,
  };
}

/** Regelbaserad förifyllning. Skapar endast opublicerade förslag (legacy_import) för val som saknas. */
export async function runPrefill(sb: any, partnerId: string, productKey = "bc") {
  const cfg = REVIEW_PRODUCTS[productKey];
  if (!cfg) throw new Error("Okänt produktområde");
  const { data: p } = await sb.from("partners").select(
    "id, applications, description, product_profiles, delivery_profile, customer_examples, key_differentiators, key_differentiators_source",
  ).eq("id", partnerId).single();
  if (!p || !(cfg.apps || []).some((a) => (p.applications || []).includes(a))) {
    return { created: 0, skipped: `Ingen ${cfg.label}-profil` };
  }
  // Endast partnerns egna texter. AI-genererade formuleringar (positionering, AI-styrkor) används aldrig.
  const texts: string[] = [];
  collectStrings(p.description, texts);
  for (const src of cfg.textSources) {
    const block = p.product_profiles?.[src];
    if (block && typeof block === "object") {
      for (const [k, v] of Object.entries(block as Record<string, unknown>)) {
        if (/_ai_generated$|_generated_at$/.test(k)) continue;
        if ((block as any)[`${k}_ai_generated`] === true) continue;
        collectStrings(v, texts);
      }
    }
  }
  collectStrings(p.delivery_profile, texts);
  if (p.key_differentiators_source === "partner") collectStrings(p.key_differentiators, texts);
  const allowedApps = new Set([...cfg.apps, ...cfg.textSources]);
  collectStrings((p.customer_examples || []).filter((e: any) => !e?.application || allowedApps.has(e.application)), texts);
  const text = texts.join("\n");
  if (!text) return { created: 0 };

  const profileId = await getProfile(sb, partnerId, cfg, true);
  if (!profileId) return { created: 0 };
  // Alternativen måste tillhöra just denna profils produkt (databasregel), inte hela gruppen
  const { data: prof } = await sb.from("partner_product_profiles").select("product_id").eq("id", profileId).single();
  const groupIds = prof?.product_id ? [prof.product_id] : [...(await productIds(sb, cfg.productKeys)).values()];
  const capIds = [...(await productIds(sb, CAPABILITY_KEYS)).values()];
  const [{ data: opts }, { data: caps }, { data: exA }, { data: exC }, { data: removed }] = await Promise.all([
    sb.from("product_attribute_options").select("id, dimension_key, attribute_key").in("product_id", groupIds).eq("is_active", true),
    sb.from("product_catalog").select("id, product_key").in("id", capIds),
    sb.from("partner_product_attributes").select("product_attribute_option_id").eq("partner_product_profile_id", profileId),
    sb.from("partner_product_capabilities").select("capability_product_id").eq("partner_product_profile_id", profileId),
    // Val som partnern tagit bort ska inte förifyllas igen
    sb.from("partner_review_changes").select("dimension_key, value_key").eq("partner_id", partnerId).eq("change_type", "remove").neq("status", "rejected"),
  ]);
  const blocked = new Set((removed || []).map((r: any) => `${r.dimension_key}:${r.value_key}`));
  const optId = new Map((opts || []).map((o: any) => [`${o.dimension_key}:${o.attribute_key}`, o.id]));
  const capId = new Map((caps || []).map((c: any) => [c.product_key, c.id]));
  const hasA = new Set((exA || []).map((a: any) => a.product_attribute_option_id));
  const hasC = new Set((exC || []).map((c: any) => c.capability_product_id));
  const attrIns: any[] = [], capIns: any[] = [];
  for (const [dim, key, re] of (PREFILL_RULE_SETS[productKey] || PREFILL_RULE_SETS.bc)) {
    if (blocked.has(`${dim}:${key}`)) continue;
    const ex = excerpt(text, re);
    if (!ex) continue;
    const meta = { verification_status: "legacy_import", source_type: "import", verified_by: "import", verified_at: today(),
      is_published: false, editorial_note: (PREFILL_PREFIX + `"${ex}"`).slice(0, 500) };
    if (dim === "capability") {
      const id = capId.get(key);
      if (id && !hasC.has(id)) { hasC.add(id); capIns.push({ partner_product_profile_id: profileId, capability_product_id: id, ...meta }); }
    } else {
      const id = optId.get(`${dim}:${key}`);
      if (id && !hasA.has(id)) { hasA.add(id); attrIns.push({ partner_product_profile_id: profileId, product_attribute_option_id: id, ...meta }); }
    }
  }
  if (attrIns.length) { const { error } = await sb.from("partner_product_attributes").insert(attrIns); if (error) throw error; }
  if (capIns.length) { const { error } = await sb.from("partner_product_capabilities").insert(capIns); if (error) throw error; }
  return { created: attrIns.length + capIns.length };
}

type Ref = { dimension: string; key: string };
export interface PartnerResponse {
  confirm?: Ref[]; remove?: Ref[]; add?: Ref[];
  add_solutions?: { name: string; industry?: string; description?: string }[];
}

/** Partnerns granskning: bekräfta/ta bort/lägga till. Allt blir väntande ändringar för redaktionen. */
export async function applyPartnerResponse(sb: any, partnerId: string, resp: PartnerResponse, productKey = "bc") {
  const cfg = REVIEW_PRODUCTS[productKey];
  if (!cfg) throw new Error("Okänt produktområde");
  const before = await computeReview(sb, partnerId, productKey);
  const profileId = before.profile_id || await getProfile(sb, partnerId, cfg, true);
  if (!profileId) throw new Error(`Partnern saknar ${cfg.label}-profil`);
  const products = await productIds(sb, [...cfg.productKeys, ...CAPABILITY_KEYS]);
  const groupIds = cfg.productKeys.map((k) => products.get(k)).filter(Boolean);
  const [{ data: opts }, { data: caps }] = await Promise.all([
    sb.from("product_attribute_options").select("id, product_id, dimension_key, attribute_key, label").in("product_id", groupIds).eq("is_active", true),
    sb.from("product_catalog").select("id, product_key, name").in("id", CAPABILITY_KEYS.map((k) => products.get(k)).filter(Boolean)),
  ]);
  const resolve = (r: Ref) => {
    if (!r || typeof r.dimension !== "string" || typeof r.key !== "string") return null;
    if (r.dimension === "capability") {
      const c = (caps || []).find((x: any) => x.product_key === r.key);
      return c ? { table: "partner_product_capabilities", col: "capability_product_id", ids: [c.id], label: c.name } : null;
    }
    if (!(REVIEW_DIMENSIONS as readonly string[]).includes(r.dimension)) return null;
    // Alla alternativrader för nyckeln inom områdets produkter (speglande uppsättningar)
    const rows = (opts || []).filter((x: any) => x.dimension_key === r.dimension && x.attribute_key === r.key);
    return rows.length ? { table: "partner_product_attributes", col: "product_attribute_option_id", ids: rows.map((x: any) => x.id), label: rows[0].label } : null;
  };
  const labelsIn = (dim: string) => before.items.filter((i) => i.dimension === dim).map((i) => i.label);
  const after: Record<string, string[]> = {};
  for (const d of [...REVIEW_DIMENSIONS, "industry_solution"]) after[d] = labelsIn(d);
  const live = !!before.auto_publish;
  const meta = { verification_status: "partner_verified", source_type: "partner", verified_by: "partner", verified_at: today(), is_published: live };
  const changes: any[] = [];
  const queue = (r: Ref, label: string, type: string, source: string) => changes.push({ partner_id: partnerId, profile_id: profileId,
    dimension_key: r.dimension, value_key: r.key, value_label: label, change_type: type, source,
    ...(live ? { status: "approved", editor_note: "Publicerad direkt (publicerad partner)", reviewed_at: new Date().toISOString() } : {}) });

  for (const r of (resp.confirm || []).slice(0, 100)) {
    const t = resolve(r); const it = before.items.find((i) => i.dimension === r.dimension && i.key === r.key);
    if (!t || !it || it.klass !== "B") continue;
    for (const id of t.ids) {
      await sb.from(t.table).update({ ...meta, editorial_note: it.excerpt ? PREFILL_PREFIX + it.excerpt : null })
        .eq("partner_product_profile_id", profileId).eq(t.col, id);
    }
    queue(r, t.label, "confirm", it.source);
  }
  for (const r of (resp.remove || []).slice(0, 100)) {
    const t = resolve(r); const it = before.items.find((i) => i.dimension === r.dimension && i.key === r.key);
    if (!t || !it) continue;
    if (live) {
      for (const id of t.ids) await sb.from(t.table).delete().eq("partner_product_profile_id", profileId).eq(t.col, id);
    }
    after[r.dimension] = after[r.dimension].filter((l) => l !== t.label);
    queue(r, t.label, "remove", it.source);
  }
  for (const r of (resp.add || []).slice(0, 100)) {
    const t = resolve(r);
    if (!t || before.items.some((i) => i.dimension === r.dimension && i.key === r.key)) continue;
    const { error } = await sb.from(t.table).insert({ partner_product_profile_id: profileId, [t.col]: t.ids[0], ...meta });
    if (error) throw error;
    after[r.dimension] = [...after[r.dimension], t.label];
    queue(r, t.label, "add", "Partner");
  }
  for (const s of (resp.add_solutions || []).slice(0, 5)) {
    const name = String(s?.name || "").trim().slice(0, 120);
    if (!name) continue;
    const { data: row, error } = await sb.from("partner_industry_solutions").insert({ profile_id: profileId, name,
      description: String(s.description || "").slice(0, 800) || null, industries: s.industry ? [String(s.industry).slice(0, 120)] : [],
      solution_type: "own", partner_verified: true, verified_at: today(), is_published: live }).select("id").single();
    if (error) throw error;
    after.industry_solution = [...after.industry_solution, name];
    queue({ dimension: "industry_solution", key: row.id }, name, "add", "Partner");
  }
  if (!changes.length) return { changes: 0, diff: [] };
  // Tidigare/nytt värde per dimension (ändringsjämförelse)
  for (const c of changes) {
    const prev = labelsIn(c.dimension_key);
    c.previous_value = prev.length ? prev.join(", ") : "Tomt";
    c.new_value = c.change_type === "confirm" ? `${c.value_label} (bekräftad av partner)` : (after[c.dimension_key].join(", ") || "Tomt");
  }
  // Ersätt ev. äldre väntande ändring för samma val
  for (const c of changes) {
    await sb.from("partner_review_changes").delete().eq("partner_id", partnerId).eq("profile_id", profileId)
      .eq("dimension_key", c.dimension_key).eq("value_key", c.value_key).in("status", ["pending", "clarification"]);
  }
  const { error } = await sb.from("partner_review_changes").insert(changes);
  if (error) throw error;
  if (live) await sb.from("partner_product_profiles").update({ is_published: true }).eq("id", profileId);
  const diff = [...new Set(changes.map((c) => c.dimension_key))].map((d) => ({
    dimension: d, title: dimensionTitle(productKey, d),
    previous: labelsIn(d).join(", ") || "Tomt", next: after[d].join(", ") || "Tomt",
  }));
  return { changes: changes.length, diff, published: live };
}

/** Redaktionens beslut: approve | reject | clarify. */
export async function decideChange(sb: any, id: string, decision: string, note: string | null) {
  const { data: c } = await sb.from("partner_review_changes").select("*").eq("id", id).single();
  if (!c) throw new Error("Ändringen finns inte");
  if (!["pending", "clarification"].includes(c.status)) throw new Error("Ändringen är redan hanterad");
  if (decision === "clarify") {
    if (!note?.trim()) throw new Error("Skriv vad som behöver förtydligas");
  } else if (!["approve", "reject"].includes(decision)) throw new Error("Ogiltigt beslut");

  // Produkt resolve via profilens product_id (ändringen vet vilken profil den gäller)
  const target = async () => {
    if (c.dimension_key === "industry_solution") return { table: "partner_industry_solutions", match: { id: c.value_key } };
    const { data: prof } = await sb.from("partner_product_profiles").select("product_id").eq("id", c.profile_id).single();
    const productId = prof?.product_id;
    if (!productId) return null;
    if (c.dimension_key === "capability") {
      const { data } = await sb.from("product_catalog").select("id").eq("product_key", c.value_key).single();
      return data ? { table: "partner_product_capabilities", match: { partner_product_profile_id: c.profile_id, capability_product_id: data.id } } : null;
    }
    const { data } = await sb.from("product_attribute_options").select("id").eq("product_id", productId)
      .eq("dimension_key", c.dimension_key).eq("attribute_key", c.value_key).single();
    return data ? { table: "partner_product_attributes", match: { partner_product_profile_id: c.profile_id, product_attribute_option_id: data.id } } : null;
  };
  const t = decision === "clarify" ? null : await target();
  const where = (q: any) => { for (const [k, v] of Object.entries(t!.match)) q = q.eq(k, v); return q; };

  if (t && decision === "approve") {
    if (c.change_type === "remove") await where(sb.from(t.table).delete());
    else if (t.table === "partner_industry_solutions") await where(sb.from(t.table).update({ editorial_verified: true, is_published: true }));
    else await where(sb.from(t.table).update({ is_published: true }));
  }
  if (t && decision === "reject") {
    if (c.change_type === "add") await where(sb.from(t.table).delete());
    if (c.change_type === "confirm" && t.table !== "partner_industry_solutions")
      await where(sb.from(t.table).update({ verification_status: "unverified", source_type: null, verified_by: null, is_published: false }));
  }
  const status = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "clarification";
  const { error } = await sb.from("partner_review_changes").update({ status, editor_note: note?.slice(0, 1000) || null,
    reviewed_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
  return { ok: true, status };
}

/** Översikt för Review Queue + statistik (endast admin). Per produktområde. */
export async function reviewOverview(sb: any) {
  const { data: partners } = await sb.from("partners").select("id").eq("agreement_signed", true).order("name");
  const rows = [];
  const perProduct: Record<string, { partners: number; complete: number; missing: number }> = {};
  for (const key of Object.keys(REVIEW_PRODUCTS)) perProduct[key] = { partners: 0, complete: 0, missing: 0 };
  let pendingReviews = 0;
  for (const p of partners || []) {
    const { data: appsRow } = await sb.from("partners").select("name, slug, applications, is_featured").eq("id", p.id).single();
    const products: Record<string, any> = {};
    let lastVerified: string | null = null;
    for (const key of Object.keys(REVIEW_PRODUCTS)) {
      const cfg = REVIEW_PRODUCTS[key];
      if (!(cfg.apps || []).some((a) => (appsRow?.applications || []).includes(a))) continue;
      const r = await computeReview(sb, p.id, key);
      products[key] = { counts: r.counts, profile_status: r.profile_status, label: cfg.label };
      perProduct[key].partners++;
      if (r.counts.B === 0 && r.counts.C === 0) perProduct[key].complete++;
      perProduct[key].missing += r.counts.C;
      pendingReviews += r.changes.filter((c: any) => c.status === "pending").length;
      if (r.last_verified_at && (!lastVerified || r.last_verified_at > lastVerified)) lastVerified = r.last_verified_at;
    }
    if (Object.keys(products).length) {
      rows.push({ partner_id: p.id, name: appsRow?.name, slug: appsRow?.slug, products, last_verified_at: lastVerified });
    }
  }
  const { count: pending } = await sb.from("partner_review_changes").select("id", { count: "exact", head: true }).eq("status", "pending");
  return {
    rows,
    per_product: perProduct,
    stats: {
      verified_partners: rows.length,
      products: perProduct,
      missing_competences: Object.values(perProduct).reduce((s, x) => s + x.missing, 0),
      pending_reviews: pending || 0,
    },
  };
}
