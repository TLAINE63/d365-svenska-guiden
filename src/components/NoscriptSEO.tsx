/**
 * NoscriptSEO renders key page content in a visually hidden but
 * DOM-visible element. This ensures crawlers and pre-rendering can
 * index the page's primary text content directly in the HTML source,
 * improving SEO scores. The content is hidden from sighted users
 * using sr-only (screen-reader only) styling.
 */

interface NoscriptSEOProps {
  title: string;
  description: string;
  sections?: { heading: string; text: string }[];
}

const NoscriptSEO = ({ title, description, sections = [] }: NoscriptSEOProps) => {
  return (
    <div className="sr-only" aria-hidden="true">
      <h1>{title}</h1>
      <p>{description}</p>
      {sections.map((section, i) => (
        <div key={i}>
          <h2>{section.heading}</h2>
          <p>{section.text}</p>
        </div>
      ))}
    </div>
  );
};

export default NoscriptSEO;
