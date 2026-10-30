import { useState, type ReactNode } from "react";
import { Mail, Phone } from "lucide-react";

interface Props {
  kind: "email" | "phone";
  value: string;
  /** Visad text efter klick, t.ex. formaterat telefonnummer. Standard är värdet. */
  display?: string;
  className?: string;
  /** Ersätter standardikonen. Null döljer ikonen. */
  icon?: ReactNode | null;
  onReveal?: () => void;
  onClick?: () => void;
}

/**
 * Partnerns e-post eller telefon visas först efter ett klick. Före klicket finns adressen varken
 * som text eller som mailto/tel-länk i sidans HTML, så enkla skrapor hittar ingenting.
 */
export default function ProtectedContact({ kind, value, display, className = "", icon, onReveal, onClick }: Props) {
  const [shown, setShown] = useState(false);
  const Icon = kind === "email" ? Mail : Phone;
  const iconEl = icon === undefined ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : icon;
  if (!value) return null;
  if (!shown) {
    return (
      <button
        type="button"
        onClick={() => { setShown(true); onReveal?.(); }}
        className={`inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm ${className}`}
      >
        {iconEl}
        {kind === "email" ? "Visa e-post" : "Visa telefonnummer"}
      </button>
    );
  }
  const href = kind === "email" ? `mailto:${value}` : `tel:${value.replace(/[^+\d]/g, "")}`;
  return (
    <a href={href} onClick={onClick} className={`inline-flex items-center gap-1.5 underline underline-offset-4 break-all ${className}`}>
      {iconEl}
      {display ?? value}
    </a>
  );
}
