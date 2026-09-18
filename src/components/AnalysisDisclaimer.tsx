import { Info } from "lucide-react";

export default function AnalysisDisclaimer() {
  return (
    <div className="flex gap-3 items-start bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/70" />
      <p>
        <span className="font-semibold text-foreground">Vägledning, inte en kravspecifikation.</span>{" "}
        Resultatet bygger på dina svar och är ett första underlag. Kontrollera antaganden, kostnader och
        lösningsval i en förstudie innan ni fattar beslut.
      </p>
    </div>
  );
}
