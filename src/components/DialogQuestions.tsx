import { Link } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import { hasAnyAnswer, useBuyerProfile } from "@/lib/buyerProfile";
import { dialogQuestions } from "@/lib/dialogQuestions";

/** Frågor att ställa till partnerna, baserade på köparens egna svar. */
export default function DialogQuestions() {
  const profile = useBuyerProfile();
  const any = hasAnyAnswer(profile);
  const qs = dialogQuestions(profile);
  return (
    <section aria-labelledby="dialog-q" className="container mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 id="dialog-q" className="flex items-center gap-2 text-xl font-semibold">
          <MessageSquareText className="h-5 w-5 text-accent" aria-hidden />
          Frågor att ställa till partnerna
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {any
            ? "Utifrån era egna svar. Frågorna hjälper er jämföra hur partnerna arbetar; de är inte en bedömning av partnerna."
            : "Allmänna frågor. Fyll i ert underlag så anpassas frågorna efter er situation."}
        </p>
        <ol className="mt-4 space-y-3">
          {qs.map((q) => (
            <li key={q.id} className="rounded-md bg-muted/40 p-3 text-sm">
              <p className="text-xs text-muted-foreground">{q.reason}</p>
              <p className="mt-1 font-medium">{q.question}</p>
            </li>
          ))}
        </ol>
        {!any && <Link to="/underlag/" className="mt-4 inline-block text-sm font-medium underline">Gör ert underlag</Link>}
      </div>
    </section>
  );
}
