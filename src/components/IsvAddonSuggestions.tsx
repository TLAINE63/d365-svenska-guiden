import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Puzzle, ExternalLink } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { suggestIsvAddons, SCOPE_LABEL, type IsvScope } from "@/lib/isvSuggestions";

export interface SelectedIsvAddon {
  id: string;
  name: string;
  vendor: string;
  category: string;
  shortDescription: string;
}

interface Props {
  scope: IsvScope;
  industry?: string | null;
  areas?: string[];
  selected: SelectedIsvAddon[];
  onChange: (next: SelectedIsvAddon[]) => void;
  limit?: number;
  /** Rubriktext kan anpassas per verktyg. */
  title?: string;
}

const catalogUrl = (scope: IsvScope) => {
  switch (scope) {
    case "bc":
      return "/kunskapscenter/dynamics-365-tillagg/?produkt=Business%20Central";
    case "fscm":
    case "erp":
      return "/kunskapscenter/dynamics-365-tillagg/?produkt=Finance%20%26%20Supply%20Chain%20Management";
    case "sales":
      return "/kunskapscenter/dynamics-365-tillagg/?ce=Sales";
    case "customer-insights":
      return "/kunskapscenter/dynamics-365-tillagg/?ce=Customer%20Insights%20(Marketing)";
    case "customer-service":
      return "/kunskapscenter/dynamics-365-tillagg/?ce=Customer%20Service";
    case "field-service":
      return "/kunskapscenter/dynamics-365-tillagg/?ce=Field%20Service";
    case "contact-center":
      return "/kunskapscenter/dynamics-365-tillagg/?ce=Contact%20Center";
    default:
      return "/kunskapscenter/dynamics-365-tillagg/";
  }
};

/**
 * Visar föreslagna tilläggslösningar ur den gemensamma Dynamics 365-katalogen
 * och låter besökaren markera vilka som ska följa med i underlaget/PDF:en.
 */
const IsvAddonSuggestions = ({
  scope,
  industry,
  areas = [],
  selected,
  onChange,
  limit = 6,
  title = "Relevanta tilläggslösningar",
}: Props) => {
  const solutions = useIsvSolutions();
  const suggestions = useMemo(
    () => suggestIsvAddons(solutions, { scope, industry, areas, limit }),
    [solutions, scope, industry, areas, limit],
  );

  if (suggestions.length === 0) return null;

  const isSelected = (id: string) => selected.some((s) => s.id === id);
  const toggle = (id: string) => {
    const hit = suggestions.find((s) => s.solution.id === id);
    if (!hit) return;
    if (isSelected(id)) {
      onChange(selected.filter((s) => s.id !== id));
    } else {
      const s = hit.solution;
      onChange([
        ...selected,
        {
          id: s.id,
          name: s.name,
          vendor: s.vendor,
          category: s.category,
          shortDescription: s.shortDescription,
        },
      ]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
        <Puzzle className="h-5 w-5 text-accent" />
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Standardfunktioner i {SCOPE_LABEL[scope]} täcker inte allt. Markera de tillägg du vill
        utvärdera – de följer med i underlaget och i PDF:en så att partnerna kan prissätta dem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map(({ solution: s, reasons }) => {
          const active = isSelected(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              className={`text-left p-4 rounded-lg border transition-all ${
                active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.vendor}</div>
                </div>
                {active && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{s.shortDescription}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                {reasons.slice(0, 1).map((r) => (
                  <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Urvalet bygger på d365.se:s tilläggskatalog och är redaktionellt – ingen leverantör kan köpa
        sig till en plats.{" "}
        <Link to={catalogUrl(scope)} className="text-primary inline-flex items-center gap-1 hover:underline">
          Se hela katalogen <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default IsvAddonSuggestions;
