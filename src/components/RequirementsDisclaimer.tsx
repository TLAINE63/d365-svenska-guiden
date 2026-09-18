import { AlertTriangle } from "lucide-react";

export default function RequirementsDisclaimer() {
  return (
    <div className="flex gap-3 items-start bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning-foreground" />
      <p>
        <span className="font-semibold text-foreground">Ett första kravunderlag.</span>{" "}
        Kontrollera kraven mot era processer innan underlaget används i en upphandling. Branschförslagen är
        framtagna med AI och kan innehålla fel.
      </p>
    </div>
  );
}
