import type { Metadata } from "next";
import { CommandComparison } from "@/components/command-comparison";
import { technologies } from "@/data";

export const metadata: Metadata = {
  title: "Compare Commands",
  description: "Compare up to three commands side by side, across any technology.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="container py-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compare Commands</h1>
          <p className="text-muted-foreground text-lg">
            Pick up to three commands, e.g. <code className="font-mono">git merge</code> vs{" "}
            <code className="font-mono">git rebase</code>, or <code className="font-mono">npm ci</code> vs{" "}
            <code className="font-mono">pnpm install</code>. The URL updates so you can share the comparison.
          </p>
        </header>
        <CommandComparison technologies={technologies.map(({ id, name }) => ({ id, name }))} />
      </div>
    </div>
  );
}
