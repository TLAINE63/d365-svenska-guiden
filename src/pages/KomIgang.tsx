import { useShortlist } from "@/contexts/ShortlistContext";
import { useInquiry } from "@/contexts/InquiryContext";
import { track as trackEvent } from "@/lib/track";
import { useEffect, useRef, useState, useMemo } from "react";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { getBuyerContext, updateBuyerContext, clearBuyerContext } from "@/lib/buyerContext";
import { savePlanSolution, updatePlan } from "@/lib/d365Plan";
import { saveProfile } from "@/lib/buyerProfile";
import {
  AREA_OPTIONS,
  STAGE_OPTIONS,
  EXISTING_FOCUS_OPTIONS,
  KNOWN_PRODUCTS,
  FOCUS_QUESTIONS,
  PRODUCT_FOCUS_QUESTIONS,
  SCOPE_QUESTIONS,
  ERP_SCOPE_GROUPS,
  PROJECT_FOLLOWUP,
  CHANGE_QUESTION,
  aiOptionsFor,
  deriveSize,
  buildSolutionResult,
  type FinderAnswers,
  type SolutionResult,
} from "@/lib/solutionFinder";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { WebPageSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, FileText, RotateCcw, Sparkles } from "lucide-react";
import { allIndustries } from "@/data/partners";
import { getSizeMatchBonus } from "@/hooks/usePartnerFilters";
import PartnerCardSummary from "@/components/partner/PartnerCardSummary";

// Product icons
import bcIcon from "@/assets/icons/BusinessCentral-new.webp";
import financeIcon from "@/assets/icons/Finance.svg";
import { applicationFilterLabel } from "@/lib/applicationLabels";
import salesIcon from "@/assets/icons/Sales.svg";
import marketingIcon from "@/assets/icons/Marketing.svg";
import csIcon from "@/assets/icons/CustomerService.svg";
import fsIcon from "@/assets/icons/FieldService.svg";
import ccIcon from "@/assets/icons/ContactCenter.svg";
import poIcon from "@/assets/icons/ProjectOperations.svg";
import commerceIcon from "@/assets/icons/Commerce.svg";
import hrIcon from "@/assets/icons/HumanResources.svg";

// Industry images
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import modeSportTextilImg from "@/assets/industries/mode-sport-textil.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelLifeScienceImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukSkogsbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaSjukvardImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

const industryImages: Record<string, string> = {
  "Tillverkningsindustri": tillverkningImg,
  "Livsmedel & Processindustri": livsmedelsImg,
  "Grossist & Distribution": handelDistributionImg,
  "Retail & E-handel": detaljhandelImg,
  "Mode, Sport & Textil": modeSportTextilImg,
  "Konsulttjänster": konsultforetagImg,
  "Bygg, Entreprenad & Installation": byggEntreprenadImg,
  "Fastighet & Förvaltning": fastigheterImg,
  "Energi & Utilities": energiImg,
  "Finans & Försäkring": finansForsakringImg,
  "Life Science / Medtech": lakemedelLifeScienceImg,
  "Telekom & IT-tjänster": itTechImg,
  "Transport & Logistik": transportLogistikImg,
  "Media & Publishing": mediaPublishingImg,
  "Jordbruk & Skogsbruk": jordbrukSkogsbrukImg,
  "Hälsa- & sjukvård": halsaSjukvardImg,
  "Non-profit / Organisationer": medlemsorganisationerImg,
  "Medlemsorganisationer": medlemsorganisationerImg,
  "Utbildning": utbildningImg,
  "Offentlig sektor": offentligSektorImg,
  "Uthyrningsverksamhet": uthyrningImg,
};

import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import WhyTheseResults from "@/components/WhyTheseResults";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";
import PartnerDecisionActions from "@/components/partner/PartnerDecisionActions";

const normalizeIndustryParam = (raw: string | null): string => {
  if (!raw) return "";
  const v = raw.trim().toLowerCase();
  const exact = STANDARD_INDUSTRIES.find((i) => i.name.toLowerCase() === v || i.slug === v);
  if (exact) return exact.name;
  const fuzzy = STANDARD_INDUSTRIES.find((i) => {
    const s = i.short.toLowerCase();
    return v.includes(s) || v.includes(i.name.toLowerCase().split(/[ ,&/]/)[0]);
  });
  return fuzzy ? fuzzy.name : "";
};
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

// Produktikoner för resultatkortet
const productOptions = [
  { value: "Business Central", label: "Business Central", icon: bcIcon },
  { value: "Finance & SCM", label: "Finance & Supply Chain Management (F&O)", icon: financeIcon },
  { value: "Sales", label: "Sales", icon: salesIcon },
  { value: "Customer Insights (Marketing)", label: "Customer Insights (Marketing Automation)", icon: marketingIcon },
  { value: "Customer Service", label: "Customer Service", icon: csIcon },
  { value: "Field Service", label: "Field Service", icon: fsIcon },
  { value: "Contact Center", label: "Contact Center", icon: ccIcon },
  { value: "Project Operations", label: "Project Operations", icon: poIcon },
  { value: "Commerce", label: "Commerce", icon: commerceIcon },
  { value: "Human Resources", label: "Human Resources", icon: hrIcon },
];

// Spår baserat på vald produkt – styr kravspec- och fördjupningslänkar i resultatet
type Track = "erp" | "sales" | "marketing" | "service" | "projects" | "commerce" | "hr" | "general";

const getTrack = (app: string): Track => {
  if (app === "Business Central" || app === "Finance & SCM") return "erp";
  if (app === "Sales") return "sales";
  if (app === "Customer Insights (Marketing)") return "marketing";
  if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return "service";
  if (app === "Project Operations") return "projects";
  if (app === "Commerce") return "commerce";
  if (app === "Human Resources") return "hr";
  return "general";
};

const specByTrack: Partial<Record<Track, { path: string; label: string }>> = {
  erp: { path: "/kravspecifikation/", label: "Skapa kravspec för ERP" },
  sales: { path: "/kravspecifikation-sales/", label: "Skapa kravspec för Försäljning" },
  marketing: { path: "/kravspecifikation-marketing/", label: "Skapa kravspec för Marketing" },
  service: { path: "/kravspecifikation-kundservice/", label: "Skapa kravspec för Kundservice" },
};

type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

const getProductKey = (app: string): ProductKey | null => {
  if (app === "Business Central") return 'bc';
  if (app === "Finance & SCM") return 'fsc';
  if (["Commerce", "Human Resources"].includes(app)) return 'fsc';
  if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
  if (["Customer Service", "Field Service", "Contact Center", "Project Operations"].includes(app)) return 'service';
  return null;
};

const matchesDbProductFilter = (
  partner: DatabasePartner,
  productKey: ProductKey,
  industry?: string,
): boolean => {
  const productFilter = partner.product_filters?.[productKey];
  if (!productFilter) return false;
  if (industry && !productFilter.industries?.includes(industry)) return false;
  return true;
};

interface AiMatchResult {
  id: string;
  score: number;
  matchReason: string;
  bullets?: string[];
}

const sizeOptions: { value: string; label: string; desc: string }[] = [
  { value: "1-49", label: "1–49 anställda", desc: "Mindre bolag" },
  { value: "50-99", label: "50–99 anställda", desc: "SMB" },
  { value: "100-249", label: "100–249 anställda", desc: "Medelstora bolag" },
  { value: "250-999", label: "250–999 anställda", desc: "Större bolag" },
  { value: "1.000-4.999", label: "1 000–4 999 anställda", desc: "Stort företag / koncern" },
  { value: ">5.000", label: "Fler än 5 000 anställda", desc: "Global koncern" },
];

type StepId =
  | "area" | "stage" | "existingFocus" | "product" | "productFocus"
  | "scope" | "focus" | "projectFollowup" | "ai" | "change" | "industry";

const STEP_META: Record<StepId, { label: string; sub?: string }> = {
  area: { label: "Vad vill ni framför allt förbättra?", sub: "Välj det område som är mest aktuellt – ni behöver inte kunna produktnamnen" },
  stage: { label: "Hur långt har ni kommit?", sub: "Svaret styr vilka frågor som kommer härnäst" },
  existingFocus: { label: "Vad vill ni utveckla eller komplettera?", sub: "Välj alla som stämmer" },
  product: { label: "Vilken Dynamics\u00A0365-produkt gäller det?", sub: "Vi hoppar över produktidentifieringen och fokuserar på vad ni behöver tänka på" },
  productFocus: { label: "Vad behöver ni tänka på kring lösningen?", sub: "Välj alla som är aktuella" },
  scope: { label: "", sub: "Bara det som kan påverka vägledningen" },
  focus: { label: "", sub: "Välj alla som stämmer – ni behöver inte kunna produktnamnen" },
  projectFollowup: { label: PROJECT_FOLLOWUP.text, sub: "Svaret avgör om Project Operations är värt att undersöka" },
  ai: { label: "Var ser ni störst potential för AI och automation?", sub: "AI är ett tvärgående behov, inte en separat produkt" },
  change: { label: CHANGE_QUESTION.text, sub: "Hjälper oss peka ut vad ni bör beakta i nästa fas" },
  industry: { label: "Vilken bransch är ni verksamma inom?", sub: "Branschen styr vilka partners som är relevanta" },
};

const KomIgang = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: partners = [] } = usePartners();

  const storedContext = getBuyerContext();
  const initialIndustry = normalizeIndustryParam(searchParams.get("industry") || storedContext.industry || null);
  const requestedProduct = searchParams.get("product");
  const source = searchParams.get("source") || "direct";
  const requestedSize = searchParams.get("size") || storedContext.size || null;

  const [answers, setAnswers] = useState<FinderAnswers>(() => ({
    industry: initialIndustry || undefined,
    size: requestedSize && sizeOptions.some((o) => o.value === requestedSize) ? requestedSize : undefined,
    knownProduct: KNOWN_PRODUCTS.some((p) => p.value === requestedProduct) ? requestedProduct : undefined,
  }));
  const [productShortcut, setProductShortcut] = useState(() => KNOWN_PRODUCTS.some((p) => p.value === requestedProduct));
  const productShortcutRef = useRef(productShortcut);
  productShortcutRef.current = productShortcut;
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<SolutionResult | null>(null);
  // Bransch ställs bara om den inte redan är känd (URL-param eller sparad kontext).
  // Steget får inte försvinna när det besvaras – då hoppar listan.
  const [hasPrefilledIndustry] = useState(!!initialIndustry);

  // Dynamisk steglista – triage med 5–7 frågor, anpassade efter tidigare svar
  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ["area", "stage"];
    let branch = false;
    if (answers.stage === "existing") {
      s.push("existingFocus", "change");
      branch = true;
    } else if (answers.stage === "know_product" || productShortcut) {
      s.push("product");
      if (answers.knownProduct) s.push("productFocus");
      s.push("change");
      branch = true;
    } else if (answers.area) {
      if (answers.area !== "unsure") s.push("scope");
      s.push("focus");
      // Extra följdfråga bara när den kan ändra vägledningen
      if (answers.area === "erp" && (answers.focus ?? []).includes("projects")) s.push("projectFollowup");
      s.push("change");
      branch = true;
    }
    if (!hasPrefilledIndustry) s.push("industry");
    // AI/Copilot ställs alltid sist
    if (branch) s.push("ai");
    return s;
  }, [answers.area, answers.stage, answers.knownProduct, answers.focus, hasPrefilledIndustry, productShortcut]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const stepNum = Math.min(stepIdx, steps.length - 1) + 1;

  // Kom ihåg besökarens val under sessionen så resten av sajten kan anpassa sig
  useEffect(() => {
    updateBuyerContext({
      industry: answers.industry || undefined,
      size: answers.size || undefined,
    });
  }, [answers.industry, answers.size]);
  useEffect(() => {
    const industry = STANDARD_INDUSTRIES.find((i) => i.name === answers.industry)?.slug;
    if (industry || answers.size) saveProfile({ company: { ...(industry ? { industry } : {}), ...(answers.size ? { employees: answers.size } : {}) } });
  }, [answers.industry, answers.size]);

  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [matchedPartners, setMatchedPartners] = useState<DatabasePartner[]>([]);
  usePartnerImpressions("partner_match_impression", matchedPartners, { surface: "kom-igang-wizard" });
  const [aiMatches, setAiMatches] = useState<AiMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const currentStep = useRef(1);
  const completed = useRef(false);

  useEffect(() => {
    trackFunnelEvent({
      event_type: "analysis_start",
      event_name: "kom_igang_start",
      metadata: { source, initial_industry: initialIndustry || null, initial_product: requestedProduct },
    });
    return () => {
      trackFunnelEvent({
        event_type: "analysis_step",
        event_name: "kom_igang_exit",
        metadata: { source, step: currentStep.current, completed: completed.current },
      });
    };
  }, []);

  // Ref med senaste tillståndet så att setTimeout(advance) aldrig agerar på gamla svar
  const latest = useRef({ steps, stepIdx, answers });
  latest.current = { steps, stepIdx, answers };

  const advance = () => {
    const { steps: st, stepIdx: si } = latest.current;
    trackFunnelEvent({
      event_type: "analysis_step",
      event_name: "kom_igang_step_complete",
      metadata: { source, step: si + 1, step_id: st[si] },
    });
    if (si >= st.length - 1) {
      completeFlow();
    } else {
      currentStep.current = si + 2;
      setStepIdx(si + 1);
    }
  };

  const completeFlow = () => {
    const raw = latest.current.answers;
    const productBranch = raw.stage === "know_product" || productShortcutRef.current;
    const ans = { ...raw, knownProduct: productBranch ? raw.knownProduct : undefined, size: raw.size ?? deriveSize(raw) };
    const res = buildSolutionResult(ans);
    setResult(res);
    const app = res.primary?.app ?? ans.knownProduct ?? "";
    setSelectedProduct(app || null);
    savePlanSolution({
      areaLabel: res.areaLabel, knownProduct: res.knownProduct, existingCustomer: res.existingCustomer, insufficient: res.insufficient,
      primary: res.primary ? { label: res.primary.label, reason: res.primary.reason } : undefined,
      complements: res.complements.map((c) => ({ label: c.label, reason: c.reason })),
      explore: res.exploreAreas, isvNote: res.isvNote, aiSummary: res.aiSummary, implementationNote: res.implementationNote,
      openQuestions: res.openQuestions, nextSteps: res.nextSteps,
    }, res.needsIdentified);
    // Synka guidens förslag till planens område och lösning (Min D365-plan)
    const ERP_APPS = ["Business Central", "Finance", "Supply Chain", "Finance & Supply Chain", "Project Operations", "Commerce", "Human Resources"];
    const planArea = ans.area === "erp" || ERP_APPS.some((x) => app.includes(x)) ? "erp" : app ? "crm" : undefined;
    if (planArea) updatePlan({ area: planArea });
    if (app) updateBuyerContext({ product: app });
    trackEvent("kom_igang_recommendation", {
      primary: res.primary?.app ?? null,
      complements: res.complements.map((c) => c.app).join(","),
      area: ans.area ?? null,
      stage: ans.stage ?? null,
      insufficient: res.insufficient,
    });
    completed.current = true;
    findPartners(app, ans.industry || "", ans.size || null, res);
  };

  const findPartners = async (
    app: string,
    industry: string,
    size: string | null,
    res: SolutionResult | null,
  ) => {
    const productKey = app ? getProductKey(app) : null;

    let filtered: DatabasePartner[];
    if (!productKey) {
      filtered = partners.filter(p => p.product_filters && Object.keys(p.product_filters).length > 0);
    } else {
      // HÅRDA filter: produkt är ALLTID låst. Om bransch är vald är även den låst.
      filtered = partners.filter(p => matchesDbProductFilter(p, productKey, industry || undefined));
    }

    if (size && productKey) {
      filtered = [...filtered].sort((a, b) => {
        const ba = getSizeMatchBonus(a, productKey, size, null);
        const bb = getSizeMatchBonus(b, productKey, size, null);
        return bb - ba;
      });
    }

    setMatchedPartners(filtered.slice(0, 4));
    setShowResults(true);
    trackFunnelEvent({
      event_type: "analysis_complete",
      event_name: "kom_igang_results",
      metadata: { source, product: app || null, industry: industry || null, result_count: filtered.length },
    });

    if (filtered.length > 0) {
      setIsAiLoading(true);
      try {
        const payload = filtered.slice(0, 8).map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          applications: p.applications || [],
          industries: p.industries || [],
          geography: p.geography || [],
          product_filters: p.product_filters || {},
          partner_size_tier: (p as any).partner_size_tier ?? null,
          partner_size_tier_needs_review: (p as any).partner_size_tier_needs_review === true,
        }));

        const { data, error } = await supabase.functions.invoke('match-partners', {
          body: {
            partners: payload,
            criteria: {
              application: app || "Alla",
              industry,
              companySize: size || "",
              situation: STAGE_OPTIONS.find(o => o.value === latest.current.answers.stage)?.label || "",
              complexity: (res?.needsIdentified ?? []).join(", "),
            },
          },
        });

        if (!error && data?.matches) {
          const matches: AiMatchResult[] = data.matches;
          setAiMatches(matches);
          const scoreMap = new Map(matches.map(m => [m.id, m.score]));
          const sorted = [...filtered].sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
          setMatchedPartners(sorted.slice(0, 4));
        }
      } catch {
        // graceful degradation
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      currentStep.current = steps.length;
      setStepIdx(steps.length - 1);
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    } else if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else {
      navigate(-1);
    }
  };

  const handleRestart = () => {
    clearBuyerContext();
    if (searchParams.size > 0) setSearchParams({}, { replace: true });
    setAnswers({});
    setProductShortcut(false);
    setResult(null);
    setSelectedProduct(null);
    setMatchedPartners([]);
    setAiMatches([]);
    setShowResults(false);
    currentStep.current = 1;
    completed.current = false;
    setStepIdx(0);
    window.scrollTo({ top: 0 });
    trackFunnelEvent({
      event_type: "analysis_step",
      event_name: "kom_igang_restart",
      metadata: { source, step: stepNum },
    });
  };

  const getAiMatch = (id: string) => aiMatches.find(m => m.id === id);

  // Vid varje stegbyte (framåt och bakåt) hamnar nästa fråga högst upp i vyn
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stepIdx]);

  useEffect(() => {
    if (showResults) window.scrollTo({ top: 0, behavior: "auto" });
  }, [showResults]);

  // Närmaste alternativ när kombinationen saknar träffar
  const [rerun, setRerun] = useState(false);
  useEffect(() => {
    if (!rerun) return;
    setRerun(false);
    findPartners(selectedProduct || "", answers.industry || "", answers.size || null, result);
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerun]);
  const selectedApp = selectedProduct || "";
  const track = getTrack(selectedApp);
  const altProductKey = selectedApp ? getProductKey(selectedApp) : null;
  const altWithoutIndustry = altProductKey && answers.industry
    ? partners.filter((p) => matchesDbProductFilter(p, altProductKey)).length : 0;
  const altWithoutProduct = answers.industry && selectedApp
    ? partners.filter((p) => Object.values(p.product_filters || {}).some((f: any) => f?.industries?.includes(answers.industry))).length : 0;

  const kortlista = useShortlist();
  useEffect(() => { trackEvent("tool_start", { tool: "kom-igang" }); }, []);
  const inquiry = useInquiry();
  const suggestedKey = showResults ? matchedPartners.slice(0, 3).map((p) => p.slug).join(",") : "";
  useEffect(() => {
    if (!suggestedKey) return;
    trackEvent("tool_complete", { tool: "kom-igang" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedKey]);

  const sortedIndustries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of allIndustries) {
      counts[ind] = partners.filter(p => p.industries?.includes(ind)).length;
    }
    return [...allIndustries].sort((a, b) => counts[b] - counts[a]);
  }, [partners]);

  const toggleMulti = (key: "focus" | "existingFocus" | "productFocus", value: string) => {
    setAnswers((prev) => {
      const cur = prev[key] ?? [];
      return { ...prev, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });
  };

  // ---------------- Results page ----------------
  if (showResults && result) {
    const recs = [result.primary, ...result.complements].filter(Boolean) as { app: string; label: string; reason: string }[];
    return (
      <div className="min-h-screen bg-background">
        <SEOHead webPageSchema={false} title="Er väg vidare – d365.se" description="Anpassade rekommendationer baserat på er situation och era behov, med förslag på nästa steg." canonicalPath="/kom-igang" noIndex />
        <Navbar />
        <main className="pt-28 sm:pt-32 pb-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Vårt förslag utifrån era svar</h1>
                <p className="text-sm text-muted-foreground">
                  {result.existingCustomer
                    ? "Baserat på var ni befinner er och vad ni vill utveckla"
                    : result.knownProduct
                      ? "Baserat på er valda produkt och era svar"
                      : `Område: ${result.areaLabel} – baserat på era behov, storlek och nuläge`}
                </p>
              </div>

              {/* Rekommenderad lösning */}
              {result.primary && (
                <div className="mb-8 rounded border-2 border-primary/30 bg-card p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    {result.knownProduct ? "Er valda lösning" : "Rekommenderad lösning"}
                  </p>
                  {recs.map((rec, i) => {
                    const icon = productOptions.find((o) => o.value === rec.app)?.icon;
                    const active = selectedApp === rec.app;
                    return (
                      <div key={rec.app} className={`flex items-start gap-3 ${i > 0 ? "mt-4 pt-4 border-t border-border" : ""}`}>
                        {icon && <img src={icon} alt="" className="w-9 h-9 object-contain flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{i === 0 ? (result.knownProduct ? "Vald produkt" : "Huvudförslag") : "Komplement"}</p>
                          <h2 className="text-lg font-bold text-foreground"><span className="whitespace-nowrap">Dynamics&nbsp;365</span> {rec.label}</h2>
                          <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                        </div>
                        {recs.length > 1 && !result.knownProduct && (
                          <Button size="sm" variant={active ? "default" : "outline"} disabled={active}
                            onClick={() => { setSelectedProduct(rec.app); findPartners(rec.app, answers.industry || "", answers.size || null, result); trackEvent("kom_igang_switch_recommendation", { product: rec.app }); }}>
                            {active ? "Visas nedan" : "Visa partners"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mb-6 text-sm text-muted-foreground">
                ✓ Resultatet är sparat i Min D365-plan i den här webbläsaren.{" "}
                <Link to="/underlag/" className="font-medium text-primary underline underline-offset-4" onClick={() => trackEvent("kom_igang_plan_click", {})}>Visa min D365-plan</Link>
              </p>

              {/* Ärlighet när underlaget inte räcker */}
              {result.insufficient && !result.existingCustomer && (
                <div className="mb-8 rounded border-2 border-border bg-card p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-foreground mb-2">Underlaget räcker inte riktigt ännu</h2>
                  <p className="text-sm text-muted-foreground">
                    Era svar pekar åt flera håll, och vi vill inte tvinga fram en produktrekommendation utan stöd.
                    En detaljerad behovsanalys ger ett säkrare underlag – eller ställ en fråga direkt till oss.
                  </p>
                </div>
              )}

              {/* Identifierade behov */}
              {result.needsIdentified.length > 0 && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-3">Behov vi identifierat utifrån era svar</h2>
                  <div className="flex flex-wrap gap-2">
                    {result.needsIdentified.map((n) => (
                      <span key={n} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">{n}</span>
                    ))}
                    {answers.ai && answers.ai !== "no" && (
                      <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">AI och automation</span>
                    )}
                  </div>
                </div>
              )}

              {/* Kompletterande områden att undersöka */}
              {result.exploreAreas.length > 0 && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-1">Områden som kan vara värda att undersöka</h2>
                  <p className="text-xs text-muted-foreground mb-3">Inte säkra rekommendationer – men era svar ger stöd för att titta närmare.</p>
                  <div className="space-y-2">
                    {result.exploreAreas.map((e) => (
                      <Link key={e.label} to={e.path} className="flex items-start gap-3 rounded border border-border p-3 transition hover:border-primary">
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <span className="block text-sm font-semibold text-foreground"><span className="whitespace-nowrap">Dynamics&nbsp;365</span> {e.label}</span>
                          <span className="block text-xs text-muted-foreground">{e.reason}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tillägg och ISV */}
              {result.isvNote && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-1">Tillägg och ISV-lösningar</h2>
                  <p className="text-sm text-muted-foreground">{result.isvNote.text}</p>
                  <Link to={result.isvNote.path} className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-4">
                    Utforska tilläggskatalogen →
                  </Link>
                </div>
              )}

              {/* AI, Copilot och agenter */}
              {result.aiSummary && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-1">AI, Copilot och agenter</h2>
                  <p className="text-sm text-muted-foreground">{result.aiSummary}</p>
                </div>
              )}

              {/* Införande och arbetssätt */}
              {result.implementationNote && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-1">Införande och arbetssätt</h2>
                  <p className="text-sm text-muted-foreground">{result.implementationNote}</p>
                </div>
              )}

              {/* Att undersöka vidare – ärliga osäkerheter */}
              {result.openQuestions.length > 0 && (
                <div className="mb-8 rounded border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-2">Att undersöka vidare</h2>
                  <ul className="space-y-2">
                    {result.openQuestions.map((q) => (
                      <li key={q} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Frågor att ta med vidare */}
              <div className="mb-8 rounded border border-border bg-card p-5">
                <h2 className="text-base font-semibold text-foreground mb-3">Frågor att ta med er vidare</h2>
                <ul className="space-y-2">
                  {result.questionsToAsk.map((q) => (
                    <li key={q} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nästa steg (matchningstest / fördjupning) */}
              {result.nextSteps.length > 0 && (
                <div className="mb-8 rounded border-2 border-primary/20 bg-primary/5 p-5">
                  <h2 className="text-base font-semibold text-foreground mb-3">Relevanta nästa steg</h2>
                  <div className="flex flex-wrap gap-2">
                    {result.nextSteps.map((ns) => (
                      <Button key={ns.path + ns.label} asChild variant="outline" size="sm">
                        <Link to={ns.path} onClick={() => trackEvent("kom_igang_next_step_click", { path: ns.path })}>{ns.label} →</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {!result.existingCustomer && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">
                      {matchedPartners.length > 0 ? `Partners för ${selectedApp ? applicationFilterLabel(selectedApp) : "Dynamics 365"}` : "Ingen exakt träff, men här är närmaste vägar"}
                    </h2>
                    {isAiLoading && (
                      <div className="flex items-center justify-center gap-2 text-sm text-primary mt-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI rangordnar partners...</span>
                      </div>
                    )}
                  </div>

                  {matchedPartners.length > 0 ? (
                    <div className="space-y-4">
                      <WhyTheseResults />
                      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground flex-1 min-w-[12rem]">Föreslagna partneralternativ utifrån era svar. Spara de ni vill undersöka vidare i kortlistan (max tre).</p>
                        {kortlista.items.length > 0 && (
                          <Button asChild variant="outline"><Link to="/kortlista/">Visa kortlistan ({kortlista.items.length})</Link></Button>
                        )}
                      </div>
                      {matchedPartners.map((partner) => {
                        const aiMatch = getAiMatch(partner.id);
                        return (
                          <div key={partner.id} className="relative rounded border-2 p-5 transition-all border-border bg-card">
                            <div className="flex items-start gap-4">
                              {partner.logo_url && (
                                <img
                                  src={optimizedLogo(partner.logo_url)}
                                  alt={partner.name || ""}
                                  className="w-14 h-14 object-contain rounded-lg bg-white border border-border p-1 flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-foreground">{partner.name}</h3>
                                {aiMatch?.matchReason && (
                                  <p className="text-sm text-muted-foreground mt-1">{aiMatch.matchReason}</p>
                                )}
                                {aiMatch?.bullets && aiMatch.bullets.length > 0 ? (
                                  <ul className="mt-2 space-y-1">
                                    {aiMatch.bullets.map((b, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                                <PartnerCardSummary partner={partner} highlightedIndustry={answers.industry || null} highlightedProduct={altProductKey} productLabel={selectedApp ? applicationFilterLabel(selectedApp) : null} />
                              </div>
                            </div>
                            {partner.slug && (
                              <div className="mt-4 space-y-2">
                                <PartnerDecisionActions
                                  partner={{ slug: partner.slug, name: partner.name }}
                                  product={selectedApp}
                                  industry={answers.industry}
                                />
                                <Button size="sm" variant="ghost" asChild className="w-full">
                                  <Link to={`/partner/${partner.slug}`}>{`Läs beslutsunderlaget om ${partner.name}`}</Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded border border-border bg-card p-6 sm:p-8">
                      <p className="text-foreground mb-1 font-semibold">
                        Ingen partner har angett både {selectedApp ? applicationFilterLabel(selectedApp) : "vald produkt"}{answers.industry ? ` och ${answers.industry.toLowerCase()}` : ""}.
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Det betyder inte att ingen kan hjälpa er, bara att ingen profil täcker exakt den kombinationen ännu. Välj hur ni vill gå vidare:
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {altWithoutIndustry > 0 && (
                          <button type="button" onClick={() => { setAnswers((p) => ({ ...p, industry: undefined })); setRerun(true); }}
                            className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                            <span className="block font-semibold text-foreground">Visa {altWithoutIndustry} {altWithoutIndustry === 1 ? "partner" : "partners"} för {selectedApp ? applicationFilterLabel(selectedApp) : ""}</span>
                            <span className="block text-sm text-muted-foreground">Utan krav på branscherfarenhet</span>
                          </button>
                        )}
                        {altWithoutProduct > 0 && (
                          <button type="button" onClick={() => { setSelectedProduct(null); setRerun(true); }}
                            className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                            <span className="block font-semibold text-foreground">Visa {altWithoutProduct} {altWithoutProduct === 1 ? "partner" : "partners"} inom {answers.industry!.toLowerCase()}</span>
                            <span className="block text-sm text-muted-foreground">Med erfarenhet av andra Dynamics&nbsp;365-produkter</span>
                          </button>
                        )}
                        <Link to={`/fraga/?q=${encodeURIComponent(`Vilka partners kan ${selectedApp || "Dynamics 365"}${answers.industry ? ` för ${answers.industry.toLowerCase()}` : ""}?`)}&source=kom-igang-no-results`}
                          className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                          <span className="block font-semibold text-foreground">Fråga d365.se</span>
                          <span className="block text-sm text-muted-foreground">Vi känner partnerna och tipsar om vem som kan hjälpa er</span>
                        </Link>
                        <button type="button" onClick={handleBack}
                          className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                          <span className="block font-semibold text-foreground">Ändra era svar</span>
                          <span className="block text-sm text-muted-foreground">Gå tillbaka och justera urvalet</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Requirements Spec CTA */}
              {!result.existingCustomer && (() => {
                const spec = specByTrack[track];
                if (!spec || matchedPartners.length === 0) return null;
                return (
                  <div className="mt-8 rounded border-2 border-primary/20 bg-primary/5 p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-semibold text-foreground">Vill du skapa en kravspecifikation baserat på dina svar?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Definiera dina krav och få ett strukturerat underlag att skicka till partners.
                    </p>
                    <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      <Link
                        to={(() => {
                          if (spec.path !== "/kravspecifikation/") return spec.path;
                          const sizeMap: Record<string, string> = { "1-49": "26–50", "50-99": "51–100", "100-249": "101–250", "250-999": "500+", "1.000-4.999": "500+", ">5.000": "500+" };
                          const p = new URLSearchParams();
                          if (selectedApp === "Business Central") p.set("produkt", "bc");
                          else if (selectedApp === "Finance & SCM") p.set("produkt", "fsc");
                          if (answers.industry) p.set("bransch", answers.industry);
                          if (answers.size && sizeMap[answers.size]) p.set("storlek", sizeMap[answers.size]);
                          const qs = p.toString();
                          return qs ? `${spec.path}?${qs}` : spec.path;
                        })()}
                        state={{ industry: answers.industry || undefined }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {spec.label}
                      </Link>
                    </Button>
                  </div>
                );
              })()}

              {/* Kostnad: puff till rätt kostnadsavsnitt/ROI-kalkyl för vald produkt */}
              {!result.existingCustomer && (() => {
                const costMap: Record<string, { path: string; label: string }> = {
                  "Business Central": { path: "/businesscentral/roi-kalkylator/", label: "Business Central" },
                  "Finance & SCM": { path: "/finance-supply-chain/roi-kalkylator/", label: "Finance & Supply Chain" },
                  "Commerce": { path: "/finance-supply-chain/roi-kalkylator/", label: "Finance & Supply Chain" },
                  "Human Resources": { path: "/finance-supply-chain/roi-kalkylator/", label: "Finance & Supply Chain" },
                  "Sales": { path: "/d365sales/roi-kalkylator/", label: "Sales" },
                  "Customer Insights (Marketing)": { path: "/d365marketing/roi-kalkylator/", label: "Customer Insights" },
                  "Customer Service": { path: "/d365customerservice/roi-kalkylator/", label: "Customer Service" },
                  "Contact Center": { path: "/d365contactcenter/roi-kalkylator/", label: "Contact Center" },
                  "Field Service": { path: "/d365fieldservice/roi-kalkylator/", label: "Field Service" },
                };
                const cost = costMap[selectedApp] ?? { path: "/kostnad/", label: "Dynamics 365" };
                return (
                  <div className="mt-6 rounded border border-border bg-card p-5 text-center">
                    <h3 className="text-base font-semibold text-foreground mb-1">Vad kostar {cost.label}?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Se prisintervall och räkna på er totalkostnad (TCO) innan ni pratar med partners.
                    </p>
                    <Button asChild variant="outline">
                      <Link to={cost.path} onClick={() => trackEvent("kom_igang_cost_click", { product: selectedApp || "allmant" })}>
                        Se priser och räkna på kostnaden →
                      </Link>
                    </Button>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ändra svar
                </Button>
                <Button variant="ghost" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Börja om
                </Button>
                <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                  <Link to="/kontakt/">Vill du ha hjälp? Kontakta oss</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---------------- Wizard ----------------
  const meta = STEP_META[step];
  const focusQ = answers.area ? FOCUS_QUESTIONS[answers.area] : null;
  const productFocusQ = answers.knownProduct ? PRODUCT_FOCUS_QUESTIONS[answers.knownProduct] : null;
  const scopeQ = answers.area === "erp" ? "Några grundläggande fakta" : answers.area && answers.area !== "unsure" ? SCOPE_QUESTIONS[answers.area as "sales" | "marketing" | "service"].text : null;

  const renderMultiStep = (key: "focus" | "existingFocus" | "productFocus", options: { value: string; label: string }[]) => {
    const selected = answers[key] ?? [];
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleMulti(key, opt.value)}
                className={`w-full text-left px-3 py-2.5 rounded border transition-all flex items-center gap-3 min-h-[52px] ${
                  isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <span className="text-sm sm:text-base font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <Button onClick={advance} disabled={selected.length === 0} size="sm" className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
            {stepIdx >= steps.length - 1 ? "Visa resultat" : "Nästa"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Hitta rätt Dynamics 365-lösning – Kom igång | d365.se"
        description="Berätta var ni befinner er och vad ni behöver hjälp med, så får ni vägledning kring relevanta lösningsområden och nästa steg."
        canonicalPath="/kom-igang"
      />
      <WebPageSchema
        name="Hitta rätt Dynamics 365-lösning"
        description="Berätta var ni befinner er och vad ni behöver hjälp med, så får ni vägledning kring relevanta lösningsområden och nästa steg."
        url="https://d365.se/kom-igang/"
        breadcrumb={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kom igång", url: "https://d365.se/kom-igang/" },
        ]}
      />
      <Navbar />

      <main className="min-h-[100svh] flex flex-col">
        {/* Hero */}
        <section className="relative pt-24 pb-2 sm:pt-28 sm:pb-3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/80" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Hitta rätt väg för era <span className="whitespace-nowrap">Dynamics&nbsp;365</span>-behov
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Berätta om var ni befinner er och om ni behöver affärssystem (ERP) eller CRM (säljstöd, marketing automation, kundservice), så anpassar vi nästa steg.</p>
          </div>
        </section>

        {/* Wizard */}
        <section className="flex-1 py-3 sm:py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">Steg {stepNum}</span>
                <span className="text-sm text-muted-foreground">av {steps.length}</span>
                <div className="flex gap-1.5 ml-3">
                  {steps.map((s, i) => (
                    <div
                      key={s}
                      className={`w-2.5 h-2.5 rounded transition-colors ${
                        i + 1 === stepNum ? "bg-[hsl(var(--cta-orange))]" : i + 1 < stepNum ? "bg-[hsl(var(--cta-orange))]/50" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step heading */}
              <div className="text-center mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {step === "focus" && focusQ ? focusQ.text : step === "productFocus" && productFocusQ ? productFocusQ.text : step === "scope" && scopeQ ? scopeQ : meta.label}
                </h2>
                {meta.sub && (
                  <p className="text-xs sm:text-sm text-muted-foreground">{meta.sub}</p>
                )}
              </div>

              {/* Navigation buttons above content */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  {stepIdx > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Föregående
                    </button>
                  )}
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Börja om
                  </button>
                </div>
              </div>

              <div className="min-h-[280px]">
                {/* Steg 1: Område */}
                {step === "area" && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
                      {AREA_OPTIONS.map((opt) => {
                        const isSelected = answers.area === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => { setAnswers((p) => ({ ...p, area: opt.value, focus: undefined })); setTimeout(advance, 250); }}
                            className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[64px] ${
                              isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                            }`}
                          >
                            <span className="text-sm sm:text-base font-semibold block">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => { setProductShortcut(true); setAnswers((p) => ({ ...p, stage: "know_product" })); setTimeout(() => setStepIdx(2), 50); }}
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                      >
                        Vet ni redan vilken Dynamics&nbsp;365-produkt ni behöver? Välj direkt →
                      </button>
                    </div>
                  </div>
                )}

                {/* Steg 2: Hur långt har ni kommit? */}
                {step === "stage" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl mx-auto">
                    {STAGE_OPTIONS.map((opt) => {
                      const isSelected = answers.stage === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, stage: opt.value })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Befintlig kund: vad vill ni utveckla? */}
                {step === "existingFocus" && renderMultiStep("existingFocus", EXISTING_FOCUS_OPTIONS)}

                {/* Genväg: vald produkt */}
                {step === "product" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
                    {KNOWN_PRODUCTS.map((opt) => {
                      const icon = productOptions.find((o) => o.value === opt.value)?.icon;
                      const isSelected = answers.knownProduct === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, knownProduct: opt.value, productFocus: undefined })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-3 py-2.5 rounded border transition-all flex items-center gap-3 min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          {icon && <img src={icon} alt="" className="w-6 h-6 object-contain flex-shrink-0" />}
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Kännedom om vald produkt */}
                {step === "productFocus" && productFocusQ && renderMultiStep("productFocus", productFocusQ.options)}

                {/* Områdesspecifika behov */}
                {step === "focus" && focusQ && renderMultiStep("focus", focusQ.options)}

                {/* Enkel omfattning – anpassad efter område */}
                {step === "scope" && answers.area && answers.area !== "erp" && answers.area !== "unsure" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl mx-auto">
                    {SCOPE_QUESTIONS[answers.area as "sales" | "marketing" | "service"].options.map((opt) => {
                      const qid = SCOPE_QUESTIONS[answers.area as "sales" | "marketing" | "service"].id;
                      const isSelected = answers.scope?.[qid] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, scope: { ...(p.scope ?? {}), [qid]: opt.value } })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ERP-omfattning: tre korta fakta i samma steg */}
                {step === "scope" && answers.area === "erp" && (
                  <div className="max-w-3xl mx-auto space-y-5">
                    {ERP_SCOPE_GROUPS.map((group) => (
                      <div key={group.key}>
                        <p className="text-sm font-semibold text-foreground mb-2">{group.label}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {group.options.map((opt) => {
                            const isSelected = answers.scope?.[group.key] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setAnswers((p) => ({ ...p, scope: { ...(p.scope ?? {}), [group.key]: opt.value } }))}
                                className={`w-full text-left px-3 py-2.5 rounded border transition-all min-h-[44px] ${
                                  isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                                }`}
                              >
                                <span className="text-sm font-medium">{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-1">
                      <Button
                        onClick={() => { setAnswers((p) => ({ ...p, size: deriveSize(p) })); advance(); }}
                        disabled={!ERP_SCOPE_GROUPS.every((g) => answers.scope?.[g.key])}
                        size="sm"
                        className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
                      >
                        Nästa
                      </Button>
                    </div>
                  </div>
                )}

                {/* Extra följdfråga: projektstyrningens centralitet */}
                {step === "projectFollowup" && (
                  <div className="grid grid-cols-1 gap-2 max-w-2xl mx-auto">
                    {PROJECT_FOLLOWUP.options.map((opt) => {
                      const isSelected = answers.projectCentrality === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, projectCentrality: opt.value })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* AI/Copilot – en fråga, anpassade alternativ per område */}
                {step === "ai" && (
                  <div className="max-w-3xl mx-auto">
                  <div className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">Sista frågan · Nytt ämne: AI och Copilot</p>
                    <p className="mt-1 text-sm text-foreground">Frågan handlar inte längre om ert behovsområde, utan om hur ni ser på AI-stöd som Copilot och AI-agenter.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiOptionsFor(answers).map((opt) => {
                      const isSelected = answers.ai === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, ai: opt.value })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  </div>
                )}

                {/* Införande och arbetssätt */}
                {step === "change" && (
                  <div className="grid grid-cols-1 gap-2 max-w-2xl mx-auto">
                    {CHANGE_QUESTION.options.map((opt) => {
                      const isSelected = answers.change === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setAnswers((p) => ({ ...p, change: opt.value })); setTimeout(advance, 250); }}
                          className={`w-full text-left px-4 py-3 rounded border transition-all min-h-[52px] ${
                            isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Bransch */}
                {step === "industry" && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                    {sortedIndustries.map((ind) => {
                      const isSelected = answers.industry === ind;
                      const img = industryImages[ind];
                      return (
                        <button
                          key={ind}
                          onClick={() => {
                            setAnswers((p) => ({ ...p, industry: ind }));
                            setTimeout(advance, 250);
                          }}
                          className={`relative group rounded overflow-hidden border-2 transition-all aspect-[5/4] lg:aspect-[8/5] ${
                            isSelected
                              ? "border-[hsl(var(--cta-orange))] ring-2 ring-[hsl(var(--cta-orange))]/30 scale-[1.02]"
                              : "border-border hover:border-[hsl(var(--cta-orange))]/40"
                          }`}
                        >
                          {img && (
                            <img
                              src={img}
                              alt={ind}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className={`absolute inset-0 transition-colors ${
                            isSelected ? "bg-[hsl(var(--cta-orange))]/40" : "bg-black/45 group-hover:bg-black/35"
                          }`} />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded bg-[hsl(var(--cta-orange))] flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span className="absolute inset-x-0 bottom-0 px-1 py-1 text-white text-[10px] font-semibold text-center leading-tight">
                            {ind}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default KomIgang;
