import { Info } from "lucide-react";

export default function AnalysisDisclaimer() {
  return (
    <div className="flex gap-3 items-start bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/70" />
      <p>
        <span className="font-semibold text-foreground">Obs! Vägledande analys – inte en kravspecifikation.</span>{" "}
        Denna analys bygger på de svar du angivit och är avsedd som en första orientering och utgångspunkt för vidare dialog. 
        Resultaten ger en indikation på lämplig lösningsinriktning och partnertyp, men ersätter inte en fullständig 
        förstudie eller kravanalys. Vi rekommenderar att du diskuterar dina behov med en kvalificerad Microsoft-partner 
        innan beslut fattas.
      </p>
    </div>
  );
}
