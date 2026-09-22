import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { deliveryModeLabel } from "@/data/competenceGuides";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";
import type { CompetenceFilterState } from "@/lib/competenceMatching";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Roll eller kompetensområde, förvalt från aktuell sida. */
  roleLabel: string;
  guideSlug?: string;
  filters: CompetenceFilterState;
}

const MIN_DESCRIPTION = 30;

const DescribeNeedDialog = ({ open, onOpenChange, roleLabel, guideSlug, filters }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [lastPayload, setLastPayload] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    start: "",
    length: "",
    scope: "",
    description: "",
    consent: false,
    hp: "",
  });

  const upd = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hp) {
      onOpenChange(false);
      return;
    }
    if (!form.company.trim() || !form.name.trim() || !form.email.trim()) {
      toast({ title: "Fyll i företag, namn och e-post", variant: "destructive" });
      return;
    }
    const emailCheck = validateBusinessEmail(form.email);
    if (!emailCheck.valid) {
      toast({ title: "Kontrollera e-postadressen", description: emailCheck.error, variant: "destructive" });
      return;
    }
    if (form.description.trim().length < MIN_DESCRIPTION) {
      toast({
        title: "Beskriv behovet lite utförligare",
        description: `Minst ${MIN_DESCRIPTION} tecken.`,
        variant: "destructive",
      });
      return;
    }
    if (!form.consent) {
      toast({ title: "Bekräfta att du tagit del av integritetspolicyn", variant: "destructive" });
      return;
    }

    const signature = JSON.stringify({ ...form, hp: undefined });
    if (signature === lastPayload) {
      setDone(true);
      return;
    }

    const messageLines = [
      `Behov av kompetens: ${roleLabel}.`,
      filters.product ? `Produkt: ${filters.product}.` : "",
      filters.industry ? `Bransch: ${filters.industry}.` : "",
      filters.region ? `Område: ${filters.region}.` : "",
      filters.delivery ? `Leveransform: ${deliveryModeLabel(filters.delivery)}.` : "",
      form.start ? `Önskad start: ${form.start}.` : "",
      form.length ? `Uppskattad längd: ${form.length}.` : "",
      form.scope ? `Omfattning: ${form.scope}.` : "",
      "",
      form.description.trim(),
    ].filter(Boolean);

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          company_name: form.company.trim(),
          contact_name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          industry: filters.industry,
          selected_product: filters.product,
          source_page: typeof window !== "undefined" ? window.location.pathname : guideSlug,
          source_type: "kompetens_behov",
          message: messageLines.join("\n").slice(0, 1000),
        },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || "Kunde inte skicka just nu.");
      }
      setLastPayload(signature);
      setDone(true);
      trackCompetenceEvent("kompetens_need_form_submit", { guide: guideSlug });
    } catch (err: any) {
      toast({
        title: "Det gick inte att skicka",
        description: err?.message || "Försök igen om en stund.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Beskriv ert behov</DialogTitle>
          <DialogDescription>
            Behovet går till d365.se och skickas inte vidare till partners automatiskt.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4">
            <p className="text-sm">
              Tack. d365.se går igenom ert behov och återkommer om vi ser ett relevant nästa steg.
            </p>
            <Button onClick={() => onOpenChange(false)}>Stäng</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              value={form.hp}
              onChange={(e) => upd("hp", e.target.value)}
            />

            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <p className="font-semibold">Roll eller kompetensområde</p>
              <p className="text-muted-foreground">{roleLabel}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="kn-company">Företag *</Label>
                <Input id="kn-company" value={form.company} onChange={(e) => upd("company", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="kn-name">Namn *</Label>
                <Input id="kn-name" value={form.name} onChange={(e) => upd("name", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="kn-email">E-post *</Label>
                <Input id="kn-email" type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="kn-phone">Telefon</Label>
                <Input id="kn-phone" value={form.phone} onChange={(e) => upd("phone", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="kn-start">Önskad start</Label>
                <Input id="kn-start" placeholder="Till exempel 2026-11" value={form.start} onChange={(e) => upd("start", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="kn-length">Uppskattad längd</Label>
                <Input id="kn-length" placeholder="Till exempel 6 månader" value={form.length} onChange={(e) => upd("length", e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="kn-scope">Omfattning</Label>
              <Input id="kn-scope" placeholder="Till exempel 2 dagar per vecka" value={form.scope} onChange={(e) => upd("scope", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="kn-desc">Beskrivning av behovet *</Label>
              <Textarea
                id="kn-desc"
                rows={5}
                value={form.description}
                onChange={(e) => upd("description", e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Minst {MIN_DESCRIPTION} tecken. {form.description.trim().length} skrivna.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="kn-consent"
                checked={form.consent}
                onCheckedChange={(v) => upd("consent", v === true)}
              />
              <Label htmlFor="kn-consent" className="text-sm font-normal leading-relaxed">
                Jag har tagit del av{" "}
                <Link to="/integritetspolicy/" className="underline" target="_blank">
                  integritetspolicyn
                </Link>
                . *
              </Label>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Skickar…" : "Skicka behovet till d365.se"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DescribeNeedDialog;
