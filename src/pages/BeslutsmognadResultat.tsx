import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { ADVISOR_BOOKING_URL } from "@/data/organization";
import {
  BMI_B0, BMI_B5, BMI_NO_ACTIONS_TEXT, BMI_QUESTIONS, BMI_RESULT_FOOTER, BMI_SECTIONS, BMI_RESULT_KEY,
  bmiQuestionText, bmiTrack, type BmiArea, type BmiResponse,
} from "@/lib/bmi";

type Payload = { result: BmiResponse; input: { b0: BmiArea; b5: number; answers: Record<string, number> }; date: string };

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold text-foreground mb-4">{children}</h2>;

export default function BeslutsmognadResultat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<Payload | null>((location.state as Payload) ?? null);
  const [ready, setReady] = useState(!!payload);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    if (payload) return;
    try { const raw = sessionStorage.getItem(BMI_RESULT_KEY); if (raw) setPayload(JSON.parse(raw)); } catch { /* ignore */ }
    setReady(true);
  }, [payload]);
  useEffect(() => { if (ready && !payload) navigate("/beslutsmognad/diagnostik", { replace: true }); }, [ready, payload, navigate]);
  if (!payload) return null;

  const { result: r, input, date } = payload;
  const areaLabel = BMI_B0.options.find((o) => o.value === input.b0)?.label;
  const stageLabel = BMI_B5.options.find((o) => o.value === input.b5)?.label;

  const downloadPdf = async () => {
    setPdfBusy(true);
    try {
      const { generateBmiPdf } = await import("@/utils/generateBmiPdf");
      await generateBmiPdf(r, input, date);
      bmiTrack("pdf_download", "bmi_pdf_download", { phase: r.phase });
    } finally { setPdfBusy(false); }
  };
  const restart = () => { try { sessionStorage.removeItem(BMI_RESULT_KEY); } catch { /* ignore */ } navigate("/beslutsmognad/diagnostik"); };

  return (
    <>
      <Helmet>
        <title>Ert resultat · Beslutsmognadsindex | d365.se</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://d365.se/beslutsmognad/resultat/" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-5"><Link to="/" className="font-semibold text-foreground">d365.se</Link></div>
        </header>
        <div className="max-w-[720px] mx-auto px-5 py-12 md:py-16 space-y-14">
          <section>
            <h1 className="sr-only">Ert beslutsmognadsindex</h1>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-6xl font-semibold text-primary leading-none">{r.total}</span>
              <span className="text-sm text-muted-foreground">av 100</span>
              <span className="ml-2 rounded-full border border-primary/40 bg-primary/[0.08] px-3 py-1 text-sm font-medium text-foreground">{r.level}</span>
            </div>
            <p className="mt-5 text-[16px] leading-[1.5] text-foreground">{r.summary}</p>
            <p className="mt-3 text-sm text-muted-foreground">Område: {areaLabel}  |  Skede: {stageLabel}</p>
          </section>

          <section>
            <H2>Er profil</H2>
            <div className="space-y-4">
              {r.sections.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center gap-4">
                    <span className={`w-40 shrink-0 text-sm ${s.counted ? "text-foreground" : "text-muted-foreground"}`}>{s.name}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-foreground/10 overflow-hidden">
                      <div className={`h-full rounded-full ${s.counted ? "bg-primary" : "bg-muted-foreground/30"}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className={`w-8 text-right text-sm tabular-nums ${s.counted ? "text-foreground" : "text-muted-foreground"}`}>{s.score}</span>
                  </div>
                  {s.note && <p className="mt-1 ml-44 text-xs text-muted-foreground">{s.note}</p>}
                </div>
              ))}
            </div>
          </section>

          {r.strength && (
            <section>
              <H2>Ert starkaste område</H2>
              <p className="font-medium text-foreground">{BMI_SECTIONS.find((s) => s.id === r.strength!.id)?.name}</p>
              <p className="mt-1 text-foreground/90">{r.strength.text}</p>
            </section>
          )}

          <section>
            <H2>Tre saker att ta tag i härnäst</H2>
            {r.actions.length === 0 ? <p className="text-foreground/90">{BMI_NO_ACTIONS_TEXT}</p> : (
              <ol className="space-y-3">
                {r.actions.map((a, i) => (
                  <li key={a.question} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-primary/[0.1] text-primary text-sm font-semibold flex items-center justify-center">{i + 1}</span>
                    <div><p className="font-medium text-foreground">{a.title}</p><p className="mt-1 text-sm leading-relaxed text-foreground/85">{a.text}</p></div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {r.warnings.length > 0 && (
            <section>
              <H2>Värt att uppmärksamma</H2>
              <div className="space-y-3">
                {r.warnings.map((w) => <p key={w.id} className="border-l-2 border-warning bg-card pl-4 py-3 pr-4 rounded-r-lg text-sm leading-relaxed text-foreground/90">{w.text}</p>)}
              </div>
            </section>
          )}

          <section>
            <H2>Frågor att ställa till partners</H2>
            <p className="-mt-2 mb-4 text-sm text-muted-foreground">Utifrån era svar är det här frågor som är värda att ställa i kommande möten.</p>
            <ol className="list-decimal pl-5 space-y-2 text-foreground/90">{r.partner_questions.map((q) => <li key={q.question}>{q.text}</li>)}</ol>
          </section>

          {r.read_more.length > 0 && (
            <section>
              <H2>Läs vidare</H2>
              <ul className="space-y-2">{r.read_more.map((l) => <li key={l.section}><Link to={l.url} className="text-primary underline underline-offset-4">{l.title}</Link></li>)}</ul>
            </section>
          )}

          <section>
            <details className="group rounded-xl border border-border bg-card">
              <summary className="cursor-pointer list-none flex items-center justify-between p-5 font-medium text-foreground">
                Visa era svar <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 space-y-6">
                {BMI_SECTIONS.map((s) => (
                  <div key={s.id}>
                    <h3 className="font-medium text-foreground mb-2">{s.name}</h3>
                    <dl className="space-y-3">
                      {s.questions.map((qid) => {
                        const q = BMI_QUESTIONS.find((x) => x.id === qid)!;
                        return (<div key={qid}><dt className="text-sm text-muted-foreground">{bmiQuestionText(q.text, input.b0)}</dt><dd className="text-sm text-foreground">{q.options[input.answers[qid]]}</dd></div>);
                      })}
                    </dl>
                  </div>
                ))}
              </div>
            </details>
          </section>

          <section>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60">{pdfBusy ? "Skapar PDF…" : "Ladda ner som PDF"}</button>
              <button type="button" onClick={restart} className="rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground hover:border-foreground/40">Gör om testet</button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Vill du gå igenom resultatet med någon som följt marknaden länge?{" "}
              <a href={ADVISOR_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Boka ett samtal</a>.
            </p>
          </section>

          <p className="text-xs text-muted-foreground border-t border-border pt-6">{BMI_RESULT_FOOTER}</p>
        </div>
      </main>
    </>
  );
}
