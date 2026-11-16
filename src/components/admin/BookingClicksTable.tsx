import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
interface Data { months: string[]; rows: { placement: string; counts: Record<string, number> }[] }
export default function BookingClicksTable({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.functions.invoke("funnel-stats", { body: { token, action: "booking_clicks" } }).then(({ data, error }) => {
      if (!active) return;
      if (error || data?.error) { setFailed(true); if (/session|logga in/i.test(data?.error || "")) onUnauthorized(); return; }
      setData(data);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  return <section className="border-t border-border pt-6">
    <h2 className="text-xl font-semibold mb-4">Bokningsklick</h2>
    {failed ? <p role="alert" className="text-sm text-destructive">Kunde inte hämta bokningsklicken.</p> : !data ? <p className="text-sm text-muted-foreground">Hämtar…</p> : <>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left py-2 pr-4">Placering</th>{data.months.map((m) => <th key={m} className="text-right p-2 whitespace-nowrap">{m}</th>)}</tr></thead><tbody>{data.rows.map((r) => <tr key={r.placement} className="border-t border-border"><th className="text-left font-normal py-2 pr-4">{r.placement}</th>{data.months.map((m) => <td key={m} className="text-right p-2 tabular-nums">{r.counts[m] ?? 0}</td>)}</tr>)}</tbody></table></div>
      {data.rows.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Inga bokningsklick de senaste sex månaderna.</p>}
    </>}
  </section>;
}