import { AlertTriangle } from "lucide-react";

export default function RequirementsDisclaimer() {
  return (
    <div className="flex gap-3 items-start bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning-foreground" />
      <p>
        <span className="font-semibold text-foreground">OBS: Vägledande kravspecifikation.</span>{" "}
        Denna kravspecifikation är genererad som en utgångspunkt och överblick. Den ersätter inte en fullständig
        förstudie eller kravanalys tillsammans med en kvalificerad Microsoft-partner. Branschspecifika tillägg
        är AI-genererade och bör valideras.
      </p>
    </div>
  );
}
