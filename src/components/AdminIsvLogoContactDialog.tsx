import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Contact = { contact_name?: string | null; contact_email?: string | null; contact_phone?: string | null } | null;

export interface LogoContactTarget {
  kind: "vendor" | "product";
  key: string;
  name: string;
  logo_url?: string | null;
  contact: Contact;
  /** Leverantörens kontakt som produkten ärver när egna fält är tomma. */
  inherited?: Contact;
  verified: boolean;
}

interface Props {
  target: LogoContactTarget | null;
  onClose: () => void;
  onSaved: () => void;
  baseUrl: string;
  headers: () => Record<string, string>;
  onSessionExpired: () => void;
}

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/** Logotyp och kontakt för en ISV-leverantör eller produkt. Visas publikt först när posten är verifierad. */
export default function AdminIsvLogoContactDialog({ target, onClose, onSaved, baseUrl, headers, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({ contact_name: "", contact_email: "", contact_phone: "" });
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!target) return;
    setForm({
      contact_name: target.contact?.contact_name || "",
      contact_email: target.contact?.contact_email || "",
      contact_phone: target.contact?.contact_phone || "",
    });
    setLogo(target.logo_url || null);
  }, [target]);

  const call = async (action: string, body: Record<string, unknown>) => {
    const res = await fetch(`${baseUrl}?action=${action}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    if (res.status === 401) { onSessionExpired(); return null; }
    const data = await res.json();
    if (!res.ok) { toast({ title: "Kunde inte spara", description: data?.error, variant: "destructive" }); return null; }
    return data;
  };

  const upload = async (file: File) => {
    if (!target) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast({ title: "Fel filtyp", description: "Använd PNG, JPEG eller WebP.", variant: "destructive" });
      return;
    }
    if (file.size > 1024 * 1024) {
      toast({ title: "För stor fil", description: "Logotypen får vara högst 1 MB.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const data = await call("upload_logo", { kind: target.kind, key: target.key, content_type: file.type, data: await toBase64(file) });
    setBusy(false);
    if (data) { setLogo(data.logo_url); toast({ title: "Logotypen är uppladdad" }); onSaved(); }
  };

  const removeLogo = async () => {
    if (!target) return;
    setBusy(true);
    const data = await call("upload_logo", { kind: target.kind, key: target.key, remove: true });
    setBusy(false);
    if (data) { setLogo(null); onSaved(); }
  };

  const save = async () => {
    if (!target) return;
    setBusy(true);
    const data = await call("set_contact", { kind: target.kind, key: target.key, ...form });
    setBusy(false);
    if (data) { toast({ title: "Kontakten är sparad" }); onSaved(); onClose(); }
  };

  const inh = target?.inherited;
  const isProduct = target?.kind === "product";

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{target?.name}: {isProduct ? "produktlogotyp och kontakt" : "företagslogotyp och kontakt"}</DialogTitle>
          <DialogDescription>
            {target?.verified
              ? "Posten är verifierad, så logotyp och kontakt visas publikt i katalogen."
              : "Posten är inte verifierad. Uppgifterna sparas men visas inte publikt förrän den verifieras."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          <section className="space-y-2">
            <Label>{isProduct ? "Produktlogotyp" : "Företagslogotyp"}</Label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-md border border-border bg-card flex items-center justify-center p-2">
                {logo ? <img src={logo} alt="" className="max-w-full max-h-full object-contain" /> : <span className="text-xs text-muted-foreground">Ingen</span>}
              </div>
              <div className="flex flex-col gap-2">
                <Input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                {logo && <Button size="sm" variant="outline" disabled={busy} onClick={removeLogo}>Ta bort logotyp</Button>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPEG eller WebP, högst 1 MB.{isProduct ? " Utan produktlogotyp används leverantörens logotyp." : ""}
            </p>
          </section>

          <section className="space-y-3">
            <Label>{isProduct ? "Säljkontakt för produkten" : "Kontaktperson hos leverantören"}</Label>
            {isProduct && (
              <p className="text-xs text-muted-foreground">
                Lämna fälten tomma för att ärva leverantörens kontakt
                {inh?.contact_name || inh?.contact_email ? ` (${[inh?.contact_name, inh?.contact_email, inh?.contact_phone].filter(Boolean).join(", ")})` : ", som ännu saknas"}.
              </p>
            )}
            <div>
              <Label htmlFor="lc-name" className="text-xs">Namn</Label>
              <Input id="lc-name" value={form.contact_name} placeholder={inh?.contact_name || ""} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lc-email" className="text-xs">E-post</Label>
              <Input id="lc-email" type="email" value={form.contact_email} placeholder={inh?.contact_email || ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lc-phone" className="text-xs">Telefon</Label>
              <Input id="lc-phone" value={form.contact_phone} placeholder={inh?.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Stäng</Button>
          <Button onClick={save} disabled={busy}>Spara kontakt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
