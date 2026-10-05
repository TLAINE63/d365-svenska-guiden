import { getPartnerSelectionFacts, type SelectionPartner } from "@/lib/partnerSelectionFacts";
import { nowrapBrand } from "@/lib/nowrapBrand";
const ALL_LABELS = ["Produktområde", "Bransch", "Typisk kundstorlek", "Geografisk kapacitet", "Implementationskompetens", "Förvaltning/support", "Relevant specialisering"];
// Etiketter som hör hemma på den fullständiga profilen, inte i partnerkortlistor.
const CARD_HIDDEN_LABELS = ["Implementationskompetens", "Förvaltning/support", "Relevant specialisering"];
export const MISSING_TEXT = "Uppgifter saknas i profilen";
export default function PartnerSelectionFacts({ partner, productKey, showMissing, showAll }: { partner: SelectionPartner; productKey?: string | null; showMissing?: boolean; showAll?: boolean }) {
  const found = getPartnerSelectionFacts(partner, productKey);
  const facts = (showMissing ? ALL_LABELS.map((label) => found.find((f) => f.label === label) ?? { label, value: MISSING_TEXT }) : found)
    .filter((f) => showAll || !CARD_HIDDEN_LABELS.includes(f.label));
  if (!facts.length) return null;
  return <section data-partner-selection-facts className="my-4 min-w-0 border-t border-border pt-3" aria-label="Registrerade partneruppgifter">
    <h4 className="mb-2 text-xs font-semibold text-foreground">Underlag för ert partnerval</h4>
    <dl className="space-y-2 text-xs leading-relaxed">{facts.map(f => <div key={f.label}><dt className="font-semibold text-foreground">{f.label}</dt><dd className="whitespace-pre-line break-words text-muted-foreground">{nowrapBrand(f.value)}</dd></div>)}</dl>
    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Registrerade profiluppgifter, inte AI-bedömning. {showMissing ? "Tomma fält är markerade." : "Uppgifter som saknas visas inte."} Bekräfta aktuell kapacitet och referenser inför beslut.</p>
  </section>;
}
