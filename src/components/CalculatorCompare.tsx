import { Fragment, useMemo, useState } from "react";
import { GitCompareArrows, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCalculatorDrafts,
  type CalculatorDraftInputs,
} from "@/hooks/useCalculatorDrafts";
import {
  SOLUTIONS,
  COMPLEXITY_OPTIONS,
  estimateImplementation,
  type EstimateResult,
} from "@/lib/implementationEstimate";

const CURRENT = "__current__";

interface Props {
  currentInputs: CalculatorDraftInputs;
  priceLookup: (key: string) => number | null;
}

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const fmtNum = (n: number) => String(n).replace(".", ",");

const solutionsLabel = (inputs: CalculatorDraftInputs) =>
  SOLUTIONS.filter((s) => inputs.solutions.includes(s.key))
    .map((s) => s.label)
    .join(", ");

const complexityLabel = (inputs: CalculatorDraftInputs) =>
  COMPLEXITY_OPTIONS.find((c) => c.key === inputs.complexity)?.label ?? inputs.complexity;

interface Row {
  label: string;
  a: string;
  b: string;
  /** Numerisk skillnad B − A, om jämförbar */
  diff?: number | null;
  unit?: "sek" | "num" | "months";
  /** Är högre värde "dyrare"/längre? Används bara för färg. */
  higherIsWorse?: boolean;
}

function buildRows(
  ia: CalculatorDraftInputs,
  ra: EstimateResult,
  ib: CalculatorDraftInputs,
  rb: EstimateResult,
): { section: string; rows: Row[] }[] {
  const num = (a: number | null, b: number | null) =>
    a == null || b == null ? null : b - a;

  return [
    {
      section: "Pris",
      rows: [
        {
          label: "Implementation (spann)",
          a: `${fmtSek(ra.costLow)} – ${fmtSek(ra.costHigh)}`,
          b: `${fmtSek(rb.costLow)} – ${fmtSek(rb.costHigh)}`,
          diff: num((ra.costLow + ra.costHigh) / 2, (rb.costLow + rb.costHigh) / 2),
          unit: "sek",
          higherIsWorse: true,
        },
        {
          label: "Licenskostnad per månad",
          a: ra.licenseMonthly == null ? "Offert" : `${fmtSek(ra.licenseMonthly)}/mån`,
          b: rb.licenseMonthly == null ? "Offert" : `${fmtSek(rb.licenseMonthly)}/mån`,
          diff: num(ra.licenseMonthly, rb.licenseMonthly),
          unit: "sek",
          higherIsWorse: true,
        },
        {
          label: "Total kostnad 3 år",
          a: ra.threeYearTotal == null ? "Offert" : fmtSek(ra.threeYearTotal),
          b: rb.threeYearTotal == null ? "Offert" : fmtSek(rb.threeYearTotal),
          diff: num(ra.threeYearTotal, rb.threeYearTotal),
          unit: "sek",
          higherIsWorse: true,
        },
        {
          label: "Konsultpris per timme",
          a: `${fmtSek(ia.hourlyRate)}/tim`,
          b: `${fmtSek(ib.hourlyRate)}/tim`,
          diff: num(ia.hourlyRate, ib.hourlyRate),
          unit: "sek",
          higherIsWorse: true,
        },
      ],
    },
    {
      section: "Tidsplan och omfattning",
      rows: [
        {
          label: "Uppskattad tidplan",
          a: `ca ${fmtNum(ra.months)} mån`,
          b: `ca ${fmtNum(rb.months)} mån`,
          diff: num(ra.months, rb.months),
          unit: "months",
          higherIsWorse: true,
        },
        {
          label: "Total omfattning",
          a: `${new Intl.NumberFormat("sv-SE").format(ra.hours)} tim`,
          b: `${new Intl.NumberFormat("sv-SE").format(rb.hours)} tim`,
          diff: num(ra.hours, rb.hours),
          unit: "num",
          higherIsWorse: true,
        },
      ],
    },
    {
      section: "Förutsättningar",
      rows: [
        { label: "Lösningar", a: solutionsLabel(ia), b: solutionsLabel(ib) },
        {
          label: "Antal användare",
          a: `${ia.users} st`,
          b: `${ib.users} st`,
          diff: num(ia.users, ib.users),
          unit: "num",
        },
        {
          label: "Licensnivå",
          a: ia.premiumLicense ? "Premium/Enterprise" : "Standard",
          b: ib.premiumLicense ? "Premium/Enterprise" : "Standard",
        },
        { label: "Grad av anpassning", a: complexityLabel(ia), b: complexityLabel(ib) },
        {
          label: "Integrationer",
          a: `${ia.integrations} st`,
          b: `${ib.integrations} st`,
          diff: num(ia.integrations, ib.integrations),
          unit: "num",
        },
        {
          label: "Bolag / juridiska enheter",
          a: `${ia.legalEntities} st`,
          b: `${ib.legalEntities} st`,
          diff: num(ia.legalEntities, ib.legalEntities),
          unit: "num",
        },
        {
          label: "Datamigrering",
          a: ia.dataMigration ? "Ja" : "Nej",
          b: ib.dataMigration ? "Ja" : "Nej",
        },
        {
          label: "Egen utveckling",
          a: ia.customDevelopment ? "Ja" : "Nej",
          b: ib.customDevelopment ? "Ja" : "Nej",
        },
        {
          label: "Utbildning av användare",
          a: ia.training ? "Ja" : "Nej",
          b: ib.training ? "Ja" : "Nej",
        },
      ],
    },
  ];
}

function DiffCell({ row }: { row: Row }) {
  const changed = row.a !== row.b;
  if (row.diff == null || Math.abs(row.diff) < 0.001) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs ${
          changed ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {changed ? (
          "Ändrad"
        ) : (
          <>
            <Minus className="h-3 w-3" aria-hidden="true" />
            Oförändrad
          </>
        )}
      </span>
    );
  }

  const up = row.diff > 0;
  const abs = Math.abs(row.diff);
  const value =
    row.unit === "sek"
      ? fmtSek(abs)
      : row.unit === "months"
        ? `${fmtNum(Math.round(abs * 10) / 10)} mån`
        : new Intl.NumberFormat("sv-SE").format(Math.round(abs));

  const tone = row.higherIsWorse
    ? up
      ? "text-destructive"
      : "text-accent"
    : "text-foreground";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone}`}>
      {up ? (
        <ArrowUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <ArrowDown className="h-3 w-3" aria-hidden="true" />
      )}
      {up ? "+" : "−"}
      {value}
    </span>
  );
}

export default function CalculatorCompare({ currentInputs, priceLookup }: Props) {
  const { drafts } = useCalculatorDrafts();
  const [leftId, setLeftId] = useState<string>(CURRENT);
  const [rightId, setRightId] = useState<string>("");

  const options = useMemo(
    () => [
      { id: CURRENT, name: "Nuvarande scenario", inputs: currentInputs },
      ...drafts.map((d) => ({ id: d.id, name: d.name, inputs: d.inputs })),
    ],
    [drafts, currentInputs],
  );

  const left = options.find((o) => o.id === leftId);
  const right = options.find((o) => o.id === rightId);

  const sections = useMemo(() => {
    if (!left || !right) return null;
    return buildRows(
      left.inputs,
      estimateImplementation(left.inputs, priceLookup),
      right.inputs,
      estimateImplementation(right.inputs, priceLookup),
    );
  }, [left, right, priceLookup]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5 text-accent" aria-hidden="true" />
            Jämför två scenarier
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Välj två scenarier – det du räknar på just nu eller sparade utkast – så ser du
            skillnaden i pris och tidsplan sida vid sida.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="compare-a" className="text-sm">Scenario A</Label>
            <Select value={leftId} onValueChange={setLeftId}>
              <SelectTrigger id="compare-a" className="mt-1">
                <SelectValue placeholder="Välj scenario" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="compare-b" className="text-sm">Scenario B</Label>
            <Select value={rightId} onValueChange={setRightId}>
              <SelectTrigger id="compare-b" className="mt-1">
                <SelectValue placeholder="Välj scenario" />
              </SelectTrigger>
              <SelectContent>
                {options
                  .filter((o) => o.id !== leftId)
                  .map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!sections ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border p-4">
            {drafts.length === 0
              ? "Spara minst ett utkast ovan så kan du jämföra det mot ditt nuvarande scenario."
              : "Välj ett scenario i båda listorna för att se jämförelsen."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">
                Jämförelse av pris, tidsplan och förutsättningar mellan två kalkylscenarier
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="text-left font-medium text-muted-foreground py-2 pr-3">
                    Post
                  </th>
                  <th scope="col" className="text-left font-semibold text-foreground py-2 pr-3">
                    {left?.name}
                  </th>
                  <th scope="col" className="text-left font-semibold text-foreground py-2 pr-3">
                    {right?.name}
                  </th>
                  <th scope="col" className="text-left font-medium text-muted-foreground py-2">
                    Skillnad
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <Fragment key={section.section}>
                    <tr className="bg-secondary/50">
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground py-2 px-2"
                      >
                        {section.section}
                      </th>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={section.section + row.label} className="border-b border-border/60">
                        <th
                          scope="row"
                          className="text-left font-normal text-muted-foreground py-2 pr-3 align-top"
                        >
                          {row.label}
                        </th>
                        <td className="py-2 pr-3 align-top text-foreground">{row.a}</td>
                        <td className="py-2 pr-3 align-top text-foreground">{row.b}</td>
                        <td className="py-2 align-top">
                          <DiffCell row={row} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
