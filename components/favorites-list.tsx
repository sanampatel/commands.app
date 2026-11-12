"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/tech-icon";
import { favoriteKey, useFavorites } from "@/lib/favorites";
import { loadSearchIndex } from "@/lib/search-index";
import type { SearchEntry, Technology } from "@/types";

export function FavoritesList({ technologies }: { technologies: Pick<Technology, "id" | "name">[] }) {
  const { favorites, isFavorite, toggleFavorite, clearFavorites } = useFavorites();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadSearchIndex()
      .then(setIndex)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(() => {
    if (!index) return [];
    const starred = index.filter((c) => isFavorite(c.technologyId, c.id));
    return technologies
      .map((tech) => ({ tech, commands: starred.filter((c) => c.technologyId === tech.id) }))
      .filter((g) => g.commands.length > 0);
  }, [index, isFavorite, technologies]);

  if (error) {
    return <p className="text-muted-foreground">Couldn&apos;t load commands. Please refresh the page.</p>;
  }
  if (!index) {
    return <div className="bg-muted h-32 animate-pulse rounded-xl" aria-label="Loading favorites" />;
  }

  if (grouped.length === 0) {
    return (
      <div className="space-y-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <Star className="text-muted-foreground mx-auto h-8 w-8" />
        <p className="font-medium">No favorites yet</p>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          Click the star on any command to save it here for quick access.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/#technologies">Browse technologies</Link>
        </Button>
      </div>
    );
  }

  const total = grouped.reduce((n, g) => n + g.commands.length, 0);

  return (
    <div className="space-y-8">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          {total} starred {total === 1 ? "command" : "commands"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm(`Remove all ${favorites.length} favorites?`)) clearFavorites();
          }}
        >
          <Trash2 className="h-4 w-4" /> Clear all
        </Button>
      </div>
      {grouped.map(({ tech, commands }) => (
        <section key={tech.id} className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TechIcon name={tech.id} className="h-5 w-5" />
            <Link href={`/${tech.id}`} className="hover:underline">
              {tech.name}
            </Link>
          </h2>
          <ul className="divide-y rounded-xl border">
            {commands.map((cmd) => (
              <li key={favoriteKey(tech.id, cmd.id)} className="flex items-center gap-3 p-3">
                <Link href={`/${tech.id}/${cmd.id}`} className="min-w-0 flex-1 hover:underline">
                  <div className="font-mono text-sm font-medium">{cmd.name}</div>
                  <div className="text-muted-foreground truncate text-xs">{cmd.description}</div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleFavorite(tech.id, cmd.id)}
                  aria-label={`Remove ${cmd.name} from favorites`}
                  title="Remove from favorites"
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
