import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";

const PartnerCompareBar = () => {
  const { selected, remove, clear, filterContext } = usePartnerCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const onComparePage = location.pathname.startsWith("/jamfor-partners");

  // Auto-clear the selection once the user has visited the compare page,
  // so the floating bar & prompt don't keep reappearing on later navigation.
  useEffect(() => {
    if (onComparePage && selected.length > 0) {
      clear();
    }
  }, [onComparePage, selected.length, clear]);

  if (onComparePage) return null;
  if (selected.length === 0) return null;

  const goCompare = () => {
    if (selected.length < 2) return;
    const qs = new URLSearchParams();
    qs.set("a", selected[0].slug);
    qs.set("b", selected[1].slug);
    if (selected[2]) qs.set("c", selected[2].slug);
    if (filterContext.product) qs.set("product", filterContext.product);
    if (filterContext.industry) qs.set("industry", filterContext.industry);
    if (filterContext.geography) qs.set("geography", filterContext.geography);
    if (filterContext.companySize) qs.set("companySize", filterContext.companySize);
    if (filterContext.revenue) qs.set("revenue", filterContext.revenue);
    navigate(`/jamfor-partners?${qs.toString()}`);
  };

  const countLabel = `${selected.length} ${selected.length === 1 ? "partner vald" : "partner valda"}`;

  return (
      <div className="fixed bottom-3 left-1/2 z-[60] w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 sm:bottom-5">
        <div className="flex flex-wrap items-center gap-3 rounded border border-border bg-card/95 px-3 py-3 shadow-xl backdrop-blur sm:px-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            {countLabel}
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {selected.map((s) => (
              <span
                key={s.slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground max-w-[180px]"
              >
                <span className="truncate">{s.name}</span>
                <button
                  type="button"
                  onClick={() => remove(s.slug)}
                  aria-label={`Ta bort ${s.name} från jämförelse`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground"
            >
              Rensa
            </Button>
            <Button
              size="sm"
              onClick={goCompare}
              disabled={selected.length < 2}
              className="font-semibold"
            >
              Jämför valda partner
            </Button>
          </div>
          {selected.length === 1 && (
            <p className="basis-full text-xs text-muted-foreground sm:pl-6">
              Välj minst en partner till för att jämföra sida vid sida.
            </p>
          )}
        </div>
      </div>
  );
};

export default PartnerCompareBar;
