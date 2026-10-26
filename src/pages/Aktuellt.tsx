import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CollectionPageSchema } from "@/components/StructuredData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AktuelltCard from "@/components/aktuellt/AktuelltCard";
import { usePublishedAktuellt } from "@/hooks/useAktuellt";
import {
  AKTUELLT_AVAILABILITY,
  AKTUELLT_CUSTOMER_STATUS,
  AKTUELLT_PRODUCTS,
  AKTUELLT_TOPICS,
  aktuelltPath,
  type AktuelltArticle,
} from "@/lib/aktuellt";

type FilterDef = {
  param: string;
  allLabel: string;
  options: { value: string; label: string }[];
  match: (a: AktuelltArticle, v: string) => boolean;
};

const INTRO =
  "Förändringar i Dynamics 365 som kan påverka systemval, arbetssätt och befintliga lösningar. d365.se sammanfattar vad som har hänt, vem som berörs och om det finns anledning att agera.";

export default function Aktuellt() {
  const [params, setParams] = useSearchParams();
  const { data, isLoading } = usePublishedAktuellt({});
  const items = data ?? [];
  const sort = params.get("sortera") === "faktakontroll" ? "faktakontroll" : "publicerad";

  // Bygg bara filter som har minst två olika värden bland publicerat innehåll.
  const filters = useMemo<FilterDef[]>(() => {
    const present = (get: (a: AktuelltArticle) => (string | null | undefined)[]) =>
      new Set(items.flatMap(get).filter(Boolean) as string[]);
    const products = present((a) => a.product_keys ?? []);
    const topics = present((a) => [a.topic]);
    const statuses = present((a) => [a.customer_status]);
    const avail = present((a) => [a.availability_status === "not_relevant" ? null : a.availability_status]);
    const industries = present((a) => [a.industry]);
    const defs: FilterDef[] = [
      { param: "produkt", allLabel: "Alla produkter", options: AKTUELLT_PRODUCTS.filter((p) => products.has(p.key)).map((p) => ({ value: p.key, label: p.label })), match: (a, v) => (a.product_keys ?? []).includes(v) },
      { param: "amne", allLabel: "Alla ämnen", options: AKTUELLT_TOPICS.filter((t) => topics.has(t.key)).map((t) => ({ value: t.key, label: t.label })), match: (a, v) => a.topic === v },
      { param: "kund", allLabel: "Alla läsare", options: AKTUELLT_CUSTOMER_STATUS.filter((c) => c.key !== "both" && (statuses.has(c.key) || statuses.has("both"))).map((c) => ({ value: c.key, label: c.label })), match: (a, v) => a.customer_status === v || a.customer_status === "both" },
      { param: "status", allLabel: "All tillgänglighet", options: AKTUELLT_AVAILABILITY.filter((s) => avail.has(s.key)).map((s) => ({ value: s.key, label: s.label })), match: (a, v) => a.availability_status === v },
      { param: "bransch", allLabel: "Alla branscher", options: Array.from(industries).sort((x, y) => x.localeCompare(y, "sv")).map((i) => ({ value: i, label: i })), match: (a, v) => a.industry === v },
    ];
    return defs.filter((f) => f.options.length >= 2 && items.length >= 3);
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    for (const f of filters) {
      const v = params.get(f.param);
      if (v) list = list.filter((a) => f.match(a, v));
    }
    const key = sort === "faktakontroll" ? "fact_checked_at" : "published_at";
    return list.sort((a, b) => String(b[key] ?? "").localeCompare(String(a[key] ?? "")));
  }, [items, filters, params, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const hasFilters = filters.some((f) => params.get(f.param));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Aktuellt inom Dynamics 365 – analys av förändringar"
        description={INTRO}
        canonicalPath="/aktuellt/"
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Aktuellt", url: "/aktuellt/" }]}
      />
      <CollectionPageSchema
        name="Aktuellt inom Dynamics 365"
        description={INTRO}
        url="https://d365.se/aktuellt/"
        items={filtered.slice(0, 20).map((a) => ({ name: a.title, url: `https://d365.se${aktuelltPath(a.slug)}` }))}
      />
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <section className="border-b border-border bg-secondary/40 py-12 sm:py-14">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-accent">Köparguidens analys</span>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Aktuellt inom <span className="whitespace-nowrap">Dynamics 365</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Förändringar i <span className="whitespace-nowrap">Dynamics 365</span> som kan påverka systemval, arbetssätt och befintliga lösningar. d365.se sammanfattar vad som har hänt, vem som berörs och om det finns anledning att agera.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Letar du efter nyheter från partners? Se <Link to="/partnernytt/" className="font-semibold text-primary hover:underline">Partnernytt</Link>.
            </p>
          </div>
        </section>

        {(filters.length > 0 || items.length >= 3) && (
          <section className="border-b border-border bg-card/40 py-6">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {filters.map((f) => (
                  <Select key={f.param} value={params.get(f.param) ?? "all"} onValueChange={(v) => setParam(f.param, v)}>
                    <SelectTrigger className="w-full min-w-0 [&>span]:truncate"><SelectValue placeholder={f.allLabel} /></SelectTrigger>
                    <SelectContent className="max-w-[min(90vw,28rem)]">
                      <SelectItem value="all">{f.allLabel}</SelectItem>
                      {f.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ))}
                <Select value={sort} onValueChange={(v) => setParam("sortera", v === "publicerad" ? "all" : v)}>
                  <SelectTrigger className="w-full min-w-0 [&>span]:truncate"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publicerad">Senast publicerad först</SelectItem>
                    <SelectItem value="faktakontroll">Senast faktakontrollerad först</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  <X className="mr-1 h-3.5 w-3.5" /> Rensa filter
                </Button>
              )}
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="sr-only">Publicerade analyser</h2>
            {isLoading && <p className="text-center text-muted-foreground">Laddar analyser…</p>}
            {!isLoading && items.length === 0 && (
              <div className="mx-auto max-w-2xl py-12 text-center">
                <p className="text-muted-foreground">
                  Här publicerar d365.se analyser av förändringar som kan påverka köpare och befintliga kunder. De första analyserna är på väg.
                  Under tiden kan du läsa om <Link to="/aioversikt/" className="font-semibold text-primary hover:underline">AI och Copilot</Link> eller <Link to="/kom-igang/" className="font-semibold text-primary hover:underline">hitta rätt lösning</Link>.
                </p>
              </div>
            )}
            {!isLoading && items.length > 0 && filtered.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">Inga analyser matchar filtren. Prova att rensa filtren.</p>
            )}
            {filtered.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => <AktuelltCard key={a.id} item={a} clickSource="aktuellt_list" />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
