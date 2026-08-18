import { useEffect, useMemo, useState } from "react";
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
const DISMISSED_PROMPTS_STORAGE_KEY = "partner-compare-dismissed-prompts";
const AUTO_PROMPT_DISMISSED_STORAGE_KEY = "partner-compare-auto-prompt-dismissed";

const getPairKey = (items: { slug: string }[]) => items.map((s) => s.slug).sort().join("|");

const readDismissedPromptKeys = () => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = sessionStorage.getItem(DISMISSED_PROMPTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((key) => typeof key === "string") : []);
  } catch {
    return new Set<string>();
  }
};

const isPromptDismissed = (key: string) => readDismissedPromptKeys().has(key);

const isAutoPromptDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTO_PROMPT_DISMISSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const dismissAutoPrompt = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AUTO_PROMPT_DISMISSED_STORAGE_KEY, "true");
  } catch {}
};

const dismissPromptForPair = (key: string) => {
  if (!key || typeof window === "undefined") return;
  try {
    const dismissed = readDismissedPromptKeys();
    dismissed.add(key);
    sessionStorage.setItem(DISMISSED_PROMPTS_STORAGE_KEY, JSON.stringify([...dismissed]));
  } catch {}
};

const dismissPrompt = (key: string) => {
  dismissAutoPrompt();
  dismissPromptForPair(key);
};

const PartnerCompareBar = () => {
  const { selected, remove, clear, filterContext } = usePartnerCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [askOpen, setAskOpen] = useState(false);

  const onComparePage = location.pathname.startsWith("/jamfor-partners");
  const currentPairKey = useMemo(
    () => (selected.length >= 2 ? getPairKey(selected) : ""),
    [selected]
  );

  // Auto-clear the selection once the user has visited the compare page,
  // so the floating bar & prompt don't keep reappearing on later navigation.
  useEffect(() => {
    if (onComparePage && selected.length > 0) {
      setAskOpen(false);
      clear();
    }
  }, [onComparePage, selected.length, clear]);

  // Auto-open the prompt when the user reaches 2–3 selections (only once per selection, per session)
  useEffect(() => {
    if (onComparePage) return;
    if (currentPairKey) {
      if (
        promptedPairKey !== currentPairKey &&
        !isAutoPromptDismissed() &&
        !isPromptDismissed(currentPairKey)
      ) {
        promptedPairKey = currentPairKey;
        setAskOpen(true);
      }
    } else if (selected.length === 0) {
      promptedPairKey = "";
    }
  }, [currentPairKey, selected.length, onComparePage]);

  const handleAskOpenChange = (open: boolean) => {
    if (!open && askOpen && currentPairKey) {
      dismissPrompt(currentPairKey);
    }
    setAskOpen(open);
  };

  if (onComparePage) return null;
  if (selected.length === 0) return null;

  const goCompare = () => {
    if (selected.length < 2) return;
    setAskOpen(false);
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

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1rem)] max-w-2xl">
        <div className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-2xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            Jämför partners
            <span className="text-muted-foreground font-normal">({selected.length}/3)</span>
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
              className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
            >
              Visa jämförelse
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={askOpen} onOpenChange={handleAskOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Visa jämförelse sida vid sida?</AlertDialogTitle>
            <AlertDialogDescription>
              Du har valt {selected.length === 3 ? "tre" : "två"} partners att jämföra:
              <span className="block mt-2 font-semibold text-foreground">
                {selected.map((partner) => partner.name).join(" · ")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => dismissPrompt(currentPairKey)}>Inte nu</AlertDialogCancel>
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
