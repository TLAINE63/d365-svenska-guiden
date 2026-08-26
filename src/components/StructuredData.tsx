import { Helmet } from "react-helmet-async";
import { ORGANIZATION } from "@/data/organization";


// Organization Schema
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${ORGANIZATION.url}/#organization`,
    "name": ORGANIZATION.name,
    "legalName": ORGANIZATION.legalName,
    "alternateName": ["D365 Guiden", ORGANIZATION.legalName],
    "url": ORGANIZATION.url,
    "logo": {
      "@type": "ImageObject",
      "url": ORGANIZATION.logoUrl,
      "width": 2000,
      "height": 1620,
      "caption": "d365.se – köparsidig guide till Microsoft Dynamics 365"
    },
    "image": ORGANIZATION.logoUrl,
    "description": ORGANIZATION.description,
    "foundingDate": ORGANIZATION.foundingDate,
    "email": ORGANIZATION.email,
    "telephone": ORGANIZATION.telephoneE164,
    "parentOrganization": {
      "@type": "Organization",
      "name": ORGANIZATION.parentName
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": ORGANIZATION.countryCode
    },
    "areaServed": {
      "@type": "Country",
      "name": ORGANIZATION.countryName
    },
    "knowsAbout": [
      "Microsoft Dynamics 365",
      "Business Central",
      "Dynamics 365 Finance",
      "Dynamics 365 Supply Chain Management",
      "Dynamics 365 Sales",
      "Dynamics 365 Customer Service",
      "ERP-system",
      "CRM-system"
    ],
    "sameAs": [...ORGANIZATION.sameAs],
    "contactPoint": ORGANIZATION.advisors.map((a) => ({
      "@type": "ContactPoint",
      "name": a.name,
      "email": a.email,
      "telephone": a.telephoneE164,
      "contactType": "customer service",
      "areaServed": ORGANIZATION.countryCode,
      "availableLanguage": "Swedish"
    }))

  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// LocalBusiness Schema
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "D365 Guiden",
    "description": "Senior rådgivare inom Microsoft affärslösningar Dynamics 365, Power Platform och Copilot",
    "url": "https://d365.se",
    "telephone": "+46-72-232-40-60",
    "email": "info@d365.se",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SE"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Sweden"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Service Schema
interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
}

export const ServiceSchema = ({ name, description, provider = "Dynamic Factory" }: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider,
      "url": "https://d365.se"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Sweden"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// WebSite Schema with SearchAction
export const WebSiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "D365 Guiden",
    "alternateName": ["d365.se", "Dynamics 365 Guiden Sverige"],
    "url": "https://d365.se",
    "description": "Hjälper svenska företag hitta rätt Microsoft Dynamics 365-partner utifrån behov, bransch och storlek.",
    "inLanguage": "sv-SE",
    "publisher": {
      "@type": "Organization",
      "name": "Dynamic Factory",
      "url": "https://d365.se",
      "logo": {
        "@type": "ImageObject",
        "url": "https://d365.se/d365guide-logo.png",
        "width": 2000,
        "height": 1620
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://d365.se/valjdynamics365partner?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Person Schema – for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  email?: string;
  telephone?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

export const PersonSchema = ({
  name,
  jobTitle,
  description,
  image,
  email,
  telephone,
  sameAs = [],
  knowsAbout = [],
}: PersonSchemaProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "image": image.startsWith("http") ? image : `https://d365.se${image}`,
    "worksFor": {
      "@type": "Organization",
      "name": "D365 Guiden",
      "url": "https://d365.se"
    },
    "nationality": "Swedish",
    "knowsLanguage": ["sv-SE", "en"],
  };
  if (email) schema.email = email;
  if (telephone) schema.telephone = telephone;
  if (sameAs.length) schema.sameAs = sameAs;
  if (knowsAbout.length) schema.knowsAbout = knowsAbout;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// WebPage Schema – generic page-level schema
interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  primaryImageOfPage?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: { name: string; url: string }[];
}

export const WebPageSchema = ({
  name,
  description,
  url,
  inLanguage = "sv-SE",
  primaryImageOfPage,
  datePublished,
  dateModified,
  breadcrumb,
}: WebPageSchemaProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: "D365 Guiden",
      url: "https://d365.se",
    },
    publisher: {
      "@type": "Organization",
      name: "Dynamic Factory",
      url: "https://d365.se",
      logo: {
        "@type": "ImageObject",
        url: "https://d365.se/d365guide-logo.png",
      },
    },
  };
  if (primaryImageOfPage) {
    schema.primaryImageOfPage = {
      "@type": "ImageObject",
      url: primaryImageOfPage.startsWith("http") ? primaryImageOfPage : `https://d365.se${primaryImageOfPage}`,
    };
  }
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;
  if (breadcrumb && breadcrumb.length) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Article Schema – generic article schema
interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorType?: "Person" | "Organization";
  authorDescription?: string;
  authorUrl?: string;
  authorSameAs?: string[];
  section?: string;
}

export const ArticleSchema = ({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Thomas Laine",
  authorType = "Person",
  authorDescription = "Senior rådgivare med över 30 år i Microsoft Dynamics-ekosystemet – ERP, CRM och partnerlandskapet i Sverige.",
  authorUrl = "https://d365.se/om-thomas-laine/",
  authorSameAs = ["https://linkedin.com/in/thomaslaine"],
  section,
}: ArticleSchemaProps) => {
  // Google Article rich result requires datePublished + image. Fall back to
  // a stable site-launch date and the default OG image when an article does
  // not specify them, so Rich Results Test reports no warnings.
  const fallbackPublished = "2024-01-01";
  const resolvedImage = image
    ? (image.startsWith("http") ? image : `https://d365.se${image}`)
    : "https://d365.se/d365guide-logo.png";

  const author: Record<string, unknown> =
    authorType === "Person"
      ? {
          "@type": "Person",
          name: authorName,
          description: authorDescription,
          url: authorUrl,
          ...(authorSameAs.length ? { sameAs: authorSameAs } : {}),
          worksFor: {
            "@type": "Organization",
            name: "d365.se",
            url: "https://d365.se",
          },
        }
      : {
          "@type": "Organization",
          name: authorName,
          url: "https://d365.se",
        };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    image: resolvedImage,
    datePublished: datePublished || fallbackPublished,
    dateModified: dateModified || datePublished || fallbackPublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "sv-SE",
    author,
    publisher: {
      "@type": "Organization",
      name: "d365.se",
      url: "https://d365.se",
      logo: {
        "@type": "ImageObject",
        url: "https://d365.se/d365guide-logo.png",
      },
    },
  };
  if (section) schema.articleSection = section;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// ItemList Schema – for partner listing / directory pages
interface ItemListSchemaProps {
  name?: string;
  description?: string;
  items: Array<{ name: string; url: string }>;
}

export const ItemListSchema = ({ name, description, items }: ItemListSchemaProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      name: it.name,
    })),
  };
  if (name) schema.name = name;
  if (description) schema.description = description;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Dataset Schema – för öppna, maskinläsbara dataset (AI-synlighet/citerbarhet)
interface DatasetSchemaProps {
  name: string;
  description: string;
  url: string;
  distributionUrl: string;
  license?: string;
  keywords?: string[];
  datePublished?: string;
}

export const DatasetSchema = ({
  name,
  description,
  url,
  distributionUrl,
  license = "https://d365.se/friskrivning",
  keywords,
  datePublished,
}: DatasetSchemaProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url,
    license,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "d365.se",
      url: "https://d365.se",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: distributionUrl,
      },
    ],
  };
  if (keywords?.length) schema.keywords = keywords;
  if (datePublished) schema.datePublished = datePublished;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};


// Partner Organization Schema – for partner profile pages
interface PartnerOrganizationSchemaProps {
  name: string;
  description?: string;
  slug: string;
  website?: string;
  logoUrl?: string;
  applications?: string[];
}

export const PartnerOrganizationSchema = ({
  name,
  description,
  slug,
  website,
  logoUrl,
  applications,
}: PartnerOrganizationSchemaProps) => {
  const profileUrl = `https://d365.se/partner/${slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: website || profileUrl,
    mainEntityOfPage: profileUrl,
    areaServed: { "@type": "Country", name: "Sweden" },
  };
  if (description) schema.description = description;
  if (logoUrl) schema.logo = { "@type": "ImageObject", url: logoUrl };
  if (applications && applications.length) {
    schema.knowsAbout = ["Microsoft Dynamics 365", ...applications];
  }
  if (website) schema.sameAs = [website];

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Combined Advisors Schema – pre-configured for Thomas & Michael
export const AdvisorsSchema = () => {
  const knowsAbout = [
    "Microsoft Dynamics 365",
    "Dynamics 365 Business Central",
    "Dynamics 365 Finance",
    "Dynamics 365 Supply Chain Management",
    "Dynamics 365 Sales",
    "Dynamics 365 Customer Service",
    "ERP-implementering",
    "CRM-strategi",
    "Microsoft Copilot",
    "AI-agenter",
  ];
  return (
    <>
      <PersonSchema
        name="Thomas Laine"
        jobTitle="Senior rådgivare och medgrundare, d365.se"
        description="Senior rådgivare med över 30 år i Microsoft Dynamics-ekosystemet – ERP, CRM, partnerlandskap och affärssystemsbeslut i Sverige."
        image="/src/assets/thomas-laine-real.jpg"
        email="thomas.laine@dynamicfactory.se"
        telephone="+46-72-232-40-60"
        sameAs={["https://linkedin.com/in/thomaslaine"]}
        knowsAbout={knowsAbout}
      />
      <PersonSchema
        name="Michael Uhman"
        jobTitle="Senior rådgivare och medgrundare, d365.se"
        description="Senior rådgivare med lång erfarenhet av affärssystem, verksamhetsutveckling, partnerlandskapet och Dynamics 365-relaterade beslut."
        image="/src/assets/michael-uhman.jpg"
        email="michael.uhman@dynamicfactory.se"
        telephone="+46-70-574-88-50"
        sameAs={["https://www.linkedin.com/in/michael-uhman-60a69b17/"]}
        knowsAbout={knowsAbout}
      />
    </>
  );
};

// Event Schema – emit only data that is visible on the page
interface EventSchemaItem {
  name: string;
  description?: string;
  startDate: string; // ISO 8601 (YYYY-MM-DD or full)
  endDate?: string;
  isOnline: boolean;
  locationName?: string;
  url: string;
  image?: string;
  organizerName?: string;
  organizerUrl?: string;
  status?: "EventScheduled" | "EventPostponed" | "EventRescheduled" | "EventCancelled" | "EventMovedOnline";
}

export const EventSchema = ({ events }: { events: EventSchemaItem[] }) => {
  if (!events.length) return null;
  const items = events.map((e) => {
    const node: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.name,
      startDate: e.startDate,
      eventAttendanceMode: e.isOnline
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: `https://schema.org/${e.status || "EventScheduled"}`,
      url: e.url,
      location: e.isOnline
        ? { "@type": "VirtualLocation", url: e.url }
        : {
            "@type": "Place",
            name: e.locationName || "Sverige",
            address: { "@type": "PostalAddress", addressCountry: "SE", ...(e.locationName ? { addressLocality: e.locationName } : {}) },
          },
    };
    if (e.endDate) node.endDate = e.endDate;
    if (e.description) node.description = e.description;
    if (e.image) node.image = e.image.startsWith("http") ? e.image : `https://d365.se${e.image}`;
    if (e.organizerName) {
      node.organizer = {
        "@type": "Organization",
        name: e.organizerName,
        ...(e.organizerUrl ? { url: e.organizerUrl } : {}),
      };
    }
    return node;
  });

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(items.length === 1 ? items[0] : items)}</script>
    </Helmet>
  );
};

// SoftwareApplication Schema – for interactive tools (analyses, requirement specs)
interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string; // e.g. BusinessApplication
}

export const SoftwareApplicationSchema = ({
  name,
  description,
  url,
  applicationCategory = "BusinessApplication",
}: SoftwareApplicationSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Web",
    inLanguage: "sv-SE",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
    provider: {
      "@type": "Organization",
      name: "d365.se",
      url: "https://d365.se",
    },
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};


interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}

export const CollectionPageSchema = ({ name, description, url, items = [] }: CollectionPageSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "sv-SE",
    isPartOf: { "@type": "WebSite", name: "d365.se", url: "https://d365.se" },
    publisher: {
      "@type": "Organization",
      name: "d365.se",
      url: "https://d365.se",
      logo: { "@type": "ImageObject", url: "https://d365.se/d365guide-logo.png" },
    },
    ...(items.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }
      : {}),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
