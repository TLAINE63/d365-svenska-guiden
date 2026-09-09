import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  url: string;
}

interface Props {
  items: Crumb[];
  className?: string;
}

/** Synliga brödsmulor. JSON-LD hanteras av SEOHead. */
const GuideBreadcrumb = ({ items, className = "" }: Props) => (
  <nav aria-label="Brödsmulor" className={`text-xs text-muted-foreground ${className}`}>
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={c.url} className="flex items-center gap-1">
            {last ? (
              <span aria-current="page" className="text-foreground">{c.name}</span>
            ) : (
              <Link to={c.url} className="hover:text-foreground hover:underline">
                {c.name}
              </Link>
            )}
            {!last && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default GuideBreadcrumb;
