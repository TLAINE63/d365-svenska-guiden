import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

/**
 * In-DOM E2E test for legacy URL redirects.
 *
 * Unlike the unit test (`legacy-redirects.test.tsx`) which only verifies the
 * <Navigate> component fires, this test:
 *   1. Opens each old hyphenated URL in a real router
 *   2. Waits for client-side navigation to complete
 *   3. Asserts the browser landed on the new canonical URL
 *   4. Asserts the destination page actually rendered (not 404)
 *
 * This is the closest we can get to a Playwright-style E2E without shipping
 * browser binaries (~300MB). Same router behaviour as production.
 */

// Mock SEOHead (depends on Helmet + Supabase env) and trim heavy imports.
vi.mock("@/components/SEOHead", () => ({ default: () => null }));
vi.mock("@/components/StructuredData", () => ({
  FAQSchema: () => null,
  ServiceSchema: () => null,
  BreadcrumbSchema: () => null,
  WebSiteSchema: () => null,
  OrganizationSchema: () => null,
  ArticleSchema: () => null,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ data: [], error: null }) }) }),
    functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
    channel: () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) }),
    removeChannel: () => {},
  },
}));

const REDIRECTS: Array<[oldPath: string, newPath: string, headingPattern: RegExp]> = [
  ["/business-central", "/businesscentral", /business central/i],
  ["/ai-oversikt", "/aioversikt", /ai|copilot|agent/i],
  ["/d365-sales", "/d365sales", /dynamics 365 sales/i],
  ["/d365-marketing", "/d365marketing", /marketing|customer insights/i],
  ["/d365-customer-service", "/d365customerservice", /customer service/i],
  ["/d365-field-service", "/d365fieldservice", /field service/i],
  ["/d365-contact-center", "/d365contactcenter", /contact center/i],
];

// Mirror the real App routes for the URLs under test. Using lazy imports
// keeps the test honest — it loads the same components users do.
const BusinessCentral = lazy(() => import("@/pages/BusinessCentral"));
const AIOverview = lazy(() => import("@/pages/AIOverview"));
const D365Sales = lazy(() => import("@/pages/D365Sales"));
const D365Marketing = lazy(() => import("@/pages/D365Marketing"));
const D365CustomerService = lazy(() => import("@/pages/D365CustomerService"));
const D365FieldService = lazy(() => import("@/pages/D365FieldService"));
const D365ContactCenter = lazy(() => import("@/pages/D365ContactCenter"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const LocationProbe = () => {
  const loc = useLocation();
  return <div data-testid="pathname">{loc.pathname}</div>;
};

const TestApp = () => (
  <>
    <LocationProbe />
    <Suspense fallback={<div>laddar</div>}>
      <Routes>
        <Route path="/businesscentral" element={<BusinessCentral />} />
        <Route path="/business-central" element={<Navigate to="/businesscentral" replace />} />
        <Route path="/aioversikt" element={<AIOverview />} />
        <Route path="/ai-oversikt" element={<Navigate to="/aioversikt" replace />} />
        <Route path="/d365sales" element={<D365Sales />} />
        <Route path="/d365-sales" element={<Navigate to="/d365sales" replace />} />
        <Route path="/d365marketing" element={<D365Marketing />} />
        <Route path="/d365-marketing" element={<Navigate to="/d365marketing" replace />} />
        <Route path="/d365customerservice" element={<D365CustomerService />} />
        <Route path="/d365-customer-service" element={<Navigate to="/d365customerservice" replace />} />
        <Route path="/d365fieldservice" element={<D365FieldService />} />
        <Route path="/d365-field-service" element={<Navigate to="/d365fieldservice" replace />} />
        <Route path="/d365contactcenter" element={<D365ContactCenter />} />
        <Route path="/d365-contact-center" element={<Navigate to="/d365contactcenter" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

describe("E2E: legacy URL redirects land on the right destination", () => {
  it.each(REDIRECTS)(
    "%s → %s and renders destination page",
    async (from, to, headingPattern) => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

      render(
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <MemoryRouter initialEntries={[from]}>
              <TestApp />
            </MemoryRouter>
          </HelmetProvider>
        </QueryClientProvider>
      );

      // 1. URL transitioned to the new canonical path.
      await waitFor(() => {
        expect(screen.getByTestId("pathname").textContent).toBe(to);
      });

      // 2. Destination page actually rendered (not 404).
      await waitFor(
        () => {
          const headings = screen.queryAllByRole("heading");
          const match = headings.some((h) => headingPattern.test(h.textContent ?? ""));
          expect(match).toBe(true);
        },
        { timeout: 5000 }
      );

      // 3. NotFound did not render.
      expect(screen.queryByText(/404/i)).toBeNull();

      cleanup();
    },
    15000
  );
});
