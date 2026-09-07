import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Temporär engångsimport av Customer Engagement-tillägg till den gemensamma ISV-katalogen.
const DATA = {
 "vendors": [
  {
   "slug": "experlogix",
   "name": "Experlogix"
  },
  {
   "slug": "pros",
   "name": "PROS"
  },
  {
   "slug": "pandadoc",
   "name": "PandaDoc"
  },
  {
   "slug": "docusign",
   "name": "Docusign"
  },
  {
   "slug": "adobe",
   "name": "Adobe"
  },
  {
   "slug": "mscrm-addons-com",
   "name": "mscrm-addons.com"
  },
  {
   "slug": "paperflite",
   "name": "Paperflite"
  },
  {
   "slug": "click",
   "name": "Click"
  },
  {
   "slug": "demandbase",
   "name": "Demandbase"
  },
  {
   "slug": "inogic",
   "name": "Inogic"
  },
  {
   "slug": "appjetty",
   "name": "AppJetty"
  },
  {
   "slug": "iotap",
   "name": "IOTAP"
  },
  {
   "slug": "alphavima",
   "name": "Alphavima"
  },
  {
   "slug": "sinch",
   "name": "Sinch"
  },
  {
   "slug": "live-assist",
   "name": "Live Assist"
  },
  {
   "slug": "medallia",
   "name": "Medallia"
  },
  {
   "slug": "solgari",
   "name": "Solgari"
  },
  {
   "slug": "five9",
   "name": "Five9"
  },
  {
   "slug": "nice",
   "name": "NiCE"
  },
  {
   "slug": "vonage",
   "name": "Vonage"
  },
  {
   "slug": "cisco",
   "name": "Cisco"
  },
  {
   "slug": "ttec-digital",
   "name": "TTEC Digital"
  },
  {
   "slug": "8x8",
   "name": "8x8"
  },
  {
   "slug": "zoom",
   "name": "Zoom"
  },
  {
   "slug": "dynamics-telephony",
   "name": "Dynamics Telephony"
  },
  {
   "slug": "ingenius",
   "name": "InGenius"
  },
  {
   "slug": "resco",
   "name": "Resco"
  },
  {
   "slug": "hso",
   "name": "HSO"
  },
  {
   "slug": "maptaskr",
   "name": "Maptaskr"
  },
  {
   "slug": "easyterritory",
   "name": "EasyTerritory"
  },
  {
   "slug": "hcl-powerobjects",
   "name": "HCL / PowerObjects"
  },
  {
   "slug": "data8",
   "name": "Data8"
  },
  {
   "slug": "walkme",
   "name": "WalkMe"
  }
 ],
 "solutions": [
  {
   "solution_id": "experlogix-experlogix-cpq",
   "name": "Experlogix CPQ",
   "vendor": "Experlogix",
   "vendor_slug": "experlogix",
   "short_description": "CPQ för komplex produkt- och tjänstekonfiguration, prissättning och offertarbete direkt kopplat till Dynamics 365.",
   "what": "CPQ för komplex produkt- och tjänstekonfiguration, prissättning och offertarbete direkt kopplat till Dynamics 365.",
   "category": "CPQ",
   "subcategory": "Configure Price Quote",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://experlogix.com/resources/dynamics-365-cpq-integration/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Säljorganisationer med komplexa produkter, regelstyrda konfigurationer eller avancerad prissättning.",
   "considerations": "Behöver samordnas med produktkatalog, ERP, pricing och eventuell engineering/PLM.",
   "tags": [
    "CPQ",
    "Guided selling",
    "Pricing",
    "Quote",
    "Sales"
   ],
   "industries": [
    "Manufacturing",
    "Wholesale",
    "Services",
    "ETO"
   ],
   "industry_focus": [
    "Manufacturing",
    "Wholesale",
    "Services",
    "ETO"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "experlogix-smart-flows",
   "name": "Smart Flows",
   "vendor": "Experlogix",
   "vendor_slug": "experlogix",
   "short_description": "Dokumentgenerering och dokumentflöden som kan triggas direkt från Dynamics 365 CE och Dataverse.",
   "what": "Dokumentgenerering och dokumentflöden som kan triggas direkt från Dynamics 365 CE och Dataverse.",
   "category": "Dokumentautomation",
   "subcategory": "Document generation & workflow",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://help-smartflows.experlogix.com/knowledge-base-smart-flows/microsoft-dynamics-365-ce-connector",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som vill automatisera offerter, avtal, service- och kunddokument från CRM-data.",
   "considerations": "Jämför mot DocumentsCorePack, PandaDoc och kundens befintliga dokument- och e-signstrategi.",
   "tags": [
    "Documents",
    "Workflow",
    "Word templates",
    "Dataverse",
    "Automation"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "pros-pros-smart-configure-price-quote",
   "name": "PROS Smart Configure Price Quote",
   "vendor": "PROS",
   "vendor_slug": "pros",
   "short_description": "Enterprise-CPQ med konfiguration, prissättning, offerter och AI-baserad prisvägledning integrerad med Dynamics 365 Sales.",
   "what": "Enterprise-CPQ med konfiguration, prissättning, offerter och AI-baserad prisvägledning integrerad med Dynamics 365 Sales.",
   "category": "CPQ",
   "subcategory": "Configure Price Quote",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://marketplace.microsoft.com/en-us/product/dynamics-365/proscpq.15fbc600-c6cb-489f-9bb9-7577900de637?tab=Overview",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "no",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Större säljorganisationer med avancerad pricing och komplex offertprocess.",
   "considerations": "Mer enterprise-orienterad lösning; värdera integrationsdjup, TCO och behov av avancerad pricing.",
   "tags": [
    "CPQ",
    "Pricing",
    "AI",
    "Quote",
    "Sales"
   ],
   "industries": [
    "Enterprise",
    "Manufacturing",
    "Services",
    "Wholesale"
   ],
   "industry_focus": [
    "Enterprise",
    "Manufacturing",
    "Services",
    "Wholesale"
   ],
   "products": [
    "Sales"
   ],
   "is_published": false
  },
  {
   "solution_id": "pandadoc-pandadoc-for-microsoft-dynamics",
   "name": "PandaDoc for Microsoft Dynamics",
   "vendor": "PandaDoc",
   "vendor_slug": "pandadoc",
   "short_description": "Skapar, skickar, följer upp och signerar dokument från Dynamics 365-poster såsom opportunities, accounts, contacts och quotes.",
   "what": "Skapar, skickar, följer upp och signerar dokument från Dynamics 365-poster såsom opportunities, accounts, contacts och quotes.",
   "category": "E-signatur & avtal",
   "subcategory": "Proposal / document / e-sign",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.pandadoc.com/en/articles/9714886-microsoft-dynamics-installation-guide",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Säljteam som vill kombinera proposal management och e-signering nära CRM.",
   "considerations": "Jämför mot Docusign, Adobe Acrobat Sign och ren dokumentgenerering.",
   "tags": [
    "Proposal",
    "E-sign",
    "Documents",
    "Sales",
    "Quote"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "docusign-docusign-for-dynamics-365",
   "name": "Docusign for Dynamics 365",
   "vendor": "Docusign",
   "vendor_slug": "docusign",
   "short_description": "Skicka, signera och följ upp avtal och godkännanden direkt från Dynamics 365.",
   "what": "Skicka, signera och följ upp avtal och godkännanden direkt från Dynamics 365.",
   "category": "E-signatur & avtal",
   "subcategory": "E-signature",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.docusign.com/en-gb/integrations/microsoft/dynamics-365",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med etablerade Docusign-processer eller stort behov av digital signering.",
   "considerations": "Docusign är en bred avtalsplattform; avgör hur mycket CLM-funktion som faktiskt behövs.",
   "tags": [
    "E-sign",
    "Agreements",
    "Contracts",
    "Workflow"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "adobe-adobe-acrobat-sign-for-dynamics-365",
   "name": "Adobe Acrobat Sign for Dynamics 365",
   "vendor": "Adobe",
   "vendor_slug": "adobe",
   "short_description": "E-signatur och avtalsflöden integrerade i Dynamics 365 med stöd för Dynamics-data och spårning.",
   "what": "E-signatur och avtalsflöden integrerade i Dynamics 365 med stöd för Dynamics-data och spårning.",
   "category": "E-signatur & avtal",
   "subcategory": "E-signature",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://helpx.adobe.com/sign/web/integrations/microsoft-dynamics/microsoft-dynamics-crm.html",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som redan standardiserat på Adobe Acrobat/Sign eller behöver avancerad e-signering.",
   "considerations": "Säkerställ aktuell Dynamics-paketversion och kompatibilitet vid implementation.",
   "tags": [
    "E-sign",
    "Agreements",
    "Adobe",
    "Sales"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "mscrm-addons-com-documentscorepack",
   "name": "DocumentsCorePack",
   "vendor": "mscrm-addons.com",
   "vendor_slug": "mscrm-addons-com",
   "short_description": "Dokumentgenerering, Word-mallar, PDF, distribution och e-signflöden för Dynamics 365 och Power Platform.",
   "what": "Dokumentgenerering, Word-mallar, PDF, distribution och e-signflöden för Dynamics 365 och Power Platform.",
   "category": "Dokumentautomation",
   "subcategory": "Document generation",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.mscrm-addons.com/Support/Documentation",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "partial",
   "best_for": "Organisationer som vill skapa kunddokument direkt från flera CE-appar och Dataverse.",
   "considerations": "Brett verktyg; definiera tydligt vilka dokumentprocesser som ska standardiseras.",
   "tags": [
    "Documents",
    "Word",
    "PDF",
    "E-sign",
    "Power Automate"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "paperflite-paperflite-for-microsoft-dynamics",
   "name": "Paperflite for Microsoft Dynamics",
   "vendor": "Paperflite",
   "vendor_slug": "paperflite",
   "short_description": "Sales content management och engagement tracking som kan användas direkt från Dynamics 365 Sales.",
   "what": "Sales content management och engagement tracking som kan användas direkt från Dynamics 365 Sales.",
   "category": "Sales enablement",
   "subcategory": "Content engagement",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.paperflite.com/en/articles/10398093-accessing-paperflite-within-ms-dynamics",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "B2B-säljteam som arbetar aktivt med content i komplexa köpresor.",
   "considerations": "Värdet är störst om organisationen har mycket säljmaterial och vill mäta innehållsengagemang.",
   "tags": [
    "Sales enablement",
    "Content",
    "Engagement",
    "Sales"
   ],
   "industries": [
    "B2B",
    "Services",
    "Technology"
   ],
   "industry_focus": [
    "B2B",
    "Services",
    "Technology"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "click-click-sales-engagement",
   "name": "Click Sales Engagement",
   "vendor": "Click",
   "vendor_slug": "click",
   "short_description": "Sales engagement byggt på Microsoft Power Platform med sekvenser av e-post, samtal, uppgifter och LinkedIn-aktiviteter.",
   "what": "Sales engagement byggt på Microsoft Power Platform med sekvenser av e-post, samtal, uppgifter och LinkedIn-aktiviteter.",
   "category": "Sales engagement",
   "subcategory": "Sequences / outreach",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.clickdimensions.com/hc/en-us/articles/7289817271693-What-is-Click-Sales-Engagement",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "no",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Säljteam som vill strukturera prospecting och uppföljning i Dynamics 365 Sales.",
   "considerations": "Kräver Click Marketing Automation enligt leverantörens aktuella krav och bör jämföras med Microsoft Sales-funktioner.",
   "tags": [
    "Sales engagement",
    "Sequences",
    "Outreach",
    "Power Platform"
   ],
   "industries": [
    "B2B",
    "Services",
    "Technology"
   ],
   "industry_focus": [
    "B2B",
    "Services",
    "Technology"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)"
   ],
   "is_published": false
  },
  {
   "solution_id": "demandbase-demandbase-for-microsoft-dynamics-365",
   "name": "Demandbase for Microsoft Dynamics 365",
   "vendor": "Demandbase",
   "vendor_slug": "demandbase",
   "short_description": "B2B account intelligence och ABM-data med native tvåvägsintegration mot Microsoft Dynamics 365.",
   "what": "B2B account intelligence och ABM-data med native tvåvägsintegration mot Microsoft Dynamics 365.",
   "category": "B2B intelligence",
   "subcategory": "Account intelligence / ABM",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.demandbase.com/blog/welcome-to-demandbase-hubspot-crm-and-microsoft-dynamics-2/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "B2B-företag med account-based marketing och större target account-program.",
   "considerations": "Värdet kräver en tydlig ABM-process och bra datagovernance mellan CRM och Demandbase.",
   "tags": [
    "ABM",
    "Account intelligence",
    "B2B data",
    "Sales",
    "Marketing"
   ],
   "industries": [
    "B2B",
    "Enterprise",
    "Technology"
   ],
   "industry_focus": [
    "B2B",
    "Enterprise",
    "Technology"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-kanban-board",
   "name": "Kanban Board",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Visualiserar Dynamics 365- och Dataverse-poster som interaktiva Kanban-kort och låter användaren flytta poster mellan steg.",
   "what": "Visualiserar Dynamics 365- och Dataverse-poster som interaktiva Kanban-kort och låter användaren flytta poster mellan steg.",
   "category": "CRM-produktivitet",
   "subcategory": "Pipeline visualization",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "wave_2",
   "source_status": "Verifierad",
   "source_url": "https://docs.inogic.com/kanban-board",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Team som vill få en mer visuell vy över pipeline, cases eller andra processer.",
   "considerations": "Kompletterar UI:t snarare än affärslogiken; nyttan beror på användningsfallet.",
   "tags": [
    "Kanban",
    "Pipeline",
    "Productivity",
    "Dataverse"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-map-my-relationships",
   "name": "Map My Relationships",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Visualiserar relationer mellan accounts, contacts, opportunities och andra Dynamics 365-poster som mind maps och hierarkier.",
   "what": "Visualiserar relationer mellan accounts, contacts, opportunities och andra Dynamics 365-poster som mind maps och hierarkier.",
   "category": "Relationship intelligence",
   "subcategory": "Relationship mapping",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "wave_2",
   "source_status": "Verifierad",
   "source_url": "https://www.inogic.com/product/productivity-apps/map-my-relationships-dynamics-365-crm/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Komplex B2B-försäljning och account management där stakeholder mapping är viktigt.",
   "considerations": "Kräver att relationer och kopplingar faktiskt underhålls i CRM.",
   "tags": [
    "Relationships",
    "Stakeholders",
    "Account planning",
    "Visualization"
   ],
   "industries": [
    "B2B",
    "Professional services",
    "Enterprise"
   ],
   "industry_focus": [
    "B2B",
    "Professional services",
    "Enterprise"
   ],
   "products": [
    "Sales",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-click2clone",
   "name": "Click2Clone",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Klonar standard- och custom records inklusive relaterade child records i Dynamics 365.",
   "what": "Klonar standard- och custom records inklusive relaterade child records i Dynamics 365.",
   "category": "CRM-produktivitet",
   "subcategory": "Record cloning",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifierad",
   "source_url": "https://docs.inogic.com/click2clone",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med återkommande record-strukturer som annars kopieras manuellt.",
   "considerations": "Nischad produktivitetsfunktion; bör inte prioriteras på landningssidor.",
   "tags": [
    "Clone",
    "Productivity",
    "Dataverse"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "appjetty-calendar-365",
   "name": "Calendar 365",
   "vendor": "AppJetty",
   "vendor_slug": "appjetty",
   "short_description": "Utökad kalender för Dynamics 365 med resurs- och kundkalendrar samt flera aktivitetsvyer.",
   "what": "Utökad kalender för Dynamics 365 med resurs- och kundkalendrar samt flera aktivitetsvyer.",
   "category": "CRM-produktivitet",
   "subcategory": "Calendar / resource scheduling",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "medium",
   "publication_wave": "wave_2",
   "source_status": "Verifierad via Dynamics community",
   "source_url": "https://community.dynamics.com/blogs/post/?postid=56fbe04c-3552-4ed3-843b-50d3f729f39f",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Team som behöver bättre kalender- och aktivitetsöverblick än standardvyerna.",
   "considerations": "Kontrollverifiera aktuell produktstatus och AppSource-listning före publicering.",
   "tags": [
    "Calendar",
    "Activities",
    "Scheduling",
    "CRM productivity"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "iotap-work-365",
   "name": "Work 365",
   "vendor": "IOTAP",
   "vendor_slug": "iotap",
   "short_description": "Subscription billing och recurring revenue management på Dynamics 365 / Power Platform.",
   "what": "Subscription billing och recurring revenue management på Dynamics 365 / Power Platform.",
   "category": "Subscription management",
   "subcategory": "Subscription billing",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.work365apps.com/page/overview",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Microsoft-partners, managed service providers och andra återkommande abonnemangsverksamheter.",
   "considerations": "Tydlig nisch mot subscription/billing; jämför mot ERP-baserad subscription billing om Finance används.",
   "tags": [
    "Subscription",
    "Billing",
    "Recurring revenue",
    "Partner Center"
   ],
   "industries": [
    "Technology",
    "CSP",
    "Managed services",
    "SaaS"
   ],
   "industry_focus": [
    "Technology",
    "CSP",
    "Managed services",
    "SaaS"
   ],
   "products": [
    "Sales",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "click-click-marketing-automation",
   "name": "Click Marketing Automation",
   "vendor": "Click",
   "vendor_slug": "click",
   "short_description": "Marketing automation native i Dynamics CRM med e-post, journeys, web tracking, forms, lead scoring, surveys och SMS.",
   "what": "Marketing automation native i Dynamics CRM med e-post, journeys, web tracking, forms, lead scoring, surveys och SMS.",
   "category": "Marketing automation",
   "subcategory": "Email / journeys / lead scoring",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://clickdimensions.com/automation/",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som vill ha marketing automation tätt integrerat med Dynamics CRM.",
   "considerations": "Jämför mot Microsoft Customer Insights - Journeys och säkerställ vilken plattform som ska äga marketing automation.",
   "tags": [
    "Marketing automation",
    "Email",
    "Journeys",
    "Lead scoring",
    "Dynamics CRM"
   ],
   "industries": [
    "B2B",
    "Services",
    "Technology",
    "Nonprofit"
   ],
   "industry_focus": [
    "B2B",
    "Services",
    "Technology",
    "Nonprofit"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "alphavima-mailchimp-integration-for-microsoft-dynamics-365",
   "name": "MailChimp Integration for Microsoft Dynamics 365",
   "vendor": "Alphavima",
   "vendor_slug": "alphavima",
   "short_description": "Tvåvägssynk av kontakter mellan Dynamics 365 och Mailchimp via förbyggda Power Automate-flöden.",
   "what": "Tvåvägssynk av kontakter mellan Dynamics 365 och Mailchimp via förbyggda Power Automate-flöden.",
   "category": "Marketing integration",
   "subcategory": "Mailchimp connector",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifierad",
   "source_url": "https://marketplace.microsoft.com/sv-se/product/dynamics-365/alphavima.alphavima_mailchimp_integration?tab=Overview",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "no",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Mindre organisationer som vill behålla Mailchimp men synka grundläggande CRM-data.",
   "considerations": "Mer begränsat integrationsdjup än full marketing automation; verifiera behov av kampanjdata och consent.",
   "tags": [
    "Mailchimp",
    "Marketing",
    "Contact sync",
    "Power Automate"
   ],
   "industries": [
    "SMB",
    "B2B",
    "Nonprofit"
   ],
   "industry_focus": [
    "SMB",
    "B2B",
    "Nonprofit"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-marketing4dynamics",
   "name": "Marketing4Dynamics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Kopplar Mailchimp till Dynamics 365 CRM med audience-, campaign-, tag- och engagement-synk.",
   "what": "Kopplar Mailchimp till Dynamics 365 CRM med audience-, campaign-, tag- och engagement-synk.",
   "category": "Marketing integration",
   "subcategory": "Mailchimp integration",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://marketplace.microsoft.com/en-us/product/dynamics-365/inogic.mailchimp-dynamics-365-crm-integration",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "partial",
   "field_service_relevance": "no",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som använder Mailchimp men vill arbeta med kampanjdata och uppföljning i Dynamics.",
   "considerations": "Tydliggör skillnaden mot Customer Insights - Journeys och Click Marketing Automation.",
   "tags": [
    "Mailchimp",
    "Campaigns",
    "Marketing",
    "CRM sync"
   ],
   "industries": [
    "SMB",
    "B2B",
    "Nonprofit"
   ],
   "industry_focus": [
    "SMB",
    "B2B",
    "Nonprofit"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "sinch-sinch-messaging-for-dynamics-365",
   "name": "Sinch messaging for Dynamics 365",
   "vendor": "Sinch",
   "vendor_slug": "sinch",
   "short_description": "SMS- och messagingfunktioner för Dynamics 365, relevanta för både sälj-, service- och kundkommunikationsflöden.",
   "what": "SMS- och messagingfunktioner för Dynamics 365, relevanta för både sälj-, service- och kundkommunikationsflöden.",
   "category": "SMS & messaging",
   "subcategory": "SMS / RCS",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifiera produktnamn före publicering",
   "source_url": "https://sinch.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "yes",
   "best_for": "Nordiska organisationer som behöver SMS/RCS som del av kundresan eller servicekommunikation.",
   "considerations": "Produktnamn och AppSource-paket kan förändras; kontrollera aktuell Sinch-listning före publicering.",
   "tags": [
    "SMS",
    "RCS",
    "Messaging",
    "Omnichannel"
   ],
   "industries": [
    "Retail",
    "Services"
   ],
   "industry_focus": [
    "Retail",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "live-assist-live-assist-for-dynamics-365",
   "name": "Live Assist for Dynamics 365",
   "vendor": "Live Assist",
   "vendor_slug": "live-assist",
   "short_description": "Omnichannel messaging och live chat integrerat i Dynamics 365 för agentarbete och digitala konversationer.",
   "what": "Omnichannel messaging och live chat integrerat i Dynamics 365 för agentarbete och digitala konversationer.",
   "category": "Digital engagement / chat",
   "subcategory": "Chat & messaging",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.liveassistfor365.com/hc/en-us/articles/360006116814-Key-features-of-Live-Assist-for-Dynamics-365",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Service- och kundcenterorganisationer som behöver chat och asynkron messaging i Dynamics.",
   "considerations": "Marknaden för Microsofts egna digitala kanaler förändras snabbt; kontrollera funktionell överlappning.",
   "tags": [
    "Chat",
    "Messaging",
    "Omnichannel",
    "Customer service"
   ],
   "industries": [
    "Retail",
    "Services",
    "B2C",
    "Public sector"
   ],
   "industry_focus": [
    "Retail",
    "Services",
    "B2C",
    "Public sector"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "medallia-medallia-for-microsoft-dynamics-365",
   "name": "Medallia for Microsoft Dynamics 365",
   "vendor": "Medallia",
   "vendor_slug": "medallia",
   "short_description": "Tvåvägsintegration mellan Medallia Experience Cloud och Dynamics 365 för feedback, kundinsikter och actions.",
   "what": "Tvåvägsintegration mellan Medallia Experience Cloud och Dynamics 365 för feedback, kundinsikter och actions.",
   "category": "CX / Voice of Customer",
   "subcategory": "Experience management",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.medallia.com/en/medallia-experience-cloud/add-ons/medallia-for-microsoft-dynamics-365",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "partial",
   "best_for": "Större organisationer som använder Medallia som CX-/VoC-plattform och Dynamics som CRM.",
   "considerations": "Medallia är en bred CX-plattform; implementationen kräver tydlig data- och feedbackarkitektur.",
   "tags": [
    "CX",
    "Voice of Customer",
    "Feedback",
    "Customer experience"
   ],
   "industries": [
    "Enterprise",
    "Retail",
    "Financial services",
    "Services"
   ],
   "industry_focus": [
    "Enterprise",
    "Retail",
    "Financial services",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "solgari-solgari-ai-customer-engagement",
   "name": "Solgari AI Customer Engagement",
   "vendor": "Solgari",
   "vendor_slug": "solgari",
   "short_description": "Microsoft-native kundengagemang för Teams och Dynamics 365 med voice, messaging och AI-baserad transkribering, summering och sentiment.",
   "what": "Microsoft-native kundengagemang för Teams och Dynamics 365 med voice, messaging och AI-baserad transkribering, summering och sentiment.",
   "category": "Contact Center / CCaaS",
   "subcategory": "Omnichannel & AI",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://solgari.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer som vill bygga kontaktcenter och kundkommunikation nära Microsoft-stack och CRM-data.",
   "considerations": "Jämför mot Microsoft Contact Center, Teams-baserade alternativ och större CCaaS-plattformar.",
   "tags": [
    "Contact center",
    "Teams",
    "Voice",
    "Messaging",
    "AI",
    "Dynamics 365"
   ],
   "industries": [
    "Services",
    "Financial services"
   ],
   "industry_focus": [
    "Services",
    "Financial services"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "five9-five9-adapter-for-microsoft-dynamics-365",
   "name": "Five9 Adapter for Microsoft Dynamics 365",
   "vendor": "Five9",
   "vendor_slug": "five9",
   "short_description": "Integrerar Five9 Contact Center med Dynamics 365 så agenter får CRM-data och kontaktcenterfunktioner i samma arbetsyta.",
   "what": "Integrerar Five9 Contact Center med Dynamics 365 så agenter får CRM-data och kontaktcenterfunktioner i samma arbetsyta.",
   "category": "Contact Center / CCaaS",
   "subcategory": "CCaaS integration",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.five9.com/resources/datasheet-five9-adapter-for-microsoft-dynamics-365",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Kontaktcenter som redan använder eller utvärderar Five9.",
   "considerations": "Värdet och funktionaliteten beror på Five9-arkitekturen och vald Dynamics-app.",
   "tags": [
    "CCaaS",
    "Contact center",
    "Agent desktop",
    "Voice"
   ],
   "industries": [
    "Enterprise",
    "Services",
    "Contact center"
   ],
   "industry_focus": [
    "Enterprise",
    "Services",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "nice-cxone-agent-embedded-for-microsoft-dynamics",
   "name": "CXone Agent Embedded for Microsoft Dynamics",
   "vendor": "NiCE",
   "vendor_slug": "nice",
   "short_description": "NiCE CXone agent workspace kan bäddas in i Microsoft Dynamics via Channel Integration Framework.",
   "what": "NiCE CXone agent workspace kan bäddas in i Microsoft Dynamics via Channel Integration Framework.",
   "category": "Contact Center / CCaaS",
   "subcategory": "CCaaS integration",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://help.nicecxone.com/content/agent/agentapplicationadministration/cxoneagentembedded/installcxae/md/installcxaeinmdcifv2.htm",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Större kontaktcenter som använder CXone och Dynamics 365 Customer Service.",
   "considerations": "Kontrollera rätt CIF-version och aktuell CXone agentprodukt i implementationen.",
   "tags": [
    "CCaaS",
    "CXone",
    "Agent workspace",
    "Customer Service"
   ],
   "industries": [
    "Enterprise",
    "Services",
    "Contact center"
   ],
   "industry_focus": [
    "Enterprise",
    "Services",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "vonage-vonage-contact-center-for-microsoft-dynamics-365",
   "name": "Vonage Contact Center for Microsoft Dynamics 365",
   "vendor": "Vonage",
   "vendor_slug": "vonage",
   "short_description": "Vonage Contact Center integrerat med Dynamics 365 med embedded ContactPad, screen pop, logging och routing.",
   "what": "Vonage Contact Center integrerat med Dynamics 365 med embedded ContactPad, screen pop, logging och routing.",
   "category": "Contact Center / CCaaS",
   "subcategory": "CCaaS integration",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.vonage.com/contact-centers/integrations/microsoft-dynamics-365/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer som vill kombinera Vonage CCaaS med Sales, Customer Service eller Field Service.",
   "considerations": "Verifiera vilka funktioner som ingår i aktuell Vonage-plan och connectorversion.",
   "tags": [
    "CCaaS",
    "Voice",
    "CTI",
    "Customer Service",
    "Sales"
   ],
   "industries": [
    "Services",
    "Contact center",
    "Sales"
   ],
   "industry_focus": [
    "Services",
    "Contact center",
    "Sales"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "cisco-webex-contact-center-for-microsoft-dynamics-365",
   "name": "Webex Contact Center for Microsoft Dynamics 365",
   "vendor": "Cisco",
   "vendor_slug": "cisco",
   "short_description": "Connector som gör Webex Contact Center-funktioner tillgängliga i Microsoft Dynamics 365.",
   "what": "Connector som gör Webex Contact Center-funktioner tillgängliga i Microsoft Dynamics 365.",
   "category": "Contact Center / CCaaS",
   "subcategory": "CCaaS integration",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad, äldre dokumentation",
   "source_url": "https://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cust_contact/contact_center/webexcc/Dynamics_1/b_cisco-cjp-agent-hub-dynamics/_b_cisco-cjp-agent-hub-dynamics_preface_01.html",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Cisco/Webex-kunder som vill behålla Dynamics som agentens CRM-arbetsyta.",
   "considerations": "Cisco-dokumentationen som verifierats är äldre; kontrollera aktuell connector och supportstatus före publicering.",
   "tags": [
    "Webex",
    "CCaaS",
    "Contact center",
    "CTI"
   ],
   "industries": [
    "Enterprise",
    "Contact center"
   ],
   "industry_focus": [
    "Enterprise",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "ttec-digital-interactionsync-for-genesys-cloud",
   "name": "InteractionSync for Genesys Cloud",
   "vendor": "TTEC Digital",
   "vendor_slug": "ttec-digital",
   "short_description": "Integrerar Genesys Cloud med Microsoft Dynamics 365 med embedded agent client, screen pop och automatisk activity creation.",
   "what": "Integrerar Genesys Cloud med Microsoft Dynamics 365 med embedded agent client, screen pop och automatisk activity creation.",
   "category": "Contact Center / CCaaS",
   "subcategory": "Genesys Cloud integration",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://ipdoc.humanify.com/interactionsync/help/genesys/HTML/Content/Admin/AboutInteractionSync.htm",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer som standardiserat på Genesys Cloud och Dynamics 365 Customer Service.",
   "considerations": "Kontrollera aktuell publisher/partnerrelation och licensmodell för InteractionSync.",
   "tags": [
    "Genesys Cloud",
    "CCaaS",
    "CTI",
    "Screen pop"
   ],
   "industries": [
    "Enterprise",
    "Contact center"
   ],
   "industry_focus": [
    "Enterprise",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "8x8-8x8-integration-for-microsoft-dynamics",
   "name": "8x8 Integration for Microsoft Dynamics",
   "vendor": "8x8",
   "vendor_slug": "8x8",
   "short_description": "8x8 Work och 8x8 Contact Center integreras med Microsoft Dynamics och ger telefoni/agentfunktioner i CRM.",
   "what": "8x8 Work och 8x8 Contact Center integreras med Microsoft Dynamics och ger telefoni/agentfunktioner i CRM.",
   "category": "Contact Center / CCaaS",
   "subcategory": "Voice & contact center",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://help.8x8.com/documentation/docs/overview-8x8-integration-for-microsoft-dynamics",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer som använder 8x8 som UCaaS/CCaaS och Dynamics som CRM.",
   "considerations": "Avgränsa om behovet är telefoni, contact center eller båda.",
   "tags": [
    "8x8",
    "Voice",
    "CCaaS",
    "UCaaS",
    "Dynamics"
   ],
   "industries": [
    "SMB",
    "Mid-market",
    "Contact center"
   ],
   "industry_focus": [
    "SMB",
    "Mid-market",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "zoom-zoom-phone-for-microsoft-dynamics-365",
   "name": "Zoom Phone for Microsoft Dynamics 365",
   "vendor": "Zoom",
   "vendor_slug": "zoom",
   "short_description": "Zoom Phone inbäddat i Dynamics 365 med click-to-call, inkommande samtal, call logs, voicemail och SMS.",
   "what": "Zoom Phone inbäddat i Dynamics 365 med click-to-call, inkommande samtal, call logs, voicemail och SMS.",
   "category": "Telephony / CTI",
   "subcategory": "Cloud telephony",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0080228",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "partial",
   "best_for": "Organisationer som redan använder Zoom Phone och vill få telefoni nära CRM.",
   "considerations": "Telefoni snarare än full contact center i många scenarier; skilj det från CCaaS-alternativen.",
   "tags": [
    "Zoom Phone",
    "CTI",
    "Voice",
    "SMS"
   ],
   "industries": [
    "SMB",
    "Mid-market",
    "Services"
   ],
   "industry_focus": [
    "SMB",
    "Mid-market",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "dynamics-telephony-dynamics-telephony",
   "name": "Dynamics Telephony",
   "vendor": "Dynamics Telephony",
   "vendor_slug": "dynamics-telephony",
   "short_description": "CTI- och telefonitillägg för Microsoft Dynamics 365.",
   "what": "CTI- och telefonitillägg för Microsoft Dynamics 365.",
   "category": "Telephony / CTI",
   "subcategory": "CTI / telephony",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://marketplace.microsoft.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "partial",
   "best_for": "Organisationer som behöver generell CTI snarare än en större CCaaS-plattform.",
   "considerations": "Kontrollverifiera aktuell leverantör, produktstatus och Marketplace-listning före publicering.",
   "tags": [
    "CTI",
    "Telephony",
    "Dynamics 365"
   ],
   "industries": [
    "Services",
    "Sales",
    "Contact center"
   ],
   "industry_focus": [
    "Services",
    "Sales",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "ingenius-ingenius-for-microsoft-dynamics-365",
   "name": "InGenius for Microsoft Dynamics 365",
   "vendor": "InGenius",
   "vendor_slug": "ingenius",
   "short_description": "CTI-integration mellan telefoni och Dynamics 365 för screen pop, dialing och aktivitetsloggning.",
   "what": "CTI-integration mellan telefoni och Dynamics 365 för screen pop, dialing och aktivitetsloggning.",
   "category": "Telephony / CTI",
   "subcategory": "CTI",
   "delivery_model": "integration_layer",
   "type": "Integration layer",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://marketplace.microsoft.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "partial",
   "best_for": "Organisationer med telefoniplattform som stöds av InGenius.",
   "considerations": "Kontrollverifiera aktuell produktstatus och ägar-/partnerstruktur före publicering.",
   "tags": [
    "CTI",
    "Telephony",
    "Screen pop"
   ],
   "industries": [
    "Services",
    "Sales",
    "Contact center"
   ],
   "industry_focus": [
    "Services",
    "Sales",
    "Contact center"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "resco-resco-field-service",
   "name": "Resco Field Service+",
   "vendor": "Resco",
   "vendor_slug": "resco",
   "short_description": "Utökar Dynamics 365 Field Service med avancerad mobilitet, full offline, inspections, routes och andra fältfunktioner.",
   "what": "Utökar Dynamics 365 Field Service med avancerad mobilitet, full offline, inspections, routes och andra fältfunktioner.",
   "category": "Field Service mobility",
   "subcategory": "Mobile field service",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.resco.net/wiki/resco-field-service",
   "verified_at": "2026-09-07",
   "sales_relevance": "no",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Fältserviceorganisationer med höga krav på offline, mobil anpassning och robust teknikerupplevelse.",
   "considerations": "Jämför med Microsofts egen Field Service mobile app och definiera vilka extra Resco-funktioner som behövs.",
   "tags": [
    "Field Service",
    "Mobile",
    "Offline",
    "Technician"
   ],
   "industries": [
    "Field service",
    "Utilities",
    "Manufacturing",
    "Services"
   ],
   "industry_focus": [
    "Field service",
    "Utilities",
    "Manufacturing",
    "Services"
   ],
   "products": [
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "resco-resco-mobile-crm",
   "name": "Resco Mobile CRM",
   "vendor": "Resco",
   "vendor_slug": "resco",
   "short_description": "Mobil CRM-klient med offline-stöd för Dynamics 365 Sales, Field Service och Dataverse-baserade lösningar.",
   "what": "Mobil CRM-klient med offline-stöd för Dynamics 365 Sales, Field Service och Dataverse-baserade lösningar.",
   "category": "Field Service mobility",
   "subcategory": "Mobile CRM / offline",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.resco.net/wiki/CRM",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Mobila sälj- och serviceteam som behöver hög anpassningsgrad och offline.",
   "considerations": "Mer plattformsorienterad än Field Service+; rätt Resco-produkt bör väljas per scenario.",
   "tags": [
    "Mobile CRM",
    "Offline",
    "Sales",
    "Field Service",
    "Dataverse"
   ],
   "industries": [
    "Sales",
    "Field service",
    "Services"
   ],
   "industry_focus": [
    "Sales",
    "Field service",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "resco-resco-inspections",
   "name": "Resco Inspections+",
   "vendor": "Resco",
   "vendor_slug": "resco",
   "short_description": "Mobila checklistor, questionnaires, inspections och rapporter som kan användas med Dynamics 365/Power Platform.",
   "what": "Mobila checklistor, questionnaires, inspections och rapporter som kan användas med Dynamics 365/Power Platform.",
   "category": "Inspections",
   "subcategory": "Mobile inspections / forms",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.resco.net/wiki/Resco_Field_Service_2.0_for_Dynamics_365_Field_Service",
   "verified_at": "2026-09-07",
   "sales_relevance": "no",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Tekniker och inspektörer med komplexa formulär, checklistor och dokumentationskrav.",
   "considerations": "Inspektionsdesign och offlinekrav bör provas i verkliga användarscenarier.",
   "tags": [
    "Inspections",
    "Forms",
    "Mobile",
    "Offline"
   ],
   "industries": [
    "Field service",
    "Manufacturing",
    "Property",
    "Utilities"
   ],
   "industry_focus": [
    "Field service",
    "Manufacturing",
    "Property",
    "Utilities"
   ],
   "products": [
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "resco-resco-routes",
   "name": "Resco Routes",
   "vendor": "Resco",
   "vendor_slug": "resco",
   "short_description": "Route planning, schedule board, location monitoring och fältresursspårning med stöd för Dynamics 365 CRM.",
   "what": "Route planning, schedule board, location monitoring och fältresursspårning med stöd för Dynamics 365 CRM.",
   "category": "Territory & Maps",
   "subcategory": "Routes / workforce tracking",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "wave_2",
   "source_status": "Verifierad",
   "source_url": "https://docs.resco.net/wiki/Resco_Routes",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med många fältbesök och behov av rutt- och resursöverblick.",
   "considerations": "Avgränsa mot Maplytics, EasyTerritory och Microsofts egen schedule board.",
   "tags": [
    "Routes",
    "Scheduling",
    "Location",
    "Field workforce"
   ],
   "industries": [
    "Field service",
    "Sales",
    "Logistics"
   ],
   "industry_focus": [
    "Field service",
    "Sales",
    "Logistics"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "hso-advanced-field-service",
   "name": "Advanced Field Service",
   "vendor": "HSO",
   "vendor_slug": "hso",
   "short_description": "Utökar Dynamics 365 Field Service inom case management, quoting, customer assets, agreements, work orders och invoicing.",
   "what": "Utökar Dynamics 365 Field Service inom case management, quoting, customer assets, agreements, work orders och invoicing.",
   "category": "Field Service extensions",
   "subcategory": "Advanced field service",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.hso.com/ip-offering/advanced-field-service",
   "verified_at": "2026-09-07",
   "sales_relevance": "no",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Serviceorganisationer som behöver mer processdjup än standard Field Service.",
   "considerations": "HSO-lösningens fit bör bedömas mot kundens exakta serviceprocess och ERP-integration.",
   "tags": [
    "Field Service",
    "Assets",
    "Agreements",
    "Work orders",
    "Billing"
   ],
   "industries": [
    "Field service",
    "Professional services",
    "Asset service"
   ],
   "industry_focus": [
    "Field service",
    "Professional services",
    "Asset service"
   ],
   "products": [
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-maplytics",
   "name": "Maplytics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Location intelligence för Dynamics 365 med mapping, territory management, route optimization, proximity search och appointment planning.",
   "what": "Location intelligence för Dynamics 365 med mapping, territory management, route optimization, proximity search och appointment planning.",
   "category": "Territory & Maps",
   "subcategory": "Maps / route / territory",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.inogic.com/product/integrations/maplytics-bing-map-microsoft-dynamics-crm/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Sälj- och serviceteam där geografi påverkar territorier, besök, planering och resor.",
   "considerations": "Kart- och geodata bör hanteras med hänsyn till datakvalitet, licensiering och integritet.",
   "tags": [
    "Maps",
    "Territory",
    "Routing",
    "Proximity",
    "Field Service"
   ],
   "industries": [
    "Sales",
    "Field service",
    "Retail",
    "Services"
   ],
   "industry_focus": [
    "Sales",
    "Field service",
    "Retail",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "maptaskr-maptaskr-power-maps",
   "name": "Maptaskr Power Maps",
   "vendor": "Maptaskr",
   "vendor_slug": "maptaskr",
   "short_description": "Geospatial lösning för Dynamics 365 och Power Apps med 2D/3D-kartor, GIS-integration och offline.",
   "what": "Geospatial lösning för Dynamics 365 och Power Apps med 2D/3D-kartor, GIS-integration och offline.",
   "category": "Territory & Maps",
   "subcategory": "Geospatial / GIS",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://maptaskr.com/pricing",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med mer avancerade GIS-krav än vanlig CRM-kartläggning.",
   "considerations": "Nischad mot geospatial/GIS; jämför mot Maplytics och EasyTerritory.",
   "tags": [
    "GIS",
    "Maps",
    "ArcGIS",
    "Offline",
    "Dynamics 365"
   ],
   "industries": [
    "Utilities",
    "Public sector",
    "Field service",
    "Property"
   ],
   "industry_focus": [
    "Utilities",
    "Public sector",
    "Field service",
    "Property"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "easyterritory-easymap-for-dynamics-365",
   "name": "EasyMap for Dynamics 365",
   "vendor": "EasyTerritory",
   "vendor_slug": "easyterritory",
   "short_description": "Territory design, mapping och Dynamics 365/Power Apps-kartor för geografisk planering.",
   "what": "Territory design, mapping och Dynamics 365/Power Apps-kartor för geografisk planering.",
   "category": "Territory & Maps",
   "subcategory": "Territory / mapping",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://www.easyterritory.com/documentation/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "partial",
   "customer_service_relevance": "partial",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Sälj- och serviceorganisationer med avancerad territory management.",
   "considerations": "Välj rätt EasyTerritory-komponent; produktsviten innehåller flera delar.",
   "tags": [
    "Territory",
    "Maps",
    "Power BI",
    "Power Apps"
   ],
   "industries": [
    "Sales",
    "Field service",
    "Distribution"
   ],
   "industry_focus": [
    "Sales",
    "Field service",
    "Distribution"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "hcl-powerobjects-powermap",
   "name": "PowerMap",
   "vendor": "HCL / PowerObjects",
   "vendor_slug": "hcl-powerobjects",
   "short_description": "CRM-kartläggning och location intelligence för Dynamics 365.",
   "what": "CRM-kartläggning och location intelligence för Dynamics 365.",
   "category": "Territory & Maps",
   "subcategory": "CRM mapping",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://marketplace.microsoft.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "no",
   "customer_service_relevance": "partial",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med enklare mappingbehov.",
   "considerations": "Kontrollverifiera aktuell produktstatus; PowerObjects-portföljen har förändrats över tid.",
   "tags": [
    "Maps",
    "CRM",
    "Location"
   ],
   "industries": [
    "Sales",
    "Services"
   ],
   "industry_focus": [
    "Sales",
    "Services"
   ],
   "products": [
    "Sales",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "data8-duplicare",
   "name": "Duplicare",
   "vendor": "Data8",
   "vendor_slug": "data8",
   "short_description": "Avancerad duplicate detection, merge och prevention för Dynamics 365 och Power Platform.",
   "what": "Avancerad duplicate detection, merge och prevention för Dynamics 365 och Power Platform.",
   "category": "CRM datakvalitet",
   "subcategory": "Duplicate detection / merge",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 1",
   "editorial_tier": "Tier 1",
   "nordic_relevance": "high",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://marketplace.microsoft.com/sv-se/product/data8.duplicare-saas?tab=overview",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer där dubbletter påverkar försäljning, marketing, service och rapportering.",
   "considerations": "Dedupe-regler behöver utformas så att legitima liknande poster inte slås ihop felaktigt.",
   "tags": [
    "Data quality",
    "Dedupe",
    "Duplicate detection",
    "Dataverse"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-deduped",
   "name": "DeDupeD",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Duplicate detection och datakvalitet för Dynamics 365 CRM med bland annat fuzzy matching.",
   "what": "Duplicate detection och datakvalitet för Dynamics 365 CRM med bland annat fuzzy matching.",
   "category": "CRM datakvalitet",
   "subcategory": "Duplicate detection",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.inogic.com/deduped/configuration/deduped-settings",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som vill ha dedupe-funktionalitet direkt i Dynamics 365.",
   "considerations": "Jämför mot Data8 Duplicare och standard duplicate detection utifrån komplexitet.",
   "tags": [
    "Dedupe",
    "Fuzzy matching",
    "Data quality"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-attach2dynamics",
   "name": "Attach2Dynamics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Flyttar och hanterar Dynamics 365-filer och attachments i SharePoint, Azure Blob Storage eller Dropbox.",
   "what": "Flyttar och hanterar Dynamics 365-filer och attachments i SharePoint, Azure Blob Storage eller Dropbox.",
   "category": "Dokument & lagring",
   "subcategory": "Cloud storage integration",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.inogic.com/attach2dynamics",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som vill minska Dataverse storage och förbättra dokumenthantering.",
   "considerations": "Säkerhet, datalagring och SharePoint-arkitektur måste planeras.",
   "tags": [
    "Documents",
    "Storage",
    "SharePoint",
    "Azure Blob",
    "Dataverse"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-sharepoint-security-sync",
   "name": "SharePoint Security Sync",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Synkroniserar Dynamics 365-behörigheter till SharePoint och kombinerar detta med dokumenthantering.",
   "what": "Synkroniserar Dynamics 365-behörigheter till SharePoint och kombinerar detta med dokumenthantering.",
   "category": "Dokument & lagring",
   "subcategory": "SharePoint security",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://docs.inogic.com/sharepoint-security-sync/features",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "no",
   "best_for": "Organisationer med CRM-dokument i SharePoint och behov av sammanhängande behörighetsmodell.",
   "considerations": "Behörighetsdesignen kan bli komplex; testa särskilt delning, teams och externa användare.",
   "tags": [
    "SharePoint",
    "Security",
    "Documents",
    "Permissions"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-undo2restore",
   "name": "Undo2Restore",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Återställnings- och undo-funktioner för Dynamics 365-data.",
   "what": "Återställnings- och undo-funktioner för Dynamics 365-data.",
   "category": "Backup / restore",
   "subcategory": "Record recovery",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://www.inogic.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "no",
   "best_for": "Organisationer som vill komplettera backup/recovery med användarnära återställning.",
   "considerations": "Verifiera aktuell produktstatus, scope och hur den förhåller sig till Dataverse backup.",
   "tags": [
    "Backup",
    "Restore",
    "Recovery",
    "Dataverse"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service"
   ],
   "is_published": false
  },
  {
   "solution_id": "walkme-walkme-digital-adoption-for-microsoft-dynamics",
   "name": "WalkMe Digital Adoption for Microsoft Dynamics",
   "vendor": "WalkMe",
   "vendor_slug": "walkme",
   "short_description": "Digital adoption-plattform som kan distribueras direkt i Microsoft Dynamics för guider, stöd och användaranalys.",
   "what": "Digital adoption-plattform som kan distribueras direkt i Microsoft Dynamics för guider, stöd och användaranalys.",
   "category": "Digital adoption",
   "subcategory": "In-app guidance",
   "delivery_model": "external_saas",
   "type": "External SaaS",
   "tier": "Tier 2",
   "editorial_tier": "Tier 2",
   "nordic_relevance": "medium",
   "publication_wave": "now",
   "source_status": "Verifierad",
   "source_url": "https://support.walkme.com/knowledge-base/install-walkme-for-microsoft-dynamics/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "yes",
   "contact_center_relevance": "partial",
   "best_for": "Stora organisationer med omfattande förändringsledning, onboarding och komplexa CRM-processer.",
   "considerations": "Detta är en generell digital adoption-plattform, inte ett Dynamics-specifikt affärstillägg.",
   "tags": [
    "Digital adoption",
    "Training",
    "Guidance",
    "Analytics"
   ],
   "industries": [
    "Enterprise"
   ],
   "industry_focus": [
    "Enterprise"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-textsms4dynamics",
   "name": "TextSMS4Dynamics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "SMS-funktionalitet för Dynamics 365 CRM och Dataverse.",
   "what": "SMS-funktionalitet för Dynamics 365 CRM och Dataverse.",
   "category": "SMS & messaging",
   "subcategory": "SMS",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://www.inogic.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "partial",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer som vill ha enklare SMS direkt i CRM.",
   "considerations": "Kontrollverifiera aktuell AppSource-listning, operatörsstöd och geografisk täckning.",
   "tags": [
    "SMS",
    "Messaging",
    "Dynamics CRM"
   ],
   "industries": [],
   "industry_focus": [],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Field Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-whatsapp4dynamics",
   "name": "WhatsApp4Dynamics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "WhatsApp-kommunikation kopplad till Dynamics 365 CRM.",
   "what": "WhatsApp-kommunikation kopplad till Dynamics 365 CRM.",
   "category": "SMS & messaging",
   "subcategory": "WhatsApp",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://www.inogic.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "yes",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Organisationer där WhatsApp är en viktig kundkanal.",
   "considerations": "Meta-policy, template messages och regionala krav behöver verifieras.",
   "tags": [
    "WhatsApp",
    "Messaging",
    "Omnichannel"
   ],
   "industries": [
    "Retail",
    "Services",
    "B2C"
   ],
   "industry_focus": [
    "Retail",
    "Services",
    "B2C"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  },
  {
   "solution_id": "inogic-livechat4dynamics",
   "name": "LiveChat4Dynamics",
   "vendor": "Inogic",
   "vendor_slug": "inogic",
   "short_description": "Live chat-funktionalitet kopplad till Dynamics 365 CRM.",
   "what": "Live chat-funktionalitet kopplad till Dynamics 365 CRM.",
   "category": "Digital engagement / chat",
   "subcategory": "Live chat",
   "delivery_model": "native_isv",
   "type": "CE-native (ISV)",
   "tier": "Tier 3",
   "editorial_tier": "Tier 3",
   "nordic_relevance": "low",
   "publication_wave": "wave_2",
   "source_status": "Verifiera före publicering",
   "source_url": "https://www.inogic.com/",
   "verified_at": "2026-09-07",
   "sales_relevance": "partial",
   "customer_insights_relevance": "yes",
   "customer_service_relevance": "yes",
   "field_service_relevance": "no",
   "contact_center_relevance": "yes",
   "best_for": "Mindre organisationer som vill lägga till chat utan en full CCaaS-plattform.",
   "considerations": "Jämför med Microsofts digitala kanaler, Live Assist och Solgari.",
   "tags": [
    "Live chat",
    "Messaging",
    "Customer Service"
   ],
   "industries": [
    "Retail",
    "Services",
    "B2C"
   ],
   "industry_focus": [
    "Retail",
    "Services",
    "B2C"
   ],
   "products": [
    "Sales",
    "Customer Insights (Marketing)",
    "Customer Service",
    "Contact Center"
   ],
   "is_published": false
  }
 ]
} as const;
const KEY = "ce-import-9f3a71c2";

Deno.serve(async (req) => {
  if (req.headers.get("x-import-key") !== KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const v = await supabase.from("isv_vendors").upsert(DATA.vendors as unknown as Record<string, unknown>[], { onConflict: "slug" });
  const s = await supabase
    .from("isv_solutions")
    .upsert(DATA.solutions as unknown as Record<string, unknown>[], { onConflict: "solution_id" });
  return new Response(
    JSON.stringify({ vendors: v.error?.message ?? "ok", solutions: s.error?.message ?? "ok", count: DATA.solutions.length }),
    { headers: { "Content-Type": "application/json" } }
  );
});
