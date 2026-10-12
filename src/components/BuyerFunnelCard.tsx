import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

/** Datum då den nya köparfunnelmätningen (Sprint 6) började. Ingen historik rekonstrueras före detta. */
const MEASUREMENT_START = "2026-10-12";

interface Step { key?: string; label: string; count: number }
interface Seg { key: string; sessions: number; plan: number; dialog: number }
interface Data {
  sessions: number;
  main: Step[];
  funnels: { a: Step[]; b: Step[]; c: Step[] };
  dropoffs: { label: string; from: number; to: number }[];
  conversions: { advisory: number; partner_request: number; intro: number };
  nba: { key: string; label: string; viewed: number; clicked: number }[];
  by_area: Seg[]; by_state: Seg[]; by_source: Seg[]; by_landing: Seg[];
}

const AREA: Record<string, string> = { erp: "Affärssystem / ERP", sales: "Försäljning", marketing: "Marknad & kunddata", service: "Kundservice & fältservice", multi: "Flera områden / osäker", crm: "CRM (från planen)", "okänt": "Okänt (ingen plan)" };
const STATE: Record<string, string> = { exploring: "Utforskar ny lösning", known_product: "Har valt produkt", existing_customer: "Befintlig Dynamics-kund", "okänt": "Okänt (ingen plan)" };
const SOURCE: Record<string, string> = { seo: "Organisk sökning", geo_ai: "AI-assistent", direct: "Direkt", internal: "Intern", social: "Sociala medier", email: "E-post", paid: "Kampanj/annons", referral: "Extern hänvisning", businesscentral_se: "businesscentral.se", "okänt": "Okänt" };

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–");

function Funnel({ title, steps }: { title: string; steps: Step[] }) {
  const first = steps[0]?.count || 0;
  const max = Math.max(1, ...steps.map((s) => s.count));
  return (
    <div className="min-w-0">
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <ul className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={s.label} className="text-xs">
            <div className="flex justify-between gap-2">
              <span>{s.label}</span>
              <span className="tabular-nums">{s.count}{i > 0 ? ` · ${pct(s.count, steps[i - 1].count)} av föreg. · ${pct(s.count, first)} totalt` : ""}</span>
            </div>
            <div className="mt-0.5 h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(s.count / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SegTable({ title, rows, labels }: { title: string; rows: Seg[]; labels?: Record<string, string> }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      {rows.length === 0 ? <p className="text-xs text-muted-foreground">Ingen data ännu.</p> : (
        <table className="w-full text-xs">
          <thead><tr className="text-left text-muted-foreground"><th className="font-normal">Segment</th><th className="text-right font-normal">Sessioner</th><th className="text-right font-normal">Plan</th><th className="text-right font-normal">Dialog</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.key} className="border-t border-border"><td className="py-1">{labels?.[r.key] ?? r.key}</td><td className="text-right tabular-nums">{r.sessions}</td><td className="text-right tabular-nums">{r.plan}</td><td className="text-right tabular-nums">{r.dialog}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}

/** Köparfunnel (Sprint 6): visar endast faktiska, uppmätta händelser. Delas av /redaktion och admin. */
export default function BuyerFunnelCard({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [area, setArea] = useState("all");
  const [state, setState] = useState("all");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true); setFailed(false);
    supabase.functions.invoke("funnel-stats", { body: { token, action: "buyer", days: Number(days), area: area === "all" ? null : area, state: state === "all" ? null : state } })
      .then(({ data: d, error }) => {
        if (error || d?.error) { if (/Logga in|session/i.test(String(d?.error || ""))) onSessionExpired?.(); setFailed(true); return; }
        setData(d);
      })
      .finally(() => setLoading(false));
  }, [token, days, area, state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card>
      <CardHeader>
        <CardTitle>Köparresan: från besök till dialog</CardTitle>
        <p className="text-sm text-muted-foreground">
          Unika sessioner som faktiskt gjort varje steg, alla besök räknas. Den nya mätningen av plan, rekommenderat nästa steg och segment startade {MEASUREMENT_START}; äldre perioder saknar dessa steg och har inte rekonstruerats.
          Andelar räknas alltid mot det namngivna föregående steget. "Skickad" betyder inte att en partnerdialog är bekräftad.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="7">7 dagar</SelectItem><SelectItem value="30">30 dagar</SelectItem><SelectItem value="90">90 dagar</SelectItem></SelectContent>
          </Select>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="w-[210px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Alla områden</SelectItem>{Object.entries(AREA).filter(([k]) => k !== "okänt").map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-[210px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Alla köparlägen</SelectItem>{Object.entries(STATE).filter(([k]) => k !== "okänt").map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {failed && !loading && <p className="text-sm text-muted-foreground">Kunde inte hämta köparresan just nu.</p>}
        {data && !loading && (
          <>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded border border-border p-3"><div className="text-muted-foreground">Rådgivning skickad till d365.se</div><div className="text-2xl font-semibold tabular-nums">{data.conversions.advisory}</div></div>
              <div className="rounded border border-border p-3"><div className="text-muted-foreground">Partnerförfrågan skickad</div><div className="text-2xl font-semibold tabular-nums">{data.conversions.partner_request}</div></div>
              <div className="rounded border border-border p-3"><div className="text-muted-foreground">Introduktion till grundprofil begärd</div><div className="text-2xl font-semibold tabular-nums">{data.conversions.intro}</div></div>
            </div>
            <p className="text-xs text-muted-foreground">Bekräftade partnerdialoger och kvalificerade affärsmöjligheter visas inte, eftersom sajten ännu inte kan verifiera dem. Siffrorna ovan är närmaste verifierbara steg.</p>

            <Funnel title="Huvudfunnel (varje steg räknas oberoende av ordning)" steps={data.main} />

            <div className="grid gap-6 md:grid-cols-3">
              <Funnel title="A. Vägledd resa" steps={data.funnels.a} />
              <Funnel title="B. Partnerintent" steps={data.funnels.b} />
              <Funnel title="C. Befintlig Dynamics-kund" steps={data.funnels.c} />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Avhopp mellan faktiska steg</h4>
              <ul className="space-y-1 text-xs">{data.dropoffs.map((d) => <li key={d.label} className="flex justify-between gap-2 border-t border-border py-1"><span>{d.label}</span><span className="tabular-nums">{d.to} av {d.from} · {pct(d.to, d.from)}</span></li>)}</ul>
              <p className="mt-1 text-xs text-muted-foreground">Visar var avhopp sker, inte varför.</p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Rekommenderat nästa steg i Min D365-plan</h4>
              {data.nba.length === 0 ? <p className="text-xs text-muted-foreground">Ingen data ännu.</p> : (
                <table className="w-full text-xs">
                  <thead><tr className="text-left text-muted-foreground"><th className="font-normal">Rekommendation</th><th className="text-right font-normal">Visad</th><th className="text-right font-normal">Klickad</th><th className="text-right font-normal">Klickandel</th></tr></thead>
                  <tbody>{data.nba.map((n) => <tr key={n.key} className="border-t border-border"><td className="py-1">{n.label}</td><td className="text-right tabular-nums">{n.viewed}</td><td className="text-right tabular-nums">{n.clicked}</td><td className="text-right tabular-nums">{pct(n.clicked, n.viewed)}</td></tr>)}</tbody>
                </table>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SegTable title="Per huvudområde" rows={data.by_area} labels={AREA} />
              <SegTable title="Nya kontra befintliga kunder" rows={data.by_state} labels={STATE} />
              <SegTable title="Per ingångskälla" rows={data.by_source} labels={SOURCE} />
              <SegTable title="Per första landningssida" rows={data.by_landing} />
            </div>
            <p className="text-xs text-muted-foreground">Plan = sessioner som skapat Min D365-plan. Dialog = sessioner som skickat rådgivning, partnerförfrågan eller introduktion. Segment hämtas från planens strukturerade val, aldrig från kontaktuppgifter.</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
