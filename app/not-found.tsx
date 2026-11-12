import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-muted-foreground font-mono text-sm">bash: command not found</p>
      <h1 className="text-4xl font-bold tracking-tight">404 — Page not found</h1>
      <p className="text-muted-foreground max-w-md">
        That page doesn&apos;t exist. Try the search (⌘K) or head back to the list of technologies.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
