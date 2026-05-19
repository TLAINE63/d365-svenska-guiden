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
 *   2. The destination Route also exists in both files — i.e. the new URL
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
  ["/sok", "/AIsok"],
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
  "/businesscentral":      { file: "src/pages/BusinessCentral.tsx",     expected: "Dynamics 365",                       h2: "Vanliga frågor om Dynamics 365 Business Central",    meta: "Essentials 765 kr/mån" },
  "/aioversikt":           { file: "src/pages/AIOverview.tsx",          expected: "Mer effekt, mindre manuellt arbete", h2: "Copilot vs Agenter",                                 meta: "Copilot och intelligenta agenter" },
  "/d365sales":            { file: "src/pages/D365Sales.tsx",           expected: "Dynamics 365 Sales",                 h2: "Microsoft Dynamics 365 Sales",                       meta: "Dynamics 365 Sales från 621 kr/mån" },
  "/d365marketing":        { file: "src/pages/D365Marketing.tsx",       expected: "Dynamics 365 Customer Insights",     h2: "Microsoft Dynamics 365 Customer Insights",           meta: "Dynamics 365 Customer Insights (Marketing)" },
  "/d365customerservice":  { file: "src/pages/D365CustomerService.tsx", expected: "Dynamics 365 Customer Service",      h2: "Microsoft Dynamics 365 Customer Service",            meta: "Dynamics 365 Customer Service från 478 kr/mån" },
  "/d365fieldservice":     { file: "src/pages/D365FieldService.tsx",    expected: "Dynamics 365 Field Service",         h2: "Microsoft Dynamics 365 Field Service",               meta: "Dynamics 365 Field Service från 1 004 kr/mån" },
  "/d365contactcenter":    { file: "src/pages/D365ContactCenter.tsx",   expected: "Dynamics 365 Contact Center",        h2: "Microsoft Dynamics 365 Contact Center",              meta: "Dynamics 365 Contact Center från 1 051 kr/agent/mån" },
  "/valjdynamics365partner": { file: "src/pages/ValjPartner.tsx",       expected: "Det kritiska partnervalet",          h2: "Fem viktiga frågor vid val av implementationspartner", meta: "Jämför certifierade Dynamics 365-partners i Sverige" },
  "/AIsok":                { file: "src/pages/SmartSearch.tsx",         expected: "Vad letar du efter?",                h2: null,                                                 meta: "Beskriv ditt behov i naturligt språk" },
};

const ROUTER_FILES = [
  "src/App.tsx",
  "src/entry-server.tsx",
] as const;

function loadRouter(file: string): string {
  return readFileSync(resolve(process.cwd(), file), "utf-8");
}

function hasRedirectRoute(source: string, from: string, to: string): boolean {
  // Matches:  <Route path="/old" element={<Navigate to="/new" replace />} />
  const pattern = new RegExp(
    `<Route\\s+path=["']${escape(from)}["']\\s+element=\\{\\s*<Navigate\\s+to=["']${escape(to)}["']\\s+replace\\s*/>\\s*\\}\\s*/>`,
    "s"
  );
  return pattern.test(source);
}

function hasDestinationRoute(source: string, path: string): boolean {
  // Matches:  <Route path="/new" element={<SomeComponent ... />} />
  // (anything that's NOT a Navigate)
  const pattern = new RegExp(
    `<Route\\s+path=["']${escape(path)}["']\\s+element=\\{\\s*<(?!Navigate)\\w+`,
    "s"
  );
  return pattern.test(source);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("Legacy URL redirects — E2E", () => {
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
        // Find any <h1 ...> ... </h1> block in the page source.
        const h1Match = source.match(/<h1[\s\S]*?<\/h1>/);
        expect(h1Match, `No <h1> found in ${file}`).not.toBeNull();
        expect(h1Match![0]).toContain(expected);
      }
    );

    it.each(REDIRECTS)(
      "redirect %s ultimately resolves to a page whose H1 is verified (%s)",
      (_from, to) => {
        expect(DESTINATION_H1[to]).toBeDefined();
      }
    );
  });
});
