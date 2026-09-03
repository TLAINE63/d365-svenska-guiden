import { BadgeCheck } from "lucide-react";
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
}

/**
 * "Partnerverifierad" – visas för publicerade partners på d365.se.
 * Signalerar att partnern själv har granskat och kompletterat informationen.
 */
export default function VerifiedPartnerBadge({
  size = "sm",
  iconOnly = false,
  className = "",
}: VerifiedPartnerBadgeProps) {
  const sizing =
    size === "md"
      ? "text-[11px] px-3 py-1.5 gap-1.5"
      : "text-[10px] px-2.5 py-1 gap-1.5";
  const iconSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label="Partnerverifierad profil"
            className={`group/vb relative inline-flex items-center overflow-hidden rounded-full border border-accent/60 bg-accent text-accent-foreground font-bold uppercase tracking-[0.1em] shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.55)] ring-1 ring-inset ring-white/20 ${
              iconOnly ? "p-1.5" : sizing
            } ${className}`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover/vb:translate-x-full transition-transform duration-[1200ms] ease-out"
            />
            <BadgeCheck className={`${iconSize} relative shrink-0`} aria-hidden="true" />
            {!iconOnly && <span className="relative">Partnerverifierad</span>}
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

