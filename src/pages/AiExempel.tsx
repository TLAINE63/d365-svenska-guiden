import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BeforeAfterWorkflow from "@/components/ai-examples/BeforeAfterWorkflow";
import AiExampleCard from "@/components/ai-examples/AiExampleCard";
import { AI_APPLICATIONS, AI_CATEGORIES, AI_ROLES, AI_TYPES, AiApplication, AiCategory, AiRole, AiType, filterExamples } from "@/data/aiExamples";

const ROLE_CARDS: AiRole[] = ["cfo", "ekonom", "saljare", "kundservice", "inkopare", "projektledare", "servicepersonal"];
const FILTER_ROLES: AiRole[] = ["cfo", "ekonom", "saljare", "saljchef", "kundservice", "inkopare", "supplychain", "projektledare", "servicepersonal"];
const FORR = ["Jag måste veta var informationen finns.", "Jag behöver förstå systemets struktur.", "Jag söker, filtrerar och sammanställer.", "Jag utför återkommande moment manuellt."];
const NU = ["Jag börjar med vad jag vill få gjort.", "Jag kan fråga med naturligt språk där funktionen stöder det.", "AI kan hjälpa mig hitta, förstå, analysera eller skapa.", "Agenter kan i vissa processer utföra delar av arbetet."];
const STEPS = [
  ["Hitta", "AI hjälper mig hitta rätt information."],
  ["Förstå", "AI hjälper mig förstå information och funktioner."],
  ["Analysera", "AI hjälper mig bearbeta och sammanställa."],
  ["Skapa", "AI hjälper mig skapa ett första resultat."],
  ["Agera", "AI hjälper till i själva arbetsmomentet."],
  ["Automatisera", "En agent kan hantera definierade delar av processen."],
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"
  }`;

const AiExempel = () => {
  const [cats, setCats] = useState<AiCategory[]>([]);
  const [apps, setApps] = useState<AiApplication[]>([]);
  const [roles, setRoles] = useState<AiRole[]>([]);
  const [types, setTypes] = useState<AiType[]>([]);
  const results = useMemo(() => filterExamples({ categories: cats, applications: apps, roles, aiTypes: types }), [cats, apps, roles, types]);
  const anyFilter = cats.length + apps.length + roles.length + types.length > 0;
  const goToExamples = () => document.getElementById("vad-vill-du")?.scrollIntoView({ behavior: "smooth", block: "start" });

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

        <section className="container mx-auto max-w-5xl px-4 pb-12" aria-labelledby="forr-nu">
          <h2 id="forr-nu" className="text-2xl font-bold text-foreground">Förr och nu</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Förr</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">{FORR.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-accent/40 bg-accent/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Nu</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">{NU.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
          <button type="button" onClick={goToExamples} className="mt-5 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Se konkreta exempel <ArrowRight className="h-4 w-4" />
          </button>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Från att hitta till att automatisera</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground"><span className="mr-2 text-accent">{i + 1}.</span>{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Vad betyder det nya arbetssättet för dig?</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ROLE_CARDS.map((r) => (
              <button key={r} type="button" aria-pressed={roles.includes(r)}
                onClick={() => { setRoles(roles.length === 1 && roles[0] === r ? [] : [r]); goToExamples(); }}
                className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${roles.includes(r) ? "border-primary bg-primary/5 ring-1 ring-primary text-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}>
                {r === "cfo" ? "Ekonomichef" : AI_ROLES[r]}
              </button>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-5xl scroll-mt-24 px-4 pb-16" aria-labelledby="vad-vill-du">
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
          </div>

          <details className="mt-6 rounded-xl border border-border bg-card p-4" open={roles.length + types.length > 0}>
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Fler filter: roll och AI-typ{roles.length + types.length > 0 ? ` (${roles.length + types.length})` : ""}</summary>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Roll</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTER_ROLES.map((r) => (
                <button key={r} type="button" aria-pressed={roles.includes(r)} onClick={() => setRoles((l) => toggle(l, r))} className={chip(roles.includes(r))}>{AI_ROLES[r]}</button>
              ))}
            </div>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI-typ</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(AI_TYPES) as AiType[]).map((t) => (
                <button key={t} type="button" aria-pressed={types.includes(t)} title={AI_TYPES[t].text} onClick={() => setTypes((l) => toggle(l, t))} className={chip(types.includes(t))}>{AI_TYPES[t].label}</button>
              ))}
            </div>
          </details>
          {anyFilter && (
            <button type="button" onClick={() => { setCats([]); setApps([]); setRoles([]); setTypes([]); }} className="mt-3 px-1 py-1.5 text-sm text-muted-foreground underline">
              Rensa alla filter
            </button>
          )}

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
