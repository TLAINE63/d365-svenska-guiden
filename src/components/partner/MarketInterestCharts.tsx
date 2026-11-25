import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MARKET_INTEREST, type InterestRow } from "@/data/marketInterest";
import { withNbsp } from "@/lib/marketInterestLabels";

const isRows = (r: unknown): r is InterestRow[] =>
  Array.isArray(r) && r.every((x) => x && typeof x.label === "string" && typeof x.count === "number");

function Bars({ title, rows, max = 6, unit = "percent" }: { title: string; rows: InterestRow[]; max?: number; unit?: "percent" | "count" }) {
  const total = rows.reduce((s, r) => s + r.count, 0) || 1;
  const shown = rows.filter((r) => unit === "count" || r.count / total >= 0.01).slice(0, max);
  const top = Math.max(...shown.map((r) => r.count), 1);
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between gap-3 text-sm mb-1">
              <span>{withNbsp(r.label)}</span>
              <span className="font-semibold tabular-nums whitespace-nowrap">
                {unit === "percent" ? `${Math.round((r.count / total) * 100)}\u00A0%` : r.count.toLocaleString("sv-SE")}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${(r.count / top) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketInterestCharts() {
  const [d, setD] = useState(MARKET_INTEREST);
  useEffect(() => {
    let alive = true;
    (supabase.rpc as any)("public_market_interest").then(({ data }: any) => {
      if (alive && data && isRows(data.products) && isRows(data.situations) && isRows(data.tools) && data.products.length) setD(data);
    });
    return () => { alive = false; };
  }, []);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Bars title="Intresse per produktområde" rows={d.products} />
      <Bars title="Köparens situation" rows={d.situations} />
      <Bars title="Mest använda verktyg och guider" rows={d.tools} unit="count" />
    </div>
  );
}
