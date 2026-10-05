import { Helmet } from "react-helmet-async";
import market from "@/data/crmMarket.json";
import { nowrapBrand } from "@/lib/nowrapBrand";

type Row = { value: string; partners: number };

function List({ title, rows }: { title: string; rows: Row[] }) {
  if (!rows.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.value} className="border-t border-border first:border-0">
              <td className="py-1.5 text-foreground/85">{r.value}</td>
              <td className="py-1.5 text-right tabular-nums text-foreground">{r.partners}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Egen marknadsdata, framräknad vid bygget ur publicerade partnerprofiler. */
export default function CrmMarketSection() {
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Svenska Dynamics 365 CRM-marknaden",
    description: market.scope,
    dateModified: market.generatedAt,
    creator: { "@type": "Organization", name: "D365.SE", url: "https://d365.se" },
    url: "https://d365.se/dynamics-365-crm-partners-sverige/#crm-marknaden",
    distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://d365.se/data/crm-marknaden.json" },
    isAccessibleForFree: true,
    inLanguage: "sv",
  };
  return (
    <section id="crm-marknaden" className="container mx-auto max-w-5xl scroll-mt-24 px-4 py-10 sm:px-6">
      <Helmet><script type="application/ld+json">{JSON.stringify(dataset)}</script></Helmet>
      <h2 className="mb-2 text-2xl font-bold text-foreground">{nowrapBrand("Svenska Dynamics 365 CRM-marknaden")}</h2>
      <p className="mb-5 max-w-3xl text-sm text-foreground/80">
        {market.totalPartners} publicerade partners har Sales eller Customer Service i sin profil. Siffrorna anger antal partners per uppgift och bygger på partnernas egna profiluppgifter. {market.scope.split(". ")[1]} Uppdaterad {market.generatedAt}.{" "}
        <a href="/data/crm-marknaden.json" className="text-primary hover:underline">Ladda ner som JSON</a>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <List title="Partners per app" rows={market.perApp.map((a) => ({ value: a.app, partners: a.partners }))} />
        <List title="Vanligaste branscher" rows={market.topIndustries} />
        <List title="Kundstorlek (antal anställda)" rows={market.companySize} />
        <List title="Geografisk täckning" rows={market.geography} />
        <List title="Implementation och förvaltning" rows={market.support} />
      </div>
    </section>
  );
}
