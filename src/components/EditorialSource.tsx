import { ORGANIZATION } from "@/data/organization";
import { cn } from "@/lib/utils";
import { Link, useInRouterContext, useLocation } from "react-router-dom";
import { contributionsFor } from "@/data/contentContributors";
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

function RouterPath({ children }: { children: (p: string) => import("react").ReactNode }) {
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
  const authors = dark ? [] : contributionsFor(path);
  const meta = (
    <dl className={cn("mt-2 flex flex-wrap gap-x-4 gap-y-1", !authors.length && !dark && "justify-center")}>
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
  );
  const intro = (
    <>
      <p className={cn("text-xs font-semibold uppercase tracking-wide", dark ? "text-primary-foreground" : "text-foreground")}>
        {ORGANIZATION.name.toUpperCase()} {sourceType}
      </p>
      <p className="mt-1 text-xs">
        Av d365.se-redaktionen. d365.se är en svensk kunskaps- och jämförelsetjänst för organisationer som utvärderar Microsoft{" "}
        <span className="whitespace-nowrap">Dynamics&nbsp;365</span> och relaterade tjänster. d365.se är inte Microsoft och representerar inte Microsoft.
      </p>
    </>
  );
  if (dark) {
    return (
      <aside aria-label="Avsändare och innehållskälla" data-editorial-source={sourceType}
        className={cn("my-3 border-b border-primary-foreground/20 pb-2 text-xs leading-relaxed text-primary-foreground/80", className)}>
        {intro}{meta}
      </aside>
    );
  }
  return (
    <aside
      aria-label="Avsändare och innehållskälla"
      data-editorial-source={sourceType}
      className={cn("container mx-auto my-12 max-w-6xl px-4 sm:px-6", className)}
    >
      <div className={cn(
        "rounded-lg border border-border bg-card p-6 text-xs leading-relaxed text-muted-foreground",
        authors.length ? "grid gap-6 md:grid-cols-2 md:gap-10" : "mx-auto max-w-3xl text-center",
      )}>
        {authors.map(({ person, role, title }) => (
          <div key={`${person.id}-${role}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{role}</p>
            <p className="mt-1 text-base font-semibold text-foreground">{person.name}</p>
            <p className="text-sm">{title ?? person.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{person.bio}</p>
            <Link to={person.profilePath} className="mt-2 inline-block text-sm text-primary underline underline-offset-4">Läs mer om {person.name}</Link>
          </div>
        ))}
        <div className={cn(authors.length && "md:border-l md:border-border md:pl-10")}>
          {intro}
          <p className="mt-2 text-xs">Redaktion: {ORGANIZATION.name} ({ORGANIZATION.parentName})</p>
          {meta}
        </div>
      </div>
    </aside>
  );
}