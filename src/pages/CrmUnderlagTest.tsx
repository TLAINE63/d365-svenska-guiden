import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UnderlagQuestionnaire from "@/components/underlag/UnderlagQuestionnaire";
import { CRM_TEST_QUESTIONS } from "@/data/underlagQuestions";
import { addScopeApps, setAnswer, useBuyerProfile } from "@/lib/buyerProfile";
import { CRM_APP_LABEL, deriveCompareFilters, filtersToSearch, relevantCrmApps } from "@/lib/underlag";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";

/** Kort CRM-test: visar vilka CRM-applikationer som verkar relevanta, utan rangordning. */
export default function CrmUnderlagTest() {
  const profile = useBuyerProfile();
  const total = CRM_TEST_QUESTIONS.length;
  const answered = CRM_TEST_QUESTIONS.filter((q) => profile[q.section]?.[q.key] !== undefined).length;
  const done = answered === total;
  const apps = useMemo(() => relevantCrmApps(profile), [profile]);

  useEffect(() => {
    trackUnderlagEvent("test_started", { track: "crm" });
  }, []);

  useEffect(() => {
    if (!done) return;
    const prev = JSON.stringify(profile.assessment?.crm_apps || []);
    if (prev !== JSON.stringify(apps)) {
      setAnswer("assessment", "crm_apps", apps.length ? apps : null);
      if (apps.length) addScopeApps(apps);
      trackUnderlagEvent("test_completed", { track: "crm", apps });
    }
  }, [done, apps, profile.assessment?.crm_apps]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="CRM-test för Dynamics 365 | d365.se"
        description="Ett kort test som visar vilka Dynamics 365 CRM-applikationer, inklusive Contact Center, som verkar relevanta att utvärdera vidare."
        canonicalPath="/crm/matchningstest/"
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "CRM", url: "/crm/" }, { name: "CRM-test", url: "/crm/matchningstest/" }]}
      />
      <Navbar />
      <main className="flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl pt-24 sm:pt-28 pb-8">
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-tight text-primary-foreground [hyphens:manual]">
              Vilka <span className="whitespace-nowrap">Dynamics 365</span> CRM-applikationer verkar relevanta?
            </h1>
            <p className="text-primary-foreground/75 mt-3 max-w-3xl">
              {total} korta frågor om sälj, kundservice, fältservice, marknad och kontaktfunktion. Svaren sparas anonymt i ert underlag.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8">
          <div className="mb-4 text-xs text-muted-foreground flex justify-between">
            <span>{answered} av {total} besvarade</span>
          </div>
          <Progress value={(answered / total) * 100} className="h-2 mb-6" aria-label="Framsteg" />
          <UnderlagQuestionnaire questions={CRM_TEST_QUESTIONS} />

          {done && (
            <div className="mt-8 rounded-lg border border-border bg-card p-5 space-y-3">
              <h2 className="text-xl font-semibold">Resultat</h2>
              {apps.length ? (
                <>
                  <p className="text-sm">Utifrån era svar verkar följande vara relevant att utvärdera vidare:</p>
                  <ul className="list-disc pl-5 text-sm">{apps.map((a) => <li key={a}>{CRM_APP_LABEL[a]}</li>)}</ul>
                  {!apps.includes("contact_center") && <p className="text-xs text-muted-foreground">Dynamics&nbsp;365 Contact&nbsp;Center kräver vidare analys utifrån era svar om volymer och röst.</p>}
                </>
              ) : (
                <p className="text-sm">Era svar pekar inte tydligt på någon CRM-applikation. Det kräver vidare analys.</p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild><Link to="/underlag/">Se ert underlag<ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
                <Button asChild variant="outline"><Link to={`/valjdynamics365partner/?${filtersToSearch(deriveCompareFilters(profile))}`}>Se partners förifyllda från underlaget</Link></Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
