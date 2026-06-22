/**
 * Poängberäkning för F&SCM-matchningstestet.
 * Funktionsorienterad: returnerar profil per behovsområde (0–100) snarare än mognadsbetyg.
 * Profiler kan vara "not_applicable" – då exkluderas de och övriga vikter skalas upp.
 */

import { QUESTIONS, type Answers, type Question } from "@/data/fscmMatchningstest";

export type ProfileKey = "concern" | "supplyChain" | "project" | "commerce";

export type ProfileScore = number | "not_applicable";

export interface ScoreResult {
  concern: ProfileScore;
  supplyChain: ProfileScore;
  project: ProfileScore;
  commerce: ProfileScore;
  maturity: number;
  total: number;
  level: "strong" | "partial" | "oversized";
}

const isServicesOnly = (a: Answers): boolean => a.q3_industry === "tjanster";

const PROFILE_LABEL: Record<ProfileKey, string> = {
  concern: "Koncernkomplexitet",
  supplyChain: "Supply chain-komplexitet",
  project: "Projektkomplexitet",
  commerce: "Handelskomplexitet",
};

export const profileLabel = (k: ProfileKey): string => PROFILE_LABEL[k];

const PROFILE_WEIGHTS: Record<ProfileKey, number> = {
  concern: 0.35,
  supplyChain: 0.3,
  project: 0.15,
  commerce: 0.2,
};

const QMAP: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

const pointsFor = (qid: string, answers: Answers): number => {
  const q = QMAP[qid];
  const v = answers[qid];
  if (!q || v === undefined) return 0;
  const opt = q.options.find((o) => o.value === v);
  return opt?.points ?? 0;
};

const normalize = (sum: number, max: number): number => {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((sum / max) * 100)));
};

// ---- Profilberäkning ----

const concernScore = (a: Answers): number => {
  const sum =
    pointsFor("q4_legal_entities", a) +
    pointsFor("q5_intl_entities", a) +
    pointsFor("q6_export", a) +
    pointsFor("q7_consolidation", a) +
    pointsFor("q8_intercompany", a) +
    pointsFor("q9_multicurrency", a) +
    pointsFor("q12_regulatory", a);
  return normalize(sum, 140);
};

const supplyChainScore = (a: Answers): ProfileScore => {
  if (isServicesOnly(a)) return "not_applicable";
  const warehousePart =
    a.q13_warehouse === "yes"
      ? pointsFor("q13_warehouse", a) + pointsFor("q14_warehouse_complexity", a)
      : 0;
  const sum =
    warehousePart +
    pointsFor("q15_manufacturing", a) +
    pointsFor("q16_purchasing", a) +
    pointsFor("q17_forecasting", a) +
    pointsFor("q18_traceability", a);
  return normalize(sum, 110);
};

const projectScore = (a: Answers): ProfileScore => {
  if (a.q19_project_sales !== "yes") return "not_applicable";
  const sum =
    pointsFor("q19_project_sales", a) +
    pointsFor("q20_project_integration", a) +
    pointsFor("q21_resource_planning", a);
  return normalize(sum, 100);
};

const commerceScore = (a: Answers): ProfileScore => {
  if (isServicesOnly(a)) return "not_applicable";
  if (a.q22_ecommerce === "no" && (a.q24_omnichannel === "no" || a.q24_omnichannel === undefined))
    return "not_applicable";
  const ecomPart =
    a.q22_ecommerce !== "no"
      ? pointsFor("q22_ecommerce", a) + pointsFor("q23_ecom_integration", a)
      : 0;
  const sum = ecomPart + pointsFor("q24_omnichannel", a);
  return normalize(sum, 100);
};

const maturityScore = (a: Answers): number => {
  const v25 = pointsFor("q25_growth_capacity", a);
  const v26 = pointsFor("q26_ai_importance", a);
  return Math.round((v25 + v26) / 2);
};

const weightedTotal = (parts: Record<ProfileKey, ProfileScore>): number => {
  const active = (Object.keys(PROFILE_WEIGHTS) as ProfileKey[]).filter(
    (k) => parts[k] !== "not_applicable",
  );
  const weightSum = active.reduce((s, k) => s + PROFILE_WEIGHTS[k], 0);
  if (weightSum === 0) return 0;
  const weighted = active.reduce((s, k) => {
    const v = parts[k] as number;
    return s + v * (PROFILE_WEIGHTS[k] / weightSum);
  }, 0);
  return Math.round(weighted);
};

export const levelFromTotal = (total: number): ScoreResult["level"] => {
  if (total >= 70) return "strong";
  if (total >= 45) return "partial";
  return "oversized";
};

export const calculateScore = (answers: Answers): ScoreResult => {
  const concern = concernScore(answers);
  const supplyChain = supplyChainScore(answers);
  const project = projectScore(answers);
  const commerce = commerceScore(answers);
  const maturity = maturityScore(answers);
  const total = weightedTotal({ concern, supplyChain, project, commerce });
  return {
    concern,
    supplyChain,
    project,
    commerce,
    maturity,
    total,
    level: levelFromTotal(total),
  };
};

/** De tre högsta delprofilerna (exkluderar "not_applicable"). Sorterat fallande. */
export const topProfiles = (
  result: ScoreResult,
  n = 3,
): { key: ProfileKey; score: number }[] => {
  const entries: { key: ProfileKey; score: number }[] = (
    ["concern", "supplyChain", "project", "commerce"] as ProfileKey[]
  )
    .map((k) => ({ key: k, score: result[k] }))
    .filter((e): e is { key: ProfileKey; score: number } => typeof e.score === "number")
    .sort((a, b) => b.score - a.score);
  return entries.slice(0, n);
};
