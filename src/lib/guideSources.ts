import { Children, isValidElement, type ReactNode } from "react";
export interface GuideSource {
  name: string;
  supports: string;
  href?: string;
  updatedAt?: string;
}
export const priceSources: GuideSource[] = [{ name: "Microsoft licensinformation", href: "https://www.microsoft.com/sv-se/dynamics-365/pricing", supports: "Officiella listpriser. Avtal, volym, valuta och moms behöver kontrolleras separat.", updatedAt: "2026-06-11" }];
export const partnerSources: GuideSource[] = [{ name: "D365.SE:s partnerdatabas", href: "/alla-d365-partners/", supports: "Registrerade produktområden, branscher och leveransuppgifter. Grundprofiler bygger på observerade uppgifter; partnerverifierade profiler innehåller uppgifter bekräftade av partnern. Detta är inte en kvalitetscertifiering." }];
export function safeSourceHref(href?: string): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try { const url = new URL(href); return url.protocol === "https:" && !url.username && !url.password ? href : undefined; } catch { return undefined; }
}
/** Existing Microsoft citations only; never treats arbitrary partner links as sources. */
export function getArticleMicrosoftSources(content: ReactNode): GuideSource[] {
  const result = new Map<string, GuideSource>();
  function visit(nodes: ReactNode) {
    Children.forEach(nodes, node => {
      if (!isValidElement<{ href?: string; children?: ReactNode }>(node)) return;
      const href = safeSourceHref(node.props.href);
      if (node.type === "a" && href?.startsWith("https:")) {
        const host = new URL(href).hostname;
        if (host === "microsoft.com" || host.endsWith(".microsoft.com")) result.set(href, {
          name: /pricing|licens/i.test(href) ? "Microsoft licensinformation" : host === "learn.microsoft.com" ? "Microsoft produktdokumentation" : "Microsofts publicerade information",
          href, supports: "Extern hänvisning i artikeln. Källan stöder inte automatiskt D365.SE:s slutsatser eller alla faktapåståenden.",
        });
      }
      visit(node.props.children);
    });
  }
  visit(content);
  return [...result.values()];
}
