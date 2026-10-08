import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";

type Row = { views: number; website: number; contact: number; shortlist: number; inquiries: number; answered: number; products: Record<string, number>; industries: Record<string, number>; sizes: Record<string, number> };
type Partner = { slug: string; name: string; sites: Record<string, Row> };
const SITES = [["total", "Sammanlagt"], ["d365.se", "d365.se"], ["businesscentral.se", "businesscentral.se"]] as const;

const thisMonth = () => new Date().toISOString().slice(0, 7);
const dist = (m: Record<string, number>) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} (${v})`).join("; ");
const pct = (r: Row) => (r.inquiries ? `${Math.round((r.answered / r.inquiries) * 100)} %` : "–");

function toCsv(p: Partner, month: string) {
  const head = ["Månad", "Sajt", "Profilvisningar", "Klick till webbplats", "Klick på kontaktuppgifter", "Tillagd i kortlista", "Förfrågningar", "Andel med svar", "Produktområden", "Branscher", "Storlekar"];
  const rows = SITES.filter(([k]) => p.sites[k]).map(([k, label]) => {
    const r = p.sites[k];
    return [month, label, r.views, r.website, r.contact, r.shortlist, r.inquiries, pct(r), dist(r.products), dist(r.industries), dist(r.sizes)];
  });
  return [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
}

export default function AdminPartnerInquiryStats({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [month, setMonth] = useState(thisMonth());
  const [site, setSite] = useState<string>("total");
  const [data, setData] = useState<Partner[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !/^\d{4}-\d{2}$/.test(month)) return;
    setLoading(true); setError(null);
    supabase.functions.invoke("inquiry-status", { body: { action: "partner_stats", token, month } })
      .then(({ data: d, error: e }) => {
        if (e || d?.error) { setError("Kunde inte hämta partnerstatistiken."); if (String(d?.error || "").includes("session")) onSessionExpired?.(); return; }
        setData(d.partners);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, month]);

  const download = (p: Partner) => {
    const blob = new Blob(["\uFEFF" + toCsv(p, month)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `partnerstatistik-${p.slug}-${month}.csv`; a.click();
    URL.revokeObjectURL(a.href);
  };

  const rows = (data || []).filter((p) => p.sites[site]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Partnerstatistik: förfrågningar och uppföljning</CardTitle>
        <p className="text-sm text-muted-foreground">Per partner och månad. Inga företagsnamn eller kontaktuppgifter. Mäts från 2026-10-08.</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-[170px]" aria-label="Månad" />
          <Select value={site} onValueChange={setSite}>
            <SelectTrigger className="w-[190px]"><SelectValue /></SelectTrigger>
            <SelectContent>{SITES.map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : error ? <p className="text-sm text-destructive">{error}</p> : !rows.length ? (
          <p className="text-sm text-muted-foreground">Inga registrerade händelser för vald månad.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-3">Partner</th><th className="pr-3">Visningar</th><th className="pr-3">Webbplats</th><th className="pr-3">Kontaktuppg.</th><th className="pr-3">Kortlista</th><th className="pr-3">Förfrågningar</th><th className="pr-3">Svar</th><th className="pr-3">Produktområden</th><th />
              </tr></thead>
              <tbody>{rows.map((p) => { const r = p.sites[site]; return (
                <tr key={p.slug} className="border-b align-top">
                  <td className="py-2 pr-3 font-medium">{p.name}</td><td className="pr-3">{r.views}</td><td className="pr-3">{r.website}</td><td className="pr-3">{r.contact}</td><td className="pr-3">{r.shortlist}</td><td className="pr-3">{r.inquiries}</td><td className="pr-3">{pct(r)}</td>
                  <td className="pr-3 text-xs text-muted-foreground">{dist(r.products) || "–"}{dist(r.industries) && <><br />Bransch: {dist(r.industries)}</>}{dist(r.sizes) && <><br />Storlek: {dist(r.sizes)}</>}</td>
                  <td><Button size="sm" variant="outline" onClick={() => download(p)}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button></td>
                </tr>); })}</tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
