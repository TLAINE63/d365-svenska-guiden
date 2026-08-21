import { Partner } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";
import { getCardAiSummary, shortenIndustry } from "@/lib/partnerCardSummary";

type CardPartner = Partner | DatabasePartner;

function isDatabasePartner(p: CardPartner): p is DatabasePartner {
  return "product_filters" in p && "slug" in p;
}

const GENERIC_WORDS = [
  "kvalitet",
  "kompetens",
  "erfarenhet",
  "innovativ",
  "innovation",
  "komplett",
  "helhet",
  "trygg",
  "modern",
];

function isGeneric(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (t.length < 3) return true;
  // Only reject when the whole factor is essentially a generic word
  return GENERIC_WORDS.some((w) => t === w || t === `${w}er` || t === `hög ${w}`);
}

function firstSentences(text: string, maxSentences = 2, maxChars = 190): string {
  const parts = text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]?/g);
  if (!parts) return text.slice(0, maxChars);
  let out = "";
  for (const part of parts.slice(0, maxSentences)) {
    if ((out + part).length > maxChars && out) break;
    out += part;
  }
  out = out.trim();
  if (out.length > maxChars) out = `${out.slice(0, maxChars - 1).trimEnd()}…`;
  return out;
}

/**
 * "d365.se:s bedömning" – saklig och differentierande text för resultatkortet.
 * Prioriterar den fördjupade analysen (mer substans) och faller tillbaka på
 * kortsammanfattning, positionering eller beskrivning.
 */
export function getResultAssessment(p: CardPartner): string | null {
  const MAX_SENTENCES = 3;
  const MAX_CHARS = 360;

  if (isDatabasePartner(p)) {
    const full = p.ai_summary_full?.trim();
    if (full) {
      const text = firstSentences(full, MAX_SENTENCES, MAX_CHARS);
      // Om fördjupningen är för mager, komplettera med kortsammanfattningen
      if (text.length >= 120) return text;
      const card = getCardAiSummary(p);
      if (card && card.length > text.length) return firstSentences(card, MAX_SENTENCES, MAX_CHARS);
      return text;
    }
  }

  const card = getCardAiSummary(p);
  if (card) return firstSentences(card, MAX_SENTENCES, MAX_CHARS);
  if (isDatabasePartner(p) && p.positioning_statement?.trim()) {
    return firstSentences(p.positioning_statement.trim(), MAX_SENTENCES, MAX_CHARS);
  }
  if (p.description?.trim()) return firstSentences(p.description.trim(), MAX_SENTENCES, MAX_CHARS);
  return null;
}


function normalizeFactor(raw: string): string | null {
  let t = raw.replace(/\s+/g, " ").trim();
  if (!t) return null;
  // Behåll bara första ledet i längre meningar
  t = t.split(/[.;–—]|\s+samt\s+/)[0].trim();
  t = t.replace(/^(bolag|företag|kunder|verksamheter)\s+(som|med|inom)\s+/i, "");
  t = t.replace(/^dynamics 365\s+/i, "").replace(/^d365\s+/i, "");
  t = shortenIndustry(t);
  if (t.length > 34) t = `${t.slice(0, 33).trimEnd()}…`;
  if (isGeneric(t)) return null;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Nyckelord som motsvarar användarens valda produktområde – dessa upprepar filtret. */
function productEchoPatterns(product?: string | null): RegExp[] {
  if (!product) return [];
  const p = product.toLowerCase();
  if (/finance|scm|supply/.test(p)) {
    return [/finance/i, /supply chain/i, /f&scm/i, /fscm/i];
  }
  if (/business central|\bbc\b/.test(p)) {
    return [/business central/i, /^bc$/i];
  }
  if (/sales|sälj|marknad|crm/.test(p)) {
    return [/^sales$/i, /^crm$/i, /customer insights/i];
  }
  if (/service/.test(p)) {
    return [/customer service/i, /field service/i, /kundservice/i];
  }
  if (/commerce/.test(p)) return [/commerce/i];
  return [];
}

/**
 * "Särskilt relevant för" – max 3 relativa styrkor. Speglar aldrig användarens filter.
 */
export function getRelevanceFactors(
  p: CardPartner,
  opts: { highlightedIndustry?: string | null; highlightedProduct?: string | null } = {},
): string[] {
  const skip = new Set(
    [opts.highlightedIndustry, opts.highlightedProduct]
      .filter(Boolean)
      .map((v) => shortenIndustry(String(v)).toLowerCase()),
  );
  const echoes = productEchoPatterns(opts.highlightedProduct);

  const candidates: string[] = [];
  if (isDatabasePartner(p)) {
    for (const tag of p.ai_tags || []) candidates.push(tag);
    for (const fit of p.best_fit_for || []) candidates.push(fit);
  }

  const out: string[] = [];
  const seen = new Set<string>();
  for (const c of candidates) {
    const n = normalizeFactor(c);
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key) || skip.has(key)) continue;
    // Kombinationer (t.ex. "BC + F&SCM", "ERP + CRM") är differentierande och behålls
    const isCombination = /\s(\+|&|och)\s/.test(n) && n.length <= 34;
    if (!isCombination && echoes.some((re) => re.test(n))) continue;
    seen.add(key);
    out.push(n);
    if (out.length === 3) break;
  }
  return out;
}


/**
 * "Dokumenterad erfarenhet" – visas bara när det finns strukturerad data att belägga.
 * Aldrig påhittade kund- eller projektantal.
 *
 * När användaren filtrerat på en bransch (focusIndustry) visas bara erfarenhet
 * som gäller den branschen – annars döljs raden, så att kortet inte pekar på
 * andra branscher än den som söktes fram.
 */
export function getDocumentedEvidence(
  p: CardPartner,
  opts?: { productKey?: string | null; focusIndustry?: string | null },
): string | null {
  if (!isDatabasePartner(p)) return null;

  const focus = opts?.focusIndustry?.trim() || null;
  const productKey = opts?.productKey || null;
  const pf = productKey ? (p.product_filters as Record<string, { industries?: string[] }> | undefined)?.[productKey] : undefined;

  const uniq = (arr: string[]) => Array.from(new Set(arr.map((s) => (s || "").trim()).filter(Boolean)));
  const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

  // Branscher som är relevanta i den aktuella vyn
  const contextIndustries = uniq([
    ...((pf?.industries as string[]) || []),
    ...((p.industries as string[]) || []),
    ...((p.secondary_industries as string[]) || []),
  ]);

  const pitchIndustries = uniq(
    ((p.industry_pitches || []) as Array<{ industry?: string }>).map((x) => x?.industry || ""),
  );
  const appIndustries = uniq(
    ((p.industry_apps || []) as Array<{ industry?: string }>).map((x) => x?.industry || ""),
  );

  // Alla branscher partnern kan beläggas inom
  const documented = uniq([...pitchIndustries, ...appIndustries, ...contextIndustries]);

  if (focus) {
    const hasFocus = documented.some((i) => same(i, focus));
    if (!hasFocus) return null;
    const label = shortenIndustry(focus);
    if (appIndustries.some((i) => same(i, focus))) {
      return `Specialiserad branschlösning för ${label}.`;
    }
    if ((p.customer_examples || []).length > 0) {
      return `Kundcase inom ${label}.`;
    }
    if (pitchIndustries.some((i) => same(i, focus))) {
      return `Dokumenterad leveranserfarenhet inom ${label}.`;
    }
    return null;
  }

  // Utan branschfilter: beskriv erfarenheten inom det aktuella produktområdet
  const scope = uniq(
    (pf?.industries as string[])?.length
      ? (pf!.industries as string[])
      : [...pitchIndustries, ...appIndustries, ...((p.industries as string[]) || [])],
  )
    .slice(0, 2)
    .map(shortenIndustry);

  if ((p.customer_examples || []).length > 0) {
    return scope.length ? `Kundcase inom ${scope.join(" och ")}.` : "Dokumenterade kundcase via d365.se.";
  }

  if (appIndustries.length > 0) {
    const apps = appIndustries.slice(0, 2).map(shortenIndustry);
    return apps.length
      ? `Specialiserad branschlösning för ${apps.join(" och ")}.`
      : "Egen branschlösning på Microsoft Marketplace.";
  }

  if (pitchIndustries.length > 0 && scope.length) {
    return `Dokumenterad leveranserfarenhet inom ${scope.join(" och ")}.`;
  }

  return null;
}

