import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Row { path: string; counts: Record<string, { d30: number; d90: number }> }
const COLS: { key: string; label: string }[] = [
  { key: "nasta_steg_visad", label: "Visningar" },
  { key: "nasta_steg_klick", label: "Klick" },
  { key: "partner_tillagd", label: "Partner tillagd" },
  { key: "verktyg_resultat", label: "Verktygsresultat" },
  { key: "verktyg_sparat", label: "Sparade underlag" },
  { key: "forfragan_paborjad", label: "Påbörjade förfrågningar" },
  { key: "forfragan_skickad", label: "Skickade förfrågningar" },
];

/** Del 5: visningar, klick och förfrågningar per sökväg (30/90 dagar). Bara anonyma antal. */
export default function LeadStepsReportCard({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [period, setPeriod] = useState<"d30" | "d90">("d30");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true); setFailed(false);
    supabase.functions.invoke("funnel-stats", { body: { token, action: "lead_steps" } })
      .then(({ data, error }) => {
        if (error || data?.error) { if (/Logga in|session/i.test(String(data?.error || ""))) onSessionExpired?.(); setFailed(true); return; }
        setRows((data?.rows || []) as Row[]);
      })
      .finally(() => setLoading(false));
  }, [token, onSessionExpired]);

  const sorted = useMemo(() => (rows || [])
    .map((r) => ({ ...r, v: (k: string) => r.counts[k]?.[period] ?? 0 }))
    .filter((r) => COLS.some((c) => r.v(c.key) > 0))
    .sort((a, b) => b.v("nasta_steg_visad") - a.v("nasta_steg_visad") || b.v("forfragan_skickad") - a.v("forfragan_skickad")), [rows, period]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle as="h2" className="text-lg">Nästa steg och förfrågningar per sida</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Anonyma antal per sökväg, sorterat på flest visningar.</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as "d30" | "d90")}>
          <SelectTrigger className="w-[150px]" aria-label="Period"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="d30">Senaste 30 dagar</SelectItem><SelectItem value="d90">Senaste 90 dagar</SelectItem></SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {failed && <p className="text-sm text-destructive">Statistiken kunde inte hämtas.</p>}
        {!loading && !failed && rows && sorted.length === 0 && <p className="text-sm text-muted-foreground">Inga händelser ännu under perioden.</p>}
        {sorted.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="py-2 pr-3">Sökväg</th>{COLS.map((c) => <th key={c.key} className="py-2 px-2 text-right">{c.label}</th>)}</tr></thead>
              <tbody>{sorted.slice(0, 200).map((r) => (
                <tr key={r.path} className="border-b last:border-0"><td className="py-1.5 pr-3 font-mono text-xs break-all">{r.path}</td>{COLS.map((c) => <td key={c.key} className="py-1.5 px-2 text-right tabular-nums">{r.v(c.key)}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
