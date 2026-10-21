import type { ReactNode } from "react";

export interface Fact { label: string; value: ReactNode }

/** Compact, citation-friendly facts as a semantic definition list. */
export default function FactBox({ title, facts, note }: { title: string; facts: Fact[]; note?: ReactNode }) {
  return (
    <section aria-label={title} className="container mx-auto max-w-6xl px-4 sm:px-6 pb-6">
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
        {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
      </div>
    </section>
  );
}
