import { Link } from "react-router-dom";
import { hasAnyAnswer, type BuyerProfile, type SectionKey } from "@/lib/buyerProfile";

const GROUPS: { label: string; sections: SectionKey[] }[] = [
  { label: "Verksamhet och bransch", sections: ["company"] },
  { label: "Nuvarande system och omfattning", sections: ["current_erp", "scope", "integrations"] },
  { label: "Produktområden", sections: ["fscm", "crm", "contact_center"] },
  { label: "Projekt och beslutsläge", sections: ["project", "assessment"] },
];

const fmt = (v: unknown) => (Array.isArray(v) ? v.join(", ") : String(v));

export function projectGroups(p: BuyerProfile) {
  return GROUPS.map((g) => ({
    label: g.label,
    values: g.sections.flatMap((s) =>
      Object.entries(p[s] || {})
        .filter(([, v]) => v !== "" && v !== null && typeof v !== "boolean" && !(Array.isArray(v) && !v.length))
        .map(([, v]) => fmt(v)),
    ).slice(0, 5),
  })).filter((g) => g.values.length);
}

export default function ProjectSummary({ profile, compact = false }: { profile: BuyerProfile; compact?: boolean }) {
  if (!hasAnyAnswer(profile)) {
    return (
      <p className="text-sm text-muted-foreground">
        Ni har inget projektunderlag ännu. Ett underlag gör det lättare för partnerna att förstå ert läge.{" "}
        <Link to="/underlag/" className="text-primary underline">Fyll i underlaget</Link>
      </p>
    );
  }
  const groups = projectGroups(profile);
  return (
    <div className="space-y-2 text-sm">
      <dl className={compact ? "space-y-1.5" : "grid gap-3 sm:grid-cols-2"}>
        {groups.map((g) => (
          <div key={g.label} className="min-w-0">
            <dt className="text-xs font-semibold text-muted-foreground">{g.label}</dt>
            <dd className="break-words">{g.values.join(" · ")}</dd>
          </div>
        ))}
      </dl>
      <Link to="/underlag/" className="inline-block text-xs text-primary underline">Komplettera eller ändra underlaget</Link>
    </div>
  );
}
