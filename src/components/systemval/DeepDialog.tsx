import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DialogState } from "@/lib/systemval/engine";
import { toggleMulti } from "@/lib/systemval/engine";
import type { SolutionPicture } from "@/lib/systemval/solutions";
import { DEEP_QUESTIONS, deepContext, deriveDeep, resolveDeepOptions, resolveDeepText } from "@/lib/systemval/deep";

interface Props {
  picture: SolutionPicture;
  state: DialogState;
  answers: Record<string, string[]>;
  startAt?: number;
  onAnswer: (id: string, values: string[]) => void;
  onExit: () => void;
  onDone: () => void;
}

/** Frivillig fördjupning. Samma kortformat som Behovsguiden, scroll till toppen vid varje steg. */
export default function DeepDialog({ picture, state, answers, startAt, onAnswer, onExit, onDone }: Props) {
  const deep = useMemo(() => deriveDeep(picture, state, answers), [picture, state, answers]);
  const [cursor, setCursor] = useState(startAt ?? deep.path.length);
  const pos = Math.min(cursor, deep.path.length);
  const id = pos < deep.path.length ? deep.path[pos] : deep.next;
  const q = id ? DEEP_QUESTIONS.find((x) => x.id === id) : undefined;
  const known = Object.fromEntries(deep.path.slice(0, pos).map((k) => [k, deep.answers[k]]));
  const ctx = deepContext(picture, state, known);
  const options = q ? resolveDeepOptions(q, ctx) : [];
  const [draft, setDraft] = useState<string[]>([]);

  useEffect(() => { setDraft(id ? answers[id] ?? [] : []); window.scrollTo({ top: 0, behavior: "auto" }); }, [id, pos]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!q) onDone(); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!q) return null;

  const commit = (v: string[]) => { onAnswer(q.id, v); setCursor(pos + 1); };
  const total = deep.path.length + (deep.next ? 1 : 0);

  return (
    <section aria-labelledby="deep-q">
      <p className="text-xs text-muted-foreground mb-2">
        Fördjupning · fråga {pos + 1}{total > pos + 1 ? ` av minst ${total}` : ""} · {q.type === "multi" ? "Välj ett eller flera alternativ" : "Välj ett alternativ"}
      </p>
      <h1 id="deep-q" className="text-2xl sm:text-3xl font-semibold text-foreground text-balance mb-2">{resolveDeepText(q, ctx)}</h1>
      {q.help && <p className="text-muted-foreground mb-4">{q.help}</p>}
      <div role={q.type === "multi" ? "group" : "radiogroup"} aria-labelledby="deep-q" className="mt-5 grid gap-3">
        {options.map((o) => {
          const sel = draft.includes(o.id);
          return (
            <button key={o.id} type="button" role={q.type === "multi" ? "checkbox" : "radio"} aria-checked={sel}
              onClick={() => { if (q.type === "single") { setDraft([o.id]); commit([o.id]); } else setDraft((d) => toggleMulti(d, o, options)); }}
              className={`w-full text-left rounded-xl border p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${sel ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}>
              <span className="flex items-start gap-3">
                <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${q.type === "multi" ? "rounded" : "rounded-full"} ${sel ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                  {sel && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="font-medium text-foreground">{o.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => (pos > 0 ? setCursor(pos - 1) : onExit())}><ArrowLeft className="h-4 w-4 mr-1" />Tillbaka</Button>
        {q.type === "multi" && <Button onClick={() => commit(draft)} disabled={draft.length === 0}>Fortsätt</Button>}
        <Button variant="ghost" onClick={onExit}>Avbryt fördjupningen</Button>
      </div>
    </section>
  );
}
