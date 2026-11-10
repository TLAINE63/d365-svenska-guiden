import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentInviteData } from "@/components/ContentInviteProvider";
import { contentThemeForPath, resolveContentInvite } from "@/lib/contentInvite";

const CLOSED_KEY = "d365_invite_closed";

export default function ContentInvite() {
  const { pathname } = useLocation();
  const data = useContentInviteData();
  const [closed, setClosed] = useState(false);
  const theme = contentThemeForPath(pathname);
  const invite = useMemo(() => theme ? resolveContentInvite(theme, data) : null, [theme, data]);

  useEffect(() => {
    try {
      setClosed(window.sessionStorage.getItem(CLOSED_KEY) === "1");
    } catch {
      setClosed(false);
    }
  }, [pathname]);

  if (!invite || closed) return null;
  const isExternal = /^https?:\/\//.test(invite.href);
  const close = () => {
    setClosed(true);
    try { window.sessionStorage.setItem(CLOSED_KEY, "1"); } catch { /* no storage */ }
  };

  return (
    <aside aria-label="Aktuell inbjudan" className="border-y border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-5">
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pr-8">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{invite.kind === "webinar" ? "Kommande webinar" : "Läs vidare"}</p>
            <h2 className="text-lg font-bold text-card-foreground">{invite.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{invite.sentence}</p>
          </div>
          <Button asChild className="shrink-0 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]">
            {isExternal ? <a href={invite.href} target="_blank" rel="noopener noreferrer">{invite.cta}</a> : <Link to={invite.href}>{invite.cta}</Link>}
          </Button>
          <button type="button" onClick={close} aria-label="Stäng inbjudan" className="absolute right-0 top-0 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
