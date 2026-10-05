import { Fragment } from "react";
import { siteParagraphs } from "@/data/siteTexts";

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Renderar en textbanksnyckel som stycken. */
export default function SiteTextParagraphs({ textKey, className, gapClass = "mt-3" }: { textKey: string; className?: string; gapClass?: string }) {
  return (
    <>
      {siteParagraphs(textKey).map((p, i) => (
        <p key={i} className={`${className ?? ""} ${i > 0 ? gapClass : ""}`.trim()}>
          {renderBold(p)}
        </p>
      ))}
    </>
  );
}
