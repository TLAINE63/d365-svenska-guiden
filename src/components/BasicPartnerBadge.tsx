import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BasicPartnerBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export const BASIC_PROFILE_DISCLAIMER =
  "Grundläggande information om partnern baserad på publikt tillgängliga uppgifter. Informationen har ännu inte verifierats tillsammans med partnern.";

/**
 * Neutral markering för partners utan verifierad profil.
 * Visas tydligt skild från VerifiedPartnerBadge (neutral/grå istället för teal).
 */
export default function BasicPartnerBadge({
  size = "sm",
  className = "",
}: BasicPartnerBadgeProps) {
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
            aria-label="Ej verifierad profil"
            className={`inline-flex items-center rounded-full border border-border bg-muted font-semibold uppercase tracking-wide text-muted-foreground ${sizing} ${className}`}
          >
            <Info className={iconSize} aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] text-xs">
          {BASIC_PROFILE_DISCLAIMER}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
