import { useId } from "react";
import { Link } from "react-router-dom";
import { editorialDate } from "@/components/EditorialSource";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { safeSourceHref, type GuideSource } from "@/lib/guideSources";
import { cn } from "@/lib/utils";
interface Props {
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
export default function SourcesAndMethod({ externalSources = [], partnerEvidence = [], analysis = "Redaktionell bedömning av D365.SE. Vi tolkar uppgifterna ur köparens perspektiv och beskriver avvägningar, begränsningar och frågor att kontrollera. Slutsatserna är D365.SE:s analys, inte källornas rekommendationer eller en garanti för projektresultat.", className }: Props) {
  const id = useId();
  return <section data-sources-and-method aria-labelledby={id} className={cn("border-t border-border py-8 sm:py-10", className)}>
    <div className="container mx-auto max-w-5xl px-4 sm:px-6">
      <h2 id={id} className="mb-6 text-xl font-bold text-foreground">Källor och metod</h2>
      <div className="grid min-w-0 gap-7 md:grid-cols-2">
        <div className="min-w-0"><h3 className="mb-3 text-base font-semibold text-foreground">Fakta från extern källa</h3>
          {externalSources.length ? <SourceList sources={externalSources} /> : <p className="text-sm leading-relaxed text-muted-foreground">Separata externa källhänvisningar är inte specificerade för den här guiden. Faktapåståenden utan angiven källa behöver kontrolleras före beslut.</p>}
        </div>
        <div className="min-w-0"><h3 className="mb-3 text-base font-semibold text-foreground">D365.SE:s analys</h3><p className="text-sm leading-relaxed text-muted-foreground">{nowrapBrand(analysis)}</p>
          <Link to="/agande-och-intressen/" className="mt-3 inline-block text-xs text-primary underline underline-offset-4">Avsändare och kommersiella intressen</Link>
        </div>
      </div>
      {partnerEvidence.length > 0 && <div className="mt-7 border-t border-border pt-5"><h3 className="mb-3 text-base font-semibold text-foreground">Partnerunderlag</h3><SourceList sources={partnerEvidence} /></div>}
    </div>
  </section>;
}
