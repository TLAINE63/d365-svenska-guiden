import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ProgramNavigationProps = {
  audience: "partners" | "isv";
  sections: readonly { id: string; label: string }[];
};

/** Rullar så att avsnittets rubrik hamnar med luft under sajtmenyn och programmenyn. */
function scrollToSection(id: string, bar: HTMLElement | null, smooth: boolean) {
  const target = document.getElementById(id);
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  const heading = target.querySelector("h2, h3, summary") ?? target;
  const stickyTop = bar ? parseFloat(getComputedStyle(bar).top) || 0 : 0;
  const offset = stickyTop + (bar?.offsetHeight ?? 0) + 24;
  const top = heading.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
}

export default function ProgramNavigation({ audience, sections }: ProgramNavigationProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !sections.some((s) => s.id === id)) return;
    const t = window.setTimeout(() => scrollToSection(id, barRef.current, false), 100);
    return () => window.clearTimeout(t);
  }, [sections]);

  // Även andra länkar på sidan (t.ex. "Se prislistan") ska landa under menyerna.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (!a || barRef.current?.contains(a)) return;
      const id = decodeURIComponent((a.getAttribute("href") ?? "").slice(1));
      if (!sections.some((s) => s.id === id)) return;
      e.preventDefault();
      window.history.replaceState(null, "", `#${id}`);
      scrollToSection(id, barRef.current, true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sections]);

  return (
    <div ref={barRef} className="sticky top-16 lg:top-[104px] z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <nav aria-label="Välj program" className="flex flex-wrap items-center gap-2 border-b border-border py-3">
          <Button asChild variant={audience === "partners" ? "default" : "outline"}>
            <Link to="/partnerprogram/" aria-current={audience === "partners" ? "page" : undefined}>Solution Partners</Link>
          </Button>
          <Button asChild variant={audience === "isv" ? "default" : "outline"}>
            <Link to="/isvprogram/" aria-current={audience === "isv" ? "page" : undefined}>ISV:er</Link>
          </Button>
          {action}
        </nav>
        <nav aria-label={audience === "partners" ? "Partnerprogrammets avsnitt" : "ISV-programmets avsnitt"} className="flex flex-wrap gap-1 py-3">
          {sections.map((section) => (
            <Button key={section.id} asChild variant="ghost" size="sm">
              <a href={`#${section.id}`} onClick={(e) => {
                e.preventDefault();
                window.history.replaceState(null, "", `#${section.id}`);
                scrollToSection(section.id, barRef.current, true);
              }}>{section.label}</a>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}