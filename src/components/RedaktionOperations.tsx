import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function RedaktionOperations({ token, isAdmin }: { token: string | null; isAdmin: boolean }) {
  const [busy, setBusy] = useState(false);
  const [synced, setSynced] = useState<string | null>(null);
  const [month, setMonth] = useState(() => { const d = new Date(); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); });
  async function run(kind: "sync" | "monthly" | "funnel") {
    if (!token || busy) return;
    setBusy(true);
    try {
      const name = kind === "sync" ? "sync-snitcher-visits" : kind === "monthly" ? "manage-partner-reports" : "funnel-stats";
      const body = kind === "sync" ? { token } : kind === "monthly" ? { token, action: "partner_monthly_stats", month } : { token, action: "journey_funnels", days: 30 };
      const { data, error } = await supabase.functions.invoke(name, { body });
      if (error) { const details = error.context instanceof Response ? await error.context.text() : error.message; throw new Error(details); }
      if (data?.error) throw new Error(data.error);
      if (kind === "sync") { setSynced(new Date().toISOString()); toast.success("Snitcher är synkat"); return; }
      const rows = kind === "monthly" ? (data.rows ?? []).map((r: Record<string, unknown>) => ({ month, name: r.name, slug: r.slug, ...(r.current as Record<string, unknown> ?? {}) })) : data.funnels ?? [];
      const keys = [...new Set(rows.flatMap((r: Record<string, unknown>) => Object.keys(r)))];
      const cell = (v: unknown) => { const text = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v); return '"' + (/^[=+@-]/.test(text) ? "'" : "") + text.replaceAll('"', '""') + '"'; };
      const csv = [keys.map(cell).join(";"), ...rows.map((r: Record<string, unknown>) => keys.map(k => cell(r[k])).join(";"))].join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a"); a.href = url; a.download = kind === "monthly" ? `d365-manadsrapport-${month}.csv` : "d365-funnel-30-dagar.csv"; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }
  return <section className="border-y border-border py-5 mb-6 space-y-3">
    <h2 className="text-lg font-semibold">Drift &amp; Snabbåtgärder</h2>
    <div className="flex flex-wrap items-end gap-3">
      {isAdmin && <Button variant="outline" disabled={busy} onClick={() => run("sync")} className="gap-2"><RefreshCw className="h-4 w-4" />Synka Snitcher nu</Button>}
      <div><Label htmlFor="report-month">Rapportmånad</Label><Input id="report-month" type="month" value={month} onChange={e => setMonth(e.target.value)} className="w-44" /></div>
      <Button variant="outline" disabled={busy || !month} onClick={() => run("monthly")} className="gap-2"><Download className="h-4 w-4" />Månadsrapport</Button>
      <Button variant="outline" disabled={busy} onClick={() => run("funnel")} className="gap-2"><Download className="h-4 w-4" />Funnel, 30 dagar</Button>
    </div>
    {synced && <p className="text-sm text-muted-foreground">Senaste lyckade synk: {synced.slice(0, 10)} {synced.slice(11, 16)} UTC</p>}
  </section>;
}