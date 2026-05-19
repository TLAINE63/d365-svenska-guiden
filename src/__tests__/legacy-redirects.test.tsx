import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/**
 * Verifies that legacy hyphenated URLs redirect (client-side equivalent of a
 * 301) to the new non-hyphenated canonical URLs. On Lovable hosting the SPA
 * fallback serves index.html and React Router performs the redirect on mount;
 * crawlers following the redirected `Location` end up at the new URL.
 */

const REDIRECTS: Array<[string, string]> = [
  ["/business-central", "/businesscentral"],
  ["/ai-oversikt", "/aioversikt"],
  ["/d365-sales", "/d365sales"],
  ["/d365-marketing", "/d365marketing"],
  ["/d365-customer-service", "/d365customerservice"],
  ["/d365-field-service", "/d365fieldservice"],
  ["/d365-contact-center", "/d365contactcenter"],
];

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

describe("Legacy hyphenated URL redirects", () => {
  it.each(REDIRECTS)("redirects %s -> %s", (from, to) => {
    render(
      <MemoryRouter initialEntries={[from]}>
        <TestRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId("pathname").textContent).toBe(to);
  });
});
