/**
 * NoscriptSEO renders key page content inside a <noscript> block.
 * This ensures crawlers that don't execute JavaScript can still index
 * the page's primary text content, improving SEO scores.
 */

interface NoscriptSEOProps {
  title: string;
  description: string;
  sections?: { heading: string; text: string }[];
}

const NoscriptSEO = ({ title, description, sections = [] }: NoscriptSEOProps) => {
  return (
    <noscript>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        {sections.map((section, i) => (
          <div key={i}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </div>
        ))}
      </div>
    </noscript>
  );
};

export default NoscriptSEO;
