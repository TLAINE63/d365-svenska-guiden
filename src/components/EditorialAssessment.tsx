import { useId } from "react";
import { ORGANIZATION } from "@/data/organization";
import { editorialAssessments, type EditorialAssessmentKey } from "@/data/editorialAssessments";
import { nowrapBrand } from "@/lib/nowrapBrand";

export default function EditorialAssessment({ assessment }: { assessment: EditorialAssessmentKey }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} data-editorial-assessment={assessment} className="bg-background py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6"><div className="mx-auto max-w-3xl">
        <h2 id={headingId} className="mb-2 text-base font-semibold text-foreground">
          {ORGANIZATION.name.toUpperCase()}:s bedömning
        </h2>
        <blockquote className="border-l-2 border-accent pl-4">
          <p className="text-sm leading-relaxed text-foreground/85">
            {nowrapBrand(editorialAssessments[assessment])}
          </p>
          <footer className="mt-1.5 text-xs text-muted-foreground">
            <cite className="not-italic">Redaktionen, {ORGANIZATION.name}</cite>
          </footer>
        </blockquote>
      </div></div>
    </section>
  );
}