import { useState } from "react";
import { LeadCTA } from "@/components/LeadCTA";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCT_OPTIONS = [
  "Business Central",
  "Finance & Supply Chain",
  "Sales",
  "Customer Service",
  "Contact Center",
  "Field Service",
  "Commerce",
  "Project Operations",
  "Human Resources",
  "Customer Insights – Journeys",
  "Copilot & agenter",
  "Vet inte ännu",
];

/**
 * Kontaktformulär på kostnadssidan där besökaren först anger vilken
 * Dynamics 365-produkt frågan gäller. Produktvalet följer med leadet.
 */
export default function CostContactForm() {
  const [product, setProduct] = useState<string>("");

  return (
    <section className="py-10 sm:py-14 bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Få en kostnadsbild för din situation
          </h2>
          <p className="text-muted-foreground">
            Berätta vilken produkt du tittar på så återkommer vi med realistiska
            kostnadsintervall och förslag på partners som matchar ditt behov.
          </p>
        </div>

        <div className="mb-4">
          <Label htmlFor="cost-product">Vilken produkt är du intresserad av?</Label>
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger id="cost-product" className="mt-1.5">
              <SelectValue placeholder="Välj produkt" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_OPTIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LeadCTA
          sourcePage="/kostnad/"
          selectedProduct={product || undefined}
          title="Kontakta oss om kostnader"
          description="Fyll i dina uppgifter så hör vi av oss med en köparsidig genomgång av kostnadsbilden."
        />
      </div>
    </section>
  );
}
