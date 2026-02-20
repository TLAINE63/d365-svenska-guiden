import { Helmet } from "react-helmet";

// Organization Schema
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dynamic Factory",
    "alternateName": "d365.se",
    "url": "https://d365.se",
    "logo": {
      "@type": "ImageObject",
      "url": "https://d365.se/logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Oberoende guide och rådgivning för Microsoft Dynamics 365 ERP och CRM i Sverige. Hjälper företag välja rätt affärssystem och Microsoft-partner.",
    "foundingDate": "2020",
    "areaServed": {
      "@type": "Country",
      "name": "Sweden"
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
    "sameAs": [
      "https://www.linkedin.com/showcase/d365se/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+46-72-232-40-60",
      "contactType": "customer service",
      "areaServed": "SE",
      "availableLanguage": "Swedish"
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

// LocalBusiness Schema
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dynamic Factory",
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
    "name": "d365.se – Microsoft Dynamics 365 Guide",
    "alternateName": "Dynamic Factory Dynamics 365 Guide",
    "url": "https://d365.se",
    "description": "Oberoende guide till Microsoft Dynamics 365 ERP och CRM i Sverige – priser, implementering och partnerval",
    "inLanguage": "sv-SE",
    "publisher": {
      "@type": "Organization",
      "name": "Dynamic Factory",
      "url": "https://d365.se",
      "logo": {
        "@type": "ImageObject",
        "url": "https://d365.se/logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://d365.se/valj-partner?q={search_term_string}"
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
