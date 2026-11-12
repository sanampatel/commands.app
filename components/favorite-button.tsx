"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({ technologyId, commandId, name }: { technologyId: string; commandId: string; name: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const starred = isFavorite(technologyId, commandId);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toggleFavorite(technologyId, commandId)}
      aria-pressed={starred}
      aria-label={starred ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
    >
      <Star className={cn("h-4 w-4", starred && "fill-yellow-400 text-yellow-400")} />
      {starred ? "Starred" : "Star"}
    </Button>
  );
}
