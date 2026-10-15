import { ArrowDown, ArrowRight } from "lucide-react";

interface Props {
  traditional: string[];
  ai: string[];
}

const Column = ({ title, steps, accent }: { title: string; steps: string[]; accent?: boolean }) => (
  <div className={`rounded-xl border p-5 ${accent ? "border-accent/40 bg-accent/5" : "border-border bg-muted/40"}`}>
    <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${accent ? "text-accent" : "text-muted-foreground"}`}>{title}</p>
    <ol className="flex flex-col items-start gap-1 md:flex-row md:flex-wrap md:items-center md:gap-2">
      {steps.map((s, i) => (
        <li key={s + i} className="flex flex-col items-start md:flex-row md:items-center md:gap-2">
          <span className={`rounded-md px-3 py-1.5 text-sm font-medium ${accent ? "bg-card text-foreground border border-accent/30" : "bg-card text-foreground border border-border"}`}>{s}</span>
          {i < steps.length - 1 && (
            <>
              <ArrowDown className="ml-3 my-0.5 h-4 w-4 text-muted-foreground md:hidden" aria-hidden />
              <ArrowRight className="hidden h-4 w-4 text-muted-foreground md:block" aria-hidden />
            </>
          )}
        </li>
      ))}
    </ol>
  </div>
);

const BeforeAfterWorkflow = ({ traditional, ai }: Props) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Column title="Traditionellt arbetssätt" steps={traditional} />
    <Column title="Arbeta med AI" steps={ai} accent />
  </div>
);

export default BeforeAfterWorkflow;
