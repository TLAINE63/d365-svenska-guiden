import { nowrapBrand } from "@/lib/nowrapBrand";

export type PhotoStep = { img: string; alt: string; title: string; text: string };

/** Ren presentation: bildsatta steg utan logik eller kontaktflöden. */
export default function PhotoSteps({ steps, cols = 4 }: { steps: PhotoStep[]; cols?: 2 | 4 }) {
  const grid = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2";
  return (
    <ol className={`grid gap-6 ${grid}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="overflow-hidden rounded-lg border border-border bg-card">
          <img src={s.img} alt={s.alt} loading="lazy" decoding="async" width={800} height={600} className="aspect-[4/3] w-full object-cover" />
          <div className="p-5">
            {cols === 4 && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Steg {i + 1}</p>}
            <h3 className="mb-1 font-semibold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{nowrapBrand(s.text)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
