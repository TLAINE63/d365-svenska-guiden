import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AiExample, getApplication, getCategory } from "@/data/aiExamples";
import AiTypeBadge from "./AiTypeBadge";

const AiExampleCard = ({ example }: { example: AiExample }) => {
  const app = getApplication(example.application);
  return (
    <Link
      to={`/ai/exempel/${example.slug}/`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <h3 className="text-lg font-semibold leading-snug text-foreground">{example.title}</h3>
      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <img src={app.icon} alt="" className="h-4 w-4" loading="lazy" />
        <span className="whitespace-nowrap">{app.label}</span>
      </p>
      <p className="mt-3 flex-1 text-sm text-muted-foreground">{example.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">{getCategory(example.category).label}</span>
        <AiTypeBadge type={example.aiType} />
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Se hur det fungerar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
};

export default AiExampleCard;
