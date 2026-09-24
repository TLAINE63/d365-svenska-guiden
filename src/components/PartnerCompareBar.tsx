import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftRight, Star, UserRoundPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/**
 * Flytande shortlist. Besökaren lägger partners åt sidan (max 3) och väljer
 * sedan om d365.se ska hjälpa till att jämföra dem eller förmedla kontakt.
 */
const PartnerCompareBar = () => {
  const { selected, remove, clear, filterContext } = usePartnerCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [introOpen, setIntroOpen] = useState(false);

  if (location.pathname.startsWith("/jamfor-partners")) return null;
  if (selected.length === 0) return null;

  const n = selected.length;
  const track = (action: string) =>
    trackFunnelEvent({ event_type: "cta_click", event_name: "shortlist_action", metadata: { action, shortlist_size: n } });

  const goCompare = () => {
    if (n < 2) return;
    track("compare");
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

  const openIntro = () => {
    track("request_intro");
    setIntroOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-[60] w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 sm:bottom-5">
        <div className="rounded border border-border bg-card/95 px-3 py-3 shadow-xl backdrop-blur sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <Star className="h-4 w-4 fill-current text-primary" aria-hidden="true" />
            <p className="text-sm font-bold text-foreground">
              Ni har valt {n} {n === 1 ? "partner" : "partners"}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              {selected.map((s) => (
                <span key={s.slug} className="inline-flex max-w-[180px] items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  <span className="truncate">{s.name}</span>
                  <button type="button" onClick={() => remove(s.slug)} aria-label={`Ta bort ${s.name} från shortlist`} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <button type="button" onClick={clear} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Rensa
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="flex-1 min-w-[200px] text-xs text-muted-foreground sm:text-sm">
              {n === 1
                ? "Lägg åt sidan en eller två till, eller be om introduktion redan nu."
                : "Vill ni att d365.se hjälper er att jämföra dem eller förmedlar kontakt?"}
            </p>
            <Button size="sm" variant="outline" onClick={goCompare} disabled={n < 2} className="font-semibold">
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              Jämför partnerna
            </Button>
            <Button size="sm" onClick={openIntro} className="font-bold">
              <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
              Be om introduktion
            </Button>
          </div>
        </div>
      </div>

      <PartnerRequestDialog
        open={introOpen}
        onOpenChange={setIntroOpen}
        partnerSlug={selected[0].slug}
        partnerName={selected[0].name}
        recipients={n > 1 ? selected : undefined}
        mode="contact"
        selectedProduct={filterContext.product ?? undefined}
        industry={filterContext.industry ?? undefined}
        geography={filterContext.geography ?? undefined}
        companySize={filterContext.companySize ?? undefined}
        revenue={filterContext.revenue ?? undefined}
      />
    </>
  );
};

export default PartnerCompareBar;
