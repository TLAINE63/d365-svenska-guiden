import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileDown, MessageSquare, RotateCcw, Users } from "lucide-react";
import { toast } from "sonner";
import { generateCrmResultPdf } from "@/utils/generateCrmResultPdf";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  getCrmMatchningstestConfig,
  type Answers,
  type ProductConfig,
} from "@/data/crmMatchningstestConfigs";
import {
  calculateCrmScore,
  topCrmProfiles,
  type CrmScoreResult,
} from "@/lib/crmMatchingScoring";
import { usePartners } from "@/hooks/usePartners";
import {
  recommendCrmPartners,
  CRM_TEST_TO_PARTNER_SLUG,
} from "@/lib/crmMatchingPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import PartnerCard from "@/components/PartnerCard";
import { trackFunnelEvent, trackFunnelEventOnce } from "@/lib/funnelTracking";
import SendUnderlagToPartners from "@/components/SendUnderlagToPartners";
import type { ProductKey } from "@/hooks/usePartnerFilters";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

interface Props {
  productKey: ProductConfig["key"];
}

const formatScore = (v: number | "not_applicable") =>
  v === "not_applicable" ? "Ej aktuellt" : `${v}%`;

const LEVEL_BADGE: Record<CrmScoreResult["level"], string> = {
  strong: "Stark matchning",
  partial: "Delvis matchning",
  oversized: "Sannolikt överdimensionerat",
};

const LEVEL_COLOR: Record<CrmScoreResult["level"], string> = {
  strong: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  partial: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  oversized: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
};

const CrmMatchningstestResultat = ({ productKey }: Props) => {
  const config = getCrmMatchningstestConfig(productKey);
  const navigate = useNavigate();
  const STORAGE_KEY = config.storageKey;

  const [answers] = useState<Answers>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const answeredCount = config.questions.filter((q) => answers[q.id] !== undefined).length;
  const complete = answeredCount === config.questions.length;

  const score: CrmScoreResult | null = useMemo(
    () => (complete ? calculateCrmScore(answers, config) : null),
    [answers, complete, config],
  );

  // Persist anonym result (once)
  useEffect(() => {
    if (!score || submitted) return;
    setSubmitted(true);
    const top = topCrmProfiles(score, 1)[0];
    trackFunnelEventOnce(
      `crm_test_result_view:${productKey}`,
      "crm_test_result_view",
      {
        product_key: productKey,
        assessment_type: config.assessmentType,
        level: score.level,
        total_score: score.total,
        top_profile: top?.key,
        top_profile_score: top?.score,
      },
    );
    void supabase.from("assessments").insert([
      {
        contact_name: "anonymous",
        contact_email: "anonymous@d365.se",
        company: "anonymous",
        consent: false,
        background: {},
        responses: answers,
        dimension_scores: score as unknown as never,
        meta: { assessment_type: `${config.assessmentType}_result_page`, version: 1 },
      },
    ]);
  }, [score, submitted, answers, config, productKey]);

  const restart = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    navigate(config.canonicalPath);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const [downloading, setDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    if (!score) return;
    try {
      setDownloading(true);
      const top3 = recommendations.slice(0, 3);
      const origin = typeof window !== "undefined" ? window.location.origin : "https://d365.se";
      const extras = top3.length > 0 ? {
        suggestedPartners: top3.map((r) => ({
          name: r.partner.name,
          slug: r.partner.slug,
          positioning: (r.partner as any).positioning_statement || r.partner.description || "",
        })),
        suggestedCompareUrl: origin + buildCompareUrl(top3.map((r) => r.partner.slug)),
      } : undefined;
      await generateCrmResultPdf(score, config, extras);
    } catch (err) {
      console.error("PDF generation failed", err);
      toast.error("Kunde inte skapa PDF. Försök igen.");
    } finally {
      setDownloading(false);
    }
  };

  const level = score ? config.levelCopy[score.level] : null;
  const tops = score ? topCrmProfiles(score, 3) : [];

  // Partnerrekommendationer baserat på testresultatet
  const { data: allPartners = [] } = usePartners();
  const recommendations = useMemo(
    () => (score ? recommendCrmPartners(allPartners, config, score, 3) : []),
    [allPartners, config, score],
  );
  usePartnerImpressions("partner_match_impression", recommendations.map((r) => r.partner), { surface: "crm-matchningstest-resultat" });
  const partnerSlug = CRM_TEST_TO_PARTNER_SLUG[config.key];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={`Ditt resultat – ${config.productName} matchningstest | d365.se`}
        description={`Din personliga matchningsprofil, motivering och nästa steg för ${config.productName}.`}
        canonicalPath={`${config.canonicalPath}/resultat`}
        keywords={config.keywords}
        ogImage={config.ogImage}
        noIndex
      />
      <Navbar />

      <main className="flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-24 sm:pt-28 pb-8 sm:pb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              Resultat · {config.eyebrow}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-tight text-white mt-3 mb-3">
              {complete ? "Din matchningsprofil" : "Vi hittade inget färdigt resultat"}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl leading-relaxed">
              {complete
                ? `Baserat på dina svar visar vi hur ${config.productName} matchar dina behov, kort motivering och konkreta nästa steg.`
                : `Du behöver först fylla i matchningstestet för ${config.productName} för att kunna se ett resultat.`}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8 sm:py-12">
          {!complete || !score || !level ? (
            <EmptyState config={config} />
          ) : (
            <div className="space-y-8">
              {/* Sammanfattning */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${LEVEL_COLOR[score.level]}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {LEVEL_BADGE[score.level]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Sammanvägd matchningsgrad:{" "}
                      <span className="font-semibold text-foreground">{score.total}/100</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    {level.headline}
                  </h2>
                  <p className="text-foreground/85 leading-relaxed">{level.body}</p>
                </CardContent>
              </Card>

              {/* Profil per behovsområde */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Profil per behovsområde
                  </h3>
                  <div className="space-y-4">
                    {score.perProfile.map((p) => (
                      <div key={p.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{p.label}</span>
                          <span
                            className={`text-sm ${
                              p.score === "not_applicable"
                                ? "text-muted-foreground italic"
                                : "text-foreground font-semibold"
                            }`}
                          >
                            {formatScore(p.score)}
                          </span>
                        </div>
                        {p.score === "not_applicable" ? (
                          <div className="h-2 rounded bg-secondary" />
                        ) : (
                          <Progress value={p.score} className="h-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Kort motivering / topp-profiler */}
              {tops.length > 0 && (
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Kort motivering – här matchar du starkast
                    </h3>
                    <ul className="space-y-3">
                      {tops.map((t) => {
                        const p = config.profiles.find((x) => x.key === t.key);
                        if (!p) return null;
                        return (
                          <li key={t.key} className="flex gap-3">
                            <span className="mt-1 w-2 h-2 rounded bg-primary shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">{p.strongCopy}</p>
                              <p className="text-sm text-muted-foreground mt-1">{p.partnerHint}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Rekommenderade partners baserat på profil */}
              {score.level !== "oversized" && recommendations.length > 0 && (
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Rekommenderade partners för din profil
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ett urval baserat på din matchningsprofil för {config.productName}.
                          Filtrera på bransch, geografi och storlek i partnerlistan för att
                          skräddarsy jämförelsen ytterligare.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.length >= 2 && (
                          <Button
                            asChild
                            size="sm"
                            className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white"
                          >
                            <Link
                              to={`/jamfor-partners?${recommendations
                                .slice(0, 3)
                                .map((r, i) => `${["a", "b", "c"][i]}=${encodeURIComponent(r.partner.slug)}`)
                                .join("&")}`}
                            >
                              Jämför dessa {Math.min(recommendations.length, 3)} sida vid sida
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <Link to={config.partnerFilterPath}>
                            Se alla {config.productName}-partners
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendations.map(({ partner, reasons }) => (
                        <div key={partner.id} className="flex flex-col gap-2">
                          <PartnerCard
                            partner={partner}
                            profileUrl={`/partner/${partner.slug}/${partnerSlug}`}
                            productKey={
                              config.key === "customer-service" ||
                              config.key === "field-service" ||
                              config.key === "contact-center"
                                ? "service"
                                : "sales"
                            }
                            highlightedProduct={config.productName}
                          />
                          {reasons.length > 0 && (
                            <ul className="text-xs text-muted-foreground space-y-1 px-1">
                              {reasons.map((r, i) => (
                                <li key={i} className="flex gap-1.5">
                                  <span className="text-primary">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Alternativ vid overdimensionerat */}
              {score.level === "oversized" && config.oversizedAlternative && (
                <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/10">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {config.oversizedAlternative.heading}
                    </h3>
                    <p className="text-foreground/85 leading-relaxed mb-4">
                      {config.oversizedAlternative.body}
                    </p>
                    <Button asChild variant="outline">
                      <Link to={config.oversizedAlternative.ctaTo}>
                        {config.oversizedAlternative.ctaLabel}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Nästa steg */}
              <Card className="border-primary/30 bg-primary/[0.03]">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Dina nästa steg</h3>
                  <NextStepsList config={config} level={score.level} />
                </CardContent>
              </Card>

              {/* Skicka underlaget till 2–5 matchande partners */}
              <SendUnderlagToPartners
                sourcePage={`${config.canonicalPath}/resultat`}
                assessmentType={`crm_matching_${config.key}`}
                products={[
                  (config.key === "customer-service" ||
                  config.key === "field-service" ||
                  config.key === "contact-center"
                    ? "service"
                    : "sales") as ProductKey,
                ]}
                underlagSummary={`Behovsanalys – ${config.productName}\n\n${level.headline} (matchningsgrad ${score.total}/100)\n\n${level.body}\n\nStarkaste behovsområden: ${tops
                  .map((t) => t.key)
                  .join(", ") || "—"}`}
                resultUrl={typeof window !== "undefined" ? window.location.href : undefined}
              />


              {/* Vidare läsning */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Vidare läsning</h3>
                  <ul className="space-y-2">
                    {config.furtherReading.map((r) => (
                      <li key={r.to}>
                        <Link to={r.to} className="text-primary hover:underline">
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3 pt-2 print:hidden">
                <Button variant="ghost" asChild>
                  <Link to={config.canonicalPath}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Justera svaren
                  </Link>
                </Button>
                <Button variant="outline" onClick={restart}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Börja om
                </Button>
                <Button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
                >
                  <FileDown className="w-4 h-4 mr-1" />
                  {downloading ? "Skapar PDF…" : "Ladda ner PDF"}
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-1" />
                  Skriv ut
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const EmptyState = ({ config }: { config: ProductConfig }) => (
  <Card>
    <CardContent className="p-6 sm:p-8 space-y-4">
      <p className="text-foreground/85">
        Vi hittar inga sparade svar för matchningstestet för {config.productName}. Gör testet först
        – det tar cirka 10 minuter – så visar vi din matchningsprofil, motivering och nästa steg
        här.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]">
          <Link to={config.canonicalPath}>
            Starta matchningstestet
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={config.productPagePath}>Läs om {config.productName}</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface NextStep {
  icon: typeof Users;
  title: string;
  body: string;
  cta: { label: string; to: string; primary?: boolean };
}

const NextStepsList = ({
  config,
  level,
}: {
  config: ProductConfig;
  level: CrmScoreResult["level"];
}) => {
  const steps: NextStep[] = [];

  if (level === "strong") {
    steps.push({
      icon: Users,
      title: "Jämför partners för " + config.productName,
      body: "Du har en tydlig matchning. Nästa steg är att jämföra 2–3 Microsoft-partners sida vid sida med rätt bransch- och storleksprofil.",
      cta: { label: `Jämför ${config.productName}-partners`, to: config.partnerFilterPath, primary: true },
    });
    steps.push({
      icon: MessageSquare,
      title: "Bygg en kravspecifikation",
      body: "Använd vår kravspecifikationsgenerator för att skapa ett neutralt underlag att skicka till utvalda partners.",
      cta: { label: "Skapa en kravspecifikation", to: config.needsAnalysisPath },
    });
  } else if (level === "partial") {
    steps.push({
      icon: MessageSquare,
      title: "Fördjupa behovsanalysen",
      body: "Din profil är blandad. Gör en fördjupad behovsanalys så att du utvärderar rätt saker och inte betalar för funktioner du inte behöver.",
      cta: { label: "Fördjupa behovsanalysen", to: config.needsAnalysisPath, primary: true },
    });
    steps.push({
      icon: Users,
      title: "Prata med 2 partners – och 1 alternativ",
      body: "Jämför ett par Microsoft-partners parallellt med minst ett enklare alternativ (t.ex. HubSpot eller Zendesk) för att pressa både pris och funktion.",
      cta: { label: `Jämför ${config.productName}-partners`, to: config.partnerFilterPath },
    });
  } else {
    steps.push({
      icon: MessageSquare,
      title: "Utvärdera enklare alternativ först",
      body:
        config.oversizedAlternative?.body ??
        "Din profil pekar mot att ett enklare verktyg räcker. Utvärdera det innan du går vidare med Dynamics 365.",
      cta: {
        label: config.oversizedAlternative?.ctaLabel ?? `Läs om ${config.productName}`,
        to: config.oversizedAlternative?.ctaTo ?? config.productPagePath,
        primary: true,
      },
    });
    steps.push({
      icon: Users,
      title: "Behöver du en second opinion?",
      body: "Vill du ändå ha en oberoende genomgång av valet, kontakta oss så guidar vi utan agenda.",
      cta: { label: "Kontakta oss", to: "/kontakt" },
    });
  }

  return (
    <ol className="space-y-4">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <li key={i} className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-primary" />
                <p className="font-medium text-foreground">{s.title}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{s.body}</p>
              <Button
                asChild
                size="sm"
                variant={s.cta.primary ? "default" : "outline"}
                className={
                  s.cta.primary
                    ? "bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
                    : ""
                }
              >
                <Link to={s.cta.to}>
                  {s.cta.label}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default CrmMatchningstestResultat;
