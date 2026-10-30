import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { LEGACY_REDIRECTS, buildRedirectHtml } from "@/lib/legacy-redirects";

describe("/basic/dynamicskonsult (nu DevCore) leds till partnerväljaren", () => {
  const entry = LEGACY_REDIRECTS.find((r) => r.from === "/basic/dynamicskonsult");

  it("är registrerad som 301 till /valjdynamics365partner/", () => {
    expect(entry).toBeDefined();
    expect(entry!.to).toBe("/valjdynamics365partner/");
    expect(entry!.intendedStatus).toBe(301);
  });

  it("statiska sidan pekar canonical och refresh till partnerväljaren", () => {
    const html = buildRedirectHtml(entry!);
    expect(html).toContain('content="0; url=/valjdynamics365partner/"');
    expect(html).toContain('<link rel="canonical" href="https://d365.se/valjdynamics365partner/"');
  });

  it("klientroutern skickar också till partnerväljaren", () => {
    const app = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf-8");
    expect(app).toContain('path="/basic/dynamicskonsult" element={<RedirectTo to="/valjdynamics365partner/" />}');
    expect(app).not.toContain('path="/basic/dynamicskonsult" element={<RedirectTo to="/dynamicskonsult/" />}');
  });
});

describe("/dynamicskonsult leds till partnerväljaren (beslut 2026-10-30)", () => {
  const entry = LEGACY_REDIRECTS.find((r) => r.from === "/dynamicskonsult");

  it("är registrerad som 301 till /valjdynamics365partner/", () => {
    expect(entry).toBeDefined();
    expect(entry!.to).toBe("/valjdynamics365partner/");
    expect(entry!.intendedStatus).toBe(301);
  });

  it("klientroutern skickar båda slash-varianterna till partnerväljaren", () => {
    const app = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf-8");
    expect(app).toContain('path="/dynamicskonsult" element={<RedirectTo to="/valjdynamics365partner/" />}');
    expect(app).toContain('path="/dynamicskonsult/" element={<RedirectTo to="/valjdynamics365partner/" />}');
  });

  it("finns inte längre i sajtkartan", () => {
    const sitemap = readFileSync(resolve(process.cwd(), "public/sitemap-pages.xml"), "utf-8");
    expect(sitemap).not.toContain("https://d365.se/dynamicskonsult/");
    const generator = readFileSync(resolve(process.cwd(), "scripts/generate-sitemap.mjs"), "utf-8");
    expect(generator).not.toContain('"/dynamicskonsult/"');
  });
});
