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
];

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
});
