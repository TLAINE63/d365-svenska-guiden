import { BadgeCheck } from "lucide-react";

interface VerifiedOnlyToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  /** Optional count shown after the label, e.g. antal verifierade partners */
  count?: number;
}

/**
 * Gemensam filterknapp för listvyer: visa endast verifierade partners
 * (dvs. publicerade partners med komplett, verifierad profil).
 */
export default function VerifiedOnlyToggle({
  checked,
  onChange,
  className = "",
  count,
}: VerifiedOnlyToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground hover:border-accent/50"
      } ${className}`}
    >
      <BadgeCheck className="h-4 w-4" aria-hidden="true" />
      <span>Endast verifierade partners</span>
      {typeof count === "number" && (
        <span className={checked ? "opacity-80" : "text-muted-foreground"}>({count})</span>
      )}
    </button>
  );
}
