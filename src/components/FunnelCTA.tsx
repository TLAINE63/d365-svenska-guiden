import PartnerCtaBlock from "@/components/PartnerCtaBlock";

export type FunnelStage = "early" | "evaluation" | "decision";

interface Props {
  /** Behålls för bakåtkompatibilitet – påverkar inte längre CTA-texten. */
  stage?: FunnelStage;
  guide?: "erp" | "crm";
  /** Var CTA:n visas – används i mätningen. */
  source: string;
  className?: string;
}

/**
 * Tunn wrapper runt det gemensamma CTA-blocket, så att alla sidor som redan
 * använder FunnelCTA får den standardiserade primära CTA:n "Hitta rätt partner".
 */
const FunnelCTA = ({ source, className = "" }: Props) => (
  <PartnerCtaBlock variant="article" source={source} className={className} />
);

export default FunnelCTA;
