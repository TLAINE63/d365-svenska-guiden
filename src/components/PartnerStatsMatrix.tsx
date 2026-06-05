import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  type SortKey = "name" | keyof Row["primary"];
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "agreement" | "no_agreement" | "featured" | "active" | "inactive">("all");
  const [sortKey, setSortKey] = useState<SortKey>("exposures");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const totalActivity = (r: Row) =>
    r.primary.exposures + r.primary.profile_visits + r.primary.card_clicks + r.primary.website_clicks + r.primary.identified_companies;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (q && !r.partner_name.toLowerCase().includes(q) && !r.partner_slug.toLowerCase().includes(q)) return false;
      switch (categoryFilter) {
        case "agreement": return r.agreement_signed;
        case "no_agreement": return !r.agreement_signed;
        case "featured": return r.is_featured;
        case "active": return totalActivity(r) > 0;
        case "inactive": return totalActivity(r) === 0;
        default: return true;
      }
    });
    out = [...out].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.partner_name.localeCompare(b.partner_name, "sv") * dir;
      return (a.primary[sortKey] - b.primary[sortKey]) * dir;
    });
    return out;
  }, [rows, search, categoryFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "name" ? "asc" : "desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-40" /> :
    sortDir === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />;

  const categories: { value: typeof categoryFilter; label: string }[] = [
    { value: "all", label: "Alla" },
    { value: "agreement", label: "Avtal" },
    { value: "no_agreement", label: "Ej avtal" },
    { value: "featured", label: "Featured" },
    { value: "active", label: "Med aktivitet" },
    { value: "inactive", label: "Utan aktivitet" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between flex-wrap gap-2">
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
          <>
            <div className="flex flex-col gap-3 mb-3">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Sök partner…"
                  className="pl-8 pr-8 h-9"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <Button
                    key={c.value}
                    type="button"
                    size="sm"
                    variant={categoryFilter === c.value ? "default" : "outline"}
                    className="h-7 px-2.5 text-xs"
                    onClick={() => setCategoryFilter(c.value)}
                  >
                    {c.label}
                  </Button>
                ))}
                <span className="text-xs text-muted-foreground self-center ml-2">
                  Visar {filteredRows.length} av {rows.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-2 sticky left-0 bg-card">
                      <button onClick={() => toggleSort("name")} className="hover:text-foreground">Partner<SortIcon k="name" /></button>
                    </th>
                    {COLUMNS.map((c) => (
                      <th key={c.key} className="px-2 py-2 text-right whitespace-nowrap">
                        <button onClick={() => toggleSort(c.key)} className="hover:text-foreground">{c.label}<SortIcon k={c.key} /></button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr><td colSpan={COLUMNS.length + 1} className="px-2 py-6 text-center text-sm text-muted-foreground">Inga partners matchar.</td></tr>
                  ) : filteredRows.map((r) => (
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
                Format: <strong>{primaryDays}d</strong> <span className="opacity-70">({comparisonDays}d)</span>. Klicka på en kolumnrubrik för att sortera.
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
