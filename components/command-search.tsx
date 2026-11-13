"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { useFavorites } from "@/lib/favorites";
import { isEditableTarget } from "@/lib/keyboard";
import { createCommandSearch } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Command } from "@/types";

interface CommandSearchProps {
  commands: Command[];
  technologyId: string;
  technologyName: string;
}

/** Read ?q= and ?category= once on mount so filtered views are shareable. */
function readUrlState() {
  if (typeof window === "undefined") return { q: "", category: "all" };
  const params = new URLSearchParams(window.location.search);
  return { q: params.get("q") ?? "", category: params.get("category") ?? "all" };
}

export function CommandSearch({ commands, technologyId, technologyName }: CommandSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  // Restore filters from the URL after hydration (keeps the page statically renderable).
  useEffect(() => {
    const { q, category } = readUrlState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
    if (q) setSearchQuery(q);
    if (category !== "all") setSelectedCategory(category);
    hydrated.current = true;
  }, []);

  // Mirror filters into the URL without adding history entries.
  useEffect(() => {
    if (!hydrated.current) return;
    const url = new URL(window.location.href);
    if (searchQuery.trim()) url.searchParams.set("q", searchQuery);
    else url.searchParams.delete("q");
    if (selectedCategory !== "all") url.searchParams.set("category", selectedCategory);
    else url.searchParams.delete("category");
    window.history.replaceState(window.history.state, "", url);
  }, [searchQuery, selectedCategory]);

  // "/" focuses this page's search box.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !isEditableTarget(e.target)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cmd of commands) counts.set(cmd.category, (counts.get(cmd.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [commands]);

  const search = useMemo(
    () =>
      createCommandSearch(commands, [
        { name: "name", weight: 0.4 },
        { name: "description", weight: 0.25 },
        { name: "examples.description", weight: 0.15 },
        { name: "examples.command", weight: 0.1 },
        { name: "flags.flag", weight: 0.05 },
        { name: "category", weight: 0.05 },
      ]),
    [commands]
  );

  const filteredCommands = useMemo(() => {
    const results = searchQuery.trim() ? search(searchQuery) : commands;
    return results.filter(
      (command) =>
        (selectedCategory === "all" || command.category === selectedCategory) &&
        (!showFavoritesOnly || isFavorite(technologyId, command.id))
    );
  }, [commands, searchQuery, selectedCategory, showFavoritesOnly, isFavorite, technologyId, search]);

  const hasFilters = searchQuery.trim() !== "" || selectedCategory !== "all" || showFavoritesOnly;
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowFavoritesOnly(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={searchInputRef}
            data-local-search
            type="search"
            placeholder={`Search ${technologyName} commands…`}
            aria-label={`Search ${technologyName} commands`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                if (searchQuery) setSearchQuery("");
                else e.currentTarget.blur();
              }
            }}
            className="h-10 pr-10 pl-10"
          />
          <kbd className="bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border px-1.5 font-mono text-xs sm:block">
            /
          </kbd>
        </div>
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          className="h-10"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          aria-pressed={showFavoritesOnly}
          title={showFavoritesOnly ? "Show all commands" : "Show favorites only"}
        >
          <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
          <span className="hidden sm:inline">Favorites</span>
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {[["all", commands.length] as const, ...categories].map(([category, count]) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={active}
              className={cn(
                "focus-visible:ring-ring/50 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {category === "all" ? "All" : category}
              <span className={cn("text-xs tabular-nums", active ? "opacity-80" : "opacity-60")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="text-muted-foreground flex items-center justify-between text-sm" aria-live="polite">
        <span>
          {filteredCommands.length} {filteredCommands.length === 1 ? "command" : "commands"}
          {hasFilters && " found"}
        </span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" /> Clear filters
          </Button>
        )}
      </div>

      {/* Command List */}
      {filteredCommands.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-dashed py-12 text-center">
          <p className="text-muted-foreground">
            {showFavoritesOnly && !searchQuery
              ? "You haven't starred any commands here yet. Click the ☆ on a command to save it."
              : "No commands match your search."}
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {filteredCommands.map((command) => {
            const starred = isFavorite(technologyId, command.id);
            const example = command.examples[0];
            return (
              <li
                key={command.id}
                className="group bg-card min-w-0 hover:border-foreground/20 focus-within:border-foreground/30 relative rounded-xl border p-4 transition-colors hover:shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono text-base font-semibold [overflow-wrap:anywhere] sm:text-lg">
                      {/* The ::after overlay makes the whole card clickable without nesting buttons in a link. */}
                      <Link
                        href={`/${technologyId}/${command.id}`}
                        className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
                      >
                        {command.name}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">{command.description}</p>
                  </div>
                  <div className="relative z-10 flex shrink-0 items-center gap-1">
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {command.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toggleFavorite(technologyId, command.id)}
                      aria-pressed={starred}
                      aria-label={starred ? `Remove ${command.name} from favorites` : `Add ${command.name} to favorites`}
                      title={starred ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        className={cn("h-4 w-4", starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")}
                      />
                    </Button>
                  </div>
                </div>
                {example && (
                  <div className="bg-muted relative z-10 mt-3 flex items-center gap-2 rounded-md py-1.5 pr-1.5 pl-3">
                    <code className="min-w-0 flex-1 font-mono text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">{example.command}</code>
                    <CopyButton text={example.command} iconOnly />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
