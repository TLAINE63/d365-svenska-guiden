import { ORGANIZATION } from "@/data/organization";
import { cn } from "@/lib/utils";
import { useInRouterContext, useLocation } from "react-router-dom";
import { pageReviewDate } from "@/data/pageReviewDates";

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

function RouterPath({ children }: { children: (p: string) => React.ReactNode }) {
  return <>{children(useLocation().pathname)}</>;
}

export default function EditorialSource(props: Props) {
  return useInRouterContext() ? <RouterPath>{(p) => <EditorialSourceInner {...props} path={p} />}</RouterPath> : <EditorialSourceInner {...props} path="" />;
}

function EditorialSourceInner({
  sourceType,
  updatedAt,
  reviewedBy,
  tone = "light",
  className,
  path,
}: Props & { path: string }) {
  const date = editorialDate(updatedAt) ?? editorialDate(pageReviewDate(path));
  const dark = tone === "dark";
  return (
    <aside
      aria-label="Avsändare och innehållskälla"
      data-editorial-source={sourceType}
      className={cn(
        "my-3 border-b pb-2 text-xs leading-relaxed",
        dark ? "border-primary-foreground/20 text-primary-foreground/80" : "border-border text-muted-foreground",
        className,
      )}
    >
      <p className={cn("text-xs font-semibold", dark ? "text-primary-foreground" : "text-foreground")}>
        {ORGANIZATION.name.toUpperCase()} {sourceType}
      </p>
      <p className="mt-1 max-w-3xl text-xs">
        Av d365.se-redaktionen. d365.se är en svensk köparsidig kunskaps- och jämförelsetjänst för organisationer som utvärderar Microsoft{" "}
        <span className="whitespace-nowrap">Dynamics&nbsp;365</span> och relaterade tjänster. d365.se är inte Microsoft och representerar inte Microsoft.
      </p>
      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
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
        {date && (
          <div className="flex flex-wrap gap-x-1">
            <dt>Senast uppdaterad:</dt>
            <dd><time dateTime={date}>{date}</time></dd>
          </div>
        )}
        {reviewedBy?.trim() && (
          <div className="flex flex-wrap gap-x-1">
            <dt>Granskad av:</dt><dd>{reviewedBy.trim()}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}