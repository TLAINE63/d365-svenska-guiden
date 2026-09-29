import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import { Button } from "@/components/ui/button";
import { getRoleGuidance, ROLE_GUIDANCE, type RoleGuidanceKey } from "@/data/roleGuidance";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackRoleGuidanceEvent } from "@/utils/trackRoleGuidanceEvent";

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Välj din roll", url: "/roller/" },
];

const RoleGuidance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRole = getRoleGuidance(searchParams.get("roll"));
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackRoleGuidanceEvent("role_selector_viewed");
  }, []);

  useEffect(() => {
    if (!selectedRole) return;
    trackRoleGuidanceEvent("role_recommendation_viewed", { role: selectedRole.key });
  }, [selectedRole]);

  const chooseRole = (key: RoleGuidanceKey) => {
    setSearchParams({ roll: key });
    trackRoleGuidanceEvent("role_selected", { role: key });
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <SEOHead
        title="Välj din roll – vägledning för Dynamics 365"
        description="Välj din roll och hitta relevanta systemområden, guider och partner på d365.se utifrån ditt ansvar."
        canonicalPath="/roller/"
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <header className="max-w-3xl mb-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--signature))] mb-3">Vägledning efter ansvar</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">Vilken roll har du i er digitaliseringsresa?</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {nowrapBrand("Välj den roll som bäst beskriver ditt ansvar och få vägledning till relevanta systemområden, guider och partner.")}
            </p>
          </header>

          <section aria-labelledby="role-selector-heading" className="mb-12">
            <h2 id="role-selector-heading" className="sr-only">Välj roll</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ROLE_GUIDANCE.map((role) => {
                const Icon = role.icon;
                const selected = selectedRole?.key === role.key;
                return (
                  <article key={role.key} className={`flex min-h-64 flex-col border bg-card p-5 transition-colors ${selected ? "border-primary" : "border-border hover:border-primary/60"}`}>
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded bg-accent-light text-accent"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                    <h2 className="text-lg font-bold mb-2">{role.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{role.description}</p>
                    <Button type="button" variant={selected ? "default" : "outline"} className="mt-5 w-full justify-between" onClick={() => chooseRole(role.key)} aria-pressed={selected}>
                      {role.buttonLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>

          {selectedRole && (
            <section ref={resultRef} className="scroll-mt-28 border-t border-border pt-10" aria-live="polite">
              <div className="mb-7 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--signature))] mb-2">Vägledning för {selectedRole.title}</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Börja i de frågor som ligger närmast ditt ansvar</h2>
                <p className="text-muted-foreground leading-relaxed">Detta är en väg in i befintligt innehåll, inte en rekommendation av ett visst system.</p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <h3 className="text-lg font-bold mb-4">Vanliga prioriteringar</h3>
                  <ul className="space-y-3">
                    {selectedRole.priorities.map((priority) => (
                      <li key={priority} className="flex items-center gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent-light text-accent"><Check className="h-4 w-4" aria-hidden="true" /></span>{priority}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Relevanta områden</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedRole.areas.map((area) => (
                      <Link key={area.label} to={area.path} onClick={() => trackRoleGuidanceEvent("role_area_clicked", { role: selectedRole.key, target: area.label })} className="group flex min-h-16 items-center justify-between gap-3 border border-border bg-card px-4 py-3 font-semibold hover:border-primary">
                        <span>{nowrapBrand(area.label)}</span><ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">Guider och nästa steg</h3>
                  <div className="space-y-2">
                    {selectedRole.guides.map((guide) => (
                      <Link key={guide.label} to={guide.path} onClick={() => trackRoleGuidanceEvent("role_guide_clicked", { role: selectedRole.key, target: guide.label })} className="group flex items-center justify-between gap-3 border-b border-border py-3 font-medium hover:text-primary">
                        <span>{nowrapBrand(guide.label)}</span><ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Utforska partner</h3>
                  <div className="space-y-2">
                    {selectedRole.partnerLinks.map((partnerLink) => (
                      <Link key={partnerLink.label} to={partnerLink.path} onClick={() => trackRoleGuidanceEvent("role_partner_clicked", { role: selectedRole.key, target: partnerLink.label })} className="group flex items-center justify-between gap-3 border-b border-border py-3 font-medium hover:text-primary">
                        <span>{nowrapBrand(partnerLink.label)}</span><ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RoleGuidance;