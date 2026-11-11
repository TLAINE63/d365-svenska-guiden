import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isvVerifiedBadgeLabel } from "@/lib/isvInformationStatus";

interface VerifiedIsvBadgeProps {
  product?: boolean;
  size?: "sm" | "md";
  verifiedAt?: string | null;
  className?: string;
}

/** Verifieringsmärke för en ISV-leverantör eller en enskild tilläggslösning. */
export default function VerifiedIsvBadge({
  product = false,
  size = "sm",
  verifiedAt,
  className = "",
}: VerifiedIsvBadgeProps) {
  const label = isvVerifiedBadgeLabel(product ? "product" : "vendor");
  const explanation = product
    ? "Informationen om tilläggslösningen är kvalitetssäkrad. Leverantören verifieras separat."
    : "Informationen om ISV-leverantören är kvalitetssäkrad. Varje tilläggslösning verifieras separat.";
  const date = verifiedAt?.slice(0, 10);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={label}
            data-information-status="verified"
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 font-semibold text-accent ${size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"} ${className}`}
          >
            <BadgeCheck className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden="true" />
            <span>{label}</span>
            {date && <span className="font-normal opacity-80">· {date}</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px] text-xs">
          <span className="font-semibold">{label}.</span> {explanation}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
