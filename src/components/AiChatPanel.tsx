import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Loader2, Send, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiChat, type ChatMsg } from "@/hooks/useAiChat";
import { useTrackFilterExposure } from "@/hooks/useTrackFilterExposure";

interface Props {
  suggestions?: string[];
  className?: string;
  compact?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  "Vad är skillnaden mellan Business Central och Finance & SCM?",
  "Hur kommer jag igång med Copilot i Sales?",
  "Hjälp mig hitta rätt partner",
  "Vad kostar Dynamics 365 Customer Service?",
];

export default function AiChatPanel({ suggestions = DEFAULT_SUGGESTIONS, className = "", compact = false }: Props) {
  const { messages, loading, error, send, reset } = useAiChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = inputRef.current?.value || "";
    if (!v.trim()) return;
    send(v);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={scrollRef} className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 ${compact ? "max-h-[420px]" : ""}`}>
        {messages.length === 0 && !loading && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Hej! Jag är d365.se:s AI-assistent. Fråga mig om Microsoft Dynamics 365, AI, partners eller hur du kommer igång.
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent hover:border-primary/40 transition text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: ChatMsg, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-a:text-primary prose-a:underline">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => {
                        const isInternal = href?.startsWith("/");
                        return isInternal ? (
                          <Link to={href!} className="text-primary underline hover:no-underline">
                            {children}
                          </Link>
                        ) : (
                          <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                        );
                      },
                    }}
                  >
                    {m.content || "…"}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{m.content}</span>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-3.5 py-2.5 text-sm flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> tänker...
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-border p-3 bg-background">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Skriv din fråga..."
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e as any);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={loading} aria-label="Skicka">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
          {messages.length > 0 && (
            <Button type="button" variant="ghost" size="icon" onClick={reset} aria-label="Rensa" title="Rensa konversation">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI-genererat – kan innehålla fel. Vid viktiga beslut, kontakta en rådgivare.
        </p>
      </form>
    </div>
  );
}
