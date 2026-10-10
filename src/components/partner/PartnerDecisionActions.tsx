import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, ExternalLink, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useInquiry } from "@/contexts/InquiryContext";
import { track, partnerWebsiteUrl } from "@/lib/track";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface PartnerDecisionActionsProps {
  partner: { slug: string; name: string };
  product?: string | null;
  industry?: string | null;
  website?: string | null;
  onIntro?: () => void;
  compact?: boolean;
}

/** Profilens tre handlingar: Be om kontakt, Lägg till i kortlista, Besök partnerns webbplats. */
const PartnerDecisionActions = ({ partner, product, industry, website, onIntro, compact = false }: PartnerDecisionActionsProps) => {
  const shortlist = useShortlist();
  const inquiry = useInquiry();
  const saved = shortlist.isSaved(partner.slug);
  // Samma UTM-modell som profilens övriga partnerlänkar (utm_source=d365.se, partnerprofil).
  const outboundUrl = partnerWebsiteUrl(website);

  const contact = () => {
    trackFunnelEvent({ event_type: "cta_click", event_name: "partner_decision_action", metadata: { action: "request_contact", partner_slug: partner.slug, product, industry } });
    onIntro?.();
    inquiry.open({ partners: [partner], type: "partner", productArea: product });
  };

  return (
    <div className={`grid gap-2 ${compact ? "grid-cols-1" : outboundUrl ? "sm:grid-cols-3" : "sm:grid-cols-2"}`} aria-label={`Nästa steg för ${partner.name}`}>
      <Button type="button" onClick={contact} className="min-h-11 whitespace-normal font-bold">
        <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
        Be om kontakt
      </Button>
      {saved ? (
        <Button asChild variant="outline" className="min-h-11 whitespace-normal">
          <Link to="/kortlista/"><BookmarkCheck className="h-4 w-4" aria-hidden="true" />Tillagd i kortlistan · Visa kortlistan</Link>
        </Button>
      ) : (
        <Button type="button" variant="outline" className="min-h-11 whitespace-normal" onClick={() => {
          shortlist.toggle({ slug: partner.slug, name: partner.name, url: `/partner/${partner.slug}/`, verified: true });
          track("shortlist_add", null, partner.slug);
        }}>
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Lägg till i kortlista
        </Button>
      )}
      {outboundUrl && (
        <Button asChild variant="ghost" className="min-h-11 whitespace-normal">
          <a href={outboundUrl} target="_blank" rel="noopener" onClick={() => track("partner_outbound_click", { via: "sticky" }, partner.slug)}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />Besök partnerns webbplats
          </a>
        </Button>
      )}
    </div>
  );
};

export default PartnerDecisionActions;
