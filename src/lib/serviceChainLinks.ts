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

/** fs1 (antal tekniker 0–3) till indikativt antal Field Service-licenser. */
export const TECHS_FROM_FS1: Record<string, number> = { "0": 5, "1": 20, "2": 60, "3": 150 };
/** fs1 till kravspecens storleksval. */
export const TEAM_FROM_FS1: Record<string, string> = { "0": "6–10", "1": "21–50", "2": "51–100", "3": "100+" };

/** Områden för Field Service. Fältservice och schemaläggning är alltid med. */
export function fieldAreasFromAnswers(a: Answers): string[] {
  const out = ["field_service", "scheduling"];
  if (a.fs7 === "yes") out.push("sla_entitlements");
  if (a.fs9 === "yes") out.push("case_mgmt");
  if (a.fs11 === "yes") out.push("copilot_ai");
  if (hi(a.fs12)) out.push("analytics_cs");
  if (hi(a.fs4) || a.fs10 === "yes") out.push("integration_cs");
  return out;
}

export function fieldChainLinks(a: Answers, level: ServiceLevel) {
  const roi = new URLSearchParams();
  const techs = TECHS_FROM_FS1[String(a.fs1 ?? "")];
  if (techs) roi.set("agenter", String(techs));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);
  roi.set("integrationer", String((hi(a.fs4) ? 1 : 0) + (a.fs10 === "yes" ? 1 : 0)));

  const krav = new URLSearchParams();
  const team = TEAM_FROM_FS1[String(a.fs1 ?? "")];
  if (team) krav.set("storlek", team);
  krav.set("omraden", fieldAreasFromAnswers(a).join(","));

  return {
    roi: `/d365fieldservice/roi-kalkylator/?${roi}`,
    kravspec: `/kravspecifikation-kundservice/?${krav}`,
    partners: "/dynamics-365-crm-partners-sverige/",
  };
}

/** cc5 (antal agenter 0–3) till indikativt antal Contact Center-licenser. */
export const AGENTS_FROM_CC5: Record<string, number> = { "0": 10, "1": 40, "2": 120, "3": 250 };
/** cc5 till kravspecens storleksval. */
export const TEAM_FROM_CC5: Record<string, string> = { "0": "11–20", "1": "21–50", "2": "100+", "3": "100+" };

/** Områden för Contact Center. Kontaktcenter och kanaler är alltid med. */
export function contactAreasFromAnswers(a: Answers): string[] {
  const out = ["contact_center", "channels"];
  if (a.cc3 === "yes" || hi(a.cc1)) out.push("queues_routing");
  if (a.cc6 === "yes") out.push("scheduling");
  if (a.cc9 === "yes") out.push("self_service");
  if (a.cc10 === "yes") out.push("copilot_ai");
  if (a.cc11 === "yes") out.push("case_mgmt", "integration_cs");
  if (a.cc7 === "yes" || hi(a.cc8) || hi(a.cc12)) out.push("analytics_cs");
  return out;
}

export function contactChainLinks(a: Answers, level: ServiceLevel) {
  const roi = new URLSearchParams();
  const agents = AGENTS_FROM_CC5[String(a.cc5 ?? "")];
  if (agents) roi.set("agenter", String(agents));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);
  roi.set("integrationer", String(a.cc11 === "yes" ? 1 : 0));

  const krav = new URLSearchParams();
  const team = TEAM_FROM_CC5[String(a.cc5 ?? "")];
  if (team) krav.set("storlek", team);
  krav.set("omraden", contactAreasFromAnswers(a).join(","));

  return {
    roi: `/d365contactcenter/roi-kalkylator/?${roi}`,
    kravspec: `/kravspecifikation-kundservice/?${krav}`,
    partners: "/dynamics-365-crm-partners-sverige/",
  };
}
