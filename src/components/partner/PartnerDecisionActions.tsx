import { useNavigate } from "react-router-dom";
import { Star, MessagesSquare, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface PartnerDecisionActionsProps {
  partner: { slug: string; name: string };
  product?: string | null;
  industry?: string | null;
  onIntro: () => void;
  compact?: boolean;
}

const PartnerDecisionActions = ({ partner, product, industry, onIntro, compact = false }: PartnerDecisionActionsProps) => {
  const navigate = useNavigate();
  const { selected, toggle, isSelected } = usePartnerCompare();
  const selectedForCompare = isSelected(partner.slug);
  const question = `Vad bör vi kontrollera när vi utvärderar ${partner.name}${product ? ` för ${product}` : ""}${industry ? ` inom ${industry}` : ""}?`;

  const compare = () => {
    toggle(partner);
    trackFunnelEvent({ event_type: "cta_click", event_name: "partner_decision_action", metadata: { action: selectedForCompare ? "shortlist_remove" : "shortlist_add", partner_slug: partner.slug, product, industry, shortlist_size: selected.length } });
  };

  const ask = () => {
    const params = new URLSearchParams({ q: question, source: `partner:${partner.slug}` });
    trackFunnelEvent({ event_type: "cta_click", event_name: "partner_decision_action", metadata: { action: "ask_d365", partner_slug: partner.slug, product, industry } });
    navigate(`/fraga/?${params.toString()}`);
  };

  const intro = () => {
    trackFunnelEvent({ event_type: "cta_click", event_name: "partner_decision_action", metadata: { action: "request_intro", partner_slug: partner.slug, product, industry } });
    onIntro();
  };

  return (
    <div className={`grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`} aria-label={`Nästa steg för ${partner.name}`}>
      <Button type="button" variant="outline" onClick={compare} aria-pressed={selectedForCompare} className="min-h-11 whitespace-normal">
        <Star className={`h-4 w-4 ${selectedForCompare ? "fill-current text-primary" : ""}`} aria-hidden="true" />
        {selectedForCompare ? "I shortlist" : "Lägg till i shortlist"}
      </Button>
      <Button type="button" variant="outline" onClick={ask} className="min-h-11 whitespace-normal">
        <MessagesSquare className="h-4 w-4" aria-hidden="true" />
        Fråga d365.se
      </Button>
      <Button type="button" onClick={intro} className="min-h-11 whitespace-normal font-bold">
        <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
        Be om introduktion
      </Button>
    </div>
  );
};

export default PartnerDecisionActions;