import { useEffect, useState, type ReactNode } from "react";

export interface ProductSectionNavItem {
  id: string;
  label: string;
  /** Optional: start of an h2 text inside <main>; its section gets `id` if it has none. */
  match?: string;
}

/** Finds each item's target on the page; items whose target is missing are dropped. */
function resolveItems(items: ProductSectionNavItem[]): ProductSectionNavItem[] {
  const main = document.querySelector("main") ?? document.body;
  const out: ProductSectionNavItem[] = [];
  for (const item of items) {
    let el: HTMLElement | null = document.getElementById(item.id);
    if (!el && item.match) {
      const h2 = Array.from(main.querySelectorAll("h2")).find((h) =>
        (h.textContent ?? "").replace(/\s+/g, " ").trim().startsWith(item.match!),
      );
      if (h2) {
        const host = (h2.closest("section") as HTMLElement | null) ?? h2;
        if (!host.id) host.id = item.id;
        el = host;
      }
    }
    if (!el) continue;
    el.classList.add("scroll-mt-28");
    if (!out.some((o) => o.id === el!.id)) out.push({ id: el.id, label: item.label });
  }
  return out;
}

/** Sticky section menu: left rail on wide screens, horizontal chip bar below. */
export function ProductSectionNav({ items: initial, title }: { items: ProductSectionNavItem[]; title: string }) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState(initial[0]?.id);

  useEffect(() => {
    setItems(resolveItems(initial));
  }, [initial]);

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
      <aside className="hidden xl:block w-56 shrink-0 border-r border-border pl-6 pr-4 pt-10">
      <nav aria-label={title} className="sticky top-28">
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
      </aside>
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

/** Product page body below the hero: section menu on the left, content on the right. */
export function ProductPageBody({ items, children }: { items: ProductSectionNavItem[]; children: ReactNode }) {
  return (
    <div className="xl:flex">
      <ProductSectionNav title="På sidan" items={items} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
