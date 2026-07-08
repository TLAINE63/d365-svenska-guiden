import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article" | "video.other";
  ogVideo?: string;
  noIndex?: boolean;
  // Article-specific metadata (used when ogType === "article")
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
}

const SEOHead = ({
  title,
  description,
  canonicalPath = "",
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
}: SEOHeadProps) => {
  const baseUrl = "https://d365.se";

  const trailingPath = canonicalPath.endsWith("/") ? canonicalPath : `${canonicalPath}/`;
  const canonicalUrl = `${baseUrl}${trailingPath}`;
  const fullTitle = title.includes("d365.se") ? title : `${title} | d365.se`;

  const resolvedOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
  const isArticle = ogType === "article";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:site_name" content="d365.se" />
      <meta property="og:locale" content="sv_SE" />
      <meta property="og:locale:alternate" content="nb_NO" />
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
          content={articleModifiedTime || articlePublishedTime!}
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
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
    </Helmet>
  );
};

export default SEOHead;
