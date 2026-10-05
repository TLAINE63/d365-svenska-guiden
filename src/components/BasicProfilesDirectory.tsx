import { Link } from "react-router-dom";
import basicPartnerRoutes from "@/data/basicPartnerRoutes.json";

type BasicRoute = { slug: string; name: string; products?: string[] };
type ProductKey = "bc" | "fsc" | "sales" | "service";

interface Props {
  /** Visa bara grundprofiler som arbetar med någon av dessa produkter. Utelämnas = alla. */
  products?: ProductKey[];
  heading?: string;
}

/**
 * Förrenderad länklista till grundprofiler (ej partnerverifierade) så att
 * /basic/<slug>-sidorna inte ligger isolerade för besökare, sökmotorer och AI-crawlers.
 * Läser byggtidens snapshot, inte klient-fetch.
 */
export default function BasicProfilesDirectory({ products, heading = "Fler aktörer med grundprofil" }: Props) {
  const list = (basicPartnerRoutes as BasicRoute[])
    .filter((b) => !products || (b.products || []).some((p) => products.includes(p as ProductKey)))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  if (list.length === 0) return null;

  return (
    <section aria-labelledby="grundprofiler-rubrik" className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto border-t border-border pt-8">
        <h2 id="grundprofiler-rubrik" className="text-lg font-semibold text-foreground">
          {heading} ({list.length})
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Grundprofiler bygger på offentliga uppgifter och är inte partnerverifierade.
        </p>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
          {list.map((b) => (
            <li key={b.slug}>
              <Link to={`/basic/${b.slug}/`} className="text-muted-foreground hover:text-foreground hover:underline">
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
