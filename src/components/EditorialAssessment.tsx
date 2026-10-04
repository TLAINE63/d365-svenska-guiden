import { useId } from "react";
import { ORGANIZATION } from "@/data/organization";
import { editorialAssessments, type EditorialAssessmentKey } from "@/data/editorialAssessments";
import { nowrapBrand } from "@/lib/nowrapBrand";

export default function EditorialAssessment({ assessment }: { assessment: EditorialAssessmentKey }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} data-editorial-assessment={assessment} className="border-b border-border bg-secondary/30 py-5 sm:py-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <h2 id={headingId} className="mb-2 text-base font-semibold text-foreground">
          {ORGANIZATION.name.toUpperCase()}:s bedömning
        </h2>
        <p className="max-w-4xl text-sm leading-relaxed text-foreground/85">
          {nowrapBrand(editorialAssessments[assessment])}
        </p>
      </div>
    </section>
  );
}