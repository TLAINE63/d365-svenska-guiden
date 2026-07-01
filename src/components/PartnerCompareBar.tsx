import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";

// Persist across remounts so the prompt doesn't re-appear when navigating
// (the bar unmounts on /jamfor-partners and remounts on the next page).
let promptedPairKey = "";

const PartnerCompareBar = () => {
  const { selected, remove, clear, filterContext } = usePartnerCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [askOpen, setAskOpen] = useState(false);

  const onComparePage = location.pathname.startsWith("/jamfor-partners");

  // Auto-clear the selection once the user has visited the compare page,
  // so the floating bar & prompt don't keep reappearing on later navigation.
  useEffect(() => {
    if (onComparePage && selected.length > 0) {
      promptedPairKey = "";
      clear();
    }
  }, [onComparePage, selected.length, clear]);

  // Auto-open the prompt when the user reaches 2 selections (only once per pair, per session)
  useEffect(() => {
    if (onComparePage) return;
    if (selected.length === 2) {
      const key = selected.map((s) => s.slug).sort().join("|");
      if (promptedPairKey !== key) {
        promptedPairKey = key;
        setAskOpen(true);
      }
    } else if (selected.length === 0) {
      promptedPairKey = "";
    }
  }, [selected, onComparePage]);

  if (onComparePage) return null;
  if (selected.length === 0) return null;

  const goCompare = () => {
    if (selected.length !== 2) return;
    setAskOpen(false);
    const qs = new URLSearchParams();
    qs.set("a", selected[0].slug);
    qs.set("b", selected[1].slug);
    if (filterContext.product) qs.set("product", filterContext.product);
    if (filterContext.industry) qs.set("industry", filterContext.industry);
    if (filterContext.geography) qs.set("geography", filterContext.geography);
    if (filterContext.companySize) qs.set("companySize", filterContext.companySize);
    navigate(`/jamfor-partners?${qs.toString()}`);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1rem)] max-w-2xl">
        <div className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-2xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            Jämför partners
            <span className="text-muted-foreground font-normal">({selected.length}/2)</span>
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
              disabled={selected.length !== 2}
              className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
            >
              Visa jämförelse
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={askOpen} onOpenChange={setAskOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Visa jämförelse sida vid sida?</AlertDialogTitle>
            <AlertDialogDescription>
              Du har valt två partners att jämföra:
              <span className="block mt-2 font-semibold text-foreground">
                {selected[0]?.name} &nbsp;vs&nbsp; {selected[1]?.name}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Inte nu</AlertDialogCancel>
            <AlertDialogAction
              onClick={goCompare}
              className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
            >
              Visa jämförelse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PartnerCompareBar;
