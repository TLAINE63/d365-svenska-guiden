import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RelatedPartyBadgeProps {
  /** When true renders a slightly larger inline pill suitable for partner profile pages. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Visible badge that signals a partner where d365.se's owner has an economic
 * interest. Links to the transparency page describing how the partnership
 * model works.
 */
export default function RelatedPartyBadge({ size = "sm", className = "" }: RelatedPartyBadgeProps) {
  const sizing =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/agande-och-intressen/"
            className={`inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors ${sizing} ${className}`}
          >
            <Info className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
            Närstående bolag
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px] text-xs">
          d365.se:s ägare har ekonomiska intressen i denna partner. Läs mer om hur partnersamarbetet fungerar.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
