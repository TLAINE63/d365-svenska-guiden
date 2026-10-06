import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, X, Copy, Printer, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Metrics = {
  profileViews: number; profileVisitors: number; listed: number; matched: number;
  compared: number; saved: number; websiteClicks: number;
};
type Row = { slug: string; name: string; is_featured: boolean; current: Metrics | null; previous: Metrics | null };
type Resp = { month: string; previous_month: string; measured_since: string | null; rows: Row[] };

const COLS: { key: keyof Metrics; label: string; hint: string }[] = [
  { key: "profileViews", label: "Profilvisningar", hint: "antal" },
  { key: "profileVisitors", label: "Unika på profil", hint: "unika" },
  { key: "listed", label: "Visad i listan", hint: "unika" },
  { key: "matched", label: "Matchad", hint: "unika" },
  { key: "compared", label: "Jämförd", hint: "unika" },
  { key: "saved", label: "Sparad", hint: "antal" },
  { key: "websiteClicks", label: "Klick till webbplats", hint: "antal" },
];

function lastFullMonth() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
}

function delta(cur?: number, prev?: number) {
  if (prev === undefined) return "Ingen data";
  const diff = (cur ?? 0) - prev;
  return diff === 0 ? "±0" : diff > 0 ? `+${diff}` : `${diff}`;
}

function reportText(r: Row, month: string, prevMonth: string) {
  const lines = [`${r.name} – d365.se, ${month}`, ""];
  for (const c of COLS) {
    const cur = r.current?.[c.key] ?? 0;
    lines.push(`${c.label}: ${cur} (${delta(cur, r.previous?.[c.key])} mot ${prevMonth})`);
  }
  lines.push("", "Mätt anonymt och cookiefritt. Alla besökare räknas.");
  return lines.join("\n");
}

export default function RedaktionPartnerMonthlyReport({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [month, setMonth] = useState(lastFullMonth());
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancel = false;
    setLoading(true);
    supabase.functions.invoke("manage-partner-reports", { body: { action: "partner_monthly_stats", token, month } })
      .then(({ data: res, error }) => {
        if (cancel) return;
        setLoading(false);
        if (error || res?.error) {
          if (String(res?.error || error?.message).includes("session")) onSessionExpired?.();
          toast.error("Kunde inte hämta partnerstatistiken");
          return;
        }
        setData(res);
      });
    return () => { cancel = true; };
  }, [token, month, onSessionExpired]);

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return (data?.rows || []).filter((r) => !q || r.name.toLowerCase().includes(q) || r.slug.includes(q));
  }, [data, filter]);

  const copy = async (r: Row) => {
    await navigator.clipboard.writeText(reportText(r, data!.month, data!.previous_month));
    toast.success(`Rapporten för ${r.name} är kopierad`);
  };

  const sel = selected ? data?.rows.find((r) => r.slug === selected) : null;

  if (sel && data) {
    return (
      <Card className="print:shadow-none print:border-0">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="w-4 h-4 mr-1" />Alla partners</Button>
            <Button variant="outline" size="sm" onClick={() => copy(sel)}><Copy className="w-4 h-4 mr-1" />Kopiera rapporten</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" />Skriv ut / spara som PDF</Button>
          </div>
          <CardTitle>{sel.name}</CardTitle>
          <CardDescription>Månadsrapport d365.se, {data.month} (jämfört med {data.previous_month})</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLS.map((c) => (
            <div key={c.key} className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">{c.label} ({c.hint})</p>
              <p className="text-2xl font-bold">{sel.current?.[c.key] ?? 0}</p>
              <p className="text-xs text-muted-foreground">{delta(sel.current?.[c.key], sel.previous?.[c.key])} mot föregående månad</p>
            </div>
          ))}
          <p className="col-span-full text-xs text-muted-foreground mt-2">Mätt anonymt och cookiefritt. Alla besökare räknas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Månadsrapport per partner</CardTitle>
        <CardDescription>
          Profilvisningar, listvisningar, matchningar, jämförelser, sparningar och klick per partner. Anonymt och cookiefritt.
          {data?.measured_since && <> Mätning sedan {data.measured_since}.</>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} className="w-44" />
          <div className="relative">
            <Input placeholder="Filtrera partner, t.ex. Modia" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-64 pr-8" />
            {filter && (
              <button type="button" aria-label="Rensa" onClick={() => setFilter("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{rows.length} partners</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Partner</TableHead>
                {COLS.map((c) => <TableHead key={c.key} className="text-left whitespace-nowrap">{c.label}</TableHead>)}
                <TableHead className="text-left" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.slug}>
                  <TableCell className="text-left">
                    <Button variant="link" className="p-0 h-auto text-left justify-start" onClick={() => setSelected(r.slug)}>{r.name}</Button>
                  </TableCell>
                  {COLS.map((c) => (
                    <TableCell key={c.key} className="text-left whitespace-nowrap">
                      <span className="font-medium">{r.current?.[c.key] ?? 0}</span>
                      <span className="block text-[11px] text-muted-foreground">{delta(r.current?.[c.key], r.previous?.[c.key])}</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm" className="text-left" onClick={() => copy(r)}><Copy className="w-3.5 h-3.5 mr-1" />Kopiera</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={COLS.length + 2} className="text-left text-muted-foreground">Ingen data för vald månad.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
