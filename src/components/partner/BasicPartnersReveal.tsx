import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  count: number;
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * Lista med grundprofiler (Basicpartners), öppen från start (Thomas 2026-10-31) och möjlig att fälla ihop.
 * Native <details> så innehållet finns kvar i förrenderad HTML.
 */
export default function BasicPartnersReveal({ count, children, className = "", label }: Props) {
  const text = label ?? `Visa ${count} ${count === 1 ? "partner" : "partners"} med grundprofil`;
  const hideText = `Dölj ${count} ${count === 1 ? "partner" : "partners"} med grundprofil`;
  return (
    <details open className={`group/basic ${className}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary [&::-webkit-details-marker]:hidden">
        <span className="group-open/basic:hidden">{text}</span>
        <span className="hidden group-open/basic:inline">{hideText}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-open/basic:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}
