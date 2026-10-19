import type { Answers } from "@/data/crmMatchningstestConfigs";

export type SalesLevel = "strong" | "partial" | "oversized";
type Complexity = "Låg" | "Medel" | "Hög";

/** s5 (0–3) till antal säljare i kalkylatorn (indikativt startvärde). */
export const SELLERS_FROM_S5: Record<string, number> = { "0": 3, "1": 10, "2": 25, "3": 60 };
/** s5 (0–3) till kravspecens storleksval för säljteamet. */
export const TEAM_FROM_S5: Record<string, string> = { "0": "1–5", "1": "6–10", "2": "21–50", "3": "51–100" };
export const COMPLEXITY_FROM_LEVEL: Record<SalesLevel, Complexity> = { strong: "Hög", partial: "Medel", oversized: "Låg" };
export const SALES_AREA_IDS = ["lead_mgmt", "opportunity", "account_contact", "activities", "quotes_orders", "analytics", "automation", "email_marketing", "integration"];

const hi = (v?: string) => v === "2" || v === "3";

/** Funktionsområden som testsvaren tydligt pekar på. Kund/kontakt och aktiviteter är alltid med. */
export function salesAreasFromAnswers(a: Answers): string[] {
  const out = ["account_contact", "activities"];
  if (hi(a.s1)) out.push("lead_mgmt");
  if (hi(a.s2) || hi(a.s3)) out.push("opportunity");
  if (a.s4 === "yes") out.push("quotes_orders");
  if (hi(a.s11)) out.push("analytics");
  if (hi(a.s8)) out.push("automation");
  if (a.s9 === "yes" || a.s10 === "yes") out.push("integration");
  return out;
}

export function salesChainLinks(a: Answers, level: SalesLevel) {
  const roi = new URLSearchParams();
  const sellers = SELLERS_FROM_S5[String(a.s5 ?? "")];
  if (sellers) roi.set("saljare", String(sellers));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);
  roi.set("licens", a.s8 === "3" ? "Premium" : "Enterprise");
  roi.set("integrationer", String((a.s9 === "yes" ? 1 : 0) + (a.s10 === "yes" ? 1 : 0)));

  const krav = new URLSearchParams();
  const team = TEAM_FROM_S5[String(a.s5 ?? "")];
  if (team) krav.set("storlek", team);
  krav.set("omraden", salesAreasFromAnswers(a).join(","));

  return {
    roi: `/d365sales/roi-kalkylator/?${roi}`,
    kravspec: `/kravspecifikation-sales/?${krav}`,
    partners: "/dynamics-365-crm-partners-sverige/",
  };
}

export function readSalesRoiPrefill(search: string) {
  const sp = new URLSearchParams(search);
  const out: { sellers?: number; complexity?: Complexity; license?: "Professional" | "Enterprise" | "Premium"; integrations?: number } = {};
  const s = Number(sp.get("saljare"));
  if (Number.isInteger(s) && s > 0 && s <= 10000) out.sellers = s;
  const k = sp.get("komplexitet");
  if (k === "Låg" || k === "Medel" || k === "Hög") out.complexity = k;
  const l = sp.get("licens");
  if (l === "Professional" || l === "Enterprise" || l === "Premium") out.license = l;
  const i = Number(sp.get("integrationer"));
  if (sp.has("integrationer") && Number.isInteger(i) && i >= 0 && i <= 20) out.integrations = i;
  return out;
}

export function readSalesKravPrefill(search: string) {
  const sp = new URLSearchParams(search);
  const storlek = sp.get("storlek") ?? "";
  const size = Object.values(TEAM_FROM_S5).includes(storlek) || ["11–20", "100+"].includes(storlek) ? storlek : undefined;
  const areas = [...new Set((sp.get("omraden") ?? "").split(",").filter((id) => SALES_AREA_IDS.includes(id)))];
  return { size, areas };
}
