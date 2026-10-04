import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { fitModels, type FitModelKey } from "@/data/fitModels";
import { nowrapBrand } from "@/lib/nowrapBrand";

export default function FitModel({ model, heading }: { model: FitModelKey; heading?: string }) {
  const value = fitModels[model];
  return (
    <section id={`d365-${model}-fit-model`} data-fit-model={model} aria-labelledby={`${model}-fit-title`} className="scroll-mt-24 border-y border-border py-6 sm:py-8">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <h2 id={`${model}-fit-title`} className="text-xl font-semibold text-foreground">{nowrapBrand(heading ?? value.name)}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{value.name} · Redaktionellt beslutsstöd</p>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">{nowrapBrand(value.method)}</p>
        <details className="group mt-4">
          <summary className="flex w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-sm py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span>Visa bedömningsunderlaget</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open:rotate-180" />
          </summary>
        <p className="mt-3 text-sm leading-relaxed text-foreground">Inga godtyckliga poäng används. Saknat underlag betyder att frågan behöver utredas, inte att ett system eller en partner är lämplig eller olämplig. Kritiska krav måste beläggas innan beslut.</p>
        <div className="mt-5 max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-xs sm:text-sm">
            <caption className="sr-only">{value.name}: dimensioner, underlag och beslutstolkning</caption>
            <thead><tr className="border-b border-border bg-muted"><th scope="col" className="w-1/4 p-2 sm:p-3">Bedömningsdimension</th><th scope="col" className="w-1/3 p-2 sm:p-3">Underlag att kontrollera</th><th scope="col" className="p-2 sm:p-3">Så påverkar det beslutet</th></tr></thead>
            <tbody>{value.dimensions.map(row => <tr key={row.dimension} className="border-b border-border align-top"><th scope="row" className="break-words p-2 font-semibold sm:p-3">{nowrapBrand(row.dimension)}</th><td className="break-words p-2 text-muted-foreground sm:p-3">{nowrapBrand(row.evidence)}</td><td className="break-words p-2 text-muted-foreground sm:p-3">{nowrapBrand(row.interpretation)}</td></tr>)}</tbody>
          </table>
        </div>
        <nav aria-label="Relaterade beslutsmodeller" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary">
          {model !== "partner" && <Link className="underline underline-offset-4" to="/alla-d365-partners/#d365-partner-fit-model">Partner Fit Model</Link>}
          {model !== "erp" && <Link className="underline underline-offset-4" to="/erp/#d365-erp-fit-model">ERP Fit Model</Link>}
          {model !== "crm" && <Link className="underline underline-offset-4" to="/crm/#d365-crm-fit-model">CRM Fit Model</Link>}
        </nav>
        </details>
      </div>
    </section>
  );
}
