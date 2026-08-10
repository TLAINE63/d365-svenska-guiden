import { BadgeCheck } from "lucide-react";
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
 * "Verifierad" – visas för publicerade partners med aktiv publicering på d365.se.
 * Signalerar att profilen är granskad och att partnern går att kontakta via plattformen.
 */
export default function VerifiedPartnerBadge({
  size = "sm",
  iconOnly = false,
  className = "",
}: VerifiedPartnerBadgeProps) {
  const sizing =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1";
  const iconSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label="Verifierad partner"
            className={`inline-flex items-center rounded-full border border-accent/40 bg-accent/10 font-semibold uppercase tracking-wide text-accent ${
              iconOnly ? "p-1" : sizing
            } ${className}`}
          >
            <BadgeCheck className={iconSize} aria-hidden="true" />
            {!iconOnly && <span>Verifierad</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px] text-xs">
          Verifierad partner: profilen är granskad och publicerad på d365.se, med
          uppgifter om produktområden, branscherfarenhet och kontaktväg via plattformen.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
