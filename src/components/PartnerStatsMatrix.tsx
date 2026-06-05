import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Row {
  partner_slug: string;
  partner_name: string;
  is_featured: boolean;
  agreement_signed: boolean;
  primary: {
    exposures: number;
    profile_visits: number;
    card_clicks: number;
    website_clicks: number;
    identified_companies: number;
  };
  comparison: {
    exposures: number;
    profile_visits: number;
    card_clicks: number;
    website_clicks: number;
    identified_companies: number;
  };
}

interface Props {
  token: string | null;
  partnerSlug?: string; // when set, fetches only a single partner (used in edit dialog)
  primaryDays?: number;
  comparisonDays?: number;
  title?: string;
}

const COLUMNS: { key: keyof Row["primary"]; label: string }[] = [
  { key: "exposures", label: "Exponeringar" },
  { key: "profile_visits", label: "Profilbesök" },
  { key: "card_clicks", label: "Kortklick" },
  { key: "website_clicks", label: "Klick till sajt" },
  { key: "identified_companies", label: "Identifierade företag" },
];

function Cell({ a, b }: { a: number; b: number }) {
  return (
    <span className="tabular-nums">
      <span className="font-semibold text-foreground">{a}</span>
      <span className="text-muted-foreground text-xs ml-1">({b})</span>
    </span>
  );
}

export default function PartnerStatsMatrix({
  token,
  partnerSlug,
  primaryDays = 30,
  comparisonDays = 90,
  title,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setErr(null);
    supabase.functions
      .invoke("manage-partner-reports", {
        body: { action: "stats_matrix", token, primary_days: primaryDays, comparison_days: comparisonDays, partner_slug: partnerSlug },
      })
      .then(({ data, error }) => {
        if (!active) return;
        setLoading(false);
        if (error || data?.error) { setErr(data?.error || error?.message || "Fel"); return; }
        setRows(data.rows || []);
      });
    return () => { active = false; };
  }, [token, partnerSlug, primaryDays, comparisonDays]);

  const single = !!partnerSlug;
  const heading = title || (single ? "Aktivitet" : "Partner-jämförelse");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{heading}</span>
          <span className="text-xs font-normal text-muted-foreground">
            Senaste {primaryDays} dagarna <span className="opacity-70">(senaste {comparisonDays} dagarna inom parentes)</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin mr-2" />Laddar statistik…</div>
        ) : err ? (
          <div className="text-sm text-destructive">{err}</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4">Ingen data.</div>
        ) : single ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {COLUMNS.map((c) => (
              <div key={c.key} className="rounded-md border bg-muted/30 p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-xl"><Cell a={rows[0].primary[c.key]} b={rows[0].comparison[c.key]} /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 sticky left-0 bg-card">Partner</th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="px-2 py-2 text-right whitespace-nowrap">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.partner_slug} className="border-b hover:bg-muted/40">
                    <td className="px-2 py-2 sticky left-0 bg-card">
                      <div className="font-medium text-foreground">{r.partner_name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {r.agreement_signed ? "Avtal" : "Ej avtal"}{r.is_featured ? " · Featured" : ""}
                      </div>
                    </td>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="px-2 py-2 text-right whitespace-nowrap">
                        <Cell a={r.primary[c.key]} b={r.comparison[c.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] text-muted-foreground mt-3 px-2">
              Format: <strong>30d</strong> <span className="opacity-70">(90d)</span>. Sorterat på total aktivitet senaste 30 dagarna.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
