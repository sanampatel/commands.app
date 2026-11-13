"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search, Star } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/tech-icon";
import { isEditableTarget } from "@/lib/keyboard";
import { createCommandSearch } from "@/lib/search";
import { loadSearchIndex } from "@/lib/search-index";
import type { SearchEntry, Technology } from "@/types";

const OPEN_EVENT = "commands-app:open-palette";

/** Open the global command palette from anywhere (e.g. a hero search button). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

interface CommandPaletteProps {
  technologies: Pick<Technology, "id" | "name">[];
}

export function CommandPalette({ technologies }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !isEditableTarget(e.target) && !document.querySelector("[data-local-search]")) {
        // Pages with their own search box (technology pages) handle "/" themselves.
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    loadSearchIndex()
      .then((data) => !cancelled && setIndex(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const techNames = useMemo(() => new Map(technologies.map((t) => [t.id, t.name])), [technologies]);

  const search = useMemo(
    () =>
      index &&
      createCommandSearch(
        index.map((e) => ({ ...e, technologyName: techNames.get(e.technologyId) ?? e.technologyId })),
        [
          { name: "name", weight: 0.45 },
          { name: "description", weight: 0.25 },
          { name: "keywords", weight: 0.15 },
          { name: "technologyName", weight: 0.1 },
          { name: "category", weight: 0.05 },
        ]
      ),
    [index, techNames]
  );

  const q = query.trim();
  const results = useMemo(() => (search && q ? search(q, 40) : []), [search, q]);
  const matchingTechs = useMemo(() => {
    const lower = q.toLowerCase();
    return q ? technologies.filter((t) => t.name.toLowerCase().includes(lower) || t.id.includes(lower)) : technologies;
  }, [q, technologies]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-muted-foreground h-9 w-9 justify-center gap-2 px-0 sm:w-56 sm:justify-start sm:px-3 lg:w-64"
        aria-label="Search commands"
      >
        <Search className="h-4 w-4" />
        <span className="hidden flex-1 text-left font-normal sm:inline">Search commands...</span>
        <kbd className="bg-muted pointer-events-none hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
        title="Search commands"
        description="Search every command across all technologies"
        className="sm:max-w-2xl"
        commandProps={{ shouldFilter: false, loop: true }}
      >
        <CommandInput
          placeholder="Search commands, e.g. 'undo commit', 'port forward', 'tar'..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[60vh]">
          {q && !index && !error && <div className="text-muted-foreground py-6 text-center text-sm">Loading…</div>}
          {error && (
            <div className="text-muted-foreground py-6 text-center text-sm">
              Couldn&apos;t load the search index. Check your connection and try again.
            </div>
          )}
          {index && <CommandEmpty>No commands found for &ldquo;{q}&rdquo;.</CommandEmpty>}

          {results.length > 0 && (
            <CommandGroup heading="Commands">
              {results.map((cmd) => (
                <CommandItem
                  key={`${cmd.technologyId}/${cmd.id}`}
                  value={`${cmd.technologyId}/${cmd.id}`}
                  onSelect={() => go(`/${cmd.technologyId}/${cmd.id}`)}
                  className="items-start"
                >
                  <TechIcon name={cmd.technologyId} className="mt-0.5 h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-sm font-medium">{cmd.name}</div>
                    <div className="text-muted-foreground truncate text-xs">{cmd.description}</div>
                  </div>
                  <span className="text-muted-foreground hidden shrink-0 text-xs sm:inline">
                    {techNames.get(cmd.technologyId)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {matchingTechs.length > 0 && (
            <CommandGroup heading="Technologies">
              {matchingTechs.map((tech) => (
                <CommandItem key={tech.id} value={`tech:${tech.id}`} onSelect={() => go(`/${tech.id}`)}>
                  <TechIcon name={tech.id} className="h-5 w-5" />
                  {tech.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!q && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Pages">
                <CommandItem value="page:favorites" onSelect={() => go("/favorites")}>
                  <Star /> Favorites
                </CommandItem>
                <CommandItem value="page:compare" onSelect={() => go("/compare")}>
                  <ArrowLeftRight /> Compare commands
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
