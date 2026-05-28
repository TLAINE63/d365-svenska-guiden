import { Info } from "lucide-react";
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
 * Visible badge that signals a partner where d365.se's owner (Cloud Ahead)
 * has an economic interest. Required on every list/profile surface where the
 * partner appears, per the ownership-and-interests transparency policy.
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
          <span
            className={`inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 font-medium text-amber-700 dark:text-amber-300 ${sizing} ${className}`}
          >
            <Info className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
            Närstående bolag
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px] text-xs">
          d365.se:s ägare har ekonomiska intressen i denna partner.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
