import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Item = Record<string, string | boolean>;
const specs = [
  { key: 'product_gallery', title: 'Produktbilder', max: 12, fields: [['url', 'Bildadress (https://)'], ['caption', 'Bildtext']] },
  { key: 'product_features', title: 'Fördjupade funktioner', max: 20, fields: [['title', 'Rubrik'], ['text', 'Beskrivning']] },
  { key: 'customer_cases', title: 'Kundcase', max: 3, fields: [['title', 'Titel'], ['text', 'Beskrivning'], ['url', 'Källa (https://)']] },
  { key: 'integration_evidence', title: 'Integrationsbelägg', max: 20, fields: [['application', 'Applikation'], ['statement', 'Vad dokumentationen styrker'], ['sourceUrl', 'Dokumentation (https://)']] },
  { key: 'partner_evidence', title: 'Dokumenterade partnerrelationer', max: 20, fields: [['partnerSlug', 'Partnerns adressnamn'], ['statement', 'Dokumenterad erfarenhet eller relation'], ['sourceUrl', 'Dokumentation (https://)']] },
];
export default function IsvPresentationEditor({ product, onClose, onSaved, baseUrl, headers, onSessionExpired }: { product: Record<string, any>; onClose: () => void; onSaved: () => void; baseUrl: string; headers: () => Record<string, string>; onSessionExpired: () => void }) {
  const [form, setForm] = useState<Record<string, Item[]>>(() => Object.fromEntries(specs.map(s => [s.key, Array.isArray(product[s.key]) ? product[s.key] : []])));
  const [video, setVideo] = useState(product.demo_video_url || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=set_product_status`, { method: 'POST', headers: headers(), body: JSON.stringify({ solution_id: product.solution_id, ...form, demo_video_url: video }) });
      if (res.status === 401) { onSessionExpired(); return; }
      if (!res.ok) throw new Error('Kontrollera innehållet och försök igen.');
      toast({ title: 'Produktpresentationen sparad' }); onSaved(); onClose();
    } catch { toast({ title: 'Kunde inte spara', variant: 'destructive' }); } finally { setSaving(false); }
  };
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Produktpresentation: {product.name}</DialogTitle></DialogHeader><div className="space-y-7"><div><Label htmlFor="product-demo">Demo eller video (https://)</Label><Input id="product-demo" value={video} onChange={e => setVideo(e.target.value)} /></div>{specs.map(spec => <section key={spec.key} className="border-t border-border pt-5"><h3 className="font-semibold mb-4">{spec.title}</h3>{form[spec.key].map((item, index) => <div key={index} className="border-b border-border pb-4 mb-4 space-y-3">{spec.fields.map(([key, label]) => <div key={key}><Label htmlFor={`${spec.key}-${index}-${key}`}>{label}</Label>{key === 'text' || key === 'statement' ? <Textarea id={`${spec.key}-${index}-${key}`} value={String(item[key] || '')} onChange={e => setForm({ ...form, [spec.key]: form[spec.key].map((r, n) => n === index ? { ...r, [key]: e.target.value } : r) })} /> : <Input id={`${spec.key}-${index}-${key}`} value={String(item[key] || '')} onChange={e => setForm({ ...form, [spec.key]: form[spec.key].map((r, n) => n === index ? { ...r, [key]: e.target.value } : r) })} />}</div>)}{spec.key.endsWith('evidence') && <label className="flex items-center gap-2 text-sm"><Checkbox checked={item.reviewed === true} onCheckedChange={v => setForm({ ...form, [spec.key]: form[spec.key].map((r, n) => n === index ? { ...r, reviewed: v === true } : r) })} />Dokumentationen granskad av redaktionen</label>}<Button variant="ghost" size="sm" onClick={() => setForm({ ...form, [spec.key]: form[spec.key].filter((_, n) => n !== index) })}><Trash2 className="w-4 h-4" />Ta bort</Button></div>)}<Button variant="outline" size="sm" disabled={form[spec.key].length >= spec.max} onClick={() => setForm({ ...form, [spec.key]: [...form[spec.key], {}] })}><Plus className="w-4 h-4" />Lägg till</Button></section>)}</div><DialogFooter><Button variant="outline" onClick={onClose}>Avbryt</Button><Button disabled={saving} onClick={save}>{saving ? 'Sparar…' : 'Spara'}</Button></DialogFooter></DialogContent></Dialog>;
}