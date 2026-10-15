import { ArrowDown } from "lucide-react";

interface Props {
  traditional: string[];
  ai: string[];
}

const Column = ({ title, steps, accent }: { title: string; steps: string[]; accent?: boolean }) => (
  <div className={`rounded-xl border p-4 sm:p-5 ${accent ? "border-accent/40 bg-accent/5" : "border-border bg-muted/40"}`}>
    <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${accent ? "text-accent" : "text-muted-foreground"}`}>
      {title} <span className="font-normal normal-case tracking-normal">({steps.length} steg)</span>
    </h3>
    <ol className="flex flex-col gap-1">
      {steps.map((s, i) => (
        <li key={s + i} className="flex flex-col items-start">
          <span className="flex w-full items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
            <span className={`text-xs tabular-nums ${accent ? "text-accent" : "text-muted-foreground"}`}>{i + 1}</span>
            {s}
          </span>
          {i < steps.length - 1 && <ArrowDown className="my-0.5 ml-3 h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
        </li>
      ))}
    </ol>
  </div>
);

/** Bibliotekets visuella signatur: tidigare arbetssätt bredvid arbetssättet med AI. */
const BeforeAfterWorkflow = ({ traditional, ai }: Props) => (
  <div className="grid gap-3 md:grid-cols-2">
    <Column title="Tidigare arbetssätt" steps={traditional} />
    <Column title="Med AI" steps={ai} accent />
  </div>
);

export default BeforeAfterWorkflow;
