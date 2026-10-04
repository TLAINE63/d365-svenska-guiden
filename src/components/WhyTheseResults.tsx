import { Link } from "react-router-dom";
import { nowrapBrand } from "@/lib/nowrapBrand";
interface Props {
  className?: string;
  criteria?: (string | null | undefined)[];
  order?: "alphabetical" | "shuffle" | "relevance" | "guide";
  agreementPriority?: boolean;
  basic?: boolean;
  explanation?: string;
}
export default function WhyTheseResults({ className = "", criteria = [], order = "shuffle", agreementPriority = false, basic = false, explanation }: Props) {
  const active = criteria.filter((v): v is string => !!v?.trim());
  return <section data-partner-selection-method className={`border-y border-border py-4 ${className}`} aria-label="Så har D365.SE gjort urvalet">
    <h3 className="mb-2 text-sm font-bold text-foreground">Så har D365.SE gjort urvalet</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{nowrapBrand(explanation || (active.length ? `Dessa partners visas utifrån ${basic ? "observerade uppgifter" : "registrerade profiluppgifter"} och urvalet: ${active.join(", ")}. Det är inte en bekräftelse på att alla projektkrav är uppfyllda.` : basic ? "Dessa aktörer visas utifrån dokumenterade produktuppgifter i publika källor, inte en partnerverifierad lämplighetsbedömning." : "Dessa partners visas eftersom de har publicerade produktprofiler på D365.SE. Utan valda kriterier är listan en översikt, inte en rekommendation för ert företag."))}</p>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{basic ? "Grundprofiler bygger på publika källor och är inte bekräftade av partnern. " : "Partnerns egna produktvisa beskrivningar av kunder och projekt är underlag för lämplighetsbedömning; strukturerade val och relevanta kundcase kompletterar. "}{order === "alphabetical" ? "Listan visas i alfabetisk ordning, inte kvalitetsordning. " : order === "guide" ? "Partnerguiden utgår från era svar; när AI-assisterad matchning finns används den för ordningen, annars slumpas ordningen. En matchning behöver alltid bekräftas. " : order === "relevance" ? "Ordningen utgår från produkt- och branschrelevans med kundstorlek och omsättning som kompletterande signaler. " : "Ordningen slumpas inom urvalsgrupperna. Kundstorlek och omsättning kan påverka ordningen utan att vara hårda krav. "}{agreementPriority && "Partners med profileringsavtal prioriteras i ordningen. Det är inte ett bevis på högre kvalitet. "}Uppgifter som saknas är inte belägg för kapacitet.</p>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-primary"><Link to="/alla-d365-partners/#d365-partner-fit-model" className="underline underline-offset-4">D365.SE Partner Fit Model</Link><Link to="/agande-och-intressen/" className="underline underline-offset-4">Källor och kommersiella intressen</Link></div>
  </section>;
}
