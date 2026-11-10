import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ProgramNavigationProps = {
  audience: "partners" | "isv";
  sections: readonly { id: string; label: string }[];
};

export default function ProgramNavigation({ audience, sections }: ProgramNavigationProps) {
  return (
    <div className="sticky top-16 lg:top-[104px] z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <nav aria-label="Välj program" className="flex gap-2 border-b border-border py-3">
          <Button asChild variant={audience === "partners" ? "default" : "outline"}>
            <Link to="/partnerprogram/" aria-current={audience === "partners" ? "page" : undefined}>Solution Partners</Link>
          </Button>
          <Button asChild variant={audience === "isv" ? "default" : "outline"}>
            <Link to="/isvprogram/" aria-current={audience === "isv" ? "page" : undefined}>ISV:er</Link>
          </Button>
        </nav>
        <nav aria-label={audience === "partners" ? "Partnerprogrammets avsnitt" : "ISV-programmets avsnitt"} className="flex flex-wrap gap-1 py-3">
          {sections.map((section) => (
            <Button key={section.id} asChild variant="ghost" size="sm">
              <a href={`#${section.id}`} onClick={() => {
                const target = document.getElementById(section.id);
                if (target instanceof HTMLDetailsElement) target.open = true;
              }}>{section.label}</a>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}