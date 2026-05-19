import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  LEGACY_REDIRECTS,
  buildRedirectHtml,
} from "@/lib/legacy-redirects";

/**
 * Heltäckande verifiering av kända legacy-URL:er:
 *
 *   1. Statisk HTML som plugin genererar innehåller rätt status (301/308),
 *      meta-refresh till mål-URL och canonical till canonical-värd.
 *   2. SPA-router (klientsidans motsvarighet) navigerar från legacy- till
 *      ny path med <Navigate replace />.
 */

const SITE_ORIGIN = "https://d365.se";

const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

const LocationProbe = () => {
  const loc = useLocation();
  return <div data-testid="pathname">{loc.pathname}</div>;
};

const TestRoutes = () => (
  <Routes>
    {LEGACY_REDIRECTS.map((r) => (
      <Route
        key={r.from}
        path={r.from}
        element={<Navigate to={r.to} replace />}
      />
    ))}
    <Route path="*" element={<LocationProbe />} />
  </Routes>
);

describe("Legacy URL-redirects – fullständig täckning", () => {
  it("registret innehåller minst 25 legacy-paths", () => {
    expect(LEGACY_REDIRECTS.length).toBeGreaterThanOrEqual(25);
  });

  it("alla 'from' är unika", () => {
    const seen = new Set<string>();
    for (const r of LEGACY_REDIRECTS) {
      expect(seen.has(r.from), `dubblett: ${r.from}`).toBe(false);
      seen.add(r.from);
    }
  });

  it("alla 'from' börjar med / och innehåller inte wildcards", () => {
    for (const r of LEGACY_REDIRECTS) {
      expect(r.from.startsWith("/")).toBe(true);
      expect(r.from).not.toContain("*");
      expect(r.from).not.toContain(":");
    }
  });

  it("alla intendedStatus är 301 eller 308", () => {
    for (const r of LEGACY_REDIRECTS) {
      expect([301, 308]).toContain(r.intendedStatus);
    }
  });

  describe.each(LEGACY_REDIRECTS)("$from → $to", (redirect) => {
    const html = buildRedirectHtml(redirect);
    const target = withSlash(redirect.to);
    const canonical = `${SITE_ORIGIN}${target}`;

    it(`deklarerar x-redirect-status = ${redirect.intendedStatus}`, () => {
      expect(html).toContain(
        `<meta name="x-redirect-status" content="${redirect.intendedStatus}"`
      );
    });

    it("har meta-refresh till mål-URL", () => {
      expect(html).toContain(`content="0; url=${target}"`);
    });

    it("har canonical till canonical-värden (https://d365.se)", () => {
      expect(html).toContain(`<link rel="canonical" href="${canonical}"`);
    });

    it("är markerad noindex,follow", () => {
      expect(html).toContain('content="noindex,follow"');
    });

    it("har JS-fallback location.replace", () => {
      expect(html).toContain(`window.location.replace(${JSON.stringify(target)})`);
    });

    it("SPA-router navigerar till canonical path", () => {
      render(
        <MemoryRouter initialEntries={[redirect.from]}>
          <TestRoutes />
        </MemoryRouter>
      );
      expect(screen.getByTestId("pathname").textContent).toBe(redirect.to);
    });
  });
});
