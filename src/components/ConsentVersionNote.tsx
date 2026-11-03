import { CONSENT_TEXT_VERSION } from "@/lib/sessionPages";

/** Liten rad vid samtyckestexten: vilken version av texten som visades. */
export default function ConsentVersionNote({ className = "" }: { className?: string }) {
  return <p className={`text-[11px] text-muted-foreground ${className}`}>Samtyckestext version {CONSENT_TEXT_VERSION}</p>;
}
