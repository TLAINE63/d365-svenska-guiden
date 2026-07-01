/**
 * Generisk scoring för CRM-produkternas matchningstest.
 * Konfigureras av ProductConfig i src/data/crmMatchningstestConfigs.ts.
 */

import type { Answers, ProductConfig, Profile } from "@/data/crmMatchningstestConfigs";

export type ProfileScore = number | "not_applicable";

export interface CrmScoreResult {
  perProfile: { key: string; label: string; score: ProfileScore }[];
  total: number;
  level: "strong" | "partial" | "oversized";
}

const pointsForQuestion = (
  qid: string,
  answers: Answers,
  config: ProductConfig,
): number => {
  const q = config.questions.find((x) => x.id === qid);
  if (!q) return 0;
  const v = answers[q.id];
  if (v === undefined) return 0;
  const opt = q.options.find((o) => o.value === v);
  return opt?.points ?? 0;
};

const maxForQuestion = (qid: string, config: ProductConfig): number => {
  const q = config.questions.find((x) => x.id === qid);
  if (!q) return 0;
  return Math.max(0, ...q.options.map((o) => o.points));
};

const scoreProfile = (
  profile: Profile,
  answers: Answers,
  config: ProductConfig,
): ProfileScore => {
  if (profile.notApplicableIf?.(answers)) return "not_applicable";
  const qs = config.questions.filter((q) => q.profile === profile.key);
  if (qs.length === 0) return 0;
  const sum = qs.reduce((s, q) => s + pointsForQuestion(q.id, answers, config), 0);
  const max = qs.reduce((s, q) => s + maxForQuestion(q.id, config), 0);
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((sum / max) * 100)));
};

export const levelFromTotal = (total: number): CrmScoreResult["level"] => {
  if (total >= 70) return "strong";
  if (total >= 45) return "partial";
  return "oversized";
};

export const calculateCrmScore = (
  answers: Answers,
  config: ProductConfig,
): CrmScoreResult => {
  const perProfile = config.profiles.map((p) => ({
    key: p.key,
    label: p.label,
    score: scoreProfile(p, answers, config),
  }));
  const active = perProfile.filter(
    (p): p is { key: string; label: string; score: number } => typeof p.score === "number",
  );
  const activeProfiles = config.profiles.filter((p) =>
    active.some((a) => a.key === p.key),
  );
  const weightSum = activeProfiles.reduce((s, p) => s + p.weight, 0);
  let total = 0;
  if (weightSum > 0) {
    total = Math.round(
      active.reduce((s, a) => {
        const w = activeProfiles.find((p) => p.key === a.key)?.weight ?? 0;
        return s + a.score * (w / weightSum);
      }, 0),
    );
  }
  return { perProfile, total, level: levelFromTotal(total) };
};

export const topCrmProfiles = (
  result: CrmScoreResult,
  n = 3,
): { key: string; label: string; score: number }[] =>
  result.perProfile
    .filter((p): p is { key: string; label: string; score: number } => typeof p.score === "number")
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
