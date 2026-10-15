import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BeforeAfterWorkflow from "@/components/ai-examples/BeforeAfterWorkflow";
import AiExampleCard from "@/components/ai-examples/AiExampleCard";
import { AI_APPLICATIONS, AI_CATEGORIES, AiApplication, AiCategory, filterExamples } from "@/data/aiExamples";

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"
  }`;

const AiExempel = () => {
  const [cats, setCats] = useState<AiCategory[]>([]);
  const [apps, setApps] = useState<AiApplication[]>([]);
  const results = useMemo(() => filterExamples({ categories: cats, applications: apps }), [cats, apps]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI i Dynamics 365: exempel på nya arbetssätt"
        description="Konkreta exempel på hur Copilot, AI och agenter förändrar arbetet i Business Central, Sales, Customer Service och Finance & Supply Chain."
        canonicalPath="/ai/exempel/"
        breadcrumbs={[{ name: "Start", url: "/" }, { name: "AI i Dynamics 365", url: "/aioversikt/" }, { name: "Exempel", url: "/ai/exempel/" }]}
      />
      <Navbar />
      <main className="pt-24">
        <section className="container mx-auto max-w-5xl px-4 py-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Ett nytt sätt att arbeta med Dynamics&nbsp;365</p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">Sluta leta. Börja fråga.</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            AI förändrar hur du kan arbeta med Dynamics&nbsp;365. I stället för att först veta var informationen finns, vilken vy du behöver
            eller vilken funktion du ska använda kan du i allt fler situationer börja med själva uppgiften.
          </p>
          <div className="mt-8">
            <BeforeAfterWorkflow
              traditional={["Navigera", "Söka", "Filtrera", "Sammanställa", "Agera"]}
              ai={["Fråga", "Förstå", "Analysera", "Skapa", "Agera", "Automatisera"]}
            />
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 pb-16" aria-labelledby="vad-vill-du">
          <h2 id="vad-vill-du" className="text-2xl font-bold text-foreground">Vad vill du få gjort?</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={cats.includes(c.key)}
                onClick={() => setCats((l) => toggle(l, c.key))}
                className={`rounded-xl border p-4 text-left transition ${
                  cats.includes(c.key) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="block font-semibold text-foreground">{c.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{c.text}</span>
              </button>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Applikation</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {AI_APPLICATIONS.map((a) => (
              <button key={a.key} type="button" aria-pressed={apps.includes(a.key)} onClick={() => setApps((l) => toggle(l, a.key))} className={chip(apps.includes(a.key))}>
                <span className="whitespace-nowrap">{a.label}</span>
              </button>
            ))}
            {(cats.length > 0 || apps.length > 0) && (
              <button type="button" onClick={() => { setCats([]); setApps([]); }} className="px-3 py-1.5 text-sm text-muted-foreground underline">
                Rensa filter
              </button>
            )}
          </div>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">{results.length} exempel</p>
          {results.length ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((e) => <AiExampleCard key={e.id} example={e} />)}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-border bg-card p-6">
              <p className="font-semibold text-foreground">Vi kan hjälpa er vidare</p>
              <p className="mt-1 text-sm text-muted-foreground">Inga exempel matchar ännu den kombinationen. Prova ett annat filter eller utforska AI i Dynamics&nbsp;365.</p>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Exemplen beskriver användningsfall för att visa arbetssättet. Funktioner i Microsofts AI-tjänster förändras snabbt och skiljer sig mellan licenser och versioner.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Link to="/aioversikt/" className="rounded-xl border border-border bg-card p-6 hover:border-primary/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Så fungerar tekniken</p>
              <p className="mt-2 inline-flex items-center gap-1 font-semibold text-primary">Utforska AI i Dynamics&nbsp;365 <ArrowRight className="h-4 w-4" /></p>
            </Link>
            <Link to="/kom-igang/" className="rounded-xl border border-border bg-card p-6 hover:border-primary/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nästa steg</p>
              <p className="mt-2 inline-flex items-center gap-1 font-semibold text-primary">Hitta rätt lösning <ArrowRight className="h-4 w-4" /></p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AiExempel;
