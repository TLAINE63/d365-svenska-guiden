import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadProgramTerms, TERMS_AREAS, TERMS_DATE, type TermsArea } from "@/utils/programTerms";
import { toast } from "sonner";

export default function RedaktionTermsTab() {
  const [pending, setPending] = useState<TermsArea | null>(null);
  async function download(area: TermsArea) {
    setPending(area);
    try { await downloadProgramTerms(area); }
    catch { toast.error("Kunde inte skapa dokumentet. Försök igen."); }
    finally { setPending(null); }
  }
  return <section className="space-y-5">
    <div>
      <h2 className="text-xl font-semibold">Avtalsvillkor</h2>
      <p className="mt-2 text-sm text-muted-foreground">Sammanställningar av publicerade villkor och aktuella priser. Uppdaterade {TERMS_DATE}. Individuella avtal, startdatum och rabatter regleras separat.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {TERMS_AREAS.map((area) => <Card key={area.id} className="flex flex-col">
        <CardHeader><FileText className="h-6 w-6 text-accent" aria-hidden="true" /><CardTitle className="text-lg">{area.title}</CardTitle></CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5">
          <p className="flex-1 text-sm text-muted-foreground">{area.description}</p>
          <Button disabled={pending !== null} onClick={() => download(area.id)} className="w-full gap-2" aria-label={`Ladda ner avtalsvillkor: ${area.title}`}>
            {pending === area.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Ladda ner PDF
          </Button>
        </CardContent>
      </Card>)}
    </div>
  </section>;
}