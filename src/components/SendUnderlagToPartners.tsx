import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Send, CheckCircle2, Plus, X, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePartners, type DatabasePartner } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { hasProduct, type ProductKey } from "@/hooks/usePartnerFilters";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface Props {
  sourcePage: string;
  assessmentType: string;
  products: ProductKey[];
  industry?: string | null;
  companySize?: string | null;
  underlagSummary: string;
  resultUrl?: string;
  pdfBlob?: Blob | null;
  pdfFileName?: string;
  heading?: string;
  description?: string;
}

const MAX_RECIPIENTS = 5;

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as unknown as number[]);
  }
  return btoa(binary);
}

export const SendUnderlagToPartners = ({
  sourcePage,
  assessmentType,
  products,
  industry,
  companySize,
  underlagSummary,
  resultUrl,
  pdfBlob,
  pdfFileName,
  heading = "Skicka underlaget till 2–3 matchande partners",
  description = "Vi har valt ut de partners som passar bäst utifrån era svar. Ni kan avmarkera eller lägga till fler nedan – därefter skickar vi ert underlag och rådgivningsteamet följer upp.",
}: Props) => {
  const { toast } = useToast();
  const { data: allPartners = [] } = usePartners();

  const suggested = useMemo(
    () => pickSuggestedPartners(allPartners, { product: products, industry, limit: 3 }),
    [allPartners, products, industry],
  );

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => suggested.map((p) => p.slug));
  const [extraSlugs, setExtraSlugs] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ delivered: number; total: number } | null>(null);

  const partnersBySlug = useMemo(() => {
    const m = new Map<string, DatabasePartner>();
    allPartners.forEach((p) => m.set(p.slug, p));
    return m;
  }, [allPartners]);

  const eligibleForPicker = useMemo(() => {
    return allPartners
      .filter((p) => products.some((pk) => hasProduct(p, pk)))
      .filter((p) => !suggested.find((s) => s.slug === p.slug))
      .filter((p) => !extraSlugs.includes(p.slug))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [allPartners, products, suggested, extraSlugs]);

  const allChosen = Array.from(
    new Set([...selectedSlugs, ...extraSlugs]),
  ).filter((s) => partnersBySlug.has(s));

  const toggleSuggested = (slug: string) => {
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const addExtra = (slug: string) => {
    if (allChosen.length >= MAX_RECIPIENTS) {
      toast({ title: `Max ${MAX_RECIPIENTS} partners åt gången`, variant: "destructive" });
      return;
    }
    setExtraSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    setPickerOpen(false);
    trackFunnelEvent("underlag_forward_partner_added", { assessment_type: assessmentType, partner_slug: slug });
  };

  const removeExtra = (slug: string) => {
    setExtraSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.name || !form.email) {
      toast({ title: "Fyll i företag, namn och e-post", variant: "destructive" });
      return;
    }
    const emailErr = validateBusinessEmail(form.email);
    if (emailErr) {
      toast({ title: "Ogiltig e-postadress", description: emailErr, variant: "destructive" });
      return;
    }
    if (allChosen.length === 0) {
      toast({ title: "Välj minst en partner att skicka till", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let pdfBase64: string | undefined;
      let pdfFile: string | undefined;
      if (pdfBlob) {
        pdfBase64 = await blobToBase64(pdfBlob);
        pdfFile = pdfFileName || `underlag-${assessmentType}.pdf`;
      }

      const { data, error } = await supabase.functions.invoke("send-underlag-to-partners", {
        body: {
          contact: {
            company_name: form.company,
            contact_name: form.name,
            email: form.email,
            phone: form.phone || undefined,
            message: form.message || undefined,
          },
          assessment_type: assessmentType,
          source_page: sourcePage,
          partner_slugs: allChosen,
          products,
          industry: industry || undefined,
          company_size: companySize || undefined,
          underlag_summary: underlagSummary,
          result_url: resultUrl,
          pdf_base64: pdfBase64,
          pdf_filename: pdfFile,
        },
      });
      if (error) throw error;
      const delivered = (data?.delivered as number) ?? allChosen.length;
      const total = (data?.total as number) ?? allChosen.length;
      setSent({ delivered, total });
      trackFunnelEvent("underlag_forward_submit", {
        assessment_type: assessmentType,
        num_partners: allChosen.length,
        has_pdf: Boolean(pdfBase64),
        source_page: sourcePage,
      });
      toast({
        title: "Tack — underlaget är skickat!",
        description: `${delivered} av ${total} partners har fått ditt underlag och rådgivningsteamet är kopierat.`,
      });
    } catch (err) {
      console.error("send underlag error:", err);
      toast({
        title: "Något gick fel",
        description: "Försök igen om en stund eller kontakta info@d365.se.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Tack — underlaget är skickat</h3>
              <p className="text-sm text-muted-foreground">
                Vi har skickat underlaget till {sent.delivered} av {sent.total} valda partners. Ni får normalt svar
                inom 1–3 arbetsdagar och rådgivningsteamet på d365.se följer upp för att säkerställa att ni får svar.
                En bekräftelse har skickats till <strong>{form.email}</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {/* Suggested partners */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Föreslagna partners (matchade på era svar)
          </p>
          {suggested.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Vi kunde inte matcha automatiskt — lägg till partners nedan.
            </p>
          )}
          <div className="space-y-2">
            {suggested.map((p) => {
              const checked = selectedSlugs.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    checked ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleSuggested(p.slug)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    {(p as any).positioning_statement && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {(p as any).positioning_statement}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Extra partners */}
        {extraSlugs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tillagda partners
            </p>
            <div className="flex flex-wrap gap-2">
              {extraSlugs.map((slug) => {
                const p = partnersBySlug.get(slug);
                if (!p) return null;
                return (
                  <Badge key={slug} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                    {p.name}
                    <button
                      type="button"
                      onClick={() => removeExtra(slug)}
                      className="ml-1 rounded-full hover:bg-background/60 p-0.5"
                      aria-label={`Ta bort ${p.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={allChosen.length >= MAX_RECIPIENTS || eligibleForPicker.length === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Lägg till fler partners
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[320px]" align="start">
            <Command>
              <CommandInput placeholder="Sök partner..." />
              <CommandList>
                <CommandEmpty>Inga fler partners hittades.</CommandEmpty>
                <CommandGroup>
                  {eligibleForPicker.map((p) => (
                    <CommandItem key={p.slug} value={p.name} onSelect={() => addExtra(p.slug)}>
                      {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <p className="text-xs text-muted-foreground">
          Totalt {allChosen.length} av max {MAX_RECIPIENTS} mottagare.
        </p>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
          <div>
            <Label htmlFor="uf_company">Företag *</Label>
            <Input id="uf_company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required maxLength={100} />
          </div>
          <div>
            <Label htmlFor="uf_name">Ditt namn *</Label>
            <Input id="uf_name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
          </div>
          <div>
            <Label htmlFor="uf_email">E-post (jobb) *</Label>
            <Input id="uf_email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
          </div>
          <div>
            <Label htmlFor="uf_phone">Telefon</Label>
            <Input id="uf_phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="uf_msg">Meddelande till partners (valfritt)</Label>
            <Textarea
              id="uf_msg"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              maxLength={800}
              placeholder="T.ex. tidplan, budget eller specifika prioriteringar."
            />
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Rådgivningsteamet på d365.se BCC:as på varje utskick för uppföljning. Godkänn vår{" "}
              <a href="/dataskydd/" className="underline">integritetspolicy</a>.
            </p>
            <Button
              type="submit"
              disabled={submitting || allChosen.length === 0}
              className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))] whitespace-nowrap"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Skickar...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Skicka till {allChosen.length} partners</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendUnderlagToPartners;
