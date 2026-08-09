import { useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useExitIntent } from "@/hooks/useExitIntent";
import { useCtaTracking } from "@/hooks/useCtaTracking";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";

/** Sidor med hög köpintention där erbjudandet är relevant. */
const ELIGIBLE_PREFIXES = [
  "/business-central",
  "/finance-supply-chain",
  "/crm",
  "/kostnad",
  "/priser",
  "/implementationskalkylator",
  "/roi",
  "/branschlosningar",
  "/erp",
  "/affarssystem",
];

const ExitIntentOffer = () => {
  const location = useLocation();
  const eligible = ELIGIBLE_PREFIXES.some((p) => location.pathname.startsWith(p));
  const { triggered, dismiss } = useExitIntent({
    storageKey: "exit-intent-offer-shown",
    disabled: !eligible,
  });
  const { ref } = useCtaTracking<HTMLDivElement>("exit_intent_offer", {
    page: location.pathname,
  });

  if (!eligible || !triggered) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
        <div ref={ref}>
          <LeadMagnetBanner sourcePage={`exit-intent:${location.pathname}`} onClose={dismiss} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentOffer;
