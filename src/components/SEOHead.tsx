import { Helmet } from "react-helmet-async";
import { pageReviewDate } from "@/data/pageReviewDates";
import { useLocation } from "react-router-dom";
import { ORGANIZATION } from "@/data/organization";
import { buildSeoTitle } from "@/lib/seoTitle";
import { fitMetaDescription } from "@/lib/metaDescription";

interface SEOHeadProps {
  title: string;
  /** Endast när en exakt beslutad titel är längre än standardgränsen. */
  titleMaxLength?: number;
  description: string;
  /** Egen titel för delning i sociala medier (og:title/twitter:title). */
  ogTitle?: string;
  /** Egen text för delning i sociala medier (og:description/twitter:description). */
  ogDescription?: string;
  canonicalPath?: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article" | "event" | "video.other";
  ogVideo?: string;
  noIndex?: boolean;
  // Article-specific metadata (used when ogType === "article")
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
  /** Emit WebPage JSON-LD automatically (default true). */
  webPageSchema?: boolean;
  /** Breadcrumb trail. Ange endast på sidor som inte redan renderar BreadcrumbSchema. */
  breadcrumbs?: { name: string; url: string }[];
  /** Senast uppdaterad (ÅÅÅÅ-MM-DD), skrivs som dateModified i WebPage. */
  dateModified?: string;
  /** Sidans språk. Standard svenska; "en" för enstaka engelska landningssidor. */
  language?: "sv" | "en";
}

const SEOHead = ({
  title,
  titleMaxLength,
  description,
  ogTitle,
  ogDescription,
  canonicalPath,
  keywords,
  ogImage = "https://d365.se/og-erp.png",
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogType = "website",
  ogVideo,
  noIndex = false,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
  articleTags,
  webPageSchema = true,
  breadcrumbs,
  dateModified,
  language = "sv",
}: SEOHeadProps) => {
  const isEnglish = language === "en";
  // Bing/Google vill ha ca 110–160 tecken. Långa beskrivningar kortas vid hel
  // mening; korta kompletteras med en neutral mening om d365.se som ryms helt.
  const DESC_SUFFIXES = isEnglish
    ? [
        "Compare verified partners and solutions on d365.se, the Swedish guide to Dynamics\u00A0365.",
        "Compare partners on d365.se, the Swedish guide to Dynamics\u00A0365.",
        "Buyer-side guidance from d365.se.",
      ]
    : [
        "Jämför verifierade partners, priser och lösningar på d365.se, den svenska guiden till Dynamics\u00A0365.",
        "Jämför partners och lösningar på d365.se, den svenska guiden till Dynamics\u00A0365.",
        "Guide inför system- och partnerval på d365.se.",
      ];
  description = fitMetaDescription(description || "", DESC_SUFFIXES);
  const baseUrl = "https://d365.se";
  const { pathname } = useLocation();

  // Faller tillbaka på aktuell route så varje sida självrefererar
  // istället för att peka på startsidan.
  const resolvedPath = canonicalPath ?? pathname ?? "/";
  const trailingPath = resolvedPath.endsWith("/") ? resolvedPath : `${resolvedPath}/`;
  const canonicalUrl = `${baseUrl}${trailingPath}`;
  const fullTitle = buildSeoTitle(title, titleMaxLength);

  const socialTitle = (ogTitle || "").trim() || fullTitle;
  const socialDescription = (ogDescription || "").trim() || description;

  const resolvedOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
  const isArticle = ogType === "article";

  const webPageLd = webPageSchema
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: fullTitle,
        description,
        url: canonicalUrl,
        inLanguage: isEnglish ? "en" : "sv-SE",
        isPartOf: { "@id": `${baseUrl}/#website` },
        primaryImageOfPage: { "@type": "ImageObject", url: resolvedOgImage },
        "@id": `${canonicalUrl}#webpage`,
        mainEntityOfPage: canonicalUrl,
        author: { "@type": "Organization", name: "d365.se-redaktionen", url: `${baseUrl}/om-oss/`, parentOrganization: { "@id": `${baseUrl}/#organization` } },
        publisher: { "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "d365.se", url: baseUrl },
        ...((dateModified ?? pageReviewDate(trailingPath)) ? { dateModified: dateModified ?? pageReviewDate(trailingPath) } : {}),
      }
    : null;

  const breadcrumbLd = breadcrumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url.startsWith("http") ? b.url : `${baseUrl}${b.url}`,
        })),
      }
    : null;

  return (
    <Helmet htmlAttributes={isEnglish ? { lang: "en" } : undefined}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      {/* 0 = okända mått (t.ex. partnerlogotyper); ange då inga mått i stället för fel mått. */}
      {ogImageWidth > 0 && <meta property="og:image:width" content={String(ogImageWidth)} />}
      {ogImageHeight > 0 && <meta property="og:image:height" content={String(ogImageHeight)} />}
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:site_name" content="d365.se" />
      <meta property="og:locale" content={isEnglish ? "en_GB" : "sv_SE"} />
      <meta property="og:locale:alternate" content={isEnglish ? "sv_SE" : "nb_NO"} />
      {ogVideo && <meta property="og:video" content={ogVideo} />}
      {ogVideo && <meta property="og:video:secure_url" content={ogVideo} />}
      {ogVideo && <meta property="og:video:type" content="text/html" />}


      {/* Article-specific Open Graph tags */}
      {isArticle && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {isArticle && (articleModifiedTime || articlePublishedTime) && (
        <meta
          property="article:modified_time"
          content={articleModifiedTime ?? articlePublishedTime ?? ""}
        />
      )}
      {isArticle && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {isArticle && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {isArticle &&
        articleTags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={resolvedOgImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}

      {/* Structured data */}
      {webPageLd && (
        <script type="application/ld+json">{JSON.stringify(webPageLd)}</script>
      )}
      {breadcrumbLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
