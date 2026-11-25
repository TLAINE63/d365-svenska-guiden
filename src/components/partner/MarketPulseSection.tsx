import { useEffect, useState } from "react";
import { MARKET_PULSE } from "@/data/marketPulse";
import { mapMarketPulse } from "@/lib/marketPulse";
import { supabase } from "@/integrations/supabase/client";
import MarketInterestCharts from "@/components/partner/MarketInterestCharts";

const fmt = (n: number) => n.toLocaleString("sv-SE");

export default function MarketPulseSection() {
  const [m, setM] = useState(MARKET_PULSE);
  useEffect(() => {
    let alive = true;
    (supabase.rpc as any)("public_market_pulse").then(({ data }: any) => {
      const live = mapMarketPulse(data);
      if (alive && live) setM(live);
    });
    return () => { alive = false; };
  }, []);
  const stats = [
    { value: fmt(m.companies), label: "identifierade företag i aktiv research" },
    { value: fmt(m.searchImpressions), label: "visningar i Google-sök" },
    { value: fmt(m.pageViews), label: "sidvisningar på guider, jämförelser och verktyg" },
    { value: fmt(m.profileViews), label: "visningar av partnerprofiler" },
  ];
  return (
    <section id="marknadspuls" className="py-10 md:py-14 scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">Marknadspuls senaste 90 dagarna</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Så rör sig köparna på d365.se</h2>
        <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-8">
          Köpare gör sin research innan de kontaktar en säljare. Siffrorna visar aktiviteten bland företag som undersöker och jämför Dynamics&nbsp;365-lösningar.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Företagens storlek</h3>
            <ul className="space-y-1 text-sm">
              {m.sizes.map((s) => (
                <li key={s.label} className="flex justify-between"><span>{s.label}</span><span className="font-semibold">{s.count} företag</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Mest aktiva branscher</h3>
            <p className="text-sm">{m.industries.join(", ")}</p>
          </div>
        </div>
        <div className="mb-6"><MarketInterestCharts /></div>
        <p className="max-w-3xl lg:max-w-none font-medium">
          Era grunduppgifter kan redan visas när köpare filtrerar. Med en verifierad profil ser köparen även referenser, expertområden och kontaktvägar.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Period {m.periodStart} till {m.periodEnd}. Källor: d365.se besöksstatistik (andelar av sidvisningar per område, verktyg räknas i sidvisningar), Snitcher (företag identifierade på organisationsnivå) och Google Search Console. Vi säljer inga besöksuppgifter och visar aldrig enskilda företag.
        </p>
      </div>
    </section>
  );
}
