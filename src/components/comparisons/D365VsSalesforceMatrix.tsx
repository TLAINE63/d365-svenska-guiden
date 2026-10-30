import { usePriceMap } from "@/hooks/usePriceMap";
import { formatPrice, getPrice } from "@/lib/productPriceFormat";
import { nowrapBrand } from "@/lib/nowrapBrand";

/**
 * Snabböversikt Dynamics 365 vs Salesforce. Licenspriset för Sales Professional
 * hämtas från sajtens priskatalog (samma källa som /priser/), aldrig hårdkodat.
 * Salesforce-priser anges inte här eftersom de inte finns i katalogen.
 */
const D365VsSalesforceMatrix = () => {
  const prices = usePriceMap();
  const salesPro = getPrice("sales-professional", prices);
  const salesProPrice = salesPro ? formatPrice(salesPro, "short") : null;

  const rows: { area: string; d365: string; sf: string; note: string }[] = [
    {
      area: "Microsoft-ekosystemet",
      d365: "Inbyggd koppling till Teams, Outlook, Excel och Power BI.",
      sf: "Kopplas till Microsoft 365 via integrationer och tillägg.",
      note: "Fördel Dynamics 365 när ni redan arbetar i Microsoft 365.",
    },
    {
      area: "AI och produktivitet",
      d365: "Microsoft Copilot i Dynamics 365-apparna och i Microsoft 365.",
      sf: "Salesforce Einstein och Agentforce.",
      note: "Jämför hur AI licensieras och vilken data den får använda.",
    },
    {
      area: "Licensmodell",
      d365: salesProPrice
        ? `Per användare och månad, Sales Professional från cirka ${salesProPrice} (listpris).`
        : "Per användare och månad, i flera nivåer.",
      sf: "Per användare och månad, Sales Cloud i flera nivåer.",
      note: "Se Salesforces aktuella prislista och räkna på samma antal användare.",
    },
    {
      area: "Branschflexibilitet",
      d365: "Branschlösningar från Microsoft och partners, bland annat via AppSource.",
      sf: "Branschlösningar inom Salesforce Industries och via AppExchange.",
      note: "Båda plattformarna erbjuder djupa branschlösningar.",
    },
  ];

  return (
    <section aria-labelledby="snabboversikt-d365-salesforce">
      <h2 id="snabboversikt-d365-salesforce" className="text-2xl font-bold text-foreground mb-3">
        Snabböversikt: Dynamics&nbsp;365 och Salesforce
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">Jämförelse av Microsoft Dynamics&nbsp;365 och Salesforce per område</caption>
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th scope="col" className="p-3 font-semibold text-foreground">Område</th>
              <th scope="col" className="p-3 font-semibold text-foreground">Dynamics&nbsp;365</th>
              <th scope="col" className="p-3 font-semibold text-foreground">Salesforce</th>
              <th scope="col" className="p-3 font-semibold text-foreground">Att tänka på</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.area} className="border-t border-border bg-card align-top">
                <th scope="row" className="p-3 text-left font-semibold text-foreground">{r.area}</th>
                <td className="p-3 text-muted-foreground">{nowrapBrand(r.d365)}</td>
                <td className="p-3 text-muted-foreground">{r.sf}</td>
                <td className="p-3 text-muted-foreground">{nowrapBrand(r.note)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Priset är Microsofts listpris exklusive moms enligt <a href="/priser/" className="underline underline-offset-2">prissidan</a>. Kontrollera aktuella villkor hos respektive leverantör.
      </p>
    </section>
  );
};

export default D365VsSalesforceMatrix;
