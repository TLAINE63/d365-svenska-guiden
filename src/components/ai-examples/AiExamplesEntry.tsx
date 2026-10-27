import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackAi } from "@/lib/aiLibraryTracking";

/** Gemensam ingång till AI-exempelbiblioteket. `apps` filtrerar biblioteket via befintliga URL-filter. */
const AiExamplesEntry = ({ apps = [], label, source }: { apps?: string[]; label?: string; source: string }) => {
  const to = apps.length ? `/ai/exempel/?app=${apps.join(",")}#exempel` : "/ai/exempel/";
  return (
    <section className="container mx-auto max-w-6xl px-4 py-10" aria-labelledby={`ai-entry-${source}`}>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" aria-hidden /> Ett nytt sätt att arbeta
          </p>
          <h2 id={`ai-entry-${source}`} className="mt-2 text-xl font-bold text-foreground">
            {label ?? <>Se hur AI förändrar arbetet i Dynamics&nbsp;365</>}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Se konkreta exempel på hur AI, Copilot och agenter förändrar arbetet i Dynamics&nbsp;365.
          </p>
        </div>
        <Link
          to={to}
          onClick={() => trackAi("ai_library_entry_click", null, { source_page: source, application: apps.join(","), cta_destination: to })}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Se konkreta exempel <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
};

export default AiExamplesEntry;
