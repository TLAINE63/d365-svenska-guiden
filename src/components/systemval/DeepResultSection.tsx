import { Link } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeepResult } from "@/lib/systemval/deep";

interface Props { result: DeepResult; onEdit: () => void; onNextStep?: (kind: string) => void }

const Block = ({ title, items }: { title: string; items: string[] }) =>
  items.length ? (
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-muted-foreground">{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  ) : null;

/** Fördjupad behovsbild (Sprint 4). Ingen partnerranking, ingen kravspecifikation. */
export default function DeepResultSection({ result: r, onEdit, onNextStep }: Props) {
  return (
    <section aria-labelledby="deep-res" className="space-y-5 rounded-xl border border-primary/40 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="deep-res" className="text-xl font-semibold text-foreground">Er fördjupade behovsbild</h2>
        <Button variant="ghost" size="sm" onClick={onEdit}><Pencil className="h-3.5 w-3.5 mr-1" />Ändra fördjupningen</Button>
      </div>
      <Block title="Trolig lösningsriktning" items={r.direction.map((d) => d.label)} />
      <Block title="Kompletterande områden" items={r.complementary.map((d) => d.label)} />
      <Block title="Relativt tydligt" items={r.clear} />
      <div>
        <h3 className="font-semibold text-foreground">Viktiga beslut att ta</h3>
        <ol className="mt-1 list-decimal pl-5 space-y-1 text-sm text-foreground">{r.decisions.map((t) => <li key={t}>{t}</li>)}</ol>
      </div>
      <Block title="Frågor som fortfarande är öppna" items={r.openQuestions} />
      {r.addOns.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground">Tillägg eller speciallösningar att undersöka</h3>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {r.addOns.map((a) => <li key={a.category}><span className="font-medium text-foreground">{a.label}:</span> {a.reason} Tilläggslösning bör utvärderas inom detta område.</li>)}
          </ul>
        </div>
      )}
      <Block title="Att tänka på inför ett införande" items={r.implementation} />
      {r.aiNote && <Block title="AI i lösningen" items={[r.aiNote]} />}
      <Button asChild className="w-full sm:w-auto">
        <Link to={r.nextStep.href} onClick={() => onNextStep?.(r.nextStep.kind)}>{r.nextStep.label}<ArrowRight className="h-4 w-4 ml-1" /></Link>
      </Button>
    </section>
  );
}
