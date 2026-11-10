import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Minus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import { useIsvSolutions, useIsvVendors } from "@/hooks/useIsvSolutions";
import { isVendorVerified, matchVerifiedPartner, type FeaturedPartnerLite } from "@/lib/isvVisibility";
import partnerData from "@/data/partnerData.json";

const partners = partnerData as FeaturedPartnerLite[];
const catalogue = "/kunskapscenter/dynamics-365-tillagg/";
const brandText = (text: string) => text.replace(/Microsoft\s+Dynamics\s+365/g, "Microsoft\u00a0Dynamics\u00a0365").replace(/Dynamics\s+365/g, "Dynamics\u00a0365");
type Entry = { id: string; name: string; subtitle: string; verified: boolean; description: string; url: string; rows: { label: string; value: string }[] };

export default function IsvProfileCheck() {
  const solutions = useIsvSolutions();
  const vendors = useIsvVendors();
  const [mode, setMode] = useState<"vendor" | "product">("vendor");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [comparing, setComparing] = useState(false);

  const entries = useMemo<Entry[]>(() => {
    if (mode === "product") return solutions.map((s) => ({
      id: s.id, name: s.name, subtitle: s.vendor, verified: s.informationStatus === "verified",
      description: brandText(s.shortDescription), url: `/isv/produkt/${encodeURIComponent(s.id)}/`,
      rows: [
        { label: "Produktområden", value: s.products?.join(", ") || "" },
        { label: "Vad lösningen gör", value: brandText(s.what) },
        { label: "Användningsområden", value: brandText(s.useCases.join(" · ")) },
        { label: "När lösningen passar", value: brandText(s.bestFor || s.whenFits) },
        { label: "Att ta hänsyn till", value: brandText(s.considerations || "") },
        { label: "Branscher", value: (s.industryFocus || s.industries).join(", ") },
        { label: "Kundcase", value: s.customerCases?.map((c) => c.title).join(" · ") || "" },
        { label: "Demofilm", value: s.demoVideoUrl ? "Finns" : "" },
      ],
    })).sort((a, b) => a.name.localeCompare(b.name, "sv"));
    const grouped = new Map<string, typeof solutions>();
    for (const s of solutions) {
      const key = s.vendorSlug || s.vendor;
      grouped.set(key, [...(grouped.get(key) || []), s]);
    }
    // Published supplier profiles can exist without a listed product.
    for (const v of Object.values(vendors)) if (!grouped.has(v.slug)) grouped.set(v.slug, []);
    return [...grouped].map(([id, products]) => {
      const v = vendors[id];
      const name = v?.name || products[0]?.vendor || id;
      const verified = isVendorVerified(v?.information_status, matchVerifiedPartner(name, id, partners));
      return { id, name, subtitle: `${products.length} produkter i katalogen`, verified,
        description: brandText(v?.description || "Ingen separat leverantörsbeskrivning finns registrerad."),
        url: `${catalogue}?leverantor=${encodeURIComponent(products[0]?.vendor || name)}`,
        rows: [
          { label: "Leverantörsbeskrivning", value: brandText(v?.description || "") },
          { label: "Produkter", value: products.map((p) => p.name).join(" · ") },
          { label: "Produktområden", value: [...new Set(products.flatMap((p) => p.products || []))].join(", ") },
          { label: "Verifierade produkter", value: `${products.filter((p) => p.informationStatus === "verified").length} av ${products.length}` },
        ],
      };
    }).sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [mode, solutions, vendors]);

  const own = entries.find((e) => e.id === selected);
  const references = entries.filter((e) => e.verified && e.id !== selected);
  const reference = references.find((e) => e.id === referenceId) || references[0];
  const suggestions = query.trim().length >= 2
    ? entries.filter((e) => `${e.name} ${e.subtitle}`.toLocaleLowerCase("sv").includes(query.trim().toLocaleLowerCase("sv"))).slice(0, 8) : [];

  return (
    <section id="isv-profilkoll" className="py-12 scroll-mt-28 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm font-semibold text-accent mb-2">Kostnadsfri profilkoll</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-5">Se er ISV-profil och era produkter</h2>
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Profiltyp">
          {([['vendor', 'ISV-leverantör'], ['product', 'ISV-produkt']] as const).map(([value, label]) => (
            <Button key={value} variant={mode === value ? "default" : "outline"} aria-pressed={mode === value} onClick={() => { setMode(value); setSelected(""); setQuery(""); setComparing(false); setReferenceId(""); }}>{label}</Button>
          ))}
        </div>
        <div className="max-w-xl">
          <label htmlFor="isv-profile-search" className="text-sm font-medium block mb-2">{mode === "vendor" ? "Leverantörens namn" : "Produktens eller leverantörens namn"}</label>
          <div className="relative"><Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" aria-hidden="true" /><Input id="isv-profile-search" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-11" placeholder="Sök i katalogen" /></div>
          {suggestions.length > 0 && <ul className="mt-2 border border-border rounded-lg bg-card divide-y divide-border">{suggestions.map((e) => <li key={e.id}><Button variant="ghost" className="w-full h-auto justify-start text-left whitespace-normal py-3" onClick={() => { setSelected(e.id); setQuery(""); setComparing(false); setReferenceId(""); }}><span>{e.name}<span className="block text-xs text-muted-foreground">{e.subtitle}</span></span></Button></li>)}</ul>}
          {query.trim().length >= 2 && !suggestions.length && <p className="mt-3 text-sm text-muted-foreground" role="status">Ingen träff i katalogen. Prova ett annat namn.</p>}
        </div>
        {own && <div className="mt-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div><h3 className="text-xl font-semibold">{own.name}</h3><p className="text-sm text-muted-foreground mt-1">{own.subtitle}</p><InformationStatusBadge kind="isv" isvProduct={mode === "product"} partner={{ information_status: own.verified ? "verified" : "compiled" }} className="mt-2" /></div>
            <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link to={own.url}>Se som köpare<ArrowRight className="ml-2 w-4 h-4" /></Link></Button><Button variant="outline" onClick={() => setComparing(!comparing)} aria-expanded={comparing}>Jämför med en verifierad {mode === "vendor" ? "leverantör" : "produkt"}</Button></div>
          </div>
          <p className="text-sm text-muted-foreground max-w-3xl mb-6">{own.description}</p>
          {mode === "vendor" && <p className="text-sm text-muted-foreground mb-6">Leverantör och produkt verifieras var för sig. En verifierad leverantör gör inte alla produkter verifierade.</p>}
          {comparing && (reference ? <div className="mb-5 max-w-xl"><label htmlFor="isv-reference" className="text-sm font-medium block mb-2">Verifierad exempelprofil</label><select id="isv-reference" className="w-full h-11 rounded-md border border-input bg-background text-foreground px-3" value={reference.id} onChange={(e) => setReferenceId(e.target.value)}>{references.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select><Button asChild variant="link" className="px-0"><Link to={reference.url}>Öppna exempelprofilen<ArrowRight className="w-4 h-4 ml-2" /></Link></Button><p className="text-xs text-muted-foreground">Jämförelsen visar registrerat innehåll, inte produktkvalitet eller en rekommendation.</p></div> : <p role="status" className="text-sm text-muted-foreground mb-5">Ingen annan verifierad {mode === "vendor" ? "leverantör" : "produkt"} finns att jämföra med just nu.</p>)}
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="border-b border-border"><th scope="col" className="py-3 pr-4">Beslutsunderlag</th><th scope="col" className="py-3 px-4">{own.name}</th>{comparing && reference && <th scope="col" className="py-3 px-4">{reference.name}</th>}</tr></thead><tbody>{own.rows.map((row, i) => <tr key={row.label} className="border-b border-border"><th scope="row" className="py-4 pr-4 font-medium align-top">{row.label}</th>{[row, ...(comparing && reference ? [reference.rows[i]] : [])].map((r, j) => <td key={j} className="py-4 px-4 align-top min-w-48"><span className="flex gap-2">{r?.value ? <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" /> : <Minus className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />}<span>{r?.value || "Inte registrerat"}</span></span></td>)}</tr>)}</tbody></table></div>
          {mode === "vendor" && <div className="mt-5"><h3 className="text-lg font-semibold mb-2">Produkter från {own.name}</h3><ul className="divide-y divide-border">{solutions.filter((s) => (s.vendorSlug || s.vendor) === own.id).map((s) => <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-2"><Button asChild variant="link" className="px-0 h-auto whitespace-normal text-left"><Link to={`${catalogue}?losning=${encodeURIComponent(s.id)}`}>{s.name}<ArrowRight className="w-4 h-4 ml-2 shrink-0" /></Link></Button><Button variant="outline" size="sm" onClick={() => { setMode("product"); setSelected(s.id); setQuery(""); setComparing(true); setReferenceId(""); }}>Jämför produkt</Button></li>)}</ul></div>}
        </div>}
      </div>
    </section>
  );
}