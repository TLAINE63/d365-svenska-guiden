import {
  PROFILE_EXPLAINER_VERIFIED,
  PROFILE_LABEL_VERIFIED,
} from "@/data/profileModel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedPartnerBadgeProps {
  /** sm = kompakt pill i listor/kort, md = större pill på partnerprofil */
  size?: "sm" | "md";
  /** Endast ikon (t.ex. bredvid logotyp i täta grid-vyer) */
  iconOnly?: boolean;
  className?: string;
  logoDarkBg?: boolean | null;
}

/**
 * "Partnerverifierad" – visas för publicerade partners på d365.se.
 * Signalerar att partnern själv har granskat och kompletterat informationen.
 */
export default function VerifiedPartnerBadge({
  size = "sm",
  iconOnly = false,
  className = "",
  logoDarkBg = false,
}: VerifiedPartnerBadgeProps) {

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label="Partnerverifierad profil"
            className={`inline-flex max-w-full shrink-0 ${className}`}
          >
            <img
              src={`/badges/verifierad-partner-dark.svg`}
              alt="Verifierad Dynamics 365-partner på d365.se"
              width={240}
              height={72}
              loading="lazy"
              className={`${size === "md" ? "w-[200px]" : iconOnly ? "w-[140px]" : "w-[160px]"} h-auto max-w-full object-contain`}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] text-xs">
          <span className="font-semibold">{PROFILE_LABEL_VERIFIED}.</span>{" "}
          {PROFILE_EXPLAINER_VERIFIED}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

