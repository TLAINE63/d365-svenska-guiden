import { Link } from "react-router-dom";
import { usePriceMap } from "@/hooks/usePriceMap";
import SourceNote from "@/components/SourceNote";

interface Scenario {
  title: string;
  who: string;
  licenseKey: string;
  licenseLabel: string;
  users: number;
  implLow: number;
  implHigh: number;
  roiPath: string;
}

/** Implementationsintervall hämtade från "Liten"-nivån i costBreakdown.ts. */
const SCENARIOS: Scenario[] = [
  {
    title: "Affärssystem, mindre bolag",
    who: "Business Central, ekonomi, order och inköp",
    licenseKey: "bc-essentials",
    licenseLabel: "Business Central Essentials",
    users: 15,
    implLow: 100000,
    implHigh: 250000,
    roiPath: "/businesscentral/roi-kalkylator/",
  },
  {
    title: "Säljstöd (CRM), säljteam",
    who: "Sales, pipeline och kundregister",
    licenseKey: "sales-professional",
    licenseLabel: "Sales Professional",
    users: 20,
    implLow: 100000,
    implHigh: 300000,
    roiPath: "/d365sales/roi-kalkylator/",
  },
  {
    title: "Affärssystem, större bolag",
    who: "Finance & Supply Chain, ett bolag",
    licenseKey: "finance",
    licenseLabel: "Finance",
    users: 75,
    implLow: 1500000,
    implHigh: 3500000,
    roiPath: "/finance-supply-chain/roi-kalkylator/",
  },
];

const SUPPORT_LOW = 0.15;
const SUPPORT_HIGH = 0.25;

const nf = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const kr = (n: number) => `${nf.format(Math.round(n / 1000) * 1000)} kr`;

/**
 * Räkneexempel för 3-års totalkostnad (licens + införande + förvaltning).
 * Licens från prisregistret, införande från befintliga intervall, förvaltning
 * 15–25 % av införandet per år efter go-live (år 2 och 3).
 */
export default function TcoScenarios() {
  const map = usePriceMap();

  return (
    <section id="tco-3-ar" className="py-8 sm:py-12 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Totalkostnad över tid</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
          Vad kostar det över tre år?
        </h2>
        <p className="text-base text-muted-foreground mb-6 max-w-3xl">
          Licensen är sällan den största posten. Tre räkneexempel visar hur licens, införande
          och förvaltning fördelar sig över tre år. Er egen intern tid (projektledning, test,
          utbildning) kommer utöver detta och bör budgeteras separat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {SCENARIOS.map((s) => {
            const p = map.get(s.licenseKey);
            const monthly = p && !p.is_quote && p.price_sek != null ? p.price_sek : null;
            const lic3 = monthly != null ? monthly * s.users * 36 : null;
            const supLow = s.implLow * SUPPORT_LOW * 2;
            const supHigh = s.implHigh * SUPPORT_HIGH * 2;
            const totLow = (lic3 ?? 0) + s.implLow + supLow;
            const totHigh = (lic3 ?? 0) + s.implHigh + supHigh;
            return (
              <article key={s.title} className="rounded border border-border bg-card p-5 flex flex-col">
                <h3 className="text-lg font-semibold text-card-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {s.who}, {s.users} användare
                </p>
                <dl className="text-sm space-y-2 mb-4">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Licens, 36 mån</dt>
                    <dd className="font-medium text-right whitespace-nowrap">{lic3 != null ? kr(lic3) : "Offert"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Införande</dt>
                    <dd className="font-medium text-right whitespace-nowrap">{kr(s.implLow)} – {kr(s.implHigh)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Förvaltning år 2–3</dt>
                    <dd className="font-medium text-right whitespace-nowrap">{kr(supLow)} – {kr(supHigh)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-border pt-2">
                    <dt className="font-semibold text-card-foreground">3-års TCO</dt>
                    <dd className="font-bold text-right whitespace-nowrap">{kr(totLow)} – {kr(totHigh)}</dd>
                  </div>
                </dl>
                <p className="text-xs text-muted-foreground mb-4">Licens: {s.licenseLabel}, listpris.</p>
                <Link to={s.roiPath} className="mt-auto text-sm font-medium underline hover:text-foreground">
                  Räkna med era egna siffror →
                </Link>
              </article>
            );
          })}
        </div>

        <SourceNote
          className="mt-6"
          source="Microsofts listpriser (prisregistret på d365.se) och d365.se:s intervall för införanden från svenska partners"
          updated="2026-06-11"
          method="Licens = listpris × användare × 36 månader. Införande = intervallet för minsta projektstorleken per lösning. Förvaltning = 15–25 % av införandet per år under år 2 och 3. Exkl. moms och intern tid."
        />

        <div className="mt-6 rounded border border-border bg-secondary/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">Vad kostar alternativen?</h3>
            <p className="text-sm text-muted-foreground">
              Jämför Dynamics 365 med andra affärssystem och CRM-lösningar innan ni bestämmer er.
            </p>
          </div>
          <Link
            to="/jamfor/"
            className="inline-flex items-center px-4 py-2 rounded border border-border bg-card hover:bg-secondary/60 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Jämför alternativ →
          </Link>
        </div>
      </div>
    </section>
  );
}
