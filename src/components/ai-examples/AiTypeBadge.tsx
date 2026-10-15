import { Bot, MessageSquare, Plug, Sparkles, Wand2 } from "lucide-react";
import { AI_TYPES, AiType } from "@/data/aiExamples";

const ICON: Record<AiType, typeof Bot> = {
  "copilot-chat": MessageSquare,
  copilot: Sparkles,
  inbyggd: Wand2,
  agent: Bot,
  mcp: Plug,
};

/** Diskret badge som skiljer på typer av AI-funktion (ikon + text, aldrig bara färg). */
const AiTypeBadge = ({ type, className = "" }: { type: AiType; className?: string }) => {
  const Icon = ICON[type];
  return (
    <span title={AI_TYPES[type].text} className={`inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground ${className}`}>
      <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
      {AI_TYPES[type].label}
    </span>
  );
};

export default AiTypeBadge;
