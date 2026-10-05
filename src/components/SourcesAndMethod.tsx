import { useId } from "react";
import { Link } from "react-router-dom";
import { editorialDate } from "@/components/EditorialSource";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { safeSourceHref, type GuideSource } from "@/lib/guideSources";
import { cn } from "@/lib/utils";
export type SourceMethodVariant = "guide" | "product" | "partners" | "comparison" | "tool" | "competence";
const METHOD: Record<SourceMethodVariant, string> = {
  guide: "Produkt-, funktions- och licensinformation baseras i första hand på Microsofts officiella dokumentation och publikt tillgänglig information. Information om partners baseras på publika uppgifter samt uppgifter som partnerföretagen lämnat till d365.se. Jämförelser, kategoriseringar, bedömningar och rekommendationer är d365.se:s redaktionella analyser ur ett köparperspektiv.",
  product: "Produktinformation baseras i första hand på Microsofts officiella produktdokumentation. Bedömningar av målgrupp, användningsområden, komplexitet och typiska projektförutsättningar är d365.se:s redaktionella analys.",
  partners: "Partnerinformationen sammanställs av d365.se utifrån publikt tillgänglig information samt uppgifter från respektive partner. Kategorisering efter Dynamics 365-produkt, branschkompetens, geografi, kundsegment och tjänsteområde är d365.se:s redaktionella sammanställning. Partnerverifierade uppgifter märks separat, och partnerverifiering innebär inte att partnern styr d365.se:s bedömning.",
  comparison: "Jämförelsen är sammanställd av d365.se och bygger på publikt tillgänglig produktinformation samt redaktionell bedömning av funktionalitet, målgrupp, komplexitet, implementeringsförutsättningar och typiska användningsområden.",
  tool: "Rekommendationerna baseras på användarens svar och d365.se:s redaktionella modell för produktval, kravbild och köpresa. Resultatet är vägledande och ersätter inte en fullständig förstudie.",
  competence: "Kompetenskategorierna är framtagna av d365.se för att hjälpa organisationer att beskriva behov inom exempelvis projektledning, lösningsarkitektur, Finance Transformation, SCM, testledning, UAT, rescue-projekt och förvaltning. Resultatet är ett vägledande köparstöd, inte en certifiering eller officiell Microsoft-bedömning.",
};
interface Props {
  variant?: SourceMethodVariant;
  externalSources?: GuideSource[];
  partnerEvidence?: GuideSource[];
  analysis?: string;
  className?: string;
}
function SourceList({ sources }: { sources: GuideSource[] }) {
  return <dl className="space-y-4">{sources.map((source, index) => {
    const href = safeSourceHref(source.href);
    const date = editorialDate(source.updatedAt);
    return <div key={`${source.name}-${index}`}>
      <dt className="text-sm font-semibold text-foreground">{href?.startsWith("/") ? <Link to={href} className="underline underline-offset-4">{nowrapBrand(source.name)}</Link> : href ? <a href={href} target="_blank" rel="noopener noreferrer" className="break-words underline underline-offset-4">{nowrapBrand(source.name)}</a> : nowrapBrand(source.name)}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{nowrapBrand(source.supports)}{date && <span className="mt-1 block text-xs">Källuppgift uppdaterad: <time dateTime={date}>{date}</time></span>}</dd>
    </div>;
  })}</dl>;
}
export default function SourcesAndMethod({ externalSources = [], partnerEvidence = [], variant = "guide", analysis = "Analys och sammanställning: d365.se. Vi tolkar uppgifterna ur köparens perspektiv och beskriver avvägningar, begränsningar och frågor att kontrollera. Slutsatserna är D365.SE:s analys, inte källornas rekommendationer eller en garanti för projektresultat.", className }: Props) {
  const id = useId();
  return <section data-sources-and-method aria-labelledby={id} className={cn("border-t border-border py-8 sm:py-10", className)}>
    <div className="container mx-auto max-w-5xl px-4 sm:px-6">
      <div className="mb-7 max-w-3xl"><h2 className="mb-2 text-base font-semibold text-foreground">Om innehållet</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Innehållet är framtaget av d365.se-redaktionen. d365.se är en svensk köparsidig kunskaps- och jämförelsetjänst för organisationer som utvärderar Microsoft{"\u00A0"}{nowrapBrand("Dynamics 365")} och relaterade tjänster. d365.se är inte Microsoft och representerar inte Microsoft officiellt.</p>
      </div>
      <h2 id={id} className="mb-3 text-xl font-bold text-foreground">Källor och metod</h2>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{nowrapBrand(METHOD[variant])}</p>
      <div className="grid min-w-0 gap-7 md:grid-cols-2">
        <div className="min-w-0"><h3 className="mb-3 text-base font-semibold text-foreground">Fakta från extern källa</h3>
          {externalSources.length ? <SourceList sources={externalSources} /> : <p className="text-sm leading-relaxed text-muted-foreground">Separata externa källhänvisningar är inte specificerade för den här guiden. Faktapåståenden utan angiven källa behöver kontrolleras före beslut.</p>}
        </div>
        <div className="min-w-0"><h3 className="mb-3 text-base font-semibold text-foreground">Redaktionell bedömning</h3><p className="text-sm leading-relaxed text-muted-foreground">{nowrapBrand(analysis)}</p>
          <Link to="/agande-och-intressen/" className="mt-3 inline-block text-xs text-primary underline underline-offset-4">Avsändare och kommersiella intressen</Link>
        </div>
      </div>
      {partnerEvidence.length > 0 && <div className="mt-7 border-t border-border pt-5"><h3 className="mb-3 text-base font-semibold text-foreground">Partnerunderlag</h3><SourceList sources={partnerEvidence} /></div>}
    </div>
  </section>;
}
