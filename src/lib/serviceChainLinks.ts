import type { Answers } from "@/data/crmMatchningstestConfigs";

export type ServiceLevel = "strong" | "partial" | "oversized";
type Complexity = "Låg" | "Medel" | "Hög";

/** cs1 (ärendevolym 0–3) till indikativt antal handläggare i kalkylatorn. */
export const AGENTS_FROM_CS1: Record<string, number> = { "0": 3, "1": 8, "2": 20, "3": 50 };
/** cs1 till kravspecens storleksval. */
export const TEAM_FROM_CS1: Record<string, string> = { "0": "1–5", "1": "6–10", "2": "21–50", "3": "51–100" };
export const COMPLEXITY_FROM_LEVEL: Record<ServiceLevel, Complexity> = { strong: "Hög", partial: "Medel", oversized: "Låg" };
export const SERVICE_TEAM_SIZES = ["1–5", "6–10", "11–20", "21–50", "51–100", "100+"];
export const SERVICE_AREA_IDS = ["case_mgmt", "queues_routing", "knowledge", "sla_entitlements", "channels", "contact_center", "copilot_ai", "field_service", "scheduling", "analytics_cs", "self_service", "integration_cs"];

const hi = (v?: string) => v === "2" || v === "3";

/** Områden som testsvaren tydligt pekar på. Ärendehantering är alltid med. */
export function serviceAreasFromAnswers(a: Answers): string[] {
  const out = ["case_mgmt"];
  if (hi(a.cs2)) out.push("channels");
  if (a.cs3 === "yes") out.push("contact_center");
  if (hi(a.cs4) || hi(a.cs7)) out.push("queues_routing");
  if (hi(a.cs5)) out.push("sla_entitlements");
  if (a.cs6 === "yes") out.push("knowledge");
  if (a.cs8 === "yes") out.push("copilot_ai");
  if (a.cs9 === "yes") out.push("self_service");
  if (a.cs10 === "yes") out.push("integration_cs");
  if (hi(a.cs11)) out.push("analytics_cs");
  return out;
}

export function serviceChainLinks(a: Answers, level: ServiceLevel) {
  const roi = new URLSearchParams();
  const agents = AGENTS_FROM_CS1[String(a.cs1 ?? "")];
  if (agents) roi.set("agenter", String(agents));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);
  roi.set("integrationer", String(a.cs10 === "yes" ? 1 : 0));

  const krav = new URLSearchParams();
  const team = TEAM_FROM_CS1[String(a.cs1 ?? "")];
  if (team) krav.set("storlek", team);
  krav.set("omraden", serviceAreasFromAnswers(a).join(","));

  return {
    roi: `/d365customerservice/roi-kalkylator/?${roi}`,
    kravspec: `/kravspecifikation-kundservice/?${krav}`,
    partners: "/dynamics-365-crm-partners-sverige/",
  };
}

export function readServiceRoiPrefill(search: string) {
  const sp = new URLSearchParams(search);
  const out: { agents?: number; integrations?: number } = {};
  const n = Number(sp.get("agenter"));
  if (Number.isInteger(n) && n > 0 && n <= 10000) out.agents = n;
  const i = Number(sp.get("integrationer"));
  if (sp.has("integrationer") && Number.isInteger(i) && i >= 0 && i <= 20) out.integrations = i;
  return out;
}

export function readServiceKravPrefill(search: string) {
  const sp = new URLSearchParams(search);
  const storlek = sp.get("storlek") ?? "";
  const size = SERVICE_TEAM_SIZES.includes(storlek) ? storlek : undefined;
  const areas = [...new Set((sp.get("omraden") ?? "").split(",").filter((id) => SERVICE_AREA_IDS.includes(id)))];
  return { size, areas };
}
