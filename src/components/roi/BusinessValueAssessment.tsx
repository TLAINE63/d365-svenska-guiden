import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  evaluateBusinessValue, workRowValue, leakRowValue, costRowValue, challengeRowValue, capitalRowValue, MAX_AI_PCT,
  EMPTY_BUSINESS_VALUE, exampleFor, type BusinessValueInput,
} from "@/lib/businessValue";

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";
const num = (s: string) => { const n = Number(s.replace(/\s/g, "").replace(",", ".")); return Number.isFinite(n) ? n : 0; };

function NumField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <label className="block min-w-0">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <div className="flex items-center gap-1">
        <Input inputMode="decimal" value={value === 0 ? "" : String(value)} placeholder="0" onFocus={(e) => e.target.select()} onChange={(e) => onChange(num(e.target.value))} className="h-9" />
        {suffix && <span className="text-xs text-muted-foreground shrink-0">{suffix}</span>}
      </div>
    </label>
  );
}

interface Props { value: BusinessValueInput; onChange: (v: BusinessValueInput) => void; productName?: string; productKey?: string; industry?: string }

export default function BusinessValueAssessment({ value: v, onChange, productName = "Dynamics\u00A0365", productKey, industry }: Props) {
  const r = useMemo(() => evaluateBusinessValue(v), [v]);
  const onOwnPage = useLocation().pathname.startsWith("/verksamhetsvardering");
  const set = <K extends keyof BusinessValueInput>(k: K, val: BusinessValueInput[K]) => onChange({ ...v, [k]: val });
  const patch = <K extends "work" | "leakage" | "challenges" | "itFees">(k: K, id: string, p: Partial<BusinessValueInput[K][number]>) =>
    set(k, (v[k] as BusinessValueInput[K][number][]).map((row) => (row.id === id ? { ...row, ...p } : row)) as BusinessValueInput[K]);

  return (
    <section aria-labelledby="verksamhetsnytta" className="mt-12 max-w-6xl mx-auto">
      <h2 id="verksamhetsnytta" className="text-2xl font-bold text-foreground mb-2">Vad kostar nuvarande arbetssätt?</h2>
      <p className="text-muted-foreground mb-4 max-w-3xl">
        Räkna nyttan utifrån era egna problem: tid i manuella moment, förlorade affärer, verksamhetsutmaningar och kostnader för system som ersätts. Moderna funktioner som AI-tolkning av fakturor och automatiska avstämningar ingår som egna rader. Summan läggs till nyttan i kalkylen för {productName}.
      </p>
      {!onOwnPage && <p className="text-sm mb-4"><Link to="/verksamhetsvardering/" className="underline underline-offset-4 text-primary">Vill du se kassaflöde, internränta och spara som PDF? Öppna Affärsnytta & ROI</Link></p>}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="w-40"><NumField label="Intern kostnad per timme" value={v.hourlyCost} onChange={(n) => set("hourlyCost", n)} suffix="kr" /></div>
        <div className="w-40"><NumField label="Täckningsgrad på förlorad försäljning" value={v.marginPct} onChange={(n) => set("marginPct", n)} suffix="%" /></div>
        <Button variant="outline" size="sm" onClick={() => onChange(exampleFor(productKey, industry))}>Fyll i exempelbolag</Button>
        <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_BUSINESS_VALUE)}>Töm</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground">1. Manuellt arbete <span className="text-muted-foreground font-normal">· {fmt(r.work)}/år, {Math.round(r.hoursFreed)} timmar</span></h3>
          {v.work.map((row) => (
            <div key={row.id} className="border-t border-border pt-3">
              <div className="flex justify-between gap-2 text-sm mb-2"><Label className="min-w-0">{row.label}</Label><span className="text-muted-foreground shrink-0">{fmt(workRowValue(row, v.hourlyCost))}</span></div>
              <div className="grid grid-cols-3 gap-2">
                <NumField label="Minuter per gång" value={row.minutes} onChange={(n) => patch("work", row.id, { minutes: n })} />
                <NumField label="Gånger per månad" value={row.perMonth} onChange={(n) => patch("work", row.id, { perMonth: n })} />
                <NumField label="Besparing" value={row.savingPct} onChange={(n) => patch("work", row.id, { savingPct: n })} suffix="%" />
              </div>
            </div>
          ))}
        </CardContent></Card>

        <div className="space-y-4 min-w-0">
          <Card><CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground">2. Förlorade affärer <span className="text-muted-foreground font-normal">· {fmt(r.leakage)}/år</span></h3>
            <p className="text-xs text-muted-foreground">Räknas på täckningsbidraget, inte hela ordervärdet.</p>
            {v.leakage.map((row) => (
              <div key={row.id} className="border-t border-border pt-3">
                <div className="flex justify-between gap-2 text-sm mb-2"><Label>{row.label}</Label><span className="text-muted-foreground shrink-0">{fmt(leakRowValue(row, v.marginPct))}</span></div>
                <div className="grid grid-cols-3 gap-2">
                  <NumField label="Värde per gång" value={row.value} onChange={(n) => patch("leakage", row.id, { value: n })} />
                  <NumField label="Gånger per år" value={row.perYear} onChange={(n) => patch("leakage", row.id, { perYear: n })} />
                  <NumField label="Minskning" value={row.savingPct} onChange={(n) => patch("leakage", row.id, { savingPct: n })} suffix="%" />
                </div>
              </div>
            ))}
          </CardContent></Card>

          {(["challenges", "itFees"] as const).map((k) => (
            <Card key={k}><CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground">{k === "challenges" ? "3. Verksamhetsutmaningar" : "4. Kostnader som ersätts"} <span className="text-muted-foreground font-normal">· {fmt(k === "challenges" ? r.challenges : r.itFees)}/år</span></h3>
              {v[k].map((row) => (
                <div key={row.id} className="border-t border-border pt-3">
                  <div className="flex justify-between gap-2 text-sm mb-2"><Label>{row.label}</Label><span className="text-muted-foreground shrink-0">{fmt(k === "challenges" ? challengeRowValue(row) : costRowValue(row))}</span></div>
                  <div className="grid grid-cols-2 gap-2">
                    <NumField label="Kostnad per år" value={row.yearly} onChange={(n) => patch(k, row.id, { yearly: n })} suffix="kr" />
                    <NumField label="Andel som försvinner" value={row.savingPct} onChange={(n) => patch(k, row.id, { savingPct: n })} suffix="%" />
                  </div>
                </div>
              ))}
            </CardContent></Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground">5. Rörelsekapital <span className="text-muted-foreground font-normal">· {fmt(r.workingCapital)}/år</span></h3>
          <p className="text-xs text-muted-foreground">Kapital som frigörs värderas med kapitalkostnaden, inte hela beloppet. Högst 30 % minskning.</p>
          <div className="w-40"><NumField label="Kapitalkostnad" value={v.capitalRatePct ?? 8} onChange={(n) => set("capitalRatePct", n)} suffix="%" /></div>
          {(v.workingCapital ?? []).map((row) => (
            <div key={row.id} className="border-t border-border pt-3">
              <div className="flex justify-between gap-2 text-sm mb-2"><Label>{row.label}</Label><span className="text-muted-foreground shrink-0">{fmt(capitalRowValue(row, v.capitalRatePct))}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <NumField label="Bundet kapital" value={row.yearly} onChange={(n) => set("workingCapital", (v.workingCapital ?? []).map((x) => (x.id === row.id ? { ...x, yearly: n } : x)))} suffix="kr" />
                <NumField label="Minskning" value={row.savingPct} onChange={(n) => set("workingCapital", (v.workingCapital ?? []).map((x) => (x.id === row.id ? { ...x, savingPct: n } : x)))} suffix="%" />
              </div>
            </div>
          ))}
        </CardContent></Card>
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground">6. AI, Copilot och agenter <span className="text-muted-foreground font-normal">· {fmt(r.ai)}/år</span></h3>
          <p className="text-xs text-muted-foreground">Nästa nivå efter systembytet och processförbättringen. Räknas bara på den manuella tid som återstår i del 1, högst {MAX_AI_PCT} %.</p>
          <div className="w-48"><NumField label="Andel av återstående tid som AI tar" value={v.aiPct ?? 0} onChange={(n) => set("aiPct", n)} suffix="%" /></div>
        </CardContent></Card>
      </div>
      <p className="mt-4 text-lg font-semibold text-foreground">Möjlig verksamhetsnytta: {fmt(r.total)} per år</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-3xl">Försiktigt räknat: högst 80 % sparad tid per moment, högst 75 % räddade affärer och högst 30 % av en verksamhetsutmaning. Allt utom ersatta kostnader räknas dessutom ned med 15 % för att allt sällan fungerar fullt ut.</p>
    </section>
  );
}
