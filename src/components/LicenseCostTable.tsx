import { Link } from "react-router-dom";
import { usePriceMap } from "@/hooks/usePriceMap";
import { formatPriceByKey } from "@/lib/productPriceFormat";
import SourceNote from "@/components/SourceNote";

interface Row {
  key: string;
  label: string;
  note: string;
}

const ERP_ROWS: Row[] = [
  { key: "bc-essentials", label: "Business Central Essentials", note: "Ekonomi, försäljning, inköp, lager, projekt" },
  { key: "bc-premium", label: "Business Central Premium", note: "Essentials plus produktion och serviceorder" },
  { key: "bc-team-members", label: "Business Central Team Members", note: "Läsa, rapportera och attestera – inte arbeta i processerna" },
  { key: "finance", label: "Finance", note: "Ekonomi för flera legala enheter och valutor" },
  { key: "supply-chain-management", label: "Supply Chain Management", note: "Lager, produktion och avancerad planering" },
  { key: "commerce", label: "Commerce", note: "Butik, e-handel och kundklubb" },
  { key: "project-operations", label: "Project Operations", note: "Projektförsäljning, resursplanering och tidrapportering" },
  { key: "human-resources", label: "Human Resources", note: "Personaldata, frånvaro och kompetens" },
];

const CRM_ROWS: Row[] = [
  { key: "sales-professional", label: "Sales Professional", note: "Standardiserad säljprocess och pipeline" },
  { key: "sales-enterprise", label: "Sales Enterprise", note: "Egna processer, prognoser och komplex försäljning" },
  { key: "customer-service-pro", label: "Customer Service Professional", note: "Ärendehantering med grundläggande kanaler" },
  { key: "customer-service-enterprise", label: "Customer Service Enterprise", note: "Flera kanaler, kunskapsbank och SLA-styrning" },
  { key: "contact-center-komplett", label: "Contact Center (komplett)", note: "Röst och digitala kanaler i samma arbetsyta" },
  { key: "field-service", label: "Field Service", note: "Arbetsorder, schemaläggning och fälttekniker" },
  { key: "customer-insights", label: "Customer Insights", note: "Marketing automation – pris per tenant, inte per användare" },
];

/**
 * Sammanfattande licensprislista (abonnemang) för kostnadsguiden.
 *
 * Alla belopp hämtas från det centrala prisregistret via `usePriceMap()`,
 * så att uppdateringar i admin slår igenom här utan kodändring.
 */
export default function LicenseCostTable() {
  const map = usePriceMap();

  const renderTable = (title: string, rows: Row[]) => (
    <div className="rounded border border-border bg-card overflow-hidden">
      <h3 className="text-base sm:text-lg font-semibold text-card-foreground px-5 py-3 border-b border-border bg-secondary/40">
        {title}
      </h3>
      <table className="w-full text-sm">
        <caption className="sr-only">{title} – listpris per användare och månad</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Licens</th>
            <th scope="col">Listpris</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border last:border-0 align-top">
              <th scope="row" className="text-left px-5 py-3 font-medium text-card-foreground">
                {r.label}
                <span className="block font-normal text-xs text-muted-foreground mt-0.5">{r.note}</span>
              </th>
              <td className="px-5 py-3 text-right whitespace-nowrap font-semibold text-card-foreground">
                {formatPriceByKey(r.key, "short", map)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="py-8 sm:py-12 bg-secondary/20 border-b border-border" id="licenskostnad">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Del 1 av 3</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
          Licenskostnad – vad abonnemanget kostar
        </h2>
        <p className="text-base text-muted-foreground mb-6 max-w-3xl">
          Licensen är den löpande kostnaden per användare och månad. Den betalas normalt
          i SEK via din partner eller en CSP, och priset kan avvika från listpriset vid
          fleråriga avtal eller större volymer. Priserna nedan är Microsofts listpriser
          omräknade till svenska kronor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {renderTable("ERP – ekonomi, lager och produktion", ERP_ROWS)}
          {renderTable("CRM – sälj, service och marknad", CRM_ROWS)}
        </div>

        <SourceNote
          className="mt-6"
          source="Microsofts officiella prislista för Dynamics 365"
          href="https://www.microsoft.com/sv-se/dynamics-365/pricing"
          updated="2026-06-11"
          method="Beloppen visas som listpris per användare och månad om inget annat anges. Faktiskt pris sätts i avtalet med din partner eller CSP."
        />

        <p className="mt-4 text-sm text-muted-foreground">
          Hela listan – inklusive tilläggslicenser, Team Members och Copilot – finns på{" "}
          <Link to="/priser/" className="underline hover:text-foreground">
            prissidan för Dynamics 365
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
