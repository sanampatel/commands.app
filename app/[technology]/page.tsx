import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Pencil } from "lucide-react";
import { getCommandsByTechnology, getTechnology, technologies } from "@/data";
import { CommandSearch } from "@/components/command-search";
import { TechIcon } from "@/components/tech-icon";
import { editOnGitHubUrl } from "@/lib/site";

interface TechnologyPageProps {
  params: Promise<{ technology: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((tech) => ({ technology: tech.id }));
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { technology } = await params;
  const tech = getTechnology(technology);
  if (!tech) return { title: "Not Found" };

  const count = getCommandsByTechnology(tech.id).length;
  const title = `${tech.name} Commands Cheat Sheet`;
  const description = `${count} ${tech.name} commands with flags and examples. ${tech.description}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${tech.id}` },
    openGraph: { title, description, url: `/${tech.id}` },
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { technology } = await params;
  const tech = getTechnology(technology);
  if (!tech) notFound();

  const commands = getCommandsByTechnology(tech.id);

  return (
    <div className="container py-8 md:py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-muted-foreground flex items-center gap-1 text-sm">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground" aria-current="page">
            {tech.name}
          </span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <TechIcon name={tech.id} className="h-14 w-14 sm:h-16 sm:w-16" />
          <div className="flex-1 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tech.name} Commands</h1>
            <p className="text-muted-foreground text-lg">{tech.description}</p>
          </div>
          <a
            href={editOnGitHubUrl(tech.id)}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start text-sm sm:self-center"
          >
            <Pencil className="h-3.5 w-3.5" /> Improve this page
          </a>
        </header>

        <CommandSearch commands={commands} technologyId={tech.id} technologyName={tech.name} />
      </div>
    </div>
  );
}
