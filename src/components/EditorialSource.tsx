import { ORGANIZATION } from "@/data/organization";
import { cn } from "@/lib/utils";

export type EditorialSourceType =
  | "Köpguide"
  | "Partnerguide"
  | "Jämförelse"
  | "Marknadsöversikt"
  | "Branschguide"
  | "Migrationsguide";

interface Props {
  sourceType: EditorialSourceType;
  updatedAt?: string | null;
  reviewedBy?: string | null;
  tone?: "light" | "dark";
  className?: string;
}

/** Only supplied content dates and confirmed reviewers are shown as facts. */
export function editorialDate(value?: string | null): string | undefined {
  const date = value?.trim().replace(/\//g, "-").match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!date) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date
    ? undefined
    : date;
}

export default function EditorialSource({
  sourceType,
  updatedAt,
  reviewedBy,
  tone = "light",
  className,
}: Props) {
  const date = editorialDate(updatedAt);
  const dark = tone === "dark";
  return (
    <aside
      aria-label="Avsändare och innehållskälla"
      data-editorial-source={sourceType}
      className={cn(
        "my-5 border-y py-3 text-xs leading-relaxed",
        dark ? "border-primary-foreground/20 text-primary-foreground/80" : "border-border text-muted-foreground",
        className,
      )}
    >
      <p className={cn("text-sm font-semibold", dark ? "text-primary-foreground" : "text-foreground")}>
        {ORGANIZATION.name.toUpperCase()} {sourceType}
      </p>
      <p className="mt-1 max-w-3xl">
        Köparsidig vägledning för svenska företag som utvärderar{" "}
        <span className="whitespace-nowrap">Dynamics&nbsp;365</span>, ERP, CRM och Microsoft-partners.
      </p>
      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        <div className="flex flex-wrap gap-x-1">
          <dt>Utgivare:</dt>
          <dd itemScope itemType="https://schema.org/Organization" itemID={`${ORGANIZATION.url}/#organization`}>
            <meta itemProp="url" content={ORGANIZATION.url} />
            <span itemProp="name">{ORGANIZATION.name.toUpperCase()}</span>
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt>Källtyp:</dt><dd>{sourceType}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt>Senast uppdaterad:</dt>
          <dd>{date ? <time dateTime={date}>{date}</time> : "Datum ej angivet"}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt>Granskad av:</dt><dd>{reviewedBy?.trim() || "Granskare ej angiven"}</dd>
        </div>
      </dl>
    </aside>
  );
}