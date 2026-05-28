// Poängsättning, band, rekommendationer och processflaggor för
// Beslutsmognadsindex. Spec: Volym 01, alla fem dimensioner lika viktade.

import type { Dimension } from "@/data/beslutsmognadQuestions";

export type Band = "Utforskande" | "Förberedande" | "Mogen" | "Beslutsklar";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  behovsbild: "Behovsbild",
  samsyn: "Intern samsyn",
  riskinsikt: "Riskinsikt",
  partnermarknad: "Partnermarknad",
  beslutsstruktur: "Beslutsstruktur",
};

export const DIMENSION_CODES: Record<Dimension, string> = {
  behovsbild: "D2",
  samsyn: "D3",
  riskinsikt: "D4",
  partnermarknad: "D5",
  beslutsstruktur: "D6",
};

// Prioritering vid lika poäng: intern mognad före partnerkunskap.
const TIEBREAK_ORDER: Dimension[] = [
  "behovsbild",
  "samsyn",
  "riskinsikt",
  "beslutsstruktur",
  "partnermarknad",
];

export type DimensionMeans = Partial<Record<Dimension, number>>; // 1–5 medel
export type DimensionScores = Record<Dimension, number>;          // 0–100

export function normalize(mean: number): number {
  // (medel − 1) / 4 × 100. Clamp till [0,100].
  if (!Number.isFinite(mean) || mean <= 0) return 0;
  return Math.max(0, Math.min(100, ((mean - 1) / 4) * 100));
}

export function toDimensionScores(means: DimensionMeans): DimensionScores {
  const out = {} as DimensionScores;
  (Object.keys(DIMENSION_LABELS) as Dimension[]).forEach((d) => {
    out[d] = normalize(means[d] ?? 0);
  });
  return out;
}

export function totalIndex(scores: DimensionScores): number {
  const dims = Object.values(scores);
  if (!dims.length) return 0;
  return dims.reduce((s, n) => s + n, 0) / dims.length;
}

export function bandFor(score: number): Band {
  if (score <= 40) return "Utforskande";
  if (score <= 60) return "Förberedande";
  if (score <= 80) return "Mogen";
  return "Beslutsklar";
}

export function bandLevel(score: number): "low" | "mid" | "high" {
  if (score <= 40) return "low";
  if (score <= 60) return "mid";
  return "high";
}

// ─────────────────────────── Rekommendationstexter ───────────────────────────

type LevelTexts = { low: string; mid: string; high: string };

export const RECOMMENDATIONS: Record<Dimension, LevelTexts> = {
  behovsbild: {
    low:
      "Era affärsproblem är ännu inte tillräckligt formulerade för att styra ett systemval. Samla beslutsgruppen och skriv ner de tre till fem konkreta affärsproblem ni vill lösa, i verksamhetstermer och inte systemtermer. Definiera samtidigt hur ni ska mäta om de är lösta. Utan detta riskerar ni att köpa en lösning på ett odefinierat problem.",
    mid:
      "Ni har en bild av era behov, men den behöver skärpas. Separera tydligt absoluta krav från önskemål, och säkerställ att kraven utgår från vart verksamheten ska, inte från vad nuvarande system saknar. Komplettera med tydliga framgångsmått innan ni går vidare till leverantörsdialog.",
export const RECOMMENDATIONS: Record<Dimension, LevelTexts> = {
  behovsbild: {
    low:
      "Era affärsproblem är ännu inte tillräckligt formulerade för att styra ett val av {systemterm}. Samla beslutsgruppen och skriv ner de tre till fem konkreta affärsproblem ni vill lösa, i verksamhetstermer och inte systemtermer. Definiera samtidigt hur ni ska mäta om de är lösta. Utan detta riskerar ni att köpa en lösning på ett odefinierat problem.",
    mid:
      "Ni har en bild av era behov, men den behöver skärpas. Separera tydligt absoluta krav från önskemål, och säkerställ att kraven utgår från vart verksamheten ska, inte från vad nuvarande system saknar. Komplettera med tydliga framgångsmått innan ni går vidare till leverantörsdialog.",
    high:
      "Er behovsbild är välformulerad och verksamhetsdriven. Bevara den disciplinen genom utvärderingen: låt kravbilden, inte leverantörernas demos, styra vad ni bedömer.",
  },
  samsyn: {
    low:
      "De berörda funktionerna och IT har ännu inte en gemensam bild av varför projektet görs. Det är den vanligaste orsaken till att den här typen av projekt spårar ur. Utse en tydlig ägare med mandat, och håll ett gemensamt möte där ni enas om projektets syfte och om vad som händer om ni inte gör något. Gå inte vidare till leverantörer förrän den samsynen finns.",
    mid:
      "Det finns en grundläggande samsyn, men ägarskapet eller mötesdisciplinen är otydlig. Definiera vem som äger beslutet och inför en fast mötesrytm för just den här frågan. Säkerställ också att alla i gruppen delar bilden av kostnaden för att inte agera.",
    high:
      "Beslutsgruppen är samstämmig och ägarskapet är tydligt. Det är en stark grund. Håll mötesrytmen igång genom hela utvärderingen så att samsynen inte eroderar när detaljerna kommer.",
  },
  riskinsikt: {
    low:
      "Ni har ännu inte kartlagt de största riskerna med ett systembyte. Notera särskilt att de flesta sådana projekt inte fallerar tekniskt utan organisatoriskt: förändringsmotstånd, kompetensbrist och svag adoption. Gör en riskinventering där varje större risk får en utpekad ägare med åtgärdsmandat, och planera redan nu för att scope växer och budget pressas, eftersom det är regel snarare än undantag.",
    mid:
      "Ni ser riskerna men hanteringen är ojämn. Säkerställ att varje större risk har en ägare med mandat att agera, och att de organisatoriska riskerna får lika mycket utrymme som de tekniska. Lägg in en realistisk buffert för scope och budget.",
    high:
      "Er riskbild är mogen och balanserad, med ägarskap och realistiska antaganden om scope och budget. Bibehåll den realismen när leverantörernas optimism möter er i utvärderingen.",
  },
  partnermarknad: {
    low:
      "Er överblick över partnermarknaden är ännu begränsad. Innan ni går in i dialoger, skaffa en strukturerad bild av vilka partners som är aktiva, hur de skiljer sig i storlek, branschfokus, leveransmodell och ägarstruktur, och vilka fallgropar som är vanligast. En partner väljs bäst mot en känd marknad, inte mot de tre första som hör av sig.",
    mid:
      "Ni känner till marknaden men har inte utvärderat partners på djupet. Gå bortom säljmötet: undersök leveransmodell, faktiska referenser och vad som hänt i deras tidigare projekt. Förstå skillnaden mellan en partner som säljer och en som levererar.",
    high:
      "Ni har god överblick över partnermarknaden och dess skillnader. Använd den kunskapen för att ställa de svåra frågorna tidigt, innan ni investerar tid i en specifik partner.",
  },


export type Recommendation = {
  dimension: Dimension;
  code: string;
  label: string;
  score: number;
  band: Band;
  text: string;
};

export function topRecommendations(
  scores: DimensionScores,
  count = 3
): Recommendation[] {
  const sorted = (Object.keys(scores) as Dimension[]).sort((a, b) => {
    const diff = scores[a] - scores[b];
    if (diff !== 0) return diff;
    // Lika poäng → fast prioritering (D2, D3, D4, D6, D5)
    return TIEBREAK_ORDER.indexOf(a) - TIEBREAK_ORDER.indexOf(b);
  });

  return sorted.slice(0, count).map((d) => {
    const score = scores[d];
    const level = bandLevel(score);
    return {
      dimension: d,
      code: DIMENSION_CODES[d],
      label: DIMENSION_LABELS[d],
      score,
      band: bandFor(score),
      text: RECOMMENDATIONS[d][level],
    };
  });
}

// ─────────────────────────── Processflaggor ──────────────────────────────────

export type ProcessFlag = {
  id: "A" | "B" | "C";
  title: string;
  text: string;
};

export function processFlag(
  evalStage: string | undefined,
  scores: DimensionScores,
  total: number
): ProcessFlag | null {
  const stage = evalStage ?? "";

  // A · Långt fram med svagt underlag
  if ((stage === "rfp" || stage === "valt") && total < 61) {
    return {
      id: "A",
      title: "Långt fram med svagt underlag",
      text: `Ni är långt fram i processen, men er beslutsmognad ligger på ${bandFor(
        total
      )}-nivå. Det är en risksignal: ni riskerar att fatta ett stort beslut på ett underlag som ännu inte bär. Överväg att pausa och täppa till de största luckorna nedan innan ni går vidare.`,
    };
  }

  // B · Utvärderar utan att vara rustad
  if (stage === "lev" || stage === "rfp") {
    const lowDims: string[] = [];
    if (scores.partnermarknad <= 40) lowDims.push("Partnermarknad");
    if (scores.beslutsstruktur <= 40) lowDims.push("Beslutsstruktur");
    if (lowDims.length) {
      return {
        id: "B",
        title: "Utvärderar utan att vara rustad",
        text: `Ni har börjat titta på partners, men er förmåga att jämföra dem strukturerat är ännu låg. Det ökar risken att valet styrs av vem som är mest övertygande snarare än vem som levererar bäst. Prioritera att stärka ${lowDims.join(
          " och "
        )} parallellt med utvärderingen.`,
      };
    }
  }

  // C · Naturlig startpunkt
  if ((stage === "borjat" || stage === "inget") && total < 61) {
    return {
      id: "C",
      title: "Naturlig startpunkt",
      text:
        "Er position är väntad för där ni befinner er i processen. Låga poäng här är inte en svaghet utan en naturlig startpunkt. Rekommendationerna nedan visar vad ni bör ha på plats innan ni går in i leverantörsdialog.",
    };
  }

  return null;
}

export type AssessmentResult = {
  scores: DimensionScores;
  total: number;
  totalBand: Band;
  recommendations: Recommendation[];
  flag: ProcessFlag | null;
};

export function buildResult(
  means: DimensionMeans,
  evalStage?: string
): AssessmentResult {
  const scores = toDimensionScores(means);
  const total = totalIndex(scores);
  return {
    scores,
    total,
    totalBand: bandFor(total),
    recommendations: topRecommendations(scores),
    flag: processFlag(evalStage, scores, total),
  };
}
