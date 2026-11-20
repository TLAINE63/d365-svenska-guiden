import { Fragment, type ReactNode } from "react";

/**
 * Varumärkesnamnen "Dynamics 365" och "Microsoft Dynamics 365" får aldrig
 * radbrytas. Hjälparen delar upp en textsträng och lindar träffarna i
 * whitespace-nowrap utan att ändra innehållet.
 */
const BRAND_RE = /(Microsoft Dynamics 365|Dynamics 365 Finance & Supply Chain Management|Dynamics 365 Finance & Supply Chain|Dynamics 365 F&SCM|Dynamics 365 Customer Insights|Dynamics 365 Customer Service|Dynamics 365 Field Service|Dynamics 365 Contact Center|Dynamics 365 Sales|Dynamics 365|Business Central)/g;
const BRANDS = new Set(["Microsoft Dynamics 365","Dynamics 365 Finance & Supply Chain Management","Dynamics 365 Finance & Supply Chain","Dynamics 365 F&SCM","Dynamics 365 Customer Insights","Dynamics 365 Customer Service","Dynamics 365 Field Service","Dynamics 365 Contact Center","Dynamics 365 Sales","Dynamics 365","Business Central"]);

export function nowrapBrand(text: string): ReactNode {
  const parts = text.split(BRAND_RE);
  return <span>{parts.map((part, i) =>
    BRANDS.has(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )}</span>;
}
