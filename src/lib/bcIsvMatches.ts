/**
 * Kopplar tilläggsbehov ("isv") i BC-matchningstestet till kategorier i tilläggskatalogen.
 * Redaktionella nyckelordsregler över behovets namn; inget matchar = inga förslag (aldrig gissat).
 * Urval: dokumenterad verifiering och nordisk relevans, högst en per leverantör, aldrig kommersiell status.
 */
import type { IsvSolution } from "@/data/bcIsvSolutions";

const RULES: Array<{ re: RegExp; categories: string[] }> = [
  { re: /AP-automation|leverantörsfaktur/i, categories: ["AP automation"] },
  { re: /EDI/i, categories: ["EDI / e-faktura"] },
  { re: /IFRS|budget|prognos/i, categories: ["Rapportering / FP&A"] },
  { re: /3PL|WMS|lager|Cross-docking/i, categories: ["WMS", "Supply chain collaboration"] },
  { re: /TMS/i, categories: ["Frakt & TA"] },
  { re: /Shopify|E-handel|B2B-kundportal|portal|kanaler/i, categories: ["E-handel"] },
  { re: /sortiment|varianter/i, categories: ["PIM", "Retail / POS"] },
  { re: /prissättning|konfigurator/i, categories: ["CPQ"] },
  { re: /APS|planering|MES/i, categories: ["Planering & produktion", "MES / Shop floor"] },
  { re: /PLM|PDM/i, categories: ["PLM / Engineering"] },
  { re: /Kvalitet|spårbarhet/i, categories: ["Quality management"] },
  { re: /Underhåll/i, categories: ["Asset Management / EAM"] },
  { re: /prenumeration|Abonnemang|Usage billing|XaaS/i, categories: ["Subscription billing"] },
  { re: /projekt|ÄTA|UE-uppföljning|Tid- och utlägg|Vidarefakturering|Resurs|uppdragsvolym|vinstavräkning|intäktsredovisning/i, categories: ["Projekt"] },
  { re: /integration/i, categories: ["Integration / iPaaS"] },
  { re: /Bygg|Fastighet|hyresavtal|Hyresavtal|Process|recept|Recept|Råvaru|Medtech|ETO|entrepren|hantverkare|IMD|Medlem|medlem|kontingent|Branschorganisation|Ideell|bidrag|Bidrag|Fond|Anslag|90-konto|Finansiellt/i, categories: ["Branschpaket"] },
];

export function categoriesForBcArea(area: string): string[] {
  const out = new Set<string>();
  for (const r of RULES) if (r.re.test(area)) r.categories.forEach((c) => out.add(c));
  return [...out];
}

const isBc = (s: IsvSolution) => !s.products?.length || s.products.includes("Business Central");

const evidence = (s: IsvSolution): number => {
  const tier = (s.editorialTier || s.tier || "").toLowerCase();
  return (tier.includes("1") ? 3 : tier.includes("2") ? 1 : 0) + (s.nordicRelevance === "high" ? 2 : 0) + (s.verifiedAt ? 1 : 0);
};

export interface BcIsvMatch { area: string; categories: string[]; solutions: IsvSolution[] }

/** Max `perArea` lösningar per behov, högst en per leverantör per behov; behov utan träff utelämnas. */
export function matchBcIsvAreas(areas: string[], all: IsvSolution[], perArea = 3): BcIsvMatch[] {
  const bc = all.filter(isBc);
  const out: BcIsvMatch[] = [];
  for (const area of areas) {
    const categories = categoriesForBcArea(area);
    if (!categories.length) continue;
    const ranked = bc
      .filter((s) => categories.includes(s.category))
      .sort((a, b) => evidence(b) - evidence(a) || a.name.localeCompare(b.name, "sv"));
    const vendors = new Set<string>();
    const solutions: IsvSolution[] = [];
    for (const s of ranked) {
      if (solutions.length >= perArea) break;
      if (vendors.has(s.vendor)) continue;
      vendors.add(s.vendor);
      solutions.push(s);
    }
    if (solutions.length) out.push({ area, categories, solutions });
  }
  return out;
}
