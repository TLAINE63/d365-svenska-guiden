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

/** Bygger länkarna i verktygskedjan så att testsvaren följer med till nästa verktyg. */
export function fscmChainLinks(answers: Answers, level: ScoreResult["level"], profile: BuyerProfile) {
  const roi = new URLSearchParams();
  const rev = REVENUE_MIDPOINT_SEK[String(answers.q2_revenue ?? "")];
  if (rev) roi.set("oms", String(rev));
  roi.set("komplexitet", COMPLEXITY_FROM_LEVEL[level]);

  const krav = new URLSearchParams();
  const ind = typeof profile.company?.industry === "string" ? industryNameFromSlug(profile.company.industry) : undefined;
  if (ind) krav.set("bransch", ind);

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
