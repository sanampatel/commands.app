import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ChevronLeft, ChevronRight, Info, Pencil } from "lucide-react";
import { commands, getCommand, getCommandsByTechnology, getTechnology } from "@/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { CommandText } from "@/components/command-text";
import { ExportButtons } from "@/components/export-buttons";
import { FavoriteButton } from "@/components/favorite-button";
import { TechIcon } from "@/components/tech-icon";
import { editOnGitHubUrl, newIssueUrl, siteConfig } from "@/lib/site";

interface CommandPageProps {
  params: Promise<{ technology: string; command: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return commands.map((cmd) => ({ technology: cmd.technologyId, command: cmd.id }));
}

export async function generateMetadata({ params }: CommandPageProps): Promise<Metadata> {
  const { technology, command } = await params;
  const cmd = getCommand(technology, command);
  const tech = getTechnology(technology);
  if (!cmd || !tech) return { title: "Not Found" };

  const title = `${cmd.name} – ${tech.name}`;
  const url = `/${tech.id}/${cmd.id}`;
  return {
    title,
    description: cmd.description,
    alternates: { canonical: url },
    openGraph: { title, description: cmd.description, url, type: "article" },
  };
}

const WARNING_PATTERN = /^(warning|danger|caution)\b[:\s-]*/i;

export default async function CommandPage({ params }: CommandPageProps) {
  const { technology, command } = await params;
  const cmd = getCommand(technology, command);
  const tech = getTechnology(technology);
  if (!cmd || !tech) notFound();

  const siblings = getCommandsByTechnology(tech.id);
  const position = siblings.findIndex((c) => c.id === cmd.id);
  const prev = position > 0 ? siblings[position - 1] : undefined;
  const next = position < siblings.length - 1 ? siblings[position + 1] : undefined;

  const relatedCommands = (cmd.relatedCommands ?? [])
    .map((id) => getCommand(tech.id, id))
    .filter((c) => c !== undefined);

  const notes = (cmd.notes ?? []).map((note) => ({
    warning: WARNING_PATTERN.test(note),
    text: note.replace(WARNING_PATTERN, ""),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: tech.name, item: `${siteConfig.url}/${tech.id}` },
      { "@type": "ListItem", position: 3, name: cmd.name, item: `${siteConfig.url}/${tech.id}/${cmd.id}` },
    ],
  };

  return (
    <div className="container py-8 md:py-10">
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here apart from "<", which we escape to avoid closing the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article className="mx-auto max-w-4xl space-y-8 break-words">
        <nav aria-label="Breadcrumb" className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${tech.id}`} className="hover:text-foreground inline-flex items-center gap-1.5">
            <TechIcon name={tech.id} className="h-4 w-4" />
            {tech.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-mono" aria-current="page">
            {cmd.name}
          </span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-3">
              <Badge variant="secondary">{cmd.category}</Badge>
              <h1 className="font-mono text-3xl font-bold tracking-tight break-words sm:text-4xl">{cmd.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton technologyId={tech.id} commandId={cmd.id} name={cmd.name} />
              <ExportButtons command={cmd} technologyName={tech.name} />
            </div>
          </div>
          <p className="text-muted-foreground text-lg sm:text-xl">{cmd.description}</p>
        </header>

        {/* Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>Common usage, most useful first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cmd.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium">{example.description}</p>
                <div className="bg-muted flex items-start gap-2 rounded-lg py-2 pr-2 pl-4">
                  <pre className="min-w-0 flex-1 py-1.5 font-mono text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">
                    <code>
                      <CommandText text={example.command} />
                    </code>
                  </pre>
                  <CopyButton text={example.command} />
                </div>
                {example.output && (
                  <div className="rounded-lg bg-zinc-950 p-4 text-zinc-100">
                    <div className="mb-2 text-xs text-zinc-400">Output</div>
                    <pre className="overflow-x-auto font-mono text-sm">
                      <code>{example.output}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Flags/Options */}
        {cmd.flags && cmd.flags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Options &amp; Flags</CardTitle>
              <CardDescription>
                {cmd.flags.length} {cmd.flags.length === 1 ? "option" : "options"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                {cmd.flags.map((flag, index) => (
                  <div key={index} className="grid grid-cols-1 gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] sm:gap-4">
                    <dt>
                      <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold break-all">
                        {flag.flag}
                      </code>
                    </dt>
                    <dd className="space-y-2 text-sm">
                      <p>{flag.description}</p>
                      {flag.example && (
                        <div className="bg-muted/60 flex items-center gap-2 rounded-md py-1 pr-1 pl-3">
                          <code className="min-w-0 flex-1 font-mono text-xs whitespace-pre-wrap">
                            <CommandText text={flag.example} />
                          </code>
                          <CopyButton text={flag.example} iconOnly />
                        </div>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {notes.map((note, index) => (
                  <li
                    key={index}
                    className={
                      note.warning
                        ? "flex gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm"
                        : "text-muted-foreground flex gap-3 text-sm"
                    }
                  >
                    {note.warning ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span className="min-w-0 break-words">
                      {note.warning && <strong className="font-semibold">Warning: </strong>}
                      {note.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Related Commands */}
        {relatedCommands.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Related commands</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {relatedCommands.map((related) => (
                <Link
                  key={related.id}
                  href={`/${tech.id}/${related.id}`}
                  className="hover:bg-accent rounded-lg border p-3 transition-colors"
                >
                  <div className="font-mono text-sm font-medium">{related.name}</div>
                  <div className="text-muted-foreground line-clamp-1 text-xs">{related.description}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / next + contribution links */}
        <footer className="space-y-6 border-t pt-6">
          <nav aria-label="Adjacent commands" className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/${tech.id}/${prev.id}`} className="hover:bg-accent group rounded-lg border p-3 transition-colors">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <ChevronLeft className="h-3 w-3" /> Previous
                </div>
                <div className="font-mono text-sm font-medium">{prev.name}</div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/${tech.id}/${next.id}`}
                className="hover:bg-accent rounded-lg border p-3 text-right transition-colors"
              >
                <div className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                  Next <ChevronRight className="h-3 w-3" />
                </div>
                <div className="font-mono text-sm font-medium">{next.name}</div>
              </Link>
            )}
          </nav>
          <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a
              href={editOnGitHubUrl(tech.id)}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit on GitHub
            </a>
            <a
              href={newIssueUrl("bug-report.md", `Incorrect info: ${tech.name} ${cmd.name}`)}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Report a problem
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
}
