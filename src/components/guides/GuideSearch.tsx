import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Building2 } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";

interface Props {
  className?: string;
  placeholder?: string;
}

interface Hit {
  key: string;
  label: string;
  sub: string;
  to: string;
  kind: "guide" | "partner";
}

/**
 * Snabbsök i guideserien och bland partnerverifierade profiler.
 * Låter besökaren hoppa direkt till en guide eller en partnerprofil.
 */
const GuideSearch = ({ className = "", placeholder = "Sök guide eller partner…" }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: partners } = usePartners();

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const guideHits: Hit[] = PARTNER_GUIDES.filter((g) =>
      `${g.cardTitle} ${g.shortLabel} ${g.apps.join(" ")}`.toLowerCase().includes(q)
    ).map((g) => ({
      key: `guide-${g.key}`,
      label: g.cardTitle,
      sub: "Guide",
      to: guidePath(g),
      kind: "guide" as const,
    }));

    const partnerHits: Hit[] = (partners || [])
      .filter((p) => `${p.name} ${(p.applications || []).join(" ")}`.toLowerCase().includes(q))
      .slice(0, 6)
      .map((p) => ({
        key: `partner-${p.slug}`,
        label: p.name,
        sub: (p.applications || []).slice(0, 3).join(" · ") || "Partnerverifierad profil",
        to: `/partner/${p.slug}`,
        kind: "partner" as const,
      }));

    return [...guideHits, ...partnerHits].slice(0, 10);
  }, [query, partners]);

  const go = (to: string) => {
    setOpen(false);
    setQuery("");
    navigate(to);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="guide-search" className="sr-only">
        Sök guide eller partner
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id="guide-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {open && hits.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {hits.map((h) => (
            <li key={h.key}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(h.to)}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-muted"
              >
                {h.kind === "guide" ? (
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                )}
                <span>
                  <span className="block text-sm font-medium leading-tight">{h.label}</span>
                  <span className="block text-xs text-muted-foreground">{h.sub}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim().length >= 2 && hits.length === 0 && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-border bg-popover px-3 py-2.5 text-sm text-muted-foreground shadow-lg">
          Ingen träff. Prova partnerlistan för fler alternativ.
        </div>
      )}
    </div>
  );
};

export default GuideSearch;
