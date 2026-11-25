import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MARKET_INTEREST, type InterestRow } from "@/data/marketInterest";
import { withNbsp } from "@/lib/marketInterestLabels";

const isRows = (r: unknown): r is InterestRow[] =>
  Array.isArray(r) && r.every((x) => x && typeof x.label === "string" && typeof x.count === "number");

// Tydligare visningsnamn och förklaringar (lagrade etiketter i databasen är oförändrade).
const DISPLAY: Record<string, { label: string; hint: string }> = {
  "Partnerval": { label: "Väljer partner", hint: "Jämför och läser om partners" },
  "Utveckling": { label: "Bygger vidare på befintligt system", hint: "Befintliga kunder, tillägg och ISV-lösningar" },
  "Nytt system": { label: "Utvärderar nytt system", hint: "Behovsanalys, kravspec, kostnad och systemval" },
  "AI": { label: "Undersöker AI och Copilot", hint: "AI-sidor, agenter och Copilot" },
  "Partnerbyte": { label: "Överväger att byta partner", hint: "Bytesguide och second opinion" },
  "Guider": { label: "Fördjupningsguider", hint: "Läsguider om t.ex. support, budget och roller" },
};

function Bars({ title, rows, max = 6, unit = "percent", subtitle }: { title: string; rows: InterestRow[]; max?: number; unit?: "percent" | "count"; subtitle?: string }) {
  const total = rows.reduce((s, r) => s + r.count, 0) || 1;
  const shown = rows.filter((r) => unit === "count" || r.count / total >= 0.01).slice(0, max);
  const top = Math.max(...shown.map((r) => r.count), 1);
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{subtitle || "\u00A0"}</p>
      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between gap-3 text-sm mb-1">
              <span>
                {withNbsp(DISPLAY[r.label]?.label ?? r.label)}
                {DISPLAY[r.label] && <span className="block text-xs text-muted-foreground">{DISPLAY[r.label].hint}</span>}
              </span>
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
      <Bars title="Intresse per produktområde" subtitle="Andel av sidvisningarna" rows={d.products} />
      <Bars title="Var köparna befinner sig" subtitle="Vad besökarna gör, utifrån sidorna de läser" rows={d.situations} />
      <Bars title="Mest använda verktyg och guider" subtitle="Antal sidvisningar" rows={d.tools} unit="count" />
    </div>
  );
}
