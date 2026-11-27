import PartnerFreshnessCard from "@/components/PartnerFreshnessCard";
import RedaktionOperations from "@/components/RedaktionOperations";
import RedaktionQuickVerify from "@/components/RedaktionQuickVerify";
import IsvFreshnessCard from "@/components/IsvFreshnessCard";
import ContentReadsCard from "@/components/ContentReadsCard";
import RedaktionSiteTextsTab from "@/components/RedaktionSiteTextsTab";
import RedaktionBudgetTab from "@/components/RedaktionBudgetTab";
import RedaktionSalesKitTab from "@/components/RedaktionSalesKitTab";
import RedaktionPartnerTeaser from "@/components/RedaktionPartnerTeaser";
import RedaktionTermsTab from "@/components/RedaktionTermsTab";
import RedaktionPartnerMonthlyReport from "@/components/RedaktionPartnerMonthlyReport";
import { lazy, Suspense, useState } from "react";
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

/** Läser rollen ur redaktionstoken (servern kontrollerar alltid signaturen). */
function tokenRole(token: string | null): string | null {
  try {
    if (!token) return null;
    const b = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b)).role ?? null;
  } catch {
    return null;
  }
}

/** Delar adminsessionen med partnerredigeringen så att Thomas slipper logga in två gånger. */
function seedAdminSession(token: string): null {
  try {
    const expiry = window.sessionStorage.getItem("editor_token_expiry");
    window.sessionStorage.setItem("admin_token", token);
    if (expiry) window.sessionStorage.setItem("admin_token_expiry", expiry);
  } catch {
    /* ignore */
  }
  return null;
}
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useEditorAuth } from "@/hooks/useEditorAuth";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import AdminEventsTab from "@/components/AdminEventsTab";
import AdminPartnerNewsTab from "@/components/AdminPartnerNewsTab";
import AdminKnowledgeArticlesTab from "@/components/AdminKnowledgeArticlesTab";
import RedaktionAktuelltTab from "@/components/RedaktionAktuelltTab";
import RedaktionPartnerLinksTab from "@/components/RedaktionPartnerLinksTab";
import RedaktionBacklinksTab from "@/components/RedaktionBacklinksTab";
import RedaktionAssignmentProfilesTab from "@/components/RedaktionAssignmentProfilesTab";
import SiteTrafficStatsCard from "@/components/SiteTrafficStatsCard";
import AdminStatsSummary from "@/components/AdminStatsSummary";
import AdminAiVisibilityTab from "@/components/AdminAiVisibilityTab";
import PostHogStatsCard from "@/components/PostHogStatsCard";
import AdminUnderlagFunnel from "@/components/AdminUnderlagFunnel";
import BuyerFunnelCard from "@/components/BuyerFunnelCard";
import BuyerPathsReportCard from "@/components/BuyerPathsReportCard";
import LeadStepsReportCard from "@/components/LeadStepsReportCard";
import JourneyFunnelsCard from "@/components/JourneyFunnelsCard";
import HelpRequestsCard from "@/components/admin/HelpRequestsCard";
import AiLibraryStatsCard from "@/components/AiLibraryStatsCard";
import AdminNewsletterCard from "@/components/AdminNewsletterCard";
import RedaktionWebinarTab from "@/components/RedaktionWebinarTab";
import RedaktionNewsletterTab from "@/components/RedaktionNewsletterTab";
import AdminAdvisoryTab from "@/components/admin/AdminAdvisoryTab";
import AdminVideosTab from "@/components/AdminVideosTab";
import AdminIsvCatalogTab from "@/components/AdminIsvCatalogTab";
import { Link, useLocation } from "react-router-dom";
import DemandExportsPanel from "@/components/DemandExportsPanel";
import { Lock, Loader2, LogOut, PenLine } from "lucide-react";
import { toast } from "sonner";

export default function Redaktion() {
  const { isLoading, isAuthenticated, token, email, accessError, login, logout, resetPassword } =
    useEditorAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);
  const { pathname } = useLocation();
  const [tab, setTab] = useState(pathname.includes("nyhetsbrev") ? "subscribers" : pathname.includes("export") ? "exports" : "help-requests");
  const [teaserSlug, setTeaserSlug] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreateAccount() {
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("editor-bootstrap", {
      body: {
        adminToken: typeof window !== "undefined" ? window.sessionStorage.getItem("admin_token") : null,
        email: form.email,
        password: form.password,
      },
    });
    setCreating(false);
    if (error || (data as { error?: string } | null)?.error) {
      toast.error((data as { error?: string } | null)?.error ?? "Kunde inte skapa kontot");
      return;
    }
    toast.success("Kontot är klart, logga in med din e-post och ditt lösenord");
    setShowSetup(false);
  }

  const isAdmin = tokenRole(token) === "admin";

  const { data: partners = [], isLoading: partnersLoading } = useAdminPartners(
    isAuthenticated ? token : null,
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);
    const res = await login(form.email, form.password, remember);
    setSubmitting(false);
    if (!res.success) setLoginError(res.error ?? "Inloggningen misslyckades");
  }

  async function handleReset() {
    if (!form.email.trim()) {
      toast.error("Fyll i din e-postadress först");
      return;
    }
    const res = await resetPassword(form.email);
    if (res.success) toast.success("Återställningslänk skickad till din e-post");
    else toast.error(res.error ?? "Kunde inte skicka länken");
  }

  const seo = (
    <>
    <Helmet><link rel="manifest" href="/redaktion.webmanifest" /><meta name="theme-color" content="#007C68" /><link rel="apple-touch-icon" href="/favicon-192.png" /></Helmet>
    <SEOHead
      title="Redaktion | d365.se"
      description="Intern redaktörsvy för event, partnernytt och artiklar."
      canonicalPath="/redaktion"
      noIndex
    />
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {seo}
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        {seo}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Redaktion
            </CardTitle>
            <CardDescription>
              Logga in med din e-postadress för att hantera event, partnernytt och artiklar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editor-email">E-post</Label>
                <Input
                  id="editor-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="din@epost.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editor-password">Lösenord</Label>
                <Input
                  id="editor-password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="editor-remember" checked={remember} onCheckedChange={(value) => setRemember(value === true)} />
                <Label htmlFor="editor-remember">Kom ihåg mig i 30 dagar</Label>
              </div>
              {(loginError || accessError) && (
                <p className="text-sm text-destructive">{loginError || accessError}</p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Logga in
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:underline w-full text-center"
              >
                Glömt lösenord?
              </button>
            </form>

            <div className="mt-6 pt-4 border-t">
              {!showSetup ? (
                <button
                  type="button"
                  onClick={() => setShowSetup(true)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Första gången? Skapa ditt konto
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Fyll i e-post och lösenord ovan. Nya redaktörskonton kan bara skapas när du
                    är inloggad som admin i samma webbläsare.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={creating}
                    onClick={handleCreateAccount}
                  >
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Skapa konto
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {seo}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PenLine className="h-6 w-6" /> Redaktion
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="break-all">{email}</span> · Event, Partnernytt, Artiklar, Videor och Aktuellt
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logga ut
          </Button>
        </div>

        <RedaktionOperations token={token} isAdmin={isAdmin} />
        <Tabs value={tab} onValueChange={setTab}>
          {(() => {
            const groups: { id: string; label: string; hint: string; tabs: [string, string, string][] }[] = [
              { id: "arenden", label: "1. Köpare & ärenden", hint: "Frågor, rådgivning och export av leads", tabs: [
                ["help-requests", "Hjälpärenden", "Inkomna frågor från köpare"],
                ["advisory", "Rådgivning", "Bokade rådgivningssamtal och introduktioner"],
                ["exports", "Export till CRM", "Ladda ned leads och signaler som CSV"]] },
              { id: "partners", label: "2. Partners & ISV", hint: "Verifiera, publicera och profilera leverantörer", tabs: [
                ...(isAdmin ? [["verify", "Snabbverifiering", "Verifiera allt en partner skickat in, med ett klick"] as [string, string, string]] : []),
                ["partners", "Partnerprofiler", "Publicering, profileringslänkar och aktualitet"],
                ...(isAdmin ? [["partner-admin", "Detaljredigering", "Öppna en partner och ändra enskilda uppgifter"] as [string, string, string]] : []),
                ["isv", "ISV-katalog", "Tilläggslösningar och leverantörer"],
                ["assignment-profiles", "Uppdragsprofiler", "Konsulter och roller"],
                ["newsletter", "Månadsbrev", "Utskick till partners"]] },
              { id: "innehall", label: "3. Innehåll", hint: "Det besökarna läser och ser", tabs: [
                ["aktuellt", "Aktuellt", "Egna förändringsanalyser"],
                ["articles", "Artiklar", "Kunskapsartiklar och Word-import"],
                ["videos", "Videor", "YouTube och INSIDE"],
                ["partner-news", "Partnernytt", "Partners egna nyheter"],
                ["events", "Event", "Partners event"],
                ["webinar", "Webinar", "Egna webinar och anmälningar"],
                ["subscribers", "Nyhetsbrev", "Prenumeranter och listor"],
                ["texts", "Textbank", "Centrala texter på sajten"]] },
              { id: "salj", label: "4. Sälj & avtal", hint: "Underlag, villkor och budget", tabs: [
                ["partner-teaser", "Partnerunderlag", "Personligt underlag per partner"],
                ["sales-kit", "Säljunderlag", "PDF:er och erbjudanden"],
                ["terms", "Avtalsvillkor", "Gällande villkor"],
                ...(isAdmin ? [["budget", "Budget 2027", "Prognos och utfall"] as [string, string, string]] : [])] },
              { id: "insikter", label: "5. Statistik & synlighet", hint: "Hur sajten och partners presterar", tabs: [
                ["stats", "Statistik", "Besök, köpresor och rapporter"],
                ["ai", "AI-synlighet", "Hur AI-tjänster nämner sajten"],
                ["backlinks", "Backlänkar", "Länkar från andra sajter"]] },
            ];
            const current = groups.find((g) => g.tabs.some(([v]) => v === tab)) ?? groups[0];
            const active = current.tabs.find(([v]) => v === tab);
            return (
              <div className="mb-6 space-y-3">
                <nav aria-label="Redaktionens områden" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {groups.map((g) => (
                    <button key={g.id} type="button" onClick={() => setTab(g.tabs[0][0])}
                      className={`rounded-md border p-3 text-left transition-colors ${g.id === current.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"}`}>
                      <span className="block text-sm font-semibold">{g.label}</span>
                      <span className="block text-xs text-muted-foreground">{g.hint}</span>
                    </button>
                  ))}
                </nav>
                <TabsList className="h-auto w-full justify-start flex-wrap gap-1 [&>button]:min-h-10">
                  {current.tabs.map(([v, l]) => <TabsTrigger key={v} value={v}>{l}</TabsTrigger>)}
                </TabsList>
                {active && <p className="text-sm text-muted-foreground">{active[2]}</p>}
              </div>
            );
          })()}

          <TabsContent value="assignment-profiles">
            <RedaktionAssignmentProfilesTab
              token={token}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                is_featured: p.is_featured ?? false,
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="isv">
            <AdminIsvCatalogTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="help-requests">
            <HelpRequestsCard token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="advisory">
            <AdminAdvisoryTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="newsletter">
            <AdminNewsletterCard token={token} />
          </TabsContent>

          <TabsContent value="texts">
            <RedaktionSiteTextsTab token={token} onSessionExpired={logout} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="budget">
              <RedaktionBudgetTab token={token} partners={partners as any} />
            </TabsContent>
          )}
          <TabsContent value="exports">
            {token && <DemandExportsPanel token={token} onUnauthorized={logout} />}
          </TabsContent>
          <TabsContent value="terms">
            <RedaktionTermsTab token={token} />
          </TabsContent>

          <TabsContent value="backlinks">
            <RedaktionBacklinksTab token={token} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="partner-teaser">
            <RedaktionPartnerTeaser token={token || null} initialSlug={teaserSlug} />
          </TabsContent>

          <TabsContent value="sales-kit">
            <RedaktionSalesKitTab token={token || null} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <JourneyFunnelsCard token={token} onSessionExpired={logout} />
            <BuyerPathsReportCard token={token} onSessionExpired={logout} />
            <LeadStepsReportCard token={token} onSessionExpired={logout} />
            <BuyerFunnelCard token={token} onSessionExpired={logout} />
            <AiLibraryStatsCard token={token} onSessionExpired={logout} />
            <PostHogStatsCard token={token} onSessionExpired={logout} />
            <SiteTrafficStatsCard token={token} variant="full" />
            <ContentReadsCard token={token} />
            <AdminStatsSummary token={token || ""} onSessionExpired={logout} />
            <AdminUnderlagFunnel token={token} onSessionExpired={logout} />
            <RedaktionPartnerMonthlyReport token={token} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="ai">
            <AdminAiVisibilityTab token={token} onSessionExpired={logout} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="verify">
              <RedaktionQuickVerify token={token} onSessionExpired={logout} />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="partner-admin">
              {token && seedAdminSession(token)}
              <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}>
                <AdminDashboard embedded />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="partners">
            <div className="mb-6"><PartnerFreshnessCard partners={partners as any} /></div>
            <div className="mb-6"><IsvFreshnessCard token={token} onSessionExpired={logout} /></div>
            <RedaktionPartnerLinksTab
              token={token}
              onOpenTeaser={(s) => { setTeaserSlug(s); setTab("partner-teaser"); window.scrollTo({ top: 0 }); }}
              isLoading={partnersLoading}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                is_featured: p.is_featured ?? false,
                hide_basic_card: (p as typeof p & { hide_basic_card?: boolean }).hide_basic_card ?? false,
                information_status: p.information_status,
                information_verified_at: p.information_verified_at,
                public_profile_summary: p.public_profile_summary ?? null,
                public_focus_tags: p.public_focus_tags ?? [],
                public_topics_12m: p.public_topics_12m ?? [],
                public_profile_updated_at: p.public_profile_updated_at ?? null,
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="webinar">
            <RedaktionWebinarTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="subscribers">
            <RedaktionNewsletterTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="events">
            <AdminEventsTab
              token={token || ""}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                is_featured: p.is_featured || false,
                slug: p.slug,
                email: p.email || "",
                admin_contact_email: p.admin_contact_email || "",
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="partner-news">
            <AdminPartnerNewsTab
              token={token || ""}
              partners={partners.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                is_featured: p.is_featured ?? false,
                logo_url: p.logo_url ?? null,
              }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          <TabsContent value="aktuellt">
            <RedaktionAktuelltTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideosTab token={token || ""} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="articles">
            <AdminKnowledgeArticlesTab token={token || null} onSessionExpired={logout} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
