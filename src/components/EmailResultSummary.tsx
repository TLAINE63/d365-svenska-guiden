import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { cleanSummaryLines, type ResultSummaryTool } from "@/lib/resultSummary";

interface Props {
  tool: ResultSummaryTool;
  lines: string[];
  sourcePage: string;
  className?: string;
}

/** Steg 3: besökaren får sitt resultat mejlat, plus tre frågor att ställa till leverantörer. */
export default function EmailResultSummary({ tool, lines, sourcePage, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const clean = cleanSummaryLines(lines);
  if (!clean.length) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateBusinessEmail(email);
    if (err) { setError(err); return; }
    setError(null);
    setSending(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("send-result-summary", {
        body: { email, tool, lines: clean, follow_up: followUp, source_page: sourcePage },
      });
      if (fnErr || !data?.ok) throw new Error(data?.error || "fel");
      trackFunnelEvent({ event_type: "engagement", event_name: "result_summary_emailed", metadata: { tool, follow_up: followUp, source_page: sourcePage } });
      setDone(true);
    } catch (x) {
      setError(x instanceof Error && x.message !== "fel" ? x.message : "Det gick inte att skicka. Försök igen.");
    }
    setSending(false);
  };

  return (
    <section className={`rounded-lg border border-border bg-card p-5 sm:p-6 print:hidden ${className}`} aria-labelledby={`mejla-${tool}`}>
      {done ? (
        <p className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          Vi har skickat en bekräftelselänk till {email}. Klicka på länken i mejlet så får ni resultatet. {followUp ? "Thomas hör av sig när ni bekräftat." : "Ingen kommer att kontakta er."}
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <h2 id={`mejla-${tool}`} className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Mail className="h-5 w-5 text-accent" aria-hidden />
            Få resultatet mejlat till er
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Ni får sammanställningen ovan och tre frågor att ställa till leverantörerna, så att ni kan ta med det till ledningsgruppen.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:max-w-xl">
            <Input type="email" required maxLength={255} placeholder="jobb-epost@foretag.se" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Jobbmejl" className="min-h-11" />
            <Button type="submit" disabled={sending} className="min-h-11 shrink-0">{sending ? "Skickar…" : "Mejla resultatet"}</Button>
          </div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox checked={followUp} onCheckedChange={(v) => setFollowUp(v === true)} className="mt-0.5" />
            Thomas Laine på d365.se får gärna höra av sig om resultatet.
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">Endast jobbmejl. Inga partners får era uppgifter. Läs mer i <a href="/dataskydd/" className="underline">dataskyddspolicyn</a>.</p>
        </form>
      )}
    </section>
  );
}
