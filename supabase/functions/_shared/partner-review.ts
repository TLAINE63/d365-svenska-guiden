// Partner Review Queue (BizApps). Datakvalitet och partnerverifiering.
// Ingen AI, ingen ranking, ingen matchning. Förifyllning = explicita textregler.
// Se docs/PARTNER-REVIEW-QUEUE.md.

export const REVIEW_DIMENSIONS = ["migration", "competency", "project_type", "delivery_model", "capability"] as const;
export const DIMENSION_TITLES: Record<string, string> = {
  migration: "Migreringserfarenhet",
  competency: "Business Central-kompetens",
  project_type: "Typiska projekt",
  delivery_model: "Leveransmodell",
  capability: "Tvärgående förmågor",
  industry_solution: "Branschlösning",
  base: "Grunduppgifter",
};
export const CAPABILITY_KEYS = ["power-bi", "power-platform", "copilot", "copilot-studio", "ai-agents"];

// Regelbaserad förifyllning: endast tydliga, explicita formuleringar.
// Varje regel = [dimension, nyckel, regex]. Om inget matchar lämnas fältet tomt.
const MIG = (sys: string) =>
  new RegExp(`(migrer\\w*|byte|flytt\\w*|uppgrader\\w*|konverter\\w*)[^.]{0,60}\\b${sys}\\b|\\b${sys}\\b[^.]{0,60}(till|->|→)\\s*(dynamics\\s*365\\s*)?business\\s*central`, "i");
export const PREFILL_RULES: [string, string, RegExp][] = [
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

async function bcProductId(sb: any): Promise<string | null> {
  const { data } = await sb.from("product_catalog").select("id").eq("product_key", "business-central").single();
  return data?.id ?? null;
}

async function getProfile(sb: any, partnerId: string, create: boolean): Promise<string | null> {
  const pid = await bcProductId(sb);
  if (!pid) return null;
  const { data: ex } = await sb.from("partner_product_profiles").select("id").eq("partner_id", partnerId).eq("product_id", pid).maybeSingle();
  if (ex?.id || !create) return ex?.id ?? null;
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

/** Klassar en partners information i A (bekräftat), B (förifyllt, kräver bekräftelse) och C (saknas). */
export async function computeReview(sb: any, partnerId: string) {
  const { data: partner } = await sb.from("partners")
    .select("id, name, slug, applications, geography, office_cities, team_size_sweden, agreement_signed, agreement_signed_at, is_featured")
    .eq("id", partnerId).single();
  if (!partner) throw new Error("Partnern finns inte");
  const profileId = await getProfile(sb, partnerId, false);
  const pid = await bcProductId(sb);

  const [{ data: allOpts }, { data: caps }, attrsRes, capsRes, solsRes, { data: changes }] = await Promise.all([
    sb.from("product_attribute_options").select("id, dimension_key, attribute_key, label, is_active").eq("product_id", pid),
    sb.from("product_catalog").select("id, product_key, name").in("product_key", CAPABILITY_KEYS),
    profileId ? sb.from("partner_product_attributes").select("*").eq("partner_product_profile_id", profileId) : Promise.resolve({ data: [] }),
    profileId ? sb.from("partner_product_capabilities").select("*").eq("partner_product_profile_id", profileId) : Promise.resolve({ data: [] }),
    profileId ? sb.from("partner_industry_solutions").select("*").eq("profile_id", profileId) : Promise.resolve({ data: [] }),
    sb.from("partner_review_changes").select("*").eq("partner_id", partnerId).in("status", ["pending", "clarification"]).order("created_at", { ascending: false }),
  ]);
  const optById = new Map((allOpts || []).map((o: any) => [o.id, o]));
  const capById = new Map((caps || []).map((c: any) => [c.id, c]));
  const items: ReviewItem[] = [];
  const push = (dimension: string, key: string, label: string, r: any) => {
    const q = quality(r.verification_status, !!r.is_published);
    const note = typeof r.editorial_note === "string" && r.editorial_note.startsWith(PREFILL_PREFIX) ? r.editorial_note.slice(PREFILL_PREFIX.length) : null;
    items.push({ dimension, key, label, klass: q === "public" ? "B" : "A", quality: q,
      source: sourceLabel(r.source_type, r.verification_status), excerpt: note, verified_at: r.verified_at });
  };
  for (const a of attrsRes.data || []) {
    const o: any = optById.get(a.product_attribute_option_id);
    if (o) push(o.dimension_key, o.attribute_key, o.label, a);
  }
  for (const c of capsRes.data || []) {
    const p: any = capById.get(c.capability_product_id);
    if (p) push("capability", p.product_key, p.name, c);
  }
  for (const s of solsRes.data || []) {
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
      : (allOpts || []).filter((o: any) => o.dimension_key === d && o.is_active).map((o: any) => ({ key: o.attribute_key, label: o.label }));
  }
  const lastVerified = items.map((i) => i.verified_at).filter(Boolean).sort().pop() || null;
  const counts = {
    A: items.filter((i) => i.klass === "A").length,
    B: items.filter((i) => i.klass === "B").length,
    C: missing.length,
  };
  const pending = (changes || []).filter((c: any) => c.status === "pending").length;
  const status = pending ? "Väntar på redaktionen" : counts.B ? "Partnerbekräftelse krävs" : counts.C ? "Ofullständig" : "Komplett";
  return {
    partner: { id: partner.id, name: partner.name, slug: partner.slug, has_bc: (partner.applications || []).includes("Business Central") },
    profile_id: profileId, items, missing, options, counts, last_verified_at: lastVerified, profile_status: status,
    changes: changes || [],
    // Publicerade partners (is_featured) får sina ändringar publicerade direkt (beslut 2026-09-29).
    auto_publish: !!partner.is_featured,
  };
}

/** Regelbaserad förifyllning. Skapar endast opublicerade förslag (legacy_import) för val som saknas. */
export async function runPrefill(sb: any, partnerId: string) {
  const { data: p } = await sb.from("partners").select(
    "id, applications, description, product_profiles, delivery_profile, customer_examples, key_differentiators, key_differentiators_source",
  ).eq("id", partnerId).single();
  if (!p || !(p.applications || []).includes("Business Central")) return { created: 0, skipped: "Ingen Business Central-profil" };
  // Endast partnerns egna texter. AI-genererade formuleringar (positionering, AI-styrkor) används aldrig.
  const texts: string[] = [];
  collectStrings(p.description, texts);
  const bc = p.product_profiles?.["Business Central"];
  if (bc && typeof bc === "object") {
    for (const [k, v] of Object.entries(bc as Record<string, unknown>)) {
      if (/_ai_generated$|_generated_at$/.test(k)) continue;
      if ((bc as any)[`${k}_ai_generated`] === true) continue;
      collectStrings(v, texts);
    }
  }
  collectStrings(p.delivery_profile, texts);
  if (p.key_differentiators_source === "partner") collectStrings(p.key_differentiators, texts);
  collectStrings((p.customer_examples || []).filter((e: any) => !e?.application || e.application === "Business Central"), texts);
  const text = texts.join("\n");
  if (!text) return { created: 0 };

  const profileId = await getProfile(sb, partnerId, true);
  if (!profileId) return { created: 0 };
  const pid = await bcProductId(sb);
  const [{ data: opts }, { data: caps }, { data: exA }, { data: exC }, { data: removed }] = await Promise.all([
    sb.from("product_attribute_options").select("id, dimension_key, attribute_key").eq("product_id", pid).eq("is_active", true),
    sb.from("product_catalog").select("id, product_key").in("product_key", CAPABILITY_KEYS),
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
  for (const [dim, key, re] of PREFILL_RULES) {
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
export async function applyPartnerResponse(sb: any, partnerId: string, resp: PartnerResponse) {
  const before = await computeReview(sb, partnerId);
  const profileId = before.profile_id || await getProfile(sb, partnerId, true);
  if (!profileId) throw new Error("Partnern saknar Business Central-profil");
  const pid = await bcProductId(sb);
  const [{ data: opts }, { data: caps }] = await Promise.all([
    sb.from("product_attribute_options").select("id, dimension_key, attribute_key, label").eq("product_id", pid).eq("is_active", true),
    sb.from("product_catalog").select("id, product_key, name").in("product_key", CAPABILITY_KEYS),
  ]);
  const resolve = (r: Ref) => {
    if (!r || typeof r.dimension !== "string" || typeof r.key !== "string") return null;
    if (r.dimension === "capability") {
      const c = (caps || []).find((x: any) => x.product_key === r.key);
      return c ? { table: "partner_product_capabilities", col: "capability_product_id", id: c.id, label: c.name } : null;
    }
    if (!(REVIEW_DIMENSIONS as readonly string[]).includes(r.dimension)) return null;
    const o = (opts || []).find((x: any) => x.dimension_key === r.dimension && x.attribute_key === r.key);
    return o ? { table: "partner_product_attributes", col: "product_attribute_option_id", id: o.id, label: o.label } : null;
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
    await sb.from(t.table).update({ ...meta, editorial_note: it.excerpt ? PREFILL_PREFIX + it.excerpt : null })
      .eq("partner_product_profile_id", profileId).eq(t.col, t.id);
    queue(r, t.label, "confirm", it.source);
  }
  for (const r of (resp.remove || []).slice(0, 100)) {
    const t = resolve(r); const it = before.items.find((i) => i.dimension === r.dimension && i.key === r.key);
    if (!t || !it) continue;
    if (live) await sb.from(t.table).delete().eq("partner_product_profile_id", profileId).eq(t.col, t.id);
    after[r.dimension] = after[r.dimension].filter((l) => l !== t.label);
    queue(r, t.label, "remove", it.source);
  }
  for (const r of (resp.add || []).slice(0, 100)) {
    const t = resolve(r);
    if (!t || before.items.some((i) => i.dimension === r.dimension && i.key === r.key)) continue;
    const { error } = await sb.from(t.table).insert({ partner_product_profile_id: profileId, [t.col]: t.id, ...meta });
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
    await sb.from("partner_review_changes").delete().eq("partner_id", partnerId).eq("dimension_key", c.dimension_key)
      .eq("value_key", c.value_key).in("status", ["pending", "clarification"]);
  }
  const { error } = await sb.from("partner_review_changes").insert(changes);
  if (error) throw error;
  if (live) await sb.from("partner_product_profiles").update({ is_published: true }).eq("id", profileId);
  const diff = [...new Set(changes.map((c) => c.dimension_key))].map((d) => ({
    dimension: d, title: DIMENSION_TITLES[d] || d,
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

  const target = async () => {
    if (c.dimension_key === "industry_solution") return { table: "partner_industry_solutions", match: { id: c.value_key } };
    const pid = await bcProductId(sb);
    if (c.dimension_key === "capability") {
      const { data } = await sb.from("product_catalog").select("id").eq("product_key", c.value_key).single();
      return data ? { table: "partner_product_capabilities", match: { partner_product_profile_id: c.profile_id, capability_product_id: data.id } } : null;
    }
    const { data } = await sb.from("product_attribute_options").select("id").eq("product_id", pid)
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

/** Översikt för Review Queue + statistik (endast admin). */
export async function reviewOverview(sb: any) {
  const { data: partners } = await sb.from("partners").select("id").eq("agreement_signed", true).order("name");
  const rows = [];
  for (const p of partners || []) {
    const r = await computeReview(sb, p.id);
    rows.push({ partner_id: p.id, name: r.partner.name, slug: r.partner.slug, has_bc: r.partner.has_bc,
      last_verified_at: r.last_verified_at, counts: r.counts, profile_status: r.profile_status,
      pending: r.changes.filter((c: any) => c.status === "pending").length });
  }
  const { count: pending } = await sb.from("partner_review_changes").select("id", { count: "exact", head: true }).eq("status", "pending");
  const bcRows = rows.filter((r) => r.has_bc);
  return {
    rows,
    stats: {
      verified_partners: rows.length,
      complete_bc_profiles: bcRows.filter((r) => r.counts.B === 0 && r.counts.C === 0).length,
      bc_partners: bcRows.length,
      missing_competences: bcRows.reduce((s, r) => s + r.counts.C, 0),
      pending_reviews: pending || 0,
    },
  };
}
