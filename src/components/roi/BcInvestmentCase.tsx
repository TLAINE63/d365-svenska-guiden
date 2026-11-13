import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { evaluateAll, QUICKSTART_PRICE, type DeliveryPath, type Scenario, type CaseInput } from "@/lib/bcInvestmentCase";
import { BC_QUICKSTARTS } from "@/data/bcProjectEstimates";

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const PATHS: Record<DeliveryPath, { title: string; body: string }> = {
  quickstart: { title: "Paketerad snabbstart", body: `Från ${fmt(QUICKSTART_PRICE)} för behov som ryms i ett standardpaket.` },
  phased: { title: "Etappvis införande", body: "Snabbstart år 1, resterande omfattning år 2. Nyttan växer stegvis." },
  custom: { title: "Anpassad implementation", body: "Hela omfattningen enligt kalkylen ovan. Halv nytta första året." },
};

type Props = Omit<CaseInput, "scenario" | "years">;

export default function BcInvestmentCase(props: Props) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [years, setYears] = useState<3 | 5>(5);
  const results = useMemo(() => evaluateAll({ ...props, scenario, years }), [props, scenario, years]);

  return (
    <section aria-labelledby="investering" className="mt-12 max-w-6xl mx-auto">
      <h2 id="investering" className="text-2xl font-bold text-foreground mb-2">Är investeringen lönsam jämfört med i dag?</h2>
      <p className="text-muted-foreground mb-5 max-w-3xl">
        Tre sätt att införa Business&nbsp;Central, jämförda med att behålla nuvarande lösning ({fmt(props.currentYearly)} per år). Merkostnaden är engångsinvestering plus skillnaden i årlig kostnad.
      </p>
      {props.annualBenefit === 0 && (
        <p className="mb-5 text-sm text-foreground bg-secondary/60 rounded-md p-3 max-w-3xl">
          Fyll i vad nuvarande arbetssätt kostar ovan för att se ett rättvisande resultat. Utan dem räknas bara kostnaden.
        </p>
      )}
      <div className="flex flex-wrap gap-4 mb-6">
        <ToggleGroup type="single" value={scenario} onValueChange={(x) => x && setScenario(x as Scenario)} aria-label="Scenario">
          <ToggleGroupItem value="cautious">Försiktigt (−25 %)</ToggleGroupItem>
          <ToggleGroupItem value="normal">Normalt</ToggleGroupItem>
          <ToggleGroupItem value="optimistic">Optimistiskt (+25 %)</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={String(years)} onValueChange={(x) => x && setYears(Number(x) as 3 | 5)} aria-label="Period">
          <ToggleGroupItem value="3">3 år</ToggleGroupItem>
          <ToggleGroupItem value="5">5 år</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {results.map((r) => (
          <Card key={r.path}>
            <CardContent className="p-5 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{PATHS[r.path].title}</h3>
                <p className="text-sm text-muted-foreground">{PATHS[r.path].body}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Nettoresultat mot i dag, {years} år</div>
                <div className={`text-2xl font-bold ${r.net >= 0 ? "text-accent" : "text-destructive"}`}>{r.net >= 0 ? "+" : ""}{fmt(r.net)}</div>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">ROI på merkostnad</dt><dd className="text-right font-medium">{r.roiPct == null ? "–" : `${Math.round(r.roiPct)} %`}</dd>
                <dt className="text-muted-foreground">Återbetalning</dt><dd className="text-right font-medium">{r.paybackMonths == null ? `Ej inom ${years} år` : `${Math.round(r.paybackMonths)} mån`}</dd>
                <dt className="text-muted-foreground">Merkostnad</dt><dd className="text-right font-medium">{fmt(r.extraCost)}</dd>
                <dt className="text-muted-foreground">Verksamhetsnytta</dt><dd className="text-right font-medium">{fmt(r.benefit)}</dd>
                <dt className="text-muted-foreground">Engångsinvestering</dt><dd className="text-right font-medium">{fmt(r.oneOff)}</dd>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground max-w-4xl">
        Publicerade snabbstartspaket: {BC_QUICKSTARTS.map((q) => `${q.partner} ${q.name} (${q.price}, ${q.duration})`).join(" och ")}. Snabbstart passar bara om behoven ryms i paketet. AI-stöd är en arbetsmetod inom alla tre vägarna, inte en egen prisnivå. Ingen diskontering; ROI = (nytta − merkostnad) / merkostnad. Frigjord arbetstid är inte automatiskt en kontant besparing.
      </p>
    </section>
  );
}
