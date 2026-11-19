import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/**
 * E2E-style verification for legacy URL redirects.
 *
 * Three layers of proof, run against every old→new pair:
 *
 *   1. The redirect Route exists in BOTH src/App.tsx (client) and
 *      src/entry-server.tsx (SSG prerender). Without this, a deep link to
 *      the old URL would 404 on first paint.
 *
 *   2. The destination Route also exists in both files, i.e. the new URL
 *      is a real page, not just another redirect or a dead link.
 *
 *   3. When mounted in a real React Router, navigating to the old URL ends
 *      up at the new URL (client-side navigation actually fires).
 *
 * The unit test (`legacy-redirects.test.tsx`) covers #3 in isolation. This
 * file adds #1 and #2 so a route accidentally removed from App.tsx fails
 * loudly here instead of silently 404ing in production.
 */

const REDIRECTS: Array<[oldPath: string, newPath: string]> = [
  ["/business-central", "/businesscentral"],
  ["/ai-oversikt", "/aioversikt"],
  ["/d365-sales", "/d365sales"],
  ["/d365-marketing", "/d365marketing"],
  ["/d365-customer-service", "/d365customerservice"],
  ["/d365-field-service", "/d365fieldservice"],
  ["/d365-contact-center", "/d365contactcenter"],
  ["/valj-partner", "/valjdynamics365partner"],
  ["/sok", "/fraga"],
  ["/AIsok", "/fraga"],
  ["/AI-sok", "/fraga"],
  ["/behovsanalys", "/ERPbehovsanalys"],
  ["/salj-marknad-behovsanalys", "/CRMbehovsanalys"],
];

/**
 * Expected page-source signals for each destination route.
 *
 *  - expected: must appear inside the first <h1>…</h1> block on the page.
 *  - h2:       must appear inside any <h2>…</h2> block (null = page
 *              intentionally has no h2, e.g. a search landing).
 *  - meta:     substring that must appear in the page's meta description
 *              (rendered via <SEOHead description="…"> or a <Helmet>
 *              <meta name="description" content="…" />).
 *
 * Asserted directly against the page component source so a heading or meta
 * rename fails this test rather than silently shipping an SEO regression.
 */
const DESTINATION_H1: Record<
  string,
  { file: string; expected: string; h2: string | null; meta: string }
> = {
  "/businesscentral":      { file: "src/pages/BusinessCentral.tsx",     expected: "Business Central",                   h2: "Vad kostar Business Central?",                       meta: "ERP" },
  "/aioversikt":           { file: "src/pages/AIOverview.tsx",          expected: "AI i Dynamics 365 kräver mer än Copilot-licenser", h2: "Copilot vs Agenter",                    meta: "Copilot och agenter" },
  "/d365sales":            { file: "src/pages/D365Sales.tsx",           expected: "Dynamics 365 Sales",                 h2: "Se Dynamics 365 Sales i aktion",                     meta: "CRM" },
  "/d365marketing":        { file: "src/pages/D365Marketing.tsx",       expected: "Customer Insights",                  h2: "Se Dynamics 365 Customer Insights i aktion",         meta: "Customer Insights" },
  "/d365customerservice":  { file: "src/pages/D365CustomerService.tsx", expected: "Dynamics 365 Customer Service",      h2: "Se Dynamics 365 Customer Service i aktion",          meta: "Dynamics 365 Customer Service" },
  "/d365fieldservice":     { file: "src/pages/D365FieldService.tsx",    expected: "Dynamics 365 Field Service",         h2: "Se Dynamics 365 Field Service i aktion",             meta: "fältservice" },
  "/d365contactcenter":    { file: "src/pages/D365ContactCenter.tsx",   expected: "Dynamics 365 Contact Center",        h2: "Se Dynamics 365 Contact Center i aktion",            meta: "Dynamics 365 Contact Center" },
  "/valjdynamics365partner": { file: "src/pages/ValjPartner.tsx",       expected: "Välj rätt Microsoft Dynamics",       h2: "Vad ska du kräva av en certifierad Dynamics partner", meta: "partner" },
  "/fraga":                { file: "src/pages/SmartSearch.tsx",         expected: "",                                   h2: null,                                                 meta: "" },
  "/ERPbehovsanalys":      { file: "src/pages/NeedsAnalysis.tsx",       expected: "Ringa in behovet",                   h2: null,                                                 meta: "ERP-behovsanalys" },
  "/CRMbehovsanalys":      { file: "src/pages/SalesMarketingNeedsAnalysis.tsx", expected: "Behovsanalys Sälj & Marknad", h2: null,                                          meta: "Dynamics 365 Sales och Customer Insights" },
};

/** Non-breaking spaces (literal, \\u00A0 or &nbsp;) keep brand names together; compare as spaces. */
const nb = (t: string) => t.replace(/\u00A0|\\u00A0|&nbsp;/g, " ");

/** First H1 text: a literal <h1> or the title(+titleAccent) given to <ProductHero>. */
function firstHeading(source: string): string | null {
  const h1 = source.match(/<h1[\s\S]*?<\/h1>/);
  if (h1) return h1[0];
  const hero = source.match(/<ProductHero[\s\S]*?\/>/);
  if (!hero) return null;
  const title = hero[0].match(/title=(?:\{\s*)?["']([^"']+)["']/)?.[1] ?? "";
  const accent = hero[0].match(/titleAccent=(?:\{\s*)?["']([^"']+)["']/)?.[1] ?? "";
  return `${title} ${accent}`.replace(/\\u00A0/g, " ").trim() || null;
}

const ROUTER_FILES = [
  "src/App.tsx",
  "src/entry-server.tsx",
] as const;

function loadRouter(file: string): string {
  return readFileSync(resolve(process.cwd(), file), "utf-8");
}

function hasRedirectRoute(source: string, from: string, to: string): boolean {
  // Matches <Navigate to="/new" replace /> (SSG) or <RedirectTo to="/new" /> (client,
  // keeps query and hash).
  const pattern = new RegExp(
    `<Route\\s+path=["']${escape(from)}["']\\s+element=\\{\\s*<(?:Navigate\\s+to=["']${escape(to)}["']\\s+replace|RedirectTo\\s+to=["']${escape(to)}["'])\\s*/>\\s*\\}\\s*/>`,
    "s"
  );
  return pattern.test(source);
}

function hasDestinationRoute(source: string, path: string): boolean {
  // Matches:  <Route path="/new" element={<SomeComponent ... />} />
  // (anything that's NOT a redirect). An optional "/resultat?" segment is
  // the same page with its result view.
  const pattern = new RegExp(
    `<Route\\s+path=["']${escape(path)}(?:/resultat\\?)?["']\\s+element=\\{\\s*<(?!Navigate|RedirectTo)\\w+`,
    "s"
  );
  return pattern.test(source);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("Legacy URL redirects. E2E", () => {
  describe.each(ROUTER_FILES)("%s declares all redirect routes", (file) => {
    const source = loadRouter(file);

    it.each(REDIRECTS)("redirect %s → %s is registered", (from, to) => {
      expect(hasRedirectRoute(source, from, to)).toBe(true);
    });

    it.each(REDIRECTS.map(([, to]) => [to] as const))(
      "destination %s is a real page route",
      (to) => {
        expect(hasDestinationRoute(source, to)).toBe(true);
      }
    );
  });

  describe("router navigation lands on the new URL", () => {
    const LocationProbe = () => {
      const loc = useLocation();
      return <div data-testid="pathname">{loc.pathname}</div>;
    };

    const TestRoutes = () => (
      <Routes>
        {REDIRECTS.map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    );

    it.each(REDIRECTS)("opening %s navigates to %s", async (from, to) => {
      render(
        <MemoryRouter initialEntries={[from]}>
          <TestRoutes />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByTestId("pathname").textContent).toBe(to);
      });
    });
  });

  describe("destination page renders expected H1 heading", () => {
    const entries = Object.entries(DESTINATION_H1);

    it.each(entries)(
      "%s renders an <h1> containing the expected heading",
      (_path, { file, expected }) => {
        const source = loadRouter(file);
        const heading = firstHeading(source);
        expect(heading, `No <h1> or <ProductHero title> found in ${file}`).not.toBeNull();
        expect(nb(heading!)).toContain(expected);
      }
    );

    it.each(REDIRECTS)(
      "redirect %s ultimately resolves to a page whose H1 is verified (%s)",
      (_from, to) => {
        expect(DESTINATION_H1[to]).toBeDefined();
      }
    );
  });

  describe("destination page renders expected H2 subheading", () => {
    const entries = Object.entries(DESTINATION_H1).filter(
      ([, v]) => v.h2 !== null
    ) as Array<[string, { file: string; h2: string }]>;

    it.each(entries)(
      "%s contains an <h2> with the expected subheading",
      (_path, { file, h2 }) => {
        const source = loadRouter(file);
        // Match every <h2 …>…</h2> block on the page and assert at least one
        // contains the expected substring.
        const blocks = source.match(/<h2[\s\S]*?<\/h2>/g) ?? [];
        expect(blocks.length, `No <h2> found in ${file}`).toBeGreaterThan(0);
        const hit = blocks.some((b) => nb(b).includes(h2));
        expect(
          hit,
          `Expected an <h2> in ${file} to contain "${h2}". Found:\n${blocks
            .map((b) => `  • ${b.replace(/\s+/g, " ").slice(0, 120)}`)
            .join("\n")}`
        ).toBe(true);
      }
    );
  });

  describe("destination page declares expected meta description", () => {
    const entries = Object.entries(DESTINATION_H1);

    it.each(entries)(
      "%s declares a meta description containing the expected snippet",
      (_path, { file, meta }) => {
        const source = loadRouter(file);
        // Accept either:
        //   <SEOHead … description="…" … />
        //   <meta name="description" content="…" />
        const seoHeadDesc = source.match(
          /<SEOHead[\s\S]*?description=["']([^"']+)["'][\s\S]*?\/>/
        );
        const helmetMeta = source.match(
          /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/
        );
        const desc = seoHeadDesc?.[1] ?? helmetMeta?.[1];
        expect(
          desc,
          `No meta description found in ${file} (looked for <SEOHead description="…"> and <meta name="description" content="…" />)`
        ).toBeDefined();
        expect(desc!).toContain(meta);
      }
    );
  });
});
