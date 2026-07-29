import { BC_QUESTIONS, type BcAnswers, type BcClassification, type BcSignal, bcVisibleQuestions } from "@/data/bcMatchningstest";

export type { BcClassification, BcSignal } from "@/data/bcMatchningstest";

export interface BcResult {
  signals: BcSignal[];
  byClassification: Record<BcClassification, BcSignal[]>;
  overall: "good_fit" | "fit_with_isv" | "stretch" | "outside";
  headline: string;
  body: string;
  segmentLabel: string;
}

const CLASS_LABEL: Record<BcClassification, string> = {
  essentials: "Ingår i BC Essentials (standard)",
  premium: "Kräver BC Premium",
  config: "Kräver konfiguration",
  isv: "Kräver tilläggsapp (Microsoft Marketplace)",
  outside: "Ligger utanför BC – annan plattform",
};

const SEGMENT_LABEL: Record<string, string> = {
  tillverkning: "Tillverkning och industri",
  grossist: "Grossist, handel och distribution",
  bygg: "Bygg och fastighet",
  tjanste: "Tjänste- och projektbolag",
  offentlig: "Offentlig sektor och non-profit",
  finans: "Finans och försäkring",
};

export function bcClassificationLabel(c: BcClassification): string {
  return CLASS_LABEL[c];
}

export function calculateBcResult(answers: BcAnswers): BcResult {
  const signals: BcSignal[] = [];
  const seen = new Set<string>();
  for (const q of bcVisibleQuestions(answers)) {
    const v = answers[q.id];
    if (v === undefined) continue;
    const values = Array.isArray(v) ? v : [v];
    for (const val of values) {
      const opt = q.options.find((o) => o.value === val);
      if (!opt?.signals) continue;
      for (const s of opt.signals) {
        const key = `${s.classification}:${s.area}`;
        if (seen.has(key)) continue;
        seen.add(key);
        signals.push(s);
      }
    }
  }

  const byClassification: Record<BcClassification, BcSignal[]> = {
    essentials: [],
    premium: [],
    config: [],
    isv: [],
    outside: [],
  };
  for (const s of signals) byClassification[s.classification].push(s);

  const outsideCount = byClassification.outside.length;
  const isvCount = byClassification.isv.length;

  let overall: BcResult["overall"];
  let headline: string;
  let body: string;
  if (outsideCount >= 3) {
    overall = "outside";
    headline = "Business Central är sannolikt inte rätt val";
    body =
      "Era svar pekar på flera områden som ligger utanför Business Centrals naturliga räckvidd. " +
      "Det betyder inte att BC är fel överallt – men dimensionerande behov bör utvärderas mot Finance & Supply Chain Management eller specialiserade branschsystem innan ni går vidare.";
  } else if (outsideCount >= 1 && (outsideCount + isvCount) >= 4) {
    overall = "stretch";
    headline = "Business Central räcker – men kräver beslut om gränser";
    body =
      "BC kan täcka huvuddelen av era behov, men några av era krav ligger på gränsen eller utanför. " +
      "Ni behöver tidigt i utvärderingen avgöra om dessa behov löses i BC (med ISV/konfiguration) eller om de hör hemma i andra system.";
  } else if (isvCount >= 3) {
    overall = "fit_with_isv";
    headline = "Business Central passar – kombinerat med branschtillägg";
    body =
      "Era svar indikerar att BC är en bra grund, men att ni behöver komplettera med ett par tilläggsappar för att täcka branschspecifika behov. Börja med att titta i vår ISV-katalog för Business Central – där hittar ni de vanligaste svenska alternativen kategoriserade. " +
      "Om inget passar finns fler appar att söka via Microsoft Marketplace.";
  } else {
    overall = "good_fit";
    headline = "Business Central matchar era behov väl";
    body =
      "Era svar tyder på att Business Central – främst i Essentials- eller Premium-form – täcker era behov utan tunga branschtillägg. " +
      "Fokus i utvärderingen blir då snarare partner, implementationsmetod och pris än produktval.";
  }

  const segmentLabel = SEGMENT_LABEL[(answers.q_segment as string) || ""] || "";

  return { signals, byClassification, overall, headline, body, segmentLabel };
}

/** Required questions are all visible ones in current answers state. */
export function bcRequiredCount(answers: BcAnswers): number {
  return bcVisibleQuestions(answers).length;
}

export const BC_TOTAL_MAX = BC_QUESTIONS.length;
