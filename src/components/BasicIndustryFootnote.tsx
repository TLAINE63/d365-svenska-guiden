import { Info } from "lucide-react";
import { BASIC_COPY } from "@/hooks/useBasicPartners";

export default function BasicIndustryFootnote() {
  return (
    <p className="mt-2 flex items-start justify-center gap-1.5 text-xs italic text-muted-foreground/80 max-w-3xl mx-auto">
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
      <span>{BASIC_COPY.industriesLabel}</span>
    </p>
  );
}
