import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyerProfile, setAnswer } from "@/lib/buyerProfile";
import { answerLabel, questionsFor, type UQuestion } from "@/data/underlagQuestions";

interface Props {
  questions: UQuestion[];
  /** Visa bara obesvarade frågor som öppna; besvarade visas som "Ert svar". */
  compact?: boolean;
}

/**
 * Frågelista som återanvänder svar: finns svaret redan visas det som
 * "Ert svar: … (ändra)". Varje svar sparas direkt.
 */
export default function UnderlagQuestionnaire({ questions, compact }: Props) {
  const profile = useBuyerProfile();
  const [editing, setEditing] = useState<string | null>(null);
  const visible = questionsFor(profile, questions);

  return (
    <ol className="space-y-3">
      {visible.map((q) => {
        const v = profile[q.section]?.[q.key];
        const answered = v !== undefined && !(Array.isArray(v) && v.length === 0);
        if (answered && editing !== q.id) {
          return (
            <li key={q.id} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
              <p className="text-muted-foreground">{q.text}</p>
              <p className="mt-1 text-foreground break-words">
                <CheckCircle2 className="inline w-4 h-4 mr-1 text-accent align-[-2px]" />
                Ert svar: <span className="font-medium">{answerLabel(q, v)}</span>{" "}
                <button type="button" onClick={() => setEditing(q.id)} className="text-primary underline underline-offset-2">
                  (ändra)
                </button>
              </p>
            </li>
          );
        }
        const selected = Array.isArray(v) ? (v as string[]) : [];
        return (
          <li key={q.id} className="rounded-lg border border-primary/30 bg-card p-4">
            <p className="font-medium text-foreground">{q.text}</p>
            {q.help && <p className="text-xs text-muted-foreground mt-1">{q.help}</p>}
            <div className={`mt-3 flex flex-wrap gap-2 ${compact ? "" : ""}`}>
              {q.options.map((o) => {
                const on = q.multi ? selected.includes(o.value) : v === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      if (q.multi) {
                        const next = on ? selected.filter((x) => x !== o.value) : [...selected, o.value];
                        setAnswer(q.section, q.key, next);
                      } else {
                        setAnswer(q.section, q.key, o.value);
                        setEditing(null);
                      }
                    }}
                    className={`rounded-md border px-3 py-1.5 text-sm text-left transition-colors ${
                      on ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            {q.multi && selected.length > 0 && (
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setEditing(null)}>
                Klar
              </Button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
