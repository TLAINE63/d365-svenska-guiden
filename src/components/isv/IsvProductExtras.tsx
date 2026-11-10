import type { IsvSolution } from "@/data/bcIsvSolutions";
import { useIsvProductFacts } from "@/hooks/useIsvSolutions";
import { presentationFor } from '@/lib/isvPresentation';

const COUNTRY: Record<string, string> = { SE: "Sverige", NO: "Norge", DK: "Danmark", FI: "Finland", IS: "Island" };
const MODEL: Record<string, string> = {
  Embedded: "Inbyggd i Dynamics 365",
  Connected: "Ansluten, fristående tjänst",
  Hybrid: "Hybrid, inbyggd del och extern tjänst",
};

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** Produktfakta, demo/video och kundcase. Varje del visas bara när uppgiften är ifylld. */
export default function IsvProductExtras({ solution: s }: { solution: IsvSolution }) {
  const facts = useIsvProductFacts()[s.id];
  const presentation = presentationFor(s);
  const rows: [string, string][] = [];
  if (facts?.technical_model) rows.push(["Teknisk modell", MODEL[facts.technical_model]]);
  if (facts?.countries.length) rows.push(["Tillgänglig i", facts.countries.map((c) => COUNTRY[c.code] || c.code).join(", ")]);
  if (facts?.target_size) rows.push(["Målgrupp", facts.target_size]);
  if (facts?.price_info) rows.push(["Pris", facts.price_info]);
  const yt = presentation.video ? youtubeId(presentation.video) : null;
  const cases = presentation.cases;
  if (!rows.length && !presentation.video && !cases.length) return null;

  return (
    <>
      {rows.length > 0 && (
        <section>
          <h4 className="font-semibold text-foreground mb-1">Fakta om lösningen</h4>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-foreground/80">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-muted-foreground mt-1">Sammanställt av d365.se. Kontrollera pris och tillgänglighet med leverantören.</p>
        </section>
      )}
      {presentation.video && (
        <section>
          <h4 className="font-semibold text-foreground mb-2">Demo och video</h4>
          {yt ? (
            <div className="aspect-video w-full overflow-hidden rounded border border-border">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${yt}`}
                title={`Demo av ${s.name}`}
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a href={presentation.video} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Se demo av {s.name}
            </a>
          )}
        </section>
      )}
      {cases.length > 0 && (
        <section>
          <h4 className="font-semibold text-foreground mb-2">Kundcase</h4>
          <ul className="space-y-2">
            {cases.map((c) => (
              <li key={c.title} className="p-3 rounded border border-border bg-card">
                <p className="font-medium text-foreground">{c.title}</p>
                {c.text && <p className="text-foreground/80 text-sm mt-0.5">{c.text}</p>}
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Läs kundcaset
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
