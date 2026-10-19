import type { Answers } from "@/data/fscmMatchningstest";
import type { ScoreResult } from "@/lib/fscmScoring";
import type { BuyerProfile } from "@/lib/buyerProfile";
import { deriveCompareFilters, filtersToSearch, industryNameFromSlug } from "@/lib/underlag";

/** Mittpunkt i SEK för matchningstestets omsättningsintervall (indikativt startvärde i kalkylen). */
export const REVENUE_MIDPOINT_SEK: Record<string, number> = {
  "<100": 75_000_000,
  "100-500": 300_000_000,
  "500-2000": 1_000_000_000,
  ">2000": 3_000_000_000,
};

export const COMPLEXITY_FROM_LEVEL: Record<ScoreResult["level"], "Låg" | "Medel" | "Hög"> = {
  strong: "Hög",
  partial: "Medel",
  oversized: "Låg",
};

/** Testets branschval till kravspecens kanoniska branschnamn. */
export const TEST_INDUSTRY_TO_NAME: Record<string, string> = {
  tillverkning: "Tillverkningsindustri",
  grossist: "Grossist & Distribution",
  detaljhandel: "Retail & E-handel",
  tjanster: "Konsulttjänster",
};

/** Testets antal anställda till kravspecens storleksintervall. */
export const EMPLOYEES_TO_SIZE: Record<string, string> = {
  "<50": "26–50",
  "50-250": "101–250",
  "250-1000": "251–500",
  "1000+": "500+",
};

export const KRAV_AREA_IDS = ["ekonomi", "lager", "produktion", "forsaljning", "inkop", "projekt", "hr", "service", "transport", "koncern", "integration"];

/** Funktionsområden i kravspecen som testsvaren tydligt pekar på. Ekonomi är alltid med. */
export function kravAreasFromAnswers(a: Answers): string[] {
  const out = ["ekonomi"];
  const services = a.q3_industry === "tjanster";
  if ((a.q4_legal_entities && a.q4_legal_entities !== "1") || a.q7_consolidation === "yes" || a.q8_intercompany === "yes") out.push("koncern");
  if (!services && a.q13_warehouse === "yes") out.push("lager");
  if (!services && a.q15_manufacturing && a.q15_manufacturing !== "no") out.push("produktion");
  if (!services && (a.q16_purchasing === "simple" || a.q16_purchasing === "mrp")) out.push("inkop");
  if (!services && (a.q6_export === "some" || a.q6_export === "extensive")) out.push("transport");
  if (services) out.push("projekt");
  if (a.q10_systems_count === "2-3" || a.q10_systems_count === "4+") out.push("integration");
  return out;
}

/** Läser förvalda områden för kravspecen; okända id:n ignoreras. */
export function readKravAreas(search: string): string[] {
  const raw = new URLSearchParams(search).get("omraden");
  if (!raw) return [];
  return [...new Set(raw.split(",").filter((id) => KRAV_AREA_IDS.includes(id)))];
}

/** Bygger länkarna i verktygskedjan så att testsvaren följer med till nästa verktyg. */
export function fscmChainLinks(answers: Answers, level: ScoreResult["level"], profile: BuyerProfile) {
  const roi = new URLSearchParams();
  const rev = REVENUE_MIDPOINT_SEK[String(answers.q2_revenue ?? "")];
  if (rev) roi.set("oms", String(rev));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);

  const krav = new URLSearchParams();
  const ind =
    TEST_INDUSTRY_TO_NAME[String(answers.q3_industry ?? "")] ??
    (typeof profile?.company?.industry === "string" ? industryNameFromSlug(profile.company.industry) : undefined);
  if (ind) krav.set("bransch", ind);
  const size = EMPLOYEES_TO_SIZE[String(answers.q1_employees ?? "")];
  if (size) krav.set("storlek", size);
  krav.set("omraden", kravAreasFromAnswers(answers).join(","));

  const kq = krav.toString();
  return {
    roi: `/finance-supply-chain/roi-kalkylator/?${roi.toString()}`,
    kravspec: `/kravspecifikation/${kq ? `?${kq}` : ""}`,
    partners: `/valjdynamics365partner/?${filtersToSearch(deriveCompareFilters(profile))}`,
  };
}

/** Läser förifyllda värden för kalkylatorn; okända värden ignoreras. */
export function readRoiPrefill(search: string): { revenue?: number; complexity?: "Låg" | "Medel" | "Hög" } {
  const sp = new URLSearchParams(search);
  const out: { revenue?: number; complexity?: "Låg" | "Medel" | "Hög" } = {};
  const oms = Number(sp.get("oms"));
  if (Number.isFinite(oms) && oms > 0 && oms <= 100_000_000_000) out.revenue = oms;
  const k = sp.get("komplexitet");
  if (k === "Låg" || k === "Medel" || k === "Hög") out.complexity = k;
  return out;
}
