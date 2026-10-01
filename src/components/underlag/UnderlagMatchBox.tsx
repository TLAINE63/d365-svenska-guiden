import { matchPartnerToProfile, type CompareFilters, type MatchStatus } from "@/lib/underlag";

const GROUPS: { status: MatchStatus; title: string; mark: string; cls: string }[] = [
  { status: "documented", title: "Dokumenterat", mark: "✓", cls: "text-accent" },
  { status: "unverified", title: "Ej verifierat", mark: "?", cls: "text-amber-600 dark:text-amber-400" },
  { status: "missing", title: "Saknas i partnerdata", mark: "–", cls: "text-muted-foreground" },
];

/** "Så matchar partnern ert underlag" – tre grupper, ingen poäng eller sortering. */
export default function UnderlagMatchBox({ partner, filters }: { partner: Parameters<typeof matchPartnerToProfile>[0]; filters: CompareFilters }) {
  const items = matchPartnerToProfile(partner, filters);
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
      <p className="font-semibold text-foreground mb-2">Så matchar partnern ert underlag</p>
      <div className="space-y-2">
        {GROUPS.map((g) => {
          const list = items.filter((i) => i.status === g.status);
          if (!list.length) return null;
          return (
            <div key={g.status}>
              <p className={`font-medium ${g.cls}`}>
                {g.mark} {g.title}
              </p>
              <ul className="mt-0.5 space-y-0.5 text-foreground/85">
                {list.map((i) => (
                  <li key={i.label} className="break-words">{i.label}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Uppgifter som saknas eller inte är verifierade bör kontrolleras med partnern.</p>
    </div>
  );
}
