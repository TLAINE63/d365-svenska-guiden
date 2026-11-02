import { useEffect, useState } from "react";

export interface ProductSectionNavItem {
  id: string;
  label: string;
}

/** Sticky section menu: left rail on wide screens, horizontal chip bar below. */
export function ProductSectionNav({ items, title }: { items: ProductSectionNavItem[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <>
      <nav aria-label={title} className="hidden xl:block fixed left-6 top-28 z-30 w-48">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <ul className="space-y-1 border-l border-border">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors ${
                  active === i.id ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label={`${title} (kompakt)`} className="xl:hidden sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <ul className="container mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                className={`block rounded-full border px-3 py-1 text-sm ${
                  active === i.id ? "border-primary bg-primary/10 font-semibold text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
