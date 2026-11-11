import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOWNLOAD_CONSENT_LABEL, type DownloadConsent } from "@/lib/downloadConsent";

interface Props {
  value: DownloadConsent;
  onChange: (v: DownloadConsent) => void;
  /** Visa namnfält när rutan är ikryssad (formulär som inte redan frågar efter namn). */
  askName?: boolean;
  /** Visa företagsfält när rutan är ikryssad (formulär som inte redan frågar efter företag). */
  askCompany?: boolean;
  /** Ljus text för mörka kort. */
  dark?: boolean;
  idPrefix: string;
  disabled?: boolean;
}

/** Frivillig, aldrig förkryssad kontaktönskan under e-postfältet i nedladdningsformulär. */
export default function DownloadContactOptIn({ value, onChange, askName, askCompany, dark, idPrefix, disabled }: Props) {
  const muted = dark ? "text-white/60" : "text-muted-foreground";
  const text = dark ? "text-white/90" : "text-foreground";
  const field = dark ? "bg-white text-foreground placeholder:text-muted-foreground border-white/20" : "";
  const set = (p: Partial<DownloadConsent>) => onChange({ ...value, ...p });
  return (
    <div className="space-y-2 text-left">
      <div className="flex items-start gap-2">
        <Checkbox
          id={`${idPrefix}-consent`}
          checked={value.consent}
          onCheckedChange={(c) => set({ consent: c === true })}
          disabled={disabled}
          className={`mt-0.5 ${dark ? "border-white/70 data-[state=checked]:bg-white data-[state=checked]:text-foreground" : ""}`}
        />
        <Label htmlFor={`${idPrefix}-consent`} className={`text-sm font-normal leading-snug cursor-pointer ${text}`}>
          {DOWNLOAD_CONSENT_LABEL}
        </Label>
      </div>
      <p className={`text-[11px] ${muted}`}>
        Utan kryss använder vi bara adressen för att skicka underlaget. Läs mer i{" "}
        <Link to="/dataskydd/" className="underline">integritetspolicyn</Link>.
      </p>
      {value.consent && (
        <div className="grid gap-2 sm:grid-cols-2">
          {askName && (
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-name`} className={`text-xs ${text}`}>Namn *</Label>
              <Input id={`${idPrefix}-name`} autoComplete="name" required maxLength={100} value={value.name} onChange={(e) => set({ name: e.target.value })} disabled={disabled} className={field} />
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-phone`} className={`text-xs ${text}`}>Telefon (frivilligt)</Label>
            <Input id={`${idPrefix}-phone`} type="tel" autoComplete="tel" maxLength={20} value={value.phone} onChange={(e) => set({ phone: e.target.value })} disabled={disabled} className={field} />
          </div>
          {askCompany && (
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-company`} className={`text-xs ${text}`}>Företag (frivilligt)</Label>
              <Input id={`${idPrefix}-company`} autoComplete="organization" maxLength={100} value={value.company} onChange={(e) => set({ company: e.target.value })} disabled={disabled} className={field} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
