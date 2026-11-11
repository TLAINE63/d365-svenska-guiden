import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSiteTrafficStats } from "@/hooks/useSiteTrafficStats";

/**
 * Säljunderlag Premium (inspirerat av "Premium Partner – nytt erbjudande 2026").
 * Visar sajtens verkliga trafik och vald partners egna månadssiffror (samma källa
 * som månadsrapporten) bredvid erbjudandet, så underlaget aldrig innehåller handskrivna siffror.
 */
type Metrics = { profileViews: number; profileVisitors: number; listed: number; matched: number; compared: number; saved: number; websiteClicks: number };
type Row = { slug: string; name: string; is_featured: boolean; current: Metrics | null; previous: Metrics | null };
type Resp = { month: string; previous_month: string; rows: Row[] };

const NB = "\u00A0";
const D365 = `Dynamics${NB}365`;
const fmt = (n: number) => n.toLocaleString("sv-SE");
function lastFullMonth() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
}

const JOURNEY = ["Behov", "Utforska", "Jämföra", "Ta kontakt", "Välja", "Utveckla"];
const INCLUDED = [
  ["Synlighet & egen profillänk", `En mer detaljerad presentation av företaget och er ${D365}-kompetens.`],
  ["Verifierad partner", "Kontrollerade uppgifter med datum för senaste verifiering. Ingen kvalitetsgaranti."],
  ["Nyheter som får spridning", "Vi bevakar LinkedIn-inlägg, kundcase och events från er verksamhet."],
  ["Vi lär känna era prioriteringar", "Löpande dialog om kompetens, målgrupper och uppdrag ni söker."],
  ["Aktivt arbete med affärer", "Vi fångar förfrågningar, identifierar intressesignaler och skapar relevanta kontakter."],
  ["Resultatbaserad förmedling", "Ingen separat mötesavgift för Premium. Finder's Fee först vid förmedlad affär."],
];

export default function RedaktionSalesKitTab({ token }: { token: string | null }) {
  const traffic = useSiteTrafficStats(token, true, "admin");
  const [month, setMonth] = useState(lastFullMonth());
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState<string>("none");

  useEffect(() => {
    if (!token) return;
    let cancel = false;
    setLoading(true);
    supabase.functions.invoke("manage-partner-reports", { body: { action: "partner_monthly_stats", token, month } })
      .then(({ data: res, error }) => {
        if (cancel) return;
        setLoading(false);
        if (error || res?.error) { toast.error("Kunde inte hämta partnersiffror"); return; }
        setData(res);
      });
    return () => { cancel = true; };
  }, [token, month]);

  const rows = useMemo(() => [...(data?.rows || [])].sort((a, b) => a.name.localeCompare(b.name, "sv")), [data]);
  const sel = rows.find((r) => r.slug === slug) || null;
  const t30 = traffic.totals.d30;
  const t90 = traffic.totals.d90;
  const topPages = traffic.topPages.d30.filter((p) => p.views > 0).slice(0, 6);
  const m = sel?.current;

  const pitchText = () => {
    const lines = [
      `${sel ? sel.name + " – " : ""}Premium Partner på d365.se`,
      "",
      `d365.se senaste 30 dagarna: ${fmt(t30.uniqueVisitors)} unika besökare och ${fmt(t30.pageViews)} sidvisningar (90 dagar: ${fmt(t90.uniqueVisitors)} / ${fmt(t90.pageViews)}).`,
    ];
    if (sel && m) {
      lines.push(`${sel.name} under ${data?.month}: visad i partnerlistan för ${fmt(m.listed)} köpare, matchad ${fmt(m.matched)}, jämförd ${fmt(m.compared)}, ${fmt(m.profileViews)} profilvisningar och ${fmt(m.websiteClicks)} klick till er webbplats.`);
    }
    lines.push(
      "",
      "57 % av köpresan har passerat när första leverantörskontakten sker, och 84 % väljer sin förstahandsleverantör före första kontakten (6sense 2026, europeiskt urval).",
      "",
      "Premium: 7 990 kr/år exkl. moms (spara 3 950 kr mot 12 × 995 kr/mån). 0 kr i separat mötesavgift, Finder's Fee först när en förmedlad kontakt blir affär.",
      "Vi lovar inte ett visst antal leads, vi arbetar löpande för att hitta relevanta möjligheter.",
      "",
      "Thomas Laine · thomas.laine@dynamicfactory.se · d365.se",
    );
    return lines.join("\n");
  };

  return (
    <div className="space-y-4">
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Säljunderlag Premium</CardTitle>
          <CardDescription>Välj partner för att lägga in deras egna siffror. Skriv ut som PDF eller kopiera texten till ett mejl.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Select value={slug} onValueChange={setSlug}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Välj partner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Allmänt underlag (ingen partner)</SelectItem>
              {rows.map((r) => <SelectItem key={r.slug} value={r.slug}>{r.name}{r.is_featured ? "" : " (grundprofil)"}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} className="w-44" />
          {(loading || traffic.loading) && <Loader2 className="w-4 h-4 animate-spin" />}
          <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(pitchText()); toast.success("Säljtexten är kopierad"); }}><Copy className="w-4 h-4 mr-1" />Kopiera säljtext</Button>
          <Button size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" />Skriv ut / spara som PDF</Button>
        </CardContent>
      </Card>

      <article data-sales-kit className="rounded-xl border bg-card overflow-hidden print:border-0">
        <header className="bg-primary text-primary-foreground p-8">
          <p className="text-xs uppercase tracking-widest opacity-80">Nytt Premium-erbjudande · d365.se</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight">Era nästa {D365}-kunder letar redan. Finns ni med när de väljer partner?</h2>
          <p className="mt-3 max-w-2xl opacity-90">Bli synligare under hela köpresan och låt oss arbeta aktivt för att skapa relevanta affärsmöjligheter{sel ? ` för ${sel.name}` : ""}.</p>
        </header>

        <section className="p-8 grid gap-4 md:grid-cols-4">
          <Stat label="Unika besökare, 30 dagar" value={fmt(t30.uniqueVisitors)} />
          <Stat label="Sidvisningar, 30 dagar" value={fmt(t30.pageViews)} />
          <Stat label="57 %" value="av köpresan" note="har passerat före första leverantörskontakt" />
          <Stat label="84 %" value="förstahandsval" note="väljs före första kontakten" />
          <p className="md:col-span-4 text-xs text-muted-foreground">Trafik: d365.se, anonym och cookiefri mätning. Köpresa: 6sense, 2026 B2B Buyer Experience Report – European Edition.</p>
        </section>

        {sel && (
          <section className="px-8 pb-8">
            <h3 className="text-lg font-semibold">{sel.name} på d365.se, {data?.month}</h3>
            {m ? (
              <div className="mt-3 grid gap-3 grid-cols-2 md:grid-cols-5">
                <Stat label="Visad i listan" value={fmt(m.listed)} note="unika köpare" />
                <Stat label="Matchad" value={fmt(m.matched)} note="unika" />
                <Stat label="Jämförd" value={fmt(m.compared)} note="mot andra partners" />
                <Stat label="Profilvisningar" value={fmt(m.profileViews)} />
                <Stat label="Klick till webbplats" value={fmt(m.websiteClicks)} />
              </div>
            ) : <p className="mt-2 text-sm text-muted-foreground">Inga registrerade siffror för perioden.</p>}
            {!sel.is_featured && <p className="mt-3 text-sm">Som grundprofil syns ni, men köparen kan inte klicka vidare till er webbplats. Premium ger direktknapp, verifiering och aktiv förmedling.</p>}
          </section>
        )}

        <section className="px-8 pb-8">
          <h3 className="text-lg font-semibold">Vi hjälper kunden att köpa, och er att bli valda</h3>
          <ol className="mt-3 flex flex-wrap gap-2">
            {JOURNEY.map((s, i) => <li key={s} className="rounded-full border px-3 py-1 text-sm"><span className="font-semibold text-accent">{i + 1}</span> {s}</li>)}
          </ol>
          {topPages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium">Mest besökta sidor senaste 30 dagarna</p>
              <ul className="mt-2 grid gap-1 md:grid-cols-2 text-sm text-muted-foreground">
                {topPages.map((p) => <li key={p.path} className="flex justify-between gap-3 border-b py-1"><span className="truncate">{p.path}</span><span>{fmt(p.views)}</span></li>)}
              </ul>
            </div>
          )}
        </section>

        <section className="px-8 pb-8">
          <h3 className="text-lg font-semibold">Mer än en plats i partnerkatalogen</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {INCLUDED.map(([t, d], i) => (
              <div key={t} className="rounded-lg border p-4">
                <p className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-8 pb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border-2 border-primary p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Premium Partner</p>
            <p className="mt-1 text-3xl font-bold whitespace-nowrap">7{NB}990 kr/år</p>
            <p className="text-sm text-muted-foreground">exkl. moms, årsbetalning. Spara 3{NB}950 kr (33 %) mot 995 kr/mån.</p>
          </div>
          <div className="rounded-lg border p-6">
            <p className="font-semibold">Möte → Affär → Finder's Fee</p>
            <p className="mt-1 text-sm text-muted-foreground">0 kr i separat mötesavgift för Premium. Ersättning enligt avtal först när en förmedlad introduktion blir affär.</p>
          </div>
          <p className="md:col-span-2 text-xs text-muted-foreground">Verifierad är en kontroll, Premium är ett erbjudande. Matchning styrs av kundens behov, inte betalnivå. Vi lovar inte ett visst antal leads.</p>
        </section>

        <footer className="border-t px-8 py-5 text-sm flex flex-wrap justify-between gap-2">
          <span className="font-semibold">Ska vi skapa fler affärsmöjligheter tillsammans?</span>
          <span className="text-muted-foreground">thomas.laine@dynamicfactory.se · d365.se</span>
        </footer>
      </article>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
