import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** Diskret ingång till partnerbytesguiden från produktsidor. */
const PartnerSwitchCta = () => (
  <aside className="my-10 rounded-lg border border-border bg-secondary/40 p-5 sm:p-6">
    <p className="font-semibold text-foreground mb-1">Funderar ni på att byta Dynamics&nbsp;365-partner?</p>
    <p className="text-sm text-muted-foreground mb-3">Se vad ni bör kontrollera först: licenser, kod, dokumentation och behörigheter.</p>
    <Link to="/guider/byta-dynamics-partner/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
      Gör Partnerbytesanalysen <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  </aside>
);
export default PartnerSwitchCta;
