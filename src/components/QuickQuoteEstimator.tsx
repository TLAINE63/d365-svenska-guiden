import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePriceMap } from "@/hooks/usePriceMap";
import {
  SOLUTIONS,
  COMPLEXITY_OPTIONS,
  estimateImplementation,
  type SolutionKey,
  type Complexity,
} from "@/lib/implementationEstimate";
import type { ProductKey } from "@/hooks/usePartnerFilters";
import { allIndustries } from "@/data/partners";
import SendUnderlagToPartners from "@/components/SendUnderlagToPartners";
import SourceNote from "@/components/SourceNote";

/** Kalkylatorns lösningar → partnerfiltrets produktnycklar. */
const PARTNER_PRODUCT: Record<SolutionKey, ProductKey> = {
  bc: "bc",
  fscm: "fsc",
  sales: "sales",
  "customer-service": "service",
  "field-service": "service",
  "project-operations": "fsc",
};

const USER_BUCKETS = [
  { value: "10", label: "1–25 användare", size: "1–25" },
  { value: "35", label: "26–50 användare", size: "26–50" },
  { value: "75", label: "51–100 användare", size: "51–100" },
  { value: "175", label: "101–250 användare", size: "101–250" },
  { value: "375", label: "251–500 användare", size: "251–500" },
  { value: "600", label: "Fler än 500 användare", size: "500+" },
];

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

/**
 * Snabb offertfråga på kostnadsguiden: några få val ger direkt ett kostnadsspann
 * för licens och implementation. Använder samma beräkningsmodell som den fulla
 * kalkylatorn på /implementationskalkylator/ så att siffrorna alltid stämmer överens.
 */
export default function QuickQuoteEstimator() {
  const priceMap = usePriceMap();

  const [solution, setSolution] = useState<SolutionKey>("bc");
  const [userBucket, setUserBucket] = useState("35");
  const [complexity, setComplexity] = useState<Complexity>("anpassad");
  const [integrations, setIntegrations] = useState(3);
  const [industry, setIndustry] = useState<string>("");
  const [showEstimate, setShowEstimate] = useState(false);

  const priceLookup = useMemo(
    () => (key: string) => {
      const p = priceMap.get(key);
      if (!p || p.is_quote || p.price_sek == null) return null;
      return Number(p.price_sek);
    },
    [priceMap],
  );

  const bucket = USER_BUCKETS.find((b) => b.value === userBucket) ?? USER_BUCKETS[1];

  const result = useMemo(
    () =>
      estimateImplementation(
        {
          solutions: [solution],
          users: Number(bucket.value),
          premiumLicense: false,
          complexity,
          integrations,
          legalEntities: 1,
          dataMigration: true,
          customDevelopment: complexity === "komplex",
          training: true,
          hourlyRate: 1350,
        },
        priceLookup,
      ),
    [solution, bucket.value, complexity, integrations, priceLookup],
  );

  const solutionLabel = SOLUTIONS.find((s) => s.key === solution)?.label ?? "";
  const complexityLabel =
    COMPLEXITY_OPTIONS.find((c) => c.key === complexity)?.label ?? complexity;

  const underlagSummary = [
    `Snabb offertfråga från kostnadsguiden på d365.se.`,
    `Applikation: ${solutionLabel}.`,
    `Omfattning: ${bucket.label}, ${complexityLabel.toLowerCase()}, ${integrations} integration(er).`,
    industry ? `Bransch: ${industry}.` : null,
    `Uppskattad implementation: ${fmtSek(result.costLow)}–${fmtSek(result.costHigh)} (ca ${Math.round(result.hours)} timmar, ca ${result.months} månader).`,
    result.licenseYearly
      ? `Uppskattad licenskostnad: ${fmtSek(result.licenseYearly)} per år.`
      : `Licenskostnad: offert.`,
    `Beräknat med d365.se:s öppna modell – ska bekräftas mot partnerns egen offert.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="py-8 sm:py-12 bg-background border-b border-border" id="snabb-offertfraga">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          Snabb offertfråga
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
          Få ett kostnadsspann på en minut
        </h2>
        <p className="text-base text-muted-foreground mb-6 max-w-3xl">
          Svara på fyra frågor så räknar vi fram ett spann för både licens och
          implementation direkt på skärmen. Vill du gå vidare kan du skicka underlaget
          till 2–5 matchande partners – du får deras svar via oss och slipper bli uppringd
          av en säljkår.
        </p>

        <div className="rounded border border-border bg-card p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label htmlFor="qq-solution">Vilken applikation gäller det?</Label>
              <Select value={solution} onValueChange={(v) => setSolution(v as SolutionKey)}>
                <SelectTrigger id="qq-solution" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOLUTIONS.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="qq-users">Hur många ska använda systemet?</Label>
              <Select value={userBucket} onValueChange={setUserBucket}>
                <SelectTrigger id="qq-users" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_BUCKETS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="qq-complexity">Hur nära standard kan du arbeta?</Label>
              <Select value={complexity} onValueChange={(v) => setComplexity(v as Complexity)}>
                <SelectTrigger id="qq-complexity" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {COMPLEXITY_OPTIONS.find((c) => c.key === complexity)?.note}
              </p>
            </div>

            <div>
              <Label htmlFor="qq-integrations">Antal integrationer till andra system</Label>
              <Input
                id="qq-integrations"
                type="number"
                min={0}
                max={20}
                className="mt-1.5"
                value={integrations}
                onChange={(e) =>
                  setIntegrations(Math.max(0, Math.min(20, Number(e.target.value) || 0)))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Räkna med e-handel, lön, bank, PIM, EDI och liknande.
              </p>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="qq-industry">Bransch (valfritt – ger bättre partnerförslag)</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="qq-industry" className="mt-1.5">
                  <SelectValue placeholder="Välj bransch" />
                </SelectTrigger>
                <SelectContent>
                  {allIndustries.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!showEstimate && (
            <Button className="mt-5" onClick={() => setShowEstimate(true)}>
              <Calculator className="w-4 h-4 mr-2" aria-hidden="true" />
              Visa kostnadsspann
            </Button>
          )}

          {showEstimate && (
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Uppskattning för {solutionLabel}, {bucket.label.toLowerCase()}
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded border border-border p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Licens per år
                  </dt>
                  <dd className="text-xl font-bold text-card-foreground">
                    {result.licenseYearly ? fmtSek(result.licenseYearly) : "Offert"}
                  </dd>
                  <p className="text-xs text-muted-foreground mt-1">
                    Standardnivå, listpris. Team Members och tillägg tillkommer.
                  </p>
                </div>
                <div className="rounded border border-border p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Implementation (engång)
                  </dt>
                  <dd className="text-xl font-bold text-card-foreground">
                    {fmtSek(result.costLow)}–{fmtSek(result.costHigh)}
                  </dd>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cirka {Math.round(result.hours)} konsulttimmar à 1 350 kr.
                  </p>
                </div>
                <div className="rounded border border-border p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Projekttid
                  </dt>
                  <dd className="text-xl font-bold text-card-foreground">
                    ca {result.months} månader
                  </dd>
                  <p className="text-xs text-muted-foreground mt-1">
                    Förvaltning efter go-live: ca {fmtSek(result.supportYearly)} per år.
                  </p>
                </div>
              </dl>

              <SourceNote
                className="mt-4"
                source="d365.se:s öppna beräkningsmodell för implementationsomfattning, med licenspriser från Microsofts prislista"
                updated="2026-06-11"
                method="Spannet är ±25 % kring en medelnivå och förutsätter svenskt konsultpris om 1 350 kr/timme. Din partners offert kan avvika – använd spannet som sanity-check, inte som pris."
              />

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  to="/implementationskalkylator/"
                  className="inline-flex items-center px-4 py-2 rounded border border-border bg-card hover:bg-secondary/60 transition-colors"
                >
                  Gå djupare i kalkylatorn <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {showEstimate && (
          <div className="mt-6">
            <SendUnderlagToPartners
              sourcePage="/kostnad/"
              assessmentType="kostnadsguide_snabboffert"
              products={[PARTNER_PRODUCT[solution]]}
              industry={industry || null}
              companySize={bucket.size}
              underlagSummary={underlagSummary}
              resultUrl="https://d365.se/kostnad/"
              heading="Skicka din offertfråga till 2–5 matchande partners"
              description="Vi har valt ut de partners som passar din applikation, bransch och storlek. Underlaget med dina val och kostnadsspannet skickas till dem du markerar – du får svaren via oss."
            />
          </div>
        )}
      </div>
    </section>
  );
}
