"use client";

import { Search } from "lucide-react";
import { openCommandPalette } from "@/components/command-palette";

export function HeroSearch({ commandCount }: { commandCount: number }) {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className="bg-background hover:border-foreground/30 text-muted-foreground focus-visible:ring-ring/50 mx-auto flex h-12 w-full max-w-xl items-center gap-3 rounded-xl border px-4 text-left shadow-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
    >
      <Search className="h-5 w-5 shrink-0" />
      <span className="flex-1 truncate">Search {commandCount.toLocaleString("en-US")} commands…</span>
      <kbd className="bg-muted hidden rounded border px-1.5 py-0.5 font-mono text-xs sm:inline">⌘K</kbd>
    </button>
  );
}
