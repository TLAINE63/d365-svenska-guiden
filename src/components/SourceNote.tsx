import { Info } from "lucide-react";
import { ReactNode } from "react";

interface SourceNoteProps {
  /** Var uppgiften kommer ifrån, t.ex. "Microsofts officiella prislista". */
  source: ReactNode;
  /** Länk till källan när den är publik och verifierbar. */
  href?: string;
  /** Datum då uppgiften hämtades eller senast stämdes av (YYYY-MM-DD). */
  updated: string;
  /** Kort metodbeskrivning när siffran bygger på egna observationer. */
  method?: ReactNode;
  className?: string;
}

/**
 * Käll- och metodrad under sifferpåståenden.
 *
 * Används för att varje pris, kostnadsintervall och marknadssiffra på sajten
 * ska gå att verifiera: vem som är källan, när den hämtades och – när ingen
 * extern källa finns – hur siffran har tagits fram.
 */
const SourceNote = ({ source, href, updated, method, className = "" }: SourceNoteProps) => (
  <p
    className={`flex items-start gap-2 text-xs text-muted-foreground border-l-2 border-border pl-3 ${className}`}
  >
    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" aria-hidden />
    <span>
      <span className="font-medium text-foreground">Källa:</span>{" "}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
          {source}
        </a>
      ) : (
        source
      )}
      . Uppdaterad {updated}.
      {method ? <> {method}</> : null}
    </span>
  </p>
);

export default SourceNote;
