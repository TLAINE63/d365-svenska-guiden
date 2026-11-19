import { Link } from "react-router-dom";
import { exampleBySlug, isPreviewExample } from "@/lib/erpAiGuidance";

/** Länkar till verifierade AI-exempel, med förhandsversion markerad. */
export default function ExampleLinks({ slugs }: { slugs: readonly string[] }) {
  const list = slugs.map(exampleBySlug).filter(Boolean);
  if (!list.length) return null;
  return (
    <ul className="mt-3 space-y-1.5 text-sm">
      {list.map((e) => (
        <li key={e!.slug}>
          <Link to={`/ai/exempel/${e!.slug}/`} className="font-medium text-primary hover:underline">{e!.title}</Link>
          {isPreviewExample(e!) && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Förhandsversion</span>}
        </li>
      ))}
    </ul>
  );
}
