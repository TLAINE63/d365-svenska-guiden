import { Fragment, type ReactNode } from "react";

/**
 * Varumärkesnamnen "Dynamics 365" och "Microsoft Dynamics 365" får aldrig
 * radbrytas. Hjälparen delar upp en textsträng och lindar träffarna i
 * whitespace-nowrap utan att ändra innehållet.
 */
const BRAND_RE = /(Microsoft Dynamics 365|Dynamics 365)/g;

export function nowrapBrand(text: string): ReactNode {
  const parts = text.split(BRAND_RE);
  return parts.map((part, i) =>
    BRAND_RE.test(part) || part === "Dynamics 365" || part === "Microsoft Dynamics 365" ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
