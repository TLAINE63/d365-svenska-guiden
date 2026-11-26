import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SwedishDatePicker } from '@/components/ui/swedish-date-picker';
import { BadgeCheck } from 'lucide-react';
import { partnerLevel, partnerLevelFields, type PartnerPublication, type PublicationLevel } from '@/lib/publicationLevel';

export interface PartnerStatusFields extends PartnerPublication {
  information_status?: string | null;
  information_verified_at?: string | null;
}
export default function PartnerPublicationControls({ partner, onChange, disabled = false }: {
  partner: PartnerStatusFields; onChange: (fields: Record<string, unknown>) => void; disabled?: boolean;
}) {
  return <div className="grid gap-3 min-w-[210px]" data-partner-status-controls>
    <Select value={partnerLevel(partner)} disabled={disabled} onValueChange={v => onChange(partnerLevelFields(v as PublicationLevel))}>
      <SelectTrigger aria-label="Publiceringsnivå"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="premium">Premium</SelectItem><SelectItem value="basic">Grundprofil</SelectItem><SelectItem value="hidden">Ej publicerad</SelectItem></SelectContent>
    </Select>
    <Select value={partner.information_status === 'verified' ? 'verified' : 'compiled'} disabled={disabled} onValueChange={v => onChange({ information_status: v, ...(v === 'verified' ? { information_verified_at: new Date().toISOString().slice(0, 10) } : {}) })}>
      <SelectTrigger aria-label="Verifiering"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="verified">Verifierad partner</SelectItem><SelectItem value="compiled">Ej verifierad</SelectItem></SelectContent>
    </Select>
    <div className="flex items-center gap-2">
      <SwedishDatePicker value={partner.information_verified_at?.slice(0, 10)} placeholder="Verifieringsdatum" onChange={value => { if (!disabled) onChange({ information_verified_at: value }); }} />
      <Button size="icon" variant="outline" disabled={disabled} title="Verifiera idag" aria-label="Verifiera idag" onClick={() => onChange({ information_status: 'verified', information_verified_at: new Date().toISOString().slice(0, 10) })}><BadgeCheck className="h-4 w-4" /></Button>
    </div>
  </div>;
}