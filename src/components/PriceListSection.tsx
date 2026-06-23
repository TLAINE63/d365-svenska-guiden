import { useProductPrices, formatPrice } from "@/hooks/useProductPrices";

interface PriceListSectionProps {
  /** Filtrera prislistan efter produktområde (deep-dive product name). Tom = visa alla. */
  product?: string | null;
}

const PRODUCT_MATCHERS: Record<string, (name: string) => boolean> = {
  "Business Central": (n) => n.startsWith("Business Central"),
  "Finance & Supply Chain": (n) =>
    /^(Finance|Supply Chain|Commerce|Project Operations|Human Resources|Intelligent Order)/.test(n),
  "Finance & SCM": (n) =>
    /^(Finance|Supply Chain|Commerce|Project Operations|Human Resources|Intelligent Order)/.test(n),
  "Sales": (n) => /^(Sales|Microsoft Relationship Sales)/.test(n),
  "Customer Service": (n) => n.startsWith("Customer Service"),
  "Contact Center": (n) => n.startsWith("Contact Center"),
  "Field Service": (n) => n.startsWith("Field Service"),
  "Customer Insights": (n) => n.startsWith("Customer Insights"),
};

const CATEGORY_LABEL: Record<string, string> = {
  ERP: "ERP – Business Central, Finance & Supply Chain",
  CRM: "CRM – Sales, Service, Customer Insights m.fl.",
};

const PriceListSection = ({ product }: PriceListSectionProps) => {
  const { data: prices, isLoading } = useProductPrices();

  if (isLoading) {
    return (
      <div className="text-center py-16 text-muted-foreground animate-pulse">
        Laddar prislista...
      </div>
    );
  }

  const matcher = product ? PRODUCT_MATCHERS[product] : null;
  const filtered = matcher
    ? (prices ?? []).filter((p) => matcher(p.product_name))
    : prices ?? [];

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Ingen prisinformation tillgänglig för detta produktområde.
      </div>
    );
  }

  // Gruppera per kategori (ERP/CRM)
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <div className="rounded border border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
        <p>
          Listpriser från Microsoft, exklusive moms och i SEK per användare/månad om inte annat anges.
          Faktiska priser kan variera beroende på avtal (EA, CSP), volym och kampanjer. Vi uppdaterar
          listan löpande – kontakta en partner för aktuell offert.
        </p>
      </div>

      {Object.entries(grouped).map(([category, rows]) => (
        <section key={category}>
          <h3 className="text-lg font-bold text-foreground mb-4">
            {CATEGORY_LABEL[category] ?? category}
          </h3>
          <div className="overflow-x-auto rounded border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Produkt</th>
                  <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Pris</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Kommentar</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-4 py-3 text-foreground font-medium">{p.product_name}</td>
                    <td className="px-4 py-3 text-primary whitespace-nowrap font-semibold">
                      {formatPrice(p)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.price_note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

export default PriceListSection;
