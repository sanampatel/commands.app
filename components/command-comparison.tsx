"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Plus, Search, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/copy-button";
import { CommandText } from "@/components/command-text";
import { TechIcon } from "@/components/tech-icon";
import { loadSearchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";
import { createCommandSearch } from "@/lib/search";
import type { Command, SearchEntry, Technology } from "@/types";

const MAX_SELECTED = 3;

// Full command data is fetched per technology, only for technologies the user picks from.
const techCache = new Map<string, Promise<Command[]>>();
function loadTechnology(id: string) {
  let p = techCache.get(id);
  if (!p) {
    p = fetch(`/data/${id}`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${id}`);
      return r.json() as Promise<Command[]>;
    });
    p.catch(() => techCache.delete(id));
    techCache.set(id, p);
  }
  return p;
}

async function loadCommand(key: string): Promise<Command | undefined> {
  const [tech, id] = key.split("/");
  if (!tech || !id) return undefined;
  const list = await loadTechnology(tech);
  return list.find((c) => c.id === id);
}

const keyOf = (c: { technologyId: string; id: string }) => `${c.technologyId}/${c.id}`;

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

interface CommandComparisonProps {
  technologies: Pick<Technology, "id" | "name">[];
}

export function CommandComparison({ technologies }: CommandComparisonProps) {
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [selected, setSelected] = useState<Command[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("all");
  const [loadError, setLoadError] = useState(false);

  // Load the search index, then restore any comparison from ?c=tech/id,tech/id.
  useEffect(() => {
    let cancelled = false;
    loadSearchIndex()
      .then(async (data) => {
        if (cancelled) return;
        setIndex(data);
        const keys = (new URLSearchParams(window.location.search).get("c") ?? "")
          .split(",")
          .filter(Boolean)
          .slice(0, MAX_SELECTED);
        const restored = (await Promise.all(keys.map(loadCommand))).filter((c) => c !== undefined);
        if (!cancelled && restored.length) setSelected(restored);
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the URL shareable.
  useEffect(() => {
    if (!index) return;
    // Ids are kebab-case, so the readable "?c=git/git-merge,git/git-rebase" form needs no encoding.
    const search = selected.length ? `?c=${selected.map(keyOf).join(",")}` : "";
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}`);
  }, [selected, index]);

  const techNames = useMemo(() => new Map(technologies.map((t) => [t.id, t.name])), [technologies]);

  const scoped = useMemo(
    () => (index ?? []).filter((c) => selectedTechnology === "all" || c.technologyId === selectedTechnology),
    [index, selectedTechnology]
  );
  const search = useMemo(
    () =>
      createCommandSearch(scoped, [
        { name: "name", weight: 0.5 },
        { name: "description", weight: 0.25 },
        { name: "keywords", weight: 0.2 },
        { name: "category", weight: 0.05 },
      ]),
    [scoped]
  );

  const results = useMemo(() => {
    const q = searchQuery.trim();
    const selectedKeys = new Set(selected.map(keyOf));
    const list = q ? search(q, 30) : [];
    return list.filter((c) => !selectedKeys.has(keyOf(c))).slice(0, 10);
  }, [search, searchQuery, selected]);

  const addCommand = useCallback(
    async (entry: SearchEntry) => {
      setSearchQuery("");
      try {
        const cmd = await loadCommand(keyOf(entry));
        if (cmd)
          setSelected((prev) =>
            prev.length >= MAX_SELECTED || prev.some((p) => keyOf(p) === keyOf(cmd)) ? prev : [...prev, cmd]
          );
      } catch {
        setLoadError(true);
      }
    },
    []
  );

  const removeCommand = (key: string) => setSelected((prev) => prev.filter((c) => keyOf(c) !== key));

  const rows: { label: string; render: (c: Command) => React.ReactNode }[] = [
    {
      label: "Technology",
      render: (c) => (
        <span className="flex items-center gap-2">
          <TechIcon name={c.technologyId} className="h-4 w-4" />
          {techNames.get(c.technologyId) ?? c.technologyId}
        </span>
      ),
    },
    { label: "Category", render: (c) => c.category },
    { label: "Flags", render: (c) => c.flags?.length ?? 0 },
    { label: "Examples", render: (c) => c.examples.length },
    { label: "Related commands", render: (c) => c.relatedCommands?.length ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Select commands
          </CardTitle>
          <CardDescription>
            {selected.length}/{MAX_SELECTED} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex min-h-10 flex-wrap gap-2">
            {selected.map((cmd) => (
              <Badge key={keyOf(cmd)} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <TechIcon name={cmd.technologyId} className="h-4 w-4" />
                <span className="font-mono">{cmd.name}</span>
                <button
                  type="button"
                  onClick={() => removeCommand(keyOf(cmd))}
                  className="hover:text-destructive ml-1 rounded-sm"
                  aria-label={`Remove ${cmd.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
            {selected.length === 0 && (
              <p className="text-muted-foreground text-sm">No commands selected yet. Search below to add some.</p>
            )}
          </div>

          {loadError && (
            <p className="text-destructive text-sm">Couldn&apos;t load command data. Please refresh and try again.</p>
          )}

          {selected.length < MAX_SELECTED && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by technology">
                  <SelectValue placeholder="All technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All technologies</SelectItem>
                  {technologies.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex items-center gap-2">
                        <TechIcon name={tech.id} className="h-4 w-4" />
                        {tech.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder={index ? "Search commands to add…" : "Loading commands…"}
                  aria-label="Search commands to add"
                  disabled={!index}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && results[0]) {
                      e.preventDefault();
                      addCommand(results[0]);
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {searchQuery.trim() && selected.length < MAX_SELECTED && (
            <ul className="max-h-72 overflow-y-auto rounded-lg border">
              {results.length === 0 ? (
                <li className="text-muted-foreground p-4 text-center text-sm">No commands found</li>
              ) : (
                results.map((cmd) => (
                  <li key={keyOf(cmd)} className="border-b last:border-b-0">
                    <button
                      type="button"
                      onClick={() => addCommand(cmd)}
                      className="hover:bg-muted focus-visible:bg-muted flex w-full items-center justify-between gap-3 p-3 text-left focus-visible:outline-none"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <TechIcon name={cmd.technologyId} className="h-5 w-5" />
                        <span className="min-w-0">
                          <span className="font-mono font-medium">{cmd.name}</span>
                          <span className="text-muted-foreground block truncate text-sm">{cmd.description}</span>
                        </span>
                      </span>
                      <Plus className="text-muted-foreground h-4 w-4 shrink-0" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </CardContent>
      </Card>

      {selected.length === 1 && (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground py-12 text-center">
            Add at least one more command to start comparing.
          </CardContent>
        </Card>
      )}

      {selected.length >= 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Comparison</h2>

          <div className={cn("grid gap-6", selected.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
            {selected.map((cmd) => (
              <Card key={keyOf(cmd)} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TechIcon name={cmd.technologyId} className="h-4 w-4" />
                      {techNames.get(cmd.technologyId)}
                    </Badge>
                    <Badge variant="secondary">{cmd.category}</Badge>
                  </div>
                  <CardTitle className="mt-2 font-mono text-xl">
                    <Link href={`/${cmd.technologyId}/${cmd.id}`} className="hover:underline">
                      {cmd.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>{cmd.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {cmd.examples[0] && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">Example</h3>
                      <div className="bg-muted flex items-start gap-2 rounded-md py-1 pr-1 pl-3">
                        <code className="min-w-0 flex-1 py-1.5 font-mono text-sm whitespace-pre-wrap">
                          <CommandText text={cmd.examples[0].command} />
                        </code>
                        <CopyButton text={cmd.examples[0].command} iconOnly />
                      </div>
                    </div>
                  )}

                  {cmd.flags && cmd.flags.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">Flags ({cmd.flags.length})</h3>
                      <ul className="space-y-1.5">
                        {cmd.flags.slice(0, 6).map((flag, i) => (
                          <li key={i} className="text-sm">
                            <code className="bg-muted rounded px-1 font-mono">{flag.flag}</code>
                            <span className="text-muted-foreground ml-2 text-xs">{truncate(flag.description, 70)}</span>
                          </li>
                        ))}
                      </ul>
                      {cmd.flags.length > 6 && (
                        <Link
                          href={`/${cmd.technologyId}/${cmd.id}`}
                          className="text-muted-foreground hover:text-foreground mt-1 inline-block text-xs"
                        >
                          +{cmd.flags.length - 6} more flags
                        </Link>
                      )}
                    </div>
                  )}

                  {cmd.notes && cmd.notes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">Notes</h3>
                      <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                        {cmd.notes.slice(0, 3).map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>At a glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th scope="col" className="px-4 py-3 text-left font-medium">
                        <span className="sr-only">Attribute</span>
                      </th>
                      {selected.map((cmd) => (
                        <th key={keyOf(cmd)} scope="col" className="px-4 py-3 text-left font-mono">
                          {cmd.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label} className="border-b last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-left font-medium">
                          {row.label}
                        </th>
                        {selected.map((cmd) => (
                          <td key={keyOf(cmd)} className="px-4 py-3">
                            {row.render(cmd)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
