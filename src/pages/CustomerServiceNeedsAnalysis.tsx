import { useState, useEffect, useRef } from "react";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { trackBuyerToolEvent, startBuyerToolRun } from "@/utils/trackBuyerToolEvent";
import { Link } from "react-router-dom";
import heroBehovsanalysKundservice from "@/assets/hero-behovsanalys-kundservice.jpg";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedPages, { needsAnalysisCsRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Headphones, Wrench, Building2, BarChart3, Sparkles, CheckCircle2, Truck } from "lucide-react";
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";
import { isServicesIndustry } from "@/lib/industryFilters";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import { appendSuggestedPartnersPage } from "@/utils/pdfSuggestedPartners";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";

const customerServiceBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Kundservice", url: "https://d365.se/d365customerservice" },
 { name: "Behovsanalys", url: "https://d365.se/kundservice-behovsanalys" },
];

const contactFormSchema = z.object({
 companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
 contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
 phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
 email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface CustomerServiceAnalysisData {
 serviceModel: string;
 ticketsPerMonth: string;
 slaRequirements: string;
 selfServicePortal: string;
 knowledgeBase: string;
 numberOfAgents: string;
 inboundVolume: string;
 contactCenterChannels: string[];
 realtimeManagement: string;
 numberOfTechnicians: string;
 schedulingNeeds: string;
 sparepartsManagement: string;
 serviceAgreements: string;
 geographicSpread: string;
 ticketsPerMonthComplex: string;
 multiCountry: string;
 multiLanguage: string;
 slaContracts: string;
 customerPrioritization: string;
 multipleProductLines: string;
 orgStructure: string;
 sharedReporting: string;
 realtimeReporting: string;
 integratedWithSalesErp: string;
 systemDependencies: string[];
 aiAutomation: string[];
 employees: string;
 industry: string;
 industryOther: string;
 serviceTeamSize: string;
 currentSystems: { product: string; year: string }[];
 otherSystemsDetails: string;
 situationChallenges: Record<string, string>;
 currentSituationReason: string;
 serviceChannels: string[];
 hasFieldService: string;
 fieldServiceNeeds: string[];
 fieldServiceNeedsOther: string;
 integrationSystems: { system: string; importance: string }[];
 wishlist: string;
 decisionTimeline: string;
 aiInterest: string;
 aiUseCases: string[];
 aiDetails: string;
 aiAutonomy: string;
 aiControls: string[];
 unsureIssues: string[];
 csKpis: string[];
 ccKpis: string[];
 fsKpis: string[];
 dataMaturity: string;
 dataOwnership: string;
 dataAccessControls: string;
 dataReliability: string;
 additionalInfo: string;
 currentPartners: string;
 companyName: string;
 contactName: string;
 phone: string;
 email: string;
}

const initialData: CustomerServiceAnalysisData = {
 serviceModel: "",
 ticketsPerMonth: "",
 slaRequirements: "",
 selfServicePortal: "",
 knowledgeBase: "",
 numberOfAgents: "",
 inboundVolume: "",
 contactCenterChannels: [],
 realtimeManagement: "",
 numberOfTechnicians: "",
 schedulingNeeds: "",
 sparepartsManagement: "",
 serviceAgreements: "",
 geographicSpread: "",
 orgStructure: "",
 sharedReporting: "",
 realtimeReporting: "",
 integratedWithSalesErp: "",
 systemDependencies: [],
 aiAutomation: [],
 ticketsPerMonthComplex: "",
 multiCountry: "",
 multiLanguage: "",
 slaContracts: "",
 customerPrioritization: "",
 multipleProductLines: "",
 employees: "",
 industry: "",
 industryOther: "",
 serviceTeamSize: "",
 currentSystems: [
 { product: "", year: "" },
 { product: "", year: "" },
 { product: "", year: "" },
 ],
 otherSystemsDetails: "",
 situationChallenges: {},
 currentSituationReason: "",
 serviceChannels: [],
 hasFieldService: "",
 fieldServiceNeeds: [],
 fieldServiceNeedsOther: "",
 integrationSystems: [
 { system: "", importance: "" },
 { system: "", importance: "" },
 { system: "", importance: "" },
 { system: "", importance: "" },
 { system: "", importance: "" },
 ],
 wishlist: "",
 decisionTimeline: "",
 aiInterest: "",
 aiUseCases: [],
 aiDetails: "",
 aiAutonomy: "",
 aiControls: [],
 unsureIssues: [],
 dataMaturity: "",
 dataOwnership: "",
 dataAccessControls: "",
 dataReliability: "",
 csKpis: [],
 ccKpis: [],
 fsKpis: [],
 additionalInfo: "",
 currentPartners: "",
 companyName: "",
 contactName: "",
 phone: "",
 email: "",
};

const employeeOptions = [
 "1-49 anställda",
 "50-99 anställda",
 "100-249 anställda",
 "250-999 anställda",
 "1.000-4.999 anställda",
 "Mer än 5.000 anställda",
];

const industryOptions = INDUSTRY_NAMES;

const teamSizeOptions = [
 "1-5",
 "6-15",
 "16-50",
 "51-100",
 "100+",
 "Ej relevant",
];

const situationChallengeCategories = [
 {
 id: "kunder_aterkommande",
 title: "Kunder återkommer med samma frågor",
 subtitle: "Ingen riktig ärendehistorik eller knowledge base",
 items: ["Kundservicemedarbetare börjar om från noll varje gång", "Ingen självbetjäning för kunder"],
 quote: "\"Vi svarar på samma frågor om och om igen.\"",
 quoteSource: "Kundservice säger:",
 },
 {
 id: "kanaler_splittrade",
 title: "Kanaler är splittrade",
 subtitle: "Telefon, e-post, chat och social media hanteras i olika system",
 items: ["Ingen helhetsbild över kundens ärenden", "Kunder får olika svar beroende på kanal"],
 quote: "\"Vi vet inte om kunden redan pratat med oss i en annan kanal.\"",
 quoteSource: "Kundservicemedarbetarnas frustration:",
 },
 {
 id: "sla_eskalering",
 title: "SLA och eskalering fungerar inte",
 subtitle: "Ärenden faller mellan stolarna eller eskaleras för sent",
 items: ["Ingen automatisk prioritering", "Svårt att mäta och följa upp kundnöjdhet"],
 quote: "\"Vi upptäcker problem först när kunden klagar.\"",
 quoteSource: "Ledningens reaktion:",
 },
 {
 id: "faltservice_integration",
 title: "Fältservice och inneservice är inte integrerade",
 subtitle: "Tekniker saknar information om kundens historik",
 items: ["Dubbelbokningar och ineffektiv ruttplanering", "Reservdelar saknas vid servicebesök"],
 quote: "\"Teknikerna vet inte vad kundservice lovat kunden.\"",
 quoteSource: "Fältservice säger:",
 },
 {
 id: "kundservicemedarbetare_improduktiva",
 title: "Kundservicemedarbetare lägger tid på fel saker",
 subtitle: "Mycket manuellt arbete och systembyten",
 items: ["Registrering i flera system", "Ingen AI-assistans eller automatisering"],
 quote: "Vi hinner inte ta hand om kunderna ordentligt.",
 quoteSource: "Kundservicemedarbetarnas beteende:",
 },
 {
 id: "ingen_insyn",
 title: "Ledningen har ingen insyn i kundservicen",
 subtitle: "Svårt att få rapporter och nyckeltal",
 items: ["Oklart hur bra vi presterar mot SLA", "Ingen överblick över vanliga problemområden"],
 quote: "Vi kan inte fatta datadrivna beslut.",
 quoteSource: "Ledningens frustration:",
 },
];

const situationChallengeOptions = ["Betydande utmaning", "Viss utmaning", "Inget problem idag"];

const serviceChannelOptions = ["Telefon", "E-post", "Live chat", "Social media", "Självbetjäningsportal", "SMS", "WhatsApp / Messenger"];

const fieldServiceNeedOptions = [
 "Arbetsorderhantering", "Schemaläggning och resursplanering", "Mobil app för tekniker",
 "Reservdelshantering", "Preventivt underhåll", "Tidsrapportering",
 "Kundunderskrift på plats", "IoT-integration", "GPS och ruttoptimering", "Fakturaunderlag",
];

const aiUseCaseCategories = [
 { id: "intelligent-routing", title: "Intelligent ärenderouting och prioritering", description: "AI analyserar inkommande ärenden och dirigerar dem till rätt agent baserat på kompetens, kapacitet och ärendets komplexitet.", benefit: "Affärsnytta: Snabbare hantering, rätt kompetens på rätt ärende, nöjdare kunder." },
 { id: "agent-assist", title: "Agent Assist - Realtidsförslag", description: "AI lyssnar på konversationen och föreslår svar, kunskapsartiklar och nästa steg i realtid.", benefit: "Affärsnytta: Snabbare ärendehantering, bättre FCR, kortare upplärning." },
 { id: "sentiment-analysis", title: "Sentimentanalys och tidig varning", description: "AI analyserar kundens tonläge i text och röst. Identifierar frustrerade kunder och triggar eskalering.", benefit: "Affärsnytta: Minska churn genom att fånga missnöjda kunder tidigt." },
 { id: "chatbot-virtual-agent", title: "Chatbot och virtuell agent", description: "AI-driven självbetjäning som hanterar vanliga frågor dygnet runt.", benefit: "Affärsnytta: Lägre kostnad per ärende, tillgänglig 24/7, frigör kundservicemedarbetare." },
 { id: "predictive-service", title: "Prediktiv service och underhåll", description: "AI analyserar produktdata och IoT-signaler för att förutse problem innan de uppstår.", benefit: "Affärsnytta: Högre kundnöjdhet, lägre servicekostnader, längre livslängd." },
 { id: "knowledge-generation", title: "AI-genererad kunskapsbas", description: "AI skapar och uppdaterar kunskapsartiklar automatiskt baserat på lösta ärenden.", benefit: "Affärsnytta: Alltid uppdaterad knowledge base utan manuellt arbete." },
 { id: "quality-management", title: "Automatiserad kvalitetsgranskning", description: "AI analyserar samtal och ärenden för att bedöma kundservicemedarbetarnas prestation.", benefit: "Affärsnytta: Konsekvent kvalitet, effektiv coaching, bättre kundupplevelse." },
 { id: "workforce-optimization", title: "Workforce Management & Optimering", description: "AI prognostiserar ärendevolymer och optimerar bemanning.", benefit: "Affärsnytta: Rätt bemanning vid rätt tid, lägre väntetider, lägre kostnader." },
 { id: "field-service-optimization", title: "Fältserviceoptimering med AI", description: "AI optimerar rutter, schemaläggning och resursallokering för tekniker.", benefit: "Affärsnytta: Fler jobb per dag, mindre körning, bättre kundupplevelse." },
 { id: "voice-transcription", title: "Röstanalys och transkription", description: "AI transkriberar samtal automatiskt och extraherar nyckelinsikter.", benefit: "Affärsnytta: Mindre admin, bättre dokumentation, snabbare uppföljning." },
 { id: "copilot-assistant", title: "AI-assistent (Copilot-liknande funktioner)", description: "Fråga systemet på naturligt språk: \"Visa alla öppna ärenden för VIP-kunder\".", benefit: "Affärsnytta: Kundservice blir ett kraftfullt analysverktyg – inte bara ett ärendesystem." },
];

// ───────────── Områdes-/diagnostikalternativ ─────────────
const unsureIssueOptions = [
 "Vi tappar kontroll på kundärenden",
 "Vi har svårt att hålla SLA",
 "Vi saknar gemensam kundhistorik",
 "Vi har för många manuella handoffs",
 "Telefoni, e-post och chatt är inte samordnade",
 "Agenter/handläggare saknar rätt information",
 "Teknikerplanering är ineffektiv",
 "Serviceorder, reservdelar och fakturering hänger inte ihop",
 "Vi saknar self-service eller kunskapsdatabas",
 "Vi har svårt att följa upp kundnöjdhet",
 "Vi vill använda AI-agenter eller Copilot",
 "Vi saknar bra rapportering",
];

const dataMaturityOptions = ["Ja, till stor del", "Delvis", "Nej, inte idag", "Vet ej"];
const dataOwnershipOptions = ["Ja, för de viktigaste datadomänerna", "Delvis", "Nej", "Vet ej"];
const dataAccessControlOptions = ["Ja", "Delvis", "Nej", "Vet ej"];
const dataReliabilityOptions = ["Bra", "Blandat", "Bristfälligt", "Vet ej"];

const aiAutonomyOptions = [
 "Endast ge förslag till användare",
 "Skapa utkast som användare godkänner",
 "Utföra enkla uppgifter automatiskt enligt regler",
 "Hantera delar av processer med mänsklig kontrollpunkt",
 "Agera självständigt inom definierade gränser",
 "Vet ej / behöver rådgivning",
];

const aiControlOptions = [
 "Mänskligt godkännande innan kundkommunikation",
 "Mänskligt godkännande innan data ändras",
 "Loggning av alla AI-/agentåtgärder",
 "Begränsning per roll/behörighet",
 "Tydliga eskaleringsregler",
 "Testmiljö innan produktionssättning",
 "Regelbunden kvalitetssäkring",
 "Juridisk/GDPR-granskning",
 "Spårbarhet till källor",
 "Möjlighet att stänga av agenten snabbt",
];

type FocusKey = "customer_service" | "field_service" | "contact_center" | "multi";

function getFocusKey(data: CustomerServiceAnalysisData): FocusKey {
 // Primärt: serviceModel; sekundärt: unsureIssues-heuristik
 switch (data.serviceModel) {
 case "Ärendebaserad kundservice":
 return "customer_service";
 case "Volymbaserad kundservice / Contact Center":
 return "contact_center";
 case "Fältservice med tekniker":
 return "field_service";
 case "Kombination av flera":
 return "multi";
 case "Osäkert – vi vill förstå behovet bättre": {
 const fs = ["Teknikerplanering är ineffektiv", "Serviceorder, reservdelar och fakturering hänger inte ihop"];
 const cc = ["Telefoni, e-post och chatt är inte samordnade", "Vi har svårt att följa upp kundnöjdhet"];
 const cs = ["Vi tappar kontroll på kundärenden", "Vi har svårt att hålla SLA", "Vi saknar gemensam kundhistorik", "Agenter/handläggare saknar rätt information", "Vi saknar self-service eller kunskapsdatabas"];
 const fsCount = data.unsureIssues.filter((i) => fs.includes(i)).length;
 const ccCount = data.unsureIssues.filter((i) => cc.includes(i)).length;
 const csCount = data.unsureIssues.filter((i) => cs.includes(i)).length;
 const total = fsCount + ccCount + csCount;
 const distinct = [fsCount, ccCount, csCount].filter((n) => n > 0).length;
 if (distinct >= 2 || total === 0) return "multi";
 if (fsCount >= ccCount && fsCount >= csCount) return "field_service";
 if (ccCount >= csCount) return "contact_center";
 return "customer_service";
 }
 default:
 return "customer_service";
 }
}

const focusConfig: Record<FocusKey, {
 pdfTitle: string;
 pdfSubTitle: string;
 emailAnalysisType: string;
 maturityHeading: string;
 partnerProfile: string[];
 nextSteps: string[];
 solutionHypothesis: string;
}> = {
 customer_service: {
 pdfTitle: "BEHOVSANALYS",
 pdfSubTitle: "Kundservice / Ärendehantering",
 emailAnalysisType: "Kundservice / Ärendehantering",
 maturityHeading: "KUNDSERVICEMOGNAD",
 partnerProfile: [
 "Dynamics 365 Customer Service",
 "Ärendehantering, SLA och supportprocesser",
 "Kunskapsdatabas och self-service",
 "Integrationer mot CRM/ERP",
 "Copilot och AI-stöd för handläggare",
 ],
 nextSteps: [
 "Kartlägg ärendeprocessen från inkommande kontakt till löst ärende.",
 "Definiera SLA, prioriteringar, köer och eskaleringsregler.",
 "Bedöm behov av kunskapsdatabas och self-service.",
 "Gör en fit-gap mot Dynamics 365 Customer Service.",
 "Identifiera AI-use cases för handläggarstöd och ärendesammanfattning.",
 "Bedöm datamognad för AI och agenter.",
 "Bjud in relevanta partners till lösningsdialog.",
 ],
 solutionHypothesis:
 "Utifrån dina svar framstår Dynamics 365 Customer Service som en relevant lösningsväg att utvärdera vidare. Fokus bör ligga på ärendehantering, SLA, köstyrning, kunskapsdatabas, kundhistorik, self-service och integrationer mot övriga system.",
 },
 field_service: {
 pdfTitle: "BEHOVSANALYS",
 pdfSubTitle: "Fältservice",
 emailAnalysisType: "Fältservice",
 maturityHeading: "FÄLTSERVICEMOGNAD",
 partnerProfile: [
 "Dynamics 365 Field Service",
 "Serviceorder och teknikerplanering",
 "Mobil fältservice och installerad bas",
 "Reservdelar, lager och serviceavtal",
 "ERP- och faktureringsintegrationer",
 ],
 nextSteps: [
 "Kartlägg serviceflödet från ärende till serviceorder, teknikerbesök och fakturering.",
 "Definiera krav på teknikerplanering, mobilitet och installerad bas.",
 "Bedöm reservdels-, lager- och ERP-integrationer.",
 "Gör en fit-gap mot Dynamics 365 Field Service.",
 "Identifiera AI- och automationsuse cases för planering och förebyggande underhåll.",
 "Bedöm datamognad kring servicehistorik, installerad bas och reservdelar.",
 "Bjud in partners med erfarenhet av fältservice och ERP-integrationer.",
 ],
 solutionHypothesis:
 "Utifrån dina svar finns tydliga behov inom fältservice, teknikerplanering och serviceuppdrag. Dynamics 365 Field Service bör därför ingå i den fortsatta utvärderingen, särskilt om du behöver hantera serviceorder, schemaläggning, installerad bas, reservdelar och mobil åtkomst för tekniker.",
 },
 contact_center: {
 pdfTitle: "BEHOVSANALYS",
 pdfSubTitle: "Contact Center",
 emailAnalysisType: "Contact Center",
 maturityHeading: "CONTACT CENTER-MOGNAD",
 partnerProfile: [
 "Dynamics 365 Contact Center",
 "Telefoni och omnichannel",
 "Agent desktop, köer och routing",
 "AI-agenter och samtalsanalys",
 "Integration mellan contact center och CRM",
 ],
 nextSteps: [
 "Kartlägg kanalflöden för telefoni, chatt, e-post och self-service.",
 "Definiera krav på köer, routing, agentstöd och realtidsrapportering.",
 "Bedöm integration mellan contact center, CRM och ärendehantering.",
 "Gör en fit-gap mot Dynamics 365 Contact Center och Customer Service.",
 "Identifiera AI-agent- och automationsuse cases.",
 "Bedöm datamognad för kundhistorik, kunskapsartiklar, samtalsdata och ärendedata.",
 "Bjud in partners med erfarenhet av contact center och CRM-integrationer.",
 ],
 solutionHypothesis:
 "Utifrån dina svar finns tydliga behov inom contact center, telefoni, chatt, routing och agentstöd. Dynamics 365 Contact Center och/eller Dynamics 365 Customer Service bör ingå i den fortsatta utvärderingen beroende på hur nära contact center-flödet behöver kopplas till ärendehantering, kundhistorik och övriga CRM-processer.",
 },
 multi: {
 pdfTitle: "BEHOVSANALYS",
 pdfSubTitle: "Kundservice, Contact Center och Fältservice",
 emailAnalysisType: "Kundservice, Contact Center och Fältservice",
 maturityHeading: "SERVICE- OCH KUNDUPPLEVELSEMOGNAD",
 partnerProfile: [
 "Dynamics 365 Customer Service, Field Service och Contact Center",
 "Power Platform och Copilot Studio",
 "Integrationer mot ERP, telefoni, lager, fakturering och kundportal",
 "Datamodellering och rapportering (Power BI)",
 "Förändringsledning över flera team",
 ],
 nextSteps: [
 "Kartlägg hela flödet från kundkontakt till ärende, serviceuppdrag och uppföljning.",
 "Definiera ansvar mellan contact center, kundservice och fältservice.",
 "Bedöm integrationer mot ERP, telefoni, lager, fakturering och kundportal.",
 "Gör en fit-gap mot Customer Service, Field Service och Contact Center.",
 "Identifiera AI- och automationsuse cases och kontrollpunkter.",
 "Bedöm datamognad och styrning för AI/agenter.",
 "Ta fram en gemensam kravspecifikation för kundservice, contact center och fältservice.",
 ],
 solutionHypothesis:
 "Utifrån dina svar bör Customer Service, Contact Center och Field Service utvärderas som ett sammanhängande kundserviceflöde. Behovet verkar omfatta både ärendehantering, kanalhantering, kundhistorik, serviceuppdrag, teknikerplanering och integrationer mot ERP, lager och fakturering.",
 },
};

function getDataMaturityLevel(d: CustomerServiceAnalysisData): { level: string; description: string } {
 const score = (() => {
 let s = 0;
 if (d.dataMaturity === "Ja, till stor del") s += 3;
 else if (d.dataMaturity === "Delvis") s += 2;
 else if (d.dataMaturity === "Nej, inte idag") s += 0;
 if (d.dataOwnership === "Ja, för de viktigaste datadomänerna") s += 2;
 else if (d.dataOwnership === "Delvis") s += 1;
 if (d.dataAccessControls === "Ja") s += 2;
 else if (d.dataAccessControls === "Delvis") s += 1;
 if (d.dataReliability === "Bra") s += 2;
 else if (d.dataReliability === "Blandat") s += 1;
 return s;
 })();
 if (score >= 8) return { level: "Avancerad", description: "Data, processer, behörigheter och styrning är tillräckligt mogna för att utvärdera mer autonoma agentflöden." };
 if (score >= 5) return { level: "Hög", description: "Data är relativt strukturerad, tillförlitlig och åtkomlig. AI och styrda agenter kan utvärderas." };
 if (score >= 2) return { level: "Medel", description: "Viss datagrund finns, men kvalitet, integrationer eller ägarskap behöver förbättras före mer avancerade agenter." };
 return { level: "Låg", description: "Data är splittrad, bristfällig eller saknar tydligt ägarskap. AI bör främst användas försiktigt och assisterande." };
}

function getAiPotentialLevel(d: CustomerServiceAnalysisData): { level: string; description: string } {
 const usesAutonomy = ["Hantera delar av processer med mänsklig kontrollpunkt", "Agera självständigt inom definierade gränser"].includes(d.aiAutonomy);
 const usesAssisted = ["Skapa utkast som användare godkänner", "Utföra enkla uppgifter automatiskt enligt regler"].includes(d.aiAutonomy);
 const dataLevel = getDataMaturityLevel(d).level;
 if (usesAutonomy && (dataLevel === "Hög" || dataLevel === "Avancerad")) {
 return { level: "Autonoma agenter med styrning", description: "Agenter kan utföra definierade uppgifter självständigt inom tydliga mandat, loggning och kontrollpunkter." };
 }
 if (usesAutonomy || (usesAssisted && (dataLevel === "Medel" || dataLevel === "Hög" || dataLevel === "Avancerad"))) {
 return { level: "Styrd automation / assisterade agenter", description: "AI/agenter kan hantera delar av processer med mänsklig kontroll." };
 }
 if (d.aiUseCases.length > 0 || usesAssisted) {
 return { level: "AI-assistans", description: "AI kan stödja användare med sammanfattningar, förslag och analys." };
 }
 return { level: "AI-intresse", description: "Organisationen är nyfiken, men data/processer är inte redo." };
}

function shouldRecommendAiAssessment(d: CustomerServiceAnalysisData): boolean {
 const dataLevel = getDataMaturityLevel(d).level;
 const highAiInterest = d.aiUseCases.length >= 3;
 const wantsAgent = d.aiUseCases.includes("chatbot-virtual-agent") || ["Hantera delar av processer med mänsklig kontrollpunkt", "Agera självständigt inom definierade gränser"].includes(d.aiAutonomy);
 const dataRisk = dataLevel === "Låg" || d.dataOwnership === "Nej" || d.dataOwnership === "Vet ej" || d.dataAccessControls === "Nej" || d.dataAccessControls === "Vet ej";
 const heavyIntegration = d.systemDependencies.length >= 4;
 return highAiInterest || wantsAgent || dataRisk || heavyIntegration;
}

const CustomerServiceNeedsAnalysis = () => {
 const [currentStep, setCurrentStep] = useState(1);
 const { data: allPartners = [] } = usePartners();
 const [data, setData] = useState<CustomerServiceAnalysisData>(initialData);
 const [isComplete, setIsComplete] = useState(false);
 const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
 const [isSendingEmail, setIsSendingEmail] = useState(false);
 const { toast } = useToast();

 const totalSteps = 8;

 useEffect(() => {
 trackFunnelEvent({ event_type: "analysis_start", event_name: "needs_analysis_customer_service" });
 }, []);

 useEffect(() => {
 if (currentStep === totalSteps) {
 trackFunnelEvent({ event_type: "analysis_complete", event_name: "needs_analysis_customer_service" });
 }
 }, [currentStep]);

  const buyerRun = useRef<ReturnType<typeof startBuyerToolRun> | null>(null);
  useEffect(() => {
    buyerRun.current = startBuyerToolRun("behovsanalys", { product_key: "customer_service" });
    return () => buyerRun.current?.cleanup();
  }, []);

  useEffect(() => {
    if (currentStep === totalSteps) {
      buyerRun.current?.markCompleted();
      trackBuyerToolEvent({
        tool: "behovsanalys",
        status: "slutford",
        product_key: "customer_service",
        industry: data.industry || null,
        company_size: null,
      });
    }
  }, [currentStep, totalSteps]);


 const focusKeyCurrent = getFocusKey(data);
 const needsFieldServiceStep = focusKeyCurrent === "field_service" || focusKeyCurrent === "multi";
 const progress = (currentStep / totalSteps) * 100;

 const stepIcons = [Building2, Headphones, BarChart3, Truck, Building2, Wrench, Sparkles, CheckCircle2];
 const stepTitles = [
 "Företagsinfo",
 "Service-modell",
 "Situation",
 "Fältservice",
 "Organisation",
 "Integration",
 "AI & Automation",
 "Vägledande Kundserviceanalys",
 ];

 const handleNext = () => {
 let next = currentStep + 1;
 if (next === 4 && !needsFieldServiceStep) next = 5; // Hoppa över fältservice-steget
 if (next <= totalSteps) setCurrentStep(next);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleBack = () => {
 let prev = currentStep - 1;
 if (prev === 4 && !needsFieldServiceStep) prev = 3; // Hoppa över fältservice-steget
 if (prev >= 1) setCurrentStep(prev);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handlePrint = () => window.print();

 const handleCheckboxChange = (field: keyof CustomerServiceAnalysisData, value: string) => {
 const currentValues = data[field] as string[];
 if (currentValues.includes(value)) {
 setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
 } else {
 setData({ ...data, [field]: [...currentValues, value] });
 }
 };

 const handleSituationChallengeChange = (categoryId: string, value: string) => {
 setData({ ...data, situationChallenges: { ...data.situationChallenges, [categoryId]: value } });
 };

 const getRecommendation = () => {
 const recommendations: {
 customerService: { score: number; reasons: string[] };
 fieldService: { score: number; reasons: string[] };
 contactCenter: { score: number; reasons: string[] };
 } = {
 customerService: { score: 0, reasons: [] },
 fieldService: { score: 0, reasons: [] },
 contactCenter: { score: 0, reasons: [] },
 };

 // Customer Service är alltid grunden – de flesta organisationer behöver ärendehantering
 recommendations.customerService.score += 15; // Grundvikt: ärendehantering är alltid relevant
 recommendations.customerService.reasons.push("Ärendehantering är grunden i alla kundserviceorganisationer");

 if (data.serviceModel === "Ärendebaserad kundservice") {
 recommendations.customerService.score += 40;
 recommendations.customerService.reasons.push("Ärendebaserad kundservice – Customer Service passar bäst");
 } else if (data.serviceModel === "Volymbaserad kundservice / Contact Center") {
 recommendations.contactCenter.score += 40;
 recommendations.customerService.score += 10; // CS är fortfarande relevant som grund
 recommendations.contactCenter.reasons.push("Volymbaserad kundservice med contact center-fokus – Contact Center är rätt lösning");
 } else if (data.serviceModel === "Fältservice med tekniker") {
 recommendations.fieldService.score += 40;
 recommendations.customerService.score += 10;
 recommendations.fieldService.reasons.push("Fältservice med tekniker på plats – Field Service är rätt lösning");
 } else if (data.serviceModel === "Kombination av flera") {
 recommendations.customerService.score += 25;
 recommendations.contactCenter.score += 15;
 recommendations.fieldService.score += 10;
 recommendations.customerService.reasons.push("Kombinerad service-modell – Customer Service som nav");
 }

 if (data.ticketsPerMonth === "2 000–10 000" || data.ticketsPerMonth === "Mer än 10 000") {
 recommendations.customerService.score += 15;
 recommendations.customerService.reasons.push("Hög ärendevolym kräver skalbar ärendehantering");
 }
 if (data.slaRequirements === "Ja, strikta krav med avtalade svarstider") {
 recommendations.customerService.score += 10;
 recommendations.customerService.reasons.push("Strikta SLA-krav kräver automatisk prioritering och uppföljning");
 }
 if (data.selfServicePortal === "Nej, men vi vill ha det") {
 recommendations.customerService.score += 8;
 recommendations.customerService.reasons.push("Önskad self-service portal inkluderad i Customer Service");
 }
 if (data.knowledgeBase === "Delvis – spridd i dokument och e-post" || data.knowledgeBase === "Nej, kunskapen sitter hos individerna") {
 recommendations.customerService.score += 8;
 recommendations.customerService.reasons.push("Fragmenterad kunskap – behov av strukturerad knowledge base");
 }
 if (data.serviceTeamSize === "51-100" || data.serviceTeamSize === "100+") {
 recommendations.contactCenter.score += 15;
 recommendations.contactCenter.reasons.push("Stort team av kundservicemedarbetare kräver Contact Center-plattform");
 }
 if (data.inboundVolume === "500–2 000 kontakter/dag" || data.inboundVolume === "Mer än 2 000 kontakter/dag") {
 recommendations.contactCenter.score += 12;
 recommendations.contactCenter.reasons.push("Hög inkommande volym kräver intelligent routing och köhantering");
 }
 if (data.contactCenterChannels.length >= 3) {
 recommendations.contactCenter.score += 10;
 recommendations.contactCenter.reasons.push(`${data.contactCenterChannels.length} kanaler – omnichannel Contact Center krävs`);
 }
 if (data.realtimeManagement === "Ja, kritiskt för oss") {
 recommendations.contactCenter.score += 10;
 recommendations.contactCenter.reasons.push("Realtidsstyrning och supervisor-dashboard är prioriterat");
 }
 if (data.numberOfTechnicians === "Vi har inga fältservicetekniker") {
 recommendations.fieldService.score = 0;
 recommendations.fieldService.reasons = [];
 } else if (data.numberOfTechnicians === "51–200 tekniker" || data.numberOfTechnicians === "Mer än 200 tekniker") {
 recommendations.fieldService.score += 15;
 recommendations.fieldService.reasons.push("Stort teknikerteam kräver intelligent schemaläggning");
 } else if (data.numberOfTechnicians) {
 recommendations.fieldService.score += 5;
 recommendations.fieldService.reasons.push("Teknikerteam i fält – Field Service ger struktur och stöd");
 }
 if (data.schedulingNeeds === "Manuellt via telefon/mail" || data.schedulingNeeds === "Excel eller enklare verktyg") {
 recommendations.fieldService.score += 10;
 recommendations.fieldService.reasons.push("Manuell schemaläggning – stor effektiviseringsvinst med Field Service");
 }
 if (data.sparepartsManagement === "Kritisk – tekniker måste ha rätt delar vid besöket") {
 recommendations.fieldService.score += 10;
 recommendations.fieldService.reasons.push("Kritisk reservdelshantering integrerad i Field Service");
 }
 if (data.serviceAgreements === "Ja, med garanterade svarstider och tillgänglighet") {
 recommendations.fieldService.score += 10;
 recommendations.fieldService.reasons.push("Serviceavtal med SLA kräver automatisk prioritering och uppföljning");
 }
 if (data.geographicSpread === "Nationellt – hela Sverige" || data.geographicSpread === "Nordiska länder" || data.geographicSpread === "Globalt") {
 recommendations.fieldService.score += 8;
 recommendations.fieldService.reasons.push("Bred geografisk spridning kräver ruttoptimering och GPS-spårning");
 }
 if (data.ticketsPerMonthComplex === "2 000–10 000" || data.ticketsPerMonthComplex === "Mer än 10 000") {
 recommendations.customerService.score += 10;
 recommendations.contactCenter.score += 10;
 recommendations.customerService.reasons.push("Hög ärendevolym kräver enterprise-arkitektur");
 }
 if (data.multiCountry === "Ja, Europa" || data.multiCountry === "Ja, globalt") {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Flerlandsverksamhet kräver centraliserad plattform");
 }
 if (data.multiLanguage === "Ja, 3–5 språk" || data.multiLanguage === "Ja, mer än 5 språk") {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Flerspråkigt stöd kräver avancerad routing och AI");
 }
 if (data.slaContracts === "Ja, kontraktuella SLA eventuellt med viten" || data.slaContracts === "Ja, komplexa SLA per kundsegment") {
 recommendations.customerService.score += 10;
 recommendations.fieldService.score += 10;
 recommendations.customerService.reasons.push("Kontraktuella SLA kräver automatisk spårning och eskalering");
 }
 if (data.customerPrioritization === "Ja, vi har komplexa prioriteringsregler") {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Komplex kundprioritering kräver konfigurerbar routinglogik");
 }
 if (data.multipleProductLines === "Ja, mer än 5 produktlinjer" || data.multipleProductLines === "Ja, och de kräver specialistkompetens") {
 recommendations.customerService.score += 8;
 recommendations.customerService.reasons.push("Flera produktlinjer kräver specialiströuting och kunskapsdatabas");
 }
 if (data.orgStructure === "Lokal – varje land/region har sitt eget team" || data.orgStructure === "Hybrid – central styrning, lokalt utförande") {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Distribuerad organisation kräver multi-site-arkitektur");
 }
 if (data.sharedReporting === "Ja, ledningen behöver samlad bild") {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Gemensam uppföljning kräver centraliserad plattform");
 }
 if (data.realtimeReporting === "Ja, kritiskt – vi behöver live-dashboards") {
 recommendations.contactCenter.score += 12;
 recommendations.contactCenter.reasons.push("Realtids-KPI och live-dashboards är kritiska krav");
 }
 if (data.integratedWithSalesErp === "Ja, tätt integrerat – en plattform") {
 recommendations.customerService.score += 12;
 recommendations.customerService.reasons.push("Tight integration med sälj/ERP – Dynamics 365 är en naturlig plattform");
 } else if (data.integratedWithSalesErp === "Ja, integration via API eller middleware") {
 recommendations.customerService.score += 6;
 recommendations.customerService.reasons.push("API-integration med sälj och ERP krävs");
 }
 if (data.systemDependencies.includes("erp")) {
 recommendations.customerService.score += 10;
 recommendations.fieldService.score += 8;
 recommendations.customerService.reasons.push("ERP-integration – Dynamics 365-plattformen ger sömlös koppling");
 }
 if (data.systemDependencies.includes("iot")) {
 recommendations.fieldService.score += 12;
 recommendations.fieldService.reasons.push("IoT-integration – Field Service har inbyggt IoT-stöd");
 }
 if (data.systemDependencies.includes("lager")) {
 recommendations.fieldService.score += 8;
 recommendations.fieldService.reasons.push("Lagerintegration viktig för reservdelshantering i fältservice");
 }
 if (data.systemDependencies.includes("crm_sales")) {
 recommendations.customerService.score += 10;
 recommendations.customerService.reasons.push("CRM/Sälj-integration – Customer Service och Sales på samma plattform");
 }
 if (data.systemDependencies.includes("telefoni")) {
 recommendations.contactCenter.score += 10;
 recommendations.contactCenter.reasons.push("Telefoniplattform – Contact Center med röst- och omnichannel-integration");
 }
 if (data.systemDependencies.length >= 4) {
 recommendations.customerService.score += 8;
 recommendations.customerService.reasons.push("Många systemintegrationsberoenden – krävs en partner med bred erfarenhet");
 }
 if (data.aiAutomation.includes("auto_routing")) {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 10;
 recommendations.customerService.reasons.push("Automatisk ärenderouting – inbyggd i Customer Service och Contact Center");
 }
 if (data.aiAutomation.includes("ai_responses")) {
 recommendations.customerService.score += 10;
 recommendations.customerService.reasons.push("AI-assisterade svar – Copilot i Customer Service föreslår svar i realtid");
 }
 if (data.aiAutomation.includes("predictive_maintenance")) {
 recommendations.fieldService.score += 12;
 recommendations.fieldService.reasons.push("Prediktivt underhåll – Field Service med IoT och Copilot stödjer detta nativt");
 }
 if (data.aiAutomation.includes("chatbot_selfservice")) {
 recommendations.customerService.score += 8;
 recommendations.contactCenter.score += 8;
 recommendations.customerService.reasons.push("Chattbot/self-service – Copilot Studio möjliggör avancerade AI-botar");
 }
 if (data.serviceChannels.length >= 3) {
 recommendations.customerService.score += 10;
 recommendations.contactCenter.score += 10;
 }
 const significantChallenges = Object.entries(data.situationChallenges).filter(([_, value]) => value === "Betydande utmaning");
 if (significantChallenges.length > 0) {
 recommendations.customerService.score += significantChallenges.length * 4;
 recommendations.contactCenter.score += significantChallenges.length * 3;
 }
 if (data.hasFieldService === "Ja" || data.hasFieldService === "Planerar att starta") {
 recommendations.fieldService.score += 20;
 recommendations.fieldService.reasons.push("Verksamhet med fältservice");
 }

 const products = [];
 if (recommendations.customerService.score > 15) {
 products.push({ name: "Dynamics 365 Customer Service", icon: "🎧", score: recommendations.customerService.score, reasons: recommendations.customerService.reasons, description: "Komplett ärendehantering med omnichannel-support, knowledge base och AI-assistans." });
 }
 if (recommendations.fieldService.score > 15) {
 products.push({ name: "Dynamics 365 Field Service", icon: "🔧", score: recommendations.fieldService.score, reasons: recommendations.fieldService.reasons, description: "Optimera fältserviceverksamheten med intelligent schemaläggning och mobil app." });
 }
 if (recommendations.contactCenter.score > 15) {
 products.push({ name: "Dynamics 365 Contact Center", icon: "📞", score: recommendations.contactCenter.score, reasons: recommendations.contactCenter.reasons, description: "AI-drivet Contact Center för röst och digitala kanaler med Copilot-assistans." });
 }
 return { products: products.sort((a, b) => b.score - a.score) };
 };

 const validateContactForm = (): boolean => {
 const result = contactFormSchema.safeParse({ companyName: data.companyName, contactName: data.contactName, phone: data.phone, email: data.email });
 if (!result.success) {
 const errors: ContactFormErrors = {};
 result.error.issues.forEach((err) => {
 const field = err.path[0] as keyof ContactFormErrors;
 if (!errors[field]) errors[field] = err.message;
 });
 setContactErrors(errors);
 return false;
 }
 setContactErrors({});
 return true;
 };

 const generateDocument = async () => {
 if (!validateContactForm()) return;
 const recommendation = getRecommendation();
 const focusKey = getFocusKey(data);
 const focusCfg = focusConfig[focusKey];
 const dataMat = getDataMaturityLevel(data);
 const aiPot = getAiPotentialLevel(data);
 const recommendAiAssessment = shouldRecommendAiAssessment(data);

 // Compute transformation level up-front so we can include it in the AI prompt.
 let complexityScore0 = 0;
 if (data.multiCountry === "Ja, globalt" || data.multiCountry === "Ja, Europa") complexityScore0 += 2;
 else if (data.multiCountry === "Ja, Norden") complexityScore0 += 1;
 if (data.multiLanguage?.includes("mer") || data.multiLanguage === "Ja, 3-5 sprak" || data.multiLanguage === "Ja, 3–5 språk") complexityScore0 += 2;
 else if (data.multiLanguage?.includes("svenska + engelska")) complexityScore0 += 1;
 if (data.customerPrioritization?.includes("komplexa")) complexityScore0 += 2;
 else if (data.customerPrioritization?.includes("2-3") || data.customerPrioritization?.includes("2–3")) complexityScore0 += 1;
 if (data.multipleProductLines?.includes("specialistkompetens") || data.multipleProductLines?.includes("mer")) complexityScore0 += 2;
 else if (data.multipleProductLines?.includes("2-5") || data.multipleProductLines?.includes("2–5")) complexityScore0 += 1;
 const transformationLevelEarly = complexityScore0 >= 9 ? 4 : complexityScore0 >= 6 ? 3 : complexityScore0 >= 3 ? 2 : 1;
 const transformationLabelEarly = ["", "Initial service", "Strukturerad service", "Digitaliserad service", "Intelligent service"][transformationLevelEarly];

 // Fetch AI-generated narrative analysis (paragraphs separated by \n\n).
 setIsSendingEmail(true);
 let aiAnalysis: {
 executiveSummary: string;
 serviceInterpretation: string;
 solutionHypothesis: string;
 dataAndAiAnalysis: string;
 whyPoints: string[];
 risks: string[];
 partnerProfile: string;
 nextSteps: string[];
 confidence: string;
 } | null = null;
 try {
 const aiRes = await supabase.functions.invoke("generate-customer-service-analysis", {
 body: {
 companyName: data.companyName,
 contactName: data.contactName,
 focusKey,
 focusLabel: focusCfg.pdfSubTitle,
 transformationLevel: transformationLevelEarly,
 transformationLabel: transformationLabelEarly,
 dataMaturityLevel: dataMat.level,
 aiPotentialLevel: aiPot.level,
 recommendAiAssessment,
 summary: data,
 recommendation: {
 products: recommendation.products.map((p) => p.name),
 reasons: recommendation.products.flatMap((p) => p.reasons).slice(0, 8),
 },
 },
 });
 aiAnalysis = aiRes?.data?.analysis ?? null;
 } catch (err) {
 console.warn("AI analysis fetch failed, continuing with static fallback", err);
 } finally {
 setIsSendingEmail(false);
 }

 const { default: jsPDF } = await import("jspdf");
 const pdf = new jsPDF();
 const pageWidth = pdf.internal.pageSize.getWidth();
 const pageHeight = pdf.internal.pageSize.getHeight();
 const margin = 20;
 const contentWidth = pageWidth - margin * 2;
 let yPos = margin;

 const checkPage = (needed = 20) => { if (yPos + needed > 270) { pdf.addPage(); yPos = margin; } };

 const addSectionHeader = (title: string, r: number, g: number, b: number) => {
 checkPage(18);
 pdf.setFillColor(r, g, b);
 pdf.roundedRect(margin, yPos, contentWidth, 11, 2, 2, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(10);
 pdf.setFont("helvetica", "bold");
 pdf.text(title, margin + 5, yPos + 7.5);
 yPos += 15;
 pdf.setTextColor(51, 51, 51);
 pdf.setFont("helvetica", "normal");
 };

 const addTextBlock = (text: string, fontSize = 9) => {
 pdf.setFontSize(fontSize);
 const lines = pdf.splitTextToSize(text || "Ej angivet", contentWidth);
 checkPage(lines.length * 5 + 4);
 pdf.text(lines, margin, yPos);
 yPos += lines.length * 5 + 6;
 };

 // Render multi-paragraph prose with proper spacing between paragraphs.
 // Splits on \n\n (and falls back to single \n) so AI-generated text reads cleanly.
 const addParagraphs = (text: string, fontSize = 9.5) => {
 if (!text) return;
 const paragraphs = String(text)
 .replace(/\r\n/g, "\n")
 .split(/\n{2,}/)
 .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
 .filter(Boolean);
 pdf.setFontSize(fontSize);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(51, 51, 51);
 const lineHeight = fontSize * 0.5;
 paragraphs.forEach((para, i) => {
 const lines = pdf.splitTextToSize(para, contentWidth);
 checkPage(lines.length * lineHeight + 4);
 pdf.text(lines, margin, yPos);
 yPos += lines.length * lineHeight + (i < paragraphs.length - 1 ? 4 : 6);
 });
 };

 const addBulletList = (items: string[]) => {
 if (!items.length) return;
 pdf.setFontSize(9);
 items.forEach(item => { checkPage(7); pdf.text(`- ${item}`, margin + 3, yPos); yPos += 6; });
 yPos += 3;
 };

 const addKVRow = (label: string, value: string, shade: boolean) => {
 if (!value || value === "Ej angivet") return;
 checkPage(8);
 if (shade) { pdf.setFillColor(245, 247, 252); pdf.rect(margin, yPos - 4, contentWidth, 7, 'F'); }
 pdf.setFontSize(8.5);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(80, 80, 80);
 pdf.text(label, margin + 2, yPos);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(30, 30, 30);
 const valLines = pdf.splitTextToSize(value, contentWidth - 55);
 pdf.text(valLines, margin + 55, yPos);
 yPos += Math.max(6, valLines.length * 5);
 };

 // ── COVER PAGE ──────────────────────────────────────────────────────────────
 const analysisDate = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
 pdf.setFillColor(30, 58, 138);
 pdf.rect(0, 0, pageWidth, pageHeight, 'F');
 pdf.setFillColor(56, 100, 220);
 pdf.rect(0, pageHeight * 0.55, pageWidth, 3, 'F');

 try {
 const logoImg = new Image();
 logoImg.crossOrigin = "anonymous";
 await new Promise<void>((resolve) => {
 logoImg.onload = () => {
 try {
 const logoW = 70;
 const logoH = (logoImg.height / logoImg.width) * logoW;
 pdf.addImage(logoImg, "JPEG", pageWidth / 2 - logoW / 2, 30, logoW, logoH);
 } catch {}
 resolve();
 };
 logoImg.onerror = () => resolve();
 logoImg.src = "/src/assets/dynamic-factory-logo-new.jpg";
 });
 } catch {}

 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(28);
 pdf.setFont("helvetica", "bold");
 pdf.text(focusCfg.pdfTitle, pageWidth / 2, 120, { align: "center" });
 pdf.setFontSize(14);
 pdf.setFont("helvetica", "normal");
 pdf.text(focusCfg.pdfSubTitle, pageWidth / 2, 133, { align: "center" });
 pdf.setFontSize(10);
 pdf.text("AI-genererat beslutsunderlag inför val av Dynamics 365-lösning", pageWidth / 2, 142, { align: "center" });
 pdf.setDrawColor(255, 255, 255);
 pdf.setLineWidth(0.5);
 pdf.line(margin + 20, 148, pageWidth - margin - 20, 148);



 pdf.setFontSize(14);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(255, 255, 255);
 pdf.text(data.companyName || "", pageWidth / 2, 158, { align: "center" });
 pdf.setFontSize(11);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(200, 215, 255);
 pdf.text(data.contactName || "", pageWidth / 2, 171, { align: "center" });
 pdf.text(data.email || "", pageWidth / 2, 182, { align: "center" });

 pdf.setTextColor(180, 200, 255);
 pdf.setFontSize(9);
 pdf.text("d365.se – Köparsidig vägledning för val av Microsoft Dynamics 365-partner", pageWidth / 2, pageHeight - 28, { align: "center" });
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(10);
 pdf.text(`Analysens datum: ${analysisDate}`, pageWidth / 2, pageHeight - 18, { align: "center" });
 pdf.addPage();

 // ── PAGE HEADER ────────────────────────────────────────────────────────────
 pdf.setFillColor(114, 73, 198);
 pdf.rect(0, 0, pageWidth, 40, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(20);
 pdf.setFont("helvetica", "bold");
 pdf.text("RESULTAT & REKOMMENDATIONER", margin, 22);
 pdf.setFontSize(11);
 pdf.setFont("helvetica", "normal");
 pdf.text(`${data.companyName} - ${analysisDate}`, margin, 33);
 yPos = 50;

 // ══════════════════════════════════════════════════════════════════════
 // 1. SAMMANFATTNING
 // ══════════════════════════════════════════════════════════════════════
 addSectionHeader("SAMMANFATTNING", 37, 99, 235);
 const profileMap: Record<string, string> = {
 "Arendebaserad kundservice": "Ärendebaserad service",
 "Ärendebaserad kundservice": "Ärendebaserad service",
 "Volymbaserad kundservice / Contact Center": "Contact Center",
 "Faltservice med tekniker": "Fältservice",
 "Fältservice med tekniker": "Fältservice",
 "Kombination av flera": "Hybrid service",
 };
 const geoLabel = data.multiCountry === "Ja, globalt" ? "Global" : data.multiCountry === "Ja, Europa" ? "Europa" : data.multiCountry === "Ja, Norden" ? "Norden" : "Sverige";
 const inboundHigh = ["500–2 000 kontakter/dag", "Mer än 2 000 kontakter/dag", "500-2 000 kontakter/dag", "Mer an 2 000 kontakter/dag"];
 const inboundMedium = ["100–500 kontakter/dag", "100-500 kontakter/dag"];
 const inboundLow = ["Färre än 100 kontakter/dag", "Farre an 100 kontakter/dag"];
 let volLabel: string;
 if (data.ticketsPerMonth === "2 000-10 000" || data.ticketsPerMonth === "Mer an 10 000" || data.ticketsPerMonth === "Mer än 10 000" || inboundHigh.includes(data.inboundVolume)) {
 volLabel = "Hög";
 } else if (data.ticketsPerMonth === "500-2 000" || inboundMedium.includes(data.inboundVolume)) {
 volLabel = "Medel";
 } else if (data.ticketsPerMonth || inboundLow.includes(data.inboundVolume)) {
 volLabel = "Låg";
 } else {
 volLabel = "Ej angivet";
 }
 const sysIds: Record<string, string> = { erp: "ERP", iot: "IoT", product_register: "Produktregister", lager: "Lager", fakturering: "Fakturering", crm_sales: "CRM/Sälj", field_service_ext: "Fältservice-system", telefoni: "Telefoni", e_handel: "E-handel", hr: "HR" };
 const integList = data.systemDependencies.map(id => sysIds[id] || id);

 const profileRows = [
 ["Serviceprofil", profileMap[data.serviceModel] || data.serviceModel],
 ["Geografisk struktur", geoLabel],
 ["Servicevolym", volLabel],
 ["Integrationer", integList.join(", ") || "Ej angivet"],
 ];
 const cellW = contentWidth / 2;
 const cellH = 14;
 profileRows.forEach(([label, value], i) => {
 const col = i % 2;
 const row = Math.floor(i / 2);
 const x = margin + col * cellW;
 const y = yPos + row * cellH;
 pdf.setFillColor(245, 248, 252);
 pdf.roundedRect(x + 1, y, cellW - 2, cellH - 2, 2, 2, 'F');
 pdf.setFontSize(7.5);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(120, 120, 120);
 pdf.text(label, x + 5, y + 5);
 pdf.setFontSize(10);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(30, 58, 138);
 pdf.text(value, x + 5, y + 11);
 });
 yPos += Math.ceil(profileRows.length / 2) * cellH + 8;

 // AI-genererad ledningssammanfattning (paragrafer)
 if (aiAnalysis?.executiveSummary) {
 addParagraphs(aiAnalysis.executiveSummary, 9.5);
 }

 // ══════════════════════════════════════════════════════════════════════
 // 2. SERVICEMOGNAD (dots)
 // ══════════════════════════════════════════════════════════════════════
 let complexityScore = 0;
 if (data.multiCountry === "Ja, globalt" || data.multiCountry === "Ja, Europa") complexityScore += 2;
 else if (data.multiCountry === "Ja, Norden") complexityScore += 1;
 if (data.multiLanguage === "Ja, mer an 5 sprak" || data.multiLanguage === "Ja, 3-5 sprak") complexityScore += 2;
 else if (data.multiLanguage === "Ja, svenska + engelska") complexityScore += 1;
 if (data.customerPrioritization === "Ja, vi har komplexa prioriteringsregler") complexityScore += 2;
 else if (data.customerPrioritization === "Ja, vi delar in kunder i 2-3 nivaer") complexityScore += 1;
 if (data.multipleProductLines === "Ja, och de kraver specialistkompetens" || data.multipleProductLines === "Ja, mer an 5 produktlinjer") complexityScore += 2;
 else if (data.multipleProductLines === "Ja, 2-5 produktlinjer") complexityScore += 1;

 const transformationLevel = complexityScore >= 9 ? 4 : complexityScore >= 6 ? 3 : complexityScore >= 3 ? 2 : 1;
 const transformationLabels = ["", "Initial service", "Strukturerad service", "Digitaliserad service", "Intelligent service"];
 const transformationComments: Record<number, { text: string; strengths: string[]; gaps: string[] }> = {
 1: { text: "Er serviceorganisation är i ett tidigt skede med begränsat systemstöd och manuella processer. Stor potential att skapa struktur och effektivitet med rätt plattform.", strengths: ["Flexibelt arbetssätt", "Kort beslutsväg"], gaps: ["Ingen strukturerad ärendehantering", "Begränsad uppföljning", "Manuella processer", "Saknar self-service"] },
 2: { text: "Er serviceorganisation har grundläggande processer men saknar fullt systemstöd och automatisering. Nästa steg är att samla ärendehantering och data på en plattform.", strengths: ["Etablerade processer", "Viss uppföljning", "Tydlig ansvarsfördelning"], gaps: ["Begränsad integration", "Ingen automatisering", "Begränsad self-service", "Manuell rapportering"] },
 3: { text: "Er serviceorganisation är strukturerad och digitaliserad med tydlig ärendehantering och systemstöd. Automatisering och AI-stöd är ännu inte fullt utnyttjat.", strengths: ["Tydliga SLA och serviceavtal", "Systemstöd för ärendehantering", "Mobil åtkomst för tekniker", "Central uppföljning"], gaps: ["Begränsad automatisering", "Ingen prediktiv planering", "Begränsad self-service", "Manuell samordning med lager"] },
 4: { text: "Er serviceorganisation är mogen och datadriven med hög automationsgrad och AI-stöd. Fokus handlar om att förfina och optimera snarare än att bygga grundstruktur.", strengths: ["Hög automationsgrad", "AI-drivet beslutsstöd", "Proaktiv och prediktiv service", "Sömlösa integrationer"], gaps: ["Kontinuerlig optimering av AI", "Skalning till nya marknader"] },
 };
 const tData = transformationComments[transformationLevel];

 checkPage(40);
 addSectionHeader("SERVICEMOGNAD – SERVICE TRANSFORMATION LEVEL", 5, 150, 105);
 pdf.setFontSize(8);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(120, 120, 120);
 pdf.text("Service Transformation Level", margin, yPos);
 yPos += 6;
 for (let i = 1; i <= 4; i++) {
 if (i <= transformationLevel) pdf.setFillColor(5, 150, 105);
 else pdf.setFillColor(220, 220, 220);
 pdf.circle(margin + (i - 1) * 10 + 3, yPos, 3, "F");
 }
 yPos += 6;
 pdf.setFontSize(13);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(51, 51, 51);
 pdf.text(`Nivå ${transformationLevel} – ${transformationLabels[transformationLevel]}`, margin, yPos);
 yPos += 8;

 // ══════════════════════════════════════════════════════════════════════
 // 3. BEDOMNING
 // ══════════════════════════════════════════════════════════════════════
 checkPage(40);
 addSectionHeader("BEDÖMNING", 80, 80, 100);
 if (aiAnalysis?.serviceInterpretation) {
 addParagraphs(aiAnalysis.serviceInterpretation, 9.5);
 } else {
 addTextBlock(tData.text);
 }

 // ══════════════════════════════════════════════════════════════════════
 // 4. STYRKOR + UTVECKLINGSOMRADEN (side by side)
 // ══════════════════════════════════════════════════════════════════════
 checkPage(50);
 const colW2 = (contentWidth - 4) / 2;
 pdf.setFillColor(22, 163, 74);
 pdf.roundedRect(margin, yPos, colW2, 8, 2, 2, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(8);
 pdf.setFont("helvetica", "bold");
 pdf.text("STYRKOR", margin + 4, yPos + 5.5);

 pdf.setFillColor(245, 158, 11);
 pdf.roundedRect(margin + colW2 + 4, yPos, colW2, 8, 2, 2, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.text("UTVECKLINGSOMRÅDEN", margin + colW2 + 8, yPos + 5.5);
 yPos += 12;

 const maxItems = Math.max(tData.strengths.length, tData.gaps.length);
 pdf.setFontSize(8);
 pdf.setFont("helvetica", "normal");
 for (let i = 0; i < maxItems; i++) {
 checkPage(8);
 if (i < tData.strengths.length) {
 pdf.setTextColor(22, 163, 74);
 pdf.text("-", margin + 2, yPos);
 pdf.setTextColor(51, 51, 51);
 const sLines = pdf.splitTextToSize(tData.strengths[i], colW2 - 8);
 pdf.text(sLines, margin + 6, yPos);
 }
 if (i < tData.gaps.length) {
 pdf.setTextColor(245, 158, 11);
 pdf.text("-", margin + colW2 + 6, yPos);
 pdf.setTextColor(51, 51, 51);
 const gLines = pdf.splitTextToSize(tData.gaps[i], colW2 - 8);
 pdf.text(gLines, margin + colW2 + 10, yPos);
 }
 yPos += 6;
 }
 yPos += 8;

 // ══════════════════════════════════════════════════════════════════════
 // 5. REKOMMENDERAD LOSNINGSINRIKTNING
 // ══════════════════════════════════════════════════════════════════════
 if (recommendation.products.length > 0) {
 checkPage(60);
 addSectionHeader("REKOMMENDERAD LÖSNINGSINRIKTNING", 30, 58, 138);

 const focusMap: Record<string, string[]> = {
 "Dynamics 365 Customer Service": ["Central ärendehantering", "Omnichannel och kanalsamordning", "AI-assisterade kundservicemedarbetare och kunskapsbas"],
 "Dynamics 365 Field Service": ["Schemaläggning och mobilt teknikerstöd", "IoT och prediktivt underhåll", "Arbetsorder och reservdelshantering"],
 "Dynamics 365 Contact Center": ["Multikanalhantering och röstintegration", "Realtidsdashboard och supervisor-styrning", "AI-driven ärenderouting och chattbot"],
 };
 const seen = new Set<string>();
 const focuses = recommendation.products.slice(0, 3).flatMap(p => focusMap[p.name] || []).filter(f => { if (seen.has(f)) return false; seen.add(f); return true; }).slice(0, 5);

 pdf.setFontSize(9);
 pdf.setFont("helvetica", "italic");
 pdf.setTextColor(80, 80, 80);
 pdf.text("Baserat på er kundserviceprofil rekommenderas en lösning med fokus på:", margin, yPos);
 yPos += 7;

 focuses.forEach((item) => {
 checkPage(10);
 pdf.setFillColor(240, 245, 255);
 pdf.roundedRect(margin + 2, yPos - 3, contentWidth - 4, 8, 1, 1, 'F');
 pdf.setFontSize(8.5);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(51, 51, 51);
 pdf.text(` ${item}`, margin + 5, yPos + 1);
 yPos += 9;
 });
 yPos += 4;

 // "Bakom kulisserna" pill
 pdf.setFontSize(7);
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(120, 120, 120);
 pdf.text("Bakom kulisserna lutar det mot:", margin, yPos);
 yPos += 5;
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(51, 51, 51);
 recommendation.products.slice(0, 3).forEach((p, i) => { checkPage(7); pdf.text(`${i + 1}. ${p.name}`, margin + 3, yPos); yPos += 6; });
 yPos += 4;
 }

 // ══════════════════════════════════════════════════════════════════════
 // DATAMOGNAD FÖR AI OCH AGENTER
 // ══════════════════════════════════════════════════════════════════════
 checkPage(40);
 addSectionHeader("DATAMOGNAD FÖR AI OCH AGENTER", 99, 102, 241);
 pdf.setFontSize(11);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(51, 51, 51);
 pdf.text(`Nivå: ${dataMat.level}`, margin, yPos);
 yPos += 7;
 addTextBlock(dataMat.description);

 // AI-/AGENTPOTENTIAL
 checkPage(40);
 addSectionHeader("AI-, AUTOMATIONS- OCH AGENTPOTENTIAL", 124, 58, 237);
 pdf.setFontSize(11);
 pdf.setFont("helvetica", "bold");
 pdf.setTextColor(51, 51, 51);
 pdf.text(`Nivå: ${aiPot.level}`, margin, yPos);
 yPos += 7;
 addTextBlock(aiPot.description);

 // AI-genererad fördjupad analys av datamognad & AI-potential (paragrafer)
 if (aiAnalysis?.dataAndAiAnalysis) {
 addParagraphs(aiAnalysis.dataAndAiAnalysis, 9.5);
 }

 if (data.aiUseCases.length > 0 && dataMat.level === "Låg") {
 addTextBlock("AI-intresset finns, men datamognaden är ännu inte tillräcklig för mer avancerade AI-agenter. Första steget bör vara att förbättra datakvalitet, datamodell, integrationer och dataägarskap.");
 }

 // REKOMMENDERAD FÖRDJUPNING: AI ASSESSMENT
 if (recommendAiAssessment) {
 checkPage(40);
 addSectionHeader("REKOMMENDERAD FÖRDJUPNING: AI ASSESSMENT", 168, 85, 247);
 addTextBlock("Dina svar visar att AI, automation eller agenter kan vara relevanta i den fortsatta lösningsdiskussionen. Samtidigt kräver AI och agenter god datakvalitet, tydliga processer, rätt behörigheter, integrationer och kontrollpunkter. Vi rekommenderar därför att du genomför ett separat AI Assessment som nästa steg för att bedöma AI-mognad, datagrund, möjliga use cases och risker innan AI eller agenter byggs in i lösningen.");
 } else if (data.aiUseCases.length === 0) {
 checkPage(20);
 addTextBlock("AI och agenter kan bevakas som framtida möjlighet, men bör sannolikt inte vara första prioritet i nästa steg.");
 }

 // PRELIMINÄR LÖSNINGSINRIKTNING
 checkPage(40);
 addSectionHeader("PRELIMINÄR LÖSNINGSINRIKTNING", 30, 58, 138);
 if (aiAnalysis?.solutionHypothesis) {
 addParagraphs(aiAnalysis.solutionHypothesis, 9.5);
 } else {
 addTextBlock(focusCfg.solutionHypothesis);
 }
 addTextBlock("Detta är en preliminär lösningshypotes baserad på dina svar. Ett slutligt val av Dynamics 365-applikationer, tillägg, AI-stöd och integrationsarkitektur bör föregås av en fördjupad fit-gap, kravspecifikation och partnerdialog.");

 // ══════════════════════════════════════════════════════════════════════
 // REKOMMENDERAD PARTNERPROFIL (focus-driven)
 // ══════════════════════════════════════════════════════════════════════
 checkPage(40);
 addSectionHeader("REKOMMENDERAD PARTNERPROFIL", 30, 58, 138);
 if (aiAnalysis?.partnerProfile) {
 addParagraphs(aiAnalysis.partnerProfile, 9.5);
 yPos += 2;
 }
 addTextBlock("Partnern bör ha erfarenhet av:");
 addBulletList(focusCfg.partnerProfile);
 if (recommendAiAssessment) {
 addTextBlock("Partnern bör även kunna bedöma datamognad, AI-use cases, Copilot Studio, agentarkitektur, behörigheter, loggning och kontrollpunkter. Om datamognaden är låg bör partnern kunna hjälpa till med datakvalitet och processförberedelser innan mer avancerade AI-agenter införs.");
 }

 // REKOMMENDERADE NÄSTA STEG
 checkPage(40);
 addSectionHeader("REKOMMENDERADE NÄSTA STEG", 5, 150, 105);
 const aiNext = aiAnalysis?.nextSteps && aiAnalysis.nextSteps.length > 0 ? aiAnalysis.nextSteps : focusCfg.nextSteps;
 const nextStepsList = [...aiNext];
 if (recommendAiAssessment && !nextStepsList.some((s) => s.toLowerCase().includes("ai assessment"))) {
 nextStepsList.push("Genomför AI Assessment innan AI/agenter byggs in i lösningen.");
 }
 addBulletList(nextStepsList);

 // RISKER & FRÅGOR ATT UTREDA
 if (aiAnalysis?.risks && aiAnalysis.risks.length > 0) {
 checkPage(40);
 addSectionHeader("RISKER OCH FRÅGOR ATT UTREDA", 220, 90, 50);
 addBulletList(aiAnalysis.risks);
 }

 // DISCLAIMER
 checkPage(30);
 addSectionHeader("DISCLAIMER", 120, 120, 120);
 addTextBlock("Denna rapport är AI-genererad baserat på de svar som har lämnats i behovsanalysen. Rapporten ska ses som ett preliminärt beslutsunderlag och inte som en slutgiltig systemrekommendation. Val av Dynamics 365-applikationer, tillägg, AI-stöd, integrationslösningar och partner bör föregås av en fördjupad analys, kravspecifikation och partnerdialog. Om AI eller agenter ska användas bör datamognad, behörigheter, governance och kontrollpunkter bedömas särskilt, exempelvis genom ett separat AI Assessment.");



 // ── APPENDIX ─────────────────────────────────────────────────────────────
 pdf.addPage();
 yPos = margin;
 pdf.setFillColor(114, 73, 198);
 pdf.rect(0, 0, pageWidth, 24, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(13);
 pdf.setFont("helvetica", "bold");
 pdf.text("BILAGA - DINA SVAR", margin, 16);
 yPos = 32;

 const addAppendixSection = (title: string, rows: [string, string][]) => {
 checkPage(14);
 pdf.setFontSize(9);
 pdf.setFont("helvetica", "bold");
 pdf.setFillColor(230, 235, 245);
 pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
 pdf.setTextColor(30, 58, 138);
 pdf.text(title, margin + 2, yPos);
 yPos += 8;
 pdf.setFont("helvetica", "normal");
 pdf.setTextColor(51, 51, 51);
 let shade = false;
 rows.forEach(([l, v]) => { addKVRow(l, v || "", shade); shade = !shade; });
 yPos += 3;
 };

 addAppendixSection("Steg 1 – Företagsinformation", [
 ["Antal anställda", data.employees],
 ["Bransch", data.industry === "Annat" ? data.industryOther : data.industry],
 ["Serviceteam-storlek", data.serviceTeamSize],
 ["Antal agenter", data.numberOfAgents],
 ["Nuvarande system", data.currentSystems.filter(s => s.product.trim()).map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ")],
 ["Övriga system (detaljer)", data.otherSystemsDetails || ""],
 ]);

 addAppendixSection("Steg 2 – Service-modell", [
 ["Servicekanaler", (data.serviceChannels || []).join(", ")],
 ["Serviceupplägg", data.serviceModel],
 ]);

 const csChallengeStr = Object.entries(data.situationChallenges || {})
 .filter(([, v]) => v)
 .map(([k, v]) => `${k}: ${v}`)
 .join("; ");

 addAppendixSection("Steg 3 – Situation & komplexitet", [
 ["Anledning till nuläge", data.currentSituationReason || ""],
 ["Utmaningar i nuläget", csChallengeStr],
 ["Ärendevolym/mån", data.ticketsPerMonth],
 ["SLA-krav", data.slaRequirements || data.serviceAgreements],
 ["Self-service portal", data.selfServicePortal],
 ["Kunskapsdatabas", data.knowledgeBase],
 ["Inkommande volym/dag", data.inboundVolume],
 ["Contact center-kanaler", data.contactCenterChannels?.join(", ")],
 ["Realtidsstyrning (CC)", data.realtimeManagement],
 ["Antal tekniker", data.numberOfTechnicians],
 ["Schemaläggning", data.schedulingNeeds],
 ["Reservdelshantering", data.sparepartsManagement],
 ["Geografisk spridning", data.geographicSpread],
 ["Verkar i flera länder", data.multiCountry],
 ["Flerspråkig kundservice", data.multiLanguage],
 ["Kundprioritering", data.customerPrioritization],
 ["Produktlinjer", data.multipleProductLines],
 ["Kundservice-KPI:er", (data.csKpis || []).join(", ")],
 ["Contact Center-KPI:er", (data.ccKpis || []).join(", ")],
 ["Fältservice-KPI:er", (data.fsKpis || []).join(", ")],
 ["Diagnostiska utmaningar (Osäkert)", (data.unsureIssues || []).join(", ")],
 ]);

 // Field Service section (only if relevant)
 if (data.hasFieldService || (data.fieldServiceNeeds || []).length > 0 || data.fieldServiceNeedsOther) {
 const fsNeeds = [...(data.fieldServiceNeeds || [])];
 if (data.fieldServiceNeedsOther?.trim()) fsNeeds.push(`Övriga: ${data.fieldServiceNeedsOther.trim()}`);
 addAppendixSection("Steg 3b – Fältservice", [
 ["Har du fältservice?", data.hasFieldService || ""],
 ["Fältservice-behov", fsNeeds.join(", ")],
 ]);
 }

 addAppendixSection("Steg 4 – Organisation & styrning", [
 ["Org-struktur", data.orgStructure],
 ["Gemensam rapportering", data.sharedReporting],
 ["Realtidsrapportering", data.realtimeReporting],
 ["Integration med sälj/ERP", data.integratedWithSalesErp],
 ]);

 addAppendixSection("Steg 5 – Data, integrationer & datamognad", [
 ["Systemkopplingar", integList.join(", ")],
 ["Datamognad", data.dataMaturity],
 ["Datatillförlitlighet", data.dataReliability],
 ["Dataägarskap", data.dataOwnership],
 ["Behörigheter/åtkomst", data.dataAccessControls],
 ]);

 addAppendixSection("Steg 6 – AI, automation & agenter", [
 ["AI-intresse", data.aiInterest || ""],
 ["AI-användningsområden", data.aiUseCases?.join(", ")],
 ["AI – egna kommentarer", data.aiDetails || ""],
 ["AI-automationsfunktioner", data.aiAutomation?.join(", ")],
 ["AI-/agentautonomi", data.aiAutonomy || ""],
 ["Kontrollpunkter för AI/agenter", (data.aiControls || []).join(", ")],
 ]);

 // Övriga noteringar
 const csHasOvrigt = data.wishlist?.trim() || data.decisionTimeline?.trim() || data.additionalInfo?.trim() || data.currentPartners?.trim();
 if (csHasOvrigt) {
 addAppendixSection("Övriga noteringar", [
 ["Önskelista", data.wishlist || ""],
 ["Beslutstidpunkt", data.decisionTimeline || ""],
 ["Nuvarande partners", data.currentPartners || ""],
 ["Övrig information", data.additionalInfo || ""],
 ]);
 }

 // Footer
 checkPage(40);
 yPos += 10;
 pdf.setFillColor(30, 58, 138);
 pdf.roundedRect(margin, yPos, contentWidth, 32, 3, 3, 'F');
 pdf.setTextColor(255, 255, 255);
 pdf.setFontSize(11);
 pdf.setFont("helvetica", "bold");
 pdf.text("Dynamic Factory", margin + 8, yPos + 10);
 pdf.setFont("helvetica", "normal");
 pdf.setFontSize(9);
 pdf.text("Din köparsidiga vägledning till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
 pdf.text("+46 72 232 40 60", pageWidth - margin - 55, yPos + 10);
 pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 18);
 pdf.text("d365.se", pageWidth - margin - 55, yPos + 26);

 // Föreslagna partners – avslutande sida
 try {
 const _industry = data.industry === "Annat" ? data.industryOther : data.industry;
 const _suggested = pickSuggestedPartners(allPartners, { product: "service", industry: _industry, limit: 5 });
 const _origin = typeof window !== "undefined" ? window.location.origin : "https://d365.se";
 const _compareUrl = _origin + buildCompareUrl(_suggested.map(p => p.slug));
 appendSuggestedPartnersPage(pdf, _suggested.map(p => ({
 name: p.name, slug: p.slug,
 positioning: (p as any).positioning_statement, description: p.description,
 })), { compareUrl: _compareUrl, productLabel: "Customer Service", industry: _industry });
 } catch (e) { console.warn("Suggested partners append failed", e); }

 const pdfFilename = `Behovsanalys_${focusCfg.pdfSubTitle.replace(/[^a-zA-ZåäöÅÄÖ0-9]+/g, "_")}_${data.companyName || 'Analys'}_${new Date().toISOString().split('T')[0]}`;
 const pdfBase64 = pdf.output('datauristring').split(',')[1];
 pdf.save(`${pdfFilename}.pdf`);

 setIsSendingEmail(true);
 try {
 await supabase.functions.invoke("send-analysis-email", {
 body: {
 analysisType: focusCfg.emailAnalysisType,
 companyName: data.companyName,
 contactName: data.contactName,
 phone: data.phone || "",
 email: data.email,
 analysisData: {
 "Servicemodell": data.serviceModel,
 "Servicemognad": `Nivå ${transformationLevel} – ${transformationLabels[transformationLevel]}`,
 "Anställda": data.employees,
 "Bransch": data.industry === "Annat" ? data.industryOther : data.industry,
 "Serviceteam": data.serviceTeamSize,
 "Rekommenderade produkter": recommendation.products.map(p => p.name).join(", "),
 },
 recommendation: recommendation.products.length > 0 ? {
 product: recommendation.products.map(p => p.name).join(", "),
 reasons: recommendation.products.flatMap(p => p.reasons).slice(0, 5),
 } : undefined,
 pdfBase64,
 pdfFilename,
 },
 });
 } catch (error) {
 console.error("Failed to send email:", error);
 } finally {
 setIsSendingEmail(false);
 }
 setIsComplete(true);
 };

 const renderStep = () => {
 switch (currentStep) {
 case 1:
 return (
 <div className="space-y-6">
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur många anställda har du?</Label>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {employeeOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.employees === opt} onClick={() => setData({ ...data, employees: opt })} type="radio" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilken bransch verkar du i?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {industryOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.industry === opt} onClick={() => setData({ ...data, industry: opt })} type="radio" />
 ))}
 <SelectionCard label="Annat" selected={data.industry === "Annat"} onClick={() => setData({ ...data, industry: "Annat" })} type="radio" />
 </div>
 {data.industry === "Annat" && (
 <div className="mt-3">
 <Label>Ange bransch</Label>
 <Input value={data.industryOther} onChange={(e) => setData({ ...data, industryOther: e.target.value })} placeholder="Beskriv din bransch" />
 </div>
 )}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur stort är ditt kundserviceteam?</Label>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {teamSizeOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.serviceTeamSize === opt} onClick={() => setData({ ...data, serviceTeamSize: opt })} type="radio" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka system använder du idag för kundservice? (valfritt)</Label>
 <div className="space-y-3">
 {data.currentSystems.map((sys, index) => (
 <div key={index} className="grid grid-cols-2 gap-3">
 <Input value={sys.product} onChange={(e) => { const updated = [...data.currentSystems]; updated[index] = { ...updated[index], product: e.target.value }; setData({ ...data, currentSystems: updated }); }} placeholder={`System ${index + 1}`} />
 <Input value={sys.year} onChange={(e) => { const updated = [...data.currentSystems]; updated[index] = { ...updated[index], year: e.target.value }; setData({ ...data, currentSystems: updated }); }} placeholder="Implementeringsår" />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 case 2:
 return (
 <div className="space-y-6">
 <div>
 <Label className="text-base font-semibold mb-1 block">Vilket område gäller behovsanalysen främst?</Label>
 <p className="text-sm text-muted-foreground mb-4">Välj det område som bäst beskriver ditt nuläge. Svaren styr vilka följdfrågor som visas och hur analysen tolkar din preliminära lösningsinriktning.</p>
 <div className="grid grid-cols-1 gap-3">
 {[
 { value: "Ärendebaserad kundservice", label: "Kundservice / Ärendehantering", description: "Kunder kontaktar dig och du hanterar ärenden, SLA, kunskapsdatabas och eskaleringar" },
 { value: "Fältservice med tekniker", label: "Fältservice / Tekniker och serviceuppdrag", description: "Service utförs hos kund med teknikerplanering, installerad bas och reservdelar" },
 { value: "Volymbaserad kundservice / Contact Center", label: "Contact Center / Telefoni, chatt och omnichannel", description: "Hög volym av inkommande kontakter via flera kanaler, agentstöd och routing" },
 { value: "Kombination av flera", label: "Flera av områdena ovan", description: "Sammanhängande flöde mellan contact center, kundservice och/eller fältservice" },
 { value: "Osäkert – vi vill förstå behovet bättre", label: "Osäkert – vi vill förstå behovet bättre", description: "Vi vill att analysen hjälper oss förstå vilket område som behöver mest fokus" },
 ].map((option) => (
 <SelectionCard key={option.value} label={option.label} description={option.description} selected={data.serviceModel === option.value} onClick={() => setData({ ...data, serviceModel: option.value })} type="radio" />
 ))}
 </div>
 </div>

 {data.serviceModel === "Osäkert – vi vill förstå behovet bättre" && (
 <div>
 <Label className="text-base font-semibold mb-1 block">Var upplever du störst problem idag?</Label>
 <p className="text-sm text-muted-foreground mb-4">Välj alla som stämmer. Analysen använder svaren för att föreslå vilket område som verkar mest centralt.</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {unsureIssueOptions.map((opt) => (
 <SelectionCard
 key={opt}
 label={opt}
 selected={data.unsureIssues.includes(opt)}
 onClick={() => handleCheckboxChange("unsureIssues", opt)}
 type="checkbox"
 />
 ))}
 </div>
 </div>
 )}
 </div>
 );


 case 3: {
 const fk = getFocusKey(data);
 const showCs = fk === "customer_service" || fk === "multi";
 const showCc = fk === "contact_center" || fk === "multi";
 const showFs = fk === "field_service" || fk === "multi";
 const focusLabel =
 fk === "customer_service" ? "Kundservice / Ärendehantering"
 : fk === "contact_center" ? "Contact Center"
 : fk === "field_service" ? "Fältservice"
 : "Kundservice, Contact Center och Fältservice";

 const makeRadioGroup = (field: keyof CustomerServiceAnalysisData, options: string[]) => (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {options.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data[field] === opt} onClick={() => setData({ ...data, [field]: opt })} type="radio" />
 ))}
 </div>
 );

 return (
 <div className="space-y-8">
 <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
 <p className="text-sm text-primary font-medium">📋 Frågorna nedan är anpassade för: <span className="font-bold">{focusLabel}</span></p>
 </div>

 {showCs && (
 <>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur många ärenden hanterar du per månad?</Label>
 {makeRadioGroup("ticketsPerMonth", ["Färre än 100", "100–500", "500–2 000", "2 000–10 000", "Mer än 10 000"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka KPI:er är viktigast för kundservicen?</Label>
 <p className="text-sm text-muted-foreground mb-3">Välj de mått du följer eller vill kunna följa.</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["SLA-uppfyllnad", "First Contact Resolution (FCR)", "Genomsnittlig hanteringstid (AHT)", "Backlog / öppna ärenden", "Kundnöjdhet (CSAT)", "NPS", "Återöppnade ärenden"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={(data.csKpis || []).includes(opt)} onClick={() => handleCheckboxChange("csKpis", opt)} type="checkbox" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Har du SLA-krav eller avtalade svarstider?</Label>
 {makeRadioGroup("slaRequirements", ["Nej, vi hanterar ärenden i den ordning de kommer", "Ja, informella mål men inga kontrakt", "Ja, strikta krav med avtalade svarstider"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Har du en self-service portal för kunder?</Label>
 {makeRadioGroup("selfServicePortal", ["Ja, kunder kan logga in och se sina ärenden", "Nej, men vi vill ha det", "Nej, och vi behöver det inte"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur ser din kunskapsdatabas ut idag?</Label>
 {makeRadioGroup("knowledgeBase", ["Ja, strukturerad och tillgänglig för alla", "Delvis – spridd i dokument och e-post", "Nej, kunskapen sitter hos individerna"])}
 </div>
 </>
 )}

 {showCc && (
 <>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur hög är din inkommande volym per dag?</Label>
 {makeRadioGroup("inboundVolume", ["Färre än 100 kontakter/dag", "100–500 kontakter/dag", "500–2 000 kontakter/dag", "Mer än 2 000 kontakter/dag"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka kanaler hanterar du? (välj alla som gäller)</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Röst/telefoni", "E-post", "Live chat", "Social media", "SMS", "WhatsApp / Messenger", "Videomöte"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.contactCenterChannels.includes(opt)} onClick={() => handleCheckboxChange("contactCenterChannels", opt)} type="checkbox" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka KPI:er är viktigast för ditt contact center?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Service Level (% besvarade inom X sek)", "Average Speed of Answer (ASA)", "Abandonment rate", "Genomsnittlig hanteringstid (AHT)", "Occupancy / utnyttjandegrad", "Kundnöjdhet (CSAT)", "First Contact Resolution"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={(data.ccKpis || []).includes(opt)} onClick={() => handleCheckboxChange("ccKpis", opt)} type="checkbox" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Behöver du realtidsstyrning och supervisor-dashboard?</Label>
 {makeRadioGroup("realtimeManagement", ["Ja, kritiskt för oss", "Vore bra men inte krav", "Nej, vi behöver det inte"])}
 </div>
 </>
 )}

 {showFs && (
 <>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka KPI:er är viktigast för fältservicen?</Label>
 <p className="text-sm text-muted-foreground mb-3">Detaljerade fältservice-frågor kommer i nästa steg.</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["First Time Fix Rate", "Mean Time To Repair (MTTR)", "Teknikerutnyttjande", "Jobb per tekniker och dag", "Restid vs arbetstid", "SLA på serviceavtal", "Kundnöjdhet efter besök"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={(data.fsKpis || []).includes(opt)} onClick={() => handleCheckboxChange("fsKpis", opt)} type="checkbox" />
 ))}
 </div>
 </div>
 </>
 )}

 <div>
 <Label className="text-base font-semibold mb-3 block">Verkar du i flera länder?</Label>
 {makeRadioGroup("multiCountry", ["Nej, bara Sverige", "Ja, Norden", "Ja, Europa", "Ja, globalt"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Erbjuder du kundservice på flera språk?</Label>
 {makeRadioGroup("multiLanguage", ["Nej, bara svenska", "Ja, svenska + engelska", "Ja, 3–5 språk", "Ja, mer än 5 språk"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Har du SLA-kontrakt med kunder?</Label>
 {makeRadioGroup("slaContracts", ["Nej, inga formella SLA", "Ja, informella mål", "Ja, kontraktuella SLA eventuellt med viten", "Ja, komplexa SLA per kundsegment"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Prioriterar du kunder olika beroende på kundtyp/avtal?</Label>
 {makeRadioGroup("customerPrioritization", ["Nej, alla kunder behandlas lika", "Ja, vi delar in kunder i 2–3 nivåer", "Ja, vi har komplexa prioriteringsregler"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur många produktlinjer/tjänster stödjer du?</Label>
 {makeRadioGroup("multipleProductLines", ["En enda produkt/tjänst", "Ja, 2–5 produktlinjer", "Ja, mer än 5 produktlinjer", "Ja, och de kräver specialistkompetens"])}
 </div>
 </div>
 );
 }

 case 4: {
 const makeRadioGroup4 = (field: keyof CustomerServiceAnalysisData, options: string[]) => (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {options.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data[field] === opt} onClick={() => setData({ ...data, [field]: opt })} type="radio" />
 ))}
 </div>
 );
 const hasNoFieldTechnicians = data.numberOfTechnicians === "Vi har inga fältservicetekniker";
 return (
 <div className="space-y-8">
 <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
 <p className="text-sm text-primary font-medium">🔧 Har du tekniker som arbetar ute hos kund?</p>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur många tekniker har du i fält?</Label>
 {makeRadioGroup4("numberOfTechnicians", ["Vi har inga fältservicetekniker", "Färre än 10 tekniker", "10–50 tekniker", "51–200 tekniker", "Mer än 200 tekniker"])}
 </div>
 {!hasNoFieldTechnicians && data.numberOfTechnicians && (
 <>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur sker schemaläggning av servicebesök idag?</Label>
 {makeRadioGroup4("schedulingNeeds", ["Manuellt via telefon/mail", "Excel eller enklare verktyg", "Dedikerat schemaläggningssystem", "Optimerat med AI/automatisering"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur viktig är reservdelshantering?</Label>
 {makeRadioGroup4("sparepartsManagement", ["Inte relevant", "Viktigt men inte kritiskt", "Kritisk – tekniker måste ha rätt delar vid besöket"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Har du serviceavtal med garanterade svarstider?</Label>
 {makeRadioGroup4("serviceAgreements", ["Nej, inga formella avtal", "Ja, informella SLA", "Ja, med garanterade svarstider och tillgänglighet"])}
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur stor är din geografiska spridning?</Label>
 {makeRadioGroup4("geographicSpread", ["Lokalt – en stad/region", "Regionalt – delar av Sverige", "Nationellt – hela Sverige", "Nordiska länder", "Globalt"])}
 </div>
 </>
 )}
 </div>
 );
 }

 case 5:
 return (
 <div className="space-y-8">
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur är er serviceorganisation strukturerad?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Central – ett team för alla marknader", "Lokal – varje land/region har sitt eget team", "Hybrid – central styrning, lokalt utförande", "Decentraliserad – varje enhet bestämmer själv"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.orgStructure === opt} onClick={() => setData({ ...data, orgStructure: opt })} type="radio" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Behöver ledningen en samlad bild av serviceverksamheten?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Ja, ledningen behöver samlad bild", "Nej, varje enhet rapporterar separat"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.sharedReporting === opt} onClick={() => setData({ ...data, sharedReporting: opt })} type="radio" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur viktigt är realtidsrapportering och live-dashboards?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Ja, kritiskt – vi behöver live-dashboards", "Viktigt men inte akut", "Nej, dagliga/veckovisa rapporter räcker"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.realtimeReporting === opt} onClick={() => setData({ ...data, realtimeReporting: opt })} type="radio" />
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Hur integrerat behöver kundservice vara med sälj och ERP?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {["Ja, tätt integrerat – en plattform", "Ja, integration via API eller middleware", "Nej, de är separata system", "Vet inte ännu"].map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.integratedWithSalesErp === opt} onClick={() => setData({ ...data, integratedWithSalesErp: opt })} type="radio" />
 ))}
 </div>
 </div>
 </div>
 );

 case 6:
 return (
 <div className="space-y-8">
 <div>
 <Label className="text-base font-semibold mb-1 block">Data, kundhistorik och integrationer</Label>
 <p className="text-sm text-muted-foreground mb-4">AI, automation och en sammanhängande serviceupplevelse kräver att kunddata, ärendehistorik, serviceinformation och integrationer håller tillräcklig kvalitet.</p>
 <Label className="text-sm font-medium mb-2 block">Vilka system behöver serviceflödet kopplas till? (välj alla som gäller)</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {[
 { id: "erp", label: "ERP / affärssystem" },
 { id: "crm_sales", label: "CRM" },
 { id: "telefoni", label: "Telefoni / Contact Center-plattform" },
 { id: "email", label: "E-post" },
 { id: "chat", label: "Chatt" },
 { id: "portal", label: "Webb / kundportal" },
 { id: "field_service_ext", label: "Field service / mobilapp" },
 { id: "lager", label: "Lager / reservdelar" },
 { id: "fakturering", label: "Fakturering" },
 { id: "e_handel", label: "E-handel" },
 { id: "iot", label: "IoT / uppkopplade produkter" },
 { id: "powerbi", label: "Power BI / rapportering" },
 { id: "datawarehouse", label: "Data warehouse / lakehouse" },
 { id: "sharepoint", label: "SharePoint / dokument" },
 { id: "knowledge", label: "Kunskapsdatabas" },
 { id: "annat", label: "Annat" },
 ]
 .filter((opt) => !(isServicesIndustry(data.industry) && (opt.id === "lager" || opt.id === "e_handel" || opt.id === "iot")))
 .map((opt) => (
 <SelectionCard key={opt.id} label={opt.label} selected={data.systemDependencies.includes(opt.id)} onClick={() => handleCheckboxChange("systemDependencies", opt.id)} type="checkbox" />
 ))}
 </div>
 </div>

 <div className="border-t pt-6">
 <Label className="text-base font-semibold mb-1 block">Datamognad för AI och agenter</Label>
 <p className="text-sm text-muted-foreground mb-4">Bedömningen påverkar AI-/agentpotential, risknivå och rekommenderad partnerprofil.</p>

 <Label className="text-sm font-medium mb-2 block">Har du tillräcklig ordning på den data som AI eller agenter skulle behöva använda?</Label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
 {dataMaturityOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.dataMaturity === opt} onClick={() => setData({ ...data, dataMaturity: opt })} type="radio" />
 ))}
 </div>

 <Label className="text-sm font-medium mb-2 block">Hur tillförlitligt är ditt underlag (kund-, ärende-, service-, kunskapsdata) idag?</Label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
 {dataReliabilityOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.dataReliability === opt} onClick={() => setData({ ...data, dataReliability: opt })} type="radio" />
 ))}
 </div>

 <Label className="text-sm font-medium mb-2 block">Finns tydligt dataägarskap?</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
 {dataOwnershipOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.dataOwnership === opt} onClick={() => setData({ ...data, dataOwnership: opt })} type="radio" />
 ))}
 </div>

 <Label className="text-sm font-medium mb-2 block">Finns tydliga behörigheter och åtkomstregler?</Label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {dataAccessControlOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.dataAccessControls === opt} onClick={() => setData({ ...data, dataAccessControls: opt })} type="radio" />
 ))}
 </div>
 </div>
 </div>
 );



 case 7:
 return (
 <div className="space-y-6">
 <div>
 <Label className="text-base font-semibold mb-1 block">Vilka AI-användningsområden är intressanta för din?</Label>
 <p className="text-sm text-muted-foreground mb-4">Välj alla som känns relevanta för din serviceverksamhet</p>
 <div className="space-y-3">
 {aiUseCaseCategories.map((cat) => (
 <div
 key={cat.id}
 onClick={() => handleCheckboxChange("aiUseCases", cat.id)}
 className={`p-4 rounded border-2 cursor-pointer transition-all ${data.aiUseCases.includes(cat.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
 >
 <div className="flex items-start gap-3">
 <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center ${data.aiUseCases.includes(cat.id) ? "bg-primary border-primary" : "border-muted-foreground"}`}>
 {data.aiUseCases.includes(cat.id) && <span className="text-primary-foreground text-xs">✓</span>}
 </div>
 <div>
 <p className="font-semibold text-sm text-foreground">{cat.title}</p>
 <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
 <p className="text-xs text-primary mt-1 font-medium">{cat.benefit}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka automatiseringsfunktioner prioriterar du? (välj alla som gäller)</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {[
 { id: "auto_routing", label: "Automatisk ärenderouting" },
 { id: "ai_responses", label: "AI-assisterade svar" },
 { id: "predictive_maintenance", label: "Prediktivt underhåll" },
 { id: "chatbot_selfservice", label: "Chattbot/self-service" },
 { id: "quality_monitoring", label: "Kvalitetsövervakning" },
 { id: "workforce_planning", label: "Bemanningsplanering" },
 ].map((opt) => (
 <SelectionCard key={opt.id} label={opt.label} selected={data.aiAutomation.includes(opt.id)} onClick={() => handleCheckboxChange("aiAutomation", opt.id)} type="checkbox" />
 ))}
 </div>
 </div>

 <div className="border-t pt-6">
 <Label className="text-base font-semibold mb-1 block">Hur långt vill du att AI/agenter ska få agera?</Label>
 <p className="text-sm text-muted-foreground mb-3">AI och agenter kan effektivisera serviceflöden, men nyttan beror på datakvalitet, processer, integrationer, behörigheter och kontrollpunkter.</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {aiAutonomyOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.aiAutonomy === opt} onClick={() => setData({ ...data, aiAutonomy: opt })} type="radio" />
 ))}
 </div>
 </div>

 <div>
 <Label className="text-base font-semibold mb-3 block">Vilka kontrollpunkter krävs? (välj alla som gäller)</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {aiControlOptions.map((opt) => (
 <SelectionCard key={opt} label={opt} selected={data.aiControls.includes(opt)} onClick={() => handleCheckboxChange("aiControls", opt)} type="checkbox" />
 ))}
 </div>
 </div>
 </div>
 );



 case 8: {
 const rec = getRecommendation();

 let complexityScore2 = 0;
 if (data.ticketsPerMonthComplex === "2 000–10 000" || data.ticketsPerMonthComplex === "Mer än 10 000") complexityScore2 += 2;
 else if (data.ticketsPerMonthComplex === "500–2 000") complexityScore2 += 1;
 if (data.multiCountry === "Ja, globalt" || data.multiCountry === "Ja, Europa") complexityScore2 += 2;
 else if (data.multiCountry === "Ja, Norden") complexityScore2 += 1;
 if (data.multiLanguage === "Ja, mer än 5 språk" || data.multiLanguage === "Ja, 3–5 språk") complexityScore2 += 2;
 else if (data.multiLanguage === "Ja, svenska + engelska") complexityScore2 += 1;
 if (data.slaContracts === "Ja, komplexa SLA per kundsegment" || data.slaContracts === "Ja, kontraktuella SLA eventuellt med viten") complexityScore2 += 2;
 else if (data.slaContracts === "Ja, informella mål") complexityScore2 += 1;
 if (data.customerPrioritization === "Ja, vi har komplexa prioriteringsregler") complexityScore2 += 2;
 else if (data.customerPrioritization === "Ja, vi delar in kunder i 2–3 nivåer") complexityScore2 += 1;
 if (data.multipleProductLines === "Ja, och de kräver specialistkompetens" || data.multipleProductLines === "Ja, mer än 5 produktlinjer") complexityScore2 += 2;
 else if (data.multipleProductLines === "Ja, 2–5 produktlinjer") complexityScore2 += 1;

 const complexityLevel = complexityScore2 >= 8 ? "Hög" : complexityScore2 >= 4 ? "Medel" : "Låg";
 const complexityColor = complexityLevel === "Hög" ? "text-red-600 bg-red-50 border-red-200" : complexityLevel === "Medel" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-green-600 bg-green-50 border-green-200";
 const complexityBar = complexityLevel === "Hög" ? 85 : complexityLevel === "Medel" ? 50 : 20;

 const partnerTypes: { icon: string; label: string; description: string }[] = [];
 const hasFieldService = rec.products.some(p => p.name.includes("Field Service") && p.score > 30);
 const hasContactCenter = rec.products.some(p => p.name.includes("Contact Center") && p.score > 30);
 const hasCustomerService = rec.products.some(p => p.name.includes("Customer Service") && p.score > 30);
 const isEnterprise = complexityLevel === "Hög" || data.multiCountry === "Ja, Europa" || data.multiCountry === "Ja, globalt" || (data.orgStructure || "").includes("Hybrid") || (data.orgStructure || "").includes("Decentraliserad");

 if (hasFieldService) partnerTypes.push({ icon: "🔧", label: "Field Service-specialist", description: "Partner med djup erfarenhet av schemaläggning, mobilt teknikerstöd och fältservice-implementationer" });
 if (hasContactCenter) partnerTypes.push({ icon: "📞", label: "Contact Center-specialist", description: "Partner med kompetens inom omnichannel, röstintegration och volymstyrd kundservice" });
 if (hasCustomerService && !isEnterprise) partnerTypes.push({ icon: "🎧", label: "Customer Service-specialist", description: "Partner med erfarenhet av ärendehantering, knowledge base och Copilot-driven kundservice" });
 if (isEnterprise && (hasCustomerService || hasContactCenter)) partnerTypes.push({ icon: "🏢", label: "Enterprise service-arkitekt", description: "Partner med erfarenhet av komplexa multi-site och enterprise-lösningar" });
 if (partnerTypes.length === 0) partnerTypes.push({ icon: "⚡", label: "Mid-market servicepartner", description: "Partner specialiserad på snabba och kostnadseffektiva implementationer för medelstora organisationer" });

 const transformationLevel2 = complexityScore2 >= 9 ? 4 : complexityScore2 >= 6 ? 3 : complexityScore2 >= 3 ? 2 : 1;
 const transformationLabels2 = ["", "Initial service", "Strukturerad service", "Digitaliserad service", "Intelligent service"];
 const transformationComments: Record<number, { text: string; strengths: string[]; gaps: string[] }> = {
 1: { text: "Er serviceorganisation är i ett tidigt skede med begränsat systemstöd och manuella processer. Det finns stor potential att skapa struktur och effektivitet med rätt plattform.", strengths: ["Flexibelt och anpassningsbart arbetssätt", "Kort beslutsväg i organisationen"], gaps: ["Ingen strukturerad ärendehantering", "Begränsad uppföljning av servicekvalitet", "Manuella processer och spridd information", "Saknar self-service för kunder"] },
 2: { text: "Er serviceorganisation har grundläggande processer på plats men saknar ännu fullt systemstöd och automatisering. Nästa steg är att samla ärendehantering och data på en plattform.", strengths: ["Etablerade serviceprocesser", "Viss uppföljning av ärenden", "Tydlig ansvarsfördelning"], gaps: ["Begränsad integration mellan system", "Ingen automatisering av ärenderouting", "Begränsad self-service för kunder", "Manuell rapportering"] },
 3: { text: "Din serviceorganisation är strukturerad och digitaliserad med tydlig ärendehantering och systemstöd. Du har etablerade processer och uppföljning, men automatisering och AI-stöd är ännu inte fullt utnyttjat.", strengths: ["Tydliga SLA och serviceavtal", "Systemstöd för ärendehantering", "Mobil åtkomst för tekniker", "Central uppföljning av servicekvalitet"], gaps: ["Begränsad automatisering av ärenderouting", "Ingen prediktiv planering", "Begränsad self-service för kunder", "Manuell samordning mellan service och lager"] },
 4: { text: "Er serviceorganisation är mogen och datadrivet med hög grad av automatisering och AI-stöd. Fokus handlar nu om att förfina och optimera snarare än att bygga grundstruktur.", strengths: ["Hög automationsgrad", "AI-drivet beslutsstöd", "Proaktiv och prediktiv service", "Sömlösa integrationer mellan system"], gaps: ["Kontinuerlig optimering av AI-modeller", "Skalning till nya marknader och kanaler"] },
 };
 const transformationData = transformationComments[transformationLevel2];

 const geoLabel2 = data.multiCountry === "Ja, globalt" ? "Global närvaro" : data.multiCountry === "Ja, Europa" ? "Europeisk närvaro" : data.multiCountry === "Ja, Norden" ? "Nordisk närvaro" : "Sverige";
 const inboundHighUI = ["500–2 000 kontakter/dag", "Mer än 2 000 kontakter/dag"];
 const inboundMediumUI = ["100–500 kontakter/dag"];
 const inboundLowUI = ["Färre än 100 kontakter/dag"];
 const volumeLabel =
 (data.ticketsPerMonth === "2 000–10 000" || data.ticketsPerMonth === "Mer än 10 000" || inboundHighUI.includes(data.inboundVolume)) ? "Hög"
 : (data.ticketsPerMonth === "500–2 000" || inboundMediumUI.includes(data.inboundVolume)) ? "Medel"
 : (data.ticketsPerMonth || inboundLowUI.includes(data.inboundVolume)) ? "Låg"
 : "Ej angivet";
 const integrationsList = data.systemDependencies.map((id) => {
 const map: Record<string, string> = { erp: "ERP", iot: "IoT", product_register: "Produktregister", lager: "Lager", fakturering: "Fakturering", crm_sales: "CRM/Sälj", field_service_ext: "Fältservice-system", telefoni: "Telefoni", e_handel: "E-handel", hr: "HR" };
 return map[id] || id;
 });

 const profileMap2: Record<string, { label: string; icon: string; color: string }> = {
 "Ärendebaserad kundservice": { label: "Ärendebaserad service", icon: "📋", color: "text-blue-600" },
 "Volymbaserad kundservice / Contact Center": { label: "Contact Center", icon: "📞", color: "text-purple-600" },
 "Fältservice med tekniker": { label: "Fältservice", icon: "🔧", color: "text-orange-600" },
 "Kombination av flera": { label: "Hybrid service", icon: "🔀", color: "text-indigo-600" },
 };
 const profile = profileMap2[data.serviceModel] || { label: data.serviceModel || "Ej valt", icon: "🎧", color: "text-primary" };

 return (
 <div className="space-y-6">
 <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
 <p className="text-sm text-primary font-medium">🎯 Baserat på dina svar har vi sammanställt din kundserviceprofil. Fyll i kontaktuppgifter nedan för att ladda ner analysen som PDF.</p>
 </div>

 <AnalysisDisclaimer />

 {/* SAMMANFATTNING */}
 <div className="border rounded overflow-hidden ">
 <div className="bg-blue-600 px-5 py-3">
 <h3 className="font-bold text-white text-sm tracking-wide">📄 Sammanfattning</h3>
 </div>
 <div className="p-5 bg-background grid grid-cols-1 sm:grid-cols-2 gap-3">
 {[
 { label: "Serviceprofil", value: profile.label },
 { label: "Geografisk struktur", value: geoLabel2 },
 { label: "Servicevolym", value: volumeLabel },
 { label: "Integrationer", value: integrationsList.length > 0 ? integrationsList.join(" + ") : "Ej angivet" },
 ].map(item => (
 <div key={item.label} className="bg-muted/40 rounded-lg px-4 py-3">
 <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
 <p className="text-sm font-semibold text-foreground">{item.value}</p>
 </div>
 ))}
 </div>
 </div>

 {/* SERVICE TRANSFORMATION LEVEL */}
 <div className="border rounded overflow-hidden ">
 <div className="bg-emerald-600 px-5 py-3">
 <h3 className="font-bold text-white text-sm tracking-wide">🟩 Servicemognad</h3>
 </div>
 <div className="p-5 bg-background space-y-3">
 <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Service Transformation Level</p>
 <div className="flex items-center gap-2">
 {[1, 2, 3, 4].map(i => (
 <span key={i} className={`text-2xl leading-none ${i <= transformationLevel2 ? "text-emerald-500" : "text-muted-foreground/30"}`}>⬤</span>
 ))}
 </div>
 <p className="text-lg font-bold text-foreground">Nivå {transformationLevel2} – {transformationLabels2[transformationLevel2]}</p>
 </div>
 </div>

 {/* KOMMENTAR */}
 <div className="border rounded overflow-hidden ">
 <div className="bg-slate-700 px-5 py-3">
 <h3 className="font-bold text-white text-sm tracking-wide">🧠 Kommentar</h3>
 </div>
 <div className="p-5 bg-background">
 <p className="text-sm text-foreground leading-relaxed">{transformationData.text}</p>
 </div>
 </div>

 {/* STYRKOR + UTVECKLINGSOMRÅDEN */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="border rounded overflow-hidden ">
 <div className="bg-green-600 px-5 py-3">
 <h3 className="font-bold text-white text-sm tracking-wide">🟢 Styrkor</h3>
 </div>
 <ul className="p-5 space-y-2 bg-background">
 {transformationData.strengths.map(s => (
 <li key={s} className="flex items-start gap-2 text-sm text-foreground">
 <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✔</span>{s}
 </li>
 ))}
 </ul>
 </div>
 <div className="border rounded overflow-hidden ">
 <div className="bg-amber-500 px-5 py-3">
 <h3 className="font-bold text-white text-sm tracking-wide">🟡 Utvecklingsområden</h3>
 </div>
 <ul className="p-5 space-y-2 bg-background">
 {transformationData.gaps.map(g => (
 <li key={g} className="flex items-start gap-2 text-sm text-foreground">
 <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">–</span>{g}
 </li>
 ))}
 </ul>
 </div>
 </div>

 <div className="border-t border-border pt-2" />

 {/* Kundserviceprofil */}
 <div className="border rounded p-5 space-y-3 bg-background ">
 <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
 <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>Kundserviceprofil
 </h3>
 <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
 <span className="text-3xl">{profile.icon}</span>
 <div>
 <p className={`text-lg font-bold ${profile.color}`}>{profile.label}</p>
 <p className="text-xs text-muted-foreground">Primär service-modell baserat på dina svar</p>
 </div>
 </div>
 </div>

 {/* Servicekomplexitet */}
 <div className="border rounded p-5 space-y-3 bg-background ">
 <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
 <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>Servicekomplexitet
 </h3>
 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded border font-semibold text-sm ${complexityColor}`}>
 {complexityLevel === "Hög" ? "🔴" : complexityLevel === "Medel" ? "🟡" : "🟢"} {complexityLevel} komplexitet
 </div>
 <div className="space-y-1">
 <div className="flex justify-between text-xs text-muted-foreground"><span>Låg</span><span>Medel</span><span>Hög</span></div>
 <div className="w-full h-2 bg-muted rounded overflow-hidden">
 <div className={`h-full rounded transition-all ${complexityLevel === "Hög" ? "bg-red-500" : complexityLevel === "Medel" ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${complexityBar}%` }} />
 </div>
 </div>
 </div>

 {/* Rekommenderad lösningsinriktning */}
 <div className="border rounded p-5 space-y-4 bg-background ">
 <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
 <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>Rekommenderad lösningsinriktning
 </h3>
 {rec.products.length > 0 ? (
 <>
 <div>
 <p className="text-sm font-medium text-foreground mb-3">Baserat på er kundserviceprofil rekommenderas en lösning med fokus på:</p>
 <div className="space-y-2">
 {(() => {
 const focusMap2: Record<string, { icon: string; label: string }[]> = {
 "Dynamics 365 Customer Service": [{ icon: "📋", label: "Central ärendehantering" }, { icon: "🔀", label: "Omnichannel och kanalsamordning" }, { icon: "🤖", label: "AI-assisterade kundservicemedarbetare och kunskapsbas" }],
 "Dynamics 365 Field Service": [{ icon: "🗓️", label: "Schemaläggning och mobilt teknikerstöd" }, { icon: "📡", label: "IoT och prediktivt underhåll" }, { icon: "🔧", label: "Arbetsorder och reservdelshantering" }],
 "Dynamics 365 Contact Center": [{ icon: "☎️", label: "Multikanalhantering och röstintegration" }, { icon: "📊", label: "Realtidsdashboard och supervisor-styrning" }, { icon: "🤖", label: "AI-driven ärenderouting och chattbot" }],
 };
 const seen2 = new Set<string>();
 return rec.products.slice(0, 3).flatMap(p => focusMap2[p.name] || []).filter(f => { if (seen2.has(f.label)) return false; seen2.add(f.label); return true; }).slice(0, 5).map(focus => (
 <div key={focus.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
 <span className="text-lg flex-shrink-0">{focus.icon}</span>
 <p className="text-sm font-medium text-foreground">{focus.label}</p>
 </div>
 ));
 })()}
 </div>
 </div>
 <div className="pt-2 border-t border-border">
 <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">Bakom kulisserna lutar det mot</p>
 <div className="flex flex-wrap gap-2">
 {rec.products.slice(0, 3).map((product, i) => (
 <div key={product.name} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold border ${i === 0 ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"}`}>
 <span>{product.icon}</span><span>{product.name}</span>
 </div>
 ))}
 </div>
 {rec.products[0]?.reasons?.[0] && (
 <p className="text-xs text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">"{rec.products[0].reasons[0]}"</p>
 )}
 </div>
 </>
 ) : (
 <p className="text-sm text-muted-foreground">Fyll i fler steg för en fullständig rekommendation.</p>
 )}
 </div>

 {/* Rekommenderad partnertyp */}
 <div className="border rounded p-5 space-y-3 bg-background ">
 <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
 <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">4</span>Rekommenderad partnertyp
 </h3>
 <div className="grid grid-cols-1 gap-3">
 {partnerTypes.map((pt) => (
 <div key={pt.label} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20">
 <span className="text-2xl flex-shrink-0">{pt.icon}</span>
 <div>
 <p className="font-semibold text-sm text-foreground">{pt.label}</p>
 <p className="text-xs text-muted-foreground mt-0.5">{pt.description}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* APPENDIX */}
 <div className="border rounded overflow-hidden ">
 <div className="bg-muted px-5 py-3 border-b border-border">
 <h3 className="font-bold text-foreground text-sm tracking-wide">📎 Appendix – Dina svar</h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="bg-muted/50 border-b border-border">
 <th className="text-left px-4 py-2 font-semibold text-muted-foreground w-1/2">Fråga</th>
 <th className="text-left px-4 py-2 font-semibold text-muted-foreground w-1/2">Svar</th>
 </tr>
 </thead>
 <tbody>
 {[
 { section: true, label: "Steg 1 – Företagsinformation" },
 { label: "Antal anställda", value: data.employees },
 { label: "Bransch", value: data.industry === "Annat" ? data.industryOther : data.industry },
 { label: "Serviceteam-storlek", value: data.serviceTeamSize },
 { label: "Nuvarande system", value: data.currentSystems.filter(s => s.product.trim()).map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ") },
 { section: true, label: "Steg 2 – Service-modell" },
 { label: "Serviceupplägg", value: data.serviceModel },
 { section: true, label: "Steg 3 – Din situation & komplexitet" },
 { label: "Ärendevolym/mån", value: data.ticketsPerMonth },
 { label: "SLA-krav (digital)", value: data.slaRequirements },
 { label: "Self-service portal", value: data.selfServicePortal },
 { label: "Kunskapsdatabas", value: data.knowledgeBase },
 
 { label: "Inkommande volym/dag", value: data.inboundVolume },
 { label: "Contact center-kanaler", value: data.contactCenterChannels?.join(", ") },
 { label: "Realtidsstyrning (CC)", value: data.realtimeManagement },
 { label: "Antal tekniker", value: data.numberOfTechnicians },
 { label: "Schemaläggning", value: data.schedulingNeeds },
 { label: "Reservdelshantering", value: data.sparepartsManagement },
 { label: "Serviceavtal (SLA)", value: data.serviceAgreements },
 { label: "Geografisk spridning", value: data.geographicSpread },
 { label: "Verkar i flera länder", value: data.multiCountry },
 { label: "Flerspråkig kundservice", value: data.multiLanguage },
 { label: "Kundprioritering", value: data.customerPrioritization },
 { label: "Produktlinjer", value: data.multipleProductLines },
 { label: "Kundservice-KPI:er", value: data.csKpis?.length > 0 ? data.csKpis.join(", ") : undefined },
 { label: "Contact Center-KPI:er", value: data.ccKpis?.length > 0 ? data.ccKpis.join(", ") : undefined },
 { label: "Fältservice-KPI:er", value: data.fsKpis?.length > 0 ? data.fsKpis.join(", ") : undefined },
 { label: "Diagnostiska utmaningar (Osäkert)", value: data.unsureIssues?.length > 0 ? data.unsureIssues.join(", ") : undefined },
 { section: true, label: "Steg 4 – Organisation & styrning" },
 { label: "Org-struktur", value: data.orgStructure },
 { label: "Gemensam rapportering", value: data.sharedReporting },
 { label: "Realtidsrapportering", value: data.realtimeReporting },
 { label: "Integration med sälj/ERP", value: data.integratedWithSalesErp },
 { section: true, label: "Steg 5 – Data, integrationer & datamognad" },
 { label: "Systemkopplingar", value: integrationsList.length > 0 ? integrationsList.join(", ") : undefined },
 { label: "Datamognad", value: data.dataMaturity },
 { label: "Datatillförlitlighet", value: data.dataReliability },
 { label: "Dataägarskap", value: data.dataOwnership },
 { label: "Behörigheter/åtkomst", value: data.dataAccessControls },
 { section: true, label: "Steg 6 – AI, automation & agenter" },
 { label: "AI-användningsområden", value: data.aiUseCases?.length > 0 ? data.aiUseCases.join(", ") : undefined },
 { label: "AI-automationsfunktioner", value: data.aiAutomation?.length > 0 ? data.aiAutomation.join(", ") : undefined },
 { label: "AI-/agentautonomi", value: data.aiAutonomy },
 { label: "Kontrollpunkter för AI/agenter", value: data.aiControls?.length > 0 ? data.aiControls.join(", ") : undefined },
 ].map((row, i) => {
 if ((row as any).section) {
 return (
 <tr key={row.label} className="bg-muted/60 border-t border-border">
 <td colSpan={2} className="px-4 py-2 font-bold text-foreground text-xs uppercase tracking-wide">{row.label}</td>
 </tr>
 );
 }
 const value = (row as any).value;
 if (!value) return null;
 return (
 <tr key={row.label} className={i % 2 === 0 ? "bg-background" : "bg-muted/10"}>
 <td className="px-4 py-2 text-muted-foreground font-medium">{row.label}</td>
 <td className="px-4 py-2 text-foreground">{value}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* FÖRESLAGNA PARTNERS */}
 <SuggestedPartnersCTA
 product="service"
 industry={data.industry === "Annat" ? data.industryOther : data.industry}
 className="!py-8 border rounded overflow-hidden !bg-secondary/40"
 />

 {/* KONTAKTUPPGIFTER & LADDA NER */}
 <div className="border border-[hsl(var(--line-dark))] rounded overflow-hidden ">
 <div className="bg-[hsl(var(--hero-dark))] px-5 py-4">
 <h3 className="font-bold text-white text-base tracking-wide">📥 Ladda ner din analys som PDF</h3>
 <p className="text-white/75 text-sm mt-1">Vi skickar PDF:en till din e-post och laddar även ner den direkt.</p>
 </div>
 <div className="p-6 bg-background space-y-5">
 {isComplete ? (
 <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
 <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
 <div>
 <p className="font-semibold text-green-800">Analysen har skickats!</p>
 <p className="text-sm text-green-700">Kolla din inkorg – PDF:en borde finnas där inom någon minut.</p>
 </div>
 </div>
 ) : (
 <>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <Label htmlFor="companyName">Företagsnamn *</Label>
 <Input id="companyName" value={data.companyName} onChange={(e) => { setData({ ...data, companyName: e.target.value }); if (contactErrors.companyName) setContactErrors({ ...contactErrors, companyName: undefined }); }} placeholder="Ert företagsnamn" className={contactErrors.companyName ? 'border-destructive' : ''} />
 {contactErrors.companyName && <p className="text-sm text-destructive mt-1">{contactErrors.companyName}</p>}
 </div>
 <div>
 <Label htmlFor="contactName">Ditt namn *</Label>
 <Input id="contactName" value={data.contactName} onChange={(e) => { setData({ ...data, contactName: e.target.value }); if (contactErrors.contactName) setContactErrors({ ...contactErrors, contactName: undefined }); }} placeholder="För- och efternamn" className={contactErrors.contactName ? 'border-destructive' : ''} />
 {contactErrors.contactName && <p className="text-sm text-destructive mt-1">{contactErrors.contactName}</p>}
 </div>
 <div>
 <Label htmlFor="phone">Telefon</Label>
 <Input id="phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="Telefonnummer" />
 </div>
 <div>
 <Label htmlFor="email">E-post *</Label>
 <Input id="email" type="email" value={data.email} onChange={(e) => { setData({ ...data, email: e.target.value }); if (contactErrors.email) setContactErrors({ ...contactErrors, email: undefined }); }} placeholder="din.email@foretag.se" className={contactErrors.email ? 'border-destructive' : ''} />
 {contactErrors.email && <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>}
 </div>
 </div>
 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <Button onClick={generateDocument} disabled={!data.companyName || !data.contactName || !data.email || isSendingEmail} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white flex-1">
 <Download className="w-4 h-4 mr-2" />
 {isSendingEmail ? "Skickar..." : "Ladda ner & skicka analys"}
 </Button>
 <Button variant="outline" onClick={handlePrint} className="print:hidden">
 🖨️ Skriv ut
 </Button>
 </div>
 </>
 )}
 </div>
 </div>
 </div>
 );
 }

 default:
 return null;
 }
 };

 const StepIcon = stepIcons[currentStep - 1];

 return (
 <div className="min-h-screen bg-background">
 <SEOHead
 title="Kundservice Behovsanalys | Dynamics 365"
 description="Kostnadsfri behovsanalys för Dynamics 365 Customer Service, Field Service och Contact Center. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 canonicalPath="/kundservice-behovsanalys"
 keywords="kundservice behovsanalys, Dynamics 365 Customer Service, Field Service, Contact Center"
 ogImage="https://d365.se/og-kundservice-behovsanalys.png"
 />
 <ServiceSchema name="Kundservice Behovsanalys" description="Kostnadsfri behovsanalys för att hitta rätt Dynamics 365 lösning för kundservice och fältservice. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner." />
 <BreadcrumbSchema items={customerServiceBreadcrumbs} />
 <SoftwareApplicationSchema
 name="Behovsanalys Customer Service"
 description="Webbaserat verktyg som kartlägger kundservicebehov och ger rekommendation för Dynamics 365 Customer Service, Contact Center och Field Service."
 url="https://d365.se/CustomerServiceBehovsanalys"
 />
 <Navbar />
 <main className="pb-12">
 <div className="relative bg-cover bg-center pt-36 pb-10 mb-8" style={{ backgroundImage: `url(${heroBehovsanalysKundservice})` }}>
 <div className="absolute inset-0 bg-black/60" />
 <div className="relative container mx-auto px-4 max-w-4xl text-center">
 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Behovsanalys Kundservice</h1>
 <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
 Svara på frågorna för att få en personlig rekommendation om Dynamics 365 Customer Service, Field Service och Contact Center.
 </p>
 </div>
 </div>
 <div className="container mx-auto px-4 max-w-4xl">

 <div className="mb-4">
 <div className="flex justify-between items-center mb-1">
 <span className="text-sm text-muted-foreground">Steg {currentStep} av {totalSteps}</span>
 <div className="flex items-center gap-3">
 <span className="text-sm font-medium text-[hsl(var(--cta-orange))]">{Math.round(progress)}%</span>
 {currentStep < totalSteps && (
 <Button onClick={handleNext} size="sm" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
 Nästa <ArrowRight className="w-4 h-4 ml-1" />
 </Button>
 )}
 </div>
 </div>
 <Progress value={progress} className="h-2" indicatorClassName="bg-[hsl(var(--cta-orange))]" />
 </div>

 <div className="hidden md:flex justify-between mb-4 overflow-x-auto pb-2">
 {stepTitles.map((title, index) => {
 const stepNum = index + 1;
 const isSkipped = stepNum === 4 && !needsFieldServiceStep;
 if (isSkipped) return null;
 const Icon = stepIcons[index];
 const isActive = currentStep === stepNum;
 const isCompleted = currentStep > stepNum;
 return (
 <button key={index} onClick={() => setCurrentStep(stepNum)} className="flex flex-col items-center min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity">
 <div className={`w-10 h-10 rounded flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-[hsl(var(--cta-orange))] text-white' : isCompleted ? 'bg-[hsl(var(--cta-orange))]/20 text-[hsl(var(--cta-orange))]' : 'bg-muted text-muted-foreground'}`}>
 <Icon className="w-5 h-5" />
 </div>
 <span className={`text-xs text-center ${isActive ? 'text-[hsl(var(--cta-orange))] font-medium' : 'text-muted-foreground'}`}>{title}</span>
 </button>
 );
 })}
 </div>

 <Card className="">
 <CardHeader className="bg-gradient-to-r from-customer-service/10 to-customer-service/5 border-b py-3">
 <div className="flex items-center gap-2">
 <StepIcon className="w-5 h-5 text-customer-service" />
 <CardTitle className="text-lg text-customer-service">{stepTitles[currentStep - 1]}</CardTitle>
 {currentStep === totalSteps && (
 <Button variant="outline" size="sm" onClick={handlePrint} className="ml-auto print:hidden">
 🖨️ Skriv ut
 </Button>
 )}
 </div>
 </CardHeader>
 <CardContent className="pt-4">
 <div className="analysis-form theme-cs">
 {renderStep()}
 </div>
 </CardContent>
 </Card>

 <div className="flex justify-between mt-6 print:hidden">
 <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
 <ArrowLeft className="w-4 h-4 mr-2" />Tillbaka
 </Button>
 {currentStep < totalSteps ? (
 <Button onClick={handleNext} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
 Nästa <ArrowRight className="w-4 h-4 ml-2" />
 </Button>
 ) : null}
 </div>
 </div>
 </main>
 <RelatedPages heading="Fortsätt utvärdera din kundservice" pages={needsAnalysisCsRelatedPages} />
 <Footer />
 </div>
 );
};

export default CustomerServiceNeedsAnalysis;
