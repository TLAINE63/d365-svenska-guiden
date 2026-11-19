import { useEffect, useState } from "react";
import { trackLeadStep } from "@/lib/leadSteps";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Check, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { cleanSummaryLines } from "@/lib/resultSummary";
import { savePlanCalculation } from "@/lib/d365Plan";
import { inquiryHref } from "@/lib/inquirySelection";
import { findTool } from "@/lib/toolUnderlag";
import { recordTool, type ToolEntry } from "@/lib/toolContext";
import type { ToolPdfOptions } from "@/utils/generateToolUnderlagPdf";

interface Props { tool: string; product?: string; className?: string; entry?: Omit<ToolEntry, "at" | "tool">; pdf?: ToolPdfOptions }

/** Del 3: premium-PDF + Min plan och förfrågan med svaren förifyllda. */
export default function ToolResultNextStep({ tool, product, className = "", entry, pdf }: Props) {
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
      await generateToolUnderlagPdf(t, date, pdf);
      savePlanCalculation({ id: tool, product: t.label, url: pathname, rows: Object.entries(t.values).map(([label, value]) => ({ label, value })) });
      setSaved(true);
      trackLeadStep("verktyg_sparat", tool);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const [email, setEmail] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [mailing, setMailing] = useState(false);
  const [mailError, setMailError] = useState<string | null>(null);
  const [mailed, setMailed] = useState(false);

  const mail = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const err = validateBusinessEmail(email);
    if (err) { setMailError(err); return; }
    const t = resolve();
    if (!t) { setMissing(true); return; }
    setMailError(null); setMailing(true);
    try {
      const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
      const { toolUnderlagPdfBase64 } = await import("@/utils/generateToolUnderlagPdf");
      const pdf = await toolUnderlagPdfBase64(t, date, pdf);
      const lines = cleanSummaryLines([t.label, ...(t.industry ? [`Bransch: ${t.industry}`] : []), ...Object.entries(t.values).map(([k, v]) => `${k}: ${v}`)]);
      const { data, error } = await supabase.functions.invoke("send-result-summary", {
        body: { email, tool: "underlag", lines, follow_up: followUp, source_page: pathname, pdf_base64: pdf },
      });
      if (error || !data?.ok) throw new Error(data?.error || "fel");
      setMailed(true);
      trackLeadStep("verktyg_sparat", tool);
    } catch (x) {
      setMailError(x instanceof Error && x.message !== "fel" ? x.message : "Det gick inte att skicka. Försök igen.");
    }
    setMailing(false);
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
      <div className="mt-5 border-t border-border pt-4">
        {mailed ? (
          <p className="flex items-start gap-2 text-sm" role="status"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />Vi har skickat en bekräftelselänk till {email}. Klicka på länken så får ni PDF:en. {followUp ? "Thomas hör av sig när ni bekräftat." : "Ingen kommer att kontakta er."}</p>
        ) : (
          <form onSubmit={mail} className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4 text-accent" />Eller få PDF:en mejlad till er (frivilligt)</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:max-w-xl">
              <Input type="email" required maxLength={255} placeholder="jobb-epost@foretag.se" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Jobbmejl" className="min-h-11" />
              <Button type="submit" variant="outline" disabled={mailing} className="min-h-11 shrink-0">{mailing ? "Skickar…" : "Mejla PDF"}</Button>
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox checked={followUp} onCheckedChange={(v) => setFollowUp(v === true)} className="mt-0.5" />
              Thomas Laine på d365.se får gärna höra av sig om underlaget.
            </label>
            {mailError && <p role="alert" className="text-sm text-destructive">{mailError}</p>}
            <p className="text-xs text-muted-foreground">Endast jobbmejl. Ni bekräftar adressen via en länk först. Inga partners får era uppgifter. Läs mer i <a href="/dataskydd/" className="underline">dataskyddspolicyn</a>.</p>
          </form>
        )}
      </div>
    </section>
  );
}
