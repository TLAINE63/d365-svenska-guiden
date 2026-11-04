import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/** Kort puff till /second-opinion/ för köpare som redan fått ett partnerförslag. */
export default function SecondOpinionNudge({ sourcePage, className = "" }: { sourcePage: string; className?: string }) {
  return (
    <div className={`container mx-auto max-w-6xl px-4 ${className}`}>
      <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Har ni redan fått ett förslag från en partner?</span>{" "}
        Låt d365.se göra en rimlighetsbedömning av upplägg, timmar och licenser innan ni skriver på.{" "}
        <Link
          to="/second-opinion/"
          onClick={() => trackFunnelEvent({ event_type: "cta_click", event_name: "second_opinion_nudge_clicked", metadata: { source_page: sourcePage } })}
          className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 hover:text-accent"
        >
          Få en second opinion <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}
