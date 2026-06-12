import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";

import AllD365Partners from "@/pages/AllD365Partners";
import PartnersPerBransch from "@/pages/PartnersPerBransch";
import partnerDataJson from "@/data/partnerData.json";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";

/**
 * SEO regression: the partner list routes must server-render real partner
 * names, /partner/<slug> links, and bransch group headers — without relying
 * on client-side JS. Without this, crawlers and AI-sökmotorer see an empty
 * shell.
 */

function ssr(url: string, element: React.ReactNode): string {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } },
  });
  return renderToString(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <TooltipProvider>
          <StaticRouter location={url}>
            <Routes>
              <Route path={url} element={element} />
            </Routes>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

const featured = (partnerDataJson as any[]).filter((p) => p.is_featured !== false);

describe("Partner list SSR – SEO regression", () => {
  describe("/alla-d365-partners", () => {
    const html = ssr("/alla-d365-partners", <AllD365Partners />);

    it("renders the H1", () => {
      expect(html).toContain("Alla Dynamics 365-partners i Sverige");
    });

    it("renders every featured partner name", () => {
      expect(featured.length).toBeGreaterThan(5);
      for (const p of featured) {
        expect(html).toContain(p.name);
      }
    });

    it("renders /partner/<slug> profile links for every featured partner", () => {
      for (const p of featured) {
        expect(html).toContain(`/partner/${p.slug}`);
      }
    });

    it("does not show the loading fallback", () => {
      expect(html).not.toMatch(/Laddar…|Laddar partners/);
    });
  });

  describe("/partners-per-bransch", () => {
    const html = ssr("/partners-per-bransch", <PartnersPerBransch />);

    it("renders the H1", () => {
      expect(html).toContain("Dynamics 365-partners per bransch");
    });

    it("renders a bransch header for every standard industry", () => {
      for (const ind of STANDARD_INDUSTRIES) {
        // React inserts <!-- --> markers between text + interpolated values,
        // and escapes & as &amp;, so match the two halves independently.
        const escaped = ind.name.replace(/&/g, "&amp;");
        expect(html).toContain("Dynamics 365-partners för ");
        expect(html).toContain(escaped);
        // anchor id used for deep-linking
        expect(html).toContain(`id="${ind.slug}"`);
        // bransch header links to the dedicated guide
        expect(html).toContain(`/branscher/${ind.slug}/`);
      }
    });

    it("renders partner names and links under their bransch groups", () => {
      // Pick industries that actually have partners assigned and verify at
      // least one partner name + /partner/<slug>/ link appears in the HTML.
      let industriesChecked = 0;
      for (const ind of STANDARD_INDUSTRIES) {
        const partnersInIndustry = featured.filter((p) =>
          collectPartnerIndustries(p as any).has(ind.name),
        );
        if (partnersInIndustry.length === 0) continue;
        industriesChecked++;
        for (const p of partnersInIndustry) {
          expect(html).toContain(p.name);
          expect(html).toContain(`/partner/${p.slug}/`);
        }
      }
      expect(industriesChecked).toBeGreaterThan(0);
    });

    it("does not show the loading fallback", () => {
      expect(html).not.toContain("Laddar partners…");
    });
  });
});
