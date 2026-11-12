import { useRef, useState } from 'react';
import { Download, ShoppingCart } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { isFreeEmailDomain } from '@/lib/validateBusinessEmail';
import { ISV_ORDER_VERSION, ISV_ORDER_FEES, ISV_MAX_EXTRA_APPS, ISV_SUBSCRIPTION_TERMS, ISV_MEDIATION_TERMS, isvOrderPrice, isvOrderRegularPrice, isvOrderValidation, type IsvOrderSelection } from '@/lib/isvOrder';
import { toast } from 'sonner';

const money = (n: number) => n.toLocaleString('sv-SE');
const FIELDS = [['company', 'Företagsnamn'], ['organization_number', 'Organisationsnummer'], ['contact_name', 'Beställarens namn'], ['email', 'Företagsmejl'], ['invoice_email', 'Fakturamejl'], ['invoice_address', 'Fakturaadress']] as const;

/** ISV Presence offer and order; same order flow and table as the partner program, priced on the server. */
export default function IsvOrderDialog() {
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [done, setDone] = useState('');
  const request = useRef(crypto.randomUUID()); const submitting = useRef(false);
  const [selection, setSelection] = useState<IsvOrderSelection>({ kind: 'isv', extra_apps: 0, mediation: false, start_date: new Date().toISOString().slice(0, 10) });
  const [accept, setAccept] = useState(false), [authority, setAuthority] = useState(false), [mediationAccept, setMediationAccept] = useState(false);
  const [fields, setFields] = useState({ company: '', organization_number: '', contact_name: '', email: '', invoice_email: '', invoice_address: '' });
  const price = isvOrderPrice(selection); const regular = isvOrderRegularPrice(selection);

  async function pdf() {
    try {
      const { generatePartnerAgreementPdf } = await import('@/utils/generatePartnerAgreementPdf');
      const blob = await generatePartnerAgreementPdf({
        heading: 'Offertförslag: ISV Presence',
        intro: `Offertförslag, inte en beställning. Villkorsversion ${ISV_ORDER_VERSION}. ${fields.company || 'Företag ej angivet'}.`,
        benefits: 'isv',
        sections: [
          { title: 'Valt innehåll', body: `ISV Presence inklusive en app\nExtra appar: ${selection.extra_apps}\nÖnskad start: ${selection.start_date}\nFörmedlingsavtal (Finder’s fee): ${selection.mediation ? 'Ja' : 'Nej'}` },
          { title: 'Abonnemangsvillkor', body: ISV_SUBSCRIPTION_TERMS },
          ...(selection.mediation ? [{ title: 'Förmedlingsvillkor (Finder’s fee)', body: ISV_MEDIATION_TERMS }] : []),
        ],
        priceRows: [
          ['ISV Presence inklusive en app, första året (introduktionspris)', `${money(ISV_ORDER_FEES.introFirstYear)} kr`],
          ...(selection.extra_apps ? [[`Extra appar (${selection.extra_apps} × ${money(ISV_ORDER_FEES.extraApp)} kr)`, `${money(selection.extra_apps * ISV_ORDER_FEES.extraApp)} kr / år`] as [string, string]] : []),
          ['Totalt första året', `${money(price)} kr`],
          ['Ordinarie årspris från år två', `${money(regular)} kr / år`],
        ],
        priceNote: 'Exklusive moms. Faktureras årsvis i förskott. Introduktionspriset gäller de första 20 nya ISV-leverantörerna. Förmedlingsersättningar tillkommer endast enligt valda förmedlingsvillkor.',
        acceptance: 'Offertförslaget blir inte bindande genom nedladdning. Beställning görs i formuläret på d365.se/isvprogram/.',
      });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'd365se-offertforslag-isv.pdf'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch { toast.error('PDF kunde inte skapas.'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (submitting.current) return;
    const invalid = isvOrderValidation(selection, accept, authority, mediationAccept); if (invalid) { toast.error(invalid); return; }
    const check = z.object({ company: z.string().trim().min(2).max(200), organization_number: z.string().regex(/^\d{6}-?\d{4}$/), contact_name: z.string().trim().min(2).max(100), email: z.string().email().refine(v => !isFreeEmailDomain(v)), invoice_email: z.string().email().refine(v => !isFreeEmailDomain(v)), invoice_address: z.string().trim().min(2).max(500) }).safeParse(fields);
    if (!check.success) { toast.error('Kontrollera företagsuppgifter, organisationsnummer och företagsmejl.'); return; }
    submitting.current = true; setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('partner-program-order', { body: { ...check.data, selection, accept, authority, mediation_accept: mediationAccept, request_id: request.current } });
      if (error || !data?.success) throw new Error(data?.error || 'Beställningen kunde inte sparas.');
      setDone(data.order_id);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Beställningen kunde inte sparas.'); } finally { setBusy(false); submitting.current = false; }
  }

  return <Dialog open={open} onOpenChange={v => { if (!busy) setOpen(v); }}>
    <DialogTrigger asChild><Button className="mt-5 gap-2"><ShoppingCart className="h-4 w-4" />Se offert och beställ</Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
      <DialogHeader><DialogTitle>Offert och beställning: ISV Presence</DialogTitle><DialogDescription>ISV-programmet · villkor {ISV_ORDER_VERSION} · priser exklusive moms</DialogDescription></DialogHeader>
      {done ? <div className="space-y-4"><h2 className="text-xl font-semibold">Beställningen är registrerad</h2><p className="break-all">Beställningsnummer: {done}</p><p>Beställningen är sparad hos d365.se. Verifiering och visning aktiveras inte automatiskt.</p><Button variant="outline" onClick={pdf}><Download className="mr-2 h-4 w-4" />Hämta offertförslaget</Button></div> :
      <form onSubmit={submit} className="space-y-6">
        <div><Label htmlFor="isv-extra">Extra appar utöver den som ingår</Label><Input id="isv-extra" type="number" min={0} max={ISV_MAX_EXTRA_APPS} value={selection.extra_apps} onChange={e => setSelection(s => ({ ...s, extra_apps: Math.max(0, Math.min(ISV_MAX_EXTRA_APPS, Math.floor(Number(e.target.value) || 0))) }))} className="max-w-[10rem]" /><p className="text-xs text-muted-foreground mt-1">{money(ISV_ORDER_FEES.extraApp)} kr per år och extra app.</p></div>
        <div className="border-y border-border py-4"><p className="text-lg font-semibold">ISV Presence första året: {money(price)} kr</p><p className="text-sm text-muted-foreground">Introduktionspris {money(ISV_ORDER_FEES.introFirstYear)} kr inklusive en app{selection.extra_apps ? ` + ${selection.extra_apps} × ${money(ISV_ORDER_FEES.extraApp)} kr` : ''}. Från år två {money(regular)} kr / år. Gäller de första 20 nya ISV-leverantörerna. Faktureras årsvis i förskott.</p></div>
        <details><summary className="cursor-pointer font-semibold">Innehåll och abonnemangsvillkor</summary><p className="mt-3 text-sm leading-relaxed">{ISV_SUBSCRIPTION_TERMS}</p></details>
        <label className="flex items-start gap-3"><Checkbox className="shrink-0 self-start" checked={selection.mediation} onCheckedChange={v => { setSelection(s => ({ ...s, mediation: v === true })); setMediationAccept(false); }} /><span>Jag vill även beställa förmedlingsavtalet (Finder’s fee)</span></label>
        {selection.mediation && <div className="space-y-3 border-l-2 border-accent pl-4"><h3 className="font-semibold">Förmedlingsvillkor</h3><p className="text-sm leading-relaxed">{ISV_MEDIATION_TERMS}</p><label className="flex items-start gap-3 text-sm"><Checkbox className="shrink-0 self-start" checked={mediationAccept} onCheckedChange={v => setMediationAccept(v === true)} /><span>Jag accepterar förmedlingsvillkoren separat.</span></label></div>}
        <div><Label htmlFor="isv-start">Önskat startdatum</Label><Input id="isv-start" type="text" placeholder="ÅÅÅÅ-MM-DD" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required value={selection.start_date} onChange={e => setSelection(s => ({ ...s, start_date: e.target.value }))} /></div>
        <div className="grid gap-4 sm:grid-cols-2">{FIELDS.map(([key, label]) => <div key={key}><Label htmlFor={'isv-' + key}>{label} *</Label><Input id={'isv-' + key} required maxLength={key === 'invoice_address' ? 500 : 200} type={key.includes('email') ? 'email' : 'text'} value={fields[key]} onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))} /></div>)}</div>
        <label className="flex items-start gap-3 text-sm"><Checkbox className="shrink-0 self-start" checked={accept} onCheckedChange={v => setAccept(v === true)} /><span>Jag accepterar abonnemangsvillkor, pris och fakturering. Beställningen är bindande och medför betalningsskyldighet.</span></label>
        <label className="flex items-start gap-3 text-sm"><Checkbox className="shrink-0 self-start" checked={authority} onCheckedChange={v => setAuthority(v === true)} /><span>Jag har rätt att företräda företaget och ingå detta avtal.</span></label>
        <p className="text-xs text-muted-foreground">Moveahead AB (Dynamic Factory) behandlar uppgifterna för beställning och fakturering. <a className="underline" href="/dataskydd/" target="_blank" rel="noreferrer">Integritetspolicy</a></p>
        <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={pdf} disabled={busy}><Download className="mr-2 h-4 w-4" />Hämta offert som PDF</Button><Button type="submit" disabled={busy || !accept || !authority || (selection.mediation && !mediationAccept)}>{busy ? 'Sparar beställning…' : 'Beställ med betalningsskyldighet'}</Button></div>
      </form>}
    </DialogContent>
  </Dialog>;
}
