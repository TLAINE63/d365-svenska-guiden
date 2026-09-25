import { useEffect, useRef, useState, useMemo } from "react";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { getBuyerContext, updateBuyerContext, clearBuyerContext } from "@/lib/buyerContext";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { WebPageSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, HelpCircle, FileText, Users, RotateCcw } from "lucide-react";
import { allIndustries } from "@/data/partners";
import { getSizeMatchBonus } from "@/hooks/usePartnerFilters";
import PartnerCardSummary from "@/components/partner/PartnerCardSummary";

// Product icons
import bcIcon from "@/assets/icons/BusinessCentral-new.webp";
import financeIcon from "@/assets/icons/Finance.svg";
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
import PartnerRequestDialog from "@/components/PartnerRequestDialog";

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

// Step 2: Product options
const productOptions = [
  { value: "Business Central", label: "Business Central", desc: "ERP för mindre och medelstora företag", icon: bcIcon },
  { value: "Finance & SCM", label: "Finance & Supply Chain", desc: "ERP för större organisationer", icon: financeIcon },
  { value: "Sales", label: "Sales", desc: "CRM för försäljning och pipeline", icon: salesIcon },
  { value: "Customer Insights (Marketing)", label: "Customer Insights (Marketing Automation)", desc: "Marketing automation och kunddata", icon: marketingIcon },
  { value: "Customer Service", label: "Customer Service", desc: "Ärendehantering och support", icon: csIcon },
  { value: "Field Service", label: "Field Service", desc: "Fältservice och arbetsorder", icon: fsIcon },
  { value: "Contact Center", label: "Contact Center", desc: "Omnikanal-kontaktcenter", icon: ccIcon },
  { value: "Project Operations", label: "Project Operations", desc: "Projekthantering och resursplanering", icon: poIcon },
  { value: "Commerce", label: "Commerce", desc: "Omnichannel-handel och e-handel", icon: commerceIcon },
  { value: "Human Resources", label: "Human Resources", desc: "HR, personal och lönehantering", icon: hrIcon },
  { value: "", label: "Vet inte ännu", desc: "Vi hjälper dig hitta rätt", icon: null },
];

// Spår baserat på vald produkt – steg 3 och 5 anpassas efter spåret
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

type Opt = { value: string; label: string; desc?: string };

// Step 3: Goal options per spår
const goalOptionsByTrack: Record<Track, Opt[]> = {
  erp: [
    { value: "erp-new", label: "Byta från ett äldre affärssystem" },
    { value: "erp-first", label: "Införa vårt första riktiga affärssystem" },
    { value: "erp-finance", label: "Snabbare bokslut och bättre ekonomistyrning" },
    { value: "erp-supply", label: "Bättre kontroll på lager, inköp och logistik" },
    { value: "erp-production", label: "Planera och styra produktion" },
    { value: "erp-reporting", label: "Bättre rapportering och beslutsunderlag" },
    { value: "erp-upgrade", label: "Uppgradera eller flytta till molnet" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  sales: [
    { value: "sales-pipeline", label: "Få överblick över pipeline och prognoser" },
    { value: "sales-leads", label: "Bättre hantering av leads och affärsmöjligheter" },
    { value: "sales-quotes", label: "Snabbare offerter och avtal" },
    { value: "sales-kam", label: "Stödja key account-arbete och kundrelationer" },
    { value: "sales-copilot", label: "Använda AI och Copilot i säljarbetet" },
    { value: "sales-replace", label: "Byta från Excel eller annat CRM" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  marketing: [
    { value: "mkt-journeys", label: "Automatisera kundresor och kampanjer" },
    { value: "mkt-data", label: "Samla kunddata på ett ställe" },
    { value: "mkt-leads", label: "Fler och bättre kvalificerade leads till sälj" },
    { value: "mkt-segment", label: "Bättre segmentering och personalisering" },
    { value: "mkt-replace", label: "Byta från nuvarande marketingverktyg" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  service: [
    { value: "svc-cases", label: "Effektivisera ärendehantering och support" },
    { value: "svc-omni", label: "Samla kanaler (telefon, chatt, e-post)" },
    { value: "svc-field", label: "Planera tekniker och arbetsorder i fält" },
    { value: "svc-selfservice", label: "Självservice och kundportal" },
    { value: "svc-copilot", label: "Använda AI och Copilot i kundservice" },
    { value: "svc-sla", label: "Bättre uppföljning av SLA och kundnöjdhet" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  projects: [
    { value: "prj-resources", label: "Bättre resursplanering och beläggning" },
    { value: "prj-time", label: "Enklare tidrapportering och debitering" },
    { value: "prj-profit", label: "Följa lönsamhet per projekt" },
    { value: "prj-sales", label: "Koppla ihop försäljning och leverans" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  commerce: [
    { value: "com-omni", label: "Samla butik, e-handel och lager" },
    { value: "com-pos", label: "Nytt kassasystem i butik" },
    { value: "com-b2b", label: "B2B-handel och kundportal" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  hr: [
    { value: "hr-core", label: "Samla personaldata och HR-processer" },
    { value: "hr-selfservice", label: "Självservice för chefer och medarbetare" },
    { value: "hr-comp", label: "Förmåner, ersättning och kompetens" },
    { value: "unsure", label: "Osäker, lite av varje behöver förbättras" },
  ],
  general: [
    { value: "erp", label: "Införa eller byta affärssystem (ERP)" },
    { value: "sales", label: "Förbättra försäljningsprocessen" },
    { value: "marketing", label: "Införa marketing automation" },
    { value: "service", label: "Effektivisera kundservice" },
    { value: "contact-center", label: "Utvärdera Contact Center-lösningar" },
    { value: "field-service", label: "Förbättra fältservice" },
    { value: "unsure", label: "Jag är osäker – Lite av varje behöver förbättras" },
  ],
};

const allGoalOptions: Opt[] = Object.values(goalOptionsByTrack).flat();

// Step 4: Situation options
const situationOptions = [
  { value: "new", label: "Utvärderar nytt system" },
  { value: "evaluate-partners", label: "Vill utvärdera partners" },
  { value: "improve", label: "Vill vidareutveckla befintlig lösning" },
  { value: "unsure", label: "Osäker" },
];

// Step 5: Verksamhet options per spår
const unsureComplexity: Opt = { value: "unsure", label: "Osäker, behöver vägledning", desc: "Vi hjälper er välja rätt nivå" };
const complexityOptionsByTrack: Record<Track, Opt[]> = {
  erp: [
    { value: "standard", label: "Relativt standardiserad verksamhet", desc: "Enklare processer inom ekonomi, order och lager" },
    { value: "growing", label: "Växande bolag med ökande krav", desc: "Behöver bättre struktur, kontroll och uppföljning" },
    { value: "multi-entity", label: "Flera bolag eller länder", desc: "Koncern, flera juridiska enheter eller valutor" },
    { value: "manufacturing", label: "Tillverkning", desc: "Produktion, planering och materialstyrning" },
    { value: "logistics", label: "Avancerad lager och logistik", desc: "Flera lager, WMS eller komplexa flöden" },
    { value: "integrations", label: "Höga krav på integrationer", desc: "E-handel, EDI, bank eller andra system" },
    { value: "projects-erp", label: "Projekt och tidrapportering", desc: "Projektredovisning och debitering" },
    unsureComplexity,
  ],
  sales: [
    { value: "small-team", label: "Litet säljteam", desc: "Upp till cirka 10 säljare" },
    { value: "large-team", label: "Flera säljteam eller regioner", desc: "Behov av roller, territorier och uppföljning" },
    { value: "complex-deals", label: "Långa och komplexa affärer", desc: "Flera beslutsfattare, offerter och avtal" },
    { value: "partner-sales", label: "Försäljning via återförsäljare", desc: "Partner- eller kanalförsäljning" },
    { value: "erp-integration", label: "Behöver kopplas till affärssystemet", desc: "Kunder, artiklar, priser och order" },
    { value: "marketing-link", label: "Nära samarbete med marknad", desc: "Leads och kampanjer ska hänga ihop" },
    unsureComplexity,
  ],
  marketing: [
    { value: "b2b", label: "B2B-marknadsföring", desc: "Lead-generering och säljöverlämning" },
    { value: "b2c", label: "B2C med många kunder", desc: "Stora volymer och personalisering" },
    { value: "many-sources", label: "Kunddata i många system", desc: "Behöver en samlad kundbild" },
    { value: "events", label: "Event och webbinarier", desc: "Anmälningar och uppföljning" },
    { value: "gdpr", label: "Höga krav på samtycke och GDPR", desc: "Preferenser och spårbarhet" },
    unsureComplexity,
  ],
  service: [
    { value: "b2b-support", label: "B2B-support med avtal och SLA", desc: "Serviceavtal och prioriteringar" },
    { value: "high-volume", label: "Stora ärendevolymer", desc: "Många kontakter per dag och flera kanaler" },
    { value: "field-teams", label: "Tekniker ute hos kund", desc: "Schemaläggning, arbetsorder och mobil app" },
    { value: "assets", label: "Service på installerad utrustning", desc: "Anläggningsregister och förebyggande underhåll" },
    { value: "phone", label: "Telefoni och kontaktcenter", desc: "Köer, routing och inspelning" },
    { value: "erp-integration", label: "Behöver kopplas till affärssystemet", desc: "Artiklar, reservdelar och fakturering" },
    unsureComplexity,
  ],
  projects: [
    { value: "consulting", label: "Konsultverksamhet", desc: "Uppdrag, resurser och timdebitering" },
    { value: "fixed-price", label: "Fastprisprojekt", desc: "Milstolpar och intäktsavräkning" },
    { value: "many-resources", label: "Många konsulter och roller", desc: "Kompetensbaserad bemanning" },
    { value: "multi-entity", label: "Flera bolag eller länder", desc: "Koncerngemensam resursplanering" },
    unsureComplexity,
  ],
  commerce: [
    { value: "many-stores", label: "Många butiker", desc: "Kedja med central styrning" },
    { value: "online-first", label: "E-handel i fokus", desc: "Webbutik som huvudkanal" },
    { value: "b2b-b2c", label: "Både B2B och B2C", desc: "Olika prislistor och flöden" },
    unsureComplexity,
  ],
  hr: [
    { value: "many-employees", label: "Många medarbetare", desc: "Behov av tydliga processer och roller" },
    { value: "multi-country", label: "Flera länder", desc: "Olika regler och organisationer" },
    { value: "payroll-link", label: "Koppling till lönesystem", desc: "Integration med svensk lön" },
    unsureComplexity,
  ],
  general: [
    { value: "standard", label: "Relativt standardiserad verksamhet", desc: "Enklare processer inom ekonomi, order och lager" },
    { value: "growing", label: "Växande bolag med ökande krav", desc: "Behöver bättre struktur, kontroll och uppföljning" },
    { value: "multi-entity", label: "Flera bolag eller verksamheter", desc: "Koncern, flera juridiska enheter eller länder" },
    { value: "manufacturing", label: "Tillverkning eller avancerad logistik", desc: "Produktion, planering eller komplexa flöden" },
    { value: "integrations", label: "Höga krav på integrationer", desc: "Många system som behöver hänga ihop" },
    { value: "consulting", label: "Konsultverksamhet", desc: "Projektbaserad verksamhet med resurs- och uppdragshantering" },
    { value: "customer-service", label: "Kundservice och ärendehantering", desc: "Support, SLA:er och ärendeflöden" },
    { value: "sales-crm", label: "Försäljning och CRM", desc: "Pipeline, offerter och kundhantering" },
    unsureComplexity,
  ],
};

const allComplexityOptions: Opt[] = Object.values(complexityOptionsByTrack).flat();

const trackStepLabels: Record<Track, { goal: string; complexity: string }> = {
  erp: { goal: "Vad vill ni uppnå med affärssystemet?", complexity: "Hur ser er verksamhet ut?" },
  sales: { goal: "Vad vill ni förbättra i säljarbetet?", complexity: "Hur ser er försäljning ut?" },
  marketing: { goal: "Vad vill ni uppnå med marknadsföringen?", complexity: "Hur ser er marknadsföring ut?" },
  service: { goal: "Vad vill ni förbättra i er service?", complexity: "Hur ser er serviceverksamhet ut?" },
  projects: { goal: "Vad vill ni förbättra i projektverksamheten?", complexity: "Hur ser er projektverksamhet ut?" },
  commerce: { goal: "Vad vill ni förbättra i handeln?", complexity: "Hur ser er handel ut?" },
  hr: { goal: "Vad vill ni förbättra inom HR?", complexity: "Hur ser er organisation ut?" },
  general: { goal: "Vad vill du förbättra?", complexity: "Hur ser er verksamhet ut?" },
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

const TOTAL_STEPS = 6;

// Step 6: Company size – short, friendly labels mapped to the canonical buckets
const sizeOptions: { value: string; label: string; desc: string }[] = [
  { value: "1-49", label: "1–49 anställda", desc: "Mindre bolag" },
  { value: "50-99", label: "50–99 anställda", desc: "SMB" },
  { value: "100-249", label: "100–249 anställda", desc: "Medelstora bolag" },
  { value: "250-999", label: "250–999 anställda", desc: "Större bolag" },
  { value: "1.000-4.999", label: "1 000–4 999 anställda", desc: "Stort företag / koncern" },
  { value: ">5.000", label: "Fler än 5 000 anställda", desc: "Global koncern" },
];

const KomIgang = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: partners = [] } = usePartners();

  const storedContext = getBuyerContext();
  const initialIndustry = normalizeIndustryParam(searchParams.get("industry"));
  const requestedProduct = searchParams.get("product");
  const requestedGoal = searchParams.get("goal");
  const source = searchParams.get("source") || "direct";
  const initialProduct = productOptions.some((option) => option.value === requestedProduct) ? requestedProduct : null;
  const initialStep = initialIndustry ? (initialProduct ? 3 : 2) : 1;

  const [step, setStep] = useState(initialStep);
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(initialProduct);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(requestedGoal && allGoalOptions.some((option) => option.value === requestedGoal) ? [requestedGoal] : []);
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [selectedComplexities, setSelectedComplexities] = useState<string[]>([]);
  const requestedSize = searchParams.get("size") || storedContext.size || null;
  const [selectedSize, setSelectedSize] = useState<string | null>(
    requestedSize && sizeOptions.some((o) => o.value === requestedSize) ? requestedSize : null,
  );

  // Kom ihåg besökarens val under sessionen så resten av sajten kan anpassa sig
  useEffect(() => {
    updateBuyerContext({
      industry: selectedIndustry || undefined,
      product: selectedProduct || undefined,
      size: selectedSize || undefined,
    });
  }, [selectedIndustry, selectedProduct, selectedSize]);
  const [showResults, setShowResults] = useState(false);
  const [matchedPartners, setMatchedPartners] = useState<DatabasePartner[]>([]);
  usePartnerImpressions("partner_match_impression", matchedPartners, { surface: "kom-igang-wizard" });
  const [aiMatches, setAiMatches] = useState<AiMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [introPartner, setIntroPartner] = useState<DatabasePartner | null>(null);
  const currentStep = useRef(initialStep);
  const completed = useRef(false);

  useEffect(() => {
    trackFunnelEvent({
      event_type: "analysis_start",
      event_name: "kom_igang_start",
      metadata: { source, initial_industry: initialIndustry || null, initial_product: initialProduct },
    });
    return () => {
      trackFunnelEvent({
        event_type: "analysis_step",
        event_name: "kom_igang_exit",
        metadata: { source, step: currentStep.current, completed: completed.current },
      });
    };
  }, []);

  const advanceTo = (nextStep: number) => {
    trackFunnelEvent({
      event_type: "analysis_step",
      event_name: "kom_igang_step_complete",
      metadata: { source, step, next_step: nextStep },
    });
    currentStep.current = nextStep;
    setStep(nextStep);
  };

  const sortedIndustries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of allIndustries) {
      counts[ind] = partners.filter(p => p.industries?.includes(ind)).length;
    }
    return [...allIndustries].sort((a, b) => counts[b] - counts[a]);
  }, [partners]);

  const selectedApp = selectedProduct || "";
  const track = getTrack(selectedApp);
  const goalOptions = goalOptionsByTrack[track];
  const complexityOptions = complexityOptionsByTrack[track];

  // Rensa val som inte hör till det nya spåret när produkten byts
  useEffect(() => {
    setSelectedGoals((prev) => prev.filter((g) => goalOptions.some((o) => o.value === g)));
    setSelectedComplexities((prev) => prev.filter((c) => complexityOptions.some((o) => o.value === c)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  const stepLabels = [
    "Vilken bransch är du verksam inom?",
    "Vilken Dynamics\u00A0365-produkt är du intresserad av?",
    trackStepLabels[track].goal,
    "Var befinner du dig idag?",
    trackStepLabels[track].complexity,
    "Hur stor är er organisation?",
  ];

  const stepSubtexts = [
    "Vi använder detta för att hitta relevanta partners",
    "Välj den produkt som passar bäst eller hoppa över om du inte vet",
    "",
    "",
    "Detta hjälper oss avgöra vilken nivå av lösning och partner som passar",
    "Vi prioriterar partners med erfarenhet av organisationer i din storlek – hoppa över om du är osäker",
  ];

  const findPartners = async () => {
    const productKey = selectedApp ? getProductKey(selectedApp) : null;

    let result: DatabasePartner[];
    if (!productKey) {
      // "Osäker" - return all partners with any product filter
      result = partners.filter(p => p.product_filters && Object.keys(p.product_filters).length > 0);
    } else {
      // HÅRDA filter: produkt är ALLTID låst. Om bransch är vald är även den låst.
      // Vi relaxar ALDRIG dessa – partners utan profilering för vald produkt/bransch
      // får aldrig visas i matchningen.
      result = partners.filter(p =>
        matchesDbProductFilter(p, productKey, selectedIndustry || undefined)
      );
    }

    // Apply soft size bonus locally so partners matching the chosen size float up
    // even before AI rerank. Falls back to neutral when no size selected.
    const applyLocalSizeBonus = (list: DatabasePartner[]) => {
      if (!selectedSize || !productKey) return list;
      return [...list].sort((a, b) => {
        const ba = getSizeMatchBonus(a, productKey, selectedSize, null);
        const bb = getSizeMatchBonus(b, productKey, selectedSize, null);
        return bb - ba;
      });
    };

    result = applyLocalSizeBonus(result);

    // Limit to max 4
    setMatchedPartners(result.slice(0, 4));
    setShowResults(true);
    completed.current = true;
    trackFunnelEvent({
      event_type: "analysis_complete",
      event_name: "kom_igang_results",
      metadata: { source, product: selectedApp || null, industry: selectedIndustry || null, result_count: result.length },
    });

    if (result.length > 0) {
      setIsAiLoading(true);
      try {
        const payload = result.slice(0, 8).map(p => ({
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
              application: selectedApp || "Alla",
              industry: selectedIndustry,
              companySize: selectedSize || "",
              situation: selectedSituations.map(s => situationOptions.find(o => o.value === s)?.label).filter(Boolean).join(", ") || "",
              complexity: [
                ...selectedGoals.map(g => allGoalOptions.find(o => o.value === g)?.label),
                ...selectedComplexities.map(c => allComplexityOptions.find(o => o.value === c)?.label),
              ].filter(Boolean).join(", ") || "",
            },
          },
        });

        if (!error && data?.matches) {
          const matches: AiMatchResult[] = data.matches;
          setAiMatches(matches);
          const scoreMap = new Map(matches.map(m => [m.id, m.score]));
          const sorted = [...result].sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
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
      setStep(TOTAL_STEPS);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleRestart = () => {
    clearBuyerContext();
    if (searchParams.size > 0) setSearchParams({}, { replace: true });
    setSelectedIndustry(null);
    setSelectedProduct(null);
    setSelectedGoals([]);
    setSelectedSituations([]);
    setSelectedComplexities([]);
    setSelectedSize(null);
    setMatchedPartners([]);
    setAiMatches([]);
    setShowResults(false);
    currentStep.current = 1;
    completed.current = false;
    setStep(1);
    window.scrollTo({ top: 0 });
    trackFunnelEvent({
      event_type: "analysis_step",
      event_name: "kom_igang_restart",
      metadata: { source, step },
    });
  };

  const getAiMatch = (id: string) => aiMatches.find(m => m.id === id);

  useEffect(() => {
    if (showResults) window.scrollTo({ top: 0 });
  }, [showResults]);

  // Närmaste alternativ när kombinationen saknar träffar
  const [rerun, setRerun] = useState(false);
  useEffect(() => {
    if (!rerun) return;
    setRerun(false);
    findPartners();
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerun]);
  const altProductKey = selectedApp ? getProductKey(selectedApp) : null;
  const altWithoutIndustry = altProductKey && selectedIndustry
    ? partners.filter((p) => matchesDbProductFilter(p, altProductKey)).length : 0;
  const altWithoutProduct = selectedIndustry && selectedApp
    ? partners.filter((p) => Object.values(p.product_filters || {}).some((f: any) => f?.industries?.includes(selectedIndustry))).length : 0;

  // Results page
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead webPageSchema={false} title="Dina partnerförslag – d365.se" description="Anpassade partnerrekommendationer baserat på din verksamhet. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner." canonicalPath="/kom-igang" noIndex />
        <Navbar />
        <main className="pt-28 sm:pt-32 pb-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {matchedPartners.length > 0 ? "Här är partners som borde passa din situation" : "Ingen exakt träff, men här är närmaste vägar"}
                </h1>
                <p className="text-sm text-muted-foreground">Baserat på dina svar</p>
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
                  {matchedPartners.map((partner, idx) => {
                    const aiMatch = getAiMatch(partner.id);
                    return (
                      <div
                        key={partner.id}
                        className="relative rounded border-2 p-5 transition-all border-border bg-card"
                      >

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

                            <PartnerCardSummary partner={partner} highlightedIndustry={selectedIndustry || null} />
                          </div>
                        </div>

                        {partner.slug && (
                          <div className="mt-4 space-y-2">
                            <PartnerDecisionActions
                              partner={{ slug: partner.slug, name: partner.name }}
                              product={selectedApp}
                              industry={selectedIndustry}
                              onIntro={() => setIntroPartner(partner)}
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
                    Ingen partner har angett både {selectedApp || "vald produkt"}{selectedIndustry ? ` och ${selectedIndustry.toLowerCase()}` : ""}.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Det betyder inte att ingen kan hjälpa er, bara att ingen profil täcker exakt den kombinationen ännu. Välj hur ni vill gå vidare:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {altWithoutIndustry > 0 && (
                      <button type="button" onClick={() => { setSelectedIndustry(""); setRerun(true); }}
                        className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                        <span className="block font-semibold text-foreground">Visa {altWithoutIndustry} {altWithoutIndustry === 1 ? "partner" : "partners"} för {selectedApp}</span>
                        <span className="block text-sm text-muted-foreground">Utan krav på branscherfarenhet</span>
                      </button>
                    )}
                    {altWithoutProduct > 0 && (
                      <button type="button" onClick={() => { setSelectedProduct(null); setRerun(true); }}
                        className="rounded border-2 border-border bg-background p-4 text-left transition hover:border-primary">
                        <span className="block font-semibold text-foreground">Visa {altWithoutProduct} {altWithoutProduct === 1 ? "partner" : "partners"} inom {selectedIndustry.toLowerCase()}</span>
                        <span className="block text-sm text-muted-foreground">Med erfarenhet av andra Dynamics&nbsp;365-produkter</span>
                      </button>
                    )}
                    <Link to={`/fraga/?q=${encodeURIComponent(`Vilka partners kan ${selectedApp || "Dynamics 365"}${selectedIndustry ? ` för ${selectedIndustry.toLowerCase()}` : ""}?`)}&source=kom-igang-no-results`}
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

              {/* Requirements Spec CTA */}
              {(() => {
                const specMap: Record<string, { path: string; label: string }> = {
                  sales: { path: "/kravspecifikation-sales/", label: "Skapa kravspec för Försäljning" },
                  marketing: { path: "/kravspecifikation-marketing/", label: "Skapa kravspec för Marketing" },
                  service: { path: "/kravspecifikation-kundservice/", label: "Skapa kravspec för Kundservice" },
                  "contact-center": { path: "/kravspecifikation-kundservice/", label: "Skapa kravspec för Kundservice" },
                  erp: { path: "/kravspecifikation/", label: "Skapa kravspec för ERP" },
                };
                const spec = specByTrack[track] ?? selectedGoals.map(g => specMap[g]).find(Boolean);
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
                      <Link to={spec.path} state={{ industry: selectedIndustry || undefined }}>
                        <FileText className="h-4 w-4 mr-2" />
                        {spec.label}
                      </Link>
                    </Button>
                  </div>
                );
              })()}

              {matchedPartners.length > 0 && <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ändra urval
                </Button>
                <Button variant="ghost" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Börja om
                </Button>
                <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                  <Link to="/kontakt/">Vill du ha hjälp? Kontakta oss</Link>
                </Button>
              </div>}
            </div>
          </div>
        </main>
        <Footer />
        {introPartner?.slug && (
          <PartnerRequestDialog
            open={Boolean(introPartner)}
            onOpenChange={(open) => !open && setIntroPartner(null)}
            partnerSlug={introPartner.slug}
            partnerName={introPartner.name}
            selectedProduct={selectedApp || undefined}
            industry={selectedIndustry || undefined}
            mode="contact"
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Kom igång – Hitta rätt Dynamics 365-partner | d365.se"
        description="Fyra snabba frågor ger matchade partnerförslag för din Dynamics 365-implementation. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
        canonicalPath="/kom-igang"
      />
      <WebPageSchema
        name="Kom igång – Hitta rätt Dynamics 365-partner"
        description="Fyra snabba frågor ger matchade partnerförslag för din Dynamics 365-implementation. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
        url="https://d365.se/kom-igang/"
        breadcrumb={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kom igång", url: "https://d365.se/kom-igang/" },
        ]}
      />
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative pt-28 pb-4 sm:pt-32 sm:pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/80" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
              Några frågor – sedan en kortlista att gå vidare med
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Vi ringar in bransch, behov och ambitionsnivå och visar vilka partners som faktiskt matchar – utan säljpåverkan.</p>
          </div>
        </section>

        {/* Wizard */}
        <section className="flex-1 py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-semibold text-foreground">Steg {step}</span>
                <span className="text-sm text-muted-foreground">av {TOTAL_STEPS}</span>
                <div className="flex gap-1.5 ml-3">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded transition-colors ${
                        i + 1 === step ? "bg-[hsl(var(--cta-orange))]" : i + 1 < step ? "bg-[hsl(var(--cta-orange))]/50" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step heading */}
              <div className="text-center mb-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {stepLabels[step - 1]}
                </h2>
                {stepSubtexts[step - 1] && (
                  <p className="text-xs sm:text-sm text-muted-foreground">{stepSubtexts[step - 1]}</p>
                )}
              </div>

              {/* Navigation buttons above content */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {step > 1 && (
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
                <div>
                  {step === 3 && (
                    <Button onClick={() => advanceTo(4)} disabled={selectedGoals.length === 0} size="sm" className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      Nästa
                    </Button>
                  )}
                  {step === 4 && (
                    <Button onClick={() => advanceTo(5)} disabled={selectedSituations.length === 0} size="sm" className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      Nästa
                    </Button>
                  )}
                  {step === 5 && (
                    <Button onClick={() => advanceTo(6)} disabled={selectedComplexities.length === 0} size="sm" className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      Nästa
                    </Button>
                  )}
                  {step === 6 && (
                    <Button onClick={() => findPartners()} size="sm" className="px-6 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      Visa partners
                    </Button>
                  )}
                </div>
              </div>

              {step === 1 && (
                <div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {sortedIndustries.map((ind) => {
                      const isSelected = selectedIndustry === ind;
                      const img = industryImages[ind];
                      return (
                        <button
                          key={ind}
                          onClick={() => {
                            setSelectedIndustry(ind);
                            setTimeout(() => advanceTo(2), 250);
                          }}
                          className={`relative group rounded-lg overflow-hidden border-2 transition-all aspect-[5/4] ${
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
                          <span className="absolute bottom-0 left-0 right-0 px-1 py-1.5 text-white text-[10px] sm:text-xs font-semibold text-center leading-tight">
                            {ind}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Product */}
              {step === 2 && (
                <div className="grid grid-cols-3 gap-2">
                  {productOptions.map((opt) => {
                    const isSelected = selectedProduct === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedProduct(opt.value);
                          setTimeout(() => advanceTo(3), 250);
                        }}
                        className={`flex flex-col items-center justify-center text-center px-3 py-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-[hsl(var(--cta-orange))] bg-[hsl(var(--cta-orange))]/5 "
                            : "border-border bg-card hover:border-[hsl(var(--cta-orange))]/40"
                        }`}
                      >
                        {opt.icon ? (
                          <img src={opt.icon} alt={opt.label} className="w-10 h-10 object-contain mb-2" />
                        ) : (
                          <HelpCircle className="w-10 h-10 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm font-semibold text-foreground leading-tight">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{opt.desc}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded bg-[hsl(var(--cta-orange))] flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 3: Goal (multi-select) */}
              {step === 3 && (
                <div>
                  <div className="space-y-2">
                    {goalOptions.map((opt) => {
                      const isSelected = selectedGoals.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedGoals(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Situation (multi-select) */}
              {step === 4 && (
                <div>
                  <div className="space-y-2">
                    {situationOptions.map((opt) => {
                      const isSelected = selectedSituations.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedSituations(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Verksamhet (multi-select, two columns) */}
              {step === 5 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {complexityOptions.map((opt) => {
                      const isSelected = selectedComplexities.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedComplexities(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium leading-tight block">{opt.label}</span>
                            <p className="text-xs text-muted-foreground leading-tight">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 6: Company size (single-select with skip option) */}
              {step === 6 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sizeOptions.map((opt) => {
                      const isSelected = selectedSize === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedSize(opt.value);
                            setTimeout(() => findPartners(), 250);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-primary/20" : ""
                          }`}>
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold leading-tight block">{opt.label}</span>
                            <p className="text-xs text-muted-foreground leading-tight">{opt.desc}</p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSize(null);
                      findPartners();
                    }}
                    className="mt-4 mx-auto block text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Hoppa över – visa alla relevanta partners
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default KomIgang;
