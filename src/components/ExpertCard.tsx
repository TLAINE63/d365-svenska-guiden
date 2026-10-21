import { Link } from "react-router-dom";
import { contributionsFor } from "@/data/contentContributors";
import { editorialDate } from "@/components/EditorialSource";
import { ORGANIZATION } from "@/data/organization";
import { pageReviewDate } from "@/data/pageReviewDates";

/** Shows only explicitly registered contributors for the page; renders nothing otherwise. */
export default function ExpertCard({ path }: { path: string }) {
  const items = contributionsFor(path);
  if (!items.length) return null;
  return (
    <section aria-label="Medverkande experter" className="container mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ person, role, date, title }) => {
          const d = editorialDate(date) ?? editorialDate(pageReviewDate(path));
          return (
            <article key={`${person.id}-${role}`} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{role}</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{title ?? person.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{person.bio}</p>
              <p className="mt-2 text-xs text-muted-foreground">Redaktion: {ORGANIZATION.name} ({ORGANIZATION.parentName})</p>
              {d && <p className="mt-1 text-xs text-muted-foreground">Senast granskad: <time dateTime={d}>{d}</time></p>}
              <Link to={person.profilePath} className="mt-3 inline-block text-sm text-primary underline underline-offset-4">Läs mer om {person.name}</Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
