/** Manuellt skrivna generiska köparguider i CRM-klustret. */
export type CrmCategoryGuideKey = "kundservicesystem" | "faltservicesystem";

interface Card { t: string; d: string }
export interface CrmCategoryGuideConfig {
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  subhead: string;
  shortAnswer: string;
  problemsHeading: string;
  problems: Card[];
  types: Card[];
  decisive: string[];
  assessment: string;
  apps: { app: string; when: string; to: string }[];
  comparisons: { label: string; to: string }[];
  product: string;
  primaryCta: { label: string; to: string };
  cta: { heading: string; text: string; links: { label: string; to: string }[] };
}

export const CRM_CATEGORY_GUIDES: Record<CrmCategoryGuideKey, CrmCategoryGuideConfig> = {
  kundservicesystem: {
    path: "/kundservicesystem/",
    h1: "Hur väljer ni kundservicesystem?",
    metaTitle: "Kundservicesystem – så väljer ni ärendehantering och kontaktcenter | d365.se",
    metaDescription: "Köpguide för kundservicesystem: ärendehantering, omnikanal och kontaktcenter. Vad avgör valet, vilka typer av lösningar finns och när passar Dynamics 365?",
    subhead: "Ärendehantering, omnikanal eller kontaktcenter med telefoni? Börja i behovet och jämför sedan lösningstyper och partners.",
    shortAnswer: "Välj kundservicesystem efter hur ni tar emot kundkontakter och hur mycket kundservice behöver se av sälj- och orderhistoriken. En liten supportfunktion klarar sig ofta med ett fristående ärendesystem. När flera kanaler, SLA-krav och delad kunddata med sälj och fältservice blir viktiga är en CRM-plattform som Dynamics 365 Customer Service mer relevant. Om telefoni och köer är huvudfrågan behöver ni också ett kontaktcentersystem.",
    problemsHeading: "Vilka problem ska kundservicesystemet lösa?",
    problems: [
      { t: "Ärenden försvinner i delade inkorgar", d: "Ni behöver ärendehantering med ägare, status och historik." },
      { t: "Kunder får olika svar i olika kanaler", d: "Ni behöver omnikanal där e-post, chatt och telefon hamnar i samma ärende." },
      { t: "SLA:er hålls inte", d: "Ni behöver routing, prioritering och eskalering som styrs av regler." },
      { t: "Samma frågor besvaras om och om igen", d: "Ni behöver kunskapsbas, självbetjäning och AI-stöd för svarsförslag." },
    ],
    types: [
      { t: "Fristående ärendesystem", d: "Snabba att komma igång med, till exempel Zendesk. Passar när kundservice kan arbeta separat från övrig kunddata." },
      { t: "Kundservice i en CRM-svit", d: "Ärenden på samma plattform som sälj och fältservice, till exempel Dynamics 365 Customer Service och Salesforce Service Cloud." },
      { t: "Enterprise-serviceplattformar", d: "Starka på arbetsflöden och IT-nära processer, till exempel ServiceNow. Passar stora organisationer med komplexa servicekedjor." },
      { t: "Kontaktcenter (CCaaS)", d: "Telefoni, köer och bemanning, till exempel Dynamics 365 Contact Center, Genesys, NICE, Puzzel och Telia ACE." },
    ],
    decisive: [
      "Vilka kanaler ni har i dag och vilka som ska tillkomma, och om telefoni ingår.",
      "Ärendevolym, antal handläggare och krav på SLA och rapportering.",
      "Hur viktigt det är att se kundens köp, avtal och serviceärenden på ett ställe.",
      "Integration mot affärssystem, telefoni och Microsoft 365.",
      "Vem som ska förvalta regler, köer och kunskapsbas efter införandet.",
    ],
    assessment: "Det vanligaste misstaget är att köpa ett kontaktcenter när behovet är ärendehantering, eller tvärtom. Reda först ut om problemet ligger i hur ärenden hanteras eller i hur kontakter tas emot. Dynamics 365 Customer Service ger mest nytta när kundservice ska dela kunddata med sälj och fältservice. För en fristående supportfunktion kan ett enklare ärendesystem ge snabbare resultat till lägre kostnad.",
    apps: [
      { app: "Dynamics 365 Customer Service", when: "ärendehantering, SLA och kunskapsbas med gemensam kunddata", to: "/d365customerservice/" },
      { app: "Dynamics 365 Contact Center", when: "telefoni, köer och digitala kanaler med AI-stöd", to: "/d365contactcenter/" },
      { app: "Dynamics 365 Field Service", when: "när ärenden leder till arbete ute hos kund", to: "/d365fieldservice/" },
    ],
    comparisons: [
      { label: "Dynamics 365 Customer Service vs Zendesk", to: "/jamfor/customer-service-vs-zendesk/" },
      { label: "Dynamics 365 Customer Service vs ServiceNow CSM", to: "/jamfor/customer-service-vs-servicenow-csm/" },
      { label: "Dynamics 365 Customer Service vs Salesforce Service Cloud", to: "/jamfor/customer-service-vs-salesforce-service-cloud/" },
      { label: "Dynamics 365 Contact Center vs Genesys Cloud CX", to: "/jamfor/contact-center-vs-genesys-cloud-cx/" },
      { label: "Dynamics 365 Contact Center vs NICE CXone", to: "/jamfor/contact-center-vs-nice-cxone/" },
    ],
    product: "Customer Service",
    primaryCta: { label: "Bedöm ert kundservicebehov", to: "/kundservice-behovsanalys/" },
    cta: {
      heading: "Bedöm ert kundservicebehov",
      text: "En kort behovsanalys hjälper er reda ut om ni behöver ärendehantering, kontaktcenter eller båda, och vilka partners som passar.",
      links: [
        { label: "Gör kundservice-behovsanalys", to: "/kundservice-behovsanalys/" },
        { label: "Jämför CRM-partners för ert behov", to: "/dynamics-365-crm-partners-sverige/" },
      ],
    },
  },
  faltservicesystem: {
    path: "/faltservicesystem/",
    h1: "Hur väljer ni fältservicesystem?",
    metaTitle: "Fältservicesystem – så väljer ni teknikerplanering och serviceplanering | d365.se",
    metaDescription: "Köpguide för fältservicesystem: teknikerplanering, arbetsorder, mobil fältservice och serviceavtal. Vad avgör valet och när passar Dynamics 365 Field Service?",
    subhead: "Teknikerplanering, arbetsorder, reservdelar och fakturering. Så avgör ni vilken typ av fältservicesystem ni behöver.",
    shortAnswer: "Ett fältservicesystem behövs när planeringen av tekniker, reservdelar och serviceavtal blir en flaskhals. Med ett fåtal tekniker räcker ofta arbetsorderhanteringen i affärssystemet eller en enkel planeringsapp. När serviceverksamheten växer, har avtal med SLA eller ska kopplas till kundservice och lager blir en plattform som Dynamics 365 Field Service relevant.",
    problemsHeading: "Vilka problem ska fältservicesystemet lösa?",
    problems: [
      { t: "Planeringen sker i Excel eller whiteboard", d: "Ni behöver schemaläggning som tar hänsyn till kompetens, geografi och akuta jobb." },
      { t: "Tekniker saknar information på plats", d: "Ni behöver en mobilapp med kundhistorik, checklistor och artiklar, även offline." },
      { t: "Fakturering och lager släpar efter", d: "Ni behöver arbetsorder som flödar till affärssystemet." },
      { t: "Avtal och förebyggande underhåll missas", d: "Ni behöver serviceavtal, återkommande jobb och gärna IoT-larm." },
    ],
    types: [
      { t: "Arbetsorder i affärssystemet", d: "Enklast när antalet tekniker är litet och planeringen inte är komplex." },
      { t: "Fristående planeringsappar", d: "Snabba att införa för mindre serviceföretag, men kunddata och fakturering ligger ofta i andra system." },
      { t: "Fältservice i en CRM-svit", d: "Planering, mobilapp och avtal på samma plattform som kundservice, till exempel Dynamics 365 Field Service och Salesforce Field Service." },
      { t: "Branschspecifika servicesystem", d: "Byggda för en bransch, till exempel fastighet eller hiss. Kan passa bra men begränsar ofta integrationen." },
    ],
    decisive: [
      "Antal tekniker och hur komplex planeringen är.",
      "Om ni har serviceavtal, SLA eller förebyggande underhåll.",
      "Integration mot affärssystemets lager, inköp och fakturering.",
      "Mobilappens användbarhet för teknikerna, även utan täckning.",
      "Partnerns erfarenhet av serviceverksamhet i er bransch.",
    ],
    assessment: "Värdet i ett fältservicesystem kommer från kedjan ärende, planering, utförande och faktura, inte från planeringsvyn ensam. Dynamics 365 Field Service är starkt när kedjan ska hänga ihop med kundservice och affärssystem, men det är också mer krävande att införa än en fristående app. Pröva därför antalet tekniker och integrationsbehovet innan ni väljer nivå.",
    apps: [
      { app: "Dynamics 365 Field Service", when: "planering, mobil fältservice, avtal och IoT", to: "/d365fieldservice/" },
      { app: "Dynamics 365 Customer Service", when: "när kundärenden ska skapa arbetsorder", to: "/d365customerservice/" },
      { app: "Dynamics 365 Business Central", when: "lager, inköp och fakturering i mindre och medelstora företag", to: "/businesscentral/" },
    ],
    comparisons: [
      { label: "Dynamics 365 Field Service vs Salesforce Field Service", to: "/jamfor/field-service-vs-salesforce-field-service/" },
    ],
    product: "Field Service",
    primaryCta: { label: "Se Dynamics 365 Field Service", to: "/d365fieldservice/" },
    cta: {
      heading: "Passar Field Service er serviceverksamhet?",
      text: "Pröva behovet mot er planering, era tekniker och ert affärssystem, och se vilka partners som har gjort fältserviceprojekt.",
      links: [
        { label: "Jämför CRM-partners för ert behov", to: "/dynamics-365-crm-partners-sverige/" },
        { label: "Läs om Field Service", to: "/d365fieldservice/" },
      ],
    },
  },
};
