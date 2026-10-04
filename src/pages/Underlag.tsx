import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ClipboardCopy, Printer, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useShortlist } from "@/contexts/ShortlistContext";
import UnderlagQuestionnaire from "@/components/underlag/UnderlagQuestionnaire";
import SendUnderlagForm from "@/components/underlag/SendUnderlagForm";
import { hasAnyAnswer, useBuyerProfile, type BuyerProfile } from "@/lib/buyerProfile";
import { answerLabel, questionsFor, UNDERLAG_QUESTIONS, type UQuestion } from "@/data/underlagQuestions";
import {
  BC_TEST_URL, CRM_APP_LABEL, deriveCompareFilters, filtersToSearch, FSCM_LEVEL_TEXT, questionsToTakeForward,
  type FscmLevel, type SectionStatus,
} from "@/lib/underlag";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";
import PlanSummary from "@/components/PlanSummary";
import { clearD365Plan, isPlanArea, updatePlan, usePlanMeta } from "@/lib/d365Plan";
import { FitModelKey } from "@/data/fitModels";
import FitModel from "@/components/FitModel";

const ids = (list: string[]) => UNDERLAG_QUESTIONS.filter((q) => list.includes(q.id));
const PARTS: { key: string; title: string; questions: UQuestion[] }[] = [
  { key: "verksamhet", title: "Verksamhet", questions: ids(["industry", "employees", "revenue", "legal_entities", "countries", "multi_currency", "apps"]) },
  { key: "situation", title: "Nuvarande situation", questions: ids(["erp", "crm_system", "contact_system", "contract_ends"]) },
  {
    key: "behov", title: "Behov",
    questions: ids(["production", "wms", "mrp", "intercompany", "localization", "sellers", "channels", "field_service", "marketing", "copilot", "cc_voice", "cc_multichannel", "cc_ai", "cc_sla", "cc_pbx", "integrations", "power_platform", "timeline", "budget"]),
  },
];

const BUDGET_LABEL: Record<string, string> = { lt1: "under 1 Mkr", "1-3": "1–3 Mkr", "3-10": "3–10 Mkr", "10+": "över 10 Mkr" };

function partStatus(p: BuyerProfile, qs: UQuestion[]) {
  const vis = questionsFor(p, qs);
  const answered = vis.filter((q) => p[q.section]?.[q.key] !== undefined);
  const missing = vis.filter((q) => p[q.section]?.[q.key] === undefined);
  const status: SectionStatus = answered.length === 0 ? "Saknas" : missing.length === 0 ? "Genomförd" : "Påbörjad";
  return { vis, answered, missing, status };
}

function buildText(p: BuyerProfile, savedNames: string[]): string {
  const lines: string[] = ["Ert Dynamics 365-underlag (d365.se)", ""];
  for (const part of PARTS) {
    const { answered } = partStatus(p, part.questions);
    if (!answered.length) continue;
    lines.push(part.title.toUpperCase());
    for (const q of answered) lines.push(`- ${q.text} ${answerLabel(q, p[q.section][q.key])}`);
    lines.push("");
  }
  const lvl = p.assessment?.fscm_level as FscmLevel | undefined;
  const crm = (p.assessment?.crm_apps as string[]) || [];
  if (lvl || crm.length) {
    lines.push("BEDÖMNING");
    if (lvl) lines.push(`- Finance & Supply Chain Management: ${FSCM_LEVEL_TEXT[lvl].replace(/\u00A0/g, " ")}`);
    if (crm.length) lines.push(`- CRM-applikationer som verkar relevanta att utvärdera vidare: ${crm.map((c) => CRM_APP_LABEL[c].replace(/\u00A0/g, " ")).join(", ")}`);
    lines.push("");
  }
  const budget = p.project?.budget as string | undefined;
  lines.push("KOSTNADSBILD");
  lines.push(budget && BUDGET_LABEL[budget] ? `- Egen budgetram: ${BUDGET_LABEL[budget]}. Licens- och projektkostnad bör kontrolleras med partner.` : "- Licens- och projektkostnad bör kontrolleras med partner.");
  lines.push("");
  if (savedNames.length) lines.push("SPARADE PARTNERS", ...savedNames.map((n) => `- ${n}`), "");
  const qs = questionsToTakeForward(p);
  if (qs.length) lines.push("FRÅGOR ATT TA VIDARE", ...qs.map((q) => `- ${q.replace(/\u00A0/g, " ")}`));
  return lines.join("\n");
}

const statusCls: Record<SectionStatus, string> = {
  Genomförd: "bg-accent/15 text-accent",
  Påbörjad: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Saknas: "bg-muted text-muted-foreground",
};

export default function Underlag() {
  const [params] = useSearchParams();
  const meta = usePlanMeta();
  const profile = useBuyerProfile();
  const { items } = useShortlist();
  const { toast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const any = hasAnyAnswer(profile);
  const area = params.get("area");
  useEffect(() => { if (isPlanArea(area)) updatePlan({ area }); }, [area]);
  const edit = () => {
    setShowEdit(true);
    window.setTimeout(() => document.getElementById("komplettera")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  useEffect(() => {
    trackUnderlagEvent("underlag_viewed");
  }, []);

  const filters = useMemo(() => deriveCompareFilters(profile), [profile]);
  const lvl = profile.assessment?.fscm_level as FscmLevel | undefined;
  const crmApps = (profile.assessment?.crm_apps as string[]) || [];
  const budget = profile.project?.budget as string | undefined;
  const takeForward = questionsToTakeForward(profile);
  const text = useMemo(() => {
    const priorities = Object.entries(meta.dimensions).map(([key, priority]) => `- ${key.slice(key.indexOf(":") + 1)}: ${priority === "important" ? "Prioriterat behov" : "Behöver utredas"}`);
    return [buildText(profile, items.map((i) => i.name)), ...(meta.needs.length ? ["", "ANGIVNA MÅL", ...meta.needs.map((n) => `- ${n}`)] : []), ...(priorities.length ? ["", "EGNA PRIORITERINGAR (INTE EN PRODUKTBEDÖMNING)", ...priorities] : [])].join("\n");
  }, [profile, items, meta]);
  const compared = profile.assessment?.compared === true;
  const apps = (profile.scope?.apps as string[]) || [];
  const hasPackage = !!profile.company?.industry && apps.length > 0 && (!!lvl || crmApps.length > 0);

  const parts = PARTS.map((pt) => ({ ...pt, ...partStatus(profile, pt.questions) }));
  const assessmentStatus: SectionStatus = lvl && crmApps.length ? "Genomförd" : lvl || crmApps.length ? "Påbörjad" : "Saknas";
  const partnerStatus: SectionStatus = items.length && compared ? "Genomförd" : items.length ? "Påbörjad" : "Saknas";

  const nextStep = !lvl && !crmApps.length
    ? { label: "Gör ett kort bedömningstest", to: apps.some((a) => a === "finance" || a === "scm") || !apps.length ? "/finance-supply-chain-management/matchningstest" : "/crm/matchningstest" }
    : !items.length
      ? { label: "Se partners förifyllda från ert underlag", to: `/valjdynamics365partner/?${filtersToSearch(filters)}` }
      : !compared
        ? { label: "Jämför era sparade partners sida vid sida", to: "/shortlist/" }
        : hasPackage
          ? { label: "Skicka ert underlag och få hjälp att ta det vidare", to: "#skicka" }
          : { label: "Komplettera underlaget så kan ni skicka det", to: "#komplettera" };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Underlaget är kopierat" });
      trackUnderlagEvent("decision_package_exported", { format: "copy" });
    } catch {
      toast({ title: "Kunde inte kopiera", variant: "destructive" });
    }
  };
  const print = () => {
    trackUnderlagEvent("decision_package_exported", { format: "print" });
    window.print();
  };
  const clear = () => {
    if (window.confirm("Vill ni rensa planens svar och prioriteringar? Era sparade partners finns kvar.")) clearD365Plan();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Ert Dynamics 365-underlag | d365.se" description="Samla era svar, bedömningar och sparade partners i ett anonymt beslutsunderlag för Dynamics 365." canonicalPath="/underlag/" noIndex />
      <div className="print:hidden"><Navbar /></div>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 max-w-4xl pt-24 sm:pt-28 pb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2 print:hidden">Anonymt, ingen inloggning</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 [hyphens:manual]">
            Min D365-plan
          </h1>

          <PlanSummary onEdit={edit} />

          {!any && <section id="komplettera" className="scroll-mt-32 mb-6">
            <h2 className="mb-3 text-xl font-semibold">Utgå från er verksamhet</h2>
            <UnderlagQuestionnaire questions={showEdit ? UNDERLAG_QUESTIONS : PARTS[0].questions.slice(0, 3)} />
          </section>}
          {!any && (meta.area === "erp" || meta.area === "crm") && <FitModel model={meta.area as FitModelKey} heading="Vilka behov avgör ert val?" />}

          {!any ? (
            <div className="space-y-6">
              <p className="text-muted-foreground max-w-2xl">Ert underlag växer fram när ni besvarar frågor och markerar prioriteringar. Ett enklare system, en annan leverantör eller fortsatt utredning kan vara rätt nästa steg. En vald prioritering är inte en produktrekommendation.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={copy}><ClipboardCopy className="w-4 h-4 mr-1" />Kopiera</Button>
                <Button variant="outline" size="sm" onClick={print}><Printer className="w-4 h-4 mr-1" />Skriv ut/PDF</Button>
                <Button variant="ghost" size="sm" onClick={clear}><Trash2 className="w-4 h-4 mr-1" />Rensa</Button>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {[...parts.map((p) => ({ t: p.title, s: p.status, m: p.missing.length })), { t: "Bedömning", s: assessmentStatus, m: 0 }, { t: "Partnerutvärdering", s: partnerStatus, m: 0 }].map((r) => (
                  <li key={r.t} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <span>{r.t}{r.m > 0 && <span className="text-muted-foreground"> · {r.m} uppgifter saknas</span>}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusCls[r.s]}`}>{r.s}</span>
                  </li>
                ))}
              </ul>

              {parts.filter((p) => p.answered.length).map((p) => (
                <section key={p.key}>
                  <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                  <dl className="divide-y divide-border rounded-lg border border-border text-sm">
                    {p.answered.map((q) => (
                      <div key={q.id} className="grid gap-1 px-3 py-2 sm:grid-cols-2">
                        <dt className="text-muted-foreground">{q.text}</dt>
                        <dd className="text-foreground break-words">{answerLabel(q, profile[q.section][q.key])}</dd>
                      </div>
                    ))}
                  </dl>
                  {p.missing.length > 0 && <p className="text-xs text-muted-foreground mt-1">Saknas: {p.missing.map((q) => q.text.replace(/\?$/, "")).join(" · ")}</p>}
                </section>
              ))}

              {(lvl || crmApps.length > 0) && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Bedömning</h2>
                  <ul className="space-y-2 text-sm">
                    {lvl && (
                      <li className="rounded-lg border border-border p-3">
                        <span className="font-medium">Finance &amp; Supply&nbsp;Chain&nbsp;Management:</span> {FSCM_LEVEL_TEXT[lvl]}.
                        {lvl === "below" && (
                          <> <a href={BC_TEST_URL} className="text-primary underline" target="_blank" rel="noopener">Utvärdera Business Central på businesscentral.se</a></>
                        )}
                      </li>
                    )}
                    {crmApps.length > 0 && (
                      <li className="rounded-lg border border-border p-3">
                        <span className="font-medium">CRM-applikationer som verkar relevanta att utvärdera vidare:</span> {crmApps.map((c) => CRM_APP_LABEL[c]).join(", ")}.
                      </li>
                    )}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="text-xl font-semibold mb-2">Kostnadsbild</h2>
                <p className="text-sm">
                  {budget && BUDGET_LABEL[budget] ? <>Er egen budgetram: {BUDGET_LABEL[budget]}. </> : null}
                  Licens- och projektkostnad bör kontrolleras med partner.
                </p>
              </section>

              {items.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Partnerutvärdering</h2>
                  <ul className="text-sm space-y-1">
                    {items.map((i) => <li key={i.slug}><Link to={i.url} className="text-primary hover:underline">{i.name}</Link></li>)}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-1">{compared ? "Partnerna har jämförts sida vid sida." : "Partnerna har inte jämförts ännu."}</p>
                </section>
              )}

              {takeForward.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Frågor att ta vidare</h2>
                  <ul className="list-disc pl-5 text-sm space-y-1">{takeForward.map((q) => <li key={q}>{q}</li>)}</ul>
                </section>
              )}

              {(lvl || crmApps.length > 0 || items.length > 0) && <section className="border-y border-border py-4 print:hidden">
                <h2 className="text-xl font-semibold mb-2">Nästa steg</h2>
                {nextStep.to.startsWith("#") ? (
                  <a href={nextStep.to} className="inline-flex items-center text-primary font-medium">{nextStep.label}<ArrowRight className="w-4 h-4 ml-1" /></a>
                ) : (
                  <Link to={nextStep.to} className="inline-flex items-center text-primary font-medium">{nextStep.label}<ArrowRight className="w-4 h-4 ml-1" /></Link>
                )}
                <div className="mt-3">
                  <Link to={`/valjdynamics365partner/?${filtersToSearch(filters)}`} className="text-sm text-muted-foreground underline">Se partners förifyllda från underlaget</Link>
                </div>
              </section>}

              <section id="komplettera" className="scroll-mt-32 print:hidden">
                <Button variant="outline" size="sm" onClick={() => setShowEdit((v) => !v)}>{showEdit ? "Dölj frågorna" : "Komplettera underlaget"}</Button>
                {showEdit && <div className="mt-4"><UnderlagQuestionnaire questions={UNDERLAG_QUESTIONS} /></div>}
              </section>

              {hasPackage && (
                <section id="skicka" className="print:hidden">
                  <h2 className="text-xl font-semibold mb-2">Skicka ert <span className="whitespace-nowrap">Dynamics 365</span>-underlag</h2>
                  <p className="text-sm text-muted-foreground mb-3">Ni får hela underlaget på e-post. Det skickas inte vidare till någon partner utan ert godkännande.</p>
                  <SendUnderlagForm text={text} profile={profile} />
                </section>
              )}
            </div>
          )}
        </section>
        {any && (meta.area === "erp" || meta.area === "crm" || meta.area === "partner") && <FitModel model={meta.area} heading="Vilka behov avgör ert val?" />}
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
