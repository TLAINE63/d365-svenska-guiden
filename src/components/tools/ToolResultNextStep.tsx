import { useEffect, useState } from "react";
import { trackLeadStep } from "@/lib/leadSteps";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Check } from "lucide-react";
import { savePlanCalculation } from "@/lib/d365Plan";
import { inquiryHref } from "@/lib/inquirySelection";
import { findTool } from "@/lib/toolUnderlag";
import { recordTool, type ToolEntry } from "@/lib/toolContext";

interface Props { tool: string; product?: string; className?: string; entry?: Omit<ToolEntry, "at" | "tool"> }

/** Del 3: premium-PDF + Min plan och förfrågan med svaren förifyllda. */
export default function ToolResultNextStep({ tool, product, className = "", entry }: Props) {
  const { pathname } = useLocation();
  const [saved, setSaved] = useState(false);
  const [missing, setMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => { trackLeadStep("verktyg_resultat", tool, { once: true }); }, [tool]);

  const resolve = (): ToolEntry | undefined => {
    if (!entry) return findTool(tool);
    const e = { ...entry, tool, values: Object.fromEntries(Object.entries(entry.values).filter(([, v]) => v)) };
    recordTool(e);
    return { ...e, at: new Date().toISOString() };
  };

  const save = async () => {
    const t = resolve();
    if (!t) { setMissing(true); return; }
    const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
    setSaving(true); setFailed(false); setMissing(false);
    try {
      const { generateToolUnderlagPdf } = await import("@/utils/generateToolUnderlagPdf");
      await generateToolUnderlagPdf(t, date);
      savePlanCalculation({ id: tool, product: t.label, url: pathname, rows: Object.entries(t.values).map(([label, value]) => ({ label, value })) });
      setSaved(true);
      trackLeadStep("verktyg_sparat", tool);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const href = () => {
    const t = resolve();
    return `${inquiryHref({ product, industry: t?.industry, source: pathname })}&underlag=${encodeURIComponent(tool)}`;
  };

  return (
    <section data-next-step-block className={`rounded-xl border bg-card p-5 sm:p-6 ${className}`}>
      <h2 className="text-lg font-semibold">Spara underlaget</h2>
      <p className="mt-1 text-sm text-muted-foreground">Ladda ner resultatet som PDF. Det sparas också i Min D365-plan.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={saving} variant="default">{saved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}{saving ? "Skapar PDF…" : saved ? "Sparat" : "Spara underlaget"}</Button>
        <Link to={href()} onClick={(e) => { (e.currentTarget as HTMLAnchorElement).href = href(); trackLeadStep("nasta_steg_klick", tool); }} className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
          Få förslag på partners utifrån underlaget <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {missing && <p className="mt-2 text-sm text-muted-foreground">Ändra något i kalkylen först, så finns ett underlag att spara.</p>}
      {failed && <p role="alert" className="mt-2 text-sm text-destructive">PDF-filen kunde inte skapas. Försök igen.</p>}
    </section>
  );
}
