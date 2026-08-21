import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useD365Videos, type D365Video } from "@/hooks/useD365Videos";
import D365VideoCard from "@/components/D365VideoCard";
import D365VideoPlayerDialog from "@/components/D365VideoPlayerDialog";

interface Props {
  productGroups: string[];
  title?: string;
  description?: string;
  limit?: number;
}

export default function RelevantVideosSection({
  productGroups,
  title = "Videor om produkten",
  description = "Utvalda videor från Microsofts officiella kanaler, grupperade automatiskt per frågeställning.",
  limit = 4,
}: Props) {
  const { videos, loading } = useD365Videos(200);
  const [active, setActive] = useState<D365Video | null>(null);

  const relevant = useMemo(
    () =>
      videos
        .filter((v) => v.product_groups?.some((g) => productGroups.includes(g)))
        .slice(0, limit),
    [videos, productGroups, limit],
  );

  if (loading || relevant.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/kunskapscenter/videor">
              Till videobiblioteket <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relevant.map((v) => (
            <D365VideoCard key={v.id} video={v} onPlay={setActive} />
          ))}
        </div>
      </div>
      <D365VideoPlayerDialog video={active} onOpenChange={(o) => !o && setActive(null)} />
    </section>
  );
}
