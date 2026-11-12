import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";
import { technologies } from "@/data";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your starred commands across every technology.",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="container py-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Favorites</h1>
          <p className="text-muted-foreground text-lg">
            Commands you&apos;ve starred, across every technology. Saved in this browser only.
          </p>
        </header>
        <FavoritesList technologies={technologies.map(({ id, name }) => ({ id, name }))} />
      </div>
    </div>
  );
}
