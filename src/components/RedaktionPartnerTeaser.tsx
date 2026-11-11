import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Printer, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { MONTH_PRICE, YEAR_PRICE } from "@/lib/budget2027";

/**
 * Ensidigt partnerunderlag: endast verkliga siffror från partner-teaser (samma beräkning som
 * månadsrapporten). Säljargumenten ligger i följemejlet, inte i underlaget.
 */
type Period = "last_month" | "last_30_days" | "last_90_days";
type Num = number | null;
type Resp = {
  mode: "partner" | "area";
  partner: { namn: string; slug: string; niva: "premium" | "grundprofil"; produktomraden: string[] } | null;
  produktomraden: string[];
  period: { typ: Period; fran: string; till: string };
  synlighet: Record<string, Num>;
  forandring: Record<string, Num>;
  flaggor: string[];
  efterfragan_omrade: Record<string, Num> | null;
  sajt_totalt: { unika_besokare_period: Num; unika_besokare_sedan_lansering: Num };
  metod: string;
};
const AREAS = [
  ["bc", "Business Central"], ["fsc", "Finance & Supply Chain Management"], ["sales", "Sales"],
  ["marketing", "Customer Insights (Marketing)"], ["service", "Customer Service, Contact Center och Field Service"],
] as const;
const NB = "\u00A0";
const D365 = `Dynamics${NB}365`;
const fmt = (n: Num) => (n == null ? "–" : n.toLocaleString("sv-SE").replace(/\s/g, NB));
const delta = (n: Num) => (n == null ? "" : n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : "±0");
const kr = (n: number) => `${fmt(n)}${NB}kr`;
const VERIFY = "Verifierad betyder att redaktionen har kontrollerat företagsuppgifter, verksamhet och uppgiven kompetens. Det är ingen kvalitetsgaranti.";
const NEUTRAL = "Matchningen av partners styrs av kundens behov och relevans. Premium påverkar exponering och tjänster, inte vilken partner som rekommenderas.";

function periodLabel(p: Resp["period"]) {
  if (p.typ === "last_month") {
    const s = new Date(p.fran + "T00:00:00Z").toLocaleDateString("sv-SE", { month: "long", year: "numeric", timeZone: "UTC" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return `${p.fran} – ${p.till}`;
}

export default function RedaktionPartnerTeaser({ token }: { token: string | null }) {
  const [partners, setPartners] = useState<{ slug: string; name: string; is_featured: boolean }[]>([]);
  const [mode, setMode] = useState<"partner" | "area">("partner");
  const [slug, setSlug] = useState("");
  const [areas, setAreas] = useState<string[]>(["bc"]);
  const [period, setPeriod] = useState<Period>("last_month");
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (supabase as any).rpc("get_all_partner_names").then(({ data: rows }) => {
      setPartners(((rows as any[]) || []).map((r) => ({ slug: r.slug, name: r.name, is_featured: r.is_featured })).sort((a, b) => a.name.localeCompare(b.name, "sv")));
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    if (mode === "partner" && !slug) { setData(null); return; }
    if (mode === "area" && !areas.length) { setData(null); return; }
    let cancel = false;
    setLoading(true);
    supabase.functions.invoke("partner-teaser", {
      headers: { Authorization: `Bearer ${token}` },
      body: mode === "partner" ? { mode, period, partner_slug: slug } : { mode, period, product_areas: areas },
    }).then(({ data: res, error }) => {
      if (cancel) return;
      setLoading(false);
      if (error || res?.error) { toast.error("Kunde inte hämta underlaget"); setData(null); return; }
      setData(res as Resp);
    });
    return () => { cancel = true; };
  }, [token, mode, slug, areas, period]);

  const isBasic = data?.partner?.niva === "grundprofil";
  const title = data ? (data.mode === "partner" ? `Underlag för ${data.partner?.namn}` : `Efterfrågan inom ${data.produktomraden.join(", ")}`) : "";
  const areaText = data?.produktomraden.length ? data.produktomraden.join(", ") : "–";
  const vis = useMemo(() => data ? [
    ["Visad i partnerlistan", "visad_i_listan"], ["Profilvisningar", "profilvisningar"], ["Unika besökare på profilen", "unika_profilbesokare"],
    ["Matchad", "matchad"], ["Jämförd med andra partners", "jamford"], ["Klick till er webbplats", "klick_till_webbplats"],
  ] as const : [], [data]);

  const asText = () => {
    if (!data) return "";
    const L = [title, periodLabel(data.period), "", data.mode === "partner" ? "Er synlighet på d365.se" : `Snitt per partner inom området${data.synlighet.antal_partners ? ` (${data.synlighet.antal_partners} partners)` : ""}`];
    for (const [label, k] of vis) {
      const v = k === "klick_till_webbplats" && isBasic ? "Ingår i Premium" : `${fmt(data.synlighet[k])}${data.forandring[k] != null ? ` (${delta(data.forandring[k])})` : ""}`;
      L.push(`- ${label}: ${v}`);
    }
    const e = data.efterfragan_omrade;
    L.push("", `Efterfrågan inom ${areaText}`);
    if (e) L.push(`- Unika besökare på sidor om området: ${fmt(e.unika_besokare_omradessidor)}`, `- Påbörjade / slutförda behovsanalyser: ${fmt(e.paborjade_behovsanalyser)} / ${fmt(e.slutforda_behovsanalyser)}`, `- Kravspecifikationer: ${fmt(e.kravspecifikationer)}`, `- Jämförelser: ${fmt(e.jamforelser)}`);
    L.push("", "d365.se totalt", `- Unika besökare under perioden: ${fmt(data.sajt_totalt.unika_besokare_period)}`, `- Unika besökare sedan lanseringen i mars 2026: ${fmt(data.sajt_totalt.unika_besokare_sedan_lansering)}`);
    L.push("", data.metod, NEUTRAL, "d365.se");
    return L.join("\n");
  };
  const coverMail = () => [
    `Hej,`, "",
    `Bifogat finns ett underlag med ${data?.mode === "partner" ? "era egna siffror" : "efterfrågan inom ert område"} på d365.se för ${data ? periodLabel(data.period).toLowerCase() : "perioden"}.`, "",
    "57 % av köpresan har passerat när första leverantörskontakten sker, och 84 % väljer sin förstahandsleverantör före första kontakten (6sense 2026, europeiskt urval). d365.se finns med i den tidiga delen av köpresan.", "",
    `Premium kostar ${YEAR_PRICE[1].toLocaleString("sv-SE")} kr/år exkl. moms (eller ${MONTH_PRICE[1].toLocaleString("sv-SE")} kr/mån) och ger verifierad profil, direktlänk till er webbplats med UTM-mätning, månadsrapport med visningar, jämförelser och klick, samt INSIDE-intervju till halva priset. Ingen separat mötesavgift, Finder's Fee först vid förmedlad affär.`, "",
    "Vi lovar inte ett visst antal leads. Säg till om ni vill gå igenom siffrorna tillsammans.", "",
    "Thomas Laine · thomas.laine@dynamicfactory.se · d365.se",
  ].join("\n");

  return (
    <div className="space-y-4">
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Partnerunderlag (1 sida)</CardTitle>
          <CardDescription>Sakligt underlag med verkliga siffror att bifoga i mejl. Sidor för partners och redaktionen räknas inte som besök.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={mode} onValueChange={(v) => setMode(v as "partner" | "area")}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="partner">Listad partner</SelectItem>
                <SelectItem value="area">Produktområde (ej listad partner)</SelectItem>
              </SelectContent>
            </Select>
            {mode === "partner" && (
              <Select value={slug} onValueChange={setSlug}>
                <SelectTrigger className="w-72"><SelectValue placeholder="Välj partner" /></SelectTrigger>
                <SelectContent>{partners.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}{p.is_featured ? "" : " (grundprofil)"}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="last_month">Förra månaden</SelectItem>
                <SelectItem value="last_30_days">Senaste 30 dagarna</SelectItem>
                <SelectItem value="last_90_days">Senaste 90 dagarna</SelectItem>
              </SelectContent>
            </Select>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
          {mode === "area" && (
            <div className="flex flex-wrap gap-4">
              {AREAS.map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={areas.includes(k)} onCheckedChange={(c) => setAreas((a) => c ? [...a, k] : a.filter((x) => x !== k))} />{label}
                </label>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={!data} onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" />Skriv ut / spara som PDF</Button>
            <Button size="sm" variant="outline" disabled={!data} onClick={async () => { await navigator.clipboard.writeText(asText()); toast.success("Underlaget är kopierat"); }}><Copy className="w-4 h-4 mr-1" />Kopiera som text</Button>
            <Button size="sm" variant="outline" disabled={!data} onClick={async () => { await navigator.clipboard.writeText(coverMail()); toast.success("Följemejlet är kopierat"); }}><Mail className="w-4 h-4 mr-1" />Kopiera följemejl</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <article className="mx-auto max-w-[210mm] rounded-xl border bg-card p-8 text-sm text-foreground print:max-w-none print:border-0 print:p-0">
          <header className="flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">d365.se</p>
              <h2 className="mt-1 text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{periodLabel(data.period)}</p>
            </div>
            <img src="/d365-logo.svg" alt="d365.se" className="h-10 w-auto" />
          </header>

          <section className="mt-5">
            <h3 className="font-semibold">{data.mode === "partner" ? "Er synlighet på d365.se" : `Snitt per partner inom området${data.synlighet.antal_partners ? ` (${data.synlighet.antal_partners} partners)` : ""}`}</h3>
            {data.mode === "area" && data.synlighet.antal_partners == null && <p className="mt-1 text-xs text-muted-foreground">Färre än tre partners inom området, därför visas inget snitt.</p>}
            <div className="mt-3 grid grid-cols-3 gap-3">
              {vis.map(([label, k]) => (
                <div key={k} className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {k === "klick_till_webbplats" && isBasic ? <p className="mt-1 font-semibold">Ingår i Premium</p> : (
                    <p className="mt-1 text-xl font-bold">{fmt(data.synlighet[k])} <span className="text-xs font-normal text-muted-foreground">{delta(data.forandring[k])}</span></p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <h3 className="font-semibold">Efterfrågan inom {data.mode === "partner" ? "ert område" : "området"}</h3>
              <p className="text-xs text-muted-foreground">{areaText}</p>
              <dl className="mt-2 space-y-1">
                <Row l="Unika besökare på sidor om området" v={fmt(data.efterfragan_omrade?.unika_besokare_omradessidor ?? null)} />
                <Row l="Påbörjade / slutförda behovsanalyser" v={`${fmt(data.efterfragan_omrade?.paborjade_behovsanalyser ?? null)} / ${fmt(data.efterfragan_omrade?.slutforda_behovsanalyser ?? null)}`} />
                <Row l="Kravspecifikationer" v={fmt(data.efterfragan_omrade?.kravspecifikationer ?? null)} />
                <Row l="Jämförelser" v={fmt(data.efterfragan_omrade?.jamforelser ?? null)} />
              </dl>
            </div>
            <div>
              <h3 className="font-semibold">d365.se totalt</h3>
              <dl className="mt-2 space-y-1">
                <Row l="Unika besökare under perioden" v={fmt(data.sajt_totalt.unika_besokare_period)} />
                <Row l="Unika besökare sedan lanseringen i mars 2026" v={fmt(data.sajt_totalt.unika_besokare_sedan_lansering)} />
              </dl>
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold">Grundprofil</h4>
              <p className="mt-1 text-muted-foreground">Kostnadsfri. Företaget listas med grunduppgifter och kan visas när köpare söker partner inom {D365}.</p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold">Premium</h4>
              <p className="mt-1 text-muted-foreground">Från {kr(MONTH_PRICE[1])}/mån eller {kr(YEAR_PRICE[1])}/år exkl. moms. Utökad profil, verifiering, direktlänk till er webbplats och månadsrapport.</p>
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">{VERIFY}</p>
          </section>

          <footer className="mt-5 space-y-1 border-t pt-3 text-xs text-muted-foreground">
            <p>{data.metod}</p>
            <p>{NEUTRAL}</p>
            <p>Kontakt: d365.se</p>
          </footer>
        </article>
      )}
    </div>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between gap-3 border-b border-dashed py-1"><dt className="text-muted-foreground">{l}</dt><dd className="font-semibold">{v}</dd></div>;
}
